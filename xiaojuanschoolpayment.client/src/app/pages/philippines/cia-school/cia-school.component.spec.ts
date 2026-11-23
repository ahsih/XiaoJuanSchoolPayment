import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { CiaSchoolComponent } from './cia-school.component';

describe('CIA IAU registration fee note', () => {
  let component: CiaSchoolComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    ] });
    component = TestBed.runInInjectionContext(() => new CiaSchoolComponent());
  });

  it('only shows the extra fee for College Immersion, including after switching away', () => {
    for (const course of component.courseFees) {
      component.selectedCourseId = course.id;
      if (course.id === 'college-immersion') {
        expect(component.iauRegistrationFeeNote).toContain('另需支付IAU一次性注册费50美元');
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
      expect(component.iauRegistrationFeeNote).toBe('另需支付IAU一次性注册费50美元（到校后付，未计入上述合计）。');
      expect(component.quoteUsd).toBeCloseTo(Math.max(0,
        component.payableRegistrationFee + component.tuitionForSelectedWeeks + component.roomFeeForSelectedWeeks
        + component.seasonalSurcharge - component.sidaDiscountAmount - component.christmasDiscountAmount));
      expect(component.quoteImageData.totalNote).toContain(component.iauRegistrationFeeNote);
    }
  });

  it('keeps the IAU course name and fit over the older database row, which only supplies the price', () => {
    const lesson = (name: string, price: number, description: string) =>
      ({ name, price, description, note: '', week: 4 }) as never;
    component['applyPricingData']([
      lesson('College Immersion', 1000, '大学校园沉浸体验；IAU一次性注册费另计50美元'),
      lesson('Regular ESL', 900, ''),
    ], [], []);
    const immersion = component.courseFees.find(course => course.id === 'college-immersion')!;
    expect(immersion.name).toBe('College Immersion 大学沉浸式课程（IAU航空航天大学旁听）');
    expect(immersion.suitable).toContain('IAU（印第安纳航空航天大学）');
    expect(immersion.tuition).toBe(1000);
    expect(component.courseFees.find(course => course.id === 'regular-esl')!.name).toBe('Regular ESL');
    expect(component.courseHighlights['college-immersion'].badge).toBe('每4周到IAU旁听至少6小时');
    expect(component.guidesForCourse('college-immersion').map(guide => guide.title)).toEqual(['IAU大学沉浸式课程']);
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
