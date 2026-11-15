import { CipSchoolComponent } from './cip-school.component';
import { CipStudentQuote } from './cip-student-quote';
import { CIP_COURSES, CIP_ROOMS, CIP_WEEKS, cipAllowedWeeks, cipDate, cipEndDate, cipLocalFees, cipNextSunday, cipPickup } from './cip-pricing';
import { CIP_HOLIDAYS } from './cip-content';

interface CipQuoteInput { courseId: string; roomId: string; weeks: number; start: string; age: number; family: boolean; }
const base: CipQuoteInput = { courseId: 'light-esl', roomId: 'in-campus-triple', weeks: 4, start: '2026-09-20', age: 18, family: false };
const quote = (changes: Partial<CipQuoteInput> = {}) => {
  const input = { ...base, ...changes }, student = new CipStudentQuote();
  student.registrationDate = '2026-09-01'; student.age = input.age; student.familyStay = input.family;
  student.plan.updateWeeks('course', student.plan.courses[0].id, input.weeks);
  student.plan.courses[0].optionId = input.courseId; student.plan.rooms[0].optionId = input.roomId;
  student.plan.courses[0].startDate = input.start; student.plan.rooms[0].startDate = input.start;
  return { tuition: student.tuition, room: student.accommodation, registration: student.registration,
    discount: student.discount, total: student.total, end: student.plan.endDate, issues: student.issues };
};

describe('CIP September CNY pricing and eligibility', () => {
  it('matches the ordinary-adult headline including one 600 yuan registration', () => {
    expect(quote()).toEqual(jasmine.objectContaining({ tuition: 4320, room: 4020, registration: 600, discount: 0, total: 8940, end: '2026-10-17', issues: [] }));
    const component = new CipSchoolComponent();
    expect(component.localReferences.find(row => row.weeks === 8)?.dorm).toBe(33490);
    expect(new CipStudentQuote().plan.rooms[0].optionId).toBe('in-campus-triple');
  });
  it('preserves confirmed short-stay rules and does not add an accommodation registration', () => {
    expect(quote({ weeks: 1 }).total).toBe(3936);
    expect(quote({ weeks: 2 }).total).toBe(6021);
    expect(quote({ weeks: 3 }).total).toBe(7689);
    expect(quote({ weeks: 2, courseId: 'regular-esl', roomId: 'in-campus-single-b' }).total).toBeNull();
  });
  it('deducts the source long-stay discount exactly once', () => {
    const expected = [[16, 300, 33660], [20, 600, 41700], [24, 900, 49740]];
    for (const [weeks, discount, total] of expected) expect(quote({ weeks })).toEqual(jasmine.objectContaining({ discount, total }));
  });
  it('does not activate the unconfirmed seasonal cash, native upgrade or free pickup automatically', () => {
    for (const start of ['2026-09-20', '2026-12-20', '2027-01-03']) {
      expect(quote({ start }).total).toBe(8940);
      expect(quote({ start }).discount).toBe(0);
    }
    expect(cipPickup('clark', 1)).toBe(1000);
  });
  it('enforces each duration at calculation and selection boundaries', () => {
    for (const [id, allowed] of [['speak-up', [1, 2]], ['ielts-basic', [4]], ['ielts-guarantee-8', [8]], ['ielts-guarantee-12', [12]]] as const) {
      const course = CIP_COURSES.find(c => c.id === id)!;
      expect(cipAllowedWeeks(course)).toEqual([...allowed]);
      for (const weeks of CIP_WEEKS.filter(w => !allowed.includes(w as never))) expect(quote({ courseId: id, weeks }).total).toBeNull();
    }
    for (const [courseId, weeks] of [['speaking-master', 12], ['advanced-business', 16], ['toeic-regular', 20], ['ielts-intensive', 20], ['junior-esl', 20]] as const) expect(quote({ courseId, weeks }).total).toBeNull();
    const student = new CipStudentQuote(), row = student.plan.courses[0];
    for (const [id, weeks] of [['speak-up', 2], ['ielts-guarantee-8', 8], ['ielts-basic', 4]] as const) {
      row.optionId = id; student.onOptionChange({ kind: 'course', row }); expect(row.weeks).toBe(weeks);
    }
  });
  it('quotes the confirmed fixed 8-week package and blocks unsupported or conflicting prices', () => {
    expect(quote({ courseId: 'ielts-guarantee-8', roomId: 'in-campus-single-a', weeks: 8 }).total).toBe(29400);
    for (const courseId of ['native-master', 'ielts-guarantee-12', 'toefl-intensive']) expect(quote({ courseId, weeks: courseId === 'ielts-guarantee-12' ? 12 : 4 }).total).toBeNull();
    for (const course of CIP_COURSES.filter(c => c.mode === '斯巴达')) expect(quote({ courseId: course.id, roomId: 'deluxe-king-single', weeks: course.fixedWeeks || 4 }).total).toBeNull();
    expect(quote({ courseId: 'regular-esl', roomId: 'deluxe-king-single', weeks: 12 }).total).toBeNull();
    expect(quote({ roomId: 'deluxe-king-single', weeks: 2 }).total).toBeNull();
    expect(quote({ roomId: 'deluxe-king-single' }).total).toBe(16484);
    for (const room of CIP_ROOMS.filter(r => r.sharedHotel)) expect(quote({ roomId: room.id }).total).toBeNull();
  });
  it('does not use family accommodation or junior prices for ineligible students', () => {
    expect(quote({ roomId: 'd4' }).total).toBeNull();
    expect(quote({ roomId: 'd4', family: true }).total).toBe(8340);
    expect(quote({ courseId: 'primary-english', age: 11 }).total).toBe(12000);
    expect(quote({ courseId: 'primary-english', age: 12 }).total).toBeNull();
    expect(quote({ courseId: 'junior-esl', age: 12 }).total).toBe(12540);
    expect(quote({ courseId: 'junior-esl', age: 16 }).total).toBeNull();
    expect(quote({ age: 10 }).total).toBeNull();
    for (const age of [0, 6, 100, 12.5, NaN]) expect(quote({ age }).total).toBeNull();
  });
});

describe('CIP local fees from the June sheets', () => {
  it('matches every published dorm/hotel total, separating refundable deposits', () => {
    const dormTotals = [14150,15250,17350,18450,29490,46310,55650,65500,86650];
    const hotelTotals = [11550,12050,12550,13050,20690,34110,41050,48500,67250];
    const deposits = [2000,2000,3000,3000,4000,5000,5000,5000,5000];
    CIP_WEEKS.forEach((weeks, index) => {
      const dorm = cipLocalFees(weeks, false)!, hotel = cipLocalFees(weeks, true)!;
      expect(dorm.total).withContext(`${weeks}w dorm`).toBe(dormTotals[index]);
      expect(dorm.deposit).toBe(deposits[index]);
      expect(dorm.subtotal + dorm.deposit).toBe(dorm.total);
      expect(hotel.total).withContext(`${weeks}w hotel`).toBe(hotelTotals[index]);
      expect(hotel.deposit).toBe(0);
      expect(hotel.rows.some(r => r.label.includes('电费'))).toBeFalse();
    });
    expect(cipLocalFees(4, false)?.subtotal).toBe(15450);
  });
  it('does not interpolate undocumented local-fee periods', () => {
    for (const weeks of [0, 5, 6, 7, 10, 25, 1.5]) expect(cipLocalFees(weeks, false)).toBeNull();
  });
  it('uses one pickup group bracket rather than multiplying a per-person charge', () => {
    expect([1,2,3,4,8].map(n => cipPickup('clark', n))).toEqual([1000,1500,2000,2000,2000]);
    expect([1,2,3,4].map(n => cipPickup('manila', n))).toEqual([4500,5500,6500,6500]);
    expect(cipPickup('clark', 0)).toBeNull();
  });
});

describe('CIP calendar', () => {
  it('accepts only real Sunday arrivals and calculates Saturday departures across years', () => {
    expect(cipEndDate('2026-12-20', 4)).toBe('2027-01-16');
    expect(cipEndDate('2026-12-20', 1)).toBe('2026-12-26');
    for (const start of ['', '2026-09-21', '2026-02-30', '2026-9-20', 'bad']) expect(quote({ start }).total).toBeNull();
    expect(cipNextSunday(new Date(2026, 8, 21))).toBe('2026-09-27');
    expect(cipNextSunday(new Date(2026, 8, 20))).toBe('2026-09-20');
  });
  it('corrects dates without turning government dates into assumed school closures', () => {
    expect(CIP_HOLIDAYS.find(d => d.date === '2026-03-20')?.school).toBe('课程安排待学校确认');
    expect(CIP_HOLIDAYS.find(d => d.date === '2026-02-25')?.school).toBe('学校日历标注有课');
    expect(CIP_HOLIDAYS.find(d => d.date === '2026-12-25')?.school).toBe('课程安排待学校确认');
    expect(CIP_HOLIDAYS.some(d => d.date === '2026-03-17')).toBeFalse();
    expect(cipDate('2026-08-21')?.getUTCDay()).toBe(5);
    expect(cipDate('2026-12-08')?.getUTCDay()).toBe(2);
    expect(CIP_HOLIDAYS.every(d => d.date.startsWith('2026-') && cipDate(d.date))).toBeTrue();
  });
});
