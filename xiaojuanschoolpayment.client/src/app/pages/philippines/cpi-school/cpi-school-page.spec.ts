import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneCpiContentConfig, createDefaultCpiContentConfig } from './cpi-content-config';
import { CPI_PAGE_PROFILE } from './cpi-page-profile';
import { CpiSchoolPageComponent, cpiCourseId, cpiRoomId } from './cpi-school-page.component';

// The CPI page on the shared Philippine school template: the 2027 price list (same as 2026), the
// 2026-11-04 promotion notice, Premium Residence opening dates and the orientation local fees.
describe('CPI school page on the shared template', () => {
  let page: CpiSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new CpiSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;

  it('prices the default four-week ESL plan with the Sida 10% and off-season offers', () => {
    expect(page.selectedCourseId).toBe('esl-general-15');
    expect(page.selectedRoomId).toBe('building-a-quad');
    // 100 registration + 900 + 770 − 167 (10%) − 4 × 25 off-season
    expect(page.quote.quoteUsd).toBe(1503);
    expect(payment('思达启航折扣')?.amount).toBe('− 167 美元');
    expect(page.quoteImageData.headingText).toContain('CPI');
    expect(page.quoteImageData.headingText).toContain('4周报价');
  });

  it('adds the December offer and the Premium Residence opening offer per week', () => {
    page.selectedStartDate = '2026-11-29';
    expect(page.quote.quoteUsd).toBe(1403);
    page.selectedRoomId = 'premium-single';
    // 100 + 900 + 1,595 − 249.5 − 100 off-season − 100 December − 100 Premium
    expect(page.quote.quoteUsd).toBeCloseTo(2045.5, 1);
    expect(student().quoteError).toBe('');
  });

  it('accepts Premium Residence stays only inside the opening periods', () => {
    page.selectedRoomId = 'premium-double';
    page.selectedStartDate = '2027-01-10';
    expect(student().quoteError).toContain('Premium公寓目前只接受');
    page.selectedStartDate = '2027-02-28';
    expect(student().quoteError).toBe('');
    page.selectedStartDate = '2027-07-04';
    expect(student().quoteError).toContain('Premium公寓目前只接受');
  });

  it('shows the limited extra class as a non-cash gift', () => {
    page.selectedStartDate = '2027-02-28';
    expect(payment('限量一对一加课')?.amount).toBe('赠送');
    expect(page.quoteImageData.paymentItems.find(row => row.label === '限量一对一加课')?.amount).toBe('赠送');
    page.selectedStartDate = '2027-04-04';
    expect(payment('限量一对一加课')).toBeUndefined();
  });

  it('has no peak-season surcharge', () => {
    page.selectedStartDate = '2027-07-04';
    page.selectedWeeks = 8;
    expect(student().seasonalSurcharge).toBe(0);
    expect(payment('旺季附加费')).toBeUndefined();
  });

  it('limits Junior and Diet courses to the family rooms', () => {
    page.selectedCourseId = 'junior-6-15';
    expect(student().quoteError).toContain('青少年课程和家长课程只可搭配');
    page.selectedRoomId = 'building-b-quad';
    expect(student().quoteError).toBe('');
  });

  it('requires 12 weeks for the IELTS Guarantee course', () => {
    page.selectedCourseId = 'ielts-guarantee';
    page.selectedWeeks = 8;
    expect(student().quoteError).toContain('至少就读12周');
    page.selectedWeeks = 12;
    expect(student().quoteError).toBe('');
  });

  it('estimates local fees from the orientation sheet', () => {
    // 4 weeks, 59-day visa: SSP, E-card, management, water, electricity, books, ID; no extension yet.
    expect(page.quote.estimatedLocalFeeTotal).toBe(7800 + 4500 + 1000 + 1500 + 2000 + 2000 + 350);
    student().visaType = 'tourist30';
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(5140);
    expect(localFee('ACR-I CARD')).toBe(4500);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')).toBe(0);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(6410);
  });

  it('upgrades a document saved before the 2027 notice once', () => {
    const old = createDefaultCpiContentConfig();
    old.courses[0].name = 'ESL GENERAL（15岁以上）';
    old.rooms = old.rooms.filter(room => !room.id.startsWith('premium'));
    old.quoteSettings.promotions = old.quoteSettings.promotions.filter(rule => !rule.id.startsWith('cpi-premium'));
    (old.quoteSettings as { cpiPolicyVersion?: number }).cpiPolicyVersion = 0;
    const upgraded = cloneCpiContentConfig(old);
    expect(upgraded.courses[0].name).toBe('一般英语 ESL GENERAL');
    expect(upgraded.rooms.some(room => room.id === 'premium-single')).toBeTrue();
    expect(upgraded.quoteSettings.promotions.some(rule => rule.id === 'cpi-premium-opening-2026')).toBeTrue();
  });

  it('replaces only untouched version-1 exam course lines and the 8-week textbook estimate', () => {
    const old = createDefaultCpiContentConfig();
    const general = old.courses.find(item => item.id === 'ielts-general')!;
    general.schedule = '4节考试一对一 + 2节小组课（1:4，考试与ESL各1节）+ 2节考试团体课';
    general.note = '一对一全部为考试课，每天另有2节考试团体课。';
    const edited = old.courses.find(item => item.id === 'toeic-general')!;
    edited.schedule = '员工改过的课表';
    Object.assign(old.localFees.find(rule => rule.id === 'books')!, { periodWeeks: 8 });
    (old.quoteSettings as { cpiPolicyVersion?: number }).cpiPolicyVersion = 1;
    const upgraded = cloneCpiContentConfig(old);
    const course = (id: string) => upgraded.courses.find(item => item.id === id)!;
    expect(course('ielts-general').schedule).toBe('4节一对一（雅思全科目）+ 2节小组课（1:4，雅思与ESL各1节）+ 2节团体考试课');
    expect(course('ielts-general').note).toContain('听说读写');
    expect(course('toeic-general').schedule).toBe('员工改过的课表');
    expect(upgraded.localFees.find(rule => rule.id === 'books')!.periodWeeks).toBe(12);
  });

  it('shows the official videos with a poster and the year they were filmed', () => {
    expect(CPI_PAGE_PROFILE.videoCards.length).toBe(5);
    expect(CPI_PAGE_PROFILE.campusLifeVideos.length).toBe(12);
    for (const card of CPI_PAGE_PROFILE.videoCards) {
      expect(card.videoSrc).toMatch(/^\/assets\/cpi\/videos\/[a-z-]+\.mp4$/);
      expect(card.poster).toBe(card.videoSrc.replace(/([a-z-]+)\.mp4$/, 'poster-$1.jpg'));
      expect(card.details.some(detail => /20\d\d年/.test(detail))).withContext(card.title).toBeTrue();
    }
    for (const clip of CPI_PAGE_PROFILE.campusLifeVideos) {
      expect(clip.poster).toBe(clip.src.replace(/([a-z-]+)\.mp4$/, 'poster-$1.jpg'));
    }
    expect(page.copy.rooms.videoLink).toBeTruthy();
  });

  it('lists every video once in the hero album and opens the A-2 photos with its own clip', () => {
    const albumSources = (CPI_PAGE_PROFILE.videoTabs ?? []).flatMap(tab => tab.items.map(item => item.src));
    const allSources = [...CPI_PAGE_PROFILE.videoCards.map(card => card.videoSrc), ...CPI_PAGE_PROFILE.campusLifeVideos.map(clip => clip.src)];
    expect([...albumSources].sort()).toEqual([...allSources].sort());
    expect(CPI_PAGE_PROFILE.roomVideos?.['a-double']?.src).toBe('/assets/cpi/videos/room-a-double.mp4');
    expect(CPI_PAGE_PROFILE.roomProfiles.some(profile => profile.id === 'a-double')).toBeTrue();
  });

  it('maps database names to content ids and lists every room profile', () => {
    expect(cpiCourseId('ESL GENERAL（15岁以上）')).toBe('esl-general-15');
    expect(cpiCourseId('JUNIOR（6-15岁）')).toBe('junior-6-15');
    expect(cpiRoomId('A栋四人间（上下铺）')).toBe('building-a-quad');
    expect(cpiRoomId('B栋四人间（3张床）')).toBe('building-b-quad');
    expect(cpiRoomId('Premium双人间')).toBe('premium-double');
    const codes = CPI_PAGE_PROFILE.roomProfiles.flatMap(profile => (profile.bookingCode ?? '').split('/'));
    for (const room of createDefaultCpiContentConfig().rooms) expect(codes).withContext(room.code).toContain(room.code);
  });
});
