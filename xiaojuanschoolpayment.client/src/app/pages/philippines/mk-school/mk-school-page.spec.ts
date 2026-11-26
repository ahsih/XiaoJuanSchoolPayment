import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneMkContentConfig, createDefaultMkContentConfig, isMkContentConfig } from './mk-content-config';
import { mkHalfPriceFactor, mkHalfPriceWeeks } from './mk-page-quote';
import { MkSchoolPageComponent } from './mk-school-page.component';

// The MK page on the shared Philippine school template: the 2027 price list (same as 2026), the 2026 half-price
// notice (MK_20260106), the 2027 dormitory notice (MK_20260801) with MK's own promotion sheets, and the local fees.
// The 思达启航 10% comes first, on the full course and room price; MK's offers follow.
describe('MK school page on the shared template', () => {
  let page: MkSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new MkSchoolPageComponent());
    page.selectedStartDate = '2027-01-03';
  });

  const student = () => page.students[0];
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('applies the 2027 dormitory offer as in MK\'s promotion sheet', () => {
    expect(page.selectedCourseId).toBe('esl-basic');
    expect(page.selectedRoomId).toBe('three-bed');
    // 100 registration + (650 + 600) × 0.9 − 444 (4-week dormitory deduction)
    expect(page.quote.quoteUsd).toBe(781);
    expect(student().paymentLines.map(line => line.value)).toEqual([-125, -444]);
    page.selectedWeeks = 8;
    // From 8 weeks the 3-bed room is free: 100 + 2,500 × 0.9 − 1,200
    expect(page.quote.quoteUsd).toBe(1150);
    page.selectedRoomId = 'one-bed';
    // The single room: 100 + (1,300 + 1,980) × 0.9 − 1,200
    expect(page.quote.quoteUsd).toBe(1852);
    expect(page.quoteImageData.headingText).toContain('MK 8周报价');
  });

  it('follows MK\'s sheet for the 4-bed room, where the deduction exceeds the room fee', () => {
    page.selectedCourseId = 'guardian';
    page.selectedRoomId = 'four-bed';
    page.selectedWeeks = 8;
    // 100 + (1,140 + 1,040) × 0.9 − 1,200 = 862
    expect(page.quote.quoteUsd).toBe(862);
  });

  it('charges half the weeks for 2026 arrivals, rounding odd short stays up', () => {
    page.selectedStartDate = '2026-11-29';
    // 100 + 1,250 × 0.9 × 0.65 (the 2-week price for 4 weeks)
    expect(page.quote.quoteUsd).toBe(831.25);
    page.selectedWeeks = 8;
    expect(page.quote.quoteUsd).toBe(1225);
    page.selectedWeeks = 5;
    // 5 weeks pay the 3-week price: 100 + 1,250 × 0.85 × 0.9
    expect(student().quoteError).toBe('');
    expect(page.quote.quoteUsd).toBe(1056.25);
    expect([1, 3, 5, 7, 9].map(mkHalfPriceWeeks)).toEqual([1, 2, 3, 4, 4.5]);
    expect(mkHalfPriceFactor(2, { '1': 0.4, '2': 0.65, '3': 0.85 })).toBeCloseTo(0.4 / 0.65, 6);
  });

  it('waives registration for returning students', () => {
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(681);
  });

  it('adds TESOL outside the offers and warns about the WVSU SSP', () => {
    student().tesol = true;
    expect(page.quote.quoteUsd).toBe(1131);
    expect(student().extraPaymentNote).toContain('WVSU');
    page.selectedCourseId = 'junior-basic';
    expect(student().quoteError).toContain('TESOL须同时报综合英语或雅思课程');
  });

  it('blocks adult-only courses for minors and short IELTS Guarantee plans', () => {
    page.selectedCourseId = 'business';
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toContain('只接受18岁以上学生');
    student().selectedAgeGroup = 'adult';
    page.selectedCourseId = 'ielts-guarantee';
    page.selectedWeeks = 8;
    expect(student().quoteError).toContain('须至少就读12周');
    page.selectedWeeks = 12;
    expect(student().quoteError).toBe('');
  });

  it('estimates visa and monthly local fees from the stay', () => {
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('ACR')).toBe(0);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(6420);
    expect(localFee('ACR')).toBe(4300);
    expect(localFee('管理费')).toBe(3000);
    expect(localFee('电费')).toBe(9000);
    student().visaType = 'tourist30';
    expect(localFee('签证续签')).toBe(5040 + 6420);
    // A 30-day visa needs its first extension and the ACR I-Card from week 5.
    page.selectedWeeks = 6;
    expect(localFee('签证续签')).toBe(5040);
    expect(localFee('ACR')).toBe(4300);
    student().visaType = 'student';
    expect(localFee('SSP特殊学习许可')).toBe(0);
  });

  it('keeps its content document valid', () => {
    const content = createDefaultMkContentConfig();
    expect(isMkContentConfig(content)).toBeTrue();
    expect(cloneMkContentConfig(content)).toEqual(content);
  });
});
