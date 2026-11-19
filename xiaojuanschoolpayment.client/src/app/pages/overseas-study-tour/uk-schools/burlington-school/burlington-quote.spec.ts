import { ukEmphasisRuns, ukOverlapWeeks, ukPlainText } from '../../../../components/uk-quote/uk-quote-sheet';
import {
  BurlingtonPlanInput,
  BurlingtonProgramme,
  BurlingtonQuoteInput,
  buildBurlingtonSheet,
  computeBurlingtonPlan,
  defaultBurlingtonExtras,
  defaultBurlingtonPlan,
  defaultBurlingtonQuote,
  nextBurlingtonPlan,
} from './burlington-quote';

const TODAY = '2026-11-19';
const CONTACTS = [
  { name: 'Lemon', title: '多国家方案规划', phone: '132 9852 9856', qrSrc: '/assets/contact/lemon-wechat-qr.png' },
  { name: 'Perrin', title: '菲律宾与东南亚游学', phone: '153 6765 9331', qrSrc: '/assets/contact/penin-wechat-qr.png' },
  { name: 'Jenny', title: '英爱留学规划', phone: '132 4982 7686', qrSrc: '/assets/contact/jenny-wechat-qr.png' },
];

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
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
    expect(sheet.title).toBe('Burlington School 伦敦暑期4周报价');
    expect(sheet.plans.map(plan => plan.title)).toEqual(['学校宿舍 3–6人间', '寄宿家庭 单人间']);
    expect(sheet.requiredTotals).toEqual([4835, 4835]);
    expect(sheet.requiredTotalsCny).toEqual([45933, 45933]);
    // Everything the package covers sits right under the package fee, with what it includes.
    expect(sheet.requiredRows.map(row => row.label)).toEqual(
      ['暑期套餐费', '英语课程', '住宿', '餐食', '半日游', '全天出游', '晚间活动', '注册费']);
    const evening = sheet.requiredRows.find(row => row.label === '晚间活动');
    expect(evening?.amounts).toEqual(['included', 'excluded']);
    expect(evening?.note).toBe('方案一：多数晚上安排');
    const room = sheet.requiredRows.find(row => row.label === '住宿');
    expect(room?.note).toBe('方案一：学校宿舍3–6人间，上下铺，共用卫生间\n方案二：寄宿家庭单人间，共用卫生间');
    expect(sheet.requiredRows.find(row => row.label === '英语课程')?.note).toContain('{{4周共60节}}');
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
    const castle = result.required.find(row => row.key === 'castle');
    expect(castle?.amount).toBe('included');
    expect(castle?.note).toContain('{{赠送2晚标准版}}');
    // The room line explains what the room includes and the meals.
    const room = result.required.find(row => row.key === 'accommodation');
    expect(room?.note).toContain('提供床单');
    expect(room?.note).toContain('餐食：校内食堂');
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
    expect(amount(shortResult, 'castle')).toBe('excluded');
    const tooLate = quote('summer-residence', {}, [{ arrival: '2027-08-08', weeks: 4 }]);
    expect(computeBurlingtonPlan(tooLate, tooLate.plans[0]).total).toBeNull();
  });

  it('compares school residence, homestay and apartment as three plans', () => {
    let input = quote('adult-course', {}, [{ arrival: '2027-01-03', weeks: 4, accommodationWeeks: 4 }]);
    input = { ...input, plans: [...input.plans, nextBurlingtonPlan(input)] };
    input = { ...input, plans: [...input.plans, nextBurlingtonPlan(input)] };
    expect(input.plans.map(plan => plan.accommodation)).toEqual(['onsite', 'homestay', 'apartment']);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
    expect(sheet.plans.map(plan => plan.tag)).toEqual(['方案一', '方案二', '方案三']);
    expect(sheet.subtitle).toContain('三种方案');
    // Tuition 1,260 + registration 55 + booking 55 + coursebook 45, plus four weeks of each room.
    expect(sheet.requiredTotals).toEqual([1415 + 370 * 4, 1415 + 280 * 4, 1415 + 350 * 4]);
    expect(sheet.contacts.map(contact => contact.name)).toEqual(['Lemon', 'Perrin', 'Jenny']);
    expect(sheet.info.some(item => item.label === '学生')).toBeFalse();
    // Each plan's room details sit on their own line under the accommodation fee.
    const room = sheet.requiredRows.find(row => row.label === '住宿费')!;
    expect(room.note!.split('\n').map(line => line.slice(0, 4))).toEqual(['方案一：', '方案二：', '方案三：']);
  });

  it('keeps a surcharge only one plan has beside the accommodation fee', () => {
    const input = quote('adult-course', {}, [
      { arrival: '2027-01-03', weeks: 4, accommodation: 'onsite', accommodationWeeks: 4 },
      { arrival: '2027-01-03', weeks: 4, accommodation: 'homestay', accommodationWeeks: 4, homestayPrivateBathroom: true },
    ]);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
    expect(sheet.requiredRows.map(row => row.label)).toEqual(
      ['学费', '住宿费', '独立卫生间附加费', '注册费', '住宿预订费', '教材费', '社交活动', '巴斯城堡']);
    expect(sheet.requiredRows.find(row => row.label === '独立卫生间附加费')?.amounts[0]).toBeNull();
  });

  it('adds ticked optional services to the total and leaves the rest as reference prices', () => {
    const input = quote('junior', { juniorAge: 13 }, [{ arrival: '2027-08-01', weeks: 4, juniorPackage: 'residence' }]);
    input.extras = { ...defaultBurlingtonExtras(), arrivalTransfer: true, departureTransfer: true, airport: 'gatwick', castle: true };
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
    expect(sheet.feesTitle).toBe('费用明细');
    expect(sheet.totalLabel).toBe('合计');
    const optional = sheet.requiredRows.filter(row => row.optional);
    expect(optional.map(row => row.label)).toEqual(['接机（盖特威克机场）', '送机（盖特威克机场）', '无人陪伴费', '巴斯城堡体验']);
    expect(optional.map(row => row.amounts[0])).toEqual([160, 160, 100, 445]);
    expect(sheet.requiredTotals).toEqual([4835 + 160 + 160 + 100 + 445]);
    expect(sheet.optionalRows.map(row => row.label)).toEqual(['伦敦交通卡（1–3区）', '国际汇款手续费']);
  });

  it('keeps the required-fee wording while nothing optional is ticked', () => {
    const input = quote('summer-residence', {}, [{ arrival: '2027-06-27', weeks: 4 }]);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: 9.5, date: '2026-11-18' }, CONTACTS);
    expect(sheet.feesTitle).toBe('必付费用');
    expect(sheet.totalLabel).toBe('必付合计');
    expect(sheet.optionalRows.find(row => row.label === '机场接送机')?.price).toBe('单程140英镑起');
  });

  it('describes course-only plans by their Monday start instead of an arrival day', () => {
    const adult = quote('adult-course', {}, [{ arrival: '2027-01-03', weeks: 4, accommodation: 'none' }]);
    const adultDates = computeBurlingtonPlan(adult, adult.plans[0]).dateText;
    expect(adultDates).toContain('2027年1月4日（周一）开课');
    expect(adultDates).toContain('1月29日（周五）结课');
    expect(adultDates).not.toContain('入住');
    const boarding = quote('adult-course', {}, [{ arrival: '2027-01-03', weeks: 4, accommodation: 'onsite' }]);
    expect(computeBurlingtonPlan(boarding, boarding.plans[0]).dateText).toContain('2027年1月3日（周日）入住');
    const day = quote('junior', {}, [{ arrival: '2027-07-04', weeks: 2, juniorPackage: 'day' }]);
    expect(computeBurlingtonPlan(day, day.plans[0]).dateText).toContain('2027年7月5日（周一）开课');
    const late = quote('junior', {}, [{ arrival: '2027-08-15', weeks: 4, juniorPackage: 'day' }]);
    expect(computeBurlingtonPlan(late, late.plans[0]).issues.join('')).toContain('开课');
  });

  it('marks totals pending when no exchange rate is available', () => {
    const input = quote('junior', {}, [{ arrival: '2027-08-01' }]);
    const sheet = buildBurlingtonSheet(input, '2026年11月19日', { gbpToCny: null, date: '' }, CONTACTS);
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
