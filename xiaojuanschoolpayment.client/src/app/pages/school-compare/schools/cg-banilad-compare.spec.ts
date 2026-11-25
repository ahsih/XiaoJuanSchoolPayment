import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneCgBaniladContentConfig, createDefaultCgBaniladContentConfig } from '../../philippines/cg-banilad-school/cg-banilad-content-config';
import { CgBaniladSchoolComponent } from '../../philippines/cg-banilad-school/cg-banilad-school.component';
import { createDefaultCgSpartaContentConfig } from '../../philippines/cg-sparta-school/cg-sparta-content-config';
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { SchoolPriceComparison, type CompareConditions, type CompareGoal, type CompareSchoolSource } from '../school-compare';
import { createCgBaniladCompareSource } from './cg-banilad-compare';

// The comparison must show exactly what the CG Banilad page quotes for the same single-student plan.
describe('CG Banilad in the cross-school price comparison', () => {
  const rates = { usdToCny: 7, phpPerCny: 8.2, date: '2026-11-20', live: true };
  const databaseName = '菲律宾宿务CG Academy（Banilad Campus）';

  const configure = (published: CiaContentConfig | null = null) => TestBed.configureTestingModule({ providers: [
    {
      provide: SchoolService,
      useValue: {
        getSchools: () => of(published ? [{ id: 'cg-banilad-id', name: databaseName }] : []),
        getSchoolPhotos: () => of([]),
      },
    },
    { provide: SchoolContentService, useValue: { getPublished: () => of(published ? { content: published } : null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => EMPTY } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] });

  const createPage = () => {
    const page = TestBed.runInInjectionContext(() => new CgBaniladSchoolComponent());
    page.ngOnInit();
    return page;
  };

  const compare = (source: CompareSchoolSource) => {
    const comparison = new SchoolPriceComparison(() => [source.school], () => rates);
    comparison.start([source.school.id]);
    comparison.conditions.registrationDate = '2026-11-20';
    return comparison;
  };

  /** The page's single quote set to the same plan and conditions. */
  const quoteOnPage = (page: CgBaniladSchoolComponent, courseId: string, roomId: string, conditions: CompareConditions) => {
    const student = page.students[0];
    student.quotePlan.courses = [{ id: 1, optionId: courseId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    student.selectedRegistrationDate = conditions.registrationDate;
    return page;
  };

  const scenarios: Array<{
    goal: CompareGoal; beds: number; weeks: number; start: string;
    visa: 'tourist30' | 'tourist59'; age: 'adult' | 'minor'; course: string; room: string;
  }> = [
    // 2027 low-season window (2027/02/14–05/23) and the 2027 weekly local fees.
    { goal: 'general', beds: 2, weeks: 4, start: '2027-03-07', visa: 'tourist59', age: 'adult', course: 'general-esl', room: 'twin' },
    // Three-week short stay (85%), 2026 off-season, before the 2027-01-03 local-fee switch, minor.
    { goal: 'speaking', beds: 4, weeks: 3, start: '2026-11-29', visa: 'tourist30', age: 'minor', course: 'power-esl', room: 'quad' },
    // 12 weeks: long-stay discount, 2027 summer peak surcharge, 30-day visa extensions.
    { goal: 'ielts', beds: 1, weeks: 12, start: '2027-06-13', visa: 'tourist30', age: 'adult', course: 'ielts-basic', room: 'single' },
    // Arrival before 2027-01-03, crossing the year, 59-day visa.
    { goal: 'business', beds: 3, weeks: 16, start: '2026-12-20', visa: 'tourist59', age: 'adult', course: 'business', room: 'triple' },
    // Arrival exactly on the 2027-01-03 switch, 24 weeks, nearest course for a guarantee goal.
    { goal: 'ielts-guarantee', beds: 2, weeks: 24, start: '2027-01-03', visa: 'tourist30', age: 'minor', course: 'ielts-basic', room: 'twin' },
    // Two weeks: the page refuses the quote.
    { goal: 'toeic', beds: 2, weeks: 2, start: '2027-01-10', visa: 'tourist59', age: 'adult', course: 'toeic', room: 'twin' },
  ];

  it('equals the CG Banilad page’s own quote for the same plan', () => {
    configure();
    const page = createPage();
    for (const scenario of scenarios) {
      const comparison = compare(createCgBaniladCompareSource());
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      expect(comparison.setStartDate(scenario.start)).toBeTrue();
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      const [selection] = comparison.selections;
      const label = JSON.stringify(scenario);
      expect(selection.plan.courseId).withContext(label).toBe(scenario.course);
      expect(selection.plan.roomId).withContext(label).toBe(scenario.room);
      const [result] = comparison.results;
      quoteOnPage(page, selection.plan.courseId, selection.plan.roomId, comparison.conditions);

      expect(result.error).withContext(label).toBe(page.quoteError);
      expect(result.schoolTotal).withContext(label).toBe(page.quoteUsd);
      expect(result.tuition).withContext(label).toBe(page.tuitionForSelectedWeeks);
      expect(result.accommodation).withContext(label).toBe(page.roomFeeForSelectedWeeks);
      expect(result.registration).withContext(label).toBe(page.payableRegistrationFee);
      expect(result.discount).withContext(label).toBeCloseTo(page.sidaDiscountAmount + page.offSeasonDiscount + page.longStayDiscount, 6);
      expect(result.surcharge).withContext(label).toBe(page.summerSurcharge);
      expect(result.localTotal).withContext(label).toBeCloseTo(page.localFeesTotal, 6);
      expect(result.tuition + result.accommodation + result.registration - result.discount + result.surcharge)
        .withContext(label).toBeCloseTo(result.schoolTotal, 2);
      if (scenario.weeks >= 3) {
        expect(result.error).withContext(label).toBe('');
        expect(result.schoolTotal).withContext(label).toBeGreaterThan(0);
        expect(result.localTotal).withContext(label).toBeGreaterThan(0);
      }
    }
  });

  it('exercises the school’s own rules in those scenarios', () => {
    const run = (scenario: typeof scenarios[number]) => {
      const comparison = compare(createCgBaniladCompareSource());
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      comparison.setStartDate(scenario.start);
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      return comparison.results[0];
    };
    const [lowSeason, shortStay, summer, crossing, , twoWeeks] = scenarios.map(run);
    expect(lowSeason.discountNames).toBe('思达启航折扣、淡季优惠');
    expect(lowSeason.discount).toBe(145 + 150);
    expect(shortStay.tuition).toBe(680);
    expect(shortStay.accommodation).toBeCloseTo(552.5, 6);
    expect(summer.surcharge).toBeGreaterThan(0);
    expect(summer.discountNames).toContain('长期优惠');
    expect(crossing.discountNames).toContain('淡季优惠');
    expect(twoWeeks.error).toBe('暂不支持2周报价，请联系顾问。');
    expect(lowSeason.notes).toEqual(['CG Banilad：空调用电按实际用量另收，不含在到校学杂费内。']);
  });

  it('starts from the same prices as the page and matches rooms by size on campus', () => {
    configure();
    const page = createPage();
    const source = createCgBaniladCompareSource();
    expect(source.school.courses.map(course => course.id)).toEqual(page.courses.map(course => course.id));
    expect(source.school.rooms.map(room => `${room.id}:${room.fee}`)).toEqual(page.roomOptions.map(room => `${room.id}:${room.feeUsd}`));
    expect(source.school.rooms.filter(room => room.offCampus).map(room => room.id))
      .toEqual(['alicia-quad', 'alicia-triple', 'alicia-twin', 'alicia-single', '88th-quad', '88th-triple', '88th-twin', '88th-single']);
    expect(source.school.rooms.every(room => room.beds >= 1 && room.beds <= 4 && !room.suite)).toBeTrue();
    const comparison = compare(source);
    const picks = [1, 2, 3, 4].map(beds => { comparison.setBeds(beds); return comparison.selections[0].plan.roomId; });
    expect(picks).toEqual(['single', 'twin', 'triple', 'quad']);
    comparison.setGoal('speaking');
    expect(comparison.selections[0].courseNote).toBe('CG Banilad没有单独的口语强化课程，已选最接近的Power ESL');
    comparison.setGoal('ielts-guarantee');
    expect(comparison.selections[0].courseNote).toBe('CG Banilad没有单独的雅思保分课程，已选最接近的雅思基础');
    expect(comparison.conditions.weeks).toBe(4);
    expect(source.school.pagePath).toBe('/philippines-study/cebu/cg-academy-banilad-campus');
    expect(source.pricingSchoolName).toBe(databaseName);
  });

  it('applies a published revision like the page and ignores other documents', () => {
    const content = cloneCgBaniladContentConfig(createDefaultCgBaniladContentConfig());
    content.rooms.find(room => room.id === 'twin')!.fee = 999;
    content.courses.find(course => course.id === 'general-esl')!.tuition = 777;
    content.courses.find(course => course.id === 'light-esl')!.enabled = false;
    content.quoteSettings.registrationFee = 120;
    configure(content);
    const page = createPage();
    expect(page.roomOptions.find(room => room.id === 'twin')?.feeUsd).toBe(999);

    const source = createCgBaniladCompareSource();
    const comparison = compare(source);
    source.applyPublished(content);
    comparison.retainValidSelections();
    expect(source.school.rooms.find(room => room.id === 'twin')?.fee).toBe(999);
    expect(source.school.courses.some(course => course.id === 'light-esl')).toBeFalse();
    comparison.setStartDate('2027-03-07');
    const [result] = comparison.results;
    expect(result.tuition).toBe(777);
    expect(result.accommodation).toBe(999);
    expect(result.registration).toBe(120);
    quoteOnPage(page, 'general-esl', 'twin', comparison.conditions);
    expect(result.schoolTotal).toBe(page.quoteUsd);
    expect(result.localTotal).toBeCloseTo(page.localFeesTotal, 6);

    source.applyPublished(createDefaultCgSpartaContentConfig());
    source.applyPublished({ schemaVersion: 1, schoolCode: 'CG-BANILAD' });
    source.applyPublished(null);
    source.applyPublished('CG-BANILAD');
    expect(source.school.rooms.find(room => room.id === 'twin')?.fee).toBe(999);
    expect(comparison.results[0].schoolTotal).toBe(result.schoolTotal);
  });
});
