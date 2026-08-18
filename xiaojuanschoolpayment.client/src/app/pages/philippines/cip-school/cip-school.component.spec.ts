import { CipSchoolComponent } from './cip-school.component';

describe('CipSchoolComponent pricing', () => {
  let component: CipSchoolComponent;

  beforeEach(() => {
    component = new CipSchoolComponent();
  });

  it('uses the supplied four-week CIP prices and registration fees', () => {
    expect(component.courseFees.find((course) => course.id === 'light-esl')?.tuition).toBe(4320);
    expect(component.roomFees.find((room) => room.id === 'd4')?.fee).toBe(3420);
    expect(component.registrationFee).toBe(1100);
  });

  it('calculates one, two and three weeks at 40%, 65% and 85%', () => {
    component.selectedCourseId = 'regular-esl';
    component.selectedRoomId = 'd4';

    component.selectedWeeks = 1;
    expect(component.tuitionForSelectedWeeks).toBe(1968);
    expect(component.roomFeeForSelectedWeeks).toBe(1368);

    component.selectedWeeks = 2;
    expect(component.tuitionForSelectedWeeks).toBe(3198);
    expect(component.roomFeeForSelectedWeeks).toBe(2223);

    component.selectedWeeks = 3;
    expect(component.tuitionForSelectedWeeks).toBe(4182);
    expect(component.roomFeeForSelectedWeeks).toBe(2907);
  });

  it('applies the supplied long-term discounts', () => {
    component.selectedCourseId = 'light-esl';
    component.selectedRoomId = 'd4';
    component.selectedWeeks = 16;

    expect(component.longTermDiscount).toBe(300);
    expect(component.quoteCny).toBe(31760);
  });

  it('limits Speak Up to two weeks', () => {
    component.selectedWeeks = 4;
    component.selectedCourseId = 'speak-up';

    component.ensureValidWeeks();

    expect(component.availableWeekOptions).toEqual([1, 2]);
    expect(component.selectedWeeks).toBe(2);
  });
});
