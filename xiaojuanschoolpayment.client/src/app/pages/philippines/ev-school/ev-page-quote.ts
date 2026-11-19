// EV main campus on the shared Philippine school quote and plan comparison. EV's own prices,
// discount, surcharge, minor fee and local fees stay in EvStudentCalculator (ev-quote.ts); this
// file only hands its results to the template's quote and comparison. Keep it free of Angular, DOM
// and storage access, like the calculator.
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine, SchoolVisaType } from '../../../components/school-group-quote';
import { nextQuoteSunday } from '../../../components/school-quote-plan';
import { associationPeakBreakdownText, associationPeakRateForWeek } from '../association-peak-surcharge';
import type { CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import { EV_IELTS_GUARANTEE_ID } from './ev-content-config';
import { EvStudentCalculator, evPriceMultiplier } from './ev-quote';

export const EV_QUOTE_IMAGE_HERO = '/assets/ev/campus-exterior.webp';
const SIDA_RULE_ID = 'ev-sida-95';
const RETURNING_RULE_ID = 'ev-returning-registration';

/** Everything EV's quote reads; the page component is one. */
export interface EvQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  minorManagementFeePerPeriod: number;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const EV_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL', courseIds: ['semi-sparta-esl', 'sparta-intensive-esl'] },
  {
    id: 'speaking', label: '口语强化',
    courseIds: ['semi-sparta-power-speaking-6', 'semi-sparta-power-speaking-8', 'sparta-power-speaking-6', 'sparta-power-speaking-8'],
  },
  { id: 'ielts', label: '雅思', courseIds: ['sparta-ielts-regular', EV_IELTS_GUARANTEE_ID] },
  {
    id: 'specific', label: '托业／商务／社交媒体',
    courseIds: [
      'semi-sparta-toeic', 'semi-sparta-business', 'semi-sparta-social-media-english',
      'sparta-toeic', 'sparta-business', 'sparta-social-media-english',
    ],
  },
] as const;

const enabledRule = (pricing: EvQuotePricing, id: string): CiaPromotionRule | undefined =>
  pricing.promotions.find(rule => rule.id === id && rule.enabled);
const slashDate = (value: string) => value.replace(/-/g, '/');

/** One EV student as the template sees it. */
export class EvPageStudent implements PhPageStudent {
  readonly calculator: EvStudentCalculator;
  readonly visaOptions = SCHOOL_VISA_OPTIONS;

  constructor(private readonly pricing: EvQuotePricing) {
    this.calculator = new EvStudentCalculator(
      () => pricing.courseFees,
      () => pricing.roomFees,
      () => pricing.registrationFee,
      () => pricing.seasonalFeePerWeek,
      () => pricing.minorManagementFeePerPeriod,
      () => pricing.shortTermPriceRatios,
      () => pricing.peakSeasonRanges.filter(range => range.enabled !== false),
      () => enabledRule(pricing, SIDA_RULE_ID)?.discountValue ?? 0,
      () => pricing.localFeeRules,
      () => !!enabledRule(pricing, RETURNING_RULE_ID)?.waiveRegistration,
      nextQuoteSunday(),
    );
  }

  get quotePlan() { return this.calculator.plan; }
  get quoteError(): string {
    return this.calculator.plan.error || this.courseLengthError || this.calculator.error;
  }

  minimumWeeks(courseId: string): number {
    const course = this.pricing.courseFees.find(item => item.id === courseId);
    return course?.minimumWeeks ?? (courseId === EV_IELTS_GUARANTEE_ID ? 8 : 0);
  }

  /** IELTS Guarantee starts at 8 weeks (its rows add up, like the calculator's own check). */
  get courseLengthError(): string {
    const weeks = this.calculator.guaranteeWeeks;
    const minimum = this.minimumWeeks(EV_IELTS_GUARANTEE_ID);
    if (!weeks || weeks >= minimum) return '';
    const name = this.pricing.courseFees.find(item => item.id === EV_IELTS_GUARANTEE_ID)?.name ?? '雅思保分班';
    return `${name}须至少就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
  }

  get registration() { return this.calculator.registration; }
  get tuition() { return this.calculator.tuition; }
  get accommodation() { return this.calculator.accommodation; }
  get peakWeeks() { return this.calculator.peakWeeks; }
  get seasonalSurcharge() { return this.calculator.peakSurcharge; }
  get quoteUsd() { return this.calculator.totalUsd; }
  get localFees(): SchoolLocalFee[] { return this.calculator.localFees; }
  get promotionDiscountTotal() { return this.calculator.discountAmount; }
  get discountNames(): string {
    const rule = enabledRule(this.pricing, SIDA_RULE_ID);
    return rule && this.calculator.discountAmount > 0 ? rule.name : '';
  }

  get returningStudent() { return this.calculator.returningStudent; }
  set returningStudent(value: boolean) { this.calculator.returningStudent = value; }
  get visaType(): string { return this.calculator.visaType; }
  set visaType(value: string) { this.calculator.visaType = value as SchoolVisaType; }
  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get selectedAgeGroup(): 'adult' | 'minor' { return this.calculator.isMinorStudent ? 'minor' : 'adult'; }
  set selectedAgeGroup(value: 'adult' | 'minor') { this.calculator.isMinorStudent = value === 'minor'; }
  get minorNote(): string {
    return `未满18岁每4周加收未成年管理费${this.pricing.minorManagementFeePerPeriod}美元，不足4周按一期；平日不可外出，周末须监护人陪同。`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    const calculator = this.calculator;
    const plan = calculator.plan;
    const ranges = this.pricing.peakSeasonRanges.filter(range =>
      range.enabled !== false && plan.overlapWeeks(range.start, range.end, [...plan.courses, ...plan.rooms]) > 0);
    const sida = enabledRule(this.pricing, SIDA_RULE_ID);
    return [
      ...(calculator.peakSurcharge ? [{
        icon: '旺',
        label: '旺季附加费',
        value: calculator.peakSurcharge,
        note: `${associationPeakBreakdownText(calculator.peakCalculation)}；${ranges
          .map(range => `${range.label} ${slashDate(range.start)}–${slashDate(range.end)}`)
          .join('；')}；按课程与住宿实际覆盖周去重计收，不参与折扣`,
      }] : []),
      ...(sida && calculator.discountAmount ? [{
        icon: '惠',
        label: sida.name,
        value: -calculator.discountAmount,
        note: sida.description,
        promotionKey: sida.id,
      }] : []),
      ...(calculator.minorFee ? [{
        icon: '未',
        label: '未成年管理费',
        value: calculator.minorFee,
        note: `每4周${this.pricing.minorManagementFeePerPeriod}美元 × ${calculator.minorPeriods}期；不足4周按一期`,
      }] : []),
    ];
  }
}

/** Pickup and the room deposit stay outside the local-fee total; the deposit follows each student's stay. */
function evOptionalFeeItems(pricing: EvQuotePricing, students: readonly EvPageStudent[], quote: PhSchoolQuote<EvPageStudent>): PhOptionalFeeItem[] {
  const count = students.length;
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const deposit = rule.id === 'room-deposit';
      const total = deposit
        ? students.reduce((sum, student) => sum + student.calculator.roomDeposit, 0)
        : rule.amount * (rule.multiplyByStudents ? count : 1);
      const perPerson = !deposit && !rule.multiplyByStudents && count > 1;
      return {
        label: rule.name,
        amount: `${quote.formatPhp(total)}${perPerson ? '／人' : ''}`,
        cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(total / pricing.phpPerCny), 'zh-CN')} 元${perPerson ? '／人' : ''}`,
        note: `${rule.note}${deposit && count > 1 ? `（${count}人合计）` : ''}`,
      };
    });
}

export class EvQuote extends PhSchoolQuote<EvPageStudent> {
  constructor(pricing: EvQuotePricing) {
    super(pricing, {
      createStudent: () => new EvPageStudent(pricing),
      headingPrefix: 'EV主校区',
      image: { schoolCode: 'EV主校区', schoolName: '菲律宾宿务EV Academy', filePrefix: 'EV', heroSrc: EV_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => evPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => evOptionalFeeItems(pricing, students, quote),
    });
  }
}

export class EvPlanComparison extends PhPlanComparison<EvPageStudent> {
  constructor(pricing: EvQuotePricing, conditions: () => EvPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new EvPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'EV主校区 方案对比报价',
      courseGroups: EV_COMPARE_COURSE_GROUPS,
      peakRate: () => associationPeakRateForWeek('EV', '2027-01-03', pricing.seasonalFeePerWeek),
    });
  }
}
