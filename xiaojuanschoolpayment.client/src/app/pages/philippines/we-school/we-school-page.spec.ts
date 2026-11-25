import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { createDefaultWeContentConfig } from './we-content-config';
import { WE_PAGE_PROFILE } from './we-page-profile';
import { WeSchoolPageComponent } from './we-school-page.component';

// The Clark WE Academy page on the shared Philippine school template: the 2027 price list, the 2027
// off-season promotion (March–June), the busy-season deposit and WE's local fees.
describe('WE school page on the shared template', () => {
  let page: WeSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new WeSchoolPageComponent());
    page.selectedStartDate = '2027-03-07';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('takes the Sida 10% off the full price, then the 2027 course and room offers', () => {
    expect(page.selectedCourseId).toBe('esl-4');
    expect(page.selectedRoomId).toBe('dorm-twin');
    // 100 registration + 750 + 850 − 10% of 1,600 − 4 × 50 course − 4 × 50 room
    expect(page.quote.quoteUsd).toBe(1140);
    expect(payment('2027淡季课程优惠')?.amount).toBe('− 200 美元');
    expect(payment('2027淡季住宿优惠')?.amount).toBe('− 200 美元');
    expect(payment('思达启航折扣')?.amount).toBe('− 160 美元');
    expect(payment('免费外教选修小组课')?.amount).toBe('赠送');
    expect(student().extraPaymentNote).toBe('');
    expect(page.quoteImageData.headingText).toContain('WE');
    expect(page.quoteImageData.headingText).toContain('4周报价');
  });

  it('prices one to three weeks at 35/60/80% of four weeks', () => {
    page.selectedWeeks = 2;
    // 100 + 450 + 510 − 10% of 960 − 2 × 50 − 2 × 50
    expect(page.quote.quoteUsd).toBe(764);
  });

  it('gives no school offer in the busy season and asks for the 300-dollar deposit', () => {
    page.selectedStartDate = '2026-12-06';
    expect(page.quote.quoteUsd).toBe(100 + 1600 - 160);
    expect(payment('2027淡季课程优惠')).toBeUndefined();
    expect(student().extraPaymentNote).toContain('押金300美元');
    expect(student().seasonalSurcharge).toBe(0);
  });

  it('takes 5% instead of 10% for a busy-season WE Residence stay and needs four weeks there', () => {
    page.selectedStartDate = '2027-07-04';
    page.selectedCourseId = 'esl-3';
    page.selectedRoomId = 'residence-two-queen-2';
    expect(student().quoteError).toBe('');
    // 100 + 650 + 1,400 − 5% of 2,050
    expect(page.quote.quoteUsd).toBeCloseTo(2047.5, 1);
    page.selectedWeeks = 2;
    expect(student().quoteError).toContain('须住满4周');
  });

  it('lets a WE Residence parent stay without classes, but not in the dormitory', () => {
    page.selectedCourseId = 'guardian-no-class';
    expect(student().quoteError).toContain('仅限住WE公寓');
    page.selectedRoomId = 'residence-one-queen-1';
    expect(student().quoteError).toBe('');
    // 100 + 1,700 − 4 × 50 room offer; no tuition and no Sida discount without a class
    expect(page.quote.quoteUsd).toBe(1600);
    expect(payment('思达启航折扣')).toBeUndefined();
    expect(localFee('SSP特殊学习许可')).toBe(0);
    expect(localFee('学生证')).toBe(300);
  });

  it('checks course, age and room combinations', () => {
    page.selectedCourseId = 'junior-esl';
    expect(student().quoteError).toContain('只收未成年学生');
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toBe('');
    page.selectedRoomId = 'dorm-single';
    expect(student().quoteError).toContain('不能住宿舍单人间');
    page.selectedCourseId = 'esl-3';
    page.selectedRoomId = 'dorm-twin';
    expect(student().quoteError).toContain('成年监护人');
  });

  it('estimates local fees by stay length and visa', () => {
    // 4 weeks, 59-day visa: SSP, E-card, dormitory service and ID; no extension or ACR yet.
    expect(page.quote.estimatedLocalFeeTotal).toBe(7800 + 4000 + 4 * 500 + 300);
    student().visaType = 'tourist30';
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(4800);
    expect(localFee('ACR I-CARD')).toBe(0);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')).toBe(0);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(6000);
    expect(localFee('ACR I-CARD')).toBe(4000);
  });

  it('lists every room in a room profile and every video with its poster', () => {
    const rateIds = WE_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? [profile.id]);
    for (const room of createDefaultWeContentConfig().rooms) expect(rateIds).withContext(room.id).toContain(room.id);
    for (const card of WE_PAGE_PROFILE.videoCards) {
      expect(card.videoSrc).toMatch(/^\/assets\/we\/videos\/[a-z-]+\.mp4$/);
      expect(card.poster).toBe(card.videoSrc.replace(/([a-z-]+)\.mp4$/, 'poster-$1.jpg'));
    }
  });
});
