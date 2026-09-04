import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { SchoolService } from '../../services/school.service';
import { CiaSchoolComponent } from '../pages/philippines/cia-school/cia-school.component';
import { QuoteImageDownloadButtonComponent } from './quote-image-download-button.component';
import { QuoteImagePreviewComponent } from './quote-image-preview.component';
import { downloadQuoteBlob, encodeQuoteCanvas, loadQuoteImage, quoteBlobDataUrl,
  quoteCanvasScale, quoteImageEnvironment, validateQuoteBlob } from './quote-image-export';

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aS1sAAAAASUVORK5CYII=';
const pngBlob = () => new Blob([Uint8Array.from(atob(png.split(',')[1]), ch => ch.charCodeAt(0))], { type: 'image/png' });
const wechatUA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Mobile MicroMessenger/8.0';
const iphoneUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1';

describe('mobile quote export', () => {
  function renderer() {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const school = TestBed.runInInjectionContext(() => new CiaSchoolComponent());
    const component = new QuoteImageDownloadButtonComponent();
    component.quote = school.quoteImageData;
    return component;
  }

  for (const agent of [wechatUA, iphoneUA, `${iphoneUA} MicroMessenger/8.0`, 'Mozilla/5.0 (iPad; CPU OS 17_0)', 'Mozilla/5.0 Android 14']) {
    it(`previews instead of triggering a download in ${agent}`, async () => {
      spyOnProperty(navigator, 'userAgent').and.returnValue(agent);
      const component = renderer();
      spyOn<any>(component, 'createQuoteImageBlob').and.resolveTo(pngBlob());
      const download = spyOn(HTMLAnchorElement.prototype, 'click');
      await component.saveQuoteImage();
      expect(component['isPreviewOpen']).toBeTrue();
      expect(component['previewSrc']).toBe(png);
      expect(download).not.toHaveBeenCalled();
      expect(component['previewFile']?.size).toBeGreaterThan(0);
      component.ngOnDestroy();
      expect(component['previewSrc']).toBe('');
      expect(component['previewFile']).toBeUndefined();
    });
  }

  it('recognizes iPadOS desktop user agents without treating a desktop Mac as mobile', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    spyOnProperty(navigator, 'userAgent').and.returnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)');
    const touch = spyOnProperty(navigator, 'maxTouchPoints').and.returnValue(5);
    expect(quoteImageEnvironment().mobile).toBeTrue();
    touch.and.returnValue(0);
    expect(quoteImageEnvironment().mobile).toBeFalse();
  });

  it('bounds phone canvas dimensions and memory regardless of device pixel ratio or row count', () => {
    for (const height of [1764, 2400, 4000, 12000]) {
      const scale = quoteCanvasScale(1032, height, 3, true);
      expect(Math.floor(height * scale)).toBeLessThanOrEqual(4096);
      expect(Math.floor(1032 * scale) * Math.floor(height * scale)).toBeLessThanOrEqual(6_000_000);
      expect(scale).toBeGreaterThan(0);
    }
    expect(quoteCanvasScale(1032, 2000, 2, false)).toBe(2);
  });

  it('rejects empty, wrong-type and corrupt images before any download', async () => {
    await expectAsync(validateQuoteBlob(new Blob([], { type: 'image/png' }))).toBeRejected();
    await expectAsync(validateQuoteBlob(new Blob(['not a png'], { type: 'text/plain' }))).toBeRejected();
    await expectAsync(validateQuoteBlob(new Blob(['not a png'], { type: 'image/png' }))).toBeRejected();
    await expectAsync(validateQuoteBlob(pngBlob())).toBeResolved();
  });

  it('checks canvas encoder null and zero-byte results', async () => {
    const canvas = document.createElement('canvas');
    const encode = spyOn(canvas, 'toBlob').and.callFake(callback => callback(null));
    await expectAsync(encodeQuoteCanvas(canvas)).toBeRejected();
    encode.and.callFake(callback => callback(new Blob([], { type: 'image/png' })));
    await expectAsync(encodeQuoteCanvas(canvas)).toBeRejected();
  });

  it('times out encoders that never call back', fakeAsync(() => {
    const canvas = document.createElement('canvas');
    spyOn(canvas, 'toBlob');
    let failed = false;
    void encodeQuoteCanvas(canvas, 20).catch(() => failed = true);
    tick(20);
    expect(failed).toBeTrue();
  }));

  it('times out stalled image loads and clears handlers', fakeAsync(() => {
    const image = new Image();
    spyOn(window, 'Image').and.returnValue(image);
    spyOnProperty(image, 'src', 'set').and.stub();
    let failed = false;
    void loadQuoteImage('/stalled.png', 20).catch(() => failed = true);
    tick(20);
    expect(failed).toBeTrue();
    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
  }));

  it('retains desktop download URLs for 60 seconds, not just one event loop', fakeAsync(() => {
    const revoke = spyOn(URL, 'revokeObjectURL');
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    const create = spyOn(URL, 'createObjectURL').and.returnValue('blob:quote-test');
    downloadQuoteBlob(pngBlob(), 'CIA4周报价.png');
    expect(click).toHaveBeenCalledTimes(1);
    tick(1);
    expect(revoke).not.toHaveBeenCalled();
    tick(59999);
    expect(revoke).toHaveBeenCalledOnceWith('blob:quote-test');
    expect(create).toHaveBeenCalledTimes(1);
    expect(document.querySelector('a[download="CIA4周报价.png"]')).toBeNull();
  }));

  it('ignores duplicate taps and does not reopen after closing during generation', async () => {
    spyOnProperty(navigator, 'userAgent').and.returnValue(wechatUA);
    const component = renderer();
    let finish!: (blob: Blob) => void;
    const encode = spyOn<any>(component, 'createQuoteImageBlob').and.returnValue(new Promise<Blob>(resolve => finish = resolve));
    const save = component.saveQuoteImage();
    await component.saveQuoteImage();
    component['closeImagePreview']();
    finish(pngBlob());
    await save;
    expect(encode).toHaveBeenCalledTimes(1);
    expect(component['isPreviewOpen']).toBeFalse();
    expect(component['previewSrc']).toBe('');
    expect(component['isSaving']).toBeFalse();
  });

  it('keeps an actionable error and allows retry without downloading an empty file', async () => {
    spyOnProperty(navigator, 'userAgent').and.returnValue(wechatUA);
    spyOn(console, 'error');
    const component = renderer();
    const encode = spyOn<any>(component, 'createQuoteImageBlob').and.rejectWith(new Error('failed'));
    await component.saveQuoteImage();
    expect(component['isPreviewOpen']).toBeTrue();
    expect(component['saveError']).toContain('重新生成');
    expect(component['isSaving']).toBeFalse();
    encode.and.resolveTo(pngBlob());
    await component.saveQuoteImage();
    expect(component['saveError']).toBe('');
    expect(component['previewSrc']).toBe(png);
  });

  it('opens the native share sheet only from the explicit share action, preserving cancellation', async () => {
    spyOnProperty(navigator, 'userAgent').and.returnValue(iphoneUA);
    const originalShare = Object.getOwnPropertyDescriptor(navigator, 'share');
    const originalCanShare = Object.getOwnPropertyDescriptor(navigator, 'canShare');
    const share = jasmine.createSpy('share').and.rejectWith(new DOMException('Cancelled', 'AbortError'));
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => true });
    try {
      const component = renderer();
      spyOn<any>(component, 'createQuoteImageBlob').and.resolveTo(pngBlob());
      await component.saveQuoteImage();
      expect(share).not.toHaveBeenCalled();
      await component['shareImagePreview']();
      expect(share).toHaveBeenCalledTimes(1);
      expect(component['saveError']).toBe('');
      expect(component['previewSrc']).toBe(png);
    } finally {
      if (originalShare) Object.defineProperty(navigator, 'share', originalShare); else delete (navigator as { share?: unknown }).share;
      if (originalCanShare) Object.defineProperty(navigator, 'canShare', originalCanShare); else delete (navigator as { canShare?: unknown }).canShare;
    }
  });

  it('renders a real long CIA quote, retries a failed encoding at lower resolution and releases canvases', async () => {
    spyOnProperty(navigator, 'userAgent').and.returnValue(iphoneUA);
    const component = renderer();
    component.quote.paymentItems.push(...component.quote.paymentItems.slice(1, 3), ...component.quote.paymentItems.slice(1, 3));
    const before = JSON.stringify(component.quote);
    const loaded = spyOn<any>(component, 'loadCanvasImage').and.callThrough();
    const original = HTMLCanvasElement.prototype.toBlob;
    const sizes: { width: number; height: number; canvas: HTMLCanvasElement }[] = [];
    spyOn(HTMLCanvasElement.prototype, 'toBlob').and.callFake(function(this: HTMLCanvasElement, callback, type) {
      sizes.push({ width: this.width, height: this.height, canvas: this });
      if (sizes.length === 1) callback(null);
      else original.call(this, callback, type);
    });
    const text = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await component['createQuoteImageBlob']();
    expect(blob.size).toBeGreaterThan(50_000);
    expect(sizes.length).toBe(2);
    expect(sizes[1].width).toBeLessThan(sizes[0].width);
    expect(sizes.every(size => size.height <= 4096 && size.width * size.height <= 6_000_000)).toBeTrue();
    expect(sizes.every(size => size.canvas.width === 1 && size.canvas.height === 1)).toBeTrue();
    expect(text.calls.allArgs().some(args => String(args[0]).includes('报价说明'))).toBeTrue();
    expect(loaded.calls.count()).toBe(2); // Detailed images only use the logo and school hero.
    expect(JSON.stringify(component.quote)).toBe(before);
    const src = await quoteBlobDataUrl(blob);
    const image = await loadQuoteImage(src);
    expect(image.naturalWidth).toBe(sizes[1].width);
    expect(image.naturalHeight).toBe(sizes[1].height);
  }, 30000);

  it('shows a real img with long-press enabled and no download button in WeChat', async () => {
    await TestBed.configureTestingModule({ imports: [QuoteImagePreviewComponent] }).compileComponents();
    const fixture = TestBed.createComponent(QuoteImagePreviewComponent);
    fixture.componentInstance.src = png;
    fixture.componentInstance.wechat = true;
    fixture.componentInstance.canShare = true;
    fixture.detectChanges();
    expect(document.documentElement.style.overflow).toBe('hidden');
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('img')?.src).toBe(png);
    expect(element.textContent).toContain('长按下方图片');
    expect(element.textContent).not.toContain('下载图片');
    expect(element.textContent).not.toContain('保存 / 分享图片');
    expect(getComputedStyle(element.querySelector('img')!).pointerEvents).not.toBe('none');
    const close = spyOn(fixture.componentInstance.closed, 'emit');
    element.querySelector<HTMLButtonElement>('.close')!.click();
    expect(close).toHaveBeenCalledTimes(1);
    fixture.destroy();
    expect(document.documentElement.style.overflow).not.toBe('hidden');
  });

  it('still renders standard-layout quotes with consultant images', async () => {
    const component = renderer();
    component.quote.layout = 'standard';
    const image = await loadQuoteImage(png);
    const load = spyOn<any>(component, 'loadCanvasImage').and.resolveTo(image);
    const blob = await component['createQuoteImageBlob'](1);
    expect(blob.size).toBeGreaterThan(0);
    expect(load.calls.count()).toBeGreaterThan(2);
  }, 30000);
});
