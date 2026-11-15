import { SMEAG_HOLIDAYS_2027, getSmeagHolidaySchedule } from './smeag-holidays-2027';

describe('SMEAG 2027 holiday schedules', () => {
  it('keeps all 15 poster dates in chronological order', () => {
    expect(SMEAG_HOLIDAYS_2027.length).toBe(15);
    expect(SMEAG_HOLIDAYS_2027.map(item => item.date)).toEqual([
      '2027-01-01', '2027-01-18', '2027-02-26', '2027-03-12', '2027-03-25',
      '2027-03-26', '2027-04-09', '2027-05-21', '2027-08-14', '2027-08-27',
      '2027-10-29', '2027-11-26', '2027-12-24', '2027-12-30', '2027-12-31',
    ]);
  });

  it('keeps the campus-specific closure rules separate', () => {
    const capitalClosed = SMEAG_HOLIDAYS_2027.filter(item => getSmeagHolidaySchedule(item, 'capital').status === 'closed');
    const encantoClosed = SMEAG_HOLIDAYS_2027.filter(item => getSmeagHolidaySchedule(item, 'encanto').status === 'closed');

    expect(capitalClosed.map(item => item.date)).toEqual([
      '2027-01-01', '2027-03-25', '2027-03-26', '2027-08-14', '2027-12-24', '2027-12-31',
    ]);
    expect(encantoClosed.map(item => item.date)).toEqual(['2027-01-01']);
  });

  it('preserves the exact Capital morning and afternoon topics', () => {
    const march = SMEAG_HOLIDAYS_2027.find(item => item.date === '2027-03-12')!;
    const december = SMEAG_HOLIDAYS_2027.find(item => item.date === '2027-12-30')!;

    expect(march.capital.sessions.map(item => item.titleEn)).toEqual([
      'TOEFL Test Practices (Reading & Writing)',
      'TOEFL Test Practices (Listening & Speaking)',
    ]);
    expect(december.capital.sessions.map(item => item.titleEn)).toEqual(['Vocabulary Class', 'Pattern English']);
  });

  it('uses Best Holiday Classes for every open Encanto poster date', () => {
    const openDates = SMEAG_HOLIDAYS_2027.filter(item => item.encanto.status === 'special');
    expect(openDates.length).toBe(14);
    expect(openDates.every(item => item.encanto.sessions[0]?.titleEn === 'Best Holiday Classes')).toBeTrue();
  });
});
