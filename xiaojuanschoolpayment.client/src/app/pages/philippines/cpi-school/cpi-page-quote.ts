// CPI on the shared Philippine school quote and plan comparison. CPI's own prices, promotions, Premium
// Residence dates and local fees are calculated here per student; the template's PhSchoolQuote and
// PhPlanComparison only add students up and lay out the result. Keep this file free of Angular, DOM and
// storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import { textbookPeriods } from '../school-textbook-estimate';
import {
  CPI_FAMILY_COURSE_ROOM_IDS,
  CPI_JUNIOR_COURSE_ID,
  CPI_PARENTS_COURSE_ID,
  CPI_PREMIUM_ROOM_IDS,
  CPI_PREMIUM_STAY_WINDOWS,
} from './cpi-content-config';

export const CPI_QUOTE_IMAGE_HERO = '/assets/cpi/campus-exterior.webp';
const SIDA_RULE_ID = 'cpi-sida-90';
const RETURNING_RULE_ID = 'cpi-returning-registration';
const DAY = 86400000;

/** Everything CPI's quote reads; the page component is one. */
export interface CpiQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CPI_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '一般／密集英语', courseIds: ['esl-general-15', 'esl-intensive'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-preparatory', 'ielts-general', 'ielts-intensive', 'ielts-guarantee'] },
  { id: 'toeic', label: '托业', courseIds: ['toeic-preparatory', 'toeic-general', 'toeic-intensive', 'toeic-guarantee'] },
  { id: 'toefl', label: '托福', courseIds: ['toefl-preparatory', 'toefl-general', 'toefl-intensive', 'toefl-guarantee'] },
  { id: 'esp', label: '商务英语', courseIds: ['esp-bridge', 'esp-general'] },
] as const;

/** Price ratio of a 1–3 week row; four weeks and longer are proportional. */
export const cpiPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** One CPI student: plan, conditions and every amount the template and quote image show. */
export class CpiPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** CPI's current offers do not depend on the registration date; older saved rules compare with today. */
  private readonly registrationDate = localToday();

  constructor(private readonly pricing: CpiQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl-general-15', 'building-a-quad', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * cpiPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  /** Guarantee courses with a minimum (IELTS Guarantee: 12 weeks) count all their rows together. */
  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks && weeks < minimum) return `${course.name}须至少就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  /** Premium Residence only accepts stays inside the school's open periods. */
  get premiumError(): string {
    const rows = this.quotePlan.rooms.filter(row => CPI_PREMIUM_ROOM_IDS.includes(row.optionId));
    const outside = rows.some(row => {
      const end = this.quotePlan.end(row);
      return !CPI_PREMIUM_STAY_WINDOWS.some(period => row.startDate >= period.start && !!end && end <= period.end);
    });
    return outside
      ? `Premium公寓目前只接受${CPI_PREMIUM_STAY_WINDOWS.map(period => period.label).join('、')}入住，请调整日期或改选校内宿舍。`
      : '';
  }

  /** The 2027 price list offers Junior and Diet (guardian) programs only with these rooms. */
  get familyRoomError(): string {
    const family = this.quotePlan.courses.some(row => [CPI_JUNIOR_COURSE_ID, CPI_PARENTS_COURSE_ID].includes(row.optionId));
    if (!family || this.quotePlan.rooms.every(row => CPI_FAMILY_COURSE_ROOM_IDS.includes(row.optionId))) return '';
    return '青少年课程和家长课程只可搭配双人间、三人间、B栋家庭房或Premium双人间，请调整房型。';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.premiumError || this.familyRoomError;
  }

  // ---- promotions -------------------------------------------------------------------------------

  private get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    const plan = this.quotePlan;
    if (plan.courseWeeks < rule.minimumCourseWeeks || plan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    if (rule.registrationStart && this.registrationDate < rule.registrationStart) return false;
    if (rule.registrationEnd && this.registrationDate > rule.registrationEnd) return false;
    const start = this.courseStart;
    if (rule.arrivalStart && start < rule.arrivalStart) return false;
    if (rule.arrivalEnd && start > rule.arrivalEnd) return false;
    return true;
  }

  /** Study weeks (or, for a room offer, weeks in its rooms) that lie wholly inside the offer's dates. */
  coveredWeeks(rule: CiaPromotionRule): number {
    const plan = this.quotePlan;
    const roomOffer = !!rule.eligibleRoomIds?.length;
    const rows = roomOffer ? plan.rooms.filter(row => rule.eligibleRoomIds!.includes(row.optionId)) : plan.courses;
    const starts = plan.weekStarts(rows);
    if (!rule.coverageStart || !rule.coverageEnd) return starts.length;
    const from = parseDay(rule.coverageStart);
    const through = parseDay(rule.coverageEnd);
    return starts.filter(start => start >= from && start + 6 * DAY <= through).length;
  }

  promotionAmount(rule: CiaPromotionRule): number {
    if (rule.discountType === 'none' || !this.eligible(rule)) return 0;
    const tuition = this.quotePlan.total('course');
    const accommodation = this.quotePlan.total('room');
    const base = rule.appliesTo === 'tuition' ? tuition
      : rule.appliesTo === 'accommodation' ? accommodation
        : rule.appliesTo === 'school-total' ? tuition + accommodation + this.pricing.registrationFee
          : tuition + accommodation;
    if (rule.discountType === 'percentage') return Math.round(base * rule.discountValue) / 100;
    if (rule.discountType === 'per-course-week') return this.coveredWeeks(rule) * rule.discountValue;
    const repetitions = rule.incrementWeeks && rule.incrementValue
      ? Math.floor((this.quotePlan.courseWeeks - rule.minimumCourseWeeks) / rule.incrementWeeks) : 0;
    return rule.discountValue + Math.max(0, repetitions) * (rule.incrementValue ?? 0);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.enabled)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.promotionAmount(rule) }))
      .filter(item => item.amount > 0);
  }

  /** Non-cash offers (the limited extra one-to-one class) that this plan qualifies for. */
  private get giftPromotions(): CiaPromotionRule[] {
    return this.pricing.promotions.filter(rule =>
      rule.enabled && rule.discountType === 'none' && !rule.waiveRegistration && this.eligible(rule));
  }

  get promotionDiscountTotal(): number {
    return Math.round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registrationWaiverName(): string | undefined {
    return this.pricing.promotions.find(rule =>
      rule.id !== RETURNING_RULE_ID && rule.waiveRegistration && this.eligible(rule))?.name;
  }

  get registration(): number {
    const returningWaiver = this.returningStudent && !!this.enabledRule(RETURNING_RULE_ID);
    return returningWaiver || this.registrationWaiverName !== undefined ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal;
    return Math.max(0, Math.round(total * 100) / 100);
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.id === SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: rule.discountType === 'per-course-week'
          ? `${rule.description}；本次${this.coveredWeeks(rule)}周`
          : rule.description,
        promotionKey: rule.id,
      })),
      ...this.giftPromotions.map(rule => ({
        icon: '赠',
        label: rule.name,
        value: 0,
        note: `${rule.description}；非现金优惠，不抵扣费用`,
        promotionKey: rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '6–15岁可选青少年课程（只可住双人间、三人间、B栋家庭房或Premium双人间），15岁以上可选一般英语等课程；未成年人的监护和入学安排须由顾问向学校确认。';
  }

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

  /** Extension amounts in order; a 59-day entry starts one step later in the school's 30-day sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const periods = Math.max(1, Math.ceil(plan.roomWeeks / 4));
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const visaLabel = this.visaLabel;
    const longTermNote = `${visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const books = this.rule('books');
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.rule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaTotal = visaAmounts.reduce((sum, amount) => sum + amount, 0);
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${visaLabel}预估，本次${extensions}次` : `按${visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('arp', longTerm || extensions > 0 ? 1 : 0),
      ...create('management', periods),
      ...create('water', periods),
      ...create('electricity', periods),
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('books', books ? textbookPeriods(plan.courses, books.periodWeeks ?? 8) : 0),
      ...create('student-id', 1),
    ];
  }
}

export class CpiQuote extends PhSchoolQuote<CpiPageStudent> {
  constructor(pricing: CpiQuotePricing) {
    super(pricing, {
      createStudent: () => new CpiPageStudent(pricing),
      headingPrefix: 'CPI',
      image: { schoolCode: 'CPI', schoolName: '菲律宾宿务CPI语言学校', filePrefix: 'CPI', heroSrc: CPI_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => cpiPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      layoutVersion: 2,
    });
  }

  /** The limited extra class is a non-cash gift, so its row says 赠送 instead of “0 美元”. */
  override get schoolPaymentItems() { return super.schoolPaymentItems.map(giftAmount); }
  override get quoteImageData() {
    const data = super.quoteImageData;
    return { ...data, paymentItems: data.paymentItems.map(giftAmount) };
  }
}

const giftAmount = <T extends { icon: string; amount: string; accent?: boolean }>(item: T): T =>
  item.icon === '赠' ? { ...item, amount: '赠送', accent: false } : item;

export class CpiPlanComparison extends PhPlanComparison<CpiPageStudent> {
  constructor(pricing: CpiQuotePricing, conditions: () => CpiPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new CpiPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'CPI 方案对比报价',
      courseGroups: CPI_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
