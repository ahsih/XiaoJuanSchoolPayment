import { TestBed } from '@angular/core/testing';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { CiaSchoolComponent } from './cia-school.component';

describe('CIA IAU registration fee note', () => {
  let component: CiaSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    ] });
    component = TestBed.runInInjectionContext(() => new CiaSchoolComponent());
  });

  it('only shows the extra fee for College Immersion, including after switching away', () => {
    for (const course of component.courseFees) {
      component.selectedCourseId = course.id;
      if (course.id === 'college-immersion') {
        expect(component.iauRegistrationFeeNote).toContain('IAU一次性注册费50美元另计');
        expect(component.quoteImageData.totalNote).toContain(component.iauRegistrationFeeNote);
      } else {
        expect(component.iauRegistrationFeeNote).toBe('');
        expect(component.quoteImageData.totalNote).not.toContain('IAU');
      }
    }
    component.selectedCourseId = 'regular-esl';
    expect(component.quoteImageData.totalNote).not.toContain('IAU');
  });

  it('keeps the fee one-time and clearly excluded without changing the existing total', () => {
    component.selectedCourseId = 'college-immersion';
    for (const weeks of [4, 8, 12, 24]) {
      component.selectedWeeks = weeks;
      expect(component.iauRegistrationFeeNote).toBe('IAU一次性注册费50美元另计（未计入上述合计）。');
      expect(component.quoteUsd).toBeCloseTo(Math.max(0,
        component.payableRegistrationFee + component.tuitionForSelectedWeeks + component.roomFeeForSelectedWeeks
        + component.seasonalSurcharge - component.sidaDiscountAmount - component.christmasDiscountAmount));
      expect(component.quoteImageData.totalNote).toContain(component.iauRegistrationFeeNote);
    }
  });

  it('draws the complete note beside the total in the generated PNG', async () => {
    component.selectedCourseId = 'college-immersion';
    const renderer = new QuoteImageDownloadButtonComponent();
    renderer.quote = component.quoteImageData;
    const drawnText = spyOn(CanvasRenderingContext2D.prototype, 'fillText').and.callThrough();
    const blob = await renderer['createQuoteImageBlob'](1);
    const noteDraw = drawnText.calls.allArgs().find(args => String(args[0]).includes('IAU一次性注册费'));
    expect(noteDraw).toBeDefined();
    expect(noteDraw?.[0]).toBe(component.iauRegistrationFeeNote);
    expect(noteDraw?.[2]).toBeLessThan(734); // Above the separate local-fee section.
    expect(blob.type).toBe('image/png');
    const context = document.createElement('canvas').getContext('2d')!;
    context.font = '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    expect(context.measureText(component.iauRegistrationFeeNote).width).toBeLessThanOrEqual(530);
  }, 30000);
});
