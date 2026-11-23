import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneSmeagContentConfig, createDefaultSmeagContentConfig } from './smeag-content-config';
import { SMEAG_PAGE_PROFILE } from './smeag-page-profile';
import { SmeagCapitalSchoolPageComponent, smeagCourseIds, smeagRoomId } from './smeag-capital-school-page.component';

// SMEAG Capital on the shared Philippine school template: the 2026 price list, the 2026/2027 offer posters and
// the 2027 local-fee sheet from SMEAG's 2026-11-23 Google Drive pack.
describe('SMEAG Capital page on the shared template', () => {
  let page: SmeagCapitalSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new SmeagCapitalSchoolPageComponent());
    page.selectedStartDate = '2026-09-06';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));

  it('prices the default four-week ESL plan with the Sida 10% and the 2026 low-season offer', () => {
    expect(page.selectedCourseId).toBe('esl-regular-ket-pet-fce');
    expect(page.selectedRoomId).toBe('campus-quad');
    // 100 registration + 840 + 780 − 162 (10%) − 4 × 25 low season
    expect(page.quote.quoteUsd).toBe(1458);
    expect(payment('思达启航折扣')?.amount).toBe('− 162 美元');
    expect(page.quoteImageData.headingText).toContain('SMEAG Capital 4周报价');
  });

  it('gives no Sida discount on partner-hotel rooms', () => {
    page.selectedRoomId = 'hotel-twin';
    // 100 + 840 + 1,260 − 84 (10% of tuition only) − 100 low season
    expect(page.quote.quoteUsd).toBe(2016);
  });

  it('adds the Christmas offer once for four weeks that touch 12/20–1/2', () => {
    page.selectedStartDate = '2026-12-13';
    // 3 of 4 weeks end by 2027/01/02: 75 low season, plus 100 Christmas
    expect(page.quote.quoteUsd).toBe(1383);
    expect(payment('2026圣诞优惠')).toBeDefined();
    page.selectedWeeks = 3;
    expect(payment('2026圣诞优惠')).toBeUndefined();
  });

  it('starts the 2027 offer with arrivals from 2027/02/28', () => {
    page.selectedStartDate = '2027-01-03';
    expect(page.quote.quoteUsd).toBe(1558);
    page.selectedStartDate = '2027-02-28';
    expect(page.quote.quoteUsd).toBe(1458);
    expect(payment('2027上半年淡季优惠')).toBeDefined();
  });

  it('waives registration for returning students and has no peak surcharge', () => {
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(1358);
    page.selectedStartDate = '2027-07-04';
    page.selectedWeeks = 8;
    expect(student().seasonalSurcharge).toBe(0);
    expect(payment('旺季附加费')).toBeUndefined();
  });

  it('estimates local fees like the 2027 local-fee sheet, without pickup and deposit', () => {
    expect(localFee('SSP特殊学习许可证')?.total).toBe(7800);
    expect(localFee('SSP I-CARD')?.total).toBe(4500);
    expect(localFee('设施使用费')?.total).toBe(3000);
    expect(localFee('水电费')?.total).toBe(2400);
    expect(localFee('教材费')?.total).toBe(700);
    expect(localFee('签证续签')?.quantity).toBe(0);
    // Sheet, 30-day visa, 12 weeks: 47,730 including pickup 1,200 and deposit 2,000; plus one ESL book set.
    student().visaType = 'tourist30';
    page.selectedWeeks = 12;
    expect(localFee('签证续签')?.total).toBe(11530);
    expect(localFee('VISA I-CARD')?.total).toBe(4500);
    expect(page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(47730 - 3200 + 700);
  });

  it('charges no water and electricity at the partner hotels', () => {
    page.selectedRoomId = 'hotel-single';
    expect(localFee('水电费')?.quantity).toBe(0);
    expect(localFee('设施使用费')?.total).toBe(3000);
  });

  it('adds ARP and the 59-day sequence when a 59-day entry needs an extension', () => {
    page.selectedWeeks = 12;
    expect(localFee('签证续签')?.total).toBe(6400);
    expect(localFee('ARP')?.total).toBe(300);
  });

  it('counts one textbook set per course type', () => {
    page.quotePlan.add('course');
    expect(page.estimatedLocalFees.filter(fee => fee.item.startsWith('教材费')).length).toBe(1);
    page.quotePlan.courses[1].optionId = 'business';
    expect(page.estimatedLocalFees.filter(fee => fee.item.startsWith('教材费')).length).toBe(2);
  });

  it('maps every database course and room name to the content ids', () => {
    const names = ['ESL常规（KET/PET/FCE）', 'ESL（CAE）', 'ESL / Speaking Master（KET/PET/FCE）', 'ESL / Speaking Master（CAE）',
      'ESL Junior 2', 'TOEFL / IELTS（预备班）', 'TOEFL / IELTS（常规/12周保分）', 'TOEIC（预备班）', 'TOEIC（常规/保分）',
      'Business', 'ESL Junior', '儿童课程', '监护人课程'];
    const mapped = names.flatMap(smeagCourseIds).sort();
    expect(mapped).toEqual(createDefaultSmeagContentConfig().courses.map(course => course.id).sort());
    const rooms = ['校内单人间', '校内双人间', '校内三人间', '校内四人间', '校内五人间', '校外酒店单人间', '校外酒店双人间', '校外酒店三人间', '校外酒店四人间'];
    expect(rooms.map(smeagRoomId).sort()).toEqual(createDefaultSmeagContentConfig().rooms.map(room => room.id).sort());
  });

  it('links every room profile to a priced room and keeps the hotels out of the room videos', () => {
    const ids = new Set(createDefaultSmeagContentConfig().rooms.map(room => room.id));
    for (const profile of SMEAG_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(ids.has(id)).withContext(profile.id).toBeTrue();
    }
    expect(Object.keys(SMEAG_PAGE_PROFILE.roomVideos ?? {}).every(id => id.startsWith('campus-'))).toBeTrue();
  });

  it('upgrades a document saved before the 2026-11-23 pack once', () => {
    const old = createDefaultSmeagContentConfig();
    delete (old.quoteSettings as { smeagPolicyVersion?: number }).smeagPolicyVersion;
    old.courses = old.courses.filter(course => !['ielts-pre', 'toefl-pre'].includes(course.id));
    old.courses.push({ ...createDefaultSmeagContentConfig().courses[0], id: 'toefl-ielts-pre', name: 'TOEFL / IELTS（预备班）', tuition: 1150, tuition2027: 1150 });
    const upgraded = cloneSmeagContentConfig(old);
    expect(upgraded.courses.some(course => course.id === 'toefl-ielts-pre')).toBeFalse();
    expect(upgraded.courses.find(course => course.id === 'ielts-pre')?.tuition).toBe(1150);
    expect(upgraded.courses.find(course => course.id === 'toefl-pre')?.tuition).toBe(1150);
    expect(cloneSmeagContentConfig(upgraded)).toEqual(upgraded);
  });
});
