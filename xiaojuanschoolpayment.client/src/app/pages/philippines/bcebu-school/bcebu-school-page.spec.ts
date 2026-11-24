import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneBCebuContentConfig, createDefaultBCebuContentConfig } from './bcebu-content-config';
import { BCEBU_PAGE_PROFILE } from './bcebu-page-profile';
import { BCebuSchoolPageComponent } from './bcebu-school-page.component';

// The B'Cebu page on the shared Philippine school template: the 2026 price list, the 2027 off-season and
// summer notices and the 2026-10-19 orientation local fees.
describe("B'Cebu school page on the shared template", () => {
  let page: BCebuSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new BCebuSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const plan = () => student().quotePlan;
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('prices the default four-week Speed ESL plan with the 2026 off-season and Sida offers', () => {
    expect(page.selectedCourseId).toBe('speed-esl');
    expect(page.selectedRoomId).toBe('triple-bunk');
    // 900 + 750 − 15% off-season (247.5) − 10% Sida (140.25); registration waived
    expect(student().registration).toBe(0);
    expect(student().registrationWaiverName).toBe('思达启航免注册费');
    expect(page.quote.quoteUsd).toBe(1262.25);
    expect(payment('2026秋冬淡季优惠')).toBeDefined();
    expect(payment('思达启航折扣')).toBeDefined();
    expect(page.quoteImageData.headingText).toContain("B'Cebu");
    expect(page.quoteImageData.headingText).toContain('4周报价');
  });

  it('matches the confirmed 12-week reporter example', () => {
    page.selectedWeeks = 12;
    plan().splitStay('course');
    plan().setStayPeriodWeeks('course', plan().courses[0].id, 4);
    plan().courses[1].optionId = 'business-english';
    expect(plan().courses.map(row => [row.optionId, row.weeks])).toEqual([['speed-esl', 4], ['business-english', 8]]);
    expect(plan().rooms.map(row => row.weeks)).toEqual([12]);
    expect(student().reporterAvailable).toBeTrue();
    student().reporter = true;
    // 5,250 − 100 long stay − 300 reporter, then 15% off and 10% off
    expect(student().longStayDiscount).toBe(100);
    expect(student().reporterDiscount).toBe(300);
    expect(page.quote.quoteUsd).toBe(3710.25);
    // Paid first without the reporter deduction, the difference refunded after graduation.
    expect(student().reporterPrepaid).toBe(3939.75);
    expect(student().extraPaymentNote).toContain('229.5');
    expect(student().quoteError).toBe('');
  });

  it('applies the 2027 off-season 10% and no reporter offer', () => {
    page.selectedStartDate = '2027-02-14';
    expect(student().offSeasonRule?.name).toBe('2027上半年淡季优惠');
    expect(student().reporterAvailable).toBeFalse();
    // 1,650 − 165 − 148.5
    expect(page.quote.quoteUsd).toBe(1336.5);
  });

  it('caps the family off-season offer at 10% and leaves out the reporter offer', () => {
    student().family = true;
    expect(student().reporterAvailable).toBeFalse();
    expect(page.quote.quoteUsd).toBe(1336.5);
  });

  it('adds the 40-dollar summer surcharge outside every discount and closes the 2+1 dorm in summer', () => {
    page.selectedStartDate = '2027-06-27';
    // 1,650 − 10% Sida (165) + 4 × 40; no off-season offer after 2027-06-21
    expect(student().seasonalSurcharge).toBe(160);
    expect(page.quote.quoteUsd).toBe(1645);
    expect(payment('暑假附加费')).toBeDefined();
    page.selectedRoomId = 'two-plus-one';
    expect(student().quoteError).toContain('2+1宿舍只在淡季开放');
    page.selectedStartDate = '2027-09-05';
    expect(student().quoteError).toBe('');
  });

  it('requires one 12-week term for IELTS Guarantee', () => {
    page.selectedCourseId = 'ielts-guarantee';
    expect(student().quoteError).toContain('每期12周');
    page.selectedWeeks = 12;
    expect(student().quoteError).toBe('');
  });

  it('charges high-school students the Junior ESL tuition plus the minor fee, without adult offers', () => {
    student().selectedAgeGroup = 'minor';
    student().minorStage = 'high';
    // 1,250 Junior tuition + 750 room − 10% Sida + 50 × 4 minor fee
    expect(student().minorFee).toBe(200);
    expect(student().offSeasonDiscount).toBe(0);
    expect(page.quote.quoteUsd).toBe(2000);
    expect(payment('未成年管理费')).toBeDefined();
    page.selectedCourseId = 'junior-esl';
    expect(student().quoteError).toContain('Junior ESL只接收小学和初中学生');
    student().minorStage = 'junior';
    expect(student().quoteError).toBe('');
    expect(student().minorFee).toBe(400);
    student().family = true;
    expect(student().minorFee).toBe(0);
  });

  it('limits Kids Center to accompanied 4–6-year-olds in the family rooms', () => {
    student().selectedAgeGroup = 'minor';
    student().minorStage = 'kids';
    expect(student().quoteError).toContain('请选Kids Center');
    page.selectedCourseId = 'kindergarten';
    expect(student().quoteError).toContain('须家长陪同');
    student().family = true;
    expect(student().quoteError).toBe('');
    page.selectedRoomId = 'single-garden-view';
    expect(student().quoteError).toContain('Kids Center只可住');
  });

  it('estimates local fees from the orientation sheet', () => {
    // 4 weeks, 59-day visa: SSP, E-card, management, electricity, water, books, ID; no extension yet.
    expect(page.quote.estimatedLocalFeeTotal).toBe(7800 + 4500 + 2000 + 2000 + 2000 + 2000 + 200);
    student().visaType = 'tourist30';
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(5130);
    expect(localFee('ARP')).toBe(200);
    // ACR I-CARD comes with the first extension (user rule 2026-11-24), so a 30-day visa pays it from week 5.
    expect(localFee('ACR')).toBe(4000);
    page.selectedWeeks = 4;
    expect(localFee('ACR')).toBe(0);
    page.selectedWeeks = 8;
    page.selectedStartDate = '2027-01-03';
    expect(localFee('ARP')).toBe(700);
    student().visaType = 'tourist59';
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(6400);
    expect(localFee('ACR')).toBe(4000);
    expect(student().dormDeposit).toBe(5000);
    page.selectedWeeks = 8;
    expect(localFee('ACR')).toBe(0);
  });

  it('upgrades a document saved before the 2026-11 pack once and keeps employee edits', () => {
    const old = createDefaultBCebuContentConfig();
    old.courses.find(item => item.id === 'ielts-guarantee')!.name = 'IELTS GUARANTEE';
    old.courses.find(item => item.id === 'kindergarten')!.name = '员工改过的名字';
    old.localFees.find(rule => rule.id === 'management')!.amount = 400;
    old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => !rule.id.startsWith('bcebu-off-season-2027'));
    old.quoteSettings.peakSeasonRanges = old.quoteSettings.peakSeasonRanges.filter(range => range.id !== 'bcebu-summer-2027');
    (old.quoteSettings as { bcebuPolicyVersion?: number }).bcebuPolicyVersion = 1;
    const upgraded = cloneBCebuContentConfig(old);
    const course = (id: string) => upgraded.courses.find(item => item.id === id)!;
    expect(course('ielts-guarantee').name).toBe('IELTS Guarantee 雅思保证班');
    expect(course('kindergarten').name).toBe('员工改过的名字');
    expect(upgraded.localFees.find(rule => rule.id === 'management')!.amount).toBe(500);
    expect(upgraded.quoteSettings.promotions.some(rule => rule.id === 'bcebu-off-season-2027-spring')).toBeTrue();
    expect(upgraded.quoteSettings.peakSeasonRanges.some(range => range.id === 'bcebu-summer-2027')).toBeTrue();
    const again = cloneBCebuContentConfig(upgraded);
    expect(again.courses.find(item => item.id === 'kindergarten')!.name).toBe('员工改过的名字');
  });

  it('moves an untouched over-59-days ACR note to the first-extension wording once', () => {
    const saved = createDefaultBCebuContentConfig();
    const oldNote = '在菲律宾停留超过59天（约第9周起）须办理，须本人到移民局拍照和录指纹，学校统一安排。';
    saved.localFees.find(rule => rule.id === 'acr-i-card')!.note = oldNote;
    saved.quoteImageSettings.localFeeNotes['acr-i-card'] = oldNote;
    delete (saved.quoteSettings as { acrNoteVersion?: number }).acrNoteVersion;
    const upgraded = cloneBCebuContentConfig(saved);
    expect(upgraded.localFees.find(rule => rule.id === 'acr-i-card')!.note).toContain('第一次签证续签时办理');
    expect(upgraded.quoteImageSettings.localFeeNotes['acr-i-card']).toContain('第一次签证续签时办理');
    const edited = cloneBCebuContentConfig(upgraded);
    edited.localFees.find(rule => rule.id === 'acr-i-card')!.note = oldNote;
    expect(cloneBCebuContentConfig(edited).localFees.find(rule => rule.id === 'acr-i-card')!.note).toBe(oldNote);
  });

  it('lists every course in a group and every room in a room profile', () => {
    const defaults = createDefaultBCebuContentConfig();
    const grouped = BCEBU_PAGE_PROFILE.courseGroups.flatMap(group => group.courseIds);
    for (const item of defaults.courses) expect(grouped).withContext(item.id).toContain(item.id);
    const profiled = BCEBU_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? []);
    for (const room of defaults.rooms) expect(profiled).withContext(room.id).toContain(room.id);
  });
});
