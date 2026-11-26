import { SIDA_CONSULTANT_MEDIA } from '../../../../components/sida-consultants';
import { BabelPlanInput, BabelProgramme, BabelQuoteInput, babelStartOptions, buildBabelSheet, defaultBabelPlan, defaultBabelQuote } from './babel-quote';

const BLACK_FRIDAY = '2026-11-24';
const AFTER = '2026-12-05';
const CONTACT = { name: 'Jenny', title: '英爱留学规划', phone: '132 4982 7686', qrSrc: SIDA_CONSULTANT_MEDIA.Jenny.qrSrc };
const RATE = { eurToCny: 8, date: '2026-11-24' };

function quote(today: string, programme: BabelProgramme, changes: Partial<BabelQuoteInput> = {},
  plans: Array<Partial<BabelPlanInput>> = [{}]): BabelQuoteInput {
  const base = defaultBabelQuote(today, programme);
  return { ...base, ...changes, plans: plans.map(plan => ({ ...defaultBabelPlan(programme, today), ...plan })) };
}

function row(sheet: ReturnType<typeof buildBabelSheet>, label: string) {
  return sheet.requiredRows.find(item => item.label.startsWith(label));
}

describe('Babel quote engine', () => {
  it('prices a 4-week morning course with a single homestay at Black Friday rates', () => {
    const input = quote(BLACK_FRIDAY, 'short', {}, [{ start: '2027-01-11', weeks: 4, accommodation: 'homestay-single', accommodationWeeks: 4 }]);
    const sheet = buildBabelSheet(input, BLACK_FRIDAY, '2026年11月24日', RATE, CONTACT);
    expect(sheet.issues).toEqual([]);
    expect(row(sheet, '学费')?.amounts).toEqual([720]);
    expect(row(sheet, '住宿')?.amounts).toEqual([1160]);
    // 720 tuition + 50 registration + 50 materials + 1,160 homestay + 75 booking fee
    expect(sheet.requiredTotals).toEqual([2055]);
    expect(sheet.requiredTotalsCny).toEqual([16440]);
    expect(sheet.currencyLabel).toBe('欧元');
    expect(sheet.title).toBe('Babel 都柏林成人英语4周报价');
    expect(sheet.info.find(item => item.label.startsWith('日期'))?.value).toBe('2027年1月11日（周一）–2027年2月5日（周五）');
  });

  it('applies the 15% long-stay discount and 85-euro materials from 12 weeks at regular prices', () => {
    const input = quote(AFTER, 'short', {}, [{ shortCourse: 'efl-pm', start: '2027-01-11', weeks: 12, accommodation: 'none' }]);
    const sheet = buildBabelSheet(input, AFTER, '2026年12月5日', RATE, CONTACT);
    expect(sheet.issues).toEqual([]);
    expect(row(sheet, '学费')?.amounts).toEqual([2520]);
    expect(row(sheet, '12周以上学费85折')?.amounts).toEqual([-378]);
    expect(row(sheet, '教材费')?.amounts).toEqual([85]);
    expect(sheet.requiredTotals).toEqual([2520 - 378 + 50 + 85]);
  });

  it('does not stack the long-stay discount on Black Friday prices and warns instead', () => {
    const input = quote(BLACK_FRIDAY, 'short', {}, [{ start: '2027-01-11', weeks: 12, accommodation: 'none' }]);
    const sheet = buildBabelSheet(input, BLACK_FRIDAY, '2026年11月24日', RATE, CONTACT);
    expect(row(sheet, '12周以上学费85折')).toBeUndefined();
    expect(sheet.warnings.some(text => text.includes('85折'))).toBeTrue();
  });

  it('prices the 25-week Work & Study course with its fixed fees', () => {
    const input = quote(BLACK_FRIDAY, 'work-study', { insurance: true, ieltsExam: false }, [{ workStudyCourse: 'efl-pm', start: '2027-01-11', accommodation: 'none' }]);
    const sheet = buildBabelSheet(input, BLACK_FRIDAY, '2026年11月24日', RATE, CONTACT);
    expect(sheet.issues).toEqual([]);
    // 2,300 tuition + 80 registration + 85 materials + 140 TIE + 30 learner protection + 70 insurance
    expect(sheet.requiredTotals).toEqual([2705]);
    expect(sheet.optionalRows.some(item => item.label === '雅思考试费')).toBeTrue();
  });

  it('blocks Work & Study for a 17-year-old and a start inside the 2027 Christmas break', () => {
    const young = quote(BLACK_FRIDAY, 'work-study', { age: 'seventeen' }, [{ start: '2027-01-11' }]);
    expect(buildBabelSheet(young, BLACK_FRIDAY, '', RATE, CONTACT).issues.length).toBe(1);
    const christmas = quote(BLACK_FRIDAY, 'short', {}, [{ start: '2027-12-20' }]);
    expect(buildBabelSheet(christmas, BLACK_FRIDAY, '', RATE, CONTACT).issues.some(text => text.includes('圣诞'))).toBeTrue();
  });

  it('offers Mondays only, skipping the Christmas break, up to each price list deadline', () => {
    const options = babelStartOptions('work-study', BLACK_FRIDAY);
    expect(options[0]).toBe('2026-11-30');
    expect(options[options.length - 1]).toBe('2028-02-28');
    expect(options).not.toContain('2027-12-20');
    expect(options).not.toContain('2027-12-27');
    const regular = babelStartOptions('work-study', AFTER);
    expect(regular[regular.length - 1]).toBe('2027-09-27');
  });

  it('adds chosen extras to both compared plans and blocks export without a rate', () => {
    const input = quote(BLACK_FRIDAY, 'short', { transfer: 'return', transportWeeks: 2, socialWeeks: 2 }, [
      { start: '2027-01-11', weeks: 2, accommodation: 'homestay-shared', accommodationWeeks: 2, diet: 'vegan' },
      { start: '2027-01-11', weeks: 2, accommodation: 'residence', accommodationWeeks: 2 },
    ]);
    const sheet = buildBabelSheet(input, BLACK_FRIDAY, '', { eurToCny: null, date: '' }, CONTACT);
    expect(sheet.plans.map(plan => plan.tag)).toEqual(['方案一', '方案二']);
    expect(row(sheet, '机场接送')?.amounts).toEqual([160, 160]);
    expect(row(sheet, '特殊饮食附加费')?.amounts).toEqual([60, null]);
    // shared: 360 + 50 + 50 + 520 + 60 + 75 + 160 + 80 + 180; residence: 360 + 50 + 50 + 840 + 75 + 160 + 80 + 180
    expect(sheet.requiredTotals).toEqual([1535, 1795]);
    expect(sheet.requiredTotalsCny).toEqual([null, null]);
  });
});
