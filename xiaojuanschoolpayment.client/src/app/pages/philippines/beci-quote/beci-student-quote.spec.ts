import { TestBed } from '@angular/core/testing';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { BeciQuoteCalculatorComponent } from './beci-quote-calculator.component';
import { BECI_CAMPUS_PRICING } from './beci-pricing';
import { BeciStudentQuote } from './beci-student-quote';

const setPlan = (student: BeciStudentQuote, weeks: number, startDate: string) => {
  student.quotePlan.courses[0].weeks = weeks;
  student.quotePlan.rooms[0].weeks = weeks;
  student.quotePlan.courses[0].startDate = startDate;
  student.quotePlan.rooms[0].startDate = startDate;
};

describe('BECI confirmed 2026 quote rules', () => {
  it('keeps each campus course and room catalog separate', () => {
    expect(BECI_CAMPUS_PRICING.eop.courses.length).toBe(7);
    expect(BECI_CAMPUS_PRICING.sparta.courses.length).toBe(4);
    expect(BECI_CAMPUS_PRICING.city.courses.length).toBe(4);
    expect(BECI_CAMPUS_PRICING.eop.rooms.length).toBe(5);
    expect(BECI_CAMPUS_PRICING.sparta.rooms.length).toBe(2);
    expect(BECI_CAMPUS_PRICING.city.rooms.length).toBe(5);
  });

  it('uses 40/60/80 percent for short course and accommodation rows', () => {
    const student = new BeciStudentQuote(BECI_CAMPUS_PRICING.eop);
    setPlan(student, 1, '2027-01-10');
    expect(student.tuition).toBe(268);
    expect(student.accommodation).toBe(228);
    expect(student.quoteUsd).toBe(496);

    setPlan(student, 2, '2027-01-10');
    expect(student.tuition).toBe(402);
    expect(student.accommodation).toBe(342);

    setPlan(student, 3, '2027-01-10');
    expect(student.tuition).toBe(536);
    expect(student.accommodation).toBe(456);
  });

  it('applies the full-stay off-season discount before the long-stay discount', () => {
    const student = new BeciStudentQuote(BECI_CAMPUS_PRICING.eop);
    setPlan(student, 8, '2026-09-06');
    expect(student.offSeasonDiscount).toBe(248);
    expect(student.longStayDiscount).toBe(50);
    expect(student.quoteUsd).toBe(2182);

    setPlan(student, 4, '2026-02-08');
    expect(student.offSeasonDiscount).toBe(124);
    expect(student.quoteUsd).toBe(1116);
  });

  it('charges only actual course weeks that overlap the peak period', () => {
    const student = new BeciStudentQuote(BECI_CAMPUS_PRICING.eop);
    setPlan(student, 4, '2026-06-28');
    expect(student.peakWeeks).toBe(4);
    expect(student.peakSurcharge).toBe(160);

    setPlan(student, 4, '2027-06-27');
    expect(student.peakWeeks).toBe(4);
  });

  it('uses the selected visa and pickup in the shared local fees', () => {
    const student = new BeciStudentQuote(BECI_CAMPUS_PRICING.eop);
    setPlan(student, 8, '2027-01-10');
    expect(student.visaExtensionCount).toBe(0);
    expect(student.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(25500);

    student.pickup = 'clark';
    expect(student.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(28500);

    student.pickup = 'none';
    student.visaType = 'tourist30';
    expect(student.visaExtensionCount).toBe(1);
    expect(student.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(34440);
  });

  it('blocks EOP shared rooms at age 40 and enforces the Sparta guarantee minimum', () => {
    const eop = new BeciStudentQuote(BECI_CAMPUS_PRICING.eop);
    eop.arrivalAge = 40;
    expect(eop.quoteError).toContain('只能选择单人间');
    eop.quotePlan.rooms[0].optionId = 'eop-regular-single';
    expect(eop.quoteError).toBe('');

    const sparta = new BeciStudentQuote(BECI_CAMPUS_PRICING.sparta);
    sparta.quotePlan.courses[0].optionId = 'sparta-ielts-guarantee';
    expect(sparta.quoteError).toContain('12周或以上');
    setPlan(sparta, 12, '2027-01-10');
    expect(sparta.quoteError).toBe('');
  });

  it('restricts the City couple rate to two spouses with matching Studio twin stays', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ExchangeRateService, useValue: {} }],
    });
    const component = TestBed.runInInjectionContext(() => new BeciQuoteCalculatorComponent());
    component.campus = 'city';
    component.setQuoteMode('group');
    component.studentCount = 2;
    for (const student of component.activeStudents) {
      student.cityCoupleRateSelected = true;
      student.quotePlan.rooms[0].optionId = 'city-studio-twin';
      setPlan(student, 4, '2027-01-10');
    }
    expect(component.quoteError).toBe('');
    expect(component.activeStudents.every((student) => student.accommodation === 750)).toBeTrue();
    expect(component.quoteUsd).toBe(2840);

    component.activeStudents[1].quotePlan.rooms[0].startDate = '2027-01-17';
    expect(component.quoteError).toContain('相同的Studio双人间入住日期和周数');
  });
});
