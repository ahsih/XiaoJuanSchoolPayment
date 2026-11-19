import { ukEmphasisRuns, ukOverlapWeeks, ukPlainText } from '../../../../components/uk-quote/uk-quote-sheet';
import {
  BurlingtonPlanInput,
  BurlingtonProgramme,
  BurlingtonQuoteInput,
  buildBurlingtonSheet,
  computeBurlingtonPlan,
  defaultBurlingtonPlan,
  defaultBurlingtonQuote,
} from './burlington-quote';

const TODAY = '2026-11-19';
const CONTACT = { name: 'Jenny', title: '英爱留学规划', phone: '132 4982 7686', qrSrc: '/assets/contact/jenny-wechat-qr.png' };

function quote(programme: BurlingtonProgramme, changes: Partial<BurlingtonQuoteInput> = {},
  plans: Array<Partial<BurlingtonPlanInput>> = [{}]): BurlingtonQuoteInput {
  const base = defaultBurlingtonQuote(TODAY, programme);
  return { ...base, ...changes, plans: plans.map(plan => ({ ...defaultBurlingtonPlan(programme, TODAY), ...plan })) };
}

function amount(result: ReturnType<typeof computeBurlingtonPlan>, key: string) {
  return result.required.find(line => line.key === key)?.amount;
}

describe('Burlington quote engine', () => {
  it('prices the confirmed 15-year-old summer residence quote at 4,835 pounds', () => {
    const input = quote('junior', { juniorAge: 15 }, [{ arrival: '2027-08-01', weeks: 4, juniorPackage: 'residence' }]);
    const result = computeBurlingtonPlan(input, input.plans[0]);
    expect(result.issues).toEqual([]);
    expect(amount(result, 'package')).toBe(4780);
    expect(amount(result, 'registration')).toBe(55);
    expect(result.total).toBe(4835);
    expect(result.dateText).toContain('8月28日（周六）或8月29日（周日）离开');
  });

  it('compares residence and single homestay side by side with the same total', () => {
    const input = quote('junior', { juniorAge: 15 }, [
      { arrival: '2027-08-01', juniorPackage: 'residence' },
      { arrival: '2027-08-01', juniorPackage: 'homestay', juniorHomestayRoom: 'single' },
    ]);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACT);
    expect(sheet.title).toBe('Burlington School 伦敦暑期4周报价');
    expect(sheet.plans.map(plan => plan.title)).toEqual(['学校宿舍 3–6人间', '寄宿家庭 单人间']);
    expect(sheet.requiredTotals).toEqual([4835, 4835]);
    expect(sheet.requiredTotalsCny).toEqual([45933, 45933]);
    const evening = sheet.includeRows.find(row => row.label === '晚间活动');
    expect(evening?.values).toEqual(['多数晚上安排', '不含']);
    const chaperone = sheet.optionalRows.find(row => row.label === '寄宿家庭往返学校陪同');
    expect(chaperone?.note).toContain('仅方案二');
    expect(sheet.issues).toEqual([]);
  });

  it('blocks homestay under 14 and adds the compulsory unaccompanied-minor note', () => {
    const input = quote('junior', { juniorAge: 13 }, [{ juniorPackage: 'homestay' }]);
    const result = computeBurlingtonPlan(input, input.plans[0]);
    expect(result.total).toBeNull();
    expect(result.issues.join('')).toContain('寄宿家庭需年满14岁');
    expect(result.optional.find(row => row.key === 'transfer')?.note).toContain('无人陪伴费50英镑');
  });

  it('keeps junior stays inside the season and on Sundays', () => {
    const late = quote('junior', {}, [{ arrival: '2027-08-15', weeks: 4 }]);
    expect(computeBurlingtonPlan(late, late.plans[0]).issues.join('')).toContain('最晚');
    const monday = quote('junior', {}, [{ arrival: '2027-08-02' }]);
    expect(computeBurlingtonPlan(monday, monday.plans[0]).issues).toContain('入住日期需为周日（课程周一开始）。');
    const winter = quote('junior', {}, [{ juniorSeason: 'winter', arrival: '2028-01-02', weeks: 4, juniorPackage: 'day' }]);
    const result = computeBurlingtonPlan(winter, winter.plans[0]);
    expect(result.issues).toEqual([]);
    expect(result.total).toBe(625 * 4 + 55);
  });

  it('uses the total-week tier for adult tuition', () => {
    const five = quote('adult-course', {}, [{ arrival: '2027-01-03', weeks: 5, accommodation: 'none' }]);
    expect(amount(computeBurlingtonPlan(five, five.plans[0]), 'course')).toBe(1475);
    const twelve = quote('adult-course', {}, [{ arrival: '2027-01-03', weeks: 12, accommodation: 'none', course: 'intensive' }]);
    const result = computeBurlingtonPlan(twelve, twelve.plans[0]);
    expect(amount(result, 'course')).toBe(4260);
    expect(amount(result, 'coursebook')).toBe(45);
    expect(result.total).toBe(4260 + 55 + 45);
  });

  it('adds the 16/17 surcharge and booking fee to onsite accommodation', () => {
    const input = quote('adult-course', { adultAge: 'minor' }, [{
      arrival: '2027-01-03', weeks: 4, accommodation: 'onsite', accommodationWeeks: 4, onsiteRoom: 'single-shared',
    }]);
    const result = computeBurlingtonPlan(input, input.plans[0]);
    expect(amount(result, 'accommodation')).toBe(370 * 4);
    expect(amount(result, 'minor')).toBe(120);
    expect(amount(result, 'booking')).toBe(55);
    expect(result.total).toBe(1260 + 1480 + 120 + 55 + 55 + 45);
    expect(result.includes.find(row => row.key === 'castle')?.value).toContain('赠送巴斯城堡2晚标准版');
  });

  it('charges the homestay summer supplement only for overlapping weeks', () => {
    expect(ukOverlapWeeks('2027-06-06', 4, '2027-06-13', '2027-08-29')).toBe(3);
    const input = quote('adult-course', {}, [{
      arrival: '2027-06-06', weeks: 4, accommodation: 'homestay', accommodationWeeks: 4,
      homestayTier: 'standard', homestayRoom: 'single', homestayBoard: 'bb',
    }]);
    const result = computeBurlingtonPlan(input, input.plans[0]);
    expect(amount(result, 'accommodation')).toBe(1000);
    expect(amount(result, 'summer')).toBe(75);
  });

  it('blocks apartments and non-half-board homestays for 16/17-year-olds', () => {
    const apartment = quote('adult-course', { adultAge: 'minor' }, [{ arrival: '2027-01-03', accommodation: 'apartment' }]);
    expect(computeBurlingtonPlan(apartment, apartment.plans[0]).issues.join('')).toContain('18岁以上');
    const homestay = quote('adult-course', { adultAge: 'minor' }, [{ arrival: '2027-01-03', accommodation: 'homestay', homestayBoard: 'self' }]);
    expect(computeBurlingtonPlan(homestay, homestay.plans[0]).issues.join('')).toContain('Half Board');
  });

  it('prices the adult summer residence tiers and intensive upgrade', () => {
    const four = quote('summer-residence', {}, [{ arrival: '2027-06-27', weeks: 4 }]);
    expect(computeBurlingtonPlan(four, four.plans[0]).total).toBe(3180);
    const upgraded = quote('summer-residence', {}, [{ arrival: '2027-06-27', weeks: 4, intensiveUpgrade: true }]);
    expect(computeBurlingtonPlan(upgraded, upgraded.plans[0]).total).toBe(3500);
    const seven = quote('summer-residence', {}, [{ arrival: '2027-06-27', weeks: 7 }]);
    expect(computeBurlingtonPlan(seven, seven.plans[0]).total).toBe(5215);
    const short = quote('summer-residence', {}, [{ arrival: '2027-06-27', weeks: 3 }]);
    const shortResult = computeBurlingtonPlan(short, short.plans[0]);
    expect(shortResult.total).toBe(2535);
    expect(shortResult.includes.find(row => row.key === 'castle')?.value).toContain('不含');
    const tooLate = quote('summer-residence', {}, [{ arrival: '2027-08-08', weeks: 4 }]);
    expect(computeBurlingtonPlan(tooLate, tooLate.plans[0]).total).toBeNull();
  });

  it('marks totals pending when no exchange rate is available', () => {
    const input = quote('junior', {}, [{ arrival: '2027-08-01' }]);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: null, date: '' }, CONTACT);
    expect(sheet.requiredTotals).toEqual([4835]);
    expect(sheet.requiredTotalsCny).toEqual([null]);
    expect(sheet.rateNote).toContain('待更新');
  });

  it('parses emphasis markup', () => {
    expect(ukEmphasisRuns('每周5次，{{4周共20次}}')).toEqual([
      { text: '每周5次，', emphasis: false },
      { text: '4周共20次', emphasis: true },
    ]);
    expect(ukPlainText('A{{B}}C')).toBe('ABC');
  });
});
