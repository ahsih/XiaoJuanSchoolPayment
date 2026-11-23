import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { createDefaultCipContentConfig } from './cip-content-config';
import { cipDefaultStart } from './cip-page-quote';
import { CIP_PAGE_PROFILE } from './cip-page-profile';
import { CipSchoolPageComponent } from './cip-school-page.component';

// CIP on the shared Philippine school template: the 2027 dollar price list, the 2026–2027 off-season poster and the
// June 2026 local-fee sheet from CIP's 2026-11 school pack.
describe('CIP page on the shared template', () => {
  let page: CipSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new CipSchoolPageComponent());
    page.selectedStartDate = '2027-01-03';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));

  it('starts quotes no earlier than the first dollar-priced week', () => {
    expect(cipDefaultStart(new Date(2026, 10, 24))).toBe('2027-01-03');
    expect(cipDefaultStart(new Date(2027, 2, 10))).toBe('2027-03-14');
  });

  it('prices the default four-week plan with the off-season offer', () => {
    expect(page.selectedCourseId).toBe('regular-esl');
    expect(page.selectedRoomId).toBe('double');
    // 100 registration + 820 + 780 − 50 off-season
    expect(page.quote.quoteUsd).toBe(1650);
    expect(payment('2027淡季优惠')?.amount).toBe('− 50 美元');
    expect(payment('淡季福利')?.amount).toBe('任选1项');
    expect(page.quoteImageData.headingText).toContain('CIP 4周报价');
  });

  it('matches the price list for short stays and the 16-week long-stay offer', () => {
    page.selectedCourseId = 'light-esl';
    page.selectedRoomId = 'single-a';
    page.selectedWeeks = 2;
    // Price list: Light ESL + Single A, 2 weeks 1,170; no full four weeks for the off-season offer.
    expect(student().tuition + student().accommodation).toBe(1170);
    expect(page.quote.quoteUsd).toBe(1270);
    page.selectedWeeks = 16;
    // Price list 16 weeks 7,150 (long-stay 50 off) − 4 × 50 off-season + 100 registration
    expect(page.quote.quoteUsd).toBe(7050);
    expect(payment('长期报名优惠')?.amount).toBe('− 50 美元');
  });

  it('counts no June–August study week toward the off-season offer and has no peak surcharge', () => {
    page.selectedStartDate = '2027-05-02';
    page.selectedWeeks = 8;
    expect(student().offSeasonWeeks()).toBe(4);
    expect(student().seasonalSurcharge).toBe(0);
    page.selectedStartDate = '2027-06-06';
    expect(student().offSeasonWeeks()).toBe(0);
    expect(student().offSeasonGift).toBeFalse();
    expect(payment('旺季附加费')).toBeUndefined();
  });

  it('blocks arrivals before 2027, Sparta courses at the hotel and wrong course lengths', () => {
    page.selectedStartDate = '2026-12-27';
    expect(page.quoteError).toContain('人民币价格');
    page.selectedStartDate = '2027-01-03';
    page.selectedCourseId = 'intensive-esl';
    page.selectedRoomId = 'hotel-twin-double';
    expect(page.quoteError).toContain('全斯巴达课程只能住校内宿舍');
    page.selectedRoomId = 'double';
    page.selectedCourseId = 'ielts-guarantee';
    expect(page.quoteError).toContain('只能报8周或12周');
    page.selectedWeeks = 8;
    expect(page.quoteError).toBe('');
  });

  it('prices IELTS Guarantee at 1,320 per 4 weeks for 8 weeks and 1,200 for 12 weeks', () => {
    page.selectedCourseId = 'ielts-guarantee';
    page.selectedWeeks = 8;
    expect(student().tuition).toBe(2640);
    page.selectedWeeks = 12;
    expect(student().tuition).toBe(3600);
    const guarantee = page.courseFees.find(fee => fee.id === 'ielts-guarantee')!;
    expect(page.listPrice(guarantee)).toBe(1200);
    expect(page.coursePriceUnit(guarantee)).toContain('起');
    const regular = page.courseFees.find(fee => fee.id === 'regular-esl')!;
    expect(page.listPrice(regular)).toBe(820);
    expect(page.coursePriceUnit(regular)).not.toContain('起');
  });

  it('keeps adults out of junior courses and 16–17-year-olds in Sparta courses', () => {
    page.selectedCourseId = 'junior-esl';
    expect(page.quoteError).toContain('青少年课程只收7–15岁');
    student().selectedAgeGroup = 'minor';
    expect(page.quoteError).toBe('');
    student().minorBand = 'senior';
    expect(page.quoteError).toContain('全斯巴达课程');
    page.selectedCourseId = 'intensive-esl';
    expect(page.quoteError).toBe('');
  });

  it('waives registration for returning students', () => {
    student().returningStudent = true;
    expect(page.quote.quoteUsd).toBe(1550);
  });

  it('estimates local fees like the school sheet', () => {
    expect(localFee('SSP特殊学习许可证')?.total).toBe(6800);
    expect(localFee('SSP I-CARD')?.total).toBe(4000);
    expect(localFee('电费')?.total).toBe(2400);
    expect(localFee('设施使用费')?.total).toBe(2000);
    expect(localFee('学生证')?.total).toBe(250);
    expect(localFee('教材费')?.total).toBe(2000);
    expect(localFee('签证续签')?.quantity).toBe(0);
    page.selectedWeeks = 12;
    // 30-day entry, 84 days: two extensions, 5,640 + 7,420 = the sheet's cumulative 13,060.
    expect(localFee('签证续签')?.total).toBe(13060);
    expect(localFee('ACR I-CARD')?.total).toBe(4000);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')?.total).toBe(7420);
  });

  it('charges no electricity and no dormitory deposit at Clover Hotel', () => {
    page.selectedRoomId = 'hotel-king-double';
    expect(localFee('电费')?.quantity).toBe(0);
    expect(localFee('设施使用费')?.total).toBe(2000);
    expect(student().dormDeposit).toBe(0);
  });

  it('links every room profile, course group and room video to the content document', () => {
    const content = createDefaultCipContentConfig();
    const rooms = new Set(content.rooms.map(room => room.id));
    for (const profile of CIP_PAGE_PROFILE.roomProfiles) {
      for (const id of profile.rateIds ?? []) expect(rooms.has(id)).withContext(profile.id).toBeTrue();
    }
    const grouped = CIP_PAGE_PROFILE.courseGroups.flatMap(group => group.courseIds).sort();
    expect(grouped).toEqual(content.courses.map(course => course.id).sort());
    const profiles = new Set(CIP_PAGE_PROFILE.roomProfiles.map(profile => profile.id));
    expect(Object.keys(CIP_PAGE_PROFILE.roomVideos ?? {}).every(id => profiles.has(id))).toBeTrue();
  });
});
