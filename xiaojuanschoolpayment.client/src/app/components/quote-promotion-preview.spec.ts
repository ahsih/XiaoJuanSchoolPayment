import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { SchoolService } from '../../services/school.service';
import { CpilsSchoolDetailComponent } from '../pages/philippines/cpils-school/cpils-school-detail.component';
import { QuoteImageDownloadButtonComponent } from './quote-image-download-button.component';

// Capture the approved production styling without modifying the canvas output.
describe('CPILS promotion color proposal', () => {
  it('renders a complete eight-week quote with amount-only promotion emphasis', async () => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const school = TestBed.runInInjectionContext(() => new CpilsSchoolDetailComponent());
    school.quotePlan.add('course');
    school.quotePlan.add('room');
    school.quotePlan.rooms[1].optionId = 'no-window-twin';
    school.usdToCny = 20093 / 2990.5;
    school.phpPerCny = 35630 / 3830;
    expect(school.quoteUsd).toBe(2990.5);
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = school.quoteImageData;
    const layout = renderer['measureFullFeeLayout'](document.createElement('canvas').getContext('2d')!);
    let top = 298;
    const promoBands: { top: number; bottom: number }[] = [];
    renderer.quote.paymentItems.forEach((row, index) => {
      const bottom = top + layout.paymentHeights[index];
      if (['思达折扣', '淡季入学优惠', '无对外窗房优惠'].includes(row.label)) promoBands.push({ top, bottom });
      top = bottom;
    });
    expect(promoBands.length).toBe(3);
    const original = CanvasRenderingContext2D.prototype.fillText;
    const seen: { x: number; color: string }[] = [];
    spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function (
      this: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth?: number,
    ) {
      if (promoBands.some(band => y > band.top && y < band.bottom)) {
        seen.push({ x, color: String(this.fillStyle) });
      }
      if (maxWidth === undefined) original.call(this, text, x, y);
      else original.call(this, text, x, y, maxWidth);
    });
    const blob = await renderer['createQuoteImageBlob'](2);
    const bitmap = await createImageBitmap(blob);
    expect(bitmap.width).toBe(2064);
    expect(bitmap.height).toBe(2 * (1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra));
    expect(seen.filter(item => item.x === 546 && item.color === '#f25518').length).toBe(3);
    expect(seen.filter(item => item.x === 136 && item.color === '#14233e').length).toBe(3);
    expect(seen.filter(item => item.x === 566).every(item => item.color === '#475569')).toBeTrue();
    const args = (window as unknown as { __karma__?: { config?: { args?: string[] } } }).__karma__?.config?.args ?? [];
    if (args.includes('capture-promotion-preview')) {
      const response = await fetch('/promotion-preview.png', { method: 'POST', body: blob });
      expect(response.ok).toBeTrue();
    }
    bitmap.close();
  }, 60000);
});
