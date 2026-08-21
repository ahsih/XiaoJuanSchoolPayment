import { MkSchoolComponent } from './mk-school.component';

describe('MkSchoolComponent pricing', () => {
  let component: MkSchoolComponent;

  beforeEach(() => {
    component = new MkSchoolComponent();
  });

  it('uses the MK short-stay percentages for tuition and accommodation', () => {
    component.selectedWeeks = 1;
    expect(component.tuitionForSelectedWeeks).toBe(260);
    expect(component.roomFeeForSelectedWeeks).toBe(208);
    expect(component.quoteUsd).toBe(568);

    component.selectedWeeks = 2;
    expect(component.tuitionForSelectedWeeks).toBe(422.5);
    expect(component.roomFeeForSelectedWeeks).toBe(338);
    expect(component.quoteUsd).toBe(860.5);

    component.selectedWeeks = 3;
    expect(component.tuitionForSelectedWeeks).toBe(552.5);
    expect(component.roomFeeForSelectedWeeks).toBe(442);
    expect(component.quoteUsd).toBe(1094.5);
  });

  it('uses the supplied four-week prices and keeps registration separate', () => {
    expect(component.selectedCourse.tuition4w).toBe(650);
    expect(component.selectedRoom.fee4w).toBe(520);
    expect(component.quoteUsd).toBe(1270);
  });
});
