// CampusTop quotes against the school's own quote system (offline.qqeng.com, queried 2026-11-26): every expected
// total below is the system's figure for the same campus, dates, package, room, meals and pickup.
import { createCiaQuotePricing } from '../cia-school/cia-quote-engine';
import { createDefaultQqContentConfig, qqCampusContent } from './qq-content-config';
import { QqPageStudent } from './qq-page-quote';
import { qqClassDays, qqCoursePrice, qqRoomPrice, qqVisaFee, type QqCampus } from './qq-pricing';

function student(campus: QqCampus, arrival: string, weeks: number, course: string, room: string): QqPageStudent {
  const pricing = createCiaQuotePricing(qqCampusContent(createDefaultQqContentConfig(), campus));
  const result = new QqPageStudent(pricing as never, campus);
  result.quotePlan.setStayStart(arrival);
  result.quotePlan.setStayWeeks(weeks);
  result.quotePlan.courses.forEach(row => row.optionId = course);
  result.quotePlan.rooms.forEach(row => row.optionId = room);
  return result;
}

describe('CampusTop pricing', () => {
  it('prices courses by class days like the school system', () => {
    expect(qqCoursePrice('one4', 20)).toBe(784);
    expect(qqCoursePrice('one4', 18)).toBe(705.6);
    expect(qqCoursePrice('one4', 39)).toBe(1528.8);
    expect(qqCoursePrice('one4', 58)).toBe(2204);
    expect(qqCoursePrice('one6', 15)).toBe(830.7);
    expect(qqCoursePrice('one4-group2', 40)).toBe(1712.8);
    expect(qqCoursePrice('one6-group2', 40)).toBe(2348);
    expect(qqCoursePrice('one8', 13)).toBe(1060.8);
  });

  it('leaves the closed holidays out of the class days', () => {
    expect(qqClassDays('itp', '2027-01-10', 12)).toBe(58);
    expect(qqClassDays('bfc', '2027-09-26', 8)).toBe(39);
    expect(qqClassDays('itp', '2027-04-11', 4)).toBe(20);
  });

  it('prices rooms by nights', () => {
    expect(qqRoomPrice('capsule', '2027-04-11', 13)).toBe(222.95);
    expect(qqRoomPrice('capsule', '2027-04-11', 27)).toBe(351);
    expect(qqRoomPrice('savoy-standard', '2027-07-04', 41)).toBe(2595);
    expect(qqRoomPrice('savoy-suite', '2027-07-04', 41)).toBe(5670);
    expect(qqRoomPrice('savoy-standard', '2027-04-11', 83)).toBe(4575);
  });

  it('reads the visa table by days in the Philippines', () => {
    expect(qqVisaFee('tourist30', 28)).toBe(0);
    expect(qqVisaFee('tourist30', 56)).toBe(7230);
    expect(qqVisaFee('tourist30', 84)).toBe(9210);
    expect(qqVisaFee('tourist59', 56)).toBe(0);
    expect(qqVisaFee('tourist59', 84)).toBe(7230);
  });
});

describe('CampusTop quote', () => {
  it('matches the system for 4 weeks at IT Park in the capsule', () => {
    const quote = student('itp', '2027-04-11', 4, 'one4', 'capsule');
    expect(quote.quoteError).toBe('');
    expect(quote.tuition).toBe(784);
    expect(quote.accommodation).toBe(351);
    expect(quote.mealFee).toBe(260);
    expect(quote.quoteUsd).toBe(1575);
  });

  it('adds the Holiday Fee at Beach Front (Kadaugan sa Mactan, 2027/04/27)', () => {
    expect(student('bfc', '2027-04-11', 4, 'one4', 'capsule').quoteUsd).toBe(1610);
    expect(student('bfc', '2027-04-11', 4, 'one4', 'savoy-standard').quoteUsd).toBe(2744);
  });

  it('matches the system for Treewoods and for a child with a guardian who does not study', () => {
    expect(student('itp', '2027-04-11', 4, 'one4', 'treewood').quoteUsd).toBe(2574);
    const child = student('itp', '2027-04-11', 4, 'one4', 'treewood');
    child.ageBand = 'child';
    child.companions = 1;
    expect(child.quoteError).toBe('');
    expect(child.quoteUsd).toBe(2864);
  });

  it('matches the system for 12 weeks over Holy Week', () => {
    const quote = student('itp', '2027-01-10', 12, 'one4', 'capsule');
    expect(quote.tuition).toBe(2204);
    expect(quote.holidayFee).toBe(35);
  });

  it('applies the school rules for children', () => {
    const child = student('bfc', '2027-04-11', 4, 'one4-group2', 'capsule');
    child.ageBand = 'child';
    expect(child.quoteError).toContain('15岁以上');
    child.quotePlan.courses.forEach(row => row.optionId = 'one4');
    expect(child.quoteError).toContain('太空舱');
  });

  it('keeps the child without meals in the peak when the guardian does not study', () => {
    const child = student('itp', '2027-07-11', 2, 'one4', 'treewood');
    child.ageBand = 'child';
    child.companions = 1;
    expect(child.mealFee).toBe(0);
    expect(child.companionMealFee).toBe(0);
    child.companions = 0;
    expect(child.mealFee).toBe(120);
  });

  it('charges registration once for new students only', () => {
    const quote = student('itp', '2027-04-11', 4, 'one4', 'capsule');
    quote.returningStudent = true;
    expect(quote.registration).toBe(0);
  });
});

describe('CampusTop day students', () => {
  it('charges no room and no dormitory electricity when the student commutes', () => {
    const quote = student('itp', '2027-04-11', 4, 'one4', 'commute');
    expect(quote.quoteError).toBe('');
    expect(quote.accommodation).toBe(0);
    expect(quote.quoteUsd).toBe(150 + 784 + 260 + 30);
    expect(quote.localFees.find(fee => fee.item === '宿舍电费')?.total ?? 0).toBe(0);
  });
});
