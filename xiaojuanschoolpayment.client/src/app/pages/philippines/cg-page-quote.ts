// CG Banilad and CG Sparta on the shared Philippine school quote and plan comparison. The two campuses keep their
// own content documents (prices, rooms, offers, local-fee rows); only the calculation rules they share live here,
// with each campus's differences in CgCampusRules (Sparta: 52 weeks and its long-stay offer per course period).
// Local fees come from the shared, user-confirmed estimator in cg-local-fees.ts. Keep this file free of Angular,
// DOM and storage access, so the WeChat mini program can bundle it later.
import { quoteCurrencyText } from '../../../services/quote-currency-text';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../components/school-quote-plan';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from './association-peak-surcharge';
import { CgVisaType, estimateCgLocalFees } from './cg-local-fees';
import { cgTextbookPeriods } from './cg-textbook-estimate';
import type { CiaPromotionRule } from './cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from './cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from './school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from './school-page/ph-school-quote';
import type { PhPageStudent } from './school-page/ph-school-profile';

const DAY = 86400000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const LONG_TERM_VISA_FEE_IDS = ['ssp', 'ssp-i-card', 'acr-i-card', 'visa-extension'];

/** Everything a CG quote reads; each campus page component is one. */
export interface CgQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** What differs between the two campuses' calculations. Prices and offers stay in each campus's content document. */
export interface CgCampusRules {
  /** schoolCode of the content document; also the association peak-surcharge code. */
  code: 'CG-BANILAD' | 'CG-SPARTA';
  /** Promotion ids start with it: `${rulePrefix}-sida-90`, `-off-season`, `-off-season-2027`, `-long-stay`, `-returning-registration`. */
  rulePrefix: 'cg-banilad' | 'cg-sparta';
  defaultCourseId: string;
  defaultRoomId: string;
  /** Longest course or room list (Banilad 24 weeks, Sparta 52). */
  maxWeeks: number;
  /** Sparta: the long-stay offer counts each continuous course period, capped at 200 dollars; Banilad counts all course weeks once. */
  longStayPerPeriod: boolean;
  /** A course sold only on its own for these total lengths (Booster ESL: 1 or 2 weeks). */
  standaloneWeeks?: Readonly<Record<string, readonly number[]>>;
  /** A course sold only for exactly these weeks (Sparta IELTS Guarantee: 12). */
  exactWeeks?: Readonly<Record<string, readonly number[]>>;
  /** A course that starts only on these arrival Sundays (Sparta IELTS Guarantee). */
  startSundays?: Readonly<Record<string, readonly string[]>>;
}

/**
 * Price ratio of a 1–3 week row (40/60/85%); four weeks and longer are proportional. The school's lists cut short
 * stays to whole dollars (85% of 850 = 722), so a short row is rounded down.
 */
export const cgPriceMultiplier = (weeks: number, ratios: Record<string, number>): number => ratios[String(weeks)] ?? weeks / 4;

export function cgRowPrice(fourWeekPrice: number, weeks: number, ratios: Record<string, number>, feeByWeeks?: Record<string, number>): number {
  const exact = feeByWeeks?.[String(weeks)];
  if (exact !== undefined) return exact;
  const ratio = cgPriceMultiplier(weeks, ratios);
  return weeks < 4 ? Math.floor(fourWeekPrice * ratio) : fourWeekPrice * ratio;
}

const formatDate = (value: string) => value.replaceAll('-', '/');

/** One CG student (either campus): plan, conditions and every amount the template and quote image show. */
export class CgPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType: CgVisaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: CgQuotePricing, private readonly rules: CgCampusRules) {
    this.quotePlan = new SchoolQuotePlan(
      rules.defaultCourseId, rules.defaultRoomId, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        if (kind === 'course') {
          const course = pricing.courseFees.find(item => item.id === row.optionId);
          return course ? cgRowPrice(course.tuition2027, row.weeks, pricing.shortTermPriceRatios, course.feeByWeeks) : 0;
        }
        const room = pricing.roomFees.find(item => item.id === row.optionId);
        return room ? cgRowPrice(room.fee, row.weeks, pricing.shortTermPriceRatios) : 0;
      },
      rules.maxWeeks,
    );
  }

  minimumWeeks(courseId: string): number {
    const exact = this.rules.exactWeeks?.[courseId];
    if (exact?.length) return Math.min(...exact);
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  private courseName(id: string): string { return this.pricing.courseFees.find(item => item.id === id)?.name ?? id; }

  /** Booster only on its own for 1–2 weeks, IELTS Guarantee exactly 12 weeks on a set start date, IELTS Intensive from 4 weeks. */
  get courseLengthError(): string {
    const plan = this.quotePlan;
    const weeksOf = (id: string) => plan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
    for (const [id, lengths] of Object.entries(this.rules.standaloneWeeks ?? {})) {
      if (!weeksOf(id)) continue;
      if (plan.courses.some(row => row.optionId !== id) || !lengths.includes(plan.courseWeeks)) {
        return `${this.courseName(id)}只能单独报${lengths.join('或')}周，不能和其他课程连报。`;
      }
    }
    for (const [id, lengths] of Object.entries(this.rules.exactWeeks ?? {})) {
      const weeks = weeksOf(id);
      if (weeks && !lengths.includes(weeks)) return `${this.courseName(id)}只能报${lengths.join('或')}周，请把课程周数改为${lengths[0]}周。`;
    }
    for (const [id, sundays] of Object.entries(this.rules.startSundays ?? {})) {
      const row = plan.courses.find(item => item.optionId === id);
      if (row && !sundays.includes(row.startDate)) {
        const upcoming = sundays.filter(day => day >= nextQuoteSunday()).slice(0, 4).map(formatDate);
        return `${this.courseName(id)}只在学校指定日期开课，请选择开课前一天的周日入住${upcoming.length ? `，例如${upcoming.join('、')}` : ''}。`;
      }
    }
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = weeksOf(course.id);
      if (minimum && weeks && weeks < minimum) return `${course.name}须至少就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private promotion(suffix: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === `${this.rules.rulePrefix}-${suffix}` && rule.enabled);
  }

  private get offSeasonRules(): CiaPromotionRule[] {
    const ids = [`${this.rules.rulePrefix}-off-season`, `${this.rules.rulePrefix}-off-season-2027`];
    return this.pricing.promotions.filter(rule => rule.enabled && ids.includes(rule.id));
  }

  /** Continuous runs of course weeks; the off-season and Sparta long-stay offers count each run on its own. */
  get coursePeriods(): Array<{ startDate: string; weeks: number }> {
    const periods: Array<{ startDate: string; weeks: number }> = [];
    for (const week of this.quotePlan.weekStarts()) {
      const last = periods.at(-1);
      if (last && Date.parse(`${last.startDate}T00:00:00Z`) + last.weeks * 7 * DAY === week) last.weeks++;
      else periods.push({ startDate: new Date(week).toISOString().slice(0, 10), weeks: 1 });
    }
    return periods;
  }

  get sidaDiscount(): number {
    const rule = this.promotion('sida-90');
    return rule?.discountType === 'percentage' ? rounded((this.tuition + this.accommodation) * rule.discountValue / 100) : 0;
  }

  /** 150 dollars for each full 4 weeks of a course period that starts inside an off-season window. */
  get offSeasonDiscount(): number {
    return this.offSeasonRules.reduce((total, rule) => total + this.offSeasonRuleDiscount(rule), 0);
  }

  private offSeasonRuleDiscount(rule: CiaPromotionRule): number {
    return this.coursePeriods
      .filter(period => (!rule.coverageStart || period.startDate >= rule.coverageStart) && (!rule.coverageEnd || period.startDate <= rule.coverageEnd))
      .reduce((sum, period) => sum + Math.floor(period.weeks / Math.max(1, rule.incrementWeeks ?? rule.minimumCourseWeeks ?? 4))
        * (rule.incrementValue ?? rule.discountValue), 0);
  }

  /** The school's scholarship: 12/16/20/24 weeks take 50/100/150/200 dollars off tuition. */
  get longStayDiscount(): number {
    const rule = this.promotion('long-stay');
    if (!rule) return 0;
    const step = Math.max(1, rule.incrementWeeks ?? 4);
    const increment = rule.incrementValue ?? 0;
    const tier = (weeks: number) => weeks < rule.minimumCourseWeeks ? 0 : rule.discountValue + Math.floor((weeks - rule.minimumCourseWeeks) / step) * increment;
    if (!this.rules.longStayPerPeriod) return tier(this.quotePlan.courseWeeks);
    const cap = rule.discountValue + 3 * increment;
    return this.coursePeriods.reduce((sum, period) => sum + Math.min(cap, tier(period.weeks)), 0);
  }

  private get peakCalculation() {
    return calculateAssociationPeakSurcharge(
      this.rules.code,
      this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]),
      this.pricing.peakSeasonRanges.filter(range => range.enabled),
      this.pricing.seasonalFeePerWeek,
    );
  }

  get peakWeeks(): number { return this.peakCalculation.weeks; }
  get seasonalSurcharge(): number { return this.peakCalculation.total; }

  get promotionDiscountTotal(): number { return rounded(this.sidaDiscount + this.offSeasonDiscount + this.longStayDiscount); }

  get discountNames(): string {
    const names = [
      this.sidaDiscount ? this.promotion('sida-90')?.name : '',
      this.offSeasonDiscount ? this.offSeasonRules[0]?.name : '',
      this.longStayDiscount ? this.promotion('long-stay')?.name : '',
    ].filter((name): name is string => !!name);
    return [...new Set(names)].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && this.promotion('returning-registration')?.waiveRegistration ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get quoteUsd(): number {
    return Math.max(0, rounded(this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal + this.seasonalSurcharge));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const sida = this.promotion('sida-90');
    const longStay = this.promotion('long-stay');
    const peak = this.peakCalculation;
    return [
      ...(this.sidaDiscount ? [{ icon: '折', label: sida?.name ?? '思达启航折扣', value: -this.sidaDiscount, note: sida?.description ?? '', promotionKey: 'sida' }] : []),
      ...(this.offSeasonDiscount ? [{
        icon: '淡', label: this.offSeasonRules[0]?.name ?? '淡季优惠', value: -this.offSeasonDiscount,
        // only the windows this student's course periods start in, so a 2026 quote does not list the 2027 window
        note: this.offSeasonRules.filter(rule => this.offSeasonRuleDiscount(rule) > 0)
          .map(rule => rule.description.trim().replace(/[。；;]+$/, '')).join('；') + '。', promotionKey: 'offseason',
      }] : []),
      ...(this.longStayDiscount ? [{ icon: '长', label: longStay?.name ?? '长期优惠', value: -this.longStayDiscount, note: longStay?.description ?? '', promotionKey: 'longstay' }] : []),
      ...(this.seasonalSurcharge ? [{
        icon: '暑', label: '暑假附加费', value: this.seasonalSurcharge,
        note: `${this.pricing.peakSeasonRanges.filter(range => range.enabled).map(range => range.label).join('、')}；${associationPeakBreakdownText(peak)}；同一周课程与住宿只计一次，不参与优惠`,
      }] : []),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未成年学生外出须有成人陪同，门禁21:00；外宿和旅行要有家长同意。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  /** Textbooks: one 2,000-peso estimate for each started 8 weeks of each course type. */
  get textbookCount(): number { return cgTextbookPeriods(this.quotePlan.courses); }

  private get estimate() {
    const plan = this.quotePlan;
    const books = this.pricing.localFeeRules.find(rule => rule.id === 'books' && rule.enabled)?.amount ?? 2000;
    return estimateCgLocalFees(plan.stayWeeks, false, plan.roomWeeks, this.visaType, this.pricing.localFeeRules, plan.startDate, this.textbookCount, books);
  }

  get localFees(): SchoolLocalFee[] {
    const longTerm = !['tourist30', 'tourist59'].includes(this.visaType);
    return this.estimate.fees
      .filter(fee => !fee.excluded)
      .map(fee => ({
        item: fee.item,
        unitLabel: fee.amount,
        quantity: fee.quantity,
        total: fee.total,
        note: fee.note,
        ...(longTerm && fee.quantity === 0 && LONG_TERM_VISA_FEE_IDS.includes(fee.id ?? '') ? { waived: true } : {}),
      }));
  }

  /** Airport pickup (per person) and the refundable room deposit (per room week); both outside the local-fee total. */
  get referenceFees(): Array<{ id: string; label: string; total: number; note: string }> {
    return this.estimate.fees
      .filter(fee => fee.excluded)
      .map(fee => ({ id: fee.id ?? '', label: fee.item, total: fee.id === 'pickup' ? fee.total || this.ruleAmount('pickup') : fee.total, note: fee.note }));
  }

  private ruleAmount(id: string): number {
    return this.pricing.localFeeRules.find(rule => rule.id === id && rule.enabled)?.amount ?? 0;
  }
}

/** Pickup and deposit under the local fees, with a renminbi estimate; a group shows the totals for everyone. */
function cgOptionalFeeItems(pricing: CgQuotePricing, students: readonly CgPageStudent[], quote: PhSchoolQuote<CgPageStudent>): PhOptionalFeeItem[] {
  const count = students.length;
  const ids = [...new Set(students.flatMap(student => student.referenceFees.map(fee => fee.id)))];
  return ids.map(id => {
    const fees = students.flatMap(student => student.referenceFees.filter(fee => fee.id === id));
    const total = fees.reduce((sum, fee) => sum + fee.total, 0);
    const suffix = count > 1 ? `（${count}人合计）` : '';
    return {
      label: fees[0]?.label ?? '',
      amount: `${quote.formatPhp(total)}`,
      cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(total / pricing.phpPerCny), 'zh-CN')} 元`,
      note: `${fees[0]?.note ?? ''}${suffix}`,
    };
  });
}

export interface CgQuoteImageOptions {
  headingPrefix: string;
  schoolCode: string;
  schoolName: string;
  filePrefix: string;
  heroSrc: string;
}

export class CgQuote extends PhSchoolQuote<CgPageStudent> {
  constructor(pricing: CgQuotePricing, rules: CgCampusRules, image: CgQuoteImageOptions) {
    super(pricing, {
      createStudent: () => new CgPageStudent(pricing, rules),
      headingPrefix: image.headingPrefix,
      image: { schoolCode: image.schoolCode, schoolName: image.schoolName, filePrefix: image.filePrefix, heroSrc: image.heroSrc },
      priceMultiplier: weeks => cgPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => cgOptionalFeeItems(pricing, students, quote),
      layoutVersion: 2,
    });
  }
}

export class CgPlanComparison extends PhPlanComparison<CgPageStudent> {
  constructor(
    pricing: CgQuotePricing,
    rules: CgCampusRules,
    conditions: () => CgPageStudent,
    heading: string,
    courseGroups: ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>,
  ) {
    super(pricing, conditions, {
      createStudent: () => new CgPageStudent(pricing, rules),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading,
      courseGroups,
      layoutVersion: 2,
    });
  }
}
