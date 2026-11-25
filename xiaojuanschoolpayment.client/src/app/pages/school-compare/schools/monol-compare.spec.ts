import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { createDefaultCiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { cloneMonolContentConfig, createDefaultMonolContentConfig } from '../../philippines/monol-school/monol-content-config';
import { MonolSchoolDetailComponent } from '../../philippines/monol-school/monol-school-detail.component';
import { createDefaultMonolSpartaContentConfig } from '../../philippines/monol-sparta-school/monol-sparta-content-config';
import { SchoolPriceComparison, type CompareConditions, type CompareGoal } from '../school-compare';
import { createMonolCompareSource } from './monol-compare';

// The comparison must show exactly what the MONOL main-campus page quotes for the same single-student
// plan; MONOL's own calculator prices it.
describe('MONOL main campus in the cross-school comparison', () => {
  const rates = { usdToCny: 7, phpPerCny: 8.2, date: '2026-11-20', live: true };

  const createPage = () => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    const page = TestBed.runInInjectionContext(() => new MonolSchoolDetailComponent());
    page.ngOnInit();
    return page;
  };

  /** Sets the page's single quote to the same plan and conditions the comparison uses. */
  const quoteOnPage = (page: MonolSchoolDetailComponent, courseId: string, roomId: string, conditions: CompareConditions) => {
    page.setQuoteMode('single');
    const student = page.students[0];
    student.quotePlan.courses = [{ id: 1, optionId: courseId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    student.selectedRegistrationDate = conditions.registrationDate;
    student.returningStudent = false;
    student.pickupAirport = 'none';
    student.applySnsPromotion = false;
    return page;
  };

  const comparisonFor = (source = createMonolCompareSource()) => {
    const comparison = new SchoolPriceComparison(() => [source.school], () => rates);
    comparison.start(['monol']);
    return comparison;
  };

  interface Scenario {
    goal: CompareGoal; beds: number; weeks: number; start: string;
    visa: 'tourist30' | 'tourist59'; age: 'adult' | 'minor'; registration: string;
    course: string; room: string; quotable: boolean;
  }

  const scenarios: Scenario[] = [
    // No double room at MONOL: the nearest size, the cheaper triple, is chosen. Off-season offers apply.
    { goal: 'general', beds: 2, weeks: 4, start: '2027-03-07', visa: 'tourist59', age: 'adult', registration: '2026-11-20', course: 'general-esl', room: 'triple-room', quotable: true },
    // Short stay, under 18, 30-day visa.
    { goal: 'general', beds: 4, weeks: 2, start: '2026-11-29', visa: 'tourist30', age: 'minor', registration: '2026-11-20', course: 'general-esl', room: 'quad-room', quotable: true },
    { goal: 'ielts', beds: 1, weeks: 3, start: '2027-02-07', visa: 'tourist30', age: 'adult', registration: '2026-11-20', course: 'ielts', room: 'small-single-room', quotable: true },
    // 16 weeks registered in the long-stay window, Christmas arrival.
    { goal: 'ielts-guarantee', beds: 1, weeks: 16, start: '2027-01-03', visa: 'tourist59', age: 'adult', registration: '2026-11-20', course: 'ielts', room: 'small-single-room', quotable: true },
    // Peak window 2027/06/27–08/22: surcharge, and those weeks get no off-season offer.
    { goal: 'speaking', beds: 3, weeks: 8, start: '2027-07-04', visa: 'tourist59', age: 'adult', registration: '2026-11-20', course: 'general-esl', room: 'triple-room', quotable: true },
    { goal: 'toeic', beds: 1, weeks: 12, start: '2027-06-13', visa: 'tourist30', age: 'minor', registration: '2026-12-31', course: 'leap-english', room: 'small-single-room', quotable: true },
    // Registered after the offers end; 24 weeks across the peak.
    { goal: 'business', beds: 4, weeks: 24, start: '2027-05-02', visa: 'tourist30', age: 'adult', registration: '2027-01-15', course: 'leap-english', room: 'quad-room', quotable: true },
    // MONOL's calculator prices five weeks proportionally (four-week price / 4 × weeks).
    { goal: 'general', beds: 3, weeks: 5, start: '2027-03-07', visa: 'tourist59', age: 'adult', registration: '2026-11-20', course: 'general-esl', room: 'triple-room', quotable: true },
    // One week is not quotable at MONOL: the calculator's own error must show.
    { goal: 'general', beds: 4, weeks: 1, start: '2027-03-07', visa: 'tourist59', age: 'adult', registration: '2026-11-20', course: 'general-esl', room: 'quad-room', quotable: false },
  ];

  it('equals the MONOL page’s own quote for the same plan', () => {
    const page = createPage();
    for (const scenario of scenarios) {
      const comparison = comparisonFor();
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      expect(comparison.setStartDate(scenario.start)).toBeTrue();
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      comparison.conditions.registrationDate = scenario.registration;
      const label = JSON.stringify(scenario);
      expect(comparison.conditions.weeks).withContext(label).toBe(scenario.weeks);

      const selection = comparison.selections[0];
      expect(selection.plan.courseId).withContext(label).toBe(scenario.course);
      expect(selection.plan.roomId).withContext(label).toBe(scenario.room);

      const result = comparison.results[0];
      quoteOnPage(page, selection.plan.courseId, selection.plan.roomId, comparison.conditions);
      const pageStudent = page.students[0];
      expect(result.error).withContext(label).toBe(page.quoteError);
      expect(result.schoolTotal).withContext(label).toBe(page.quoteUsd);
      expect(result.tuition).withContext(label).toBe(page.tuitionForSelectedWeeks);
      expect(result.accommodation).withContext(label).toBe(page.roomFeeForSelectedWeeks);
      expect(result.surcharge).withContext(label).toBe(pageStudent.seasonalSurcharge);
      expect(result.localTotal).withContext(label).toBe(page.localFeeTotal);
      expect(result.registration).withContext(label).toBe(page.registrationFee - page.registrationDiscountAmount);

      if (!scenario.quotable) {
        expect(result.error).withContext(label).not.toBe('');
        continue;
      }
      expect(result.error).withContext(label).toBe('');
      expect(result.schoolTotal).withContext(label).toBeGreaterThan(0);
      expect(result.localTotal).withContext(label).toBeGreaterThan(0);
      // The sheet rows add up to the page's school total.
      expect(result.tuition + result.accommodation + result.registration - result.discount + result.surcharge)
        .withContext(label).toBeCloseTo(page.quoteUsd, 2);
      // Every discount on the page's payment lines (other than the registration waiver) is named.
      const pageDiscounts = pageStudent.paymentLines.filter(line => line.value < 0 && line.promotionKey !== 'registration');
      expect(result.discount).withContext(label).toBeCloseTo(-pageDiscounts.reduce((sum, line) => sum + line.value, 0), 2);
      expect(result.discountNames).withContext(label).toBe(pageDiscounts.map(line => line.label).join('、'));
    }
  });

  it('applies MONOL’s offers, peak surcharge and notes per plan', () => {
    const comparison = comparisonFor();
    const run = (goal: CompareGoal, beds: number, weeks: number, start: string, registration: string, age: 'adult' | 'minor' = 'adult') => {
      comparison.setGoal(goal);
      comparison.setBeds(beds);
      comparison.setWeeks(weeks);
      comparison.setStartDate(start);
      comparison.conditions.registrationDate = registration;
      comparison.conditions.ageGroup = age;
      return comparison.results[0];
    };

    const offSeason = run('general', 2, 4, '2027-03-07', '2026-11-20');
    expect(offSeason.registration).toBe(0);
    expect(offSeason.discount).toBe(200);
    expect(offSeason.discountNames).toBe('淡季课程优惠、淡季住宿优惠');
    expect(comparison.selections[0].roomNote).toBe('MONOL没有双人间，已选三人间');
    expect(offSeason.notes.some(note => note.startsWith('MONOL：住宿费不含餐费'))).toBeTrue();

    const longStay = run('ielts', 1, 16, '2027-01-03', '2026-11-20');
    expect(longStay.discountNames).toContain('长住优惠');
    expect(longStay.discountNames).toContain('圣诞新年优惠');
    expect(longStay.notes).toContain('MONOL：IELTS课程另有100美元学术费，不参与优惠，未计入学校费用合计，收费方式以学校账单为准。');

    const peak = run('general', 3, 8, '2027-07-04', '2027-01-15', 'minor');
    // Every week from 2027/07/04 through the week starting 08/22 touches the peak range.
    expect(peak.surcharge).toBe(8 * 60);
    expect(peak.discount).toBe(0);
    expect(peak.notes).toContain('MONOL：未满18岁独自在校学习另收100美元／4周管理费，未计入学校费用合计。');

    const speaking = comparison.selections[0];
    comparison.setGoal('speaking');
    expect(speaking.courseNote).toBe('MONOL没有单独的口语强化课程，已选最接近的General ESL');
  });

  it('starts from the same prices as the MONOL page without a published revision', () => {
    const page = createPage();
    const { school } = createMonolCompareSource();
    expect(school.rooms.map(room => `${room.id}:${room.fee}`)).toEqual(page.roomFees.map(room => `${room.id}:${room.fee}`));
    expect(school.courses.map(course => `${course.id}:${course.schedule}`)).toEqual(page.courseFees.map(course => `${course.id}:${course.suitable}`));
    expect(school.rooms.map(room => room.beds)).toEqual([1, 1, 1, 3, 4]);
    expect(school.minimumWeeks('ielts')).toBe(0);
  });

  it('applies a published MONOL revision the way the page does and ignores other documents', () => {
    const source = createMonolCompareSource();
    const comparison = comparisonFor(source);
    const content = cloneMonolContentConfig(createDefaultMonolContentConfig());
    content.rooms.find(room => room.id === 'triple-room')!.fee = 555;
    content.courses.find(course => course.id === 'general-esl')!.tuition = 999;
    content.rooms.find(room => room.id === 'small-single-room')!.enabled = false;

    comparison.setBeds(1);
    expect(comparison.selections[0].plan.roomId).toBe('small-single-room');
    source.applyPublished(content);
    comparison.retainValidSelections();
    expect(source.school.rooms.find(room => room.id === 'triple-room')?.fee).toBe(555);
    expect(source.school.rooms.some(room => room.id === 'small-single-room')).toBeFalse();
    expect(comparison.selections[0].plan.roomId).toBe('standard-single-room');

    // The page quotes the same plan from the same revision.
    const page = createPage();
    page['applyContentConfig'](content);
    comparison.setGoal('general');
    comparison.setBeds(3);
    comparison.setWeeks(8);
    comparison.setStartDate('2027-03-07');
    comparison.conditions.registrationDate = '2026-11-20';
    const result = comparison.results[0];
    quoteOnPage(page, comparison.selections[0].plan.courseId, comparison.selections[0].plan.roomId, comparison.conditions);
    expect(result.tuition).toBe(999 * 2);
    expect(result.accommodation).toBe(555 * 2);
    expect(result.schoolTotal).toBe(page.quoteUsd);
    expect(result.localTotal).toBe(page.localFeeTotal);

    // MONOL Sparta, other schools and malformed values leave MONOL's prices alone.
    for (const foreign of [createDefaultMonolSpartaContentConfig(), createDefaultCiaContentConfig(), { schoolCode: 'MONOL' }, null, 'MONOL']) {
      source.applyPublished(foreign);
      expect(source.school.rooms.find(room => room.id === 'triple-room')?.fee).toBe(555);
      expect(source.school.courses.some(course => course.id === 'general-esl')).toBeTrue();
    }
  });
});
