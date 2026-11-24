import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneAnjContentConfig, createDefaultAnjContentConfig } from './anj-content-config';
import { ANJ_PAGE_PROFILE } from './anj-page-profile';
import { AnjSchoolPageComponent } from './anj-school-page.component';

// A&J ECO Campus on the shared Philippine school template: the 2027 price list and course guide, the 2026–2027
// offer posters, the 2027 peak notice and the 2026-11 local-fee notice from the school's 2026-11-24 Drive pack.
describe('A&J ECO Campus page on the shared template', () => {
  let page: AnjSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new AnjSchoolPageComponent());
    page.selectedStartDate = '2026-11-29';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));

  it('takes the Sida 5% on the full price first, then the regular and low-season offers', () => {
    expect(page.selectedCourseId).toBe('eco-hub');
    expect(page.selectedRoomId).toBe('deluxe-triple');
    // 0 registration (Sida waiver) + 850 + 800 − 82.5 (5%) − 50 regular − 100 low season
    expect(page.quote.quoteUsd).toBe(1417.5);
    expect(payment('思达启航95折')?.amount).toBe('− 82.5 美元');
    expect(payment('常规优惠')?.note).toContain('本次按4周计算。');
    expect(page.schoolPaymentItems.every(row => !(row.note ?? '').includes('。；'))).toBeTrue();
    expect(page.quoteImageData.headingText).toContain('A&J 4周报价');
  });

  it('uses the December regular tiers, the 2026 low season and the 2026 birthday rule', () => {
    page.selectedStartDate = '2026-12-20';
    page.selectedWeeks = 8;
    student().birthMonth = 5;
    student().birthDay = 15;
    // 1,700 + 1,600 − 165 − 100 regular − 200 low season − 100 birthday (December: birth day ending 0, 1 or 5)
    expect(page.quote.quoteUsd).toBe(2735);
    student().birthDay = 14;
    expect(page.quote.quoteUsd).toBe(2835);
  });

  it('adds the year-end 300 dollars only for 12/06 and 12/13 arrivals of at least four weeks', () => {
    page.selectedStartDate = '2026-12-06';
    // 1,650 − 82.5 (5%) − 0 regular (4 weeks in December) − 100 low season − 300 year-end
    expect(page.quote.quoteUsd).toBe(1167.5);
    expect(payment('年末限定优惠')?.amount).toBe('− 300 美元');
    page.selectedStartDate = '2026-12-13';
    expect(page.quote.quoteUsd).toBe(1167.5);
    page.selectedStartDate = '2026-12-20';
    expect(payment('年末限定优惠')).toBeUndefined();
    page.selectedStartDate = '2026-12-13';
    page.selectedWeeks = 3;
    expect(payment('年末限定优惠')).toBeUndefined();
  });

  it('keeps 2027/02/28 arrivals on the regular offer; the 2027 low season starts with 03/07', () => {
    page.selectedStartDate = '2027-02-28';
    page.selectedWeeks = 8;
    // 1,700 + 1,600 − 165 − 100 regular, no low season
    expect(page.quote.quoteUsd).toBe(3035);
    expect(payment('2027淡季优惠')).toBeUndefined();
    page.selectedStartDate = '2027-03-07';
    // − 165 − 600 low season, no regular offer
    expect(page.quote.quoteUsd).toBe(2535);
  });

  it('shows an offer card only for rules of the content document', () => {
    const ids = new Set(createDefaultAnjContentConfig().quoteSettings.promotions.map(rule => rule.id));
    for (const card of ANJ_PAGE_PROFILE.offers ?? []) {
      for (const id of card.promotionIds ?? []) expect(ids.has(id)).withContext(card.title).toBeTrue();
    }
    expect(ANJ_PAGE_PROFILE.mobileAnchors.map(anchor => anchor.label)).toContain('优惠');
  });

  it('gives 300 dollars per four weeks in the 2027 low season and the birthday offer for the arrival month', () => {
    page.selectedStartDate = '2027-03-07';
    expect(page.quote.quoteUsd).toBe(1267.5);
    student().birthMonth = 3;
    expect(page.quote.quoteUsd).toBe(1167.5);
    expect(payment('生日优惠')).toBeDefined();
  });

  it('adds 60 dollars per 2027 summer study week outside every discount and needs four weeks', () => {
    page.selectedStartDate = '2027-06-27';
    expect(student().seasonalSurcharge).toBe(240);
    expect(page.quote.quoteUsd).toBe(1650 - 82.5 + 240);
    page.selectedWeeks = 3;
    expect(student().quoteError).toContain('至少报名4周');
  });

  it('prices the guarantee courses as whole packages of the allowed lengths', () => {
    page.selectedCourseId = 'ielts-guarantee';
    expect(student().quoteError).toContain('12、20、24周');
    page.selectedWeeks = 12;
    expect(student().quoteError).toBe('');
    expect(student().tuition).toBe(3150);
    const course = page.courseFees.find(item => item.id === 'ielts-guarantee')!;
    expect(page.listPrice(course)).toBe(3150);
    expect(page.coursePriceUnit(course)).toBe('/12周');
  });

  it('gives one free official IELTS test for 12 weeks of the IELTS course', () => {
    page.selectedCourseId = 'test-ielts';
    expect(payment('送雅思官方考试')).toBeUndefined();
    page.selectedWeeks = 12;
    expect(payment('送雅思官方考试')?.amount).toBe('赠送');
  });

  it('shares a whole room among the group members who pick it', () => {
    page.selectedRoomId = 'premium-suite-twin';
    expect(student().quoteError).toContain('按整间计价');
    page.quote.setQuoteMode('group');
    page.studentCount = 2;
    const [first, second] = page.activeStudents;
    for (const member of [first, second]) {
      member.quotePlan.rooms[0].optionId = 'premium-suite-twin';
      member.quotePlan.updateStartDate('course', member.quotePlan.courses[0].id, '2026-11-29');
    }
    expect(first.quoteError).toBe('');
    expect(first.accommodation).toBe(1350);
    expect(localFee('水电费')?.total).toBe(4500);
  });

  it('blocks junior courses for adults', () => {
    page.selectedCourseId = 'junior-esl';
    expect(student().quoteError).toContain('青少年课程');
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toBe('');
  });

  it('estimates local fees like the 2026-11 local-fee notice', () => {
    expect(localFee('SSP特殊学习许可证')?.total).toBe(7800);
    expect(localFee('SSP E-Card')?.total).toBe(4500);
    expect(localFee('签证续签')?.quantity).toBe(0);
    expect(localFee('水电费')?.total).toBe(3000);
    expect(localFee('管理费')?.total).toBe(1500);
    expect(localFee('教材费 · ESL')?.total).toBe(1000);
    expect(localFee('BESA周日团体接机')?.total).toBe(3000);
    expect(page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(21000);
    // 59-day visa: 12 weeks 6,210, 16 weeks 10,450 (notice table)
    page.selectedWeeks = 12;
    expect(localFee('签证续签')?.total).toBe(6210);
    page.selectedWeeks = 16;
    expect(localFee('签证续签')?.total).toBe(10450);
    student().pickup = false;
    expect(localFee('BESA周日团体接机')).toBeUndefined();
  });

  it('charges Premium rooms the higher utility and maintenance fees', () => {
    page.selectedRoomId = 'premium-single';
    expect(localFee('水电费')?.total).toBe(4000);
    expect(localFee('管理费')?.total).toBe(2000);
  });

  it('links every room profile and room video to priced rooms', () => {
    const ids = new Set(createDefaultAnjContentConfig().rooms.map(room => room.id));
    const profiles = new Set(ANJ_PAGE_PROFILE.roomProfiles.map(profile => profile.id));
    for (const profile of ANJ_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(ids.has(id)).withContext(profile.id).toBeTrue();
    }
    const covered = ANJ_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? []);
    expect([...ids].every(id => covered.includes(id))).toBeTrue();
    expect(Object.keys(ANJ_PAGE_PROFILE.roomVideos ?? {}).every(id => profiles.has(id))).toBeTrue();
  });

  it('groups every clip in the hero album, vertical WeChat clips as tall videos', () => {
    const tabs = ANJ_PAGE_PROFILE.videoTabs ?? [];
    expect(tabs.map(tab => tab.label)).toEqual(['校园视频', '宿舍视频', '设施视频', '餐厅视频']);
    const items = tabs.flatMap(tab => tab.items);
    expect(items.length).toBe(22);
    expect(new Set(items.map(item => item.src)).size).toBe(22);
    expect(items.find(item => item.title === '便利店')?.shape).toBe('tall');
    expect(items.find(item => item.title === 'A&J ECO 校区介绍')?.shape).toBe('wide');
    expect(items.some(item => item.src.includes('复式') || item.title.includes('复式'))).toBeFalse();
  });

  it('upgrades a document saved before the 2026-11-24 pack once', () => {
    const old = createDefaultAnjContentConfig();
    delete (old.quoteSettings as { anjPolicyVersion?: number }).anjPolicyVersion;
    old.localFees = old.localFees.filter(fee => fee.id !== 'books-test');
    const upgraded = cloneAnjContentConfig(old);
    expect(upgraded.localFees.some(fee => fee.id === 'books-test')).toBeTrue();
    expect(cloneAnjContentConfig(upgraded)).toEqual(upgraded);
  });
});
