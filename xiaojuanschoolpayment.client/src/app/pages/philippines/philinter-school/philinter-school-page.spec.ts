import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { clonePhilinterContentConfig, createDefaultPhilinterContentConfig } from './philinter-content-config';
import { PHILINTER_PAGE_PROFILE } from './philinter-page-profile';
import { PhilinterSchoolPageComponent } from './philinter-school-page.component';

// Philinter on the shared Philippine school template: the 2026 and 2027 price lists, the 2026 low-season offer and
// the 2026-10-19 local-fee sheet from Philinter's 2026-2027 Google Drive pack.
describe('Philinter page on the shared template', () => {
  let page: PhilinterSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new PhilinterSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  it('prices the default four-week plan with 2026 prices and the Sida 10%', () => {
    expect(page.selectedCourseId).toBe('general-esl');
    expect(page.selectedRoomId).toBe('in-campus-triple');
    // 120 registration + 900 + 810 − 171 (10%)
    expect(page.quote.quoteUsd).toBe(1659);
    expect(payment('思达启航折扣')?.amount).toBe('− 171 美元');
    expect(page.quoteImageData.headingText).toContain('Philinter 4周报价');
  });

  it('gives 300 dollars for every 8 weeks of the 2026 low-season offer in an eligible room', () => {
    page.selectedWeeks = 8;
    // 120 + 1,800 + 1,620 − 342 − 300
    expect(page.quote.quoteUsd).toBe(2898);
    expect(payment('2026下半年淡季优惠')).toBeDefined();
    page.selectedRoomId = 'in-campus-twin';
    expect(payment('2026下半年淡季优惠')).toBeUndefined();
  });

  it('uses the 2027 room prices and registration from a 2027-01-03 arrival', () => {
    page.selectedStartDate = '2027-01-03';
    // 150 + 900 + 830 − 173
    expect(page.quote.quoteUsd).toBe(1707);
    expect(page.roomFeeFor('in-campus-single')).toBe(1600);
    expect(page.roomFeeFor('azon-single')).toBe(1690);
  });

  it('adds the 60-dollar 2027 summer surcharge outside the discount', () => {
    page.selectedStartDate = '2027-07-04';
    expect(student().seasonalSurcharge).toBe(240);
    expect(page.quote.quoteUsd).toBe(1947);
  });

  it('waives registration for returning students', () => {
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(1539);
  });

  it('blocks fixed-length courses, 2027-only courses before 2027 and the age rules', () => {
    page.selectedCourseId = 'ielts-guarantee-8-weeks';
    expect(student().quoteError).toContain('固定报名8周');
    page.selectedWeeks = 8;
    expect(student().quoteError).toBe('');
    page.selectedCourseId = 'booster-speaking';
    page.selectedWeeks = 4;
    expect(student().quoteError).toContain('2027年新课程');
    page.selectedStartDate = '2027-01-03';
    expect(student().quoteError).toBe('');
    page.selectedCourseId = 'general-esl';
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toContain('青少年课程');
    page.selectedCourseId = 'junior-esl-12-17-years';
    expect(student().quoteError).toBe('');
    page.selectedRoomId = 'in-campus-single';
    expect(student().quoteError).toContain('单人间');
  });

  it('estimates dormitory local fees like the sheet, without pickup and deposit, plus textbooks', () => {
    expect(localFee('SSP特殊学习许可')?.total).toBe(7800);
    expect(localFee('维护费')?.total).toBe(2400);
    expect(localFee('电费')?.total).toBe(4000);
    expect(localFee('旅游签续签')?.quantity).toBe(0);
    // Sheet, 4 weeks: 24,300 including deposit 3,000 and pickup 1,200; plus one 2,000 textbook estimate.
    expect(localTotal()).toBe(24300 - 4200 + 2000);
    // Sheet, 12 weeks on a 59-day entry: 52,320 including deposit 5,000 and pickup 1,200; plus three textbook estimates.
    page.selectedWeeks = 12;
    expect(localFee('旅游签续签')?.total).toBe(6920);
    expect(localFee('旅游签ACR I-CARD')?.total).toBe(4000);
    expect(localTotal()).toBe(52320 - 6200 + 6000);
    expect(student().roomDeposit).toBe(5000);
  });

  it('starts extensions and the ACR card after four weeks on a 30-day entry', () => {
    student().visaType = 'tourist30';
    page.selectedWeeks = 8;
    expect(localFee('旅游签续签')?.total).toBe(6920);
    expect(localFee('旅游签ACR I-CARD')?.total).toBe(4000);
    page.selectedWeeks = 12;
    expect(localFee('旅游签续签')?.total).toBe(11360);
  });

  it('charges the Azon water and electricity like the condo sheet', () => {
    page.selectedRoomId = 'azon-single';
    // Condo sheet, 4 weeks: 25,800 including deposit 3,000 and pickup 1,200.
    expect(localFee('电费')?.total).toBe(5500);
    expect(localTotal()).toBe(25800 - 4200 + 2000);
    page.selectedWeeks = 1;
    expect(localFee('水费')?.total).toBe(450);
    expect(localFee('电费')?.total).toBe(2500);
  });

  it('marks the visa rows as waived on a long-term visa', () => {
    student().visaType = 'student';
    page.selectedWeeks = 12;
    expect(localFee('SSP特殊学习许可')?.quantity).toBe(0);
    expect(student().localFees.find(fee => fee.item.startsWith('SSP特殊学习许可'))?.waived).toBeTrue();
    expect(localFee('旅游签续签')?.total).toBe(0);
  });

  it('shows fixed-length courses as one package price', () => {
    const course = page.courseFees.find(fee => fee.id === 'ielts-16-weeks-6-5')!;
    expect(page.listPrice(course)).toBe(4430);
    expect(page.coursePriceUnit(course)).toBe('/16周');
    const guarantee = page.courseFees.find(fee => fee.id === 'ielts-guarantee-8-weeks')!;
    expect(page.listPrice(guarantee)).toBe(3160);
    expect(page.coursePriceUnit(guarantee)).toBe('/8周');
  });

  it('links every course group, room profile and room price to the content document', () => {
    const content = createDefaultPhilinterContentConfig();
    const courses = new Set(content.courses.map(course => course.id));
    for (const group of PHILINTER_PAGE_PROFILE.courseGroups) {
      for (const id of group.courseIds) expect(courses.has(id)).withContext(id).toBeTrue();
    }
    const rooms = new Set(content.rooms.map(room => room.id));
    for (const profile of PHILINTER_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(rooms.has(id)).withContext(id).toBeTrue();
    }
    for (const room of content.rooms) expect(room.fee2027).withContext(room.id).toBeGreaterThan(0);
  });

  it('upgrades an older saved document once and keeps edited text', () => {
    const old = createDefaultPhilinterContentConfig() as CiaContentConfig & { quoteSettings: Record<string, unknown> };
    delete old.quoteSettings['philinterPolicyVersion'];
    old.courses = old.courses.filter(course => course.id !== 'pte');
    old.quoteImageSettings.footerNotes = ['自定义说明'];
    const upgraded = clonePhilinterContentConfig(old);
    expect(upgraded.courses.some(course => course.id === 'pte')).toBeTrue();
    expect(upgraded.quoteImageSettings.footerNotes).toEqual(['自定义说明']);
    expect(upgraded.quoteSettings.peakSeasonRanges.at(-1)).toEqual(jasmine.objectContaining({ start: '2027-07-04', enabled: true }));
  });
});
