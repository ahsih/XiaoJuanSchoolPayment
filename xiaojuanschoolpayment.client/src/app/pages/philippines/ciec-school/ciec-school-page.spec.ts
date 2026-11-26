import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { CIEC_SIDA_DESCRIPTION, cloneCiecContentConfig, createDefaultCiecContentConfig } from './ciec-content-config';
import { CiecPageStudent } from './ciec-page-quote';
import { CiecSchoolPageComponent } from './ciec-school-page.component';

// The CIEC page on the shared Philippine school template: the 2027 price list (same as 2026), the 2026 and 2027
// low-season family offers and the 2027 local fees.
describe('CIEC school page on the shared template', () => {
  let page: CiecSchoolPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
    page = TestBed.runInInjectionContext(() => new CiecSchoolPageComponent());
    page.selectedStartDate = '2027-01-10';
  });

  const student = () => page.students[0];
  const payment = (label: string) => page.schoolPaymentItems.find(row => row.label === label);
  const localFee = (item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item))?.total ?? 0;
  const startOn = (person: CiecPageStudent, date: string, weeks = 4) => {
    const row = person.quotePlan.courses[0];
    person.quotePlan.updateStartDate('course', row.id, date);
    person.quotePlan.updateWeeks('course', row.id, weeks);
  };
  /** A group quote: student 1 is a child, student 2 a parent. */
  const family = (count: number) => {
    page.quote.setQuoteMode('group');
    page.studentCount = count;
    return page.activeStudents;
  };

  it('prices a four-week junior course with the Sida 95% rate', () => {
    expect(student().role).toBe('child');
    expect(page.selectedCourseId).toBe('junior-academic');
    expect(page.selectedRoomId).toBe('double');
    // 100 registration + 1,100 + 930 − 5% of 2,030
    expect(page.quote.quoteUsd).toBe(2028.5);
    expect(payment('思达启航折扣')).toBeDefined();
    expect(page.quoteImageData.headingText).toBe('CIEC 4周报价');
    expect(page.quoteImageData.layoutVersion).toBe(2);
    expect(student().quoteError).toBe('');
  });

  it('moves young children to the kindergarten and needs a parent for it', () => {
    student().childAge = 5;
    expect(page.selectedCourseId).toBe('kindergarten');
    expect(student().quoteError).toBe('');
    student().role = 'solo';
    expect(student().quoteError).toContain('须有家长陪同');
    student().childAge = 10;
    expect(page.selectedCourseId).toBe('junior-academic');
    expect(student().quoteError).toBe('');
  });

  it('gives a 2027 two-person family the parent room and course offers', () => {
    const [child, parent] = family(2);
    expect(parent.role).toBe('guardian');
    expect(parent.quotePlan.courses[0].optionId).toBe('guardian-esl');
    startOn(child, '2027-03-07');
    startOn(parent, '2027-03-07');
    // Parent room 930 → 400 and course 700 → 400 per 4 weeks; Sida 5% on the full 1,630 first.
    expect(parent.familyRoomOffer?.amount).toBe(530);
    expect(parent.guardianCourseOffer?.amount).toBe(300);
    expect(parent.sidaDiscount).toBe(81.5);
    expect(parent.quoteUsd).toBe(818.5);
    expect(child.quoteUsd).toBe(2028.5);
    expect(page.quote.quoteUsd).toBe(2847);
    expect(page.quoteError).toBe('');
  });

  it('uses the 2026 parent room price of 300 dollars until 2027-01-01', () => {
    const [child, parent] = family(2);
    startOn(child, '2026-11-01');
    startOn(parent, '2026-11-01');
    expect(parent.familyRoomOffer?.amount).toBe(630);
    // Primary-school children also get the non-cash craft class in the 2026 low season.
    expect(page.schoolPaymentItems.find(row => row.label === '学生1 · 小学生手作体验课')?.amount).toBe('赠送');
  });

  it('lets a 2-person family upgrade to a triple room in the low season for 200 dollars each', () => {
    const [child, parent] = family(2);
    for (const person of [child, parent]) {
      person.quotePlan.rooms[0].optionId = 'triple-family2';
      startOn(person, '2027-03-07');
    }
    expect(page.quoteError).toBe('');
    // Child: 100 + 1,100 + 1,130 (930 + 200) − 5% of 2,230.
    expect(child.quoteUsd).toBe(2218.5);
    // Parent room 1,130 − 530 = 600 (400 + 200); course 700 − 300; Sida 5% of the full 1,830.
    expect(parent.familyRoomOffer?.amount).toBe(530);
    expect(parent.quoteUsd).toBe(1008.5);
    startOn(child, '2027-06-06');
    startOn(parent, '2027-06-06');
    expect(page.quoteError).toContain('只在淡季提供');
    page.quote.setQuoteMode('single');
    page.selectedRoomId = 'triple-family2';
    expect(student().quoteError).toContain('两人家庭');
  });

  it('lets the parent skip classes only where the school allows it', () => {
    const [child, parent] = family(2);
    parent.quotePlan.courses[0].optionId = 'none';
    startOn(child, '2027-03-07');
    startOn(parent, '2027-03-07');
    expect(parent.quoteError).toBe('');
    // 100 + 930 − 530 − 5% of 930
    expect(parent.quoteUsd).toBe(453.5);
    startOn(child, '2027-06-06');
    startOn(parent, '2027-06-06');
    expect(parent.quoteError).toContain('家长不上课');
    startOn(child, '2027-06-06', 16);
    startOn(parent, '2027-06-06', 16);
    expect(parent.quoteError).toBe('');
  });

  it('gives a three-person family a free parent room in the low season', () => {
    const [child, parent, sibling] = family(3);
    sibling.childAge = 12;
    for (const person of [child, parent, sibling]) {
      person.quotePlan.rooms[0].optionId = 'triple';
      startOn(person, '2027-09-05');
    }
    expect(parent.familySize).toBe(3);
    expect(parent.familyRoomOffer?.amount).toBe(850);
    // The free room stays out of the Sida 5%: 100 + 700 − 300 + 850 − 850 − 5% of 700.
    expect(parent.quoteUsd).toBe(465);
    expect(page.quoteError).toBe('');
  });

  it('charges a child without a parent the guardian fee, waived in the low season from age 9', () => {
    student().role = 'solo';
    student().childAge = 10;
    expect(payment('监护费（无家长陪同）')).toBeDefined();
    expect(page.quote.quoteUsd).toBe(2328.5);
    page.selectedStartDate = '2027-03-07';
    expect(student().guardianFeeWaiver).toBe(300);
    expect(page.quote.quoteUsd).toBe(2028.5);
    student().childAge = 8;
    expect(student().guardianFeeWaiver).toBe(0);
  });

  it('charges infants by age and keeps them out of class', () => {
    student().childAge = 'm24';
    expect(page.selectedCourseId).toBe('none');
    expect(student().accommodation).toBe(0);
    expect(student().quoteError).toBe('');
    expect(localFee('综合管理费')).toBe(2400);
    expect(localFee('SSP特殊学习许可证')).toBe(0);
    student().childAge = 'm47';
    expect(student().accommodation).toBe(465);
  });

  it('adds the one-time CIDEC grade tuition and its own study permit', () => {
    page.selectedCourseId = 'cidec';
    // 100 + 1,350 + 930 + 3,000 − 5% of 5,280
    expect(page.quote.quoteUsd).toBe(5116);
    expect(payment('CIDEC年级学费')).toBeDefined();
    expect(localFee('CIDEC SSP')).toBe(15000);
    expect(localFee('SSP特殊学习许可证')).toBe(0);
    page.selectedWeeks = 2;
    expect(student().quoteError).toContain('至少报名4周');
  });

  it('estimates visa extensions and the I-Card from the stay', () => {
    expect(localFee('签证续签')).toBe(0);
    expect(localFee('I-CARD')).toBe(0);
    page.selectedWeeks = 8;
    // 56 days on a 30-day visa: one 29-day extension, with the I-Card (user rule 2026-11-24: ACR comes with the first extension).
    expect(localFee('签证续签')).toBe(4800);
    expect(localFee('I-CARD')).toBe(4000);
    page.selectedWeeks = 12;
    expect(localFee('签证续签')).toBe(10600);
    expect(localFee('I-CARD')).toBe(4000);
    student().visaType = 'tourist59';
    expect(localFee('签证续签')).toBe(5800);
    page.selectedWeeks = 8;
    expect(localFee('I-CARD')).toBe(0);
  });

  it('keeps the four-person room for four family members', () => {
    page.selectedRoomId = 'triple-family4';
    expect(student().quoteError).toContain('4位家人');
    const members = family(4);
    members[2].childAge = 12;
    members[3].childAge = 6;
    for (const person of members) person.quotePlan.rooms[0].optionId = 'triple-family4';
    expect(page.quoteError).toBe('');
  });

  it('compares rooms for one person without the four-person family room', () => {
    page.comparison.start('room');
    const rooms = page.comparison.plans.map(plan => page.comparison.roomId(plan));
    expect(rooms).toEqual(['double', 'triple']);
    expect(page.comparison.results.every(result => !result.error)).toBeTrue();
  });

  it('upgrades saved documents without losing the CIEC rules', () => {
    const saved = createDefaultCiecContentConfig();
    saved.courses = saved.courses.filter(course => course.id !== 'cidec');
    saved.quoteSettings.promotions.find(rule => rule.id === 'ciec-sida-95')!.description = '课程费和住宿费（含CIDEC年级学费）在学校优惠后再享95折';
    const restored = cloneCiecContentConfig(saved);
    expect(restored.schoolCode).toBe('CIEC' as typeof restored.schoolCode);
    expect(restored.quoteSettings.promotions.find(rule => rule.id === 'ciec-sida-95')?.description).toBe(CIEC_SIDA_DESCRIPTION);
  });
});
