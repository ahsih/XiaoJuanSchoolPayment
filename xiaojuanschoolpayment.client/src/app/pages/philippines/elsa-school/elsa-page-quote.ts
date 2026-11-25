// ELSA on the shared Philippine school quote and plan comparison. ELSA's own prices, offers, age rules and local
// fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up and
// lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program can bundle
// it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  ELSA_ADULT_COURSE_IDS,
  ELSA_ADULT_OFF_SEASON_RULE_ID,
  ELSA_GUARDIAN_COURSE_IDS,
  ELSA_GUARDIAN_STAY_ID,
  ELSA_GUARDIAN_STAY_ROOM_IDS,
  ELSA_KIDS_COURSE_IDS,
  ELSA_KIDS_OFF_SEASON_RULE_ID,
  ELSA_OFF_SEASON_2026,
  ELSA_RETURNING_RULE_ID,
  ELSA_SCHOOLING_IDS,
  ELSA_SIDA_RULE_ID,
} from './elsa-content-config';
import { ELSA_QUOTE_IMAGE_HERO } from './elsa-page-content';

const DAY = 86400000;

/** Everything ELSA's quote reads; the page component is one. */
export interface ElsaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const ELSA_COMPARE_COURSE_GROUPS = [
  { id: 'adult', label: '成人ESL', courseIds: ['general', 'intensive', 'super-intensive', 'basic', 'super-basic'] },
  { id: 'guardian', label: '家长课程', courseIds: ['guardian-relax', 'guardian-esl', 'guardian-group', 'guardian-golf'] },
  { id: 'kids', label: '孩子课程', courseIds: ['junior-esl', 'schooling-half', 'schooling-all'] },
] as const;

/** ELSA prices every week proportionally to the four-week price (the school's price list has no short-stay rates). */
export const elsaPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const roundCents = (value: number): number => Math.round(value * 100) / 100;
const isoDate = (value: number): string => new Date(value).toISOString().slice(0, 10);

/** Whether a whole week (Sunday to Saturday) starting on `start` lies inside the 2026 off-season. */
const inOffSeason = (start: number): boolean =>
  isoDate(start) >= ELSA_OFF_SEASON_2026.start && isoDate(start + 6 * DAY) <= ELSA_OFF_SEASON_2026.end;

/** Uniform and copy costs of the two schooling courses (pre-departure guide, October 2026). */
const SCHOOLING_UNIFORM = { 'schooling-all': 4000, 'schooling-half': 1885 } as Record<string, number>;
const SCHOOLING_COPIES = { 'schooling-all': 1500, 'schooling-half': 700 } as Record<string, number>;

/** One ELSA student: plan, conditions and every amount the template and quote image show. */
export class ElsaPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: ElsaQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'general', 'room-2', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * elsaPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  // ---- who studies what ---------------------------------------------------------------------------

  private hasCourse(ids: readonly string[]): boolean {
    return this.quotePlan.courses.some(row => ids.includes(row.optionId));
  }

  /** A parent who only stays (no classes); the whole plan must be that course. */
  get guardianStay(): boolean {
    return this.quotePlan.courses.length > 0 && this.quotePlan.courses.every(row => row.optionId === ELSA_GUARDIAN_STAY_ID);
  }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  get courseLengthError(): string {
    const plan = this.quotePlan;
    if (this.hasCourse([ELSA_GUARDIAN_STAY_ID]) && !this.guardianStay) {
      return '家长陪读（不上课）不能和其他课程拆分组合，请分开报价。';
    }
    if (this.selectedAgeGroup === 'minor' && this.hasCourse([...ELSA_GUARDIAN_COURSE_IDS, ELSA_GUARDIAN_STAY_ID])) {
      return '家长课程只适合陪孩子来的成人；孩子请选青少年、学校或幼儿园课程（15岁以上也可以读成人ESL）。';
    }
    if (this.selectedAgeGroup === 'adult' && this.hasCourse(ELSA_KIDS_COURSE_IDS)) {
      return '青少年、学校和幼儿园课程只适合未满18岁的孩子，请把年龄段改为“未满18岁”。';
    }
    if (this.guardianStay && plan.rooms.some(row => !ELSA_GUARDIAN_STAY_ROOM_IDS.includes(row.optionId))) {
      return '家长陪读（不上课）只能住三人间、四人间或五人间。';
    }
    for (const id of new Set(plan.courses.map(row => row.optionId))) {
      const minimum = this.minimumWeeks(id);
      const weeks = plan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks < minimum) return `${this.courseName(id)}至少要读${minimum}周。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  get minorNote(): string {
    return '孩子按年龄选课：42–47个月读幼儿托管，4–7岁读幼儿园课程，7–14岁读青少年ESL或学校课程，15岁以上也可以读成人ESL。未满18岁、没有家长陪同时，外出须经管理老师同意。';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Price of one week of a row (each week of a row costs the same). */
  private weekPrice(kind: 'course' | 'room', row: QuotePlanRow): number {
    return row.weeks > 0 ? this.quotePlan.price(kind, row) / row.weeks : 0;
  }

  /** Every stay week with its course, the price of its course week and the price of its room week. */
  private get weeks(): Array<{ start: number; courseId: string; course: number; room: number }> {
    const plan = this.quotePlan;
    const result = new Map<number, { start: number; courseId: string; course: number; room: number }>();
    for (const row of plan.courses) {
      const price = this.weekPrice('course', row);
      for (const start of plan.weekStarts([row])) result.set(start, { start, courseId: row.optionId, course: price, room: 0 });
    }
    for (const row of plan.rooms) {
      const price = this.weekPrice('room', row);
      for (const start of plan.weekStarts([row])) {
        const week = result.get(start);
        if (week) week.room = price;
      }
    }
    return [...result.values()].sort((a, b) => a.start - b.start);
  }

  /** 思达启航 10% off course and room, taken first (user rule 2026-11-24: ELSA's files give no order). */
  private get sidaRate(): number {
    const rule = this.enabledRule(ELSA_SIDA_RULE_ID);
    return rule && !this.guardianStay ? rule.discountValue / 100 : 0;
  }

  /** 2026 off-season: adult ESL course and room half price for every week inside the window, after 思达启航's 10%. */
  get adultHalfPrice(): { weeks: number; amount: number } {
    const rule = this.enabledRule(ELSA_ADULT_OFF_SEASON_RULE_ID);
    if (!rule) return { weeks: 0, amount: 0 };
    const weeks = this.weeks.filter(week => ELSA_ADULT_COURSE_IDS.includes(week.courseId) && inOffSeason(week.start));
    const amount = weeks.reduce((sum, week) => sum + (week.course + week.room) * (1 - this.sidaRate) * rule.discountValue / 100, 0);
    return { weeks: weeks.length, amount: roundCents(amount) };
  }

  /**
   * 2026 off-season: junior and kindergarten courses wholly inside the window get free weeks (报名3周送1周, 报名8周送4周):
   * 4–11 study weeks one free week, 12 and more four; the free weeks are the cheapest ones. A free week is free in
   * full, so it takes off what is left of that week after 思达启航's 10%, never more than the week costs.
   */
  get kidsFreeWeeks(): { weeks: number; amount: number } {
    if (!this.enabledRule(ELSA_KIDS_OFF_SEASON_RULE_ID)) return { weeks: 0, amount: 0 };
    const weeks = this.weeks.filter(week => ELSA_KIDS_COURSE_IDS.includes(week.courseId));
    if (!weeks.length || !weeks.every(week => inOffSeason(week.start))) return { weeks: 0, amount: 0 };
    const free = weeks.length >= 12 ? 4 : weeks.length >= 4 ? 1 : 0;
    const amount = weeks.map(week => week.course + week.room).sort((a, b) => a - b).slice(0, free).reduce((sum, value) => sum + value, 0);
    return { weeks: free, amount: roundCents(amount * (1 - this.sidaRate)) };
  }

  private get schoolOffers(): Array<{ rule: CiaPromotionRule; amount: number; note: string }> {
    const offers: Array<{ rule: CiaPromotionRule; amount: number; note: string }> = [];
    const adult = this.adultHalfPrice;
    const adultRule = this.enabledRule(ELSA_ADULT_OFF_SEASON_RULE_ID);
    if (adultRule && adult.amount > 0) offers.push({ rule: adultRule, amount: adult.amount, note: `${adultRule.description}；本次${adult.weeks}周` });
    const kids = this.kidsFreeWeeks;
    const kidsRule = this.enabledRule(ELSA_KIDS_OFF_SEASON_RULE_ID);
    if (kidsRule && kids.amount > 0) offers.push({ rule: kidsRule, amount: kids.amount, note: `${kidsRule.description}；本次送${kids.weeks}周` });
    return offers;
  }

  /** 思达启航 10% on the full course and room price; a parent who only stays has no discount. */
  get sidaDiscount(): number {
    return roundCents((this.tuition + this.accommodation) * this.sidaRate);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; note: string }> {
    const sida = this.enabledRule(ELSA_SIDA_RULE_ID);
    const amount = this.sidaDiscount;
    return [...(sida && amount > 0 ? [{ rule: sida, amount, note: sida.description }] : []), ...this.schoolOffers];
  }

  get promotionDiscountTotal(): number {
    return roundCents(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registrationNote(): string | undefined {
    return this.guardianStay ? '家长陪读价已含注册费' : undefined;
  }

  get registration(): number {
    if (this.guardianStay) return 0;
    if (this.returningStudent && this.enabledRule(ELSA_RETURNING_RULE_ID)) return 0;
    return this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get quoteUsd(): number {
    return Math.max(0, roundCents(this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return this.appliedPromotions.map(({ rule, amount, note }) => ({
      icon: rule.id === ELSA_SIDA_RULE_ID ? '折' : '惠',
      label: rule.name,
      value: -amount,
      note,
      promotionKey: rule.id,
    }));
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension for every started 30 days beyond the entry visa (user rule for every Philippine school). */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** Extension amounts in order; a 59-day entry starts at the second step of the school's sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  /** Started four-week periods of the courses that use textbooks (every course but schooling, nursery and stay-only). */
  private get bookPeriods(): number {
    const weeks = this.quotePlan.courses
      .filter(row => ![...ELSA_SCHOOLING_IDS, 'nursery', ELSA_GUARDIAN_STAY_ID].includes(row.optionId))
      .reduce((sum, row) => sum + row.weeks, 0);
    return Math.ceil(weeks / 4);
  }

  /** The schooling course this student takes, the all-day one first (its uniform covers the half-day one's). */
  private get schoolingCourse(): string | undefined {
    const ids = this.quotePlan.courses.map(row => row.optionId);
    return ELSA_SCHOOLING_IDS.find(id => ids.includes(id));
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const studies = !this.guardianStay;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks === 1 ? `${formatPhp(rule.amount)}／周`
        : rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.rule('visa-extension');
    const visaTotal = visaRule ? this.visaExtensionAmounts(visaRule).reduce((sum, amount) => sum + amount, 0) : 0;
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const schooling = this.schoolingCourse;
    const uniform = schooling ? SCHOOLING_UNIFORM[schooling] : 0;
    const copies = schooling ? SCHOOLING_COPIES[schooling] : 0;
    const schoolingUnit = (amount: number) => `${formatPhp(amount)}／次`;
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('ssp', studies && !longTerm ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', studies && !longTerm ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('facility', plan.roomWeeks),
      ...create('books', this.bookPeriods),
      ...create('schooling-uniform', schooling ? 1 : 0, undefined, uniform, schooling ? schoolingUnit(uniform) : undefined),
      ...create('schooling-copies', schooling ? 1 : 0, undefined, copies, schooling ? schoolingUnit(copies) : undefined),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}


/** Air conditioning, the family deposit and airport pickup, outside the local-fee total. */
function elsaOptionalFees(pricing: ElsaQuotePricing, students: readonly ElsaPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const total = rule.multiplyByStudents ? rule.amount * count : rule.amount;
      const amount = rule.id === 'air-conditioning' ? `约${formatPhp(total)}／月` : formatPhp(total);
      return {
        label: rule.name,
        amount,
        cnyAmount: cny(total),
        note: `${rule.note}${rule.multiplyByStudents && count > 1 ? `（${count}人）` : ''}`,
      };
    });
}

export class ElsaQuote extends PhSchoolQuote<ElsaPageStudent> {
  constructor(pricing: ElsaQuotePricing) {
    super(pricing, {
      createStudent: () => new ElsaPageStudent(pricing),
      headingPrefix: 'ELSA',
      image: { schoolCode: 'ELSA', schoolName: '菲律宾宿务ELSA语言学校', filePrefix: 'ELSA', heroSrc: ELSA_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => elsaPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => elsaOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class ElsaPlanComparison extends PhPlanComparison<ElsaPageStudent> {
  constructor(pricing: ElsaQuotePricing, conditions: () => ElsaPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new ElsaPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'ELSA 方案对比报价',
      courseGroups: ELSA_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      extraNotes: () => ['课程价含课程、住宿和三餐；2027年寒假旺季已满，暑假旺季另有附加费，金额待学校公布。'],
      layoutVersion: 2,
    });
  }
}
