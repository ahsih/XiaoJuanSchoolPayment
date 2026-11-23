// A&J ECO Campus on the shared Philippine school quote and plan comparison. A&J's own prices, offers and local
// fees are calculated here per student; PhSchoolQuote and PhPlanComparison only add students up and lay them out.
// Whole-room rooms (Suite for two, Studio for three or four, Villa for two to four) are priced once per room and
// shared by the students of a group quote who pick the same room and dates. Keep this file free of Angular, DOM
// and storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import type { CiaCourseContent, CiaLocalFeeRule, CiaPromotionRule, CiaRoomContent } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  ANJ_BIRTHDAY_DAY_ENDINGS_2026,
  ANJ_JUNIOR_COURSE_IDS,
  ANJ_LOW_SEASON_RULE_KIND,
  ANJ_PEAK_MINIMUM_WEEKS,
  ANJ_PROMOTION_IDS,
  ANJ_REGULAR_RULE_KIND,
  ANJ_TEST_BOOK_COURSE_IDS,
} from './anj-content-config';

export const ANJ_QUOTE_IMAGE_HERO = '/assets/anj/campus/main-building.webp';
const DAY = 86400000;

/** Everything A&J's quote reads; the page component is one. */
export interface AnjQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** Content rows with A&J-only fields: allowed weeks, whole-room occupancy, utility fee and deposit. */
  anjCourses: CiaCourseContent[];
  anjRooms: CiaRoomContent[];
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const ANJ_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL课程', courseIds: ['eco-relax-lite', 'eco-relax-plus', 'eco-hub', 'eco-sparta'] },
  { id: 'test', label: '考试课程', courseIds: ['test-ielts', 'test-course', 'ielts-guarantee', 'toeic-guarantee'] },
  { id: 'junior', label: '青少年课程', courseIds: [...ANJ_JUNIOR_COURSE_IDS] },
] as const;

/** Price ratio of a 1–3 week stay (40/65/90%); four weeks and longer are proportional. */
export const anjPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const money = (value: number): number => Math.round(value * 100) / 100;

/** A week counts as peak when its class days (Monday to Friday) touch the range; a Sunday-to-Saturday range ends on Saturday. */
const studyWeekTouches = (weekStart: number, range: { start: string; end: string }): boolean =>
  weekStart + DAY <= parseDay(range.end) && weekStart + 5 * DAY >= parseDay(range.start);

interface AnjChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const MONTH_OPTIONS = [{ value: 0, label: '未填写' }, ...Array.from({ length: 12 }, (_, index) => ({ value: index + 1, label: `${index + 1}月` }))];
const DAY_OPTIONS = [{ value: 0, label: '未填写' }, ...Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: `${index + 1}日` }))];

/** One A&J student: plan, conditions and every amount the template and quote image show. */
export class AnjPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly extraChoices: readonly PhExtraChoice[];
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  birthMonth = 0;
  birthDay = 0;
  pickup = true;

  constructor(
    private readonly pricing: AnjQuotePricing,
    /** The students this one is quoted with; whole rooms are shared among them. A single quote has only itself. */
    private readonly householdOf: (student: AnjPageStudent) => readonly AnjPageStudent[] = student => [student],
  ) {
    const student = this;
    this.quotePlan = new SchoolQuotePlan(
      'eco-hub', 'deluxe-triple', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => kind === 'course' ? student.coursePrice(row) : student.roomPrice(row),
    );
    const birthMonth: AnjChoice<number> = {
      label: '出生月份（生日优惠）',
      options: MONTH_OPTIONS,
      visible: true,
      get note() { return student.birthdayNote; },
      get value() { return student.birthMonth; },
      set value(value: number) { student.birthMonth = value; },
    };
    const birthDay: AnjChoice<number> = {
      label: '出生日期（生日优惠）',
      options: DAY_OPTIONS,
      get visible() { return student.courseStart < '2027-01-01'; },
      note: '',
      get value() { return student.birthDay; },
      set value(value: number) { student.birthDay = value; },
    };
    const pickup: AnjChoice<boolean> = {
      label: 'BESA周日团体接机',
      options: [{ value: true, label: '需要（3,000比索）' }, { value: false, label: '不需要' }],
      visible: true,
      note: '',
      get value() { return student.pickup; },
      set value(value: boolean) { student.pickup = value; },
    };
    this.extraChoices = [birthMonth, birthDay, pickup];
  }

  // ---- catalogue ---------------------------------------------------------------------------------

  private courseContent(id: string): CiaCourseContent | undefined { return this.pricing.anjCourses.find(item => item.id === id); }
  private roomContent(id: string): CiaRoomContent | undefined { return this.pricing.anjRooms.find(item => item.id === id); }
  /** People sharing one whole room (2–4); 1 for rooms priced per person. */
  occupancy(roomId: string): number {
    const room = this.roomContent(roomId);
    return room?.priceMode === 'per-room' ? Math.max(1, room.minOccupancy ?? 1) : 1;
  }
  private weeksOfCourse(id: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
  }

  /** The plan scales this 1–4 week price to the row; guarantee courses spread their whole-course price. */
  private coursePrice(row: QuotePlanRow): number {
    const course = this.pricing.courseFees.find(item => item.id === row.optionId);
    if (!course) return 0;
    const total = this.weeksOfCourse(row.optionId);
    const whole = course.feeByWeeks?.[String(total)];
    if (whole !== undefined && total > 0) return whole * row.weeks / total;
    return course.tuition2027 * anjPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
  }

  private roomPrice(row: QuotePlanRow): number {
    const fee = this.pricing.roomFees.find(item => item.id === row.optionId)?.fee ?? 0;
    return fee * anjPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios) / this.occupancy(row.optionId);
  }

  // ---- checks ------------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    const course = this.courseContent(courseId);
    return course?.minimumWeeks ?? (course?.allowedWeeks?.length ? Math.min(...course.allowedWeeks) : 0);
  }

  /** Guarantee and Working Holiday courses run only for the listed lengths (all rows of the course together). */
  get courseLengthError(): string {
    for (const id of new Set(this.quotePlan.courses.map(row => row.optionId))) {
      const course = this.courseContent(id);
      const allowed = course?.allowedWeeks;
      const weeks = this.weeksOfCourse(id);
      if (course && allowed?.length && !allowed.includes(weeks)) return `${course.name}只能报${allowed.join('、')}周，请调整周数。`;
    }
    return '';
  }

  get household(): readonly AnjPageStudent[] { return this.householdOf(this); }

  /** The room type this student sleeps in during the week starting on this Sunday. */
  roomAt(weekStart: number): string | undefined {
    return this.quotePlan.rooms.find(row => this.quotePlan.weekStarts([row]).includes(weekStart))?.optionId;
  }

  /** A whole room needs exactly its number of people (or a multiple, for several such rooms) on the same weeks. */
  private get wholeRoomError(): string {
    for (const row of this.quotePlan.rooms) {
      const occupancy = this.occupancy(row.optionId);
      if (occupancy < 2) continue;
      const name = this.pricing.roomFees.find(item => item.id === row.optionId)?.name ?? '';
      const shared = this.quotePlan.weekStarts([row]).every(start => {
        const count = this.household.filter(member => member.roomAt(start) === row.optionId).length;
        return count > 0 && count % occupancy === 0;
      });
      if (!shared) return `${name}按整间计价，请用多人报价，由同住的${occupancy}人选同一房型和相同日期。`;
    }
    return '';
  }

  private get courseRuleError(): string {
    const junior = this.quotePlan.courses.some(row => ANJ_JUNIOR_COURSE_IDS.includes(row.optionId));
    if (junior && this.selectedAgeGroup === 'adult') return '青少年课程只收4–16岁的学生，成人请选其他课程。';
    if (this.peak.weeks > 0 && this.quotePlan.courseWeeks < ANJ_PEAK_MINIMUM_WEEKS) {
      return `暑期旺季期间入学至少报名${ANJ_PEAK_MINIMUM_WEEKS}周，请调整周数。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.courseRuleError || this.wholeRoomError;
  }

  // ---- offers ------------------------------------------------------------------------------------

  get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).filter(value => this.quotePlan.date(value) !== null).sort()[0]
      ?? this.quotePlan.startDate;
  }

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private arrivalMatches(rule: CiaPromotionRule): boolean {
    const start = this.courseStart;
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    return (!rule.arrivalStart || start >= rule.arrivalStart) && (!rule.arrivalEnd || start <= rule.arrivalEnd);
  }

  /** Regular offer: the tier for the largest multiple of 4 course weeks (up to 24). */
  private get regular(): { rule: CiaPromotionRule; amount: number } | undefined {
    const tier = Math.min(24, Math.floor(this.quotePlan.courseWeeks / 4) * 4);
    for (const rule of this.pricing.promotions.filter(item => item.ruleKind === ANJ_REGULAR_RULE_KIND && this.arrivalMatches(item))) {
      const amount = rule.discountTiers?.[String(tier)] ?? 0;
      if (amount > 0) return { rule, amount };
    }
    return undefined;
  }

  /** Course weeks outside the summer peak; low-season offers count complete 4-week blocks of them. */
  private get offPeakCourseWeeks(): number {
    const ranges = this.pricing.peakSeasonRanges.filter(range => range.enabled !== false);
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(start => !ranges.some(range => studyWeekTouches(start, range))).length;
  }

  private get lowSeason(): { rule: CiaPromotionRule; amount: number; blocks: number } | undefined {
    const blocks = Math.floor(this.offPeakCourseWeeks / 4);
    for (const rule of this.pricing.promotions.filter(item => item.ruleKind === ANJ_LOW_SEASON_RULE_KIND && this.arrivalMatches(item))) {
      const amount = blocks * (rule.incrementValue ?? 0);
      if (amount > 0) return { rule, amount, blocks };
    }
    return undefined;
  }

  /** 2026 arrivals: the last digit of the birth day by arrival quarter; from 2027 the birth month equals the arrival month. */
  get birthdayEligible(): boolean {
    const rule = this.rule(ANJ_PROMOTION_IDS.birthday);
    if (!rule || !this.arrivalMatches(rule) || this.quotePlan.courseWeeks < rule.minimumCourseWeeks || !this.birthMonth) return false;
    const start = this.courseStart;
    const arrivalMonth = Number(start.slice(5, 7));
    if (start < '2027-01-01') {
      return !!this.birthDay && (ANJ_BIRTHDAY_DAY_ENDINGS_2026[arrivalMonth] ?? []).includes(this.birthDay % 10);
    }
    return this.birthMonth === arrivalMonth;
  }

  private get birthdayNote(): string {
    const start = this.courseStart;
    const month = Number(start.slice(5, 7));
    const rule = start < '2027-01-01'
      ? `${month}月入学：出生日期尾数是${(ANJ_BIRTHDAY_DAY_ENDINGS_2026[month] ?? []).join('、')}的学生减100美元`
      : `${month}月入学：${month}月出生的学生减100美元`;
    return `${rule}；课程至少4周，入学时提交生日证明。${this.birthdayEligible ? '本次符合。' : ''}`;
  }

  /** The IELTS course for 12 weeks or more brings one free official IELTS test (non-cash). */
  get ieltsExamGift(): CiaPromotionRule | undefined {
    const rule = this.rule(ANJ_PROMOTION_IDS.ieltsExam);
    if (!rule || !this.arrivalMatches(rule)) return undefined;
    const weeks = (rule.eligibleCourseIds ?? []).reduce((sum, id) => sum + this.weeksOfCourse(id), 0);
    return weeks >= rule.minimumCourseWeeks ? rule : undefined;
  }

  /** 思达启航95折 on the full tuition and room price, before the school offers (A&J's files give no order). */
  get sidaDiscount(): number {
    const rule = this.rule(ANJ_PROMOTION_IDS.sida);
    return rule ? money((this.tuition + this.accommodation) * rule.discountValue / 100) : 0;
  }

  private get schoolOffers(): Array<{ rule: CiaPromotionRule; amount: number; icon: string; note: string }> {
    const regular = this.regular;
    const low = this.lowSeason;
    const birthday = this.birthdayEligible ? this.rule(ANJ_PROMOTION_IDS.birthday) : undefined;
    const withWeeks = (description: string, weeks: number) => `${description.replace(/[。；\s]+$/, '')}；本次按${weeks}周计算。`;
    return [
      ...(regular ? [{ ...regular, icon: '惠', note: withWeeks(regular.rule.description, this.quotePlan.courseWeeks) }] : []),
      ...(low ? [{ rule: low.rule, amount: low.amount, icon: '淡', note: withWeeks(low.rule.description, low.blocks * 4) }] : []),
      ...(birthday ? [{ rule: birthday, amount: birthday.discountValue, icon: '生', note: birthday.description }] : []),
    ];
  }

  get promotionDiscountTotal(): number {
    const offers = this.schoolOffers.reduce((sum, item) => sum + item.amount, 0);
    return money(Math.min(this.tuition + this.accommodation, this.sidaDiscount + offers));
  }

  get discountNames(): string {
    const sida = this.sidaDiscount > 0 ? this.rule(ANJ_PROMOTION_IDS.sida)?.name : '';
    return [...new Set([sida, ...this.schoolOffers.map(item => item.rule.name)].filter(Boolean))].join('、');
  }

  // ---- school payment ----------------------------------------------------------------------------

  /** Every student registered through 思达启航 is free of the registration fee, and returning students always are. */
  get registration(): number {
    return this.returningStudent || this.rule(ANJ_PROMOTION_IDS.registration) ? 0 : this.pricing.registrationFee;
  }
  get registrationWaiverName(): string | undefined {
    return this.rule(ANJ_PROMOTION_IDS.registration) ? '思达启航' : undefined;
  }
  get tuition(): number { return money(this.quotePlan.total('course')); }
  get accommodation(): number { return money(this.quotePlan.total('room')); }

  /** Summer peak (BESA): 40 dollars a week through 2026, 60 from 2027; course and room weeks count once. */
  private get peak() {
    const ranges = this.pricing.peakSeasonRanges.filter(range => range.enabled !== false);
    const weeks = this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms])
      .filter(start => ranges.some(range => studyWeekTouches(start, range)));
    return calculateAssociationPeakSurcharge('ANJ', weeks, ranges, this.pricing.seasonalFeePerWeek);
  }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }

  get quoteUsd(): number {
    return Math.max(0, money(this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const sida = this.rule(ANJ_PROMOTION_IDS.sida);
    const gift = this.ieltsExamGift;
    return [
      ...(sida && this.sidaDiscount ? [{ icon: '折', label: sida.name, value: -this.sidaDiscount, note: sida.description, promotionKey: sida.id }] : []),
      ...this.schoolOffers.map(item => ({ icon: item.icon, label: item.rule.name, value: -item.amount, note: item.note, promotionKey: item.rule.id })),
      ...(gift ? [{ icon: '赠', label: gift.name, value: 0, note: `${gift.description.replace(/[。；\s]+$/, '')}；非现金优惠。`, promotionKey: gift.id }] : []),
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '暑期旺季附加费', value: this.seasonalSurcharge,
        note: `学习周与暑期旺季重叠：${associationPeakBreakdownText(this.peak)}；不参与折扣`,
        promotionKey: 'anj-peak',
      }] : []),
    ];
  }

  // ---- conditions --------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁须填家长同意书。16岁以上可报ESL课程，17岁以上可报考试课程；年龄更小请选青少年课程（4–16岁）。';
  }

  // ---- local fees --------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** 30-day entry: one extension from week 5, then one per 4 weeks; 59-day entry: from week 9. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const free = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - free) / 4));
  }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  /** A room-based fee for this student's room weeks; a whole room's fee is shared by its occupants. */
  private roomFeeShare(perFourWeeks: (room: CiaRoomContent | undefined) => number): { total: number; rates: number[] } {
    let total = 0;
    const rates: number[] = [];
    for (const row of this.quotePlan.rooms) {
      const rate = perFourWeeks(this.roomContent(row.optionId));
      rates.push(rate);
      total += rate * row.weeks / 4 / this.occupancy(row.optionId);
    }
    return { total: money(total), rates };
  }

  /** The refundable deposit for this student: the largest of their rooms, shared in a whole room. */
  get depositShare(): number {
    const fallback = this.feeRule('deposit');
    return Math.max(0, ...this.quotePlan.rooms.map(row => {
      const room = this.roomContent(row.optionId);
      const amount = room?.deposit ?? (room?.waterGroup === 'Deluxe' ? fallback?.amount : fallback?.secondaryAmount) ?? 0;
      return amount / this.occupancy(row.optionId);
    }));
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, options: { note?: string; total?: number; unit?: string; visa?: boolean } = {}): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const waived = !!options.visa && longTerm;
      const unit = options.unit ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{
        item: rule.name, unitLabel: unit,
        quantity: waived ? 0 : quantity,
        total: waived ? 0 : options.total ?? rule.amount * quantity,
        note: waived ? longTermNote : options.note ?? rule.note,
        ...(waived ? { waived: true } : {}),
      }];
    };
    const visaRule = this.feeRule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaFirst = visaRule ? ((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount) : 0;
    const extensions = this.visaExtensionCount;
    const visaNote = `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const utilityRule = this.feeRule('utility');
    const maintenanceRule = this.feeRule('maintenance');
    const utility = this.roomFeeShare(room => room?.waterFee4w ?? utilityRule?.amount ?? 0);
    const maintenance = this.roomFeeShare(room => room?.waterGroup === 'Deluxe' || !room
      ? maintenanceRule?.amount ?? 0 : maintenanceRule?.secondaryAmount ?? maintenanceRule?.amount ?? 0);
    const unitOf = (rates: number[], fallback: number) => {
      const unique = [...new Set(rates)];
      return unique.length === 1 ? `${formatPhp(unique[0])}／4周` : unique.length ? '按房型／4周' : `${formatPhp(fallback)}／4周`;
    };
    const roomPeriods = Math.round(plan.roomWeeks / 4 * 100) / 100;
    const testWeeks = plan.courses.filter(row => ANJ_TEST_BOOK_COURSE_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
    const eslWeeks = plan.courseWeeks - testWeeks;
    const stayDays = plan.stayWeeks * 7;
    return [
      ...create('ssp', 1, { visa: true }),
      ...create('ssp-e-card', 1, { visa: true }),
      ...create('visa-extension', extensions, { visa: true, note: visaNote, total: visaAmounts.reduce((sum, amount) => sum + amount, 0), unit: `${formatPhp(visaFirst)}起／次` }),
      ...create('acr-i-card', stayDays > 59 ? 1 : 0, { visa: true, total: 0 }),
      ...create('utility', roomPeriods, { total: utility.total, unit: unitOf(utility.rates, utilityRule?.amount ?? 0) }),
      ...create('maintenance', roomPeriods, { total: maintenance.total, unit: unitOf(maintenance.rates, maintenanceRule?.amount ?? 0) }),
      ...(eslWeeks ? create('books-esl', Math.ceil(eslWeeks / 4)) : []),
      ...(testWeeks ? create('books-test', Math.ceil(testWeeks / 4)) : []),
      ...create('academy-id', 1),
      ...(this.pickup ? create('besa-pickup', 1) : []),
    ];
  }
}

/** Reference rows below the local fees, outside every total: the refundable deposit and laundry. */
function anjOptionalFees(students: readonly AnjPageStudent[], pricing: AnjQuotePricing): PhOptionalFeeItem[] {
  const phpPerCny = pricing.phpPerCny;
  const cny = (value: number) => Number.isFinite(phpPerCny) && phpPerCny > 0 ? quoteCurrencyText(Math.round(value / phpPerCny), 'zh-CN') : '—';
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.id === 'deposit') {
        const total = Math.round(students.reduce((sum, student) => sum + student.depositShare, 0));
        return {
          label: rule.name, amount: formatPhp(total), cnyAmount: `约人民币 ${cny(total)} 元`,
          note: `Deluxe ${formatPhp(rule.amount)}，Premium、套房、Studio和别墅${formatPhp(rule.secondaryAmount ?? rule.amount)}；${rule.note}${students.length > 1 ? `（${students.length}人）` : ''}`,
        };
      }
      return { label: rule.name, amount: `${formatPhp(rule.amount)}起`, cnyAmount: '按实际使用付费', note: rule.note };
    });
}

export class AnjQuote extends PhSchoolQuote<AnjPageStudent> {
  constructor(pricing: AnjQuotePricing) {
    const holder: { quote?: AnjQuote } = {};
    super(pricing, {
      createStudent: () => new AnjPageStudent(pricing, student => {
        const group = holder.quote?.activeStudents ?? [];
        return group.includes(student) ? group : [student];
      }),
      headingPrefix: 'A&J',
      image: { schoolCode: 'ANJ', schoolName: '菲律宾碧瑶A&J语言学校', filePrefix: 'AnJ', heroSrc: ANJ_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => anjPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => anjOptionalFees(students, pricing),
      layoutVersion: 2,
    });
    holder.quote = this;
  }

  /** The free official IELTS test is a non-cash gift, so its row says 赠送 instead of “0 美元”. */
  override get schoolPaymentItems() { return super.schoolPaymentItems.map(giftAmount); }
  override get quoteImageData() {
    const data = super.quoteImageData;
    return { ...data, paymentItems: data.paymentItems.map(giftAmount) };
  }
}

const giftAmount = <T extends { icon: string; amount: string; accent?: boolean }>(item: T): T =>
  item.icon === '赠' ? { ...item, amount: '赠送', accent: false } : item;

/** The comparison prices one person, so it leaves out the whole rooms shared by two to four people. */
const onePersonRooms = (pricing: AnjQuotePricing): AnjQuotePricing => new Proxy(pricing, {
  get: (target, key) => key === 'roomFees'
    ? target.roomFees.filter(room => target.anjRooms.find(item => item.id === room.id)?.priceMode !== 'per-room')
    : Reflect.get(target, key),
});

export class AnjPlanComparison extends PhPlanComparison<AnjPageStudent> {
  constructor(page: AnjQuotePricing, conditions: () => AnjPageStudent) {
    const pricing = onePersonRooms(page);
    super(pricing, conditions, {
      createStudent: () => new AnjPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.birthMonth = from.birthMonth;
        to.birthDay = from.birthDay;
        to.pickup = from.pickup;
      },
      heading: 'A&J 方案对比报价',
      courseGroups: ANJ_COMPARE_COURSE_GROUPS,
      peakRate: () => 60,
      extraNotes: () => ['套房、Studio和别墅多人入住按整间计价，请用多人报价计算。'],
      layoutVersion: 2,
    });
  }
}
