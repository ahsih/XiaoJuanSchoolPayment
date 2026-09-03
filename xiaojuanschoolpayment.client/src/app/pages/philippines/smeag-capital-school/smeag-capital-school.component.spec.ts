import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SmeagCapitalSchoolComponent } from './smeag-capital-school.component';

describe('SMEAG Capital textbook estimates', () => {
  let component: SmeagCapitalSchoolComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    component = TestBed.runInInjectionContext(() => new SmeagCapitalSchoolComponent());
  });

  it('includes one textbook set exactly once in the local total, not the school payment', () => {
    expect(component.includedLocalFees.filter(fee => fee.item === '教材费').length).toBe(1);
    expect(component.excludedLocalFees.map(fee => fee.item)).toEqual(['宿务马克坦机场接机（可选）', '押金（可退）']);
    expect(component.localFeesTotal).toBe(18400);
    expect(component.quoteImageData.localFeeAmount).toBe('18,400 比索');
    expect(component.quoteUsd).toBe(1458);
  });

  it('preserves each course-specific textbook price', () => {
    for (const [courseId, expected] of [
      ['esl-regular-ket-pet-fce', 700], ['speaking-master-ket-pet-fce', 1500],
      ['children', 2500], ['toeic-pre', 1300], ['business', 400],
      ['toefl-ielts-pre', 2500],
    ] as const) {
      component.selectedCourseId = courseId;
      const textbook = component.includedLocalFees.find(fee => fee.item === '教材费')!;
      expect(textbook.total).withContext(courseId).toBe(expected);
      expect(component.localFeesTotal).toBe(17700 + expected);
      expect(textbook.note).toContain(component.textbookUsageNote);
      expect(component.quoteImageData.localFeeItems?.find(fee => fee.label === '教材费')?.note).toBe(textbook.note);
    }
    expect(component.textbookFeeNote).toContain('雅思 IELTS');
  });

  it('lists all seven source prices separately but only the selected textbook in the quote row', () => {
    expect(component.textbookPrices.map(({ id, price }) => [id, price])).toEqual([
      ['family', 2500], ['toefl', 1500], ['toeic', 1300], ['business', 400],
      ['esl', 700], ['ielts', 2500], ['speaking', 1500],
    ]);
    for (const course of component.courseFees) {
      component.selectedCourseId = course.id;
      expect(component.textbookFeeNote).toBe(`${component.selectedTextbook.label}；${component.textbookUsageNote}`);
      expect(component.textbookFeeNote.length).toBeLessThan(70);
      const quoteNote = component.quoteImageData.localFeeItems?.find(fee => fee.label === '教材费')?.note!;
      for (const other of component.textbookPrices.filter(item => item.id !== component.selectedTextbook.id)) {
        expect(quoteNote).not.toContain(other.label);
      }
    }
  });

  it('uses the chosen exam textbook for both combined courses and recalculates totals', () => {
    expect(component.needsExamTextbookChoice).toBeFalse();
    for (const courseId of ['toefl-ielts-pre', 'toefl-ielts-regular-guarantee']) {
      component.selectedCourseId = courseId;
      expect(component.needsExamTextbookChoice).toBeTrue();
      for (const [exam, amount, label] of [['ielts', 2500, '雅思 IELTS'], ['toefl', 1500, '托福 TOEFL']] as const) {
        component.selectedExamTextbook = exam;
        expect(component.textbookFee).toBe(amount);
        expect(component.textbookFeeNote).toContain(label);
        expect(component.localFeesTotal).toBe(17700 + amount);
        expect(component.quoteImageData.localFeeAmount).toBe(component.formatPhp(17700 + amount));
        expect(component.quoteImageData.localFeeItems?.find(fee => fee.label === '教材费')?.amount).toBe(component.formatPhp(amount));
      }
    }
    component.selectedCourseId = 'esl-regular-ket-pet-fce';
    expect(component.needsExamTextbookChoice).toBeFalse();
    expect(component.textbookFee).toBe(700);
    expect(component.textbookFeeNote).not.toContain('托福');
  });

  it('clearly estimates the first set across durations without inventing a fixed repurchase cycle', () => {
    for (const weeks of component.weekOptions) {
      component.selectedWeeks = weeks;
      const textbook = component.includedLocalFees.find(fee => fee.item === '教材费')!;
      expect(textbook.quantity).toBe(1);
      expect(textbook.total).toBe(700);
      expect(textbook.note).toContain('4–6周');
      expect(textbook.note).toContain('依学习进度购买');
      expect(textbook.note).toContain('先计1套');
      expect(textbook.note).toContain('后续按实另计');
      expect(component.quoteImageData.localFeeItems?.reduce((sum, fee) => sum + Number(fee.amount.replace(/[^0-9.]/g, '')), 0)).toBe(component.localFeesTotal);
    }
    component.selectedWeeks = 12;
    expect(component.localFeesTotal).toBe(45230);
  });

  it('shares the introduction and all fee notes between webpage and export', () => {
    const quote = component.quoteImageData;
    expect(quote.localFeeTableLayout).toBe('web');
    expect(quote.fullFeeDetails).toBeTrue();
    expect(quote.localFeeNote).toBe(component.localFeeIntro);
    expect(quote.localFeeItems).toEqual(component.includedLocalFees.map(fee => ({
      label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: component.formatPhp(fee.total), note: fee.note,
    })));
    expect(JSON.stringify(quote)).not.toMatch(/\bPHP\b|\bUSD\b|\bCNY\b/);
  });

  it('renders only the selected textbook note in the PNG without cropping the fee section', async () => {
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const canvasText = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    const text = canvasText.calls.allArgs().map(args => args[0]).join('');
    expect(text.replace(/\s/g, '')).toContain(component.textbookFeeNote.replace(/\s/g, ''));
    expect(text).toContain(component.localFeeIntro);
    expect(text).toContain('18,400 比索');
    expect(text).not.toContain('Family Program');
    expect(text).not.toContain('各课程教材价格参考');
    expect(blob.type).toBe('image/png');
    const bitmap = await createImageBitmap(blob);
    const layout = renderer['measureFullFeeLayout'](document.createElement('canvas').getContext('2d')!);
    expect(layout.localHeights.length).toBe(component.includedLocalFees.length);
    expect(820 + layout.localNoteHeight + layout.localHeights.reduce((sum, value) => sum + value, 0) + 70 + layout.optionalHeights.reduce((sum, value) => sum + value, 0))
      .toBeLessThanOrEqual(1442 + layout.localExtra - 14);
    expect(bitmap.width).toBe(1032);
    bitmap.close();
  }, 30000);
});
