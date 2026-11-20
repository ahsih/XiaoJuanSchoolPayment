import {
  CELLA_COURSES,
  CELLA_PEAK_SEASON_WEEKLY_FEE,
  CELLA_REGISTRATION_FEE,
  CELLA_ROOMS,
} from './cella-pricing';
import { cloneCellaContentConfig, createDefaultCellaContentConfig } from './cella-content-config';
import { CellaQuoteCatalog, CellaStudentQuote } from './cella-student-quote';

describe('CellaStudentQuote', () => {
  let catalog: CellaQuoteCatalog;

  beforeEach(() => {
    catalog = {
      courses: CELLA_COURSES.map((item) => ({ ...item })),
      rooms: CELLA_ROOMS.map((item) => ({ ...item })),
      registrationFee: CELLA_REGISTRATION_FEE,
      peakSeasonWeeklyFee: CELLA_PEAK_SEASON_WEEKLY_FEE,
    };
  });

  function uniQuote(weeks = 4, startDate = '2026-08-30', roomId = 'uni-quad'): CellaStudentQuote {
    const quote = new CellaStudentQuote(catalog, 'uni');
    quote.courseId = 'uni-power-speaking-1';
    quote.roomId = roomId;
    quote.weeks = weeks;
    quote.startDate = startDate;
    return quote;
  }

  function premiumQuote(weeks: number, startDate: string, roomId = 'premium-six'): CellaStudentQuote {
    const quote = new CellaStudentQuote(catalog, 'premium');
    quote.courseId = 'premium-light-esl';
    quote.roomId = roomId;
    quote.weeks = weeks;
    quote.startDate = startDate;
    return quote;
  }

  const fee = (quote: CellaStudentQuote, item: string) => quote.localFees.find((row) => row.item === item);

  it('prices every quote with the 2027 tuition and room list', () => {
    const quote = uniQuote(4, '2026-11-29');
    expect(quote.coursePriceBeforePromotions).toBe(930);
    expect(quote.roomPriceBeforePromotions).toBe(770);
    expect(catalog.registrationFee).toBe(150);
  });

  it('applies the low-season discount on both exact campaign boundaries', () => {
    const first = uniQuote(4, '2026-08-30');
    const last = uniQuote(4, '2026-12-06');

    expect(first.endDate).toBe('2026-09-26');
    expect(first.lowSeasonBlocks).toBe(1);
    expect(first.lowSeasonDiscount).toBe(100);
    expect(first.schoolTotal).toBe(1750);
    expect(last.endDate).toBe('2027-01-02');
    expect(last.lowSeasonDiscount).toBe(100);
  });

  it('does not discount an incomplete four-week block outside the campaign', () => {
    const quote = uniQuote(4, '2026-12-13');

    expect(quote.endDate).toBe('2027-01-09');
    expect(quote.lowSeasonBlocks).toBe(0);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.lowSeason2027Discount).toBe(0);
  });

  it('keeps 2026 at 40 dollars and charges 2027 and 2028 summer weeks at 60 dollars', () => {
    const in2026 = uniQuote(4, '2026-07-05');
    const in2027 = uniQuote(4, '2027-07-04');
    const in2028 = uniQuote(4, '2028-07-02');

    expect(in2026.peakSeasonSurcharge).toBe(160);
    expect(in2026.peakSeasonNote).toBe('40美元／周 × 4周');
    expect(in2027.peakSeasonWeeks).toBe(4);
    expect(in2027.peakSeasonSurcharge).toBe(240);
    expect(in2027.peakSeasonNote).toBe('60美元／周 × 4周');
    expect(in2028.peakSeasonSurcharge).toBe(240);
    expect(in2027.lowSeason2027Discount).toBe(0);
  });

  it('counts complete eligible weeks even when the stay starts before the campaign', () => {
    const quote = uniQuote(6, '2026-08-16');

    expect(quote.lowSeasonBlocks).toBe(1);
    expect(quote.lowSeasonDiscount).toBe(100);
  });

  it('keeps the 499-dollar six-person activity price until 2027/01/02', () => {
    const quote = premiumQuote(4, '2026-08-30');

    expect(quote.roomPriceBeforePromotions).toBe(670);
    expect(quote.premiumSixPersonDiscount).toBe(171);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.schoolTotal).toBe(1479);
  });

  it('stacks every 2026 long-stay tier with low season', () => {
    const cases = [
      { weeks: 8, lowSeason: 200, longStay: 50, total: 3300 },
      { weeks: 12, lowSeason: 300, longStay: 100, total: 4850 },
      { weeks: 16, lowSeason: 400, longStay: 150, total: 6400 },
    ];

    for (const item of cases) {
      const quote = uniQuote(item.weeks);
      expect(quote.lowSeasonDiscount).withContext(`${item.weeks}周淡季优惠`).toBe(item.lowSeason);
      expect(quote.longStayDiscount).withContext(`${item.weeks}周长期优惠`).toBe(item.longStay);
      expect(quote.schoolTotal).withContext(`${item.weeks}周总计`).toBe(item.total);
    }
  });

  it('gives the 2027 low season 25 dollars per shared-room week outside the summer weeks', () => {
    const february = uniQuote(4, '2027-02-14');
    expect(february.lowSeason2027Weeks).toBe(4);
    expect(february.lowSeason2027Discount).toBe(100);
    expect(february.schoolTotal).toBe(1750);

    const intoSummer = uniQuote(4, '2027-05-23');
    expect(intoSummer.lowSeason2027Weeks).toBe(1);

    const single = uniQuote(4, '2027-02-14', 'uni-single');
    expect(single.lowSeason2027Discount).toBe(0);

    const january = uniQuote(4, '2027-01-10');
    expect(january.lowSeason2027Discount).toBe(0);
  });

  it('stacks the 2027 long-stay tiers with the 2027 low season', () => {
    const cases = [
      { weeks: 12, longStay: 100 },
      { weeks: 16, longStay: 150 },
      { weeks: 20, longStay: 200 },
      { weeks: 24, longStay: 250 },
    ];
    for (const item of cases) {
      expect(uniQuote(item.weeks, '2027-09-05').longStay2027Discount).withContext(`${item.weeks}周`).toBe(item.longStay);
    }
    const twelve = uniQuote(12, '2027-02-14');
    expect(twelve.lowSeason2027Discount).toBe(300);
    expect(twelve.schoolTotal).toBe(4850);
    expect(uniQuote(8, '2027-02-14').longStay2027Discount).toBe(0);
  });

  it('takes 25% off Premium six-person course and room for 4, 8 or 12 weeks without the long-stay offer', () => {
    const four = premiumQuote(4, '2027-02-14');
    expect(four.premiumSixPerson2027Discount).toBe(375);
    expect(four.schoolTotal).toBe(1275);

    const twelve = premiumQuote(12, '2027-02-14');
    expect(twelve.premiumSixPerson2027Discount).toBe(1125);
    expect(twelve.longStay2027Discount).toBe(0);
    expect(twelve.schoolTotal).toBe(3525);

    const sixteen = premiumQuote(16, '2027-02-14');
    expect(sixteen.premiumSixPerson2027Discount).toBe(0);
    expect(sixteen.longStay2027Discount).toBe(150);
    expect(sixteen.schoolTotal).toBe(6000);

    const summer = premiumQuote(4, '2027-06-06');
    expect(summer.premiumSixPerson2027Discount).toBe(0);
  });

  it('offers the four confirmed family packages only on the Premium campus', () => {
    const uni = new CellaStudentQuote(catalog, 'uni');
    const premium = new CellaStudentQuote(catalog, 'premium');

    expect(uni.courseOptions.filter((course) => course.familyPackage).length).toBe(0);
    expect(premium.courseOptions.filter((course) => course.familyPackage).length).toBe(4);
  });

  it('uses exact 4, 6 and 8 week family-package totals without duplicating included fees', () => {
    const expected: Record<string, [number, number, number]> = {
      'premium-family-twin': [5600, 8400, 11000],
      'premium-family-triple': [8750, 13125, 17300],
      'premium-family-quad-2-2': [10700, 16050, 21200],
      'premium-family-quad-1-3': [11200, 16800, 22200],
    };

    for (const [courseId, totals] of Object.entries(expected)) {
      const quote = new CellaStudentQuote(catalog, 'premium');
      quote.selectCourse(courseId);
      [4, 6, 8].forEach((weeks, index) => {
        quote.weeks = weeks;
        expect(quote.schoolTotal).withContext(`${courseId} ${weeks}周`).toBe(totals[index]);
        expect(quote.roomPriceBeforePromotions).toBe(0);
        expect(quote.localFeeTotal).toBe(0);
        expect(quote.lowSeasonDiscount).toBe(0);
        expect(quote.longStayDiscount).toBe(0);
      });
    }
  });

  it('limits family packages to confirmed durations and does not apply social promotions', () => {
    const quote = new CellaStudentQuote(catalog, 'premium');
    quote.selectCourse('premium-family-twin');
    quote.weeks = 5;
    expect(quote.error).toContain('4周、6周或8周');

    quote.weeks = 4;
    quote.selectPromotion('social-6-plus-2');
    expect(quote.promotionMode).toBe('standard');
    expect(quote.schoolTotal).toBe(5600);
  });

  it('charges six weeks of course and quad room but eight weeks of local fees for 6+2', () => {
    const quote = uniQuote();
    quote.selectPromotion('social-6-plus-2');

    expect(quote.actualWeeks).toBe(8);
    expect(quote.paidWeeks).toBe(6);
    expect(quote.giftWeeks).toBe(2);
    expect(quote.socialPromotionDiscount).toBe(595);
    expect(quote.schoolTotal).toBe(2955);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.longStayDiscount).toBe(0);
    expect(fee(quote, '管理费')?.quantity).toBe('8周');
  });

  it('charges nine weeks but uses twelve actual weeks for 9+3', () => {
    const quote = uniQuote();
    quote.selectPromotion('social-9-plus-3');

    expect(quote.actualWeeks).toBe(12);
    expect(quote.paidWeeks).toBe(9);
    expect(quote.giftWeeks).toBe(3);
    expect(quote.schoolTotal).toBe(4230);
    expect(fee(quote, '水费')?.quantity).toBe('12周');
  });

  it('rejects social promotions for non-new or non-quad students', () => {
    const returning = uniQuote();
    returning.enrollmentStatus = 'extension';
    returning.selectPromotion('social-6-plus-2');
    expect(returning.error).toContain('首次报名新生');

    const wrongRoom = uniQuote();
    wrongRoom.selectPromotion('social-9-plus-3');
    wrongRoom.roomId = 'uni-twin';
    expect(wrongRoom.error).toContain('四人间');
  });

  it('keeps students independent within one campus group quote', () => {
    const first = uniQuote();
    first.selectPromotion('social-6-plus-2');
    const second = uniQuote(8, '2026-08-30', 'uni-twin');

    expect(first.schoolTotal).toBe(2955);
    expect(second.schoolTotal).toBe(3700);
    expect(first.campus).toBe('uni');
    expect(second.campus).toBe('uni');
  });

  it('calculates 2027 local fees per week with the visa stages for 59-day and 30-day entries', () => {
    const quote = uniQuote(12, '2027-02-14');
    expect(fee(quote, '签证续签')?.total).toBe(6410);
    expect(fee(quote, 'ARP加急费')?.total).toBe(300);
    expect(fee(quote, '外国人身份证')?.total).toBe(4000);
    expect(fee(quote, '管理费')?.total).toBe(12000);
    expect(fee(quote, '电费')?.total).toBe(6000);
    expect(fee(quote, '水费')?.total).toBe(6000);
    expect(quote.localFeeTotal).toBe(49210);

    quote.initialVisaDays = 30;
    expect(fee(quote, '签证续签')?.total).toBe(11550);
    expect(quote.localFeeTotal).toBe(54350);

    const eight = uniQuote(8, '2027-02-14');
    eight.initialVisaDays = 30;
    expect(fee(eight, '签证续签')?.total).toBe(5140);
    expect(fee(eight, 'ARP加急费')?.total).toBe(300);
    expect(fee(eight, '外国人身份证')?.total).toBe(0);
    eight.initialVisaDays = 59;
    expect(fee(eight, '签证续签')?.total).toBe(0);
    expect(fee(eight, 'ARP加急费')?.total).toBe(0);

    const long = uniQuote(24, '2027-02-14');
    expect(fee(long, '签证续签')?.total).toBe(19730);
    long.initialVisaDays = 30;
    expect(fee(long, '签证续签')?.total).toBe(24870);
  });

  it('switches water to 500 pesos a week from 2027/01/01', () => {
    const quote = uniQuote(4, '2026-12-13');
    expect(fee(quote, '水费')?.total).toBe(1400);
  });

  it('charges STACIA a fixed 1,000-peso electricity and no deposit from 2027', () => {
    const quote = premiumQuote(4, '2027-02-14', 'premium-alicia-single');
    expect(fee(quote, '电费')?.total).toBe(4000);
    expect(quote.depositAmount).toBe(0);
    expect(premiumQuote(4, '2027-02-14', 'premium-single').depositAmount).toBe(5000);
  });

  it('uses the 2027 deposit tiers', () => {
    expect(uniQuote(2, '2027-02-14').depositAmount).toBe(2000);
    expect(uniQuote(8, '2027-02-14').depositAmount).toBe(5000);
    expect(uniQuote(12, '2027-02-14').depositAmount).toBe(8000);
    expect(uniQuote(13, '2027-02-14').depositAmount).toBe(10000);
  });

  it('limits IELTS Guarantee to 8 or 12 weeks and TESOL to its 4-week start dates', () => {
    const guarantee = uniQuote(4, '2027-02-14');
    guarantee.courseId = 'uni-ielts-guarantee';
    expect(guarantee.error).toContain('8／12周');
    guarantee.weeks = 8;
    expect(guarantee.error).toBe('');

    const tesol = uniQuote(4, '2027-02-14');
    tesol.courseId = 'uni-tesol';
    expect(tesol.error).toContain('指定开课日');
    tesol.startDate = '2027-02-28';
    expect(tesol.error).toBe('');
    tesol.weeks = 8;
    expect(tesol.error).toContain('只开4周');
  });

  it('moves a saved 2026 content document onto the 2027 prices once', () => {
    const saved = createDefaultCellaContentConfig('premium');
    delete (saved.quoteSettings as { cellaPolicyVersion?: number }).cellaPolicyVersion;
    saved.courses = saved.courses.filter((course) => course.id !== 'premium-working-holiday-2');
    saved.courses.find((course) => course.id === 'premium-power-speaking-2')!.tuition = 1080;
    const six = saved.rooms.find((room) => room.id === 'premium-six')!;
    six.fee = 600;
    const outside = saved.rooms.find((room) => room.id === 'premium-alicia-single')!;
    Object.assign(outside, { name: 'Alicia校外单人间', label: 'Alicia校外单人间', fee: 1600 });
    saved.quoteImageSettings.footerNotes = ['员工自定义说明'];

    const upgraded = cloneCellaContentConfig(saved, 'premium');
    expect(upgraded.courses.find((course) => course.id === 'premium-power-speaking-2')?.tuition).toBe(1180);
    expect(upgraded.courses.some((course) => course.id === 'premium-working-holiday-2')).toBeTrue();
    expect(upgraded.rooms.find((room) => room.id === 'premium-six')?.fee).toBe(670);
    expect(upgraded.rooms.find((room) => room.id === 'premium-alicia-single')?.label).toBe('STACIA校外单人间');
    expect(upgraded.quoteSettings.peakSeasonRanges.some((range) => range.id === 'cella-peak-2028')).toBeTrue();
    expect(upgraded.quoteSettings.promotions.some((promotion) => promotion.id === 'cella-premium-six-person-2027')).toBeTrue();
    expect(upgraded.quoteImageSettings.footerNotes).toEqual(['员工自定义说明']);

    upgraded.rooms.find((room) => room.id === 'premium-six')!.fee = 650;
    expect(cloneCellaContentConfig(upgraded, 'premium').rooms.find((room) => room.id === 'premium-six')?.fee).toBe(650);
  });
});
