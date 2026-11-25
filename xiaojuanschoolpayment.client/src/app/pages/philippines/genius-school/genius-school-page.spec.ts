import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { GENIUS_FAMILY_KID_ID, GENIUS_FAMILY_PARENT_ID, GENIUS_FAMILY_ROOM } from './genius-content-config';
import { GeniusPageStudent } from './genius-page-quote';
import { GeniusSchoolPageComponent } from './genius-school-page.component';

// The Genius page on the shared Philippine school template: the school's 2026–2027 price list with its exact
// 1–3-week prices, the family program, the add-ons, the September–December 2026 offers and the local fees.
describe('Genius school page on the shared template', () => {
  let page: GeniusSchoolPageComponent;
  /** Reference rates of the test: 7 yuan per dollar and 8.2 pesos per yuan, so 57.4 pesos per dollar. */
  const PHP_PER_USD = 57.4;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new GeniusSchoolPageComponent());
    page.selectedStartDate = '2027-01-10';
  });

  const student = () => page.students[0];
  const payment = (label: string) => student().paymentLines.find(row => row.label === label);
  const shownPayment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;
  const pickCourse = (person: GeniusPageStudent, id: string) => {
    person.quotePlan.courses[0].optionId = id;
    person.planOptionChanged();
  };
  /** Lets a test pretend the 999 promotion's registration window is open or closed. */
  const setToday = (person: GeniusPageStudent, date: string) => {
    (person as unknown as { today: string }).today = date;
  };

  it('prices four weeks of General English A in a double room', () => {
    expect(page.selectedCourseId).toBe('ge-a');
    expect(page.selectedRoomId).toBe('double');
    // 125 registration + (1,000 + 750) × 0.9: 思达启航9折 on course and room (user 2026-11-25).
    expect(payment('思达启航折扣')?.value).toBe(-175);
    expect(page.quote.quoteUsd).toBe(1700);
    expect(page.quoteImageData.headingText).toBe('Genius 4周报价');
    expect(page.quoteImageData.layoutVersion).toBe(2);
    expect(shownPayment('9–12月特别优惠')).toBeUndefined();
    expect(student().quoteError).toBe('');
  });

  it('uses the exact short-stay prices and the sea-view supplement', () => {
    page.selectedWeeks = 2;
    // 125 + (633 + 421) × 0.9
    expect(page.quote.quoteUsd).toBeCloseTo(1073.6, 2);
    page.selectedRoomId = 'double-sea';
    // Sea view adds 125 per 4 weeks, counted by the week: 421 + 62.5.
    expect(student().accommodation).toBe(483.5);
    page.selectedWeeks = 6;
    // Six weeks: 1,000 ÷ 4 × 6 and 875 ÷ 4 × 6.
    expect(student().tuition).toBe(1500);
    expect(student().accommodation).toBe(1312.5);
  });

  it('takes 200 dollars off per four regular-course weeks studied in September–December 2026', () => {
    page.selectedStartDate = '2026-11-01';
    page.selectedWeeks = 8;
    expect(student().fallOfferBlocks).toBe(2);
    expect(payment('9–12月特别优惠')?.value).toBe(-400);
    // 9折 first, then the school's 200 per four weeks.
    expect(page.quote.quoteUsd).toBe(125 + 3500 * 0.9 - 400);
    // Only four class Mondays fall in December, so one block.
    page.selectedStartDate = '2026-12-06';
    expect(student().fallOfferBlocks).toBe(1);
    page.selectedStartDate = '2027-01-10';
    expect(student().fallOfferDiscount).toBe(0);
  });

  it('prices the 999 promotion only for GE A and a four-person room in its window', () => {
    setToday(student(), '2026-11-20');
    page.selectedStartDate = '2026-11-29';
    page.selectedRoomId = 'quad';
    student().promo999Chosen = true;
    expect(student().quoteError).toBe('');
    // The 9折 stacks with the promotion: 999 × 0.9.
    expect(page.quote.quoteUsd).toBeCloseTo(125 + 899.1, 2);
    expect(student().fallOfferDiscount).toBe(0);
    page.selectedRoomId = 'quad-sea';
    expect(page.quote.quoteUsd).toBeCloseTo(125 + 1124 * 0.9, 2);
    page.selectedRoomId = 'double';
    expect(student().quoteError).toContain('999美元推广价');
    page.selectedRoomId = 'quad';
    page.selectedWeeks = 8;
    expect(student().quoteError).toContain('999美元推广价');
    // After the registration deadline the choice disappears and the normal offers apply again.
    page.selectedWeeks = 4;
    setToday(student(), '2026-12-01');
    expect(student().extraChoices.find(choice => choice.label === '999美元推广价')?.visible).toBeFalse();
    expect(student().promo999Discount).toBe(0);
    expect(student().fallOfferDiscount).toBe(200);
  });

  it('charges the management and extra-class add-ons by the course week', () => {
    page.selectedWeeks = 8;
    student().management = 'sparta';
    student().extraClasses = 'both';
    expect(payment('斯巴达管理')?.value).toBe(250);
    expect(payment('加课')?.value).toBe(450);
    // Add-ons are not discounted.
    expect(page.quote.quoteUsd).toBe(125 + 3500 * 0.9 + 700);
    student().management = 'regular';
    student().extraClasses = 'none';
    student().selectedAgeGroup = 'minor';
    student().unaccompanied = true;
    expect(payment('未成年管理费')?.value).toBe(200);
  });

  it('prices the family program per person with the room included', () => {
    page.quote.setQuoteMode('group');
    page.studentCount = 3;
    const [kidA, kidB, parent] = page.activeStudents;
    pickCourse(kidA, GENIUS_FAMILY_KID_ID);
    pickCourse(kidB, GENIUS_FAMILY_KID_ID);
    pickCourse(parent, GENIUS_FAMILY_PARENT_ID);
    expect(kidA.quotePlan.rooms[0].optionId).toBe(GENIUS_FAMILY_ROOM.id);
    expect(kidA.selectedAgeGroup).toBe('minor');
    expect(parent.selectedAgeGroup).toBe('adult');
    // Two children: each 1,900 instead of 2,100; the room is part of the price.
    expect(kidA.tuition).toBe(1900);
    expect(kidA.accommodation).toBe(0);
    // The family program takes the 9折 too.
    expect(parent.quoteUsd).toBe(125 + 1400 * 0.9);
    expect(page.quote.quoteUsd).toBe(3 * 125 + (1900 * 2 + 1400) * 0.9);
    expect(page.quoteError).toBe('');
    // One child only pays the single-child price.
    pickCourse(kidB, 'ge-a');
    expect(kidA.tuition).toBe(2100);
    expect(kidB.quotePlan.rooms[0].optionId).toBe('double');
  });

  it('limits the family program to 12 weeks and one course', () => {
    pickCourse(student(), GENIUS_FAMILY_KID_ID);
    page.selectedWeeks = 16;
    expect(student().quoteError).toContain('12周');
    page.selectedWeeks = 4;
    expect(student().quoteError).toBe('');
    student().selectedAgeGroup = 'adult';
    expect(student().quoteError).toContain('未满18岁');
  });

  it('estimates visa extensions, the I-Card and the dollar fees in pesos', () => {
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('ACR')).toBe(0);
    expect(localFee('SSP')).toBe(11800);
    expect(localFee('教材')).toBeCloseTo(40 * PHP_PER_USD, 2);
    expect(localFee('维护费')).toBeCloseTo(40 * PHP_PER_USD, 2);
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(4560);
    expect(localFee('ACR')).toBe(4000);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(10900);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')).toBe(6340);
    page.selectedWeeks = 8;
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('ACR')).toBe(0);
    page.selectedCourseId = 'ge-b';
    expect(localFee('教材')).toBeCloseTo(2 * 60 * PHP_PER_USD, 2);
    student().visaType = 'student';
    expect(localFee('SSP')).toBe(0);
  });

  it('compares regular courses only', () => {
    pickCourse(student(), GENIUS_FAMILY_KID_ID);
    page.comparison.start('course');
    expect(page.comparison.courseOptions.some(course => course.id.startsWith('family'))).toBeFalse();
    expect(page.comparison.plans.every(plan => !plan.isFamily)).toBeTrue();
    expect(page.comparison.results.every(result => !result.error)).toBeTrue();
  });
});
