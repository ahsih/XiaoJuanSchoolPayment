import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneGlcContentConfig, createDefaultGlcContentConfig, GLC_POLICY_VERSION } from './glc-content-config';
import { glcEslBookFee, glcExamBookFee, glcManagementFee } from './glc-page-quote';
import { GLC_PAGE_PROFILE } from './glc-page-profile';
import { GlcSchoolPageComponent } from './glc-school-page.component';

// GLC on the shared Philippine school template: the 2027 price list (one price for 2026 and 2027), the school's annual
// offer, the 思达启航 50 dollars per four weeks, the winter and summer 2027 rules and the 2027 local fees.
describe('GLC page on the shared template', () => {
  let page: GlcSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new GlcSchoolPageComponent());
    page.selectedStartDate = '2026-12-06';
    student().selectedRegistrationDate = '2026-11-25';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);
  const setCourse = (id: string) => {
    page.quotePlan.courses[0].optionId = id;
    student().planOptionChanged();
  };

  it('lists 4-week prices from the 2027 price list', () => {
    const course = page.courseFees.find(item => item.id === 'power-speaking');
    expect(course?.tuition).toBe(860);
    expect(page.listPrice(course!)).toBe(860);
    expect(page.roomFees.find(item => item.id === 'main-double')?.fee).toBe(1080);
    expect(page.courseFees.length).toBe(24);
    expect(page.roomFees.length).toBe(9);
  });

  it('takes the school offer, the 思达启航 offer and a free Sunday pickup off the school fees', () => {
    expect(page.selectedCourseId).toBe('power-speaking');
    expect(page.selectedRoomId).toBe('main-double');
    // 120 registration + 860 + 1,080 + 35 pickup − 150 school − 50 思达启航 − 35 free pickup
    expect(page.quote.quoteUsd).toBe(1860);
    expect(payment('学校年度优惠')?.amount).toBe('− 150 美元');
    expect(payment('思达启航专属优惠')?.amount).toBe('− 50 美元');
    expect(payment('周日免费接机')?.amount).toBe('− 35 美元');
    expect(page.quoteImageData.headingText).toContain('GLC 4周报价');
  });

  it('gives no school offer to Light Power Speaking but keeps the 思达启航 offer', () => {
    setCourse('light-power-speaking');
    expect(payment('学校年度优惠')).toBeUndefined();
    expect(payment('思达启航专属优惠')).toBeDefined();
  });

  it('charges 60 dollars a week for one to three weeks and no four-week offers', () => {
    page.selectedWeeks = 2;
    // 120 + 430 + 540 + 35 pickup + 120 short-stay charge; under 4 course weeks there is no free pickup
    expect(page.quote.quoteUsd).toBe(1245);
    expect(payment('短期附加费')?.amount).toBe('120 美元');
    expect(localFee('管理费')?.total).toBe(4000);
  });

  it('gives no offers in the 2027 winter and blocks minors there', () => {
    page.selectedStartDate = '2027-01-03';
    expect(page.quote.quoteError).toBe('');
    expect(page.quote.quoteUsd).toBe(120 + 860 + 1080 + 35);
    student().selectedAgeGroup = 'minor';
    expect(page.quote.quoteError).toContain('寒暑假');
  });

  it('needs at least four weeks in the 2027 summer', () => {
    page.selectedStartDate = '2027-07-04';
    page.selectedWeeks = 2;
    expect(page.quote.quoteError).toContain('2027暑假至少读4周');
    page.selectedWeeks = 4;
    expect(page.quote.quoteError).toBe('');
  });

  it('quotes a two-person family package as one family in a twin room', () => {
    setCourse('family-package-2');
    expect(page.quotePlan.rooms[0].optionId).toBe('main-double');
    // 240 registration + 1,640 package + 2 × 1,080 room + 70 pickup − 50 思达启航 − 70 free pickups
    expect(page.quote.quoteUsd).toBe(3990);
    expect(payment('学校年度优惠')).toBeUndefined();
    expect(localFee('SSP特殊学习许可证')?.total).toBe(16000);
    page.quote.setQuoteMode('group');
    expect(page.quote.quoteError).toContain('单人报价');
  });

  it('moves Sparta students into Annex2 and checks age rules', () => {
    setCourse('ultra-sparta-esl');
    expect(page.quotePlan.rooms[0].optionId).toBe('annex-single');
    setCourse('business-course');
    student().selectedAgeGroup = 'minor';
    expect(page.quote.quoteError).toContain('商务英语须满18岁');
    student().minorBand = '12-14';
    setCourse('junior-power-speaking-6');
    expect(page.quote.quoteError).toBe('');
    student().accompanied = false;
    student().planOptionChanged();
    expect(page.quotePlan.rooms[0].optionId).toBe('main-triple');
    expect(payment('未成年监护费')?.amount).toBe('600 美元');
  });

  it('estimates the 2027 local fees by visa and weeks', () => {
    // 59-day visa, 4 weeks: SSP 8,000 + E-Card 4,500 + management 6,000 + electricity 2,000 + ESL books 3,000
    expect(localTotal()).toBe(23500);
    expect(localFee('ACR I-CARD')?.quantity).toBe(0);
    student().visaType = 'tourist30';
    page.selectedWeeks = 6;
    expect(localFee('签证续签')?.total).toBe(4670);
    expect(localFee('ACR I-CARD')?.total).toBe(4000);
    expect(glcEslBookFee(9)).toBe(5000);
    expect(glcExamBookFee(12)).toBe(7500);
    expect(glcManagementFee(3, 6000)).toBe(5000);
    expect(glcManagementFee(6, 6000)).toBe(9000);
    expect(page.optionalFeeItems.map(item => item.amount)).toEqual(['3,000 比索']);
  });

  it('links every room profile to a priced room', () => {
    const ids = new Set(createDefaultGlcContentConfig().rooms.map(room => room.id));
    for (const profile of GLC_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(ids.has(id)).withContext(profile.id).toBeTrue();
    }
  });

  it('moves an old weekly-price document onto the 2027 list once', () => {
    const old = createDefaultGlcContentConfig();
    (old.quoteSettings as { glcPolicyVersion?: number }).glcPolicyVersion = undefined;
    old.courses = old.courses.map(course => ({ ...course, tuition: course.tuition / 4, tuition2027: 0 }));
    old.courses[1].enabled = false;
    const upgraded = cloneGlcContentConfig(old);
    expect(upgraded.courses.find(course => course.id === 'power-speaking')?.tuition).toBe(860);
    expect(upgraded.courses[1].enabled).toBeFalse();
    expect((upgraded.quoteSettings as { glcPolicyVersion?: number }).glcPolicyVersion).toBe(GLC_POLICY_VERSION);
    const saved = createDefaultGlcContentConfig();
    saved.courses[0].tuition = 900;
    expect(cloneGlcContentConfig(saved).courses[0].tuition2027).toBe(900);
  });
});
