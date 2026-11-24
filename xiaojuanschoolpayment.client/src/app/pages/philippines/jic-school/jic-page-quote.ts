// JIC (Challenger and Premium campuses) on the shared Philippine school quote and plan comparison.
// JIC's own prices, offers, peak surcharge and local fees stay in JicStudentQuote; this file only presents one
// student the way the template's PhSchoolQuote and PhPlanComparison read it. Each campus page quotes its own
// campus only. Keep it free of Angular, DOM and storage access (mini-program-ready).
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  JIC_COURSE_FEES,
  JIC_LOCAL_FEE_COPY,
  JIC_ODD_WEEK_FEE,
  JIC_ROOM_FEES,
  JicAirportPickup,
  JicCampus,
  JicCourseFee,
  JicRoomFee,
} from './jic-pricing';
import { JicQuoteRules, JicStudentQuote } from './jic-student-quote';

/** Everything the JIC page quote reads; the page component is one. */
export interface JicQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

export const JIC_CAMPUS_NAMES: Record<JicCampus, string> = {
  challenger: 'JIC Challenger',
  premium: 'JIC Premium',
};

export const JIC_QUOTE_IMAGE_HERO: Record<JicCampus, string> = {
  challenger: '/assets/philippines/jic-main-campus-overview.webp',
  premium: '/assets/philippines/jic-premium-campus-overview.jpg',
};

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const JIC_COMPARE_COURSE_GROUPS: Record<JicCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>> = {
  challenger: [
    { id: 'ielts', label: '雅思', courseIds: ['challenger-ielts-lite', 'challenger-ielts-core', 'challenger-ielts-standard'] },
    { id: 'esl', label: '一般英语', courseIds: ['challenger-esl-lite', 'challenger-esl-core', 'challenger-esl-standard'] },
  ],
  premium: [
    { id: 'speaking', label: '口语', courseIds: ['premium-speaking-starter-7', 'premium-speaking-pro-8', 'premium-speaking-master-8'] },
    { id: 'tep', label: '主题英语', courseIds: ['premium-tep-8', 'premium-tep-9', 'premium-tep-10'] },
    { id: 'career', label: '托业／商务／打工度假', courseIds: ['premium-toeic', 'premium-business-master-8', 'premium-working-holiday-8'] },
    { id: 'senior', label: '银发课程', courseIds: ['premium-active-senior-5', 'premium-active-senior-6'] },
  ],
};

/** Multiple of the four-week price for a row of this many weeks (1/2/3 weeks: 40/65/85%, longer ones proportional). */
export const jicPriceMultiplier = (weeks: number): number => ({ 1: 0.4, 2: 0.65, 3: 0.85 } as Record<number, number>)[weeks] ?? weeks / 4;

const VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

const PICKUP_OPTIONS: ReadonlyArray<{ value: JicAirportPickup; label: string }> = [
  { value: 'none', label: '不需要' },
  { value: 'manila', label: '马尼拉机场（3,000比索）' },
  { value: 'clark', label: '克拉克机场（3,000比索）' },
];
const ELECTIVE_OPTIONS = [
  { value: false, label: '不参加' },
  { value: true, label: '参加（2,000比索／4周）' },
] as const;

/** One of JIC's choices under 学生情况 (template: PhPageStudent.extraChoices). */
interface JicExtraChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * The JIC catalog the student calculator reads, built from the page's (published) course and room prices.
 * Rebuilt only when the page replaces its price lists, so the quote form's option lists stay stable.
 */
class JicCatalogView {
  private courseSource?: readonly CiaQuoteCourse[];
  private roomSource?: readonly CiaQuoteRoom[];
  private courseCache: JicCourseFee[] = [];
  private roomCache: JicRoomFee[] = [];

  constructor(private readonly pricing: JicQuotePricing, private readonly campus: JicCampus) {}

  get courseFees(): JicCourseFee[] {
    // The page builds its quote before its price lists; until then the compiled catalog gives the first selections.
    if (!this.pricing.courseFees) return JIC_COURSE_FEES.filter(course => course.campus === this.campus);
    if (this.courseSource !== this.pricing.courseFees) {
      this.courseSource = this.pricing.courseFees;
      const fallback = JIC_COURSE_FEES.find(course => course.campus === this.campus)!;
      this.courseCache = this.pricing.courseFees.map(item => {
        const base = JIC_COURSE_FEES.find(course => course.id === item.id);
        return {
          ...(base ?? { ...fallback, materialFee: undefined, minimumWeeks: undefined }),
          id: item.id,
          campus: this.campus,
          displayName: item.name,
          tuition: item.tuition2027 || item.tuition,
          schedule: item.schedule,
          suitable: item.suitable,
          note: item.note,
          minimumWeeks: item.minimumWeeks && item.minimumWeeks > 1 ? item.minimumWeeks : base?.minimumWeeks,
        };
      });
    }
    return this.courseCache;
  }

  get roomFees(): JicRoomFee[] {
    if (!this.pricing.roomFees) return JIC_ROOM_FEES.filter(room => room.campus === this.campus);
    if (this.roomSource !== this.pricing.roomFees) {
      this.roomSource = this.pricing.roomFees;
      const fallback = JIC_ROOM_FEES.find(room => room.campus === this.campus)!;
      this.roomCache = this.pricing.roomFees.map(item => ({
        ...(JIC_ROOM_FEES.find(room => room.id === item.id) ?? { ...fallback, premium2027SingleEligible: undefined }),
        id: item.id,
        campus: this.campus,
        name: item.name,
        fee: item.fee,
        note: item.note,
      }));
    }
    return this.roomCache;
  }

  get registrationFee(): number { return this.pricing.registrationFee; }
  get seasonalFeePerWeek(): number { return this.pricing.seasonalFeePerWeek; }
  get rules(): JicQuoteRules | undefined {
    if (!this.pricing.localFeeRules) return undefined;
    return {
      localFees: this.pricing.localFeeRules,
      promotions: this.pricing.promotions ?? [],
      peakSeasonRanges: [...this.pricing.peakSeasonRanges],
    };
  }
}

/** One JIC student as the template binds it: conditions, JIC's own choices and every amount. */
export class JicPageStudent implements PhPageStudent {
  readonly visaOptions = VISA_OPTIONS;
  readonly quote: JicStudentQuote;
  private ageGroup: 'adult' | 'minor' = 'adult';
  /** Airport pickup, and the Challenger's paid morning and evening classes, shown under 学生情况. */
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly catalog: JicCatalogView, readonly campus: JicCampus) {
    this.quote = new JicStudentQuote(catalog);
    this.quote.setCampus(campus);
    const student = this;
    const pickup: JicExtraChoice<JicAirportPickup> = {
      label: '机场接机',
      options: PICKUP_OPTIONS,
      visible: true,
      inComparison: false,
      get note() {
        return student.quote.airportPickup === 'none' ? ''
          : '周日BESA团体接机，计入到校学杂费；其他日子要单独派车，费用另计。';
      },
      get value() { return student.quote.airportPickup; },
      set value(value: JicAirportPickup) { student.quote.airportPickup = value; },
    };
    const elective: JicExtraChoice<boolean> = {
      label: '付费特别课',
      options: ELECTIVE_OPTIONS,
      visible: campus === 'challenger',
      inComparison: false,
      get note() { return student.quote.includeChallengerSpecialElective ? '每天07:00和17:00各30分钟，每两周在公告栏报名，计入到校学杂费。' : ''; },
      get value() { return student.quote.includeChallengerSpecialElective; },
      set value(value: boolean) { student.quote.includeChallengerSpecialElective = value; },
    };
    this.extraChoices = [pickup, elective];
  }

  get quotePlan(): SchoolQuotePlan { return this.quote.quotePlan; }

  // ---- conditions -------------------------------------------------------------------------------

  get visaType(): string { return this.quote.visaType; }
  set visaType(value: string) { this.quote.visaType = value === 'tourist59' ? 'tourist59' : 'tourist30'; }
  get visaLabel(): string { return VISA_OPTIONS.find(option => option.value === this.visaType)?.label ?? ''; }

  get selectedAgeGroup(): 'adult' | 'minor' { return this.ageGroup; }
  set selectedAgeGroup(value: 'adult' | 'minor') { this.ageGroup = value; }

  get minorNote(): string {
    return 'JIC一般课程须年满18岁；未成年学生能否入学、课程和监护安排须由顾问先向学校确认。';
  }

  /** Returning students waive registration (the waiver line is left out; registration counts as 0). */
  get returningStudent(): boolean { return this.quote.returningStudent; }
  set returningStudent(value: boolean) { this.quote.returningStudent = value; }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.catalog.courseFees.find(course => course.id === courseId)?.minimumWeeks ?? 0;
  }

  /** IELTS Guarantee runs 8 weeks without a break. */
  get courseLengthError(): string {
    for (const course of this.catalog.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum > 1 && weeks && weeks < minimum) return `${course.displayName}须连续就读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  get quoteError(): string { return this.quote.quoteError || this.courseLengthError; }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number { return this.returningStudent ? 0 : this.catalog.registrationFee; }
  get tuition(): number { return this.quote.tuition; }
  get accommodation(): number { return this.quote.accommodation; }
  get peakWeeks(): number { return this.quote.peakWeeks; }
  get seasonalSurcharge(): number { return this.quote.seasonalSurcharge; }
  /** Registration plus its equal waiver line nets to zero, so the total is the same for new and returning students. */
  get quoteUsd(): number { return round(this.quote.quoteUsd); }

  get paymentLines(): SchoolPaymentLine[] {
    return this.quote.paymentLines.filter(line =>
      line.value !== 0 && !(line.promotionKey === 'jic-registration' && this.returningStudent));
  }

  private get discountLines(): SchoolPaymentLine[] { return this.paymentLines.filter(line => line.value < 0); }
  get promotionDiscountTotal(): number { return round(this.discountLines.reduce((sum, line) => sum - line.value, 0)); }
  get discountNames(): string { return this.discountLines.map(line => line.label).join('、'); }

  // ---- local fees -------------------------------------------------------------------------------

  get localFees(): SchoolLocalFee[] { return this.quote.localFees; }
}

/** The refundable deposit, and the odd-week fee when the stay does not follow JIC's term dates. */
function jicOptionalFees(students: readonly JicPageStudent[], quote: PhSchoolQuote<JicPageStudent>, pricing: JicQuotePricing): PhOptionalFeeItem[] {
  const cny = (php: number) => `约人民币 ${quoteCurrencyText(Math.round(php / pricing.phpPerCny), 'zh-CN')} 元`;
  const rule = (id: string) => pricing.localFeeRules?.find(item => item.id === id && item.enabled);
  const count = students.length;
  const items: PhOptionalFeeItem[] = [];
  const depositRule = rule('room-deposit');
  if (depositRule) {
    const deposit = depositRule.amount * count;
    items.push({
      label: depositRule.name,
      amount: quote.formatPhp(deposit),
      cnyAmount: cny(deposit),
      note: `${depositRule.note || JIC_LOCAL_FEE_COPY.deposit}${count > 1 ? `（${count}人）` : ''}`,
    });
  }
  const events = students.reduce((sum, student) => sum + student.quote.oddWeekEvents, 0);
  const oddRule = rule('odd-week-arrival');
  if (events > 0 && oddRule) {
    const total = (oddRule.amount || JIC_ODD_WEEK_FEE) * events;
    items.push({
      label: oddRule.name,
      amount: quote.formatPhp(total),
      cnyAmount: cny(total),
      note: `JIC每两周开一次新学期；本次${events}次不在开学日入学或不在学期末结业，每次另收8,000比索，以学校确认为准。`,
    });
  }
  return items;
}

export class JicQuote extends PhSchoolQuote<JicPageStudent> {
  constructor(pricing: JicQuotePricing, campus: JicCampus) {
    const catalog = new JicCatalogView(pricing, campus);
    super(pricing, {
      createStudent: () => new JicPageStudent(catalog, campus),
      headingPrefix: JIC_CAMPUS_NAMES[campus],
      image: {
        schoolCode: 'JIC',
        schoolName: campus === 'challenger' ? '菲律宾碧瑶JIC Challenger 挑战校区' : '菲律宾碧瑶JIC Premium 高级校区',
        filePrefix: campus === 'challenger' ? 'JIC-Challenger' : 'JIC-Premium',
        heroSrc: JIC_QUOTE_IMAGE_HERO[campus],
      },
      priceMultiplier: jicPriceMultiplier,
      optionalFeeItems: (students, quote) => jicOptionalFees(students, quote, pricing),
      layoutVersion: 2,
    });
  }
}

export class JicPlanComparison extends PhPlanComparison<JicPageStudent> {
  constructor(pricing: JicQuotePricing, campus: JicCampus, conditions: () => JicPageStudent) {
    const catalog = new JicCatalogView(pricing, campus);
    super(pricing, conditions, {
      createStudent: () => new JicPageStudent(catalog, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: `${JIC_CAMPUS_NAMES[campus]} 方案对比报价`,
      courseGroups: JIC_COMPARE_COURSE_GROUPS[campus],
      layoutVersion: 2,
    });
  }
}
