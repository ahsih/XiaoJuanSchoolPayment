import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneTargetContentConfig, createDefaultTargetContentConfig, isTargetContentConfig } from './target-content-config';
import { TARGET_PAGE_PROFILE } from './target-page-profile';
import { targetTextbookFee } from './target-page-quote';
import { TargetSchoolPageComponent } from './target-school-page.component';

// TARGET on the shared Philippine school template: the school's price list for applications from 2026/07/10 (course
// price = course + six-person room, other rooms as supplements), the campaign discount, the 2027 peak surcharge, the
// upgrade offer of the November 2026 notice and the 2026-07-10 local-fee sheet. Amounts are worked out by hand from
// the price list (docs/target-source-2026-11-26.md).
describe('TARGET page on the shared template', () => {
  let page: TargetSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new TargetSchoolPageComponent());
    page.selectedStartDate = '2027-03-07';
    student().selectedRegistrationDate = '2026-11-26';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label.startsWith(label));
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  it('single 4 weeks: TARGET 4 in a six-person room with the campaign discount, 思达启航 9折 and the upgrade', () => {
    expect(page.selectedCourseId).toBe('target4');
    expect(page.selectedRoomId).toBe('six');
    expect(student().tuition).toBe(1340);
    expect(student().accommodation).toBe(0);
    // 150 + 1,340 − 30 × 4 − (1,340 − 120) × 10%
    expect(page.quote.quoteUsd).toBe(1248);
    expect(payment('学校长期优惠')?.amount).toBe('− 120 美元');
    expect(payment('思达启航9折')?.amount).toBe('− 122 美元');
    expect(payment('限时尊享升级计划')?.note).toContain('TARGET 4 → TARGET 5');
    expect(page.quoteImageData.headingText).toContain('TARGET 4周报价');
  });

  it('single 12 weeks: TARGET 6 in a single room matches the price list and gets every upgrade step', () => {
    page.selectedStartDate = '2027-03-14';
    page.selectedCourseId = 'target6';
    page.selectedRoomId = 'single';
    page.selectedWeeks = 12;
    // price list: TARGET 6 single 12 weeks 6,060
    expect(student().tuition + student().accommodation).toBe(6060);
    // 150 + 6,060 − 35 × 12 − (6,060 − 420) × 10%
    expect(page.quote.quoteUsd).toBe(5226);
    const upgrade = payment('限时尊享升级计划')?.note ?? '';
    expect(upgrade).toContain('ULTIMATE 8');
    expect(upgrade).toContain('单人房没有更高房型');
    expect(upgrade).toContain('二选一');
  });

  it('short stays use the school 1/2/3-week columns', () => {
    page.selectedCourseId = 'lite4';
    page.selectedRoomId = 'quad';
    page.selectedWeeks = 2;
    // price list: LITE 4 quad 2 weeks 816
    expect(student().tuition + student().accommodation).toBe(816);
    page.selectedCourseId = 'ultimate8';
    page.selectedRoomId = 'triple';
    page.selectedWeeks = 1;
    // price list: ULTIMATE 8 triple 1 week 728
    expect(student().tuition + student().accommodation).toBe(728);
  });

  it('group of two, 8 weeks over the 2027 peak: surcharge waived, campaign only for the non-peak weeks, no upgrade', () => {
    page.setQuoteMode('group');
    page.studentCount = 2;
    for (const item of page.activeStudents) {
      item.selectedRegistrationDate = '2026-11-26';
      item.quotePlan.setStayStart('2027-07-04');
      item.quotePlan.setStayWeeks(8);
      item.quotePlan.courses.forEach(row => row.optionId = 'target5');
      item.quotePlan.rooms.forEach(row => row.optionId = 'twin');
    }
    const first = page.activeStudents[0];
    // price list: TARGET 5 twin 8 weeks 3,280; six peak weeks (07/04–08/14), two campaign weeks
    expect(first.tuition + first.accommodation).toBe(3280);
    expect(first.seasonalSurcharge).toBe(0);
    expect(first.campaignDiscount).toBe(60);
    // each: 150 + 3,280 − 60 − 322
    expect(first.quoteUsd).toBe(3048);
    expect(page.quote.quoteUsd).toBe(6096);
    expect(first.upgradeText).toBe('');
  });

  it('charges 40 dollars for each 2027 peak week of a stay under 8 weeks', () => {
    page.selectedStartDate = '2027-07-25';
    // weeks 07/25, 08/01 and 08/08 are peak; 08/15 is not
    expect(student().seasonalSurcharge).toBe(120);
    expect(student().campaignDiscount).toBe(30);
    // 150 + 1,340 + 120 − 30 − (1,340 + 120 − 30) × 10%
    expect(page.quote.quoteUsd).toBe(1437);
  });

  it('gives no upgrade to mixed courses, late registrations or entries after 2027/04/04', () => {
    page.selectedWeeks = 12;
    const plan = student().quotePlan;
    plan.splitStay('course');
    plan.courses[0].optionId = 'target6';
    plan.courses[1].optionId = 'target4';
    expect(student().upgradeText).toBe('');
    plan.courses[1].optionId = plan.courses[0].optionId;
    expect(student().upgradeText).not.toBe('');
    student().selectedRegistrationDate = '2026-12-01';
    expect(student().upgradeText).toBe('');
    student().selectedRegistrationDate = '2026-11-30';
    page.selectedStartDate = '2027-04-11';
    expect(student().upgradeText).toBe('');
  });

  it('upgrades every length from 4 weeks: course from 4, room from 8, the choice from 12', () => {
    page.selectedWeeks = 6;
    expect(student().upgradeText).toContain('TARGET 4 → TARGET 5');
    expect(student().upgradeText).not.toContain('房型');
    page.selectedWeeks = 10;
    expect(student().upgradeText).toContain('六人房 → 四人房');
    expect(student().upgradeText).not.toContain('二选一');
    page.selectedWeeks = 3;
    expect(student().upgradeText).toBe('');
  });

  it('adds the local fees by stay length and visa', () => {
    expect(localFee('签证续签')?.quantity).toBe(0);
    page.selectedWeeks = 5;
    // 30-day entry, 35 days: the first extension 6,410 and ACR I-CARD
    expect(localFee('签证续签')?.total).toBe(6410);
    expect(localFee('ACR I-CARD')?.quantity).toBe(1);
    page.selectedWeeks = 4;
    // SSP 7,800 + E-CARD 4,500 + books 2,000 + (600 + 200 + 500) × 4
    expect(localTotal()).toBe(19500);
    page.selectedWeeks = 12;
    // 30-day entry: two extensions 6,410 + 5,830 (the school steps from the first extension), ACR 4,300, books 4,000, utilities 1,300 × 12
    expect(localFee('签证续签')?.total).toBe(12240);
    expect(localFee('ACR I-CARD')?.quantity).toBe(1);
    expect(localTotal()).toBe(7800 + 4500 + 12240 + 4300 + 4000 + 15600);
    student().visaType = 'tourist59';
    // the school's table: 9–12 weeks one extension, 6,410
    expect(localFee('签证续签')?.total).toBe(6410);
    page.selectedWeeks = 26;
    // 59-day entry, 182 days: five extensions (four in the table, the fifth estimated at 5,800) and the exit clearance
    expect(localFee('签证续签')?.total).toBe(23870 + 5800);
    expect(localFee('离境清关')?.quantity).toBe(1);
    expect([1, 2, 4, 8, 12, 16].map(targetTextbookFee)).toEqual([500, 1000, 2000, 3000, 4000, 5000]);
  });

  it('keeps IELTS Guarantee to twelve weeks', () => {
    page.selectedCourseId = 'ielts-guarantee';
    expect(page.quote.quoteError).toContain('12周');
    page.selectedWeeks = 12;
    expect(page.quote.quoteError).toBe('');
  });

  it('upgrades an older TARGET document once and keeps a current one whole', () => {
    const saved = createDefaultTargetContentConfig();
    expect(isTargetContentConfig(saved)).toBeTrue();
    expect(cloneTargetContentConfig(saved)).toEqual(saved);
    const old = createDefaultTargetContentConfig();
    delete (old.quoteSettings as { targetPolicyVersion?: number }).targetPolicyVersion;
    old.rooms.forEach(item => item.fee = 0);
    old.localFees = old.localFees.filter(item => item.id !== 'ecc');
    const upgraded = cloneTargetContentConfig(old);
    expect(upgraded.rooms.find(item => item.id === 'single')?.fee).toBe(500);
    expect(upgraded.localFees.some(item => item.id === 'ecc')).toBeTrue();
    expect(TARGET_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? []).sort())
      .toEqual(['quad', 'single', 'six', 'triple', 'twin']);
  });
});
