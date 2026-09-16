import { IMS_COURSES, IMS_OFFICIAL_LOCAL_TOTALS, IMS_ROOMS, IMS_WEEK_OPTIONS } from './ims-pricing';
import { imsEffectiveDailyOneToOne, ImsStudentQuote, validateImsFamily } from './ims-student-quote';

describe('IMS 2026 price catalog and quote rules', () => {
  it('keeps every published course and room price exact', () => {
    expect(IMS_COURSES.length).toBe(26);
    expect(IMS_ROOMS.length).toBe(4);
    const values = (id: string) => IMS_WEEK_OPTIONS.map((week) => IMS_COURSES.find((item) => item.id === id)?.prices[week] ?? null);
    const price850 = [255, 510, 680, 850, 1700, 2550, 3400, 4250, 5100];
    const price1000 = [300, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000];
    const price1100 = [330, 660, 880, 1100, 2200, 3300, 4400, 5500, 6600];
    const price1400 = [420, 840, 1120, 1400, 2800, 4200, 5600, 7000, 8400];
    for (const id of ['premium-esl', 'essential-esl-5', 'mommy-tesol']) expect(values(id)).withContext(id).toEqual(price850);
    for (const id of ['intensive-esl', 'essential-esl-6', 'working-holiday', 'business-english']) expect(values(id)).withContext(id).toEqual(price1000);
    for (const id of ['toeic-speaking', 'opic', 'pre-toeic', 'toeic', 'pre-ielts', 'ielts']) expect(values(id)).withContext(id).toEqual(price1100);
    for (const id of ['pre-toefl', 'intensive-toefl', 'sat']) expect(values(id)).withContext(id).toEqual(price1400);
    expect(values('essential-esl-4')).toEqual([210, 420, 560, 700, 1400, 2100, 2800, 3500, 4200]);
    expect(values('senior-esl')).toEqual([240, 480, 640, 800, 1600, 2400, 3200, 4000, 4800]);
    expect(values('power-speaking')).toEqual([315, 630, 840, 1050, 2100, 3150, 4200, 5250, 6300]);
    expect(values('tesol-light')).toEqual([270, 540, 720, 900, 1800, 2700, 3600, 4500, 5400]);
    expect(values('toeic-guarantee')).toEqual([null, null, null, null, null, 3450, 4550, 5650, 6900]);
    expect(values('ielts-guarantee')).toEqual([null, null, null, null, null, 3600, 4700, 5800, 7200]);
    expect(values('junior-esl-6')).toEqual([390, 780, 1040, 1300, 2600, 3900, 5200, 6500, 7800]);
    expect(values('junior-esl-8')).toEqual([510, 1020, 1360, 1700, 3400, 5100, 6800, 8500, 10200]);
    expect(values('junior-esl-9')).toEqual([570, 1140, 1520, 1900, 3800, 5700, 7600, 9500, 11400]);
    expect(values('parents-esl')).toEqual([240, 480, 640, 800, 1600, 2400, 3200, 4000, 4800]);
    expect(IMS_ROOMS.map((room) => IMS_WEEK_OPTIONS.map((week) => room.prices[week]))).toEqual([
      [300, 600, 800, 1000, 2000, 3000, 4000, 5000, 6000],
      [255, 510, 680, 850, 1700, 2550, 3400, 4250, 5100],
      [210, 420, 560, 700, 1400, 2100, 2800, 3500, 4200],
      [195, 390, 520, 650, 1300, 1950, 2600, 3250, 3900],
    ]);
    const essential = IMS_COURSES.find((item) => item.id === 'essential-esl-4')!;
    expect(essential.prices).toEqual({ 1: 210, 2: 420, 3: 560, 4: 700, 8: 1400, 12: 2100, 16: 2800, 20: 3500, 24: 4200 });
    const toeicGuarantee = IMS_COURSES.find((item) => item.id === 'toeic-guarantee')!;
    expect(toeicGuarantee.prices).toEqual({ 12: 3450, 16: 4550, 20: 5650, 24: 6900 });
    expect(toeicGuarantee.allowedWeeks).toEqual([12, 16, 20, 24]);
  });

  it('never discounts the 100-dollar registration fee and applies 95% only after school discounts', () => {
    const quote = new ImsStudentQuote();
    expect(quote.registration).toBe(100);
    expect(quote.originalStudyStay).toBe(1350);
    expect(quote.sidaDiscountAmount).toBe(67.5);
    expect(quote.quoteUsd).toBe(1382.5);
    quote.enrollmentStatus = 'returning';
    expect(quote.registration).toBe(100);
    expect(quote.quoteUsd).toBe(1382.5);
  });

  it('rejects unpublished guarantee durations', () => {
    const quote = new ImsStudentQuote();
    quote.quotePlan.courses[0].optionId = 'toeic-guarantee';
    quote.quotePlan.courses[0].weeks = 8;
    expect(quote.quoteError).toContain('没有公布8周价格');
  });

  it('prices 2+2 with explicit two-week course and room prices, once only', () => {
    const quote = new ImsStudentQuote();
    quote.quotePlan.courses[0].startDate = '2026-09-06';
    quote.quotePlan.rooms[0].startDate = '2026-09-06';
    quote.setPromotion(quote.quotePlan.courses[0].id, 0, 'two-plus-two');
    expect(quote.twoPlusTwoDiscountAmount).toBe(540); // (700-420) + (650-390)
    expect(quote.quoteUsd).toBe(869.5); // registration + 810 after school promotion, then 95%

    quote.quotePlan.courses[0].weeks = 8;
    quote.quotePlan.rooms[0].weeks = 8;
    quote.setPromotion(quote.quotePlan.courses[0].id, 1, 'two-plus-two');
    expect(quote.quoteError).toContain('最多只能选择一次');
  });

  it('allows first 4-week block 2+2 and second block 300, but never on the same block', () => {
    const quote = new ImsStudentQuote();
    quote.quotePlan.courses[0].startDate = '2026-09-06';
    quote.quotePlan.rooms[0].startDate = '2026-09-06';
    quote.quotePlan.courses[0].weeks = 12;
    quote.quotePlan.rooms[0].weeks = 12;
    quote.setPromotion(quote.quotePlan.courses[0].id, 0, 'two-plus-two');
    quote.setPromotion(quote.quotePlan.courses[0].id, 1, 'low-season-300');
    expect(quote.promotionBlocks.map((block) => block.promotion)).toEqual(['two-plus-two', 'low-season-300', 'none']);
    expect(quote.paidCourseWeeks).toBe(10);
    expect(quote.longStayDiscountAmount).toBe(50);
    expect(quote.lowSeasonDiscountAmount).toBe(300);
    expect(quote.quoteError).toBe('');
  });

  it('blocks January and June through August from off-season activities', () => {
    for (const date of ['2027-01-03', '2026-06-07', '2026-07-05', '2026-08-02']) {
      const quote = new ImsStudentQuote();
      quote.quotePlan.courses[0].startDate = date;
      quote.quotePlan.rooms[0].startDate = date;
      quote.setPromotion(quote.quotePlan.courses[0].id, 0, 'two-plus-two');
      expect(quote.quoteError).toContain('活动排除月份');
    }
  });

  it('matches every official 1–24 week local-fee total', () => {
    for (let weeks = 1; weeks <= 24; weeks++) {
      const quote = new ImsStudentQuote();
      quote.quotePlan.courses[0].weeks = weeks;
      quote.quotePlan.rooms[0].weeks = weeks;
      expect(quote.localFeeTotal).withContext(`${weeks}周`).toBe(IMS_OFFICIAL_LOCAL_TOTALS[weeks]);
    }
  });

  it('handles parent transfer only to Junior ESL 6 and caps the child at nine one-to-one classes', () => {
    const parent = new ImsStudentQuote();
    const child = new ImsStudentQuote();
    parent.travelerRole = 'parent';
    parent.quotePlan.courses[0].optionId = 'parents-esl';
    parent.transferParentOneToOne = true;
    parent.linkedStudentIndex = 1;
    child.travelerRole = 'child';
    child.quotePlan.courses[0].optionId = 'junior-esl-6';
    expect(validateImsFamily([parent, child])).toBe('');
    expect(imsEffectiveDailyOneToOne([parent, child], 1)).toBe(9);
    child.quotePlan.courses[0].optionId = 'junior-esl-8';
    expect(validateImsFamily([parent, child])).toContain('Junior ESL 8或9不能接收');
  });

  it('calculates independent people without counting inactive saved students', () => {
    const first = new ImsStudentQuote();
    const second = new ImsStudentQuote();
    second.quotePlan.courses[0].optionId = 'premium-esl';
    second.quotePlan.rooms[0].optionId = 'single';
    expect(first.quoteUsd + second.quoteUsd).toBe(1382.5 + 1857.5);
    expect(first.quoteUsd).toBe(1382.5);
  });
});
