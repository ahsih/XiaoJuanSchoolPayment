import { TestBed } from '@angular/core/testing';
import { SchoolService } from '../../../../services/school.service';
import { BeciSchoolDetailComponent } from './beci-school-detail.component';

describe('BeciSchoolDetailComponent pricing', () => {
  let component: BeciSchoolDetailComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SchoolService, useValue: {} }],
    });
    component = TestBed.runInInjectionContext(() => new BeciSchoolDetailComponent());
    component.selectedCourseId = 'eop-lite-esl';
    component.selectedRoomId = 'eop-quad';
    component.selectedStartDate = '2026-08-23';
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
    expect(component.payableRegistrationFee).toBe(0);
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

  it('adds the peak-season surcharge after promotions', () => {
    component.selectedWeeks = 4;
    component.selectedStartDate = '2026-07-01';

    expect(component.seasonalSurcharge).toBe(160);
    expect(component.quoteUsd).toBe(1400);
  });
});
