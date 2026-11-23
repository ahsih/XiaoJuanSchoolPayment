import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { clonePinesContentConfig, createDefaultPinesContentConfig, PINES_POLICY_VERSION } from './pines-content-config';
import { PINES_PAGE_PROFILE } from './pines-page-profile';
import { PinesSchoolPageComponent, pinesRoomGroupNotes } from './pines-school-page.component';

// The PINES page on the shared Philippine template: prices and offers follow the registration date (2027 list from
// 2027-02-01), local fees the arrival date, as the school's 2026-11 pack says.
describe('PINES school page on the shared template', () => {
  let page: PinesSchoolPageComponent;

  const create = () => TestBed.runInInjectionContext(() => new PinesSchoolPageComponent());

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = create();
    page.students[0].selectedRegistrationDate = '2026-11-23';
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('prices the default four weeks with the 2026 list, the off-season offer and the Sida 95% rate', () => {
    expect(page.selectedCourseId).toBe('power-speaking');
    expect(page.selectedRoomId).toBe('quad');
    // registration waived; 930 + 700 − 5% of 1,630 − 150 off-season
    expect(page.quote.quoteUsd).toBe(1398.5);
    expect(payment('思达启航95折')?.amount).toBe('− 81.5 美元');
    expect(page.quoteImageData.headingText).toBe('PINES 4周报价');
  });

  it('adds the 12-week offer for 2026-list registrations', () => {
    page.selectedWeeks = 12;
    // 2,790 + 2,100 − 5% of 4,890 − 450 off-season − 100 twelve weeks
    expect(page.quote.quoteUsd).toBe(4095.5);
  });

  it('uses the 2027 list and offers for registrations from 2027-02-01', () => {
    student().selectedRegistrationDate = '2027-02-15';
    page.selectedStartDate = '2027-03-07';
    page.selectedWeeks = 12;
    // 2,940 + 2,100 − 5% of 5,040 − 12 × 25 regular − 100 long term
    expect(page.quote.quoteUsd).toBe(4388);
    expect(payment('2027常规优惠')).toBeDefined();
    expect(payment('常规优惠')).toBeUndefined();
  });

  it('charges 60 dollars a week in the 2027 summer peak season, outside every discount', () => {
    student().selectedRegistrationDate = '2027-02-15';
    page.selectedStartDate = '2027-06-27';
    expect(student().seasonalSurcharge).toBe(240);
    expect(payment('暑期旺季附加费')?.amount).toBe('240 美元');
    expect(payment('2027常规优惠')).toBeUndefined();
  });

  it('fixes guarantee courses to their package length and opens TOEIC Guarantee with the 2027 list', () => {
    page.selectedCourseId = 'ielts-guarantee-8-weeks-5-5-6-0';
    expect(student().quoteError).toContain('固定8周');
    page.selectedWeeks = 8;
    expect(student().quoteError).toBe('');
    expect(student().tuition).toBe(2900);
    page.selectedCourseId = 'toeic-guarantee-8-weeks';
    expect(student().quoteError).toContain('2027年2月1日起报名才开设');
    student().selectedRegistrationDate = '2027-02-01';
    expect(student().quoteError).toBe('');
    expect(student().tuition).toBe(2240);
  });

  it('quotes junior and parents courses in the summer peak at the normal price plus the peak surcharge', () => {
    student().selectedRegistrationDate = '2027-02-15';
    page.selectedStartDate = '2027-06-27';
    student().selectedAgeGroup = 'minor';
    page.selectedCourseId = 'junior-family-course';
    page.selectedRoomId = 'family-3br';
    expect(student().quoteError).toBe('');
    expect(student().tuition).toBe(1550);
    expect(student().seasonalSurcharge).toBe(240);
    student().selectedAgeGroup = 'adult';
    page.selectedCourseId = 'parents-course';
    expect(student().quoteError).toBe('');
    expect(student().seasonalSurcharge).toBe(240);
  });

  it('keeps students under 18 to the youth IELTS camp or the family course', () => {
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toContain('18岁以下不可报成人课程');
    page.selectedCourseId = 'global-youth-ielts';
    expect(student().quoteError).toContain('青少年宿舍');
    page.selectedRoomId = 'youth-4br';
    expect(student().quoteError).toBe('');
  });

  it('estimates 2027 local fees for arrivals from 2027-02-01', () => {
    student().selectedRegistrationDate = '2027-02-15';
    page.selectedStartDate = '2027-03-07';
    page.selectedWeeks = 12;
    expect(localFee('水电费')).toBe(11400);
    expect(localFee('宿舍维护费')).toBe(6000);
    expect(localFee('ACR')).toBe(4000);
    expect(localFee('签证续签')).toBe(6210);
    expect(localFee('教材费')).toBe(5700);
    expect(page.quote.estimatedLocalFeeTotal).toBe(7800 + 4500 + 4000 + 11400 + 6000 + 6210 + 5700 + 200);
  });

  it('counts one visa extension per four weeks beyond the entry visa', () => {
    student().visaType = 'tourist30';
    page.selectedWeeks = 8;
    expect(student().visaExtensionCount).toBe(1);
    page.selectedWeeks = 17;
    expect(student().visaExtensionCount).toBe(4);
    student().visaType = 'tourist59';
    page.selectedWeeks = 8;
    expect(student().visaExtensionCount).toBe(0);
    page.selectedWeeks = 9;
    expect(student().visaExtensionCount).toBe(1);
  });

  it('lists 2026 prices with the 2027 price inside each course until 2027-02-01', () => {
    jasmine.clock().install();
    try {
      jasmine.clock().mockDate(new Date(2026, 10, 23));
      const before = create();
      const speaking = before.courseFees.find(fee => fee.id === 'power-speaking')!;
      expect(before.listPrice(speaking)).toBe(930);
      expect(before.oldListPrice(speaking)).toBe(980);
      const guarantee = before.courseFees.find(fee => fee.id === 'ielts-guarantee-12-weeks-5-5-6-0')!;
      expect(before.listPrice(guarantee)).toBe(4050);
      expect(before.coursePriceUnit(guarantee)).toBe('/12周');
      const toeic = before.courseFees.find(fee => fee.id === 'toeic-guarantee-8-weeks')!;
      expect(before.listPrice(toeic)).toBe(2240);
      expect(before.oldListPrice(toeic)).toBeNull();
      expect(before.roomFeeFor('single-a')).toBe(1250);
      expect(pinesRoomGroupNotes(createDefaultPinesContentConfig().rooms)['单人间']).toContain('单人房A 1,300');

      jasmine.clock().mockDate(new Date(2027, 1, 1));
      const after = create();
      expect(after.listPrice(after.courseFees.find(fee => fee.id === 'power-speaking')!)).toBe(980);
      expect(after.oldListPrice(after.courseFees.find(fee => fee.id === 'power-speaking')!)).toBeNull();
      expect(after.roomFeeFor('single-a')).toBe(1300);
      expect(pinesRoomGroupNotes(createDefaultPinesContentConfig().rooms)).toEqual({});
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('upgrades a document saved before the 2026-11 school pack once', () => {
    const old = createDefaultPinesContentConfig();
    old.rooms = old.rooms.slice(0, 2);
    old.quoteImageSettings.serviceSectionTitle = '员工改过的标题';
    (old.quoteSettings as { pinesPolicyVersion?: number }).pinesPolicyVersion = 0;
    const upgraded = clonePinesContentConfig(old);
    expect(upgraded.rooms.length).toBe(createDefaultPinesContentConfig().rooms.length);
    expect((upgraded.quoteSettings as { pinesPolicyVersion?: number }).pinesPolicyVersion).toBe(PINES_POLICY_VERSION);
    expect(upgraded.quoteImageSettings.serviceSectionTitle).toBe('员工改过的标题');
  });

  it('links every price card to a room album and shows the school video', () => {
    const rooms = createDefaultPinesContentConfig().rooms.filter(room => room.id !== 'youth-4br');
    for (const room of rooms) {
      expect(PINES_PAGE_PROFILE.roomProfiles.some(profile => profile.rateIds?.includes(room.id))).withContext(room.id).toBeTrue();
    }
    // PINES rooms have no booking code, so each card must open its own album, not the first room's.
    for (const room of page.roomRateGroups.flatMap(group => group.rooms).filter(room => room.id !== 'youth-4br')) {
      expect(page.roomProfileForRate(room)?.rateIds).withContext(room.id).toContain(room.id);
    }
    expect(PINES_PAGE_PROFILE.videoTabs?.[0].items[0].src).toBe('/assets/pines/videos/campus-tour-2026.mp4');
    expect(PINES_PAGE_PROFILE.videoTabs?.map(tab => tab.label)).toEqual(['校园视频', '宿舍视频', '课程视频']);
    const profileIds = PINES_PAGE_PROFILE.roomProfiles.map(profile => profile.id);
    for (const id of Object.keys(PINES_PAGE_PROFILE.roomVideos ?? {})) expect(profileIds).withContext(id).toContain(id);
    expect(PINES_PAGE_PROFILE.holidayCalendars[0].months.map(month => month.month)).toEqual([3, 4]);
  });
});
