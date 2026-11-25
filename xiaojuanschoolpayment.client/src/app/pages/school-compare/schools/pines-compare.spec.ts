import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { clonePinesContentConfig, createDefaultPinesContentConfig } from '../../philippines/pines-school/pines-content-config';
import { PinesSchoolDetailComponent } from '../../philippines/pines-school/pines-school-detail.component';
import { SchoolPriceComparison, type CompareConditions, type CompareGoal, type CompareSchoolResult } from '../school-compare';
import { createPinesCompareSource } from './pines-compare';

// The comparison must show exactly what the PINES page quotes for the same single-student plan.
describe('PINES in the cross-school price comparison', () => {
  const rates = { usdToCny: 7, phpPerCny: 8.2, date: '2026-11-20', live: true };
  const PINES_DB_NAME = '菲律宾碧瑶PINES语言学校';

  /** The real PINES page, initialised as on the website; `published` is served as its published revision. */
  const createPage = (published: CiaContentConfig | null = null) => {
    TestBed.configureTestingModule({ providers: [
      { provide: HttpClient, useValue: { get: () => EMPTY } },
      {
        provide: SchoolService,
        useValue: {
          getSchools: () => of(published ? [{ id: 'pines-id', name: PINES_DB_NAME }] : []),
          getSchoolLessons: () => of([]),
          getSchoolRooms: () => of([]),
          getSchoolFees: () => of([]),
          getSchoolPhotos: () => of([]),
        },
      },
      { provide: SchoolContentService, useValue: { getPublished: () => of(published ? { content: published } : null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    const page = TestBed.runInInjectionContext(() => new PinesSchoolDetailComponent());
    page.ngOnInit();
    return page;
  };

  /** Sets the page's single quote to the same plan and conditions. */
  const quoteOnPage = (page: PinesSchoolDetailComponent, courseId: string, roomId: string, conditions: CompareConditions) => {
    const student = page.students[0];
    student.quotePlan.courses = [{ id: 1, optionId: courseId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    student.selectedRegistrationDate = conditions.registrationDate;
    student.returningStudent = false;
    student.pickupAirport = 'none';
    return page;
  };

  const campusRoomId = (courseId: string, roomId: string) => `${courseId.includes('ielts') ? 'ielts' : 'main'}-${roomId}`;

  const expectSameAsPage = (result: CompareSchoolResult, page: PinesSchoolDetailComponent, label: string) => {
    expect(result.error).withContext(label).toBe(page.quoteError);
    expect(result.schoolTotal).withContext(label).toBe(page.quoteUsd);
    expect(result.tuition).withContext(label).toBe(page.tuitionForSelectedWeeks);
    expect(result.accommodation).withContext(label).toBe(page.roomFeeForSelectedWeeks);
    expect(result.surcharge).withContext(label).toBe(page.seasonalSurcharge);
    expect(result.localTotal).withContext(label).toBe(page.estimatedLocalFeeTotal);
    expect(result.registration).withContext(label).toBe(page.registrationFee - page.registrationDiscountAmount);
    expect(result.discount).withContext(label).toBeCloseTo(page.totalDiscountAmount - page.registrationDiscountAmount, 6);
  };

  const comparisonFor = (source = createPinesCompareSource()) => {
    const comparison = new SchoolPriceComparison(() => [source.school], () => rates);
    comparison.start(['pines']);
    return { source, comparison };
  };

  interface Scenario {
    goal: CompareGoal; beds: number; weeks: number; start: string; registration: string;
    visa: 'tourist30' | 'tourist59'; age: 'adult' | 'minor'; course: string; room: string;
  }
  const scenarios: Scenario[] = [
    // Off-season discount (registered before 2027), Sida 95%, 59-day visa.
    { goal: 'general', beds: 2, weeks: 4, start: '2027-03-07', registration: '2026-11-20', visa: 'tourist59', age: 'adult', course: 'intensive-esl', room: 'twin-b' },
    // Two-week short stay at 65%, under-18 student, 30-day visa.
    { goal: 'general', beds: 4, weeks: 2, start: '2026-11-29', registration: '2026-11-20', visa: 'tourist30', age: 'minor', course: 'intensive-esl', room: 'quad' },
    // Guarantee course on the IELTS Campus across the 2027 peak season; 12-week discount.
    { goal: 'ielts-guarantee', beds: 1, weeks: 12, start: '2027-06-13', registration: '2026-11-20', visa: 'tourist30', age: 'adult', course: 'ielts-guarantee-8-weeks-5-5-6-0', room: 'single-c' },
    // No three-bed room: the nearest (four-bed) room; peak season from arrival.
    { goal: 'speaking', beds: 3, weeks: 8, start: '2027-07-04', registration: '2026-11-20', visa: 'tourist59', age: 'adult', course: 'power-speaking', room: 'quad' },
    // 16 weeks on the IELTS Campus: off-season, 12-week and long-stay discounts together.
    { goal: 'ielts', beds: 1, weeks: 16, start: '2027-01-03', registration: '2026-11-20', visa: 'tourist59', age: 'adult', course: 'ielts-regular', room: 'single-c' },
    // Three-week short stay at 85%.
    { goal: 'toeic', beds: 2, weeks: 3, start: '2027-02-07', registration: '2026-11-20', visa: 'tourist30', age: 'adult', course: 'toeic-toeic-speaking', room: 'twin-b' },
    // 24 weeks registered in 2027 (no off-season discount), reaching the summer peak; long-stay steps.
    { goal: 'business', beds: 1, weeks: 24, start: '2027-02-07', registration: '2027-01-10', visa: 'tourist30', age: 'minor', course: 'business-english-practical', room: 'single-c' },
  ];

  it('equals the PINES page’s own quote for the same plan', () => {
    const page = createPage();
    for (const scenario of scenarios) {
      const { comparison } = comparisonFor();
      comparison.conditions.registrationDate = scenario.registration;
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      expect(comparison.setStartDate(scenario.start)).toBeTrue();
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      const label = JSON.stringify(scenario);
      const { plan } = comparison.selections[0];
      expect(`${plan.courseId}/${plan.roomId}`).withContext(label).toBe(`${scenario.course}/${scenario.room}`);

      const result = comparison.results[0];
      quoteOnPage(page, plan.courseId, campusRoomId(plan.courseId, plan.roomId), comparison.conditions);
      expect(result.error).withContext(label).toBe('');
      expect(result.schoolTotal).withContext(label).toBeGreaterThan(0);
      expect(result.localTotal).withContext(label).toBeGreaterThan(0);
      expectSameAsPage(result, page, label);
      expect(result.roomName).withContext(label).toBe(page.roomFees.find(room => room.id === campusRoomId(plan.courseId, plan.roomId))!.name);
      expect(result.tuition + result.accommodation + result.registration - result.discount + result.surcharge)
        .withContext(label).toBeCloseTo(result.schoolTotal, 6);
    }
  });

  it('exercises the short-stay, peak, discount and campus rules it claims to', () => {
    const run = (scenario: Scenario) => {
      const { comparison } = comparisonFor();
      comparison.conditions.registrationDate = scenario.registration;
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      comparison.setStartDate(scenario.start);
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      return { comparison, result: comparison.results[0] };
    };
    const twoWeeks = run(scenarios[1]).result;
    expect(twoWeeks.tuition).toBe(663);
    expect(twoWeeks.accommodation).toBe(455);
    expect(twoWeeks.registration).toBe(0);
    const guarantee = run(scenarios[2]).result;
    expect(guarantee.courseName).toBe('雅思校区｜IELTS 保证班8周（5.5/6.0）');
    expect(guarantee.roomName).toBe('雅思校区单人房C');
    expect(guarantee.surcharge).toBe(540);
    expect(guarantee.discountNames).toContain('12周以上额外优惠');
    expect(guarantee.notes.some(note => note.startsWith('PINES：IELTS保证班'))).toBeTrue();
    const speaking = run(scenarios[3]);
    expect(speaking.comparison.selections[0].roomNote).toBe('PINES没有三人间，已选四人房（上下床）');
    expect(speaking.result.roomName).toBe('主校区四人房（上下床）');
    const longStay = run(scenarios[4]).result;
    expect(longStay.discountNames).toBe('常规淡季优惠、12周以上额外优惠、长期优惠、思达启航95折');
    expect(longStay.notes).toContain('PINES：到校另需校内预存款4,000比索／4周（本方案约16,000比索），用于教材、洗衣等并按实际扣费，未计入到校学杂费。');
    const late = run(scenarios[6]).result;
    expect(late.discountNames).not.toContain('常规淡季优惠');
    expect(late.surcharge).toBeGreaterThan(0);
  });

  it('reports the page’s own errors for plans PINES cannot quote', () => {
    const page = createPage();
    const school = createPinesCompareSource().school;
    const conditions: CompareConditions = { weeks: 1, startDate: '2027-03-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate: '2026-11-20' };
    const oneWeek = school.createPlan('intensive-esl', 'twin-b').result(conditions);
    quoteOnPage(page, 'intensive-esl', 'main-twin-b', conditions);
    expect(oneWeek.error).toBe('暂不支持1周报价，请联系顾问。');
    expectSameAsPage(oneWeek, page, 'one week');

    const short = { ...conditions, weeks: 8 };
    const guarantee = school.createPlan('ielts-guarantee-12-weeks-5-5-6-0', 'quad').result(short);
    quoteOnPage(page, 'ielts-guarantee-12-weeks-5-5-6-0', 'ielts-quad', short);
    expect(guarantee.error).toBe('IELTS 12周保证班的每段课程至少选择12周。');
    expectSameAsPage(guarantee, page, 'short guarantee');
    expect(school.minimumWeeks('ielts-guarantee-12-weeks-5-5-6-0')).toBe(12);
    expect(school.minimumWeeks('ielts-guarantee-8-weeks-6-5-7-0')).toBe(8);
    expect(school.minimumWeeks('power-speaking')).toBe(0);
  });

  it('lists one campus-neutral room list and books the room on the course’s campus', () => {
    const page = createPage();
    const school = createPinesCompareSource().school;
    expect(school.rooms.map(room => `${room.id}:${room.name}:${room.beds}:${room.fee}`)).toEqual([
      'single-a:单人房A:1:1250', 'single-b:单人房B:1:1150', 'single-c:单人房C:1:970', 'twin-a:双人房A:2:870', 'twin-b:双人房B:2:840',
      'family-2-3:亲子2–3人房:0:780', 'quad:四人房（上下床）:4:700', '5b-solo:5B Solo:5:650', 'sextuple:六人房（上下床）:6:570',
    ]);
    expect(school.rooms.find(room => room.id === 'single-b')?.suite).toBeTrue();
    // Both campuses charge the same for every room type.
    for (const room of school.rooms) {
      expect(page.roomFees.filter(item => item.id.endsWith(`-${room.id}`)).map(item => item.fee)).toEqual([room.fee, room.fee]);
    }
    expect(school.courses.map(course => course.id)).toEqual(page.courseFees.map(course => course.id));
    expect(school.courses.find(course => course.id === 'light-esl-4')?.name).toBe('主校区｜Light ESL 4');
    expect(school.courses.find(course => course.id === 'ielts-regular')?.schedule).toBe('4节一对一 + 3节小组课');

    const conditions: CompareConditions = { weeks: 4, startDate: '2027-03-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate: '2026-11-20' };
    const ielts = school.createPlan('ielts-regular', 'twin-a').result(conditions);
    const main = school.createPlan('power-speaking', 'twin-a').result(conditions);
    expect([ielts.roomName, ielts.error]).toEqual(['雅思校区双人房A', '']);
    expect([main.roomName, main.error]).toEqual(['主校区双人房A', '']);
    // A campus-specific id from a page link is booked on the course's campus too.
    expect(school.createPlan('ielts-regular', 'main-quad').result(conditions).roomName).toBe('雅思校区四人房（上下床）');
    expect(createPinesCompareSource().pricingSchoolName).toBe(PINES_DB_NAME);
  });

  it('applies a published revision exactly as the page does and ignores other documents', () => {
    const content = clonePinesContentConfig(createDefaultPinesContentConfig());
    content.courses.find(course => course.id === 'intensive-esl')!.tuition = 1111;
    content.rooms.find(room => room.id === 'main-twin-b')!.fee = 888;
    content.rooms.find(room => room.id === 'ielts-twin-b')!.fee = 888;
    content.rooms.find(room => room.id === 'ielts-single-a')!.enabled = false;
    content.quoteSettings.promotions.find(rule => rule.id === 'pines-off-season')!.enabled = false;
    const page = createPage(content);
    expect(page.courseFees.find(course => course.id === 'intensive-esl')?.tuition).toBe(1111);

    const { source, comparison } = comparisonFor();
    comparison.setBeds(2);
    comparison.setWeeks(8);
    comparison.setStartDate('2027-03-07');
    comparison.conditions.registrationDate = '2026-11-20';
    source.applyPublished(content);
    comparison.retainValidSelections();
    expect(source.school.rooms.find(room => room.id === 'twin-b')?.fee).toBe(888);
    expect(source.school.rooms.find(room => room.id === 'single-a')?.name).toBe('单人房A（仅主校区）');
    const { plan } = comparison.selections[0];
    expect(`${plan.courseId}/${plan.roomId}`).toBe('intensive-esl/twin-b');
    const result = comparison.results[0];
    quoteOnPage(page, plan.courseId, 'main-twin-b', comparison.conditions);
    expect(result.tuition).toBe(2222);
    expect(result.accommodation).toBe(1776);
    expect(result.discountNames).not.toContain('常规淡季优惠');
    expectSameAsPage(result, page, 'published revision');

    // The disabled IELTS-campus single A cannot be booked with an IELTS course.
    const blocked = source.school.createPlan('ielts-regular', 'single-a').result(comparison.conditions);
    expect(blocked.error).toBe('雅思校区没有单人房A，请改选其他房型。');

    const foreign = clonePinesContentConfig(createDefaultPinesContentConfig());
    foreign.rooms.forEach(room => { room.fee = 1; });
    source.applyPublished({ ...foreign, schoolCode: 'CIA' });
    source.applyPublished({ schoolCode: 'PINES' });
    source.applyPublished(null);
    expect(source.school.rooms.find(room => room.id === 'twin-b')?.fee).toBe(888);
    expect(comparison.results[0].schoolTotal).toBe(result.schoolTotal);
  });
});
