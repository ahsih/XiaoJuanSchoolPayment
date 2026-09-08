import { PinesStudentQuote, pinesPriceMultiplier } from './pines-student-quote';

const prices = {
  courseFees: [
    { id: 'light-esl-4', name: 'Light ESL 4', tuition: 850, suitable: '主校区｜4节一对一' },
    { id: 'ielts-regular', name: 'IELTS', tuition: 1100, suitable: '雅思校区｜4节一对一 + 3节小组课' },
  ],
  roomFees: [
    { id: 'main-sextuple', name: '主校区六人房', fee: 570, note: '主校区' },
    { id: 'main-family-2-3', name: '主校区亲子2–3人房', fee: 780, note: '按每位学生计算' },
    { id: 'ielts-sextuple', name: '雅思校区六人房', fee: 570, note: '主校区' },
    { id: 'ielts-family-2-3', name: '雅思校区亲子2–3人房', fee: 780, note: '按每位学生计算' },
  ],
  registrationFee: 100,
  sidaDiscountRate: 0.95,
  offSeasonDiscountPerFourWeeks: 150,
  twelveWeekDiscount: 100,
  longStayMinimumWeeks: 16,
  longStayBaseDiscount: 100,
  longStayIncrementWeeks: 2,
  longStayIncrementDiscount: 25,
  seasonalFeePerWeek: 40,
  peakSeasonRanges: [
    { label: '2026旺季', start: '2026-06-28', end: '2026-08-22' },
    { label: '2027旺季', start: '2027-06-27', end: '2027-08-21' },
  ],
};

describe('PinesStudentQuote', () => {
  it('uses 65% for two weeks, 85% for three weeks and proportional rates from four weeks', () => {
    expect(pinesPriceMultiplier(2)).toBe(0.65);
    expect(pinesPriceMultiplier(3)).toBe(0.85);
    expect(pinesPriceMultiplier(5)).toBe(1.25);
    expect(pinesPriceMultiplier(24)).toBe(6);
  });

  it('stacks fixed promotions before applying the Sida 95% rate', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].startDate = '2026-09-06';
    quote.quotePlan.rooms[0].startDate = '2026-09-06';
    quote.quotePlan.courses[0].weeks = 16;
    quote.quotePlan.rooms[0].weeks = 16;

    expect(quote.offSeasonDiscount).toBe(600);
    expect(quote.twelveWeekDiscount).toBe(100);
    expect(quote.longStayDiscount).toBe(100);
    expect(quote.sidaDiscount).toBe(244);
    expect(quote.quoteUsd).toBe(4636);
  });

  it('starts the stackable long-stay discount at 16 weeks and adds 25 dollars every two weeks', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].weeks = 15;
    expect(quote.longStayDiscount).toBe(0);
    quote.quotePlan.courses[0].weeks = 16;
    expect(quote.longStayDiscount).toBe(100);
    quote.quotePlan.courses[0].weeks = 18;
    expect(quote.longStayDiscount).toBe(125);
    quote.quotePlan.courses[0].weeks = 20;
    expect(quote.longStayDiscount).toBe(150);
    quote.quotePlan.courses[0].weeks = 22;
    expect(quote.longStayDiscount).toBe(175);
    quote.quotePlan.courses[0].weeks = 24;
    expect(quote.longStayDiscount).toBe(200);
  });

  it('deducts 150 dollars for every four eligible course weeks when registered by the deadline', () => {
    const quote = new PinesStudentQuote(prices);
    quote.selectedRegistrationDate = '2026-09-08';
    quote.quotePlan.courses[0].startDate = '2026-09-13';
    quote.quotePlan.rooms[0].startDate = '2026-09-13';
    quote.quotePlan.courses[0].weeks = 20;
    quote.quotePlan.rooms[0].weeks = 20;

    expect(quote.offSeasonBlocks).toBe(5);
    expect(quote.offSeasonDiscount).toBe(750);

    quote.selectedRegistrationDate = '2027-01-01';
    expect(quote.offSeasonBlocks).toBe(0);
    expect(quote.offSeasonDiscount).toBe(0);
  });

  it('counts the aligned 2026 and 2027 peak seasons as eight weeks', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].startDate = '2026-06-28';
    quote.quotePlan.rooms[0].startDate = '2026-06-28';
    quote.quotePlan.courses[0].weeks = 8;
    quote.quotePlan.rooms[0].weeks = 8;
    expect(quote.peakWeeks).toBe(8);
    expect(quote.seasonalSurcharge).toBe(320);

    quote.quotePlan.courses[0].startDate = '2027-06-27';
    quote.quotePlan.rooms[0].startDate = '2027-06-27';
    expect(quote.peakWeeks).toBe(8);
  });

  it('calculates extensions from the selected 30 or 59 day entry visa', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].startDate = '2026-09-06';
    quote.quotePlan.rooms[0].startDate = '2026-09-06';
    quote.quotePlan.courses[0].weeks = 8;
    quote.quotePlan.rooms[0].weeks = 8;

    quote.visaType = 'tourist59';
    expect(quote.visaExtensionCount).toBe(0);
    quote.visaType = 'tourist30';
    expect(quote.visaExtensionCount).toBe(1);

    quote.visaType = 'tourist59';
    quote.quotePlan.courses[0].weeks = 12;
    quote.quotePlan.rooms[0].weeks = 12;
    expect(quote.visaExtensionCount).toBe(1);
  });

  it('keeps campus deposit outside local fees and lets each student choose pickup', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].startDate = '2026-09-06';
    quote.quotePlan.rooms[0].startDate = '2026-09-06';
    quote.quotePlan.courses[0].weeks = 8;
    quote.quotePlan.rooms[0].weeks = 8;
    quote.visaType = 'tourist59';
    quote.pickupAirport = 'clark';

    expect(quote.localFees.reduce((sum, fee) => sum + fee.total, 0)).toBe(21500);
    expect(quote.campusDeposit).toEqual({ quantity: 2, total: 8000 });
    expect(quote.localFees.find((fee) => fee.item === '马尼拉机场接机')?.quantity).toBe(0);
    expect(quote.localFees.find((fee) => fee.item === '克拉克机场接机')?.quantity).toBe(1);
  });

  it('charges the family room for each student rather than per room', () => {
    const first = new PinesStudentQuote(prices);
    const second = new PinesStudentQuote(prices);
    first.quotePlan.rooms[0].optionId = 'main-family-2-3';
    second.quotePlan.rooms[0].optionId = 'main-family-2-3';
    expect(first.accommodation).toBe(780);
    expect(second.accommodation).toBe(780);
    expect(first.accommodation + second.accommodation).toBe(1560);
  });

  it('groups matching accommodation under both campuses', () => {
    const quote = new PinesStudentQuote(prices);
    expect(quote.quotePlan.options('course').map((option) => option.group)).toEqual([
      '主校区 Main Campus',
      '雅思校区 IELTS Campus',
    ]);
    expect(quote.quotePlan.options('room').map((option) => option.group)).toEqual([
      '主校区 Main Campus',
      '主校区 Main Campus',
      '雅思校区 IELTS Campus',
      '雅思校区 IELTS Campus',
    ]);
    quote.quotePlan.rooms[0].optionId = 'ielts-sextuple';
    expect(quote.accommodation).toBe(570);
    quote.quotePlan.rooms[0].optionId = 'main-sextuple';
    expect(quote.quotePlan.paymentItems().map((item) => item.detailTitle)).toEqual([
      '主校区 Main Campus｜Light ESL 4',
      '主校区 Main Campus｜六人房',
    ]);
  });

  it('blocks cross-campus accommodation and accepts the matching IELTS room', () => {
    const quote = new PinesStudentQuote(prices);
    quote.quotePlan.courses[0].optionId = 'ielts-regular';
    expect(quote.quoteError).toContain('课程与住宿所属校区不一致');

    quote.quotePlan.rooms[0].optionId = 'ielts-sextuple';
    expect(quote.quoteError).toBe('');
    expect(quote.quotePlan.paymentItems().map((item) => item.detailTitle)).toEqual([
      '雅思校区 IELTS Campus｜IELTS',
      '雅思校区 IELTS Campus｜六人房',
    ]);
  });
});
