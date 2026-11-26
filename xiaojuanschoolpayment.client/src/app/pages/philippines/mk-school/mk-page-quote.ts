// MK on the shared Philippine school quote and plan comparison. MK's own prices, its 2026 half-price offer, its 2027
// dormitory offer, the TESOL add-on and the local fees are calculated here per student; the template's PhSchoolQuote and
// PhPlanComparison only add students up and lay out the result. Keep this file free of Angular, DOM and storage access,
// so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  MK_ADULT_ONLY_COURSE_IDS,
  MK_DORM_2027_RULE,
  MK_HALF_PRICE_RULE,
  MK_RETURNING_RULE_ID,
  MK_SIDA_RULE,
  MK_TESOL_BASE_COURSE_IDS,
  MK_TESOL_FEE,
  MK_TESOL_WEEKS,
} from './mk-content-config';

export const MK_QUOTE_IMAGE_HERO = '/assets/mk/campus/main-building.webp';

/** Everything MK's quote reads; the page component is one. */
export interface MkQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const MK_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '综合英语', courseIds: ['esl-basic', 'esl-standard', 'esl-premium', 'esl-intensive'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts', 'ielts-guarantee'] },
  { id: 'career', label: '职场与特色', courseIds: ['business', 'working-holiday', 'internship', 'survival'] },
  { id: 'junior', label: '青少年与家长', courseIds: ['junior-basic', 'junior-premium', 'guardian'] },
] as const;

/** Price ratio of a row of this many weeks: 1–3 weeks from the school's ratios, longer ones proportional. */
export const mkPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

/**
 * Weeks charged under the 2026 offer (MK_20260106): half the stay, as MK's own promotion sheet does (4 weeks = the
 * 2-week price). Under 4 charged weeks only whole weeks have a price, so an odd stay rounds up (5 weeks = the 3-week
 * price); from 4 charged weeks every week costs the weekly average (user decision 2026-11-25).
 */
export const mkHalfPriceWeeks = (weeks: number): number => {
  const half = weeks / 2;
  return half < 4 ? Math.ceil(half) : half;
};

/** Share of the normal price paid under the 2026 offer. */
export const mkHalfPriceFactor = (weeks: number, ratios: Record<string, number>): number =>
  weeks <= 0 ? 1 : mkPriceMultiplier(mkHalfPriceWeeks(weeks), ratios) / mkPriceMultiplier(weeks, ratios);

/** The 2027 offer's dormitory deduction (MK_20260801) for a stay of this many weeks, in dollars. */
export const mkDorm2027Deduction = (weeks: number, rule: CiaPromotionRule): number => {
  if (weeks <= 0) return 0;
  const tier = rule.discountTiers?.[String(weeks)];
  return tier ?? weeks * rule.discountValue;
};

const round = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const formatUsd = (value: number): string => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

const TESOL_OPTIONS = [
  { value: false, label: '不加报' },
  { value: true, label: `加报（${MK_TESOL_WEEKS}周，${MK_TESOL_FEE}美元）` },
] as const;

interface MkExtraChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

/** One MK student: plan, conditions and every amount the template and quote image show. */
export class MkPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** TESOL at West Visayas State University, an add-on to an ESL or IELTS course. */
  tesol = false;
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly pricing: MkQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl-basic', 'three-bed', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * mkPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
    const student = this;
    const tesol: MkExtraChoice<boolean> = {
      label: 'TESOL英语教师课程',
      options: TESOL_OPTIONS,
      inComparison: false,
      visible: true,
      get note() {
        return student.tesol
          ? '每周六8小时西米沙鄢州立大学（WVSU）TESOL课程，共4周，最后以模拟教学作为结业考试；须同时报综合英语或雅思课程。'
          : '';
      },
      get value() { return student.tesol; },
      set value(selected: boolean) { student.tesol = selected; },
    };
    this.extraChoices = [tesol];
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks && weeks < minimum) return `${course.name}须至少就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  private get ageError(): string {
    if (this.selectedAgeGroup !== 'minor') return '';
    const adultOnly = this.quotePlan.courses
      .map(row => this.pricing.courseFees.find(item => item.id === row.optionId))
      .find(course => !!course && MK_ADULT_ONLY_COURSE_IDS.includes(course.id));
    return adultOnly ? `${adultOnly.name}只接受18岁以上学生，请改选其他课程。` : '';
  }

  private get tesolError(): string {
    if (!this.tesol) return '';
    if (!this.quotePlan.courses.some(row => MK_TESOL_BASE_COURSE_IDS.includes(row.optionId))) {
      return 'TESOL须同时报综合英语或雅思课程，请调整课程或取消TESOL。';
    }
    return this.quotePlan.courseWeeks < MK_TESOL_WEEKS ? `加报TESOL须至少就读${MK_TESOL_WEEKS}周。` : '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.ageError || this.tesolError;
  }

  // ---- promotions -------------------------------------------------------------------------------

  private get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }

  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    const plan = this.quotePlan;
    if (plan.courseWeeks < rule.minimumCourseWeeks || plan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    const start = this.courseStart;
    if (rule.arrivalStart && start < rule.arrivalStart) return false;
    if (rule.arrivalEnd && start > rule.arrivalEnd) return false;
    return true;
  }

  /** The eligible enabled rule of this kind, if any. */
  private rule(kind: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.ruleKind === kind && this.eligible(rule));
  }

  /** Share of the course and room price left after the 思达启航 discount, which comes first (on the full price). */
  private get sidaFactor(): number {
    const sida = this.rule(MK_SIDA_RULE);
    return sida && sida.discountType === 'percentage' ? 1 - sida.discountValue / 100 : 1;
  }

  private promotionAmount(rule: CiaPromotionRule): number {
    const plan = this.quotePlan;
    const ratios = this.pricing.shortTermPriceRatios;
    if (rule.ruleKind === MK_SIDA_RULE) {
      return rule.discountType === 'percentage' ? round((this.tuition + this.accommodation) * rule.discountValue / 100) : 0;
    }
    if (rule.ruleKind === MK_HALF_PRICE_RULE) {
      // Half of what is left after the 思达启航 discount.
      const part = (amount: number, weeks: number) => amount * this.sidaFactor * (1 - mkHalfPriceFactor(weeks, ratios));
      return round(part(plan.total('course'), plan.courseWeeks) + part(plan.total('room'), plan.roomWeeks));
    }
    if (rule.ruleKind === MK_DORM_2027_RULE) {
      // The offer needs both a course and the dormitory; MK's sheet applies the full deduction to every room type.
      return plan.courseWeeks > 0 ? round(mkDorm2027Deduction(plan.roomWeeks, rule)) : 0;
    }
    return 0;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.ruleKind && this.eligible(rule))
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.promotionAmount(rule) }))
      .filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  private promotionNote(rule: CiaPromotionRule, amount: number): string {
    const plan = this.quotePlan;
    if (rule.ruleKind === MK_SIDA_RULE) return rule.description;
    if (rule.ruleKind === MK_HALF_PRICE_RULE) {
      const weeks = plan.courseWeeks;
      return `2026/02/01–12/31抵达，学费和住宿费半价；本次${weeks}周按${mkHalfPriceWeeks(weeks)}周的价格计`;
    }
    const weeks = plan.roomWeeks;
    return weeks >= 8
      ? `2027年抵达且同时报课程和宿舍：住满8周三人间住宿免费，其他房型按差价计；本次${weeks}周减${formatUsd(amount)}美元`
      : `2027年抵达且同时报课程和宿舍，住宿${weeks}周减${formatUsd(amount)}美元；住满8周三人间住宿免费`;
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    const returningWaiver = this.returningStudent
      && this.pricing.promotions.some(rule => rule.id === MK_RETURNING_RULE_ID && rule.enabled);
    return returningWaiver ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;
  private get tesolFee(): number { return this.tesol ? MK_TESOL_FEE : 0; }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.tesolFee - this.promotionDiscountTotal;
    return Math.max(0, round(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...(this.tesol ? [{
        icon: '加',
        label: 'TESOL英语教师课程（WVSU）',
        value: MK_TESOL_FEE,
        note: `${MK_TESOL_WEEKS}周，每周六8小时WVSU TESOL课程，最后以模拟教学作为结业考试`,
      }] : []),
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.ruleKind === MK_SIDA_RULE ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: this.promotionNote(rule, amount),
        promotionKey: rule.id,
      })),
    ];
  }

  /** WVSU charges its own SSP for TESOL students; MK has not given the amount. */
  get extraPaymentNote(): string | undefined {
    return this.tesol ? '另需支付WVSU课程所需的SSP费用（金额以学校通知为准，未计入上述合计）。' : undefined;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未成年学生可选青少年课程，监护和入学安排由顾问向学校确认；商务英语和打工度假课程只接受18岁以上学生。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension per started 4 weeks past the entry visa: 30-day visa from week 5, 59-day visa from week 9. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const coveredWeeks = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - coveredWeeks) / 4));
  }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** Extension amounts in order; a 59-day entry starts one step later in the school's sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const periods = Math.ceil(plan.roomWeeks / 4);
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const visaLabel = this.visaLabel;
    const longTermNote = `${visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string, waived = false): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note, ...(waived ? { waived } : {}) }];
    };
    const visaRule = this.feeRule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaTotal = visaAmounts.reduce((sum, amount) => sum + amount, 0);
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${visaLabel}预估，本次${extensions}次` : `按${visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    // ACR I-Card comes with the first extension (every Philippine school, user rule 2026-11-24).
    const acr = extensions > 0 ? 1 : 0;
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined, undefined, undefined, longTerm),
      ...create('ssp-i-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined, undefined, undefined, longTerm),
      ...create('acr-i-card', acr, longTerm ? longTermNote : undefined, undefined, undefined, longTerm),
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit, longTerm),
      ...create('management', periods),
      ...create('water', periods),
      ...create('electricity', periods),
      ...create('student-id', 1),
    ];
  }
}

export class MkQuote extends PhSchoolQuote<MkPageStudent> {
  constructor(pricing: MkQuotePricing) {
    super(pricing, {
      createStudent: () => new MkPageStudent(pricing),
      headingPrefix: 'MK',
      image: { schoolCode: 'MK', schoolName: '菲律宾伊洛伊洛MK语言学校', filePrefix: 'MK', heroSrc: MK_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => mkPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      expandTotalNote: true,
      layoutVersion: 2,
    });
  }
}

export class MkPlanComparison extends PhPlanComparison<MkPageStudent> {
  constructor(pricing: MkQuotePricing, conditions: () => MkPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new MkPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'MK 方案对比报价',
      courseGroups: MK_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
