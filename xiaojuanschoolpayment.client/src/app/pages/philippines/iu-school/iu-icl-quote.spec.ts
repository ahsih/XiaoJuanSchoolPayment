import {
  buildIuIclGroupImageData,
  IuIclQuote,
  ICL_COURSES,
  ICL_ROOMS,
  IU_COURSES,
  IU_ICL_GUARANTEE_RULES,
  IU_ROOMS,
  iuIclGroupLocalFees,
  iuIclGroupPaymentItems,
} from './iu-icl-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';

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

  it('keeps IU and ICL course and room Sundays synchronized in both directions', () => {
    for (const quote of [
      new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13'),
      new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04'),
    ]) {
      const editor = new SchoolQuotePlanComponent();
      editor.plan = quote.plan;
      editor.syncCourseDatesToRooms = true;
      const input = document.createElement('input');

      editor.updateStartDate('course', 0, '2026-11-01', input);
      expect(quote.plan.courses[0].startDate).toBe('2026-11-01');
      expect(quote.plan.rooms[0].startDate).toBe('2026-11-01');

      editor.updateStartDate('room', 0, '2026-11-08', input);
      expect(quote.plan.rooms[0].startDate).toBe('2026-11-08');
      expect(quote.plan.courses[0].startDate).toBe('2026-11-08');
    }
  });

  it('starts every added IU or ICL row on the Sunday after its previous row ends', () => {
    for (const { quote, expectedNextSunday } of [
      { quote: new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13'), expectedNextSunday: '2026-11-08' },
      { quote: new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04'), expectedNextSunday: '2026-11-29' },
    ]) {
      quote.plan.courses[0].weeks = 8;
      quote.plan.rooms[0].weeks = 8;
      quote.plan.add('course');
      quote.plan.add('room');

      expect(quote.plan.courses[1].startDate).toBe(expectedNextSunday);
      expect(quote.plan.rooms[1].startDate).toBe(quote.plan.courses[1].startDate);
      expect(new Date(`${quote.plan.courses[1].startDate}T00:00:00Z`).getUTCDay()).toBe(0);
    }
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
    const image = quote.imageData(7.2, 7.8, '2026-09-05', '/assets/philippines/icl-campus-hero.webp');
    expect(image.headingText).toBe('ICL4周报价');
    expect(image.heroSrc).toBe('/assets/philippines/icl-campus-hero.webp');
    expect(image.fullFeeDetails).toBeTrue();
    expect(image.hideAlumniBenefit).toBeTrue();
    expect(image.alumniBenefitItems).toEqual([]);
    expect(image.totalIncludedLabel).toBe('校方淡季价已计入');
    expect(image.finalConfirmationText).toBe('最终以学校书面确认的价格与空房为准。');
    expect(image.noteTitle).toBe('报价说明');
    const imageNotes = image.importantNotes ?? [];
    expect(imageNotes).toHaveSize(2);
    expect(imageNotes[0]).toContain('抵达前28天付清');
    expect(imageNotes[1]).toContain('周日');
    expect(imageNotes.join(' ')).not.toContain('淡季');
    expect(imageNotes).not.toEqual(jasmine.arrayContaining(quote.admissionRules));
    expect(image.localFeeNote).toBe(quote.imageLocalFeeIntro);
    expect(image.localFeeNote).not.toContain('22,900/33,200');
    expect(image.localFeeItems?.map(item => item.note)).toEqual(quote.localFees.map(item => item.note));
    expect(image.paymentItems.map(item => item.label)).toEqual(quote.schoolPaymentItems.map(item => item.label));
    expect(image.paymentItems.find(item => item.label === '校方淡季组合价调整')?.note).toContain('ICL三人房、四人房');
    expect(image.paymentItems.find(item => item.label === '校方免注册费')?.note).toContain('不叠加思达启航');
    expect(quote.schoolPaymentItems.find(item => item.label === '校方淡季组合价调整')?.note).toContain('同日期课程与校内住宿满4周');
    expect(JSON.stringify(image)).not.toMatch(/\bUSD\b|\bPHP\b|\bCNY\b/);
    expect(JSON.stringify(image)).not.toContain('老学员专属优惠');
  });

  it('uses each school campus image instead of the promotion poster', () => {
    const iu = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13');
    const icl = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    expect(iu.imageData(7.2, 7.8, undefined, '/assets/philippines/iu-campus-hero.webp').heroSrc)
      .toBe('/assets/philippines/iu-campus-hero.webp');
    expect(icl.imageData(7.2, 7.8, undefined, '/assets/philippines/icl-campus-hero.webp').heroSrc)
      .toBe('/assets/philippines/icl-campus-hero.webp');
  });

  it('adds every IELTS guarantee condition to the otherwise concise image notes', () => {
    const quote = new IuIclQuote('IU', 'ielts-guarantee-8', 'campus-triple', '2026-09-13');
    align(quote, 8, '2026-09-13');
    const image = quote.imageData(7.2, 7.8, undefined, '/assets/philippines/iu-campus-hero.webp');
    const imageNotes = image.importantNotes ?? [];
    expect(imageNotes).toHaveSize(7);
    expect(imageNotes).toEqual(jasmine.arrayContaining(IU_ICL_GUARANTEE_RULES));
  });

  it('keeps each student calculation independent in a group quote', () => {
    const first = new IuIclQuote('IU', 'power-speaking-4', 'campus-triple', '2026-09-13');
    const second = new IuIclQuote('IU', 'power-speaking-6', 'off-campus-double', '2026-09-13');
    expect(first.total).toBe(1150);
    expect(second.total).toBe(2050);

    const rows = iuIclGroupPaymentItems([first, second]);
    expect(rows.find(item => item.label === '注册费')?.amount).toBe('200 美元');
    expect(rows.some(item => item.label === '学生1 · 课程名称' && item.detailTitle === 'Power Speaking 4')).toBeTrue();
    expect(rows.some(item => item.label === '学生2 · 住宿名称' && item.detailTitle === '校外双人房')).toBeTrue();
    expect(rows.find(item => item.label === '校方淡季组合价调整')?.note).toContain('学生1适用');
    expect(rows.find(item => item.label === '校方免注册费')?.amount).toBe('− 100 美元');
  });

  it('aggregates matching local fees without losing student-specific visa rows', () => {
    const fourWeeks = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    const twelveWeeks = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    align(twelveWeeks, 12, '2026-10-04');
    const fees = iuIclGroupLocalFees([fourWeeks, twelveWeeks]);
    expect(fees.find(item => item.item === 'SSP特别学习许可')?.quantity).toBe(2);
    expect(fees.find(item => item.item === '学生2 · 第1次签证延长')?.total).toBe(5500);
    expect(fees.find(item => item.item === '学生2 · 第2次签证延长')?.total).toBe(6500);
  });

  it('builds an IU/ICL group image with student-labelled rows and summed totals', () => {
    const first = new IuIclQuote('ICL', 'power-speaking-4', 'campus-quad', '2026-10-04');
    const second = new IuIclQuote('ICL', 'ielts-guarantee-8', 'campus-triple', '2026-10-04');
    align(second, 8, '2026-10-04');
    const image = buildIuIclGroupImageData(
      [first, second], 7.2, 7.8, '2026-09-09', '/assets/philippines/icl-campus-hero.webp');
    expect(image.headingText).toBe('ICL 2人报价');
    expect(image.heroSrc).toBe('/assets/philippines/icl-campus-hero.webp');
    expect(image.totalUsd).toBe(`${(first.total + second.total).toLocaleString('en-US')} 美元`);
    expect(image.paymentItems.some(item => item.label.startsWith('学生1 · 课程名称'))).toBeTrue();
    expect(image.paymentItems.some(item => item.label.startsWith('学生2 · 课程名称'))).toBeTrue();
    expect(image.importantNotes).toEqual(jasmine.arrayContaining(IU_ICL_GUARANTEE_RULES));
    expect(JSON.stringify(image)).not.toContain('思达折扣');
  });
});
