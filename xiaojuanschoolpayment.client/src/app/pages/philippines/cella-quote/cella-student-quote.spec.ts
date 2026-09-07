import {
  CELLA_COURSES,
  CELLA_PEAK_SEASON_WEEKLY_FEE,
  CELLA_REGISTRATION_FEE,
  CELLA_ROOMS,
} from './cella-pricing';
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

  function uniQuote(weeks = 4, startDate = '2026-08-30'): CellaStudentQuote {
    const quote = new CellaStudentQuote(catalog, 'uni');
    quote.courseId = 'uni-power-speaking-1';
    quote.roomId = 'uni-quad';
    quote.weeks = weeks;
    quote.startDate = startDate;
    return quote;
  }

  it('applies the low-season discount on both exact campaign boundaries', () => {
    const first = uniQuote(4, '2026-08-30');
    const last = uniQuote(4, '2026-12-06');

    expect(first.endDate).toBe('2026-09-26');
    expect(first.lowSeasonBlocks).toBe(1);
    expect(first.lowSeasonDiscount).toBe(100);
    expect(last.endDate).toBe('2027-01-02');
    expect(last.lowSeasonDiscount).toBe(100);
  });

  it('does not discount an incomplete four-week block outside the campaign', () => {
    const quote = uniQuote(4, '2026-12-13');

    expect(quote.endDate).toBe('2027-01-09');
    expect(quote.lowSeasonBlocks).toBe(0);
    expect(quote.lowSeasonDiscount).toBe(0);
  });

  it('counts complete eligible weeks even when the stay starts before the campaign', () => {
    const quote = uniQuote(6, '2026-08-16');

    expect(quote.lowSeasonBlocks).toBe(1);
    expect(quote.lowSeasonDiscount).toBe(100);
  });

  it('uses the Premium six-person activity price without also applying low season', () => {
    const quote = new CellaStudentQuote(catalog, 'premium');
    quote.courseId = 'premium-light-esl';
    quote.roomId = 'premium-six';
    quote.startDate = '2026-08-30';
    quote.weeks = 4;

    expect(quote.roomPriceBeforePromotions).toBe(600);
    expect(quote.premiumSixPersonDiscount).toBe(101);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.schoolTotal).toBe(1479);
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

  it('stacks every published long-stay tier with low season', () => {
    const cases = [
      { weeks: 8, lowSeason: 200, longStay: 50, total: 3160 },
      { weeks: 12, lowSeason: 300, longStay: 100, total: 4640 },
      { weeks: 16, lowSeason: 400, longStay: 150, total: 6120 },
    ];

    for (const item of cases) {
      const quote = uniQuote(item.weeks);
      expect(quote.lowSeasonDiscount).withContext(`${item.weeks}周淡季优惠`).toBe(item.lowSeason);
      expect(quote.longStayDiscount).withContext(`${item.weeks}周长期优惠`).toBe(item.longStay);
      expect(quote.schoolTotal).withContext(`${item.weeks}周总计`).toBe(item.total);
    }
  });

  it('charges six weeks of course and quad room but eight weeks of local fees for 6+2', () => {
    const quote = uniQuote();
    quote.selectPromotion('social-6-plus-2');

    expect(quote.actualWeeks).toBe(8);
    expect(quote.paidWeeks).toBe(6);
    expect(quote.giftWeeks).toBe(2);
    expect(quote.socialPromotionDiscount).toBe(570.5);
    expect(quote.schoolTotal).toBe(2839.5);
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.longStayDiscount).toBe(0);
    expect(quote.localFees.find((fee) => fee.item === '管理费')?.quantity).toBe('2');
  });

  it('charges nine weeks but uses twelve actual weeks for 9+3', () => {
    const quote = uniQuote();
    quote.selectPromotion('social-9-plus-3');

    expect(quote.actualWeeks).toBe(12);
    expect(quote.paidWeeks).toBe(9);
    expect(quote.giftWeeks).toBe(3);
    expect(quote.schoolTotal).toBe(4062);
    expect(quote.localFees.find((fee) => fee.item === '水费')?.quantity).toBe('3');
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
    const second = uniQuote(8);
    second.roomId = 'uni-twin';

    expect(first.schoolTotal).toBe(2839.5);
    expect(second.schoolTotal).toBe(3560);
    expect(first.campus).toBe('uni');
    expect(second.campus).toBe('uni');
    expect(first.schoolTotal + second.schoolTotal).toBe(6399.5);
  });

  it('leaves the 13–15 week room deposit for school confirmation', () => {
    const quote = uniQuote(13);
    expect(quote.depositAmount).toBeNull();
  });
});
