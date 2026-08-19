import { ApiBeciCitySchoolComponent } from './api-beci-city-school.component';

describe('ApiBeciCitySchoolComponent pricing', () => {
  let component: ApiBeciCitySchoolComponent;

  beforeEach(() => {
    component = new ApiBeciCitySchoolComponent();
  });

  it('uses the supplied City Campus course prices', () => {
    expect(component.courseOptions.find((course) => course.id === 'light-esl')?.courseFee).toBe(670);
    expect(component.courseOptions.find((course) => course.id === 'native-esl')?.courseFee).toBe(900);
    expect(component.courseOptions.find((course) => course.id === 'unlimited-esl')?.courseFee).toBe(900);
    expect(component.courseOptions.find((course) => course.id === 'junior-esl')?.courseFee).toBe(1300);
    expect(component.roomOptions.find((room) => room.id === 'studio-double-couple')?.fee).toBe(750);
  });

  it('applies short-stay percentages to tuition and prorates the room', () => {
    expect(component.feeFor('light-esl', 'studio-quad', 1)).toBe(418);
    expect(component.feeFor('light-esl', 'studio-quad', 2)).toBe(702);
    expect(component.feeFor('light-esl', 'studio-quad', 3)).toBe(986);
    expect(component.feeFor('light-esl', 'studio-quad', 4)).toBe(1270);
  });

  it('waives registration and applies the exact long-stay discounts', () => {
    expect(component.payableRegistrationFee).toBe(0);
    expect(component.feeFor('light-esl', 'studio-quad', 8)).toBe(2490);
    expect(component.feeFor('light-esl', 'studio-quad', 12)).toBe(3710);
    expect(component.feeFor('light-esl', 'studio-quad', 16)).toBe(4880);
    expect(component.feeFor('light-esl', 'studio-quad', 20)).toBe(6050);
    expect(component.feeFor('light-esl', 'studio-quad', 24)).toBe(7220);
  });

  it('adds peak-season charges to the discounted package', () => {
    component.selectedCourseId = 'light-esl';
    component.selectedRoomId = 'studio-quad';
    component.selectedWeeks = 4;
    component.selectedStartDate = '2026-07-01';

    expect(component.seasonalSurcharge).toBe(160);
    expect(component.quoteUsd).toBe(1430);
  });
});
