import {
  BTES_COURSES,
  BTES_REGISTRATION_FEE,
  BTES_ROOMS,
  BTES_SIDA_DISCOUNT_RATE,
} from './btes-pricing';
import { BtesQuotePrices, BtesStudentQuote } from './btes-student-quote';

describe('BtesStudentQuote', () => {
  const prices: BtesQuotePrices = {
    courses: BTES_COURSES,
    rooms: BTES_ROOMS,
    registrationFee: BTES_REGISTRATION_FEE,
    sidaDiscountRate: BTES_SIDA_DISCOUNT_RATE,
  };

  const quoteAt = (startDate: string, weeks = 4, courseId = 'speak-up', roomId = 'quad', overrides: BtesQuotePrices = {}) => {
    const quote = new BtesStudentQuote({ ...prices, ...overrides });
    quote.selectedRegistrationDate = '2026-09-01';
    quote.quotePlan.courses[0] = { ...quote.quotePlan.courses[0], optionId: courseId, startDate, weeks };
    quote.quotePlan.rooms[0] = { ...quote.quotePlan.rooms[0], optionId: roomId, startDate, weeks };
    return quote;
  };

  it('uses the official 40/65/85 percent ratios for one to three residential weeks', () => {
    const oneWeek = quoteAt('2026-07-05', 1, 'chill', 'single');
    expect(oneWeek.tuition).toBe(296);
    expect(oneWeek.accommodation).toBe(400);
    expect(oneWeek.quoteUsd).toBe(761.2);

    const twoWeeks = quoteAt('2026-07-05', 2, 'chill', 'single');
    expect(twoWeeks.tuition).toBe(481);
    expect(twoWeeks.accommodation).toBe(650);
    expect(twoWeeks.quoteUsd).toBe(1174.45);

    const threeWeeks = quoteAt('2026-07-05', 3, 'chill', 'single');
    expect(threeWeeks.tuition).toBe(629);
    expect(threeWeeks.accommodation).toBe(850);
    expect(threeWeeks.quoteUsd).toBe(1505.05);
  });

  it('treats Walk-in as weekly-priced day study with no accommodation utilities', () => {
    const quote = quoteAt('2026-07-05', 4, 'speak-up', 'walk-in');
    expect(quote.tuition).toBe(1000);
    expect(quote.accommodation).toBe(0);
    expect(quote.quoteUsd).toBe(1050);
    expect(quote.localFees.find((fee) => fee.item === '水费')?.total).toBe(0);
    expect(quote.localFees.find((fee) => fee.item === '宿舍管理费')?.total).toBe(0);
    expect(quote.localFees.find((fee) => fee.item === '宿舍电费')?.total).toBe(0);
  });

  it('applies the 25 percent individual discount to a complete low-season three-week stay', () => {
    const quote = quoteAt('2026-08-23', 3, 'chill', 'single');
    expect(quote.btesDiscount).toBe(369.75);
    expect(quote.sidaDiscount).toBe(55.46);
    expect(quote.quoteUsd).toBe(1153.79);
  });

  it('applies Sida 95% after the 30 percent individual discount', () => {
    const quote = quoteAt('2026-08-23');
    expect(quote.btesDiscount).toBe(435);
    expect(quote.sidaDiscount).toBe(50.75);
    expect(quote.quoteUsd).toBe(1064.25);
  });

  it('uses the 40 percent group rate in place of the individual rate', () => {
    const quote = quoteAt('2026-08-23', 4, 'speak-up', 'quad', { groupDiscountRate: () => 0.4 });
    expect(quote.groupDiscountRate).toBe(0.4);
    expect(quote.individualDiscountRate).toBe(0);
    expect(quote.btesDiscount).toBe(580);
    expect(quote.sidaDiscount).toBe(43.5);
    expect(quote.quoteUsd).toBe(926.5);
  });

  it('waives registration for returning students', () => {
    const quote = quoteAt('2026-07-05');
    quote.enrollmentStatus = 'returning';
    expect(quote.registrationDiscount).toBe(100);
    expect(quote.quoteUsd).toBe(1377.5);
  });

  it('keeps the ALL IN ONE package fixed at four weeks and only leaves electricity among included local items', () => {
    const quote = quoteAt('2026-08-23', 4, 'all-in-one', 'quad');
    expect(quote.quoteError).toBe('');
    expect(quote.quoteUsd).toBe(1000);
    expect(quote.sidaDiscount).toBe(0);
    expect(quote.registrationDiscount).toBe(100);
    expect(quote.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(800);

    quote.quotePlan.rooms[0].optionId = 'triple';
    expect(quote.quoteError).toContain('固定4周并须选择四人房');
  });

  it('uses the chosen initial tourist visa and the official extension amounts', () => {
    const eightWeeks = quoteAt('2026-08-23', 8);
    expect(eightWeeks.visaExtensionCount).toBe(0);
    eightWeeks.visaType = 'tourist30';
    expect(eightWeeks.visaExtensionCount).toBe(1);
    expect(eightWeeks.visaExtensionFee).toBe(5130);

    const twelveWeeks = quoteAt('2026-08-23', 12);
    twelveWeeks.visaType = 'tourist30';
    expect(twelveWeeks.visaExtensionCount).toBe(2);
    expect(twelveWeeks.visaExtensionFee).toBe(11530);
    expect(twelveWeeks.localFees.find((fee) => fee.item.startsWith('ACR'))?.total).toBe(4000);
  });

  it('enforces the official junior ages and guardian requirement', () => {
    const youngChild = quoteAt('2026-08-23', 4, 'junior-5-9', 'quad');
    youngChild.age = 7;
    youngChild.guardianAccompanied = false;
    expect(youngChild.quoteError).toContain('5至7岁');

    const wrongCourse = quoteAt('2026-08-23', 4, 'junior-10-14', 'quad');
    wrongCourse.age = 15;
    expect(wrongCourse.quoteError).toContain('10-14岁');
  });
});
