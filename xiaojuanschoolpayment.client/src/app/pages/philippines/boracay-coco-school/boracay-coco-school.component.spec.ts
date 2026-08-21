import { BoracayCocoSchoolComponent } from './boracay-coco-school.component';

describe('BoracayCocoSchoolComponent pricing', () => {
  let component: BoracayCocoSchoolComponent;

  beforeEach(() => {
    component = new BoracayCocoSchoolComponent();
  });

  it('uses the 2026 four-week course prices', () => {
    expect(component.courseOptions.map(({ name, tuition }) => ({ name, tuition }))).toEqual([
      { name: 'General ESL', tuition: 800 },
      { name: 'Power ESL', tuition: 860 },
      { name: 'Intensive ESL', tuition: 900 },
      { name: 'Super Intensive ESL', tuition: 1000 },
      { name: 'Business English', tuition: 1000 },
      { name: 'IELTS Course', tuition: 1000 },
      { name: 'Lite ESL', tuition: 700 },
      { name: 'Nursery Course', tuition: 1200 },
      { name: 'Kinder Course', tuition: 1200 },
      { name: 'Junior Course', tuition: 1380 },
    ]);
  });

  it('uses the 2026 four-week food and accommodation prices', () => {
    expect(component.roomOptions.map(({ shortName, rate }) => ({ shortName, rate }))).toEqual([
      { shortName: '单人间', rate: 1300 },
      { shortName: '双人间', rate: 900 },
      { shortName: '豪华亲子双人间', rate: 900 },
      { shortName: '豪华亲子三人间', rate: 760 },
      { shortName: '家庭房二人间', rate: 900 },
      { shortName: '家庭房四人间', rate: 800 },
      { shortName: '家庭房五人间', rate: 700 },
    ]);
  });

  it('applies the short-stay percentages to tuition and food/accommodation', () => {
    const course = component.courseOptions[0];
    const room = component.roomOptions[1];

    expect(component.tuitionFor(course, 1)).toBe(320);
    expect(component.tuitionFor(course, 2)).toBe(480);
    expect(component.tuitionFor(course, 3)).toBe(640);
    expect(component.accommodationFor(room, 1)).toBe(360);
    expect(component.accommodationFor(room, 2)).toBe(540);
    expect(component.accommodationFor(room, 3)).toBe(720);
  });

  it('calculates the updated four-week starting price including registration', () => {
    component.selectedCourseId = 'lite-esl';
    component.selectedRoomId = 'family-room-five';
    component.selectedWeeks = 4;

    expect(component.quoteUsd).toBe(1500);
  });
});
