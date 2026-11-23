// HELP Clark on the shared Philippine school quote and plan comparison. HELP's own prices, offers, minor rules and
// local fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students
// up and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program
// can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  HELP_ARRIVAL_DATES_2026,
  HELP_FAMILY_COURSE_IDS,
  HELP_KINDERGARTEN_ID,
  HELP_MINOR_MANAGEMENT_FEE,
  HELP_REGISTRATION_RULE_ID,
  HELP_RETURNING_RULE_ID,
  HELP_SIDA_RULE_ID,
} from './help-content-config';
import { HELP_QUOTE_IMAGE_HERO } from './help-page-content';

const DAY = 86400000;
/** Months in which a student under 18 may take only the family or junior camp (school FAQ). */
const PEAK_MONTHS = new Set([1, 2, 6, 7, 8]);

/** Everything HELP's quote reads; the page component is one. */
export interface HelpQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const HELP_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL／商务英语', courseIds: ['esl', 'esl-intensive', 'business'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-basic', 'ielts-advanced'] },
  { id: 'toeic', label: '托业', courseIds: ['toeic-basic', 'toeic-advanced'] },
] as const;

/** Price ratio of a 1–3 week row (40/65/80%); four weeks and longer are proportional. */
export const helpPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

/** The first 2026 admission Sunday from the next Sunday on; after the last one, the next Sunday. */
export function helpDefaultStart(now = new Date()): string {
  const sunday = nextQuoteSunday(now);
  return HELP_ARRIVAL_DATES_2026.find(date => date >= sunday) ?? sunday;
}

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const roundCents = (value: number): number => Math.round(value * 100) / 100;

/** One HELP Clark student: plan, conditions and every amount the template and quote image show. */
export class HelpPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: HelpQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl', 'room-4', helpDefaultStart(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * helpPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  // ---- minors -----------------------------------------------------------------------------------

  private get adultCourseRows() {
    return this.quotePlan.courses.filter(row => !HELP_FAMILY_COURSE_IDS.includes(row.optionId));
  }

  /** An adult-course study week (Monday to Friday) in January, February, June, July or August. */
  private get adultCourseInPeak(): boolean {
    return this.quotePlan.weekStarts(this.adultCourseRows).some(start =>
      [1, 2, 3, 4, 5].some(day => PEAK_MONTHS.has(new Date(start + day * DAY).getUTCMonth() + 1)));
  }

  /** A student under 18 on an adult course: allowed only in the off-season, with the special management fee. */
  private get minorOnAdultCourse(): boolean {
    return this.selectedAgeGroup === 'minor' && this.adultCourseRows.length > 0;
  }

  get courseLengthError(): string {
    if (this.minorOnAdultCourse && this.adultCourseInPeak) {
      return '1、2、6、7、8月是旺季，未满18岁的学生只能报亲子营或青少年营；已高中毕业的请选“18岁及以上”并告诉顾问。';
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  get minorNote(): string {
    return '旺季（1、2、6、7、8月）须满18岁或高中毕业才能报成人课程；淡季满15岁可以单独报成人课程，另付200美元特殊管理费。带孩子来请报亲子营。';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** The off-season offers count the first course start (an admission Sunday inside the window) and the course weeks. */
  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    if (this.quotePlan.courseWeeks < rule.minimumCourseWeeks) return false;
    const start = this.courseStart;
    if (rule.arrivalStart && start < rule.arrivalStart) return false;
    if (rule.arrivalEnd && start > rule.arrivalEnd) return false;
    return true;
  }

  /** School cash offers: an amount per complete four course weeks (淡季优惠, SNS优惠). */
  private schoolOfferAmount(rule: CiaPromotionRule): number {
    if (rule.id === HELP_SIDA_RULE_ID || rule.discountType === 'none' || !this.eligible(rule)) return 0;
    if (rule.ruleKind === 'per-complete-four-weeks') return Math.floor(this.quotePlan.courseWeeks / 4) * rule.discountValue;
    if (rule.discountType === 'percentage') return roundCents((this.tuition + this.accommodation) * rule.discountValue / 100);
    if (rule.discountType === 'per-course-week') return this.quotePlan.courseWeeks * rule.discountValue;
    return rule.discountValue;
  }

  private get schoolOffers(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.enabled && rule.id !== HELP_SIDA_RULE_ID)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.schoolOfferAmount(rule) }))
      .filter(item => item.amount > 0);
  }

  /** 思达启航 5% on tuition and room after the school offers, as the school's formula (学费+寝室费−淡季优惠)×95%. */
  get sidaDiscount(): number {
    const rule = this.enabledRule(HELP_SIDA_RULE_ID);
    if (!rule) return 0;
    const offers = this.schoolOffers.reduce((sum, item) => sum + item.amount, 0);
    return roundCents(Math.max(0, this.tuition + this.accommodation - offers) * rule.discountValue / 100);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    const sida = this.enabledRule(HELP_SIDA_RULE_ID);
    const amount = this.sidaDiscount;
    return [...this.schoolOffers, ...(sida && amount > 0 ? [{ rule: sida, amount }] : [])];
  }

  get promotionDiscountTotal(): number {
    return roundCents(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  /** Set when the off-season offer (8+ weeks) waives a new student's registration. */
  get registrationWaiverName(): string | undefined {
    const rule = this.enabledRule(HELP_REGISTRATION_RULE_ID);
    return rule && this.eligible(rule) ? '淡季优惠' : undefined;
  }

  get registration(): number {
    if (this.returningStudent && this.enabledRule(HELP_RETURNING_RULE_ID)) return 0;
    return this.registrationWaiverName ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  /** The one-time special management fee for a 15–17-year-old on an adult course (off-season only). */
  get minorManagementFee(): number {
    return this.minorOnAdultCourse && !this.adultCourseInPeak ? HELP_MINOR_MANAGEMENT_FEE : 0;
  }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.minorManagementFee - this.promotionDiscountTotal;
    return Math.max(0, roundCents(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const fee: SchoolPaymentLine[] = this.minorManagementFee
      ? [{ icon: '管', label: '未成年特殊管理费', value: this.minorManagementFee, note: '淡季满15岁、未满18岁的学生报成人课程时收取，一次性' }]
      : [];
    return [
      ...fee,
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.id === HELP_SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: rule.ruleKind === 'per-complete-four-weeks'
          ? `${rule.description}；本次${Math.floor(this.quotePlan.courseWeeks / 4)}个4周`
          : rule.description,
        promotionKey: rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** Extension amounts in order; a 59-day entry uses its own sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  /** Started four-week course periods, counted per row type (books for the classes, materials for kindergarten). */
  private coursePeriods(kindergarten: boolean): number {
    const weeks = this.quotePlan.courses
      .filter(row => (row.optionId === HELP_KINDERGARTEN_ID) === kindergarten)
      .reduce((sum, row) => sum + row.weeks, 0);
    return Math.ceil(weeks / 4);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
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
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('books', this.coursePeriods(false)),
      ...create('id-card', 1),
      ...create('water', plan.roomWeeks),
      ...create('electricity', plan.roomWeeks),
      ...create('laundry', plan.roomWeeks),
      ...create('maintenance', plan.roomWeeks),
      ...create('kindergarten-materials', this.coursePeriods(true)),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

/** Per-person pickup rate for a party of this size (the school's pickup sheet). */
export function helpPickupRate(airport: 'manila' | 'clark', people: number): number {
  if (airport === 'clark') return people >= 2 ? 600 : 1000;
  return people >= 4 ? 1700 : people >= 2 ? 2800 : 5500;
}

/** Deposit and the two airport pickups, outside the local-fee total; a group pays the group pickup rate. */
function helpOptionalFees(pricing: HelpQuotePricing, students: readonly HelpPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  const group = count > 1 ? `（${count}人）` : '';
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const airport = rule.id === 'pickup-manila' ? 'manila' : rule.id === 'pickup-clark' ? 'clark' : undefined;
      const unit = airport ? helpPickupRate(airport, count) : rule.amount;
      const total = airport || rule.multiplyByStudents ? unit * count : unit;
      const groupRate = airport && count > 1 ? `每人${unit.toLocaleString('en-US')}比索` : '';
      return {
        label: rule.name,
        amount: formatPhp(total),
        cnyAmount: cny(total),
        note: `${rule.note}${group}${groupRate ? `，本次${groupRate}` : ''}`,
      };
    });
}

export class HelpQuote extends PhSchoolQuote<HelpPageStudent> {
  constructor(pricing: HelpQuotePricing) {
    super(pricing, {
      createStudent: () => new HelpPageStudent(pricing),
      headingPrefix: 'HELP 克拉克',
      image: { schoolCode: 'HELP-CLARK', schoolName: '菲律宾克拉克HELP English语言学校', filePrefix: 'HELP-Clark', heroSrc: HELP_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => helpPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => helpOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class HelpPlanComparison extends PhPlanComparison<HelpPageStudent> {
  constructor(pricing: HelpQuotePricing, conditions: () => HelpPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new HelpPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'HELP 克拉克 方案对比报价',
      courseGroups: HELP_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
