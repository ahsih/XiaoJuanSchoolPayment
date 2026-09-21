import { cloneLaMerContentConfig, createDefaultLaMerContentConfig, isLaMerSchool } from './la-mer-content-config';
import { LaMerFamilyQuote, LaMerStudentQuote, laMerLocalFees } from './la-mer-quote';
import { buildLaMerQuoteImage, LA_MER_FALLBACK_RATES } from './la-mer-quote-image';

describe('La Mer source-grounded quote rules', () => {
  let c: ReturnType<typeof createDefaultLaMerContentConfig>, student: LaMerStudentQuote, family: LaMerFamilyQuote;
  beforeEach(() => { c = createDefaultLaMerContentConfig(); student = new LaMerStudentQuote(() => c); family = new LaMerFamilyQuote(() => c); });
  const sumFees = (rows: { total: number }[]) => rows.reduce((n, r) => n + r.total, 0);
  it('keeps campus identity separate from EV main', () => { expect(isLaMerSchool('EV Academy La Mer')).toBeTrue(); expect(isLaMerSchool('EV La Mer')).toBeTrue(); expect(isLaMerSchool('EV Academy')).toBeFalse(); });
  [ [1, 792, 804.9], [2, 1287, 1227.65], [3, 1683, 1556.35], [4, 1980, 1791], [8, 3960, 3482] ].forEach(([weeks, original, total]) => {
    it(`calculates ${weeks} ordinary weeks without a duplicate registration`, () => {
      student.plan.updateWeeks('course', 1, weeks);
      expect(student.result.error).toBe(''); expect(student.result.original).toBe(original); expect(student.result.total).toBeCloseTo(total, 2);
      expect(student.result.paymentLines.filter(p => p.icon === '注').length).toBe(1);
    });
  });
  it('prices short course segments at the four-week tier when this student studies four weeks', () => {
    student.plan.updateWeeks('course', 1, 2); student.plan.add('course'); student.plan.updateWeeks('course', student.plan.courses[1].id, 2);
    student.plan.courses[1].optionId = 'power-speaking-8';
    expect(student.plan.rooms.length).toBe(1); expect(student.plan.error).toBe(''); expect(student.plan.total('course')).toBe(1115);
    expect(student.plan.total('room')).toBe(1050);
  });
  it('supports one course and multiple continuous room selections', () => {
    student.plan.updateWeeks('room', 2, 1); student.plan.add('room'); student.plan.updateWeeks('room', student.plan.rooms[1].id, 3);
    student.plan.rooms[1].optionId = 'single';
    expect(student.plan.courses.length).toBe(1); expect(student.plan.courseWeeks).toBe(4); expect(student.plan.total('room')).toBe(1575); expect(student.plan.error).toBe('');
  });
  it('synchronizes dates and coverage while preserving choices', () => {
    student.plan.add('course'); student.plan.courses[1].optionId = 'senior';
    student.plan.updateStartDate('room', 2, '2026-10-04');
    expect(student.plan.courses.map(r => r.startDate)).toEqual(['2026-10-04', '2026-11-01']);
    expect(student.plan.courses[1].optionId).toBe('senior');
    student.plan.remove('course', student.plan.courses[1].id); expect(student.plan.roomWeeks).toBe(4); expect(student.plan.endDate).toBe('2026-10-31');
    expect(student.plan.error).toBe('');
  });
  ['2026-09-21', '2026-02-30', ''].forEach(date => it(`rejects invalid/non-Sunday arrival ${date}`, () => {
    student.plan.courses[0].startDate = date; expect(student.result.error).not.toBe(''); family.start = date; expect(family.error).not.toBe('');
  }));
  it('rejects gaps, overlaps and different course/room coverage', () => {
    student.plan.add('course'); student.plan.courses[1].startDate = '2026-11-01'; expect(student.plan.error).toContain('连续');
    student.plan.courses[1].startDate = '2026-09-20'; expect(student.plan.error).toContain('重叠');
    student.plan.courses[1].startDate = '2026-10-18'; student.plan.rooms[0].weeks = 4; expect(student.plan.error).toContain('相同日期');
  });
  [ ['2026-08-16', 0], ['2026-08-23', 200], ['2026-12-27', 200], ['2027-01-03', 0] ].forEach(([start, discount]) => it(`uses the first Monday for promotion boundary ${start}`, () => {
    student.plan.updateStartDate('course', 1, String(start)); expect(student.result.schoolDiscount).toBe(Number(discount));
  }));
  it('does not combine students weeks, promotion eligibility or visa conditions', () => {
    student.plan.updateWeeks('course', 1, 2);
    const other = new LaMerStudentQuote(() => c, '2027-01-03'); other.plan.updateWeeks('course', 1, 8); other.visa = '59';
    expect(student.result.original).toBe(1287); expect(student.result.schoolDiscount).toBe(100);
    expect(other.result.schoolDiscount).toBe(0); expect(sumFees(other.result.localFees)).toBe(23200);
    expect(buildLaMerQuoteImage(c, [student, other], null, LA_MER_FALLBACK_RATES).headingText).toBe('EV La Mer 2人报价');
  });
  it('reconciles the official four-week local fee total without hiding deposits or pickup', () => {
    const f = student.result; expect(sumFees(f.localFees)).toBe(18000); expect(f.deposit).toBe(3000); expect(f.pickup).toBe(1200);
    expect(sumFees(f.localFees) + f.deposit + f.pickup).toBe(22200); expect(f.references.join('')).toContain('150–500');
  });
  it('uses school cumulative visa columns and the nine-week ACR boundary', () => {
    expect(sumFees(laMerLocalFees(c, 8, '30').localFees.filter(f => f.item === '签证续签'))).toBe(5430);
    expect(sumFees(laMerLocalFees(c, 12, '30').localFees.filter(f => f.item === '签证续签'))).toBe(11830);
    expect(sumFees(laMerLocalFees(c, 12, '59').localFees.filter(f => f.item === '59天签证续签'))).toBe(6700);
    expect(laMerLocalFees(c, 8, '30').localFees.find(f => f.item === 'ACR I-CARD')!.total).toBe(0);
    expect(laMerLocalFees(c, 9, '59').localFees.find(f => f.item === 'ACR I-CARD')!.total).toBe(4000);
  });
  it('uses the newer family price starting in 2026 and applies both confirmed discounts', () => {
    const r = family.result; expect(family.version?.id).toBe('family-2027'); expect(r.error).toBe(''); expect(r.original).toBe(4400);
    expect(r.schoolDiscount).toBe(400); expect(r.sidaDiscount).toBe(200); expect(r.total).toBe(3800);
    expect(r.bookingDeposit).toBe(1000); expect(r.balance).toBe(2800); expect(r.deposit).toBe(6000); expect(sumFees(r.localFees)).toBe(0);
    expect(r.included).toContain('SSP特殊学习许可证'); expect(r.included).toContain('机场接机');
  });
  [ [1, 1760], [2, 2860], [3, 3740], [4, 4400], [6, 6400], [8, 8400] ].forEach(([weeks, price]) => it(`retains exact ${weeks}-week whole-family price`, () => {
    family.weeks = weeks; expect(family.result.error).toBe(''); expect(family.result.original).toBe(price);
  }));
  it('includes guardians and children equally in 3/4-person promotion and deposit', () => {
    family.setPeople(3); family.guardians = 2;
    expect(family.result.error).toBe(''); expect(family.result.schoolDiscount).toBe(600); expect(family.result.bookingDeposit).toBe(1500);
    family.setPeople(4); expect(family.result.error).toBe(''); expect(family.result.schoolDiscount).toBe(800); expect(family.result.bookingDeposit).toBe(2000);
    expect(family.result.deposit).toBe(12000);
  });
  it('retains Sida discount on a peak family package without school cash promotion', () => {
    family.start = '2027-01-03'; expect(family.result.original).toBe(5200); expect(family.result.schoolDiscount).toBe(0); expect(family.result.total).toBe(4940);
  });
  it('uses old family version before the newer effective date', () => {
    family.start = '2026-05-03'; expect(family.version?.id).toBe('family-2026'); expect(family.result.original).toBe(5100); expect(family.result.total).toBe(4845);
  });
  it('blocks unpublished combinations, ages, weeks and cross-period prices', () => {
    family.weeks = 5; expect(family.error).toContain('未公布'); family.weeks = 4;
    family.start = '2026-12-20'; expect(family.error).toContain('跨淡旺季');
    family.start = '2026-08-16'; expect(family.error).toContain('价格版本');
    family.start = '2027-12-12'; expect(family.error).toContain('有效期');
    family.start = '2026-09-20'; family.childAges[0] = 6; expect(family.error).toContain('年龄');
    family.childAges[0] = 8; family.guardians = 2; expect(family.error).toContain('至少');
  });
  it('adds family visa extensions per member and refundable deposit outside the package', () => {
    family.weeks = 8; family.visas[1] = '59'; expect(sumFees(family.result.localFees)).toBe(5430);
    expect(family.result.deposit).toBe(6000); expect(family.result.original).toBe(8400); expect(family.result.total).toBe(7220);
  });
  it('keeps image and calculator amounts, deposits and exact conversion rates consistent', () => {
    const image = buildLaMerQuoteImage(c, [student], family, { usdToCny: 6.912345, phpPerCny: 8.123456, date: '2026-09-18', source: '测试汇率' });
    expect(image.totalUsd).toBe('3,800 美元'); expect(image.conversionRates!.usdToCny).toBe(6.912345);
    expect(image.optionalFeeItems!.find(i => i.label === '抵扣订金后的套餐余款')!.amount).toBe('2,800 美元');
    expect(JSON.stringify(image)).not.toContain('实时汇率'); expect(image.paymentItems.filter(i => i.icon === '注').length).toBe(0);
  });
  it('respects published configuration including explicit empty values', () => {
    c.courses[0].tuition = 1000; c.quoteSettings.laMer!.familyVersions[1].packages.find(p => p.id === 'double' && p.season === 'off')!.prices['4'] = 4600;
    c.quoteImageSettings.footerNotes = []; c.laMerPage!.gallery = []; c.quoteSettings.promotions[1].discountValue = 10;
    c = cloneLaMerContentConfig(c);
    expect(student.result.total).toBe(1765); expect(family.result.total).toBe(3780); expect(c.laMerPage!.gallery).toEqual([]); expect(c.quoteImageSettings.footerNotes).toEqual([]);
  });
  it('uses edited registration and independent promotion explanations in real image data', () => {
    c.quoteImageSettings.paymentNotes.registration = '已审核的报名说明';
    c.quoteImageSettings.paymentNotes.promotion = '优惠补充说明';
    c.quoteImageSettings.promotionNotes = { 'lamer-school-2026': '学校优惠专属说明' };
    const image = buildLaMerQuoteImage(c, [student], null, LA_MER_FALLBACK_RATES);
    expect(image.paymentItems.find(p => p.icon === '注')!.note).toBe('已审核的报名说明');
    expect(image.paymentItems.filter(p => p.promotionKey).every(p => p.note?.includes('优惠补充说明'))).toBeTrue();
    expect(image.paymentItems.find(p => p.promotionKey === 'lamer-school-2026')!.note).toContain('学校优惠专属说明');
    c.quoteImageSettings.paymentNotes.registration = '';
    expect(buildLaMerQuoteImage(c, [student], null, LA_MER_FALLBACK_RATES).paymentItems.find(p => p.icon === '注')!.note).toBe('');
  });
  it('blocks incomplete or negative published amounts instead of exporting a free quote', () => {
    c.courses[0].tuition = NaN; expect(student.result.error).not.toBe('');
    c.courses[0].tuition = 930; c.quoteSettings.registrationFee = -1; expect(student.result.error).not.toBe('');
    c.quoteSettings.registrationFee = 100; c.quoteSettings.promotions[1].discountValue = 101;
    expect(student.result.error).not.toBe(''); expect(family.error).not.toBe('');
    c.quoteSettings.promotions[1].discountValue = 5;
    c.quoteSettings.laMer!.familyVersions[1].packages.find(p => p.id === 'double' && p.season === 'off')!.prices['4'] = 0;
    expect(family.error).toContain('未公布');
  });
  it('uses published family inclusion changes without multiplying shared pickup', () => {
    c.quoteSettings.laMer!.familyIncludedFeeIds = c.quoteSettings.laMer!.familyIncludedFeeIds.filter(id => id !== 'pickup');
    c.localFees.find(f => f.id === 'pickup')!.amount = 1300;
    family.setPeople(4);
    const image = buildLaMerQuoteImage(c, [], family, LA_MER_FALLBACK_RATES);
    expect(family.result.pickup).toBe(1300);
    expect(image.optionalFeeItems!.find(f => f.label === '机场接机')!.amount).toBe('1,300 比索／参考');
    expect(family.result.included).not.toContain('机场接机');
  });
  it('preserves published peak family prices at exact Sunday/Saturday boundaries', () => {
    family.start = '2027-02-21'; family.weeks = 1; expect(family.error).toBe(''); expect(family.result.original).toBe(2080);
    family.start = '2027-02-28'; expect(family.error).toBe(''); expect(family.result.original).toBe(1760);
    family.start = '2027-06-27'; expect(family.error).toBe(''); expect(family.result.original).toBe(2080);
  });
});
