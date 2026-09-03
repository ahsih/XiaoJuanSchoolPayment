import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CgBaniladSchoolComponent } from '../pages/philippines/cg-banilad-school/cg-banilad-school.component';
import { QuoteImageDownloadButtonComponent } from './quote-image-download-button.component';

describe('quote image visual hierarchy', () => {
  function rendererForEightWeeks() {
    TestBed.configureTestingModule({ providers: [
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const component = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
    // Reproduce the user's reference quote totals, independent of live exchange-rate requests.
    component.usdToCny = 14984 / 2230;
    component.phpPerCny = 23300 / 2504;
    component.quotePlan.add('course');
    component.quotePlan.add('room');
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    return renderer;
  }

  it('places names in the project column and reserves orange bars for highlights', async () => {
    const renderer = rendererForEightWeeks();
    const paint: { text: string; x: number; align: string; font: string; color: string | CanvasGradient | CanvasPattern }[] = [];
    const rectangles: { x: number; y: number; width: number; color: string | CanvasGradient | CanvasPattern }[] = [];
    const originalText = CanvasRenderingContext2D.prototype.fillText;
    const originalRect = CanvasRenderingContext2D.prototype.fillRect;
    spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callFake(function(this: CanvasRenderingContext2D, text, x, y) {
      paint.push({ text, x, align: this.textAlign, font: this.font, color: this.fillStyle });
      originalText.call(this, text, x, y);
    });
    spyOn(CanvasRenderingContext2D.prototype, 'fillRect').and.callFake(function(this: CanvasRenderingContext2D, x, y, width, height) {
      rectangles.push({ x, y, width, color: this.fillStyle });
      originalRect.call(this, x, y, width, height);
    });
    const blob = await renderer['createQuoteImageBlob'](2);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(50_000);
    for (const row of renderer.quote.paymentItems.filter(row => row.detailTitle)) {
      expect(paint.some(item => item.text === row.detailTitle && item.x === 136)).toBeTrue();
      expect(paint.some(item => item.text === row.detailTitle && item.x === 566)).toBeFalse();
    }
    expect(rectangles.some(item => item.x === 36 && item.y === 780 && item.width === 4 && item.color === '#f25518')).toBeFalse();
    expect(rectangles.some(item => item.x === 36 && item.width === 5 && item.color === '#f25518')).toBeTrue();
    for (const fee of renderer.quote.optionalFeeItems ?? []) {
      expect(paint.some(item => item.text === fee.amount && item.x === 546 && item.align === 'right' && item.color === '#14233e')).toBeTrue();
    }
    for (const row of renderer.quote.paymentItems) {
      expect(paint.some(item => item.text === row.amount && item.x === 546 && item.align === 'right')).toBeTrue();
    }
    for (const row of renderer.quote.localFeeItems ?? []) {
      expect(paint.some(item => item.text === row.amount && item.x === 546 && item.align === 'right')).toBeTrue();
    }
    expect(paint.filter(item => item.text.includes('人民币金额按参考汇率估算')).length).toBe(1);
    expect(paint.filter(item => item.text.includes('最终以学校价格、空房及优惠确认为准')).length).toBe(1);
    expect(paint.some(item => item.text.includes('按实时汇率预估，实际以到校缴费为准'))).toBeFalse();
    expect(paint.filter(item => item.x === 566 && !item.text.startsWith('人民币预计金额')).every(item => !/bold|[56789]00/.test(item.font))).toBeTrue();
    expect(paint.some(item => item.text === '学校费用明细')).toBeTrue();
    expect(paint.some(item => item.text.includes('到校前支付给学校'))).toBeFalse();
    expect(renderer['detailedGrid'].noteBoundary).toBe(556);
    const context = document.createElement('canvas').getContext('2d')!;
    const layout = renderer['measureFullFeeLayout'](context);
    expect(layout.paymentHeights[1]).toBeLessThan(84);
    expect(layout.footerHeight).toBeLessThan(106);
    expect(layout.serviceHeight).toBeLessThan(174);
    expect(layout.importantNotes.some(note => note.includes('85%') || note.includes('不一致'))).toBeFalse();
    const bitmap = await createImageBitmap(blob);
    expect(bitmap.height).toBe((1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra) * 2);
    bitmap.close();
  }, 30000);

  it('expands the project cell for long names without repeating them in the notes', () => {
    const renderer = rendererForEightWeeks();
    const row = renderer.quote.paymentItems[1];
    row.detailTitle = '雅思保证班 IELTS GUARANTEE 高强度英语课程';
    const context = document.createElement('canvas').getContext('2d')!;
    const layout = renderer['measureFullFeeLayout'](context);
    expect(layout.paymentProjects[1].map(line => line.text).join('').replace(/\s/g, '')).toBe((row.label + row.detailTitle).replace(/\s/g, ''));
    expect(layout.paymentDetails[1].map(line => line.text).join('')).not.toContain('IELTS');
    expect(layout.paymentHeights[1]).toBeGreaterThanOrEqual(layout.paymentProjects[1].reduce((sum, line) => sum + line.lineHeight, 0) + 18);
  });

  it('keeps applicable rules and prioritizes date mismatches without duplicate generic notes', () => {
    const renderer = rendererForEightWeeks();
    const mismatch = '课程与住宿日期不完全一致，请核对入住安排。';
    renderer.quote.importantNotes = ['3周课程或住宿按对应4周价格的85%计费。', '最终以学校价格、空房及优惠确认为准。', mismatch, mismatch];
    const notes = renderer['quoteFooterNotes']();
    expect(notes[0]).toBe(mismatch);
    expect(notes.filter(note => note === mismatch).length).toBe(1);
    expect(notes.join('')).toContain('85%');
    expect(renderer['withoutExchangeNote']('IAU一次性注册费50美元另计（未计入上述合计）。 人民币按参考汇率预估。')).toBe('IAU一次性注册费50美元另计（未计入上述合计）。');
    expect(renderer['withoutExchangeNote']('人民币额外费用需另付。')).toBe('人民币额外费用需另付。');
    const context = document.createElement('canvas').getContext('2d')!;
    const shortHeight = renderer['measureFullFeeLayout'](context).footerHeight;
    renderer.quote.importantNotes.push('适用的课程条件说明。'.repeat(30));
    expect(renderer['measureFullFeeLayout'](context).footerHeight).toBeGreaterThan(shortHeight);
  });

  it('keeps course-name parentheses with their text when wrapping', () => {
    const renderer = rendererForEightWeeks();
    const context = document.createElement('canvas').getContext('2d')!;
    context.font = '750 15px "Microsoft YaHei", Arial, sans-serif';
    for (const title of ['ESL常规（KET/PET/FCE）', 'College Immersion（IAU大学沉浸）']) {
      const lines = renderer['wrapCanvasText'](context, title, 170, 1000);
      expect(lines.join('')).toBe(title);
      expect(lines.every(line => !/^[）)]/.test(line) && !/[（(]$/.test(line))).toBeTrue();
    }
  });
});
