import { TestBed } from '@angular/core/testing';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { BeciSchoolDetailComponent } from './beci-school-detail.component';

describe('BeciSchoolDetailComponent pricing', () => {
  let component: BeciSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SchoolService, useValue: {} },
        { provide: ExchangeRateService, useValue: {} },
      ],
    });
    component = TestBed.runInInjectionContext(() => new BeciSchoolDetailComponent());
    component.selectedCourseId = 'eop-lite-esl';
    component.selectedRoomId = 'eop-quad';
    component.selectedStartDate = '2027-01-10';
  });

  it('uses the supplied 2026 course prices', () => {
    expect(component.courseFees.find((course) => course.id === 'eop-junior-esl')?.tuition).toBe(1300);
    expect(component.courseFees.find((course) => course.id === 'eop-junior-ielts')?.tuition).toBe(1400);
    expect(component.courseFees.find((course) => course.id === 'sparta-ielts-guarantee-12')?.tuition).toBe(1100);
    expect(component.courseFees.find((course) => course.id === 'city-native-esl')?.tuition).toBe(900);
    expect(component.courseFees.find((course) => course.id === 'city-unlimited-esl')?.tuition).toBe(900);
    expect(component.roomFees.find((room) => room.id === 'city-studio-twin-couple')?.fee).toBe(750);
  });

  it('waives registration and applies the short-stay tuition percentages', () => {
    component.selectedWeeks = 1;
    expect(component.tuitionForSelectedWeeks).toBe(268);
    expect(component.roomFeeForSelectedWeeks).toBe(142.5);
    expect(component.registrationDiscountAmount).toBe(100);
    expect(component.quoteUsd).toBe(410.5);

    component.selectedWeeks = 2;
    expect(component.tuitionForSelectedWeeks).toBe(402);

    component.selectedWeeks = 3;
    expect(component.tuitionForSelectedWeeks).toBe(536);
  });

  it('applies the supplied long-stay discounts', () => {
    const expectedDiscounts = new Map([
      [8, 50],
      [12, 100],
      [16, 200],
      [20, 300],
      [24, 400],
    ]);

    for (const [weeks, discount] of expectedDiscounts) {
      component.selectedWeeks = weeks;
      expect(component.longStayDiscount).withContext(`${weeks} weeks`).toBe(discount);
    }
  });

  it('applies the 2026 off-season 10% discount to tuition and room', () => {
    component.selectedWeeks = 4;
    component.selectedStartDate = '2026-09-06';

    expect(component.offSeasonDiscountAmount).toBeCloseTo(124, 5);
    expect(component.quoteUsd).toBeCloseTo(1116, 5);
  });

  it('keeps course and room campus selections aligned', () => {
    component.selectedCourseId = 'city-lite-esl';
    component.onCourseChange();

    expect(component.selectedRoomId).toBe('city-studio-quad');
    expect(component.availableRoomFees.every((room) => room.id.startsWith('city-'))).toBeTrue();
  });

  it('reproduces the supplied 8-week local-fee total', () => {
    component.selectedWeeks = 8;
    expect(component.localFeeTotal).toBe(28500);
  });
});
