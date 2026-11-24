import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import {
  cloneImsContentConfig,
  createDefaultImsContentConfig,
  IMS_POLICY_VERSION,
  IMS_TWO_PLUS_TWO_RULE_ID,
} from './ims-content-config';
import { IMS_PAGE_PROFILE } from './ims-page-profile';
import { ImsSchoolPageComponent } from './ims-school-page.component';

// IMS Academy on the shared Philippine school template: the 2026 China price list, the 2026-07-01 local-fee sheet,
// the 2026-09-30 off-season and long-stay offers and the 2026-11-19 notice on the off-season 2+2 offer.
describe('IMS Academy page on the shared template', () => {
  let page: ImsSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new ImsSchoolPageComponent());
    // February and March 2027 are off-season.
    page.selectedStartDate = '2027-02-07';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  it('takes the Sida 5% off the full price, then 75 dollars per off-season week', () => {
    expect(page.selectedCourseId).toBe('essential-esl-4');
    expect(page.selectedRoomId).toBe('quadruple');
    // 100 registration + 700 + 650 − 5% of 1,350 − 4 × 75
    expect(page.quote.quoteError).toBe('');
    expect(page.quote.quoteUsd).toBe(1082.5);
    expect(payment('思达启航折扣')).toBeDefined();
    expect(payment('淡季优惠')).toBeDefined();
    expect(page.quoteImageData.headingText).toContain('IMS 4周报价');
  });

  it('charges the two-week price for the first four 2+2 weeks, without the 5% or the off-season offer there', () => {
    student().joinsTwoPlusTwo = true;
    // 100 + 1,350 − (1,350 − 60% of 1,350)
    expect(page.quote.quoteUsd).toBe(910);
    expect(payment('思达启航折扣')).toBeUndefined();
    expect(payment('淡季优惠')).toBeUndefined();
    expect(payment('2+2达人活动')).toBeDefined();
    page.selectedWeeks = 12;
    // 100 + 4,050 − 540 (2+2) − 5% of 2,700 − 8 × 75 − 50 (ten paid course weeks reach the 8-week tier)
    expect(page.quote.quoteUsd).toBe(2825);
  });

  it('gives the long-stay tier on paid course weeks', () => {
    page.selectedWeeks = 12;
    // 100 + 4,050 − 202.5 − 12 × 75 − 100
    expect(page.quote.quoteUsd).toBe(2947.5);
    page.selectedWeeks = 8;
    expect(payment('长期优惠')?.amount).toContain('50');
  });

  it('gives no off-season offer and no 2+2 in January, June, July or August', () => {
    page.selectedStartDate = '2027-06-06';
    student().joinsTwoPlusTwo = true;
    // 100 + 1,350 − 5% of 1,350
    expect(page.quote.quoteUsd).toBe(1382.5);
    expect(payment('2+2达人活动')).toBeUndefined();
    expect(payment('淡季优惠')).toBeUndefined();
    expect(IMS_PAGE_PROFILE.peakSeasonsWithoutSurcharge?.ranges.map(range => range.start)).toEqual(['2027-01-03', '2027-05-30']);
  });

  it('charges registration to every student, returning students too', () => {
    expect(student().hideReturning).toBeTrue();
    student().returningStudent = true;
    expect(student().registration).toBe(100);
  });

  it('prices one to three weeks at 30/60/80% of four weeks', () => {
    page.selectedWeeks = 1;
    expect(student().tuition).toBe(210);
    page.selectedWeeks = 2;
    expect(student().tuition).toBe(420);
    expect(student().accommodation).toBe(390);
    page.selectedWeeks = 3;
    expect(student().tuition).toBe(560);
    expect(payment('淡季优惠')).toBeUndefined();
  });

  it('sells the guarantee courses only as 12- to 24-week packages', () => {
    page.quotePlan.courses[0].optionId = 'ielts-guarantee';
    expect(page.quote.quoteError).toContain('12、16、20、24');
    page.selectedWeeks = 12;
    expect(page.quote.quoteError).toBe('');
    expect(student().tuition).toBe(3600);
    page.selectedWeeks = 16;
    expect(student().tuition).toBe(4700);
  });

  it('applies the brochure age rules for minors and adults', () => {
    student().selectedAgeGroup = 'minor';
    expect(page.quote.quoteError).toBe('');
    page.quotePlan.courses[0].optionId = 'opic';
    expect(page.quote.quoteError).toContain('只收成年学生');
    student().minorAge = '7-14';
    expect(page.quote.quoteError).toContain('Junior');
    page.quotePlan.courses[0].optionId = 'junior-esl-6';
    expect(page.quote.quoteError).toBe('');
    student().selectedAgeGroup = 'adult';
    expect(page.quote.quoteError).toContain('7–14岁');
  });

  it('adds the optional guardian service only in the off-season', () => {
    student().selectedAgeGroup = 'minor';
    student().minorService = 'guardian-service';
    expect(payment('监护服务 Guardian Service')?.amount).toContain('450');
    page.selectedStartDate = '2027-06-06';
    expect(page.quote.quoteError).toContain('淡季');
  });

  it('estimates local fees like the school sheet, without deposit and pickup', () => {
    expect(localTotal()).toBe(20300);
    page.selectedWeeks = 8;
    expect(localFee('签证续签')?.total).toBe(5050);
    expect(localFee('ACR I-CARD')?.total).toBe(4000);
    expect(localTotal()).toBe(34350);
    page.selectedWeeks = 12;
    expect(localTotal()).toBe(46150);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')?.total).toBe(6800);
    page.selectedWeeks = 8;
    expect(localFee('ACR I-CARD')?.quantity).toBe(0);
    expect(localTotal()).toBe(25300);
  });

  it('charges walk-in students no room, dormitory fees or deposit', () => {
    page.quotePlan.rooms[0].optionId = 'walk-in';
    expect(student().accommodation).toBe(0);
    expect(localFee('水费')?.quantity).toBe(0);
    expect(localTotal()).toBe(15300);
    expect(page.optionalFeeItems.map(item => item.label)).not.toContain('宿舍押金（可退）');
    expect(page.optionalFeeItems.map(item => item.label)).toContain('走读午餐');
  });

  it('lists deposit, pickup, drop-off and extra classes outside the total', () => {
    expect(page.optionalFeeItems.map(item => item.amount)).toEqual(['3,000 比索', '1,000 比索', '1,000 比索', '100–200 美元']);
  });

  it('links every room profile to a priced room', () => {
    const ids = new Set(createDefaultImsContentConfig().rooms.map(room => room.id));
    for (const profile of IMS_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(ids.has(id)).withContext(profile.id).toBeTrue();
    }
  });

  it('keeps a saved document unchanged when cloned and follows the editor price', () => {
    const saved = createDefaultImsContentConfig();
    expect(cloneImsContentConfig(saved)).toEqual(saved);
    saved.courses.find(course => course.id === 'essential-esl-4')!.tuition = 750;
    expect(cloneImsContentConfig(saved).courses.find(course => course.id === 'essential-esl-4')?.tuition2027).toBe(750);
  });

  it('moves a document saved for the former page onto the new names and offers once', () => {
    const old = createDefaultImsContentConfig();
    delete (old.quoteSettings as { imsPolicyVersion?: number }).imsPolicyVersion;
    const premium = old.courses.find(course => course.id === 'premium-esl')!;
    premium.name = 'Premium ESL';
    premium.tuition = 900;
    old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => rule.id !== IMS_TWO_PLUS_TWO_RULE_ID);
    const upgraded = cloneImsContentConfig(old);
    const course = upgraded.courses.find(item => item.id === 'premium-esl')!;
    expect(course.name).toBe('Premium ESL 精品通用英语');
    expect(course.tuition2027).toBe(900);
    expect(upgraded.quoteSettings.promotions.some(rule => rule.id === IMS_TWO_PLUS_TWO_RULE_ID)).toBeTrue();
    expect((upgraded.quoteSettings as { imsPolicyVersion?: number }).imsPolicyVersion).toBe(IMS_POLICY_VERSION);
  });
});
