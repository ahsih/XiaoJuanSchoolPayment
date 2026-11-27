import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { chinaToday, ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { WinningAyalaSchoolComponent } from './winning-ayala-school.component';
import { WinningOceanSchoolComponent } from './winning-ocean-school.component';
import { winningDefaultStart } from './winning-page-quote';
import { winningBookFee } from './winning-pricing';
import type { WinningSchoolPageComponent } from './winning-school-page';

// Winning's two campus pages on the shared Philippine template. Expected amounts are worked out by hand from the
// school's 2026-09-22 Ayala table, the 2026-06-03 table (Ocean), the material-fee table and the CALA 2027 notice.
describe('Winning campus pages on the shared template', () => {
  const providers = () => TestBed.configureTestingModule({ providers: [
    { provide: SchoolService, useValue: { getSchools: () => of([]) } },
    { provide: SchoolContentService, useValue: { getPublished: () => of(null) } },
    { provide: ExchangeRateService, useValue: { getLatestCnyRates: () => of({ date: chinaToday(), usdToCny: 7, phpPerCny: 8 }) } },
    { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
    { provide: ElementRef, useValue: new ElementRef(document.createElement('div')) },
  ] });
  const create = <T extends WinningSchoolPageComponent>(factory: () => T): T => {
    const page = TestBed.runInInjectionContext(factory);
    page.selectedStartDate = '2027-03-07';
    return page;
  };
  const localFee = (page: WinningSchoolPageComponent, item: string) => page.estimatedLocalFees.find(fee => fee.item.startsWith(item));
  const localTotal = (page: WinningSchoolPageComponent) => page.estimatedLocalFees.reduce((sum, fee) => sum + fee.total, 0);

  beforeEach(providers);

  it('reads the material-fee table by the next column up', () => {
    const esl4 = [2200, 2600, 3400, 4200, 5000, 5800, 6600];
    expect(winningBookFee(esl4, 1)).toBe(2200);
    expect(winningBookFee(esl4, 4)).toBe(2600);
    expect(winningBookFee(esl4, 6)).toBe(3400);
    expect(winningBookFee(esl4, 28)).toBe(7400);
  });

  describe('Ayala campus', () => {
    let page: WinningAyalaSchoolComponent;
    beforeEach(() => { page = create(() => new WinningAyalaSchoolComponent()); });
    const student = () => page.students[0];

    it('lists only Ayala courses and rooms', () => {
      const courses = page.quotePlan.options('course').map(option => option.id);
      const rooms = page.quotePlan.options('room').map(option => option.id);
      expect(courses).toContain('ielts');
      expect(courses).toContain('business');
      expect(rooms).toContain('cqh-2p');
      expect(rooms).toContain('lyf-1p');
      expect(rooms).not.toContain('ocean-2p');
      expect(page.selectedCourseId).toBe('esl4');
      expect(page.selectedRoomId).toBe('cqh-2p');
    });

    it('takes 5% for 思达启航 without the opening offer (registration in 2027)', () => {
      student().selectedRegistrationDate = '2027-01-05';
      // 100 + 777 + 950 − 5% of 1,727
      expect(page.quote.quoteUsd).toBeCloseTo(1740.65, 2);
      student().returningStudent = true;
      expect(page.quote.quoteUsd).toBeCloseTo(1640.65, 2);
    });

    it('gives the opening upgrade and 15% for a 2026 registration in the off-peak season', () => {
      student().selectedRegistrationDate = '2026-11-26';
      // ESL4 at the ESL2 price (−105), 15% of 1,622 (−243.30), then 5% of 1,378.70 (−68.94)
      expect(student().upgradeDiscount).toBe(105);
      expect(student().openingDiscount).toBeCloseTo(243.3, 2);
      expect(page.quote.quoteUsd).toBeCloseTo(1409.76, 1);
      expect(page.quoteImageData.headingText).toContain('Winning Ayala校区 4周报价');
    });

    it('leaves the winter peak out of the opening offer', () => {
      student().selectedRegistrationDate = '2026-11-26';
      page.selectedStartDate = '2027-01-24';
      expect(student().openingDiscount).toBe(0);
      expect(student().upgradeDiscount).toBe(0);
      expect(page.quote.quoteUsd).toBeCloseTo(1740.65, 2);
    });

    it('adds 60 dollars a week in the 2027 summer peak, outside the discounts', () => {
      student().selectedRegistrationDate = '2027-01-05';
      page.selectedStartDate = '2027-07-04';
      expect(student().seasonalSurcharge).toBe(240);
      expect(page.quote.quoteUsd).toBeCloseTo(1980.65, 2);
    });

    it('prices one to three weeks at 40/60/80%', () => {
      student().selectedRegistrationDate = '2027-01-05';
      page.selectedWeeks = 2;
      expect(student().tuition).toBeCloseTo(466.2, 2);
      expect(student().accommodation).toBeCloseTo(570, 2);
      // 100 + 1,036.20 − 51.81
      expect(page.quote.quoteUsd).toBeCloseTo(1084.39, 2);
    });

    it('matches the school tables for local fees', () => {
      // 4 weeks, 30-day visa: SSP 7,800 + E-Card 4,500 + water/power 3,600 + management 2,000 + books 2,600 + ID 200
      expect(localTotal(page)).toBe(20700);
      page.selectedWeeks = 8;
      // + first extension 5,440 and ACR 4,500; water/power 7,200, management 4,000, books 3,400
      expect(localFee(page, '签证续签')?.total).toBe(5440);
      expect(localFee(page, 'ACR')?.total).toBe(4500);
      expect(localTotal(page)).toBe(37040);
      page.selectedWeeks = 12;
      student().visaType = 'tourist59';
      expect(localFee(page, '签证续签')?.total).toBe(7220);
      expect(localTotal(page)).toBe(45220);
    });

    it('asks for two weeks at Lyf Hotel and blocks children courses for adults', () => {
      page.quotePlan.rooms[0].optionId = 'lyf-1p';
      page.selectedWeeks = 1;
      expect(page.quote.quoteError).toContain('Lyf');
      page.selectedWeeks = 2;
      expect(page.quote.quoteError).toBe('');
      page.quotePlan.courses[0].optionId = 'jep-kids';
      expect(page.quote.quoteError).toContain('未满18岁');
      student().selectedAgeGroup = 'minor';
      expect(page.quote.quoteError).toBe('');
    });

    it('adds students up in a group quote', () => {
      student().selectedRegistrationDate = '2027-01-05';
      page.quote.setQuoteMode('group');
      page.students[1].selectedRegistrationDate = '2027-01-05';
      page.students[1].quotePlan.setStayStart('2027-03-07');
      expect(page.quote.activeStudents.length).toBe(2);
      expect(page.quote.quoteUsd).toBeCloseTo(2 * 1740.65, 1);
    });
  });

  describe('Ocean campus', () => {
    let page: WinningOceanSchoolComponent;
    beforeEach(() => { page = create(() => new WinningOceanSchoolComponent()); });

    it('lists only Ocean courses and rooms', () => {
      const courses = page.quotePlan.options('course').map(option => option.id);
      const rooms = page.quotePlan.options('room').map(option => option.id);
      expect(courses).not.toContain('ielts');
      expect(courses).toContain('preschool');
      expect(rooms).toEqual(['ocean-1p', 'ocean-2p', 'ocean-family-3p', 'ocean-bp4', 'ocean-bp8']);
    });

    it('quotes the 2026 Ocean prices with the 5% and no opening offer', () => {
      // 100 + 777 + 900 − 5% of 1,677
      expect(page.quote.quoteUsd).toBeCloseTo(1693.15, 2);
      page.selectedWeeks = 12;
      // 100 + 2,331 + 2,700 − 5% of 5,031
      expect(page.quote.quoteUsd).toBeCloseTo(4879.45, 2);
    });

    it('takes no arrivals in November and December 2026', () => {
      expect(winningDefaultStart('ocean', new Date('2026-11-26T12:00:00'))).toBe('2027-01-03');
      expect(winningDefaultStart('ayala', new Date('2026-11-26T12:00:00'))).toBe('2026-11-29');
      page.selectedStartDate = '2026-12-06';
      expect(page.quote.quoteError).toContain('暂停');
    });
  });
});
