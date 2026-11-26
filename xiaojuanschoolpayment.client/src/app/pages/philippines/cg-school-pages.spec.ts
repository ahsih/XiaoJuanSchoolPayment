import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import { CgBaniladSchoolPageComponent } from './cg-banilad-school/cg-banilad-school-page.component';
import { CG_BANILAD_PAGE_PROFILE } from './cg-banilad-school/cg-banilad-page-profile';
import { CgSpartaSchoolPageComponent } from './cg-sparta-school/cg-sparta-school-page.component';
import { CG_SPARTA_PAGE_PROFILE } from './cg-sparta-school/cg-sparta-page-profile';
import { cloneCgSpartaContentConfig, createDefaultCgSpartaContentConfig } from './cg-sparta-school/cg-sparta-content-config';
import type { PhSchoolProfile } from './school-page/ph-school-profile';

// CG Banilad and CG Sparta on the shared Philippine template (2026-11 school pack): two pages that never share
// photos, videos, scores, courses or rules.
describe('CG campus pages on the shared template', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] }));

  const banilad = () => {
    const page = TestBed.runInInjectionContext(() => new CgBaniladSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
    return page;
  };
  const sparta = () => {
    const page = TestBed.runInInjectionContext(() => new CgSpartaSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
    return page;
  };
  const localTotal = (page: { estimatedLocalFees: Array<{ total: number }> }) => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  const mediaOf = (profile: PhSchoolProfile) => [
    ...profile.gallery.images.map(image => image.src),
    ...profile.roomProfiles.flatMap(room => [room.image, ...(room.gallery ?? [])]),
    ...profile.campusLifeVideos.flatMap(video => [video.src, video.poster]),
    ...(profile.videoTabs ?? []).flatMap(tab => tab.items.flatMap(video => [video.src, video.poster ?? ''])),
    ...profile.ieltsResults.map(result => result.image),
  ];

  it('keeps every photo, video and score inside its own campus folder', () => {
    const baniladMedia = mediaOf(CG_BANILAD_PAGE_PROFILE);
    const spartaMedia = mediaOf(CG_SPARTA_PAGE_PROFILE);
    expect(baniladMedia.length).toBeGreaterThan(30);
    expect(spartaMedia.length).toBeGreaterThan(30);
    expect(baniladMedia.every(src => src.includes('assets/cg-banilad/'))).toBeTrue();
    expect(spartaMedia.every(src => src.includes('assets/cg-sparta/'))).toBeTrue();
    expect(CG_BANILAD_PAGE_PROFILE.code).toBe('CG-BANILAD');
    expect(CG_SPARTA_PAGE_PROFILE.code).toBe('CG-SPARTA');
  });

  it('prices the default Banilad plan with the Sida 10% and the 2026 off-season offer', () => {
    const page = banilad();
    expect(page.selectedCourseId).toBe('general-esl');
    expect(page.selectedRoomId).toBe('quad');
    // 100 registration + 700 + 650 − 135 (10%) − 150 off season
    expect(page.quote.quoteUsd).toBe(1165);
    expect(page.quoteImageData.headingText).toContain('CG Banilad 4周报价');
    expect(page.quoteImageData.layoutVersion).toBe(2);
  });

  it('adds the Banilad long-stay scholarship once at 12 weeks', () => {
    const page = banilad();
    page.selectedWeeks = 12;
    // 100 + 2,100 + 1,950 − 405 (10%) − 450 off season − 50 long stay
    expect(page.quote.quoteUsd).toBe(3245);
  });

  it('prices the default Sparta plan and keeps the 2027 summer surcharge outside discounts', () => {
    const page = sparta();
    expect(page.selectedCourseId).toBe('sparta');
    // 100 + 800 + 650 − 145 (10%) − 150 off season
    expect(page.quote.quoteUsd).toBe(1255);
    expect(page.quoteImageData.headingText).toContain('CG斯巴达校区 4周报价');
    page.selectedStartDate = '2027-07-04';
    // no off season in July; 4 summer weeks at 60 dollars
    expect(page.quote.quoteUsd).toBe(100 + 800 + 650 - 145 + 240);
  });

  it('lets Sparta run to 52 weeks with the long-stay offer capped at 200 and SSP paid twice', () => {
    const page = sparta();
    page.selectedWeeks = 28;
    expect(page.quotePlan.error).toBe('');
    expect(page.students[0].longStayDiscount).toBe(200);
    const ssp = page.estimatedLocalFees.find(fee => fee.item.startsWith('SSP'));
    expect(ssp?.quantity).toBe(2);
    const short = sparta();
    expect(short.estimatedLocalFees.find(fee => fee.item.startsWith('SSP'))?.quantity).toBe(1);
  });

  it('sells IELTS Guarantee only for 12 weeks on the school start dates', () => {
    const page = sparta();
    page.selectedCourseId = 'ielts-guarantee';
    expect(page.students[0].courseLengthError).toContain('12周');
    page.selectedStartDate = '2027-01-10';
    page.selectedWeeks = 12;
    expect(page.students[0].courseLengthError).toContain('指定日期');
    page.selectedStartDate = '2027-01-03';
    expect(page.students[0].courseLengthError).toBe('');
    const guarantee = page.courseFees.find(fee => fee.id === 'ielts-guarantee')!;
    expect(page.listPrice(guarantee)).toBe(3300);
    expect(page.coursePriceUnit(guarantee)).toBe('/12周');
  });

  it('sells Booster only on its own for 1 or 2 weeks', () => {
    for (const page of [banilad(), sparta()]) {
      page.selectedCourseId = 'booster';
      page.selectedWeeks = 1;
      expect(page.students[0].courseLengthError).toBe('');
      // 100 + 370 + 260 (40% of the quad) − 63 (10%)
      expect(page.quote.quoteUsd).toBe(667);
      page.selectedWeeks = 4;
      expect(page.students[0].courseLengthError).toContain('1或2周');
      const booster = page.courseFees.find(fee => fee.id === 'booster')!;
      expect(page.listPrice(booster)).toBe(370);
      expect(page.coursePriceUnit(booster)).toBe('/1周');
    }
  });

  it('switches the weekly utilities for arrivals from 2027/01/03', () => {
    const page = banilad();
    // SSP 7,800 + E-Card 4,500 + management 2,000 + electricity 2,000 + water 500 + books 2,000
    expect(localTotal(page)).toBe(18800);
    page.selectedStartDate = '2027-01-03';
    // management 750, electricity 500 and water 300 per week
    expect(localTotal(page)).toBe(7800 + 4500 + 3000 + 2000 + 1200 + 2000);
  });

  it('moves an older saved Sparta document onto the new wording once and keeps edited prices', () => {
    const saved = createDefaultCgSpartaContentConfig();
    delete (saved.quoteSettings as { cgPolicyVersion?: number }).cgPolicyVersion;
    const course = saved.courses.find(item => item.id === 'sparta')!;
    course.name = 'Sparta'; course.tuition = 820; course.tuition2027 = 820;
    saved.rooms.push({ id: 'mj-single', name: 'M&J 单人间', label: 'M&J 单人间', code: '', location: '校外', group: '校外宿舍', fee: 1000, note: '', enabled: true, sortOrder: 9 });
    const upgraded = cloneCgSpartaContentConfig(saved);
    const sp = upgraded.courses.find(item => item.id === 'sparta')!;
    expect(sp.name).toBe('斯巴达（Sparta）');
    expect(sp.tuition2027).toBe(820);
    expect(upgraded.rooms.find(item => item.id === 'mj-single')?.enabled).toBeFalse();
    expect(upgraded.courses.some(item => item.id === 'booster')).toBeTrue();
  });
});
