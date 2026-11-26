import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import { BeciCitySchoolComponent } from './beci-city-school.component';
import {
  beciCampusContent,
  cloneBeciContentConfig,
  createDefaultBeciContentConfig,
  type BeciCampus,
  type BeciCourseContent,
  type BeciRoomContent,
} from './beci-content-config';
import { BeciEopSchoolComponent } from './beci-eop-school.component';
import { BeciPageStudent, type BeciQuotePricing } from './beci-page-quote';
import { beciOffers } from './beci-shared-content';
import { BeciSpartaSchoolComponent } from './beci-sparta-school.component';
import type { BeciSchoolPageComponent } from './beci-school-page';

// BECI's three campus pages on the shared Philippine template, from the school's 2027 info update (2026-11-25).
// The amounts below were worked out by hand from that document (docs/beci-2027-update-2026-11-26.md).
function pricingFor(campus: BeciCampus): BeciQuotePricing {
  const content = beciCampusContent(createDefaultBeciContentConfig(), campus);
  return {
    ...createCiaQuotePricing(content),
    phpPerCny: 8,
    usdToCny: 7,
    beciCourses: content.courses as BeciCourseContent[],
    beciRooms: content.rooms as BeciRoomContent[],
  } as BeciQuotePricing;
}

function studentFor(campus: BeciCampus, plan: { course: string; room: string; start: string; weeks: number; registered: string }): BeciPageStudent {
  const student = new BeciPageStudent(pricingFor(campus), campus);
  student.quotePlan.courses[0].optionId = plan.course;
  student.quotePlan.rooms[0].optionId = plan.room;
  student.quotePlan.setStayStart(plan.start);
  student.quotePlan.setStayWeeks(plan.weeks);
  student.selectedRegistrationDate = plan.registered;
  return student;
}

const feeTotal = (student: BeciPageStudent) => student.localFees.reduce((sum, fee) => sum + fee.total, 0);
const fee = (student: BeciPageStudent, item: string) => student.localFees.find(row => row.item.startsWith(item));

describe('BECI 2027 quote rules', () => {
  it('EOP 4 weeks in the 2027 off-season: 10% off course and room, registration waived, 22,500 pesos at school', () => {
    const student = studentFor('eop', { course: 'eop-speed-esl', room: 'eop-triple', start: '2027-03-07', weeks: 4, registered: '2027-01-15' });
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(870);
    expect(student.accommodation).toBe(670);
    expect(student.registration).toBe(0);
    expect(student.offSeasonDiscount).toBe(154);
    expect(student.quoteUsd).toBe(1386);
    // SSP 7,800 + E-Card 4,500 + ID 200 + Speed ESL books 1,500 + utilities 3,000 + maintenance 1,000 + laundry 1,500 + pickup 3,000
    expect(fee(student, '签证延期')?.total).toBe(0);
    expect(fee(student, 'ACR')?.total).toBe(0);
    expect(feeTotal(student)).toBe(22500);
  });

  it('City 12 weeks in the 2027 peak, registered from 2027: new prices, long-stay 100, 7 peak weeks at 60', () => {
    const student = studentFor('city', { course: 'city-unlimited-esl', room: 'city-semi-master-single', start: '2027-07-04', weeks: 12, registered: '2027-01-10' });
    student.visaType = 'tourist30';
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(3000);
    expect(student.accommodation).toBe(3300);
    expect(student.peakWeeks).toBe(7);
    expect(student.seasonalSurcharge).toBe(420);
    expect(student.offSeasonDiscount).toBe(0);
    expect(student.quoteUsd).toBe(6620);
    // visa 11,150 (30-day entry, 3 months) + ACR 4,000 + books 6,000 + utilities 9,000 + maintenance 3,000 + laundry 4,500
    expect(fee(student, '签证延期')?.total).toBe(11150);
    expect(fee(student, 'ACR')?.total).toBe(4000);
    expect(feeTotal(student)).toBe(53150);
  });

  it('registrations until 2026-12-31 keep the 2026 prices; until 11-30 the 2027 peak is waived (early bird)', () => {
    const student = studentFor('city', { course: 'city-unlimited-esl', room: 'city-semi-master-single', start: '2027-07-04', weeks: 12, registered: '2026-11-26' });
    expect(student.tuition).toBe(2700);
    expect(student.accommodation).toBe(3150);
    expect(student.seasonalSurcharge).toBe(420);
    expect(student.earlyBirdWaiver).toBe(420);
    expect(student.quoteUsd).toBe(5750);
    student.selectedRegistrationDate = '2026-12-15';
    expect(student.earlyBirdWaiver).toBe(0);
    expect(student.tuition).toBe(2700);
    expect(student.quoteUsd).toBe(6170);
  });

  it('short stays cost 40/60/80% of four weeks; a 59-day visa needs no extension up to 8 weeks', () => {
    const student = studentFor('eop', { course: 'eop-lite-esl', room: 'eop-quad-female', start: '2027-01-10', weeks: 2, registered: '2027-01-02' });
    expect(student.tuition).toBe(402);
    expect(student.accommodation).toBe(342);
    student.quotePlan.setStayWeeks(8);
    expect(fee(student, '签证延期')?.total).toBe(0);
    student.visaType = 'tourist30';
    expect(fee(student, '签证延期')?.total).toBe(4940);
  });

  it('Sparta: no off-season discount, 18–40 only, IELTS Guarantee from 12 weeks', () => {
    const student = studentFor('sparta', { course: 'sparta-24-esl', room: 'sparta-quad', start: '2027-03-07', weeks: 4, registered: '2027-01-15' });
    expect(student.offSeasonDiscount).toBe(0);
    expect(student.quoteUsd).toBe(1600);
    student.selectedAgeGroup = 'minor';
    expect(student.quoteError).toContain('18–40');
    student.selectedAgeGroup = 'adult';
    student.over40 = true;
    expect(student.quoteError).toContain('18–40');
    student.over40 = false;
    student.quotePlan.courses[0].optionId = 'sparta-ielts-guarantee';
    expect(student.quoteError).toContain('12周');
    student.quotePlan.setStayWeeks(12);
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(3300);
    expect(student.promotionDiscountTotal).toBe(100);
  });

  it('EOP: 40 and older live in single rooms', () => {
    const student = studentFor('eop', { course: 'eop-speed-esl', room: 'eop-triple', start: '2027-03-07', weeks: 4, registered: '2027-01-15' });
    student.over40 = true;
    expect(student.quoteError).toContain('单人间');
    student.quotePlan.rooms[0].optionId = 'eop-master-single';
    expect(student.quoteError).toBe('');
    expect(student.accommodation).toBe(1150);
  });

  it('City pair prices need two students in the same room', () => {
    const student = studentFor('city', { course: 'city-lite-esl', room: 'city-studio-twin-pair', start: '2027-03-07', weeks: 4, registered: '2027-01-15' });
    expect(student.quoteError).toContain('两人同住价');
    const pricing = pricingFor('city');
    const pair: BeciPageStudent[] = [];
    for (let index = 0; index < 2; index++) {
      const member = new BeciPageStudent(pricing, 'city', () => pair);
      member.quotePlan.courses[0].optionId = 'city-lite-esl';
      member.quotePlan.rooms[0].optionId = 'city-studio-twin-pair';
      member.quotePlan.setStayStart('2027-03-07');
      member.quotePlan.setStayWeeks(4);
      member.selectedRegistrationDate = '2027-01-15';
      pair.push(member);
    }
    expect(pair[0].quoteError).toBe('');
    expect(pair[0].accommodation).toBe(750);
  });

  it('upgrades a saved 2026 document once and keeps employee rows', () => {
    const saved = createDefaultBeciContentConfig();
    delete (saved.quoteSettings as { beciPolicyVersion?: number }).beciPolicyVersion;
    saved.courses.find(item => item.id === 'city-native-esl')!.tuition = 900;
    saved.courses.push({ ...saved.courses[0], id: 'employee-course', sortOrder: 50 });
    const upgraded = cloneBeciContentConfig(saved);
    expect(upgraded.courses.find(item => item.id === 'city-native-esl')!.tuition).toBe(950);
    expect(upgraded.courses.some(item => item.id === 'employee-course')).toBeTrue();
    upgraded.courses.find(item => item.id === 'city-native-esl')!.tuition = 960;
    expect(cloneBeciContentConfig(upgraded).courses.find(item => item.id === 'city-native-esl')!.tuition).toBe(960);
  });

  it('shows the 2027 off-season card only on EOP and City', () => {
    expect(beciOffers('sparta').some(card => card.title === '2027淡季九折')).toBeFalse();
    expect(beciOffers('eop').some(card => card.title === '2027淡季九折')).toBeTrue();
  });
});

describe('BECI campus pages on the shared template', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      { provide: SchoolService, useValue: { getSchools: () => of([]) } },
      { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
      { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8.2 }) } },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
      { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
    ] });
  });

  const cases = [
    { campus: 'eop', create: (): BeciSchoolPageComponent => new BeciEopSchoolComponent(), course: 'eop-speed-esl', courses: 7, rooms: 9 },
    { campus: 'city', create: (): BeciSchoolPageComponent => new BeciCitySchoolComponent(), course: 'city-lite-esl', courses: 4, rooms: 7 },
    { campus: 'sparta', create: (): BeciSchoolPageComponent => new BeciSpartaSchoolComponent(), course: 'sparta-24-esl', courses: 4, rooms: 2 },
  ] as const;

  for (const item of cases) {
    it(`${item.campus}: lists only its own campus and builds a quote image`, () => {
      const page = TestBed.runInInjectionContext(item.create);
      expect(page.courseFees.length).toBe(item.courses);
      expect(page.roomFees.length).toBe(item.rooms);
      expect(page.selectedCourseId).toBe(item.course);
      expect(page.quote.quoteImageData.headingText).toContain('BECI');
      expect(page.quote.quoteImageData.localFeeItems?.length).toBeGreaterThan(5);
    });
  }
});
