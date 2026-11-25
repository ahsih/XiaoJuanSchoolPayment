import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { cloneElsaContentConfig, createDefaultElsaContentConfig, isElsaContentConfig } from './elsa-content-config';
import { ELSA_PAGE_PROFILE } from './elsa-page-profile';
import { ElsaSchoolPageComponent } from './elsa-school-page.component';

// ELSA on the shared Philippine school template: 思达启航's 2026 ELSA price list (course price = course + five-person
// room + meals, other rooms as supplements), the 2026 off-season offers and the October 2026 local-fee sheet.
describe('ELSA page on the shared template', () => {
  let page: ElsaSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new ElsaSchoolPageComponent());
    page.selectedStartDate = '2027-03-07';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = () => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  it('prices the course with its five-person room and adds the chosen room as a supplement', () => {
    expect(page.selectedCourseId).toBe('general');
    expect(page.selectedRoomId).toBe('room-2');
    expect(student().tuition).toBe(1750);
    expect(student().accommodation).toBe(150);
    // 100 registration + 1,750 + 150 − 思达启航 10% of 1,900
    expect(page.quote.quoteUsd).toBe(1810);
    expect(payment('思达启航折扣')?.amount).toBe('− 190 美元');
    expect(page.quoteImageData.headingText).toContain('ELSA 4周报价');
  });

  it('shows room supplements on the room cards', () => {
    expect(page.roomPriceText('room-5')).toBe('课程价已含');
    expect(page.roomPriceHasUnit('room-5')).toBeFalse();
    expect(page.roomPriceText('room-1')).toBe('+650 美元');
    expect(page.roomPriceHasUnit('room-1')).toBeTrue();
  });

  it('halves adult ESL in the 2026 off-season after the Sida 10%', () => {
    page.selectedStartDate = '2026-11-29';
    // 100 + 1,900 × 0.9 × 0.5
    expect(page.quote.quoteUsd).toBe(955);
    expect(payment('2026淡季成人ESL半价')?.amount).toBe('− 855 美元');
  });

  it('gives children one free week in four inside the off-season, never more than the week costs', () => {
    page.selectedStartDate = '2026-11-29';
    student().selectedAgeGroup = 'minor';
    page.selectedCourseId = 'junior-esl';
    page.selectedRoomId = 'room-5';
    // 100 + 1,850 × 0.9 × 3/4
    expect(page.quote.quoteError).toBe('');
    expect(page.quote.quoteUsd).toBe(1348.75);
  });

  it('charges a parent who only stays the package price without registration or discounts', () => {
    page.selectedStartDate = '2026-11-29';
    page.selectedCourseId = 'guardian-stay';
    page.selectedRoomId = 'room-3';
    expect(page.quote.quoteError).toBe('');
    expect(student().registration).toBe(0);
    expect(page.quote.quoteUsd).toBe(950);
    expect(localFee('SSP特别学习许可')?.quantity).toBe(0);
    page.selectedRoomId = 'room-2';
    expect(page.quote.quoteError).toContain('三人间');
  });

  it('keeps children out of adult-only courses and adults out of children\'s courses', () => {
    page.selectedCourseId = 'kinder';
    expect(page.quote.quoteError).toContain('未满18岁');
    student().selectedAgeGroup = 'minor';
    page.selectedCourseId = 'guardian-esl';
    expect(page.quote.quoteError).toContain('家长课程');
  });

  it('adds the local fees by stay length and visa', () => {
    // SSP 7,800 + E-CARD 4,500 + facility 1,500 × 4 + books 2,000
    expect(localTotal()).toBe(20300);
    page.selectedWeeks = 8;
    // + one extension 5,160 and ACR I-CARD 4,000 with it; facility and books for 8 weeks
    expect(localFee('签证续签')?.quantity).toBe(1);
    expect(localFee('ACR I-CARD')?.quantity).toBe(1);
    expect(localTotal()).toBe(7800 + 4500 + 5160 + 4000 + 12000 + 4000);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')?.quantity).toBe(0);
    expect(localFee('ACR I-CARD')?.quantity).toBe(0);
  });

  it('keeps a saved content document whole', () => {
    const saved = createDefaultElsaContentConfig();
    expect(isElsaContentConfig(saved)).toBeTrue();
    expect(cloneElsaContentConfig(saved)).toEqual(saved);
    expect(ELSA_PAGE_PROFILE.roomProfiles.flatMap(profile => profile.rateIds ?? []).sort())
      .toEqual(['room-1', 'room-2', 'room-3', 'room-4', 'room-5']);
  });
});
