import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { cloneIbreezeContentConfig, createDefaultIbreezeContentConfig } from '../../philippines/ibreeze-school/ibreeze-content-config';
import { IbreezeSchoolComponent } from '../../philippines/ibreeze-school/ibreeze-school.component';
import { SchoolPriceComparison, type CompareConditions, type CompareGoal } from '../school-compare';
import { createIbreezeCompareSource } from './ibreeze-compare';

// The comparison must show exactly what the I.BREEZE page quotes for the same single-student plan.
describe('I.BREEZE in the cross-school price comparison', () => {
  const rates = { usdToCny: 7, phpPerCny: 8.2, date: '2026-11-20', live: true };
  const dbSchool = { id: 'ibreeze-db-id', name: '菲律宾宿务I.BREEZE语言学校' };

  /** The real page, with its database lookup answered by the given published revision (or none). */
  const createPage = (published: CiaContentConfig | null = null) => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: {
        getSchools: () => of([dbSchool]),
        getSchoolLessons: () => of([]),
        getSchoolRooms: () => of([]),
        getSchoolFees: () => of([]),
        getSchoolPhotos: () => of([]),
      } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(published ? { content: published } : null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    const page = TestBed.runInInjectionContext(() => new IbreezeSchoolComponent());
    page.ngOnInit();
    return page;
  };

  /** Sets the page's single quote to the same plan and conditions (a minor is the page's 16–17 band). */
  const quoteOnPage = (page: IbreezeSchoolComponent, courseId: string, roomId: string, conditions: CompareConditions) => {
    const student = page.students[0];
    student.quotePlan.courses = [{ id: 1, optionId: courseId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.selectedAgeGroup = conditions.ageGroup === 'minor' ? '16-17' : 'adult';
    student.visaType = conditions.visaType === 'tourist30' ? 30 : 59;
    student.selectedRegistrationDate = conditions.registrationDate;
    return student;
  };

  interface Scenario {
    label: string;
    goal: CompareGoal;
    beds: number;
    room?: string;
    weeks: number;
    start: string;
    registration: string;
    visa: CompareConditions['visaType'];
    age: CompareConditions['ageGroup'];
    expectCourse: string;
    expectRoom: string;
    error?: string;
  }

  const scenarios: Scenario[] = [
    { label: '2026 price, November twin offer', goal: 'general', beds: 2, weeks: 4, start: '2026-11-29', registration: '2026-11-20', visa: 'tourist59', age: 'adult', expectCourse: 'light-esl', expectRoom: 'twin-main' },
    { label: '12 weeks over Christmas, quad, 30-day visa', goal: 'speaking', beds: 4, weeks: 12, start: '2026-12-13', registration: '2026-11-20', visa: 'tourist30', age: 'adult', expectCourse: 'intensive-speaking', expectRoom: 'quad-main' },
    { label: '2027 price, off-campus single', goal: 'ielts', beds: 1, room: 'off-campus-standard-single', weeks: 8, start: '2027-03-07', registration: '2027-01-15', visa: 'tourist59', age: 'adult', expectCourse: 'ielts-target', expectRoom: 'off-campus-standard-single' },
    { label: '2027 summer surcharge, 16 weeks', goal: 'toeic', beds: 1, weeks: 16, start: '2027-06-13', registration: '2027-02-01', visa: 'tourist59', age: 'adult', expectCourse: 'toeic-target', expectRoom: 'single-main' },
    { label: 'minor on Junior tuition', goal: 'general', beds: 3, weeks: 4, start: '2027-02-07', registration: '2027-01-10', visa: 'tourist30', age: 'minor', expectCourse: 'light-esl', expectRoom: 'triple-main' },
    { label: 'closest course for IELTS guarantee, 5 weeks', goal: 'ielts-guarantee', beds: 2, weeks: 5, start: '2027-04-04', registration: '2027-01-20', visa: 'tourist30', age: 'adult', expectCourse: 'ielts-target', expectRoom: 'twin-main' },
    { label: 'unsupported 2 weeks on the 2026 price list', goal: 'general', beds: 2, weeks: 2, start: '2026-12-06', registration: '2026-11-20', visa: 'tourist59', age: 'adult', expectCourse: 'light-esl', expectRoom: 'twin-main', error: '2026价目表暂未确认不足4周的价格，请联系顾问。' },
    { label: 'unpublished 3-week IELTS Target price', goal: 'ielts', beds: 4, weeks: 3, start: '2027-02-14', registration: '2027-01-05', visa: 'tourist59', age: 'adult', expectCourse: 'ielts-target', expectRoom: 'quad-main', error: '所选课程未公布该短期价格，请调整课程或周数。' },
    { label: 'business beyond the 2027 four-week list', goal: 'business', beds: 2, weeks: 8, start: '2027-03-07', registration: '2027-01-05', visa: 'tourist59', age: 'adult', expectCourse: 'general-business-and-bec', expectRoom: 'twin-main', error: '2027价目表的商务英语仅列至4周，请联系顾问确认更长课程安排。' },
    { label: 'off-campus apartment in the 2027 summer', goal: 'general', beds: 2, room: 'off-campus-standard-twin', weeks: 4, start: '2027-07-04', registration: '2027-01-05', visa: 'tourist59', age: 'adult', expectCourse: 'light-esl', expectRoom: 'off-campus-standard-twin', error: '2027暑期公寓仅接受家庭学生，请确认家庭同行或选择校内宿舍。' },
  ];

  const compare = (scenario: Scenario) => {
    const source = createIbreezeCompareSource();
    const comparison = new SchoolPriceComparison(() => [source.school], () => rates);
    comparison.start([source.school.id]);
    comparison.setGoal(scenario.goal);
    comparison.setBeds(scenario.beds);
    comparison.setWeeks(scenario.weeks);
    expect(comparison.setStartDate(scenario.start)).withContext(scenario.label).toBeTrue();
    comparison.conditions.registrationDate = scenario.registration;
    comparison.conditions.visaType = scenario.visa;
    comparison.conditions.ageGroup = scenario.age;
    const selection = comparison.selections[0];
    if (scenario.room) comparison.setRoom(selection, scenario.room);
    return { comparison, selection, result: comparison.results[0] };
  };

  it('equals the I.BREEZE page’s own quote for the same plan', () => {
    const page = createPage();
    for (const scenario of scenarios) {
      const { comparison, selection, result } = compare(scenario);
      const label = scenario.label;
      expect(comparison.conditions.weeks).withContext(label).toBe(scenario.weeks);
      expect(selection.plan.courseId).withContext(label).toBe(scenario.expectCourse);
      expect(selection.plan.roomId).withContext(label).toBe(scenario.expectRoom);
      const student = quoteOnPage(page, selection.plan.courseId, selection.plan.roomId, comparison.conditions);
      expect(result.error).withContext(label).toBe(page.quoteError);
      expect(result.error).withContext(label).toBe(scenario.error ?? '');
      expect(result.schoolTotal).withContext(label).toBe(page.quoteUsd);
      expect(result.tuition).withContext(label).toBe(page.tuitionForSelectedWeeks);
      expect(result.accommodation).withContext(label).toBe(page.roomFeeForSelectedWeeks);
      expect(result.registration).withContext(label).toBe(page.registrationAmount);
      expect(result.surcharge).withContext(label).toBe(page.seasonalSurcharge);
      expect(result.localTotal).withContext(label).toBe(page.localFeesTotal);
      expect(result.discount).withContext(label).toBeCloseTo(page.sidaDiscountAmount + page.septemberPromotionDiscount
        + student.novemberPromotionDiscount + page.christmasPromotionDiscount, 2);
      expect(page.minorManagementFee).withContext(label).toBe(0);
      if (!result.error) {
        expect(result.schoolTotal).withContext(label).toBeGreaterThan(0);
        expect(result.localTotal).withContext(label).toBeGreaterThan(0);
        expect(result.tuition + result.accommodation + result.registration - result.discount + result.surcharge)
          .withContext(`${label}: rows add up`).toBeCloseTo(result.schoolTotal, 2);
      }
    }
  });

  it('exercises the offers, surcharge, visa, price year and minor rules it claims to', () => {
    const results = Object.fromEntries(scenarios.map(scenario => [scenario.label, compare(scenario)]));
    const november = results['2026 price, November twin offer'].result;
    expect([november.tuition, november.accommodation, november.registration]).toEqual([840, 900, 150]);
    expect(november.discount).toBe(187);
    expect(november.discountNames).toBe('思达启航折扣、11月住宿优惠');
    expect(november.schoolTotal).toBe(1703);
    expect(november.localTotal).toBe(21700);

    const christmas = results['12 weeks over Christmas, quad, 30-day visa'].result;
    expect(christmas.discountNames).toBe('思达启航折扣、11月住宿优惠、圣诞特别优惠');
    expect(christmas.discount).toBe(773.5);
    expect(christmas.schoolTotal).toBe(3846.5);
    expect(christmas.localTotal).toBe(55550);

    const offCampus = results['2027 price, off-campus single'].result;
    expect([offCampus.tuition, offCampus.accommodation]).toEqual([2380, 2900]);
    expect(offCampus.discountNames).toBe('思达启航折扣');
    expect(offCampus.localTotal).toBe(24700);

    expect(results['2027 summer surcharge, 16 weeks'].result.surcharge).toBe(280);

    const minor = results['minor on Junior tuition'];
    expect(minor.result.courseName).toBe('轻度ESL Light ESL');
    expect(minor.result.tuition).toBe(1290);
    expect(minor.result.notes.length).toBe(1);
    expect(minor.result.notes[0]).toMatch(/^I\.BREEZE：未满18岁按16–17岁报价/);
    expect(november.notes).toEqual([]);

    const guarantee = results['closest course for IELTS guarantee, 5 weeks'];
    expect(guarantee.selection.courseNote).toBe('I.BREEZE没有单独的雅思保分课程，已选最接近的雅思目标 IELTS Target');
    expect(guarantee.result.tuition).toBe(1487.5);
  });

  it('starts from the same courses and prices as the page without a published revision', () => {
    const page = createPage();
    const source = createIbreezeCompareSource();
    expect(source.pricingSchoolName).toBe(dbSchool.name);
    expect(source.school.courses.map(course => `${course.id}:${course.name}`)).toEqual(page.courseOptions.map(course => `${course.id}:${course.name}`));
    expect(source.school.rooms.map(room => `${room.id}:${room.fee}`)).toEqual(page.roomOptions.map(room => `${room.id}:${room.fee}`));
    const facts = (id: string) => {
      const room = source.school.rooms.find(item => item.id === id)!;
      return [room.beds, room.offCampus, room.suite];
    };
    expect(facts('quad-main')).toEqual([4, false, false]);
    expect(facts('twin-ib2')).toEqual([2, false, false]);
    expect(facts('off-campus-standard-twin')).toEqual([2, true, false]);
    expect(facts('off-campus-family')).toEqual([0, true, false]);
    expect(source.school.minimumWeeks('ielts-target')).toBe(0);
  });

  it('applies a published revision like the page and ignores foreign documents', () => {
    const content = cloneIbreezeContentConfig(createDefaultIbreezeContentConfig());
    content.courses.find(course => course.id === 'light-esl')!.tuition = 999;
    content.rooms.find(room => room.id === 'twin-main')!.fee2027 = 1111;
    content.rooms.find(room => room.id === 'single-ib2')!.enabled = false;
    content.quoteSettings.registrationFee = 160;
    const page = createPage(content);
    const source = createIbreezeCompareSource();
    source.applyPublished(content);
    expect(source.school.rooms.some(room => room.id === 'single-ib2')).toBeFalse();
    expect(source.school.rooms.map(room => `${room.id}:${room.fee}`)).toEqual(page.roomOptions.map(room => `${room.id}:${room.fee}`));

    const plan = source.school.createPlan('light-esl', 'twin-main');
    for (const registrationDate of ['2026-11-20', '2027-01-05']) {
      const conditions: CompareConditions = { weeks: 4, startDate: '2027-02-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate };
      const result = plan.result(conditions);
      quoteOnPage(page, 'light-esl', 'twin-main', conditions);
      expect(result.error).toBe('');
      expect(result.schoolTotal).withContext(registrationDate).toBe(page.quoteUsd);
      expect(result.tuition).withContext(registrationDate).toBe(page.tuitionForSelectedWeeks);
      expect(result.accommodation).withContext(registrationDate).toBe(page.roomFeeForSelectedWeeks);
      expect(result.registration).withContext(registrationDate).toBe(160);
    }
    expect(plan.result({ weeks: 4, startDate: '2027-02-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate: '2026-11-20' }).tuition).toBe(999);
    expect(plan.result({ weeks: 4, startDate: '2027-02-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate: '2027-01-05' }).accommodation).toBe(1111);

    const foreign = cloneIbreezeContentConfig(createDefaultIbreezeContentConfig());
    foreign.schoolCode = 'CIA';
    foreign.courses.find(course => course.id === 'light-esl')!.tuition = 5;
    source.applyPublished(foreign);
    source.applyPublished(null);
    source.applyPublished({ schemaVersion: 1, schoolCode: 'IBREEZE' });
    const after = plan.result({ weeks: 4, startDate: '2027-02-07', ageGroup: 'adult', visaType: 'tourist59', registrationDate: '2026-11-20' });
    expect(after.tuition).toBe(999);
    expect(after.registration).toBe(160);
  });
});
