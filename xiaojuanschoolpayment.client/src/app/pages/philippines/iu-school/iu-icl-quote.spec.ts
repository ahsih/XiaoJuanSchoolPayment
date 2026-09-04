import { IuIclQuote, ICL_COURSES, ICL_ROOMS, IU_COURSES, IU_ROOMS } from './iu-icl-quote';

describe('IU and ICL 2026 quote rules', () => {
  const align = (quote: IuIclQuote, weeks: number, startDate: string) => {
    quote.plan.courses[0].weeks = weeks;
    quote.plan.rooms[0].weeks = weeks;
    quote.plan.courses[0].startDate = startDate;
    quote.plan.rooms[0].startDate = startDate;
  };

  it('keeps the supplied four-week course and campus-room catalogs distinct', () => {
    expect(IU_COURSES.map(item => item.tuition)).toEqual([750, 850, 1000, 1150, 950, 1000, 1200, 1133, 950, 1100, 900, 900, 850, 1000, 1050]);
    expect(ICL_COURSES.map(item => item.tuition)).toEqual([750, 850, 1000, 1150, 950, 1000, 1200, 1133, 950, 1100, 900, 900]);
    expect(IU_ROOMS.filter(item => item.accommodation).map(item => item.fee)).toEqual([950, 800, 700, 600, 1400, 950]);
    expect(ICL_ROOMS.filter(item => item.accommodation).map(item => item.fee)).toEqual([850, 750, 700, 600, 1450, 1050, 950]);
  });

  it('uses 40/60/80 percent for regular short stays and never adds an intermediary discount', () => {
    const quote = new IuIclQuote('IU', 'power-speaking-4', 'walk-in', '2026-09-13');
    [1, 2, 3].forEach((weeks, index) => {
      align(quote, weeks, '2026-09-13');
      expect(quote.total).toBe(100 + [340, 510, 680][index]);
      expect(quote.lowSeasonDiscount).toBe(0);
      expect(quote.registrationWaiver).toBe(0);
    });
    expect(quote.promotionNote).toContain('思达启航不提供或叠加其它价格优惠');
  });

  it('matches the school low-season packages and waives registration once', () => {
    const iu = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13');
    expect(iu.total).toBe(1150);
    expect(iu.lowSeasonDiscount).toBe(400);
    expect(iu.registrationWaiver).toBe(100);

    const icl = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    expect(icl.total).toBe(1050);
    expect(icl.lowSeasonDiscount).toBe(400);
    expect(icl.schoolPaymentItems.filter(item => item.label === '校方免注册费')).toHaveSize(1);
  });

  it('uses the poster end date as the last Saturday eligible for the package', () => {
    const quote = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-12-13');
    expect(quote.plan.end(quote.plan.courses[0])).toBe('2027-01-09');
    expect(quote.total).toBe(1150);
    align(quote, 4, '2026-12-20');
    expect(quote.plan.end(quote.plan.courses[0])).toBe('2027-01-16');
    expect(quote.total).toBe(1650);
    expect(quote.lowSeasonDiscount).toBe(0);
  });

  it('requires an exact same-date campus-room pair and enforces fixed guarantee lengths', () => {
    const quote = new IuIclQuote('ICL', 'power-speaking-6', 'campus-double', '2026-10-04');
    quote.plan.rooms[0].startDate = '2026-10-11';
    expect(quote.lowSeasonDiscount).toBe(0);
    expect(quote.warning).toContain('没有与同日期、同周数');
    quote.plan.courses[0].optionId = 'ielts-guarantee-8';
    expect(quote.error).toContain('固定8周');
    align(quote, 8, '2026-10-04');
    expect(quote.error).toBe('');
    expect(quote.total).toBe(3100);
  });

  it('matches every supplied local-fee checkpoint', () => {
    const quote = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13');
    const expected = new Map([[4, 22900], [8, 33200], [12, 49000], [16, 59300], [24, 79900]]);
    expected.forEach((total, weeks) => {
      align(quote, weeks, '2026-09-13');
      expect(quote.localFeeTotal).toBe(total);
    });
  });

  it('keeps the full-detail webpage and image rows synchronized in Chinese currency names', () => {
    const quote = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    const image = quote.imageData(7.2, 7.8, '2026-09-05', '/assets/iu/iu-icl-low-season-promo-2026.jpg');
    expect(image.headingText).toBe('ICL4周报价');
    expect(image.fullFeeDetails).toBeTrue();
    expect(image.hideAlumniBenefit).toBeTrue();
    expect(image.alumniBenefitItems).toEqual([]);
    expect(image.totalIncludedLabel).toBe('校方淡季价已计入');
    expect(image.finalConfirmationText).toBe('最终以学校书面确认的价格与空房为准。');
    expect(image.importantNotes).toEqual(jasmine.arrayContaining(quote.admissionRules));
    expect(image.localFeeItems?.map(item => item.note)).toEqual(quote.localFees.map(item => item.note));
    expect(image.paymentItems.map(item => item.label)).toEqual(quote.schoolPaymentItems.map(item => item.label));
    expect(JSON.stringify(image)).not.toMatch(/\bUSD\b|\bPHP\b|\bCNY\b/);
    expect(JSON.stringify(image)).not.toContain('老学员专属优惠');
  });
});
