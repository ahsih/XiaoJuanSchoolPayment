import { CiaQuote, createCiaQuotePricing } from './cia-quote-engine';
import { CiaPlanComparison } from './cia-plan-compare';
import { cloneCiaContentConfig, createDefaultCiaContentConfig } from './cia-content-config';
import { nextQuoteSunday } from '../../../components/school-quote-plan';
import { planCompareReady } from '../../../components/plan-compare/plan-compare-sheet';
import { ciaShows2026Prices, currentCiaFaqs } from './cia-page-content';

describe('CIA plan comparison and quote defaults', () => {
  const setup = () => {
    const pricing = createCiaQuotePricing(cloneCiaContentConfig(createDefaultCiaContentConfig()));
    Object.assign(pricing, { usdToCny: 6.667111, phpPerCny: 9.5495, exchangeRateDate: '2026-11-18', usingLiveExchangeRates: true });
    const quote = new CiaQuote(pricing);
    const student = quote.students[0];
    student.selectedRegistrationDate = '2026-11-19';
    student.quotePlan.courses = [{ id: 1, optionId: 'regular-esl', weeks: 4, startDate: '2027-03-07' }];
    student.quotePlan.rooms = [{ id: 2, optionId: 'd4', weeks: 4, startDate: '2027-03-07' }];
    return { pricing, quote, student, comparison: new CiaPlanComparison(pricing, () => student) };
  };

  it('starts a new quote on the next Sunday instead of a fixed past date', () => {
    expect(nextQuoteSunday(new Date(2026, 10, 19))).toBe('2026-11-22');
    expect(nextQuoteSunday(new Date(2026, 10, 22))).toBe('2026-11-29');
    const { pricing } = setup();
    const fresh = new CiaQuote(pricing).students[0];
    expect(fresh.quotePlan.startDate).toBe(nextQuoteSunday());
  });

  it('requires 12 consecutive weeks for the guarantee courses', () => {
    const { quote, student } = setup();
    student.quotePlan.courses[0].optionId = 'ielts-guarantee';
    expect(quote.quoteError).toContain('IELTS Guarantee须连续就读至少12周');
    student.quotePlan.updateWeeks('course', 1, 12);
    expect(quote.quoteError).toBe('');
    student.quotePlan.courses[0].optionId = 'toeic-guarantee';
    expect(quote.quoteError).toBe('');
  });

  it('prices every compared room exactly like the normal quote', () => {
    const { pricing, comparison } = setup();
    comparison.start('room');
    const sheet = comparison.sheet;
    expect(sheet.plans.map(plan => plan.title)).toEqual(['四人间 D-4', '三人间 D-3', '双人间 D-2']);
    expect(sheet.conditions).toBe('相同条件：Regular ESL · 4周 · 2027/03/07入学');
    expect(planCompareReady(sheet)).toBeTrue();
    comparison.results.forEach((result, index) => {
      const single = new CiaQuote(pricing);
      const student = single.students[0];
      student.selectedRegistrationDate = '2026-11-19';
      student.quotePlan.courses = [{ id: 1, optionId: 'regular-esl', weeks: 4, startDate: '2027-03-07' }];
      student.quotePlan.rooms = [{ id: 2, optionId: comparison.roomId(comparison.plans[index]), weeks: 4, startDate: '2027-03-07' }];
      expect(result.schoolUsd).toBe(single.quoteUsd);
      expect(result.localPhp).toBe(single.estimatedLocalFeeTotal);
      expect(result.localCny).toBe(single.estimatedLocalFeeCny);
    });
    expect(comparison.results.map(result => result.schoolUsd)).toEqual([1762.5, 1857.5, 2095]);
    expect(sheet.rows.find(row => row.label === '比方案A')?.values).toEqual(['基准', '多 95 美元', '多 332.5 美元']);
    expect(sheet.rows.find(row => row.style === 'total')?.label).toBe('学校费用合计');
    expect(sheet.rows.some(row => row.label.includes('总花费'))).toBeFalse();
  });

  it('compares a course group and lengthens guarantee courses to 12 weeks', () => {
    const { comparison } = setup();
    comparison.start('room');
    comparison.setCourse(comparison.plans[0], 'pre-ielts');
    comparison.applyFocus('course');
    expect(comparison.plans.map(plan => comparison.courseId(plan))).toEqual(['pre-ielts', 'ielts-regular', 'ielts-guarantee']);
    expect(comparison.plans.map(plan => comparison.weeks(plan))).toEqual([4, 4, 12]);
    expect(comparison.ready).toBeTrue();
    expect(comparison.sheet.rows.some(row => row.label === '每日课程')).toBeTrue();
  });

  it('follows the normal quote conditions such as returning students', () => {
    const { comparison, student } = setup();
    comparison.start('weeks');
    expect(comparison.plans.map(plan => comparison.weeks(plan))).toEqual([4, 8, 12]);
    student.returningStudent = true;
    expect(comparison.results.every(result => result.registration === 0)).toBeTrue();
  });

  it('applies the 2026 CIA notices: free ARP and 3,000-peso electricity for 2027 arrivals', () => {
    const { quote, student } = setup();
    const fee = (name: string) => student.localFees.find(item => item.item === name);
    student.quotePlan.updateWeeks('course', 1, 12);
    expect(fee('ARP外国人登记')?.total).toBe(0);
    expect(fee('电费')?.total).toBe(9000);
    student.quotePlan.updateStartDate('course', 1, '2026-12-06');
    expect(fee('电费')?.total).toBe(6000);
    expect(quote.quoteError).toBe('');

    const legacy = createDefaultCiaContentConfig();
    delete legacy.quoteSettings.localFeePolicyVersion;
    const legacyArp = legacy.localFees.find(item => item.id === 'arp')!;
    Object.assign(legacyArp, { amount: 300, note: '首次续签或长期签证计入一次；实际政策及收费须向学校确认。' });
    legacy.quoteImageSettings.localFeeNotes['arp'] = legacyArp.note;
    const legacyElectricity = legacy.localFees.find(item => item.id === 'electricity')!;
    delete legacyElectricity.futureEffectiveStart;
    delete legacyElectricity.futureAmount;
    legacy.localFees.find(item => item.id === 'water')!.amount = 1200;
    const upgraded = cloneCiaContentConfig(legacy);
    expect(upgraded.localFees.find(item => item.id === 'arp')?.amount).toBe(0);
    expect(upgraded.quoteImageSettings.localFeeNotes['arp']).toContain('免费');
    expect(upgraded.localFees.find(item => item.id === 'electricity')?.futureAmount).toBe(3000);
    expect(upgraded.localFees.find(item => item.id === 'water')?.amount).toBe(1200);
  });

  it('blocks the comparison image while a plan cannot be quoted', () => {
    const { comparison } = setup();
    comparison.start('room');
    expect(comparison.setStartDate(comparison.plans[1], '2027-03-08')).toBeFalse();
    comparison.plans[1].quotePlan.courses[0].optionId = 'unknown-course';
    expect(comparison.ready).toBeFalse();
    expect(planCompareReady(comparison.sheet)).toBeFalse();
  });

  it('hides the 2026 price notes from 2027-01-01', () => {
    const lastDay = new Date(2026, 11, 31, 23, 59);
    const firstDay = new Date(2027, 0, 1, 0, 0);
    const hasPriceFaq = (date: Date) => currentCiaFaqs(date).some(faq => faq.question.includes('2027年课程费'));
    expect(ciaShows2026Prices(lastDay)).toBeTrue();
    expect(hasPriceFaq(lastDay)).toBeTrue();
    expect(ciaShows2026Prices(firstDay)).toBeFalse();
    expect(hasPriceFaq(firstDay)).toBeFalse();
    expect(currentCiaFaqs(firstDay).length).toBe(currentCiaFaqs(lastDay).length - 1);
  });
});
