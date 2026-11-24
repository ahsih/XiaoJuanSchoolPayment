// SMEAG Capital on the shared Philippine school quote and plan comparison. SMEAG's own prices, offers and
// local fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add
// students up and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat
// mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  SMEAG_CAMPUS_ROOM_IDS,
  SMEAG_RETURNING_RULE_ID,
  SMEAG_SIDA_RULE_ID,
  SMEAG_TEXTBOOK_BY_COURSE,
} from './smeag-content-config';
import { SMEAG_QUOTE_IMAGE_HERO } from './smeag-page-content';

const DAY = 86400000;

/** Everything SMEAG's quote reads; the page component is one. */
export interface SmeagQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const SMEAG_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL／口语强化', courseIds: ['esl-regular-ket-pet-fce', 'esl-2', 'speaking-master-ket-pet-fce'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-pre', 'ielts-regular'] },
  { id: 'toefl', label: '托福', courseIds: ['toefl-pre', 'toefl-regular'] },
  { id: 'toeic', label: '托业', courseIds: ['toeic-pre', 'toeic-regular'] },
] as const;

/** Price ratio of a 1–3 week row (45/65/85%); four weeks and longer are proportional. */
export const smeagPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;

/** One SMEAG Capital student: plan, conditions and every amount the template and quote image show. */
export class SmeagPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: SmeagQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl-regular-ket-pet-fce', 'campus-quad', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * smeagPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  /** A course with a minimum length counts all its rows together. */
  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks && weeks < minimum) return `${course.name}须至少就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Arrival, length and new-student conditions; SMEAG's offers do not depend on the registration date. */
  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    const plan = this.quotePlan;
    if (plan.courseWeeks < rule.minimumCourseWeeks || plan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    const start = this.courseStart;
    if (rule.arrivalStart && start < rule.arrivalStart) return false;
    if (rule.arrivalEnd && start > rule.arrivalEnd) return false;
    return true;
  }

  /** Study weeks (Sunday to Saturday) that lie wholly inside the offer's dates. */
  coveredWeeks(rule: CiaPromotionRule): number {
    const starts = this.quotePlan.weekStarts(this.quotePlan.courses);
    if (!rule.coverageStart || !rule.coverageEnd) return starts.length;
    const from = parseDay(rule.coverageStart);
    const through = parseDay(rule.coverageEnd);
    return starts.filter(start => start >= from && start + 6 * DAY <= through).length;
  }

  /** A fixed offer with dates (the Christmas offer) needs a study week that touches them. */
  private touchesCoverage(rule: CiaPromotionRule): boolean {
    if (!rule.coverageStart || !rule.coverageEnd) return true;
    const from = parseDay(rule.coverageStart);
    const through = parseDay(rule.coverageEnd);
    return this.quotePlan.weekStarts(this.quotePlan.courses).some(start => start <= through && start + 6 * DAY >= from);
  }

  /** The part of the stay an offer counts: with eligibleRoomIds (思达启航折扣) only those rooms, not the hotels. */
  private accommodationFor(rule: CiaPromotionRule): number {
    if (!rule.eligibleRoomIds?.length) return this.quotePlan.total('room');
    return this.quotePlan.rooms
      .filter(row => rule.eligibleRoomIds!.includes(row.optionId))
      .reduce((sum, row) => sum + this.quotePlan.price('room', row), 0);
  }

  promotionAmount(rule: CiaPromotionRule): number {
    if (rule.discountType === 'none' || !this.eligible(rule)) return 0;
    const tuition = this.quotePlan.total('course');
    const accommodation = this.accommodationFor(rule);
    const base = rule.appliesTo === 'tuition' ? tuition
      : rule.appliesTo === 'accommodation' ? accommodation
        : rule.appliesTo === 'school-total' ? tuition + accommodation + this.pricing.registrationFee
          : tuition + accommodation;
    if (rule.discountType === 'percentage') return Math.round(base * rule.discountValue) / 100;
    if (rule.discountType === 'per-course-week') return this.coveredWeeks(rule) * rule.discountValue;
    return this.touchesCoverage(rule) ? rule.discountValue : 0;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.enabled)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.promotionAmount(rule) }))
      .filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return Math.round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && !!this.enabledRule(SMEAG_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
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
    return this.appliedPromotions.map(({ rule, amount }) => ({
      icon: rule.id === SMEAG_SIDA_RULE_ID ? '折' : '惠',
      label: rule.name,
      value: -amount,
      note: rule.discountType === 'per-course-week' ? `${rule.description}；本次${this.coveredWeeks(rule)}周` : rule.description,
      promotionKey: rule.id,
    }));
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满15岁须有至少一位监护人陪读并上课；15岁以上可以单独就读，但学校不监督学习、不向家长汇报出勤、不代管手机。';
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

  /** Extension amounts in order; a 59-day entry uses its own sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  /** Room weeks in the campus dormitory; the partner hotels charge no water and electricity. */
  private get campusRoomWeeks(): number {
    return this.quotePlan.rooms.filter(row => SMEAG_CAMPUS_ROOM_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.rule('visa-extension');
    const visaTotal = visaRule ? this.visaExtensionAmounts(visaRule).reduce((sum, amount) => sum + amount, 0) : 0;
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const books = [...new Set(plan.courses.map(row => SMEAG_TEXTBOOK_BY_COURSE[row.optionId] ?? 'book-esl'))];
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-i-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      // VISA I-CARD (ACR) comes with the first visa extension (user rule 2026-11-24, every Philippine school).
      ...create('visa-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('arp', !longTerm && this.visaType === 'tourist59' && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('utilities', Math.ceil(plan.roomWeeks / 4)),
      ...create('water-electricity', Math.ceil(this.campusRoomWeeks / 4)),
      ...books.flatMap(id => create(id, 1, undefined, undefined, `${formatPhp(this.rule(id)?.amount ?? 0)}／套`)),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

export class SmeagQuote extends PhSchoolQuote<SmeagPageStudent> {
  constructor(pricing: SmeagQuotePricing) {
    super(pricing, {
      createStudent: () => new SmeagPageStudent(pricing),
      headingPrefix: 'SMEAG Capital',
      image: { schoolCode: 'SMEAG', schoolName: '菲律宾宿务SMEAG Capital语言学校', filePrefix: 'SMEAG-Capital', heroSrc: SMEAG_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => smeagPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      layoutVersion: 2,
    });
  }
}

export class SmeagPlanComparison extends PhPlanComparison<SmeagPageStudent> {
  constructor(pricing: SmeagQuotePricing, conditions: () => SmeagPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new SmeagPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'SMEAG Capital 方案对比报价',
      courseGroups: SMEAG_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
