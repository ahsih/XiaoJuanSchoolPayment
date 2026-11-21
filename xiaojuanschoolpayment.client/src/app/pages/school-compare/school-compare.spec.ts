import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import { planCompareReady } from '../../components/plan-compare/plan-compare-sheet';
import { cloneEvContentConfig, createDefaultEvContentConfig } from '../philippines/ev-school/ev-content-config';
import { CiaSchoolComponent } from '../philippines/cia-school/cia-school.component';
import { EvSchoolPageComponent } from '../philippines/ev-school/ev-school-page.component';
import { CpilsSchoolPageComponent } from '../philippines/cpils-school/cpils-school-page.component';
import type { PhSchoolPageComponent } from '../philippines/school-page/ph-school-page.component';
import { createCompareSchools, createEvCompareSource } from './compare-schools';
import { compareRoomFacts, SchoolPriceComparison, type CompareConditions } from './school-compare';

// The comparison must show, for every school, exactly what that school's own page quotes for the
// same plan; it never prices anything itself.
describe('Cross-school price comparison', () => {
  const rates = { usdToCny: 7, phpPerCny: 8.2, date: '2026-11-20', live: true };
  const setup = () => {
    const sources = createCompareSchools();
    const comparison = new SchoolPriceComparison(() => sources.map(source => source.school), () => rates);
    comparison.start();
    comparison.conditions.registrationDate = '2026-11-20';
    comparison.setStartDate('2027-03-07');
    return { sources, comparison };
  };

  const pageProviders = () => TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] });

  /** Sets the page's single quote to the same plan and conditions. */
  const quoteOnPage = (page: PhSchoolPageComponent, courseId: string, roomId: string, conditions: CompareConditions) => {
    const student = page.students[0];
    student.quotePlan.courses = [{ id: 1, optionId: courseId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks: conditions.weeks, startDate: conditions.startDate }];
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    if (student.selectedRegistrationDate !== undefined) student.selectedRegistrationDate = conditions.registrationDate;
    return page.quote;
  };

  const scenarios: Array<{ goal: 'general' | 'ielts-guarantee' | 'speaking'; beds: number; weeks: number; start: string; visa: 'tourist30' | 'tourist59'; age: 'adult' | 'minor' }> = [
    { goal: 'general', beds: 2, weeks: 4, start: '2027-03-07', visa: 'tourist59', age: 'adult' },
    { goal: 'general', beds: 4, weeks: 2, start: '2026-11-29', visa: 'tourist30', age: 'minor' },
    { goal: 'ielts-guarantee', beds: 1, weeks: 12, start: '2027-06-13', visa: 'tourist30', age: 'adult' },
    { goal: 'speaking', beds: 3, weeks: 8, start: '2027-07-04', visa: 'tourist59', age: 'adult' },
  ];

  it('equals each school page’s own quote for the same plan', () => {
    pageProviders();
    const pages: Record<string, PhSchoolPageComponent> = {
      cia: TestBed.runInInjectionContext(() => new CiaSchoolComponent()),
      ev: TestBed.runInInjectionContext(() => new EvSchoolPageComponent()),
      cpils: TestBed.runInInjectionContext(() => new CpilsSchoolPageComponent()),
    };
    for (const scenario of scenarios) {
      const { comparison } = setup();
      comparison.toggleSchool('cpils');
      expect(comparison.selections.length).toBe(3);
      comparison.setGoal(scenario.goal);
      comparison.setBeds(scenario.beds);
      comparison.setWeeks(scenario.weeks);
      comparison.setStartDate(scenario.start);
      comparison.conditions.visaType = scenario.visa;
      comparison.conditions.ageGroup = scenario.age;
      const results = comparison.results;
      comparison.selections.forEach((selection, index) => {
        const page = pages[selection.school.id];
        const quote = quoteOnPage(page, selection.plan.courseId, selection.plan.roomId, comparison.conditions);
        const result = results[index];
        const label = `${selection.school.tag} ${JSON.stringify(scenario)}`;
        // CPILS has no 2026 short-stay prices; the comparison shows the same message as its page.
        if (selection.school.id === 'cpils' && scenario.start < '2027-01-01' && scenario.weeks < 4) {
          expect(result.error).withContext(label).toContain('暂无');
          expect(result.error).withContext(label).toBe(quote.quoteError);
          return;
        }
        expect(result.error).withContext(label).toBe('');
        expect(result.schoolTotal).withContext(label).toBeGreaterThan(0);
        expect(result.localTotal).withContext(label).toBeGreaterThan(0);
        expect(result.error).withContext(label).toBe(quote.quoteError);
        expect(result.schoolTotal).withContext(label).toBe(quote.quoteUsd);
        expect(result.tuition).withContext(label).toBe(quote.tuitionForSelectedWeeks);
        expect(result.accommodation).withContext(label).toBe(quote.roomFeeForSelectedWeeks);
        expect(result.surcharge).withContext(label).toBe(quote.seasonalSurcharge);
        expect(result.localTotal).withContext(label).toBe(quote.estimatedLocalFeeTotal);
      });
    }
  });

  it('starts from the same prices as each page without a published revision', () => {
    pageProviders();
    const pages: Record<string, PhSchoolPageComponent> = {
      cia: TestBed.runInInjectionContext(() => new CiaSchoolComponent()),
      ev: TestBed.runInInjectionContext(() => new EvSchoolPageComponent()),
      cpils: TestBed.runInInjectionContext(() => new CpilsSchoolPageComponent()),
    };
    expect(createCompareSchools().map(source => source.school.id)).toEqual(['cia', 'ev', 'cpils']);
    for (const source of createCompareSchools()) {
      const page = pages[source.school.id];
      expect(source.school.rooms.map(room => `${room.id}:${room.fee}`).sort())
        .toEqual(page.roomFees.map(room => `${room.id}:${room.fee}`).sort());
      expect(source.school.courses.map(course => course.id).sort()).toEqual(page.courseFees.map(course => course.id).sort());
    }
  });

  it('matches courses by goal and rooms by size, preferring standard campus rooms', () => {
    const { comparison } = setup();
    const pick = () => comparison.selections.map(selection => `${selection.school.id}:${selection.plan.courseId}/${selection.plan.roomId}`);
    expect(pick()).toEqual(['cia:regular-esl/d2', 'ev:semi-sparta-esl/double']);
    comparison.setBeds(1);
    expect(pick()).toEqual(['cia:regular-esl/s1', 'ev:semi-sparta-esl/single']);
    comparison.setGoal('speaking');
    expect(pick()).toEqual(['cia:power-intensive/s1', 'ev:semi-sparta-power-speaking-6/single']);
    expect(comparison.selections[0].courseNote).toBe('CIA没有单独的口语强化课程，已选最接近的Power Intensive');
    expect(comparison.selections[1].courseNote).toBe('');
    comparison.setGoal('ielts-guarantee');
    expect(comparison.conditions.weeks).toBe(12);
    expect(comparison.results.every(result => !result.error)).toBeTrue();
    comparison.setCourse(comparison.selections[0], 'business');
    expect(comparison.selections[0].courseNote).toBe('');
    expect(compareRoomFacts('校外公寓双人间')).toEqual({ beds: 2, offCampus: true, suite: false });
    expect(compareRoomFacts('单人套房 SR-1')).toEqual({ beds: 1, offCampus: false, suite: true });
  });

  it('adds CPILS as a third school with its own matches', () => {
    const { comparison } = setup();
    comparison.toggleSchool('cpils');
    const cpils = () => comparison.selections[2];
    const pick = () => `${cpils().plan.courseId}/${cpils().plan.roomId}`;
    expect(pick()).toBe('general-esl/regular-twin');
    comparison.setBeds(4);
    expect(pick()).toBe('general-esl/regular-quad');
    comparison.setGoal('speaking');
    expect(pick()).toBe('esl-premium/regular-quad');
    expect(cpils().courseNote).toContain('CPILS没有单独的口语强化课程');
    comparison.setGoal('ielts-guarantee');
    expect(comparison.conditions.weeks).toBe(12);
    expect(pick()).toBe('ielts-guarantee-12-weeks/regular-quad');
    expect(comparison.results.every(result => !result.error)).toBeTrue();
    expect(comparison.sheet.plans.map(plan => plan.tag)).toEqual(['CIA', 'EV主校区', 'CPILS']);
    comparison.toggleSchool('ev');
    expect(comparison.selections.map(selection => selection.school.id)).toEqual(['cia', 'cpils']);
    comparison.applyLink({ from: 'cpils', course: 'toeic-course', room: 'premium-single', weeks: '8', start: '2027-01-10' });
    expect(comparison.selections[0].school.id).toBe('cpils');
    expect(comparison.selections[0].plan.courseId).toBe('toeic-course');
    expect(comparison.selections[0].plan.roomId).toBe('premium-single');
    expect(comparison.goal).toBe('toeic');
  });

  it('builds one sheet for the table and image, with school fees and local fees kept apart', () => {
    const { comparison } = setup();
    const sheet = comparison.sheet;
    expect(sheet.heading).toBe('宿务学校对比报价');
    expect(sheet.conditions).toBe('相同条件：综合英语 · 双人间 · 4周 · 2027/03/07入学');
    expect(sheet.plans.map(plan => plan.tag)).toEqual(['CIA', 'EV主校区']);
    expect(planCompareReady(sheet)).toBeTrue();
    expect(comparison.ready).toBeTrue();
    const row = (label: string) => sheet.rows.find(item => item.label === label);
    expect(row('学校费用合计')?.values.every(value => value.endsWith('美元'))).toBeTrue();
    expect(row('到校学杂费')?.values.every(value => value.endsWith('比索'))).toBeTrue();
    const totals = comparison.results.map(result => result.schoolTotal);
    const lowest = Math.min(...totals);
    expect(row('学校费用差价')?.values).toEqual(totals.map(total => total === lowest ? '最低' : `多 ${(total - lowest).toLocaleString('en-US', { maximumFractionDigits: 2 })} 美元`));
    expect(sheet.notes[0]).toContain('学校费用与到校学杂费分开支付');
    expect(sheet.notes.some(note => note.startsWith('参考汇率（2026/11/20）'))).toBeTrue();
  });

  it('opens with the plan a school page links with', () => {
    const { comparison } = setup();
    comparison.applyLink({ from: 'ev', course: 'sparta-ielts-regular', room: 'triple', weeks: '8', start: '2027-01-10' });
    expect(comparison.selections.map(selection => selection.school.id)).toEqual(['ev', 'cia']);
    expect(comparison.goal).toBe('ielts');
    expect(comparison.beds).toBe(3);
    expect(comparison.conditions.weeks).toBe(8);
    expect(comparison.conditions.startDate).toBe('2027-01-10');
    expect(comparison.selections[0].plan.courseId).toBe('sparta-ielts-regular');
    expect(comparison.selections[1].plan.courseId).toBe('ielts-regular');
    expect(comparison.selections[1].plan.roomId).toBe('d3');
  });

  it('applies a published revision and keeps the comparison valid', () => {
    const source = createEvCompareSource();
    const comparison = new SchoolPriceComparison(() => [source.school, ...createCompareSchools().map(item => item.school).filter(school => school.id !== 'ev')], () => rates);
    comparison.start();
    const content = cloneEvContentConfig(createDefaultEvContentConfig());
    const double = content.rooms.find(room => room.id === 'double')!;
    double.fee = 1234;
    content.rooms = content.rooms.filter(room => room.id !== 'single');
    comparison.setBeds(1);
    expect(comparison.selections[0].plan.roomId).toBe('single');
    source.applyPublished(content);
    comparison.retainValidSelections();
    expect(source.school.rooms.find(room => room.id === 'double')?.fee).toBe(1234);
    expect(comparison.selections[0].plan.roomId).not.toBe('single');
    source.applyPublished({ schoolCode: 'CIA' });
    expect(source.school.rooms.find(room => room.id === 'double')?.fee).toBe(1234);
  });

  it('accepts only Sunday arrivals and keeps weeks within 1–24', () => {
    const { comparison } = setup();
    expect(comparison.setStartDate('2027-03-08')).toBeFalse();
    expect(comparison.conditions.startDate).toBe('2027-03-07');
    expect(comparison.endDate).toBe('2027-04-03');
    comparison.setWeeks(40);
    expect(comparison.conditions.weeks).toBe(24);
    comparison.toggleSchool('cia');
    expect(comparison.selections.length).toBe(2);
  });
});
