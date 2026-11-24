import { SIDA_CONSULTANT_MEDIA } from '../../../../components/sida-consultants';
import { ukPlainText } from '../../../../components/uk-quote/uk-quote-sheet';
import {
  AtcPlanInput,
  AtcProgramme,
  AtcQuoteInput,
  atcCourseSpanWeeks,
  atcCourseStarts,
  buildAtcSheet,
  computeAtcPlan,
  defaultAtcPlan,
  defaultAtcQuote,
} from './atc-quote';

const AFTER_OFFERS = '2026-12-05';
const BLACK_NOVEMBER = '2026-11-24';
const CONTACT = { name: 'Jenny', title: '英爱留学规划', phone: '132 4982 7686', qrSrc: SIDA_CONSULTANT_MEDIA.Jenny.qrSrc };

function quote(today: string, changes: Partial<AtcQuoteInput> = {}, plans: Array<Partial<AtcPlanInput>> = [{}],
  programme: AtcProgramme = 'course'): AtcQuoteInput {
  const base = defaultAtcQuote(today, programme);
  return { ...base, ...changes, plans: plans.map(plan => ({ ...defaultAtcPlan(programme, today), ...plan })) };
}

function amount(result: ReturnType<typeof computeAtcPlan>, key: string) {
  return result.required.find(line => line.key === key)?.amount;
}

describe('ATC quote engine', () => {
  it('prices Dublin General English 20 for 12 weeks with a single host family room and arrival transfer', () => {
    const input = quote(AFTER_OFFERS, {}, [{ campus: 'dublin', course: 'ge20', start: '2027-03-01', weeks: 12, stayType: 'homestay', room: 'single', stayWeeks: 12, transfer: 'arrival' }]);
    const result = computeAtcPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(amount(result, 'tuition')).toBe(325 * 12);
    expect(amount(result, 'black-november')).toBeUndefined();
    expect(amount(result, 'stay')).toBe(300 * 12);
    expect(amount(result, 'stay-fee')).toBe(65);
    expect(amount(result, 'transfer')).toBe(130);
    expect(result.total).toBe(3900 + 70 + 85 + 3600 + 65 + 130);
  });

  it('takes 10% off the tuition only while Black November runs', () => {
    const input = quote(BLACK_NOVEMBER, {}, [{ campus: 'dublin', course: 'ge20', start: '2027-03-01', weeks: 12, stayType: 'none', transfer: 'none' }]);
    const result = computeAtcPlan(input, input.plans[0]);
    expect(amount(result, 'black-november')).toBe(-390);
    expect(result.total).toBe(3900 - 390 + 70 + 85);
  });

  it('charges the 25-week tier, MediPel and includes TIE for a 25-week Bray 16-hour course', () => {
    const input = quote(AFTER_OFFERS, {}, [{ campus: 'bray', course: 'ge16', start: '2027-02-08', weeks: 25, stayType: 'none', transfer: 'none' }]);
    const result = computeAtcPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(amount(result, 'tuition')).toBe(190 * 25);
    expect(amount(result, 'medipel')).toBe(140);
    expect(result.includes.some(item => item.key === 'tie')).toBeTrue();
    expect(result.total).toBe(4750 + 70 + 85 + 140);
  });

  it('warns that 8 to 11 weeks of the 16-hour course need school confirmation', () => {
    const input = quote(AFTER_OFFERS, {}, [{ campus: 'bray', course: 'ge16', start: '2027-02-08', weeks: 8, stayType: 'none', transfer: 'none' }]);
    const result = computeAtcPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.warnings.join()).toContain('8–11周');
  });

  it('prices a Cambridge course at its fixed session price', () => {
    const input = quote(AFTER_OFFERS, {}, [{ campus: 'bray', course: 'cambridge', start: '2027-03-15', weeks: 12, stayType: 'none', transfer: 'none' }]);
    const result = computeAtcPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(amount(result, 'tuition')).toBe(3540);
    expect(result.weeks).toBe(12);
  });

  it('applies the 16 and 17-year-old rules', () => {
    const dublin16 = quote(AFTER_OFFERS, { age: '16' }, [{ campus: 'dublin', room: 'twin' }]);
    expect(computeAtcPlan(dublin16, dublin16.plans[0]).issues.join()).toContain('最低入学年龄17岁');

    const october = quote(AFTER_OFFERS, { age: '17' }, [{ campus: 'bray', start: '2027-10-04', weeks: 6, room: 'twin', stayWeeks: 6 }]);
    expect(computeAtcPlan(october, october.plans[0]).issues.join()).toContain('最多学习4周');

    const july = quote(AFTER_OFFERS, { age: '17' }, [{ campus: 'bray', start: '2027-07-05', weeks: 6, room: 'twin', stayWeeks: 6 }]);
    expect(computeAtcPlan(july, july.plans[0]).issues).toEqual([]);

    const single = quote(AFTER_OFFERS, { age: '17' }, [{ campus: 'bray', start: '2027-07-05', room: 'single' }]);
    expect(computeAtcPlan(single, single.plans[0]).issues.join()).toContain('单人间只接受18岁以上');

    const noTransfer = quote(AFTER_OFFERS, { age: '17' }, [{ campus: 'bray', start: '2027-07-05', room: 'twin', transfer: 'none' }]);
    expect(computeAtcPlan(noTransfer, noTransfer.plans[0]).issues.join()).toContain('必须预订接机');
  });

  it('never starts a course on a public holiday or in the Christmas closure', () => {
    const starts = atcCourseStarts();
    expect(starts[0]).toBe('2027-01-04');
    expect(starts).not.toContain('2027-02-01');
    expect(starts).not.toContain('2027-03-29');
    expect(starts).toContain('2027-02-08');
    expect(starts[starts.length - 1]).toBe('2027-12-13');
    const holiday = quote(AFTER_OFFERS, {}, [{ start: '2027-03-29' }]);
    expect(computeAtcPlan(holiday, holiday.plans[0]).issues.join()).toContain('公共假日和圣诞假期不开课');
  });

  it('lengthens the stay across the Christmas closure', () => {
    expect(atcCourseSpanWeeks({ start: '2027-12-06', weeks: 4 })).toBe(6);
    expect(atcCourseSpanWeeks({ start: '2027-11-01', weeks: 4 })).toBe(4);
  });

  it('prices the renewal package with the returning-student discount', () => {
    const input = quote(BLACK_NOVEMBER, { returningStudent: true }, [{ renewalCourse: 'ge16' }], 'renewal');
    const result = computeAtcPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(amount(result, 'renewal')).toBe(2250);
    expect(amount(result, 'returning')).toBe(-50);
    expect(amount(result, 'registration')).toBe('included');
    expect(result.total).toBe(2200);

    const late = quote(AFTER_OFFERS, {}, [{}], 'renewal');
    expect(computeAtcPlan(late, late.plans[0]).issues.join()).toContain('已于2026年11月30日截止');
  });

  it('builds a euro sheet for two campuses side by side', () => {
    const input = quote(AFTER_OFFERS, {}, [
      { campus: 'dublin', start: '2027-03-01', weeks: 12, stayWeeks: 12 },
      { campus: 'bray', start: '2027-03-01', weeks: 12, stayWeeks: 12 },
    ]);
    const sheet = buildAtcSheet(input, '2026年12月5日', { eurToCny: 8, date: '2026-12-04' }, CONTACT);
    expect(sheet.issues).toEqual([]);
    expect(sheet.currencyLabel).toBe('欧元');
    expect(sheet.title).toBe('ATC 爱尔兰 12周报价');
    expect(sheet.plans.length).toBe(2);
    expect(sheet.requiredTotals).toEqual([7850, 3300 + 70 + 85 + 3600 + 65 + 130]);
    expect(sheet.requiredTotalsCny.every(value => value !== null)).toBeTrue();
    const text = JSON.stringify(sheet);
    expect(text).not.toContain('€');
    expect(text).not.toContain('atcireland');
    expect(text).not.toContain('2845512');
    expect(ukPlainText(sheet.rateNote)).toContain('1欧元≈8.0000元');
  });

  it('blocks the image while the euro rate is missing', () => {
    const input = quote(AFTER_OFFERS);
    const sheet = buildAtcSheet(input, '2026年12月5日', { eurToCny: null, date: '' }, CONTACT);
    expect(sheet.requiredTotalsCny.every(value => value === null)).toBeTrue();
  });
});
