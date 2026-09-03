import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CgBaniladSchoolComponent } from '../pages/philippines/cg-banilad-school/cg-banilad-school.component';
import { QuoteImageDownloadButtonComponent } from './quote-image-download-button.component';

describe('one, three and four course quote image comparison', () => {
  it('exports three full quotes at identical width and a payment-table comparison', async () => {
    TestBed.configureTestingModule({ providers: [
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    const scenarios = [
      [{ course: 'general-esl', weeks: 16 }],
      [{ course: 'general-esl', weeks: 8 }, { course: 'premier-semi-sparta', weeks: 4 }, { course: 'business', weeks: 4 }],
      [{ course: 'general-esl', weeks: 4 }, { course: 'intensive-esl', weeks: 4 }, { course: 'premier-semi-sparta', weeks: 4 }, { course: 'business', weeks: 4 }],
    ];
    const previews: { bitmap: ImageBitmap; paymentBottom: number; count: number; label: string }[] = [];
    const save = async (name: string, blob: Blob) => {
      const response = await fetch(`/quote-comparison/${name}.png`, { method: 'POST', body: blob });
      expect(response.ok).toBeTrue();
    };
    for (const scenario of scenarios) {
      const school = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
      // Fixed example rates reproduce the same reference convention as the approved preview.
      school.usdToCny = 14984 / 2230;
      school.phpPerCny = 23300 / 2504;
      let start = Date.parse('2026-09-06T00:00:00Z');
      school.quotePlan.courses = scenario.map((part, index) => {
        const row = { id: index + 10, optionId: part.course, weeks: part.weeks, startDate: new Date(start).toISOString().slice(0, 10) };
        start += part.weeks * 7 * 86400000;
        return row;
      });
      school.quotePlan.rooms = [{ id: 2, optionId: 'quad', weeks: 16, startDate: '2026-09-06' }];
      expect(school.quotePlan.error).toBe('');
      expect(school.quotePlan.warning).toBe('');
      expect(school.quotePlan.courseWeeks).toBe(16);
      const renderer = new QuoteImageDownloadButtonComponent();
      renderer.quote = school.quoteImageData;
      const rows = renderer.quote.paymentItems.filter(row => row.detailTitle);
      expect(rows.length).toBe(scenario.length + 1);
      expect(rows.at(-1)!.label).toBe('住宿费');
      expect(rows[0].label).toBe(scenario.length === 1 ? '课程费' : '课程费1');
      const context = document.createElement('canvas').getContext('2d')!;
      const layout = renderer['measureFullFeeLayout'](context);
      layout.paymentHeights.forEach((height, index) => {
        expect(height).toBeGreaterThanOrEqual(layout.paymentProjects[index].reduce((sum, line) => sum + line.lineHeight, 0) + 18);
        expect(height).toBeGreaterThanOrEqual(layout.paymentDetails[index].reduce((sum, line) => sum + line.lineHeight, 0) + 18);
      });
      const blob = await renderer['createQuoteImageBlob'](2);
      const bitmap = await createImageBitmap(blob);
      expect(bitmap.width).toBe(2064);
      expect(bitmap.height).toBe(2 * (1764 + layout.paymentExtra + layout.localExtra + layout.notesExtra));
      expect(layout.importantNotes.join('')).not.toContain('85%');
      await save(`courses-${scenario.length}`, blob);
      previews.push({ bitmap, paymentBottom: 734 + layout.paymentExtra, count: scenario.length, label: scenario.map(part => part.weeks).join('＋') + '周' });
    }
    expect(previews[0].bitmap.height).toBeLessThan(previews[1].bitmap.height);
    expect(previews[1].bitmap.height).toBeLessThan(previews[2].bitmap.height);
    const board = document.createElement('canvas');
    const columnWidth = 688;
    const factor = columnWidth / 1032;
    board.width = 2160;
    board.height = Math.ceil(Math.max(...previews.map(preview => preview.paymentBottom)) * factor) + 104;
    const context = board.getContext('2d')!;
    context.fillStyle = '#edf3f0';
    context.fillRect(0, 0, board.width, board.height);
    previews.forEach((preview, index) => {
      const x = 24 + index * 712;
      context.fillStyle = '#06422e';
      context.font = '700 26px "Microsoft YaHei", Arial, sans-serif';
      context.fillText(`${preview.count}段课程`, x + 12, 38);
      context.fillStyle = '#475569';
      context.font = '400 18px "Microsoft YaHei", Arial, sans-serif';
      context.fillText(`${preview.label} · 同为16周住宿`, x + 12, 66);
      context.drawImage(preview.bitmap, 0, 0, 2064, preview.paymentBottom * 2, x, 82, columnWidth, preview.paymentBottom * factor);
    });
    const overview = await new Promise<Blob>(resolve => board.toBlob(blob => resolve(blob!), 'image/png'));
    await save('overview', overview);
    previews.forEach(preview => preview.bitmap.close());
  }, 60000);
});
