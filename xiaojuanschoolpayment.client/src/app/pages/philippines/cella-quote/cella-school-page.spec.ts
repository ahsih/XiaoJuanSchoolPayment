import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { CellaPremiumSchoolComponent } from '../cella-premium-school/cella-premium-school.component';
import { CellaUniSpartaSchoolComponent } from '../cella-uni-sparta-school/cella-uni-sparta-school.component';
import { CELLA_COURSES, CELLA_ROOMS } from './cella-pricing';
import { CellaStudentQuote } from './cella-student-quote';

// The two CELLA campus pages on the shared Philippine school template: the page quote must equal CELLA's own
// student calculator, and each page quotes only its own campus.
describe('CELLA pages on the shared template', () => {
  const providers = () => [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ];
  const catalog = () => ({
    courses: CELLA_COURSES.map(item => ({ ...item })),
    rooms: CELLA_ROOMS.map(item => ({ ...item })),
    registrationFee: 150,
    peakSeasonWeeklyFee: 60,
  });

  beforeEach(() => TestBed.configureTestingModule({ providers: providers() }));

  describe('Uni Sparta', () => {
    let page: CellaUniSpartaSchoolComponent;
    beforeEach(() => {
      page = TestBed.runInInjectionContext(() => new CellaUniSpartaSchoolComponent());
      page.selectedCourseId = 'uni-power-speaking-1';
      page.selectedRoomId = 'uni-quad';
      page.selectedStartDate = '2026-08-30';
      page.selectedWeeks = 4;
    });
    const payment = (label: string) => page.schoolPaymentItems.find(row => row.label.includes(label));

    it('equals CELLA’s own calculator for the low-season four-week plan', () => {
      // 150 registration + 930 + 770 − 100 low-season offer
      expect(page.quote.quoteUsd).toBe(1750);
      const own = new CellaStudentQuote(catalog(), 'uni');
      own.courseId = 'uni-power-speaking-1';
      own.roomId = 'uni-quad';
      own.weeks = 4;
      own.startDate = '2026-08-30';
      expect(page.quote.quoteUsd).toBe(own.schoolTotal);
      expect(payment('淡季优惠')?.amount).toContain('100');
      expect(page.quoteImageData.headingText).toBe('CELLA Uni 4周报价');
      expect(page.quoteImageData.layoutVersion).toBe(2);
    });

    it('offers only Uni courses and rooms, grouped by occupancy', () => {
      expect(page.courseFees.every(course => course.id.startsWith('uni-'))).toBeTrue();
      expect(page.roomFees.every(room => room.id.startsWith('uni-'))).toBeTrue();
      expect(page.roomRateGroups.map(group => group.title)).toEqual(['单人间', '多人间']);
    });

    it('charges the 2027 summer surcharge once per overlapping week', () => {
      page.selectedStartDate = '2027-07-04';
      page.selectedWeeks = 4;
      expect(page.students[0].seasonalSurcharge).toBe(240);
      expect(payment('暑期附加费')?.amount).toContain('240');
    });

    it('waives registration for returning students and hides the social offer for them', () => {
      const student = page.students[0];
      const promotion = student.extraChoices[0];
      expect(promotion.visible).toBeTrue();
      student.returningStudent = true;
      expect(student.registration).toBe(0);
      expect(promotion.visible).toBeFalse();
      expect(page.quote.quoteUsd).toBe(1600);
    });

    it('prices the 6+2 offer as 6 paid weeks of course and quad room', () => {
      const student = page.students[0];
      page.selectedStartDate = '2027-03-07';
      page.selectedWeeks = 8;
      student.extraChoices[0].value = 'social-6-plus-2';
      expect(student.quoteError).toBe('');
      // 150 + 8 weeks (3,400) − (8 weeks − 6 paid weeks priced 4 weeks + 2 at 65%: 3,400 − 2,805 = 595)
      expect(page.quote.quoteUsd).toBe(2955);
      expect(student.extraChoices[0].note).toContain('小红书');
    });

    it('shows the minor fee choice only for students under 18', () => {
      const student = page.students[0];
      const minor = student.extraChoices[1];
      expect(minor.visible).toBeFalse();
      student.selectedAgeGroup = 'minor';
      expect(minor.visible).toBeTrue();
      minor.value = true;
      expect(page.quote.quoteUsd).toBe(1850);
    });
  });

  describe('Premium', () => {
    let page: CellaPremiumSchoolComponent;
    beforeEach(() => {
      page = TestBed.runInInjectionContext(() => new CellaPremiumSchoolComponent());
    });

    it('offers only Premium courses and rooms, without the family packages', () => {
      expect(page.courseFees.length).toBe(8);
      expect(page.courseFees.every(course => course.id.startsWith('premium-'))).toBeTrue();
      expect(page.courseFees.some(course => /family/i.test(course.id))).toBeFalse();
      expect(page.students[0].quotePlan.options('course').some(option => /family/i.test(option.id))).toBeFalse();
      expect(page.roomRateGroups.map(group => group.title)).toEqual(['单人间', '多人间']);
    });

    it('equals CELLA’s own calculator for the 2027 six-person offer', () => {
      page.selectedCourseId = 'premium-light-esl';
      page.selectedRoomId = 'premium-six';
      page.selectedStartDate = '2027-03-07';
      page.selectedWeeks = 4;
      const own = new CellaStudentQuote(catalog(), 'premium');
      own.courseId = 'premium-light-esl';
      own.roomId = 'premium-six';
      own.weeks = 4;
      own.startDate = '2027-03-07';
      expect(page.quote.quoteUsd).toBe(own.schoolTotal);
      expect(page.quoteImageData.headingText).toBe('CELLA Premium 4周报价');
    });
  });
});
