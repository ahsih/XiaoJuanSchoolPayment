import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneBlueOceanContentConfig, createDefaultBlueOceanContentConfig } from './cboa-content-config';
import { CBOA_PAGE_PROFILE } from './cboa-page-profile';
import { CboaSchoolPageComponent } from './cboa-school-page.component';

// The Cebu Blue Ocean Academy page on the shared Philippine school template: prices and offers by registration date
// (2026 before 2027/02/01, 2027 from it), local fees by entry date, the school's own summer peak dates and the
// minor-student notice (no adult course under 18 from 2026/08/23).
describe('Cebu Blue Ocean (CBOA) school page on the shared template', () => {
  let page: CboaSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new CboaSchoolPageComponent());
    student().selectedRegistrationDate = '2026-11-01';
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('prices a 2026 registration at 2026 prices with the Sida rate and the off-season offer', () => {
    expect(page.selectedCourseId).toBe('intensive-esl');
    expect(page.selectedRoomId).toBe('egi-triple-ocean');
    // registration waived; 970 + 850 − 5% (91) − 150 off-season
    expect(page.quote.quoteUsd).toBe(1579);
    expect(payment('常规淡季优惠')?.amount).toBe('− 150 美元');
    expect(page.quoteImageData.headingText).toContain('蓝海CBOA');
    expect(page.quoteImageData.headingText).toContain('4周报价');
  });

  it('adds the 12-week and long-stay offers for 2026 registrations', () => {
    page.selectedWeeks = 16;
    // 970×4 + 850×4 = 7,280; − 364 Sida − 4×150 − 100 (12 weeks) − 100 (16 weeks)
    expect(page.quote.quoteUsd).toBe(7280 - 364 - 600 - 100 - 100);
  });

  it('uses 2027 prices and the 2027 offers for registrations from 2027/02/01', () => {
    student().selectedRegistrationDate = '2027-02-10';
    page.selectedStartDate = '2027-03-07';
    // 1,020 + 850 − 93.5 − 4×25
    expect(page.quote.quoteUsd).toBeCloseTo(1676.5, 2);
    page.selectedWeeks = 12;
    // 5,610 − 280.5 − 12×25 − 100 long-term
    expect(page.quote.quoteUsd).toBeCloseTo(4929.5, 2);
    student().selectedRegistrationDate = '2027-07-01';
    // After the 2027 offer window only the Sida rate stays.
    expect(page.quote.quoteUsd).toBeCloseTo(5610 - 280.5, 2);
  });

  it('charges the 2027 summer peak at 60 dollars per unique week, outside every discount', () => {
    student().selectedRegistrationDate = '2027-03-01';
    page.selectedStartDate = '2027-06-20';
    expect(student().seasonalSurcharge).toBe(180);
    student().selectedRegistrationDate = '2027-03-01';
    page.selectedStartDate = '2027-06-27';
    expect(student().seasonalSurcharge).toBe(240);
    expect(page.quote.quoteUsd).toBeCloseTo(1870 + 240 - 93.5, 2);
  });

  it('offers EBE and the Couple Room only for 2027 registrations', () => {
    page.selectedCourseId = 'ebe';
    expect(student().quoteError).toContain('2027年新增');
    student().selectedRegistrationDate = '2027-02-01';
    expect(student().quoteError).toBe('');
    page.selectedCourseId = 'intensive-esl';
    page.selectedRoomId = 'ocean-suite-couple';
    expect(student().quoteError).toBe('');
    student().selectedRegistrationDate = '2027-01-31';
    expect(student().quoteError).toContain('2027年新增');
  });

  it('follows the minor notice and the family-course rules', () => {
    student().selectedAgeGroup = 'minor';
    expect(student().quoteError).toContain('未满18岁');
    page.selectedCourseId = 'junior';
    expect(student().quoteError).toBe('');
    student().selectedAgeGroup = 'adult';
    expect(student().quoteError).toContain('7–15岁');
    page.selectedCourseId = 'parents';
    page.selectedStartDate = '2027-07-04';
    expect(student().quoteError).toContain('暑期旺季');
  });

  it('limits Survival ESL to four weeks', () => {
    page.selectedCourseId = 'survival-esl';
    expect(student().quoteError).toBe('');
    page.selectedWeeks = 8;
    expect(student().quoteError).toContain('最多读4周');
  });

  it('estimates local fees by entry date, visa and room', () => {
    // 4 weeks, 59-day visa: SSP 7,800 + SSP I-CARD 4,500 + management 4×500 + books 1,500 + ID 300.
    expect(page.quote.estimatedLocalFeeTotal).toBe(7800 + 4500 + 2000 + 1500 + 300);
    page.selectedStartDate = '2027-03-07';
    expect(localFee('管理费')).toBe(2800);
    page.selectedRoomId = 'ocean-suite-deluxe';
    expect(localFee('Ocean Suites')).toBe(4000);
    // ACR I-CARD comes with the first extension: a 30-day visa for 6 weeks pays it, a 59-day visa for 8 weeks does not.
    student().visaType = 'tourist30';
    page.selectedWeeks = 4;
    expect(localFee('ACR I-CARD')).toBe(0);
    page.selectedWeeks = 6;
    expect(localFee('签证续签')).toBe(5140);
    expect(localFee('ACR I-CARD')).toBe(4000);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(5140 + 6410);
    expect(localFee('ACR I-CARD')).toBe(4000);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')).toBe(6410);
    expect(localFee('ACR I-CARD')).toBe(4000);
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('ACR I-CARD')).toBe(0);
  });

  it('upgrades a document saved before the 2027 price list once', () => {
    const old = createDefaultBlueOceanContentConfig();
    old.courses = old.courses.filter(course => course.id !== 'ebe').map(course => ({ ...course, tuition2027: course.tuition }));
    old.quoteSettings.peakSeasonRanges = [{ id: '2027', label: '2027', start: '2027-07-04', end: '2027-08-28', enabled: true }];
    (old.quoteSettings as { cboaPolicyVersion?: number }).cboaPolicyVersion = 0;
    const upgraded = cloneBlueOceanContentConfig(old);
    expect(upgraded.courses.some(course => course.id === 'ebe')).toBeTrue();
    expect(upgraded.courses.find(course => course.id === 'intensive-esl')?.tuition2027).toBe(1020);
    expect(upgraded.quoteSettings.peakSeasonRanges.find(range => range.id === '2027')?.start).toBe('2027-06-27');
  });

  it('links every Ocean Suites single room to its photos and its own video, and the three EGI rooms to the EGI photos', () => {
    const egi = CBOA_PAGE_PROFILE.roomProfiles.find(profile => profile.id === 'egi');
    expect(egi?.rateIds).toEqual(['egi-twin-ocean', 'egi-twin-city', 'egi-triple-ocean']);
    expect(Object.keys(egi?.variants ?? {})).toEqual(['EGI-TO', 'EGI-TC', 'EGI-3']);
    expect(egi?.gallery).toEqual(['01', '02', '03'].map(n => `assets/cebu-blue-ocean/rooms/egi-${n}.webp`));
    expect(CBOA_PAGE_PROFILE.roomVideos?.['egi']?.src).toBe('/assets/cebu-blue-ocean/videos/egi-rooms.mp4');
    expect(CBOA_PAGE_PROFILE.videoTabs?.map(tab => tab.label)).toEqual(['校园视频', '课程视频', '学员访谈', '宿舍视频']);
    expect(CBOA_PAGE_PROFILE.videoTabs?.[0].items[0].src).toBe('/assets/cebu-blue-ocean/videos/campus-tour.mp4');
    for (const profile of CBOA_PAGE_PROFILE.roomProfiles.filter(item => item.id !== 'egi')) {
      expect(profile.rateIds?.length).withContext(profile.id).toBe(1);
      expect(CBOA_PAGE_PROFILE.roomVideos?.[profile.id]?.src).withContext(profile.id).toMatch(/^\/assets\/cebu-blue-ocean\/videos\/ocean-suites-[a-z-]+\.mp4$/);
      for (const src of profile.gallery) expect(src).toMatch(/^assets\/cebu-blue-ocean\/rooms\/[a-z-]+-0\d\.webp$/);
    }
    const roomIds = createDefaultBlueOceanContentConfig().rooms.map(room => room.id);
    for (const id of CBOA_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? [])) expect(roomIds).toContain(id);
  });

  it('shows the school refund rule, then the 思达启航 deposit rule, and no agency terms', () => {
    const refund = CBOA_PAGE_PROFILE.copy.refund;
    expect(refund?.groups.map(group => group.title)).toEqual(['报名与入学前', '到校以后']);
    const text = JSON.stringify(refund);
    expect(text).toContain('70%');
    expect(text).toContain('2,000元人民币');
    expect(text).not.toMatch(/中介|代理|佣金/);
  });
});
