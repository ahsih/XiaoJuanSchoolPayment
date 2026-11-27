import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import {
  createDefaultGitcContentConfig,
  gitcCampusContent,
  type GitcCampus,
  type GitcCourseContent,
  type GitcRoomContent,
} from './gitc-content-config';
import { GitcPageStudent, gitcPeriodFee, type GitcQuotePricing } from './gitc-page-quote';

// GITC's two campus pages on the shared Philippine template. The amounts below were worked out by hand from the
// school's 2026 and 2027 brochures and its 2026 local-fee sheet (docs/gitc-source-2026-11-26.md). The sheet's own
// totals include the 2,000-peso deposit and leave out textbooks; the quote lists the deposit apart and estimates one
// 500-peso book per 4 course weeks.
function pricingFor(campus: GitcCampus): GitcQuotePricing {
  const content = gitcCampusContent(createDefaultGitcContentConfig(), campus);
  return {
    ...createCiaQuotePricing(content),
    phpPerCny: 8,
    usdToCny: 7,
    gitcCourses: content.courses as GitcCourseContent[],
    gitcRooms: content.rooms as GitcRoomContent[],
  } as GitcQuotePricing;
}

function plan(student: GitcPageStudent, value: { course: string; room: string; start: string; weeks: number }): GitcPageStudent {
  student.quotePlan.courses[0].optionId = value.course;
  student.quotePlan.rooms[0].optionId = value.room;
  student.quotePlan.setStayStart(value.start);
  student.quotePlan.setStayWeeks(value.weeks);
  return student;
}
const studentFor = (campus: GitcCampus, value: { course: string; room: string; start: string; weeks: number }) =>
  plan(new GitcPageStudent(pricingFor(campus), campus), value);

const feeTotal = (student: GitcPageStudent) => student.localFees.reduce((sum, fee) => sum + fee.total, 0);
const fee = (student: GitcPageStudent, item: string) => student.localFees.find(row => row.item.startsWith(item));

describe('GITC quote rules', () => {
  it('Iloilo 4 weeks from 2027-02-14: 2027 prices, Regular 850 + One Spatial single 750', () => {
    const student = studentFor('iloilo', { course: 'il-regular', room: 'il-one-spatial-single', start: '2027-03-07', weeks: 4 });
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(850);
    expect(student.accommodation).toBe(750);
    expect(student.quoteUsd).toBe(1700);
    // pickup 1,000 + facility 5,000 + SSP 7,500 + SSP I-Card 4,000 + ID 500 + book 500 (sheet: 20,000 with deposit)
    expect(feeTotal(student)).toBe(18500);
  });

  it('the 2027 list starts with the 2027-02-14 arrival; the Sunday before keeps 2026 prices', () => {
    expect(studentFor('cebu', { course: 'cb-regular', room: 'cb-capsule-regular', start: '2027-02-07', weeks: 4 }).quoteUsd).toBe(1200);
    expect(studentFor('cebu', { course: 'cb-regular', room: 'cb-capsule-regular', start: '2027-02-14', weeks: 4 }).quoteUsd).toBe(1400);
  });

  it('Iloilo 12 weeks in 2026, Basic + Avida single, 30-day visa', () => {
    const student = studentFor('iloilo', { course: 'il-basic', room: 'il-avida-single', start: '2026-12-06', weeks: 12 });
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(2100);
    expect(student.accommodation).toBe(1950);
    expect(student.quoteUsd).toBe(4150);
    expect(fee(student, '签证延期')?.total).toBe(9580);
    expect(fee(student, 'ACR')?.total).toBe(4000);
    expect(fee(student, '设施费')?.total).toBe(15000);
    // sheet 12 weeks: 43,580 with the deposit; minus 2,000 deposit, plus 3 books
    expect(feeTotal(student)).toBe(43080);
  });

  it('a 59-day entry starts extensions and ACR at week 9', () => {
    const student = studentFor('iloilo', { course: 'il-basic', room: 'il-avida-single', start: '2026-12-06', weeks: 8 });
    student.visaType = 'tourist59';
    expect(fee(student, '签证延期')?.total).toBe(0);
    expect(fee(student, 'ACR')?.total).toBe(0);
    student.quotePlan.setStayWeeks(12);
    expect(fee(student, '签证延期')?.total).toBe(5410);
    expect(fee(student, 'ACR')?.total).toBe(4000);
  });

  it('Cebu 2 weeks on campus in 2026: 75% short-stay price and the sheet’s 2-week fees', () => {
    const student = studentFor('cebu', { course: 'cb-power', room: 'cb-capsule-regular', start: '2026-12-13', weeks: 2 });
    expect(student.quoteError).toBe('');
    expect(student.tuition).toBe(675);
    expect(student.accommodation).toBe(225);
    expect(student.quoteUsd).toBe(1000);
    expect(fee(student, '设施费')?.total).toBe(3750);
    expect(fee(student, '水电费')?.total).toBe(5250);
    // sheet on-campus 2 weeks: 24,000 with the deposit
    expect(feeTotal(student)).toBe(22500);
  });

  it('off-campus condos pay no fixed utilities', () => {
    const student = studentFor('cebu', { course: 'cb-regular', room: 'cb-condo-single', start: '2027-03-07', weeks: 4 });
    expect(fee(student, '水电费')).toBeUndefined();
    expect(student.quoteUsd).toBe(850 + 980 + 100);
  });

  it('guarantee courses need 12 weeks', () => {
    const short = studentFor('cebu', { course: 'cb-ielts-guarantee', room: 'cb-condo-single', start: '2027-03-07', weeks: 8 });
    expect(short.quoteError).toContain('最低报名12周');
    const student = studentFor('cebu', { course: 'cb-ielts-guarantee', room: 'cb-condo-single', start: '2027-03-07', weeks: 12 });
    expect(student.quoteError).toBe('');
    expect(student.quoteUsd).toBe(1300 * 3 + 980 * 3 + 100);
  });

  it('rooms the school has not priced for 2027 and courses it no longer runs cannot be quoted', () => {
    expect(studentFor('iloilo', { course: 'il-regular', room: 'il-smdc-single', start: '2026-12-06', weeks: 4 }).quoteError).toBe('');
    expect(studentFor('iloilo', { course: 'il-regular', room: 'il-smdc-single', start: '2027-03-07', weeks: 4 }).quoteError).toContain('待学校确认');
    expect(studentFor('iloilo', { course: 'il-junior', room: 'il-avida-single', start: '2027-03-07', weeks: 4 }).quoteError).toContain('不开设');
    expect(studentFor('iloilo', { course: 'il-regular', room: 'il-avida-triple', start: '2027-03-07', weeks: 4 }).quoteError).toContain('不再开放');
  });

  it('a twin room needs two students of the quote on the same weeks', () => {
    const value = { course: 'il-regular', room: 'il-one-spatial-twin', start: '2027-03-07', weeks: 4 };
    expect(studentFor('iloilo', value).quoteError).toContain('2人同住');
    const pricing = pricingFor('iloilo');
    const pair: GitcPageStudent[] = [];
    pair.push(plan(new GitcPageStudent(pricing, 'iloilo', () => pair), value), plan(new GitcPageStudent(pricing, 'iloilo', () => pair), value));
    expect(pair.map(student => student.quoteError)).toEqual(['', '']);
    expect(pair[0].quoteUsd).toBe(850 + 530 + 100);
  });

  it('returning students pay no registration fee', () => {
    const student = studentFor('cebu', { course: 'cb-basic', room: 'cb-capsule-big', start: '2027-03-07', weeks: 4 });
    student.returningStudent = true;
    expect(student.quoteUsd).toBe(700 + 550);
  });

  it('facility fee follows the sheet for every week count', () => {
    expect([1, 2, 3, 4, 5, 8, 9, 24].map(weeks => gitcPeriodFee(weeks, 5000, [0, 2000, 3750, 4500])))
      .toEqual([2000, 3750, 4500, 5000, 7000, 10000, 12000, 30000]);
  });
});
