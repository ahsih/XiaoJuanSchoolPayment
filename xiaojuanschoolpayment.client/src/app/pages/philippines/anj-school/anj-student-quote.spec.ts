import {
  ANJ_COURSES,
  ANJ_PEAK_SEASON_RANGES,
  ANJ_REGISTRATION_FEE,
  ANJ_ROOMS,
  ANJ_SEASONAL_FEE_PER_WEEK,
  ANJ_SIDA_DISCOUNT_RATE,
} from './anj-pricing';
import { AnjQuotePrices, AnjStudentQuote } from './anj-student-quote';

describe('AnjStudentQuote', () => {
  const prices: AnjQuotePrices = {
    courses: ANJ_COURSES,
    rooms: ANJ_ROOMS,
    registrationFee: ANJ_REGISTRATION_FEE,
    sidaDiscountRate: ANJ_SIDA_DISCOUNT_RATE,
    seasonalFeePerWeek: ANJ_SEASONAL_FEE_PER_WEEK,
    peakSeasonRanges: ANJ_PEAK_SEASON_RANGES,
  };

  const quoteAt = (startDate: string, weeks = 4) => {
    const quote = new AnjStudentQuote(prices);
    quote.selectedRegistrationDate = '2026-09-01';
    quote.quotePlan.courses[0].startDate = startDate;
    quote.quotePlan.courses[0].weeks = weeks;
    quote.quotePlan.rooms[0].startDate = startDate;
    quote.quotePlan.rooms[0].weeks = weeks;
    return quote;
  };

  it('applies September fixed discounts before the Sida 95% rate', () => {
    const quote = quoteAt('2026-09-06');
    quote.birthMonth = 2;
    quote.birthDay = 7;

    expect(quote.regularDiscount).toBe(50);
    expect(quote.birthdayDiscount).toBe(100);
    expect(quote.lowSeasonDiscount).toBe(100);
    expect(quote.sidaDiscount).toBe(60);
    expect(quote.registrationDiscount).toBe(100);
    expect(quote.quoteUsd).toBe(1140);
    const birthdayLine = quote.paymentLines.find((line) => line.promotionKey === 'anj-birthday');
    expect(birthdayLine?.value).toBe(-100);
    expect(birthdayLine?.note).toContain('符合条件，减免100美元');
    expect(quote.applicablePaymentLines).toContain(birthdayLine!);
  });

  it('always explains the current birthday rule when the student is not eligible', () => {
    const quote = quoteAt('2026-09-06');
    quote.birthMonth = 1;
    quote.birthDay = 1;

    const birthdayLine = quote.paymentLines.find((line) => line.promotionKey === 'anj-birthday');
    expect(birthdayLine?.value).toBe(0);
    expect(birthdayLine?.note).toContain('当前出生日期尾数1不符合本档期');
    expect(birthdayLine?.note).toContain('2026年7–9月入学，出生日期尾数须为7');
    expect(birthdayLine?.note).toContain('报名注册日须不早于2025/12/15');
    expect(birthdayLine?.note).toContain('须提交生日证明');
    expect(quote.applicablePaymentLines).not.toContain(birthdayLine!);
  });

  it('shows every promotion status on the webpage but keeps zero-value promotions out of the image', () => {
    const quote = quoteAt('2026-09-06');
    quote.birthDay = 1;

    const webPromotionKeys = quote.paymentLines.map((line) => line.promotionKey).filter(Boolean);
    expect(webPromotionKeys).toEqual([
      'registration', 'anj-regular', 'anj-birthday', 'anj-low-season', 'anj-continuation', 'sida',
    ]);
    expect(quote.paymentLines.find((line) => line.promotionKey === 'anj-continuation')?.note).toContain('当前选择新生');

    const imagePromotionKeys = quote.applicablePaymentLines.map((line) => line.promotionKey).filter(Boolean);
    expect(imagePromotionKeys).toEqual(['registration', 'anj-regular', 'anj-low-season', 'sida']);
  });

  it('keeps continuation pricing mutually exclusive with new-student offers', () => {
    const quote = quoteAt('2027-03-07', 12);
    quote.selectedRegistrationDate = '2027-02-15';
    quote.birthMonth = 3;
    quote.birthDay = 7;
    quote.enrollmentStatus = 'continuation';

    expect(quote.continuationDiscount).toBe(900);
    expect(quote.regularDiscount).toBe(0);
    expect(quote.birthdayDiscount).toBe(0);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.sidaDiscount).toBe(172.5);
    expect(quote.quoteUsd).toBe(3277.5);
  });

  it('applies the 2027 low-season and same-birth-month rules to a new student', () => {
    const quote = quoteAt('2027-03-07', 12);
    quote.selectedRegistrationDate = '2027-02-15';
    quote.birthMonth = 3;
    quote.birthDay = 18;

    expect(quote.regularDiscount).toBe(0);
    expect(quote.lowSeasonDiscount).toBe(900);
    expect(quote.birthdayDiscount).toBe(100);
    expect(quote.sidaDiscount).toBe(167.5);
    expect(quote.quoteUsd).toBe(3182.5);
  });

  it('counts the full eight-week peak period in both aligned years', () => {
    expect(quoteAt('2026-06-28', 8).peakWeeks).toBe(8);
    expect(quoteAt('2027-06-27', 8).peakWeeks).toBe(8);
  });

  it('uses the selected initial tourist-visa duration for extensions', () => {
    const quote = quoteAt('2026-09-06', 8);
    expect(quote.visaExtensionCount).toBe(0);

    quote.visaType = 'tourist30';
    expect(quote.visaExtensionCount).toBe(1);

    quote.quotePlan.courses[0].weeks = 12;
    quote.quotePlan.rooms[0].weeks = 12;
    expect(quote.visaExtensionCount).toBe(2);
  });

  it('rejects unsupported guarantee-course durations', () => {
    const quote = quoteAt('2026-09-06', 20);
    quote.quotePlan.courses[0].optionId = 'toeic-guarantee';

    expect(quote.quoteError).toContain('仅可选择12、16周');
  });

  it('shows the provisional 2027 price warning', () => {
    expect(quoteAt('2027-01-03').priceYearWarning).toContain('暂按2026');
  });
});
