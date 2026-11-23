// IU and ICL on the shared Philippine school quote and plan comparison. Each campus's own prices, the joint
// low-season packages, the 思达启航9折 and the local fees are calculated here per student; the template's
// PhSchoolQuote and PhPlanComparison only add students up and lay out the result. The two campuses never share a
// price: every amount comes from the campus's own content document. Keep this file free of Angular, DOM and storage
// access, so the WeChat mini program can bundle it later.
import type { QuoteImageCardData } from '../../../components/quote-image-download-button.component';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import { createCiaQuotePricing, CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePlanResult, PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  IU_ICL_LOW_SEASON_END,
  IU_ICL_LOW_SEASON_RULE_ID,
  IU_ICL_LOW_SEASON_START,
  IU_ICL_PACKAGE_PRICES,
  IU_ICL_RETURNING_RULE_ID,
  IU_ICL_SIDA_RULE_ID,
  IuIclCampus,
  IuIclPromoCourse,
  IuIclPromoRoom,
  iuIclStaysAtSchool,
} from './iu-icl-content-config';

const DAY = 86400000;

/** The school-package facts of one campus's courses and rooms, read from its content document. */
export interface IuIclPackageData {
  courses: Readonly<Record<string, { promoCourse?: IuIclPromoCourse; fixedWeeks?: number }>>;
  rooms: Readonly<Record<string, { promoRoom?: IuIclPromoRoom }>>;
  prices: Readonly<Record<string, Readonly<Record<string, number>>>>;
}

export const iuIclPackageData = (content: CiaContentConfig): IuIclPackageData => ({
  courses: Object.fromEntries(content.courses.map(item => [item.id, { promoCourse: item.promoCourse, fixedWeeks: item.fixedWeeks }])),
  rooms: Object.fromEntries(content.rooms.map(item => [item.id, { promoRoom: item.promoRoom }])),
  prices: content.quoteSettings.iuIclPackagePrices ?? IU_ICL_PACKAGE_PRICES,
});

/** Everything the IU/ICL quote reads; the page component is one. */
export interface IuIclQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  readonly iuIclPackages: IuIclPackageData;
}

export const IU_ICL_SCHOOL_NAMES: Record<IuIclCampus, string> = {
  IU: '菲律宾宿务IU English Academy',
  ICL: '菲律宾宿务ICL English Academy',
};

export const IU_ICL_QUOTE_IMAGE_HERO: Record<IuIclCampus, string> = {
  IU: '/assets/iu/campus/campus-building.webp',
  ICL: '/assets/icl/campus/campus-building.webp',
};

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const IU_ICL_COMPARE_COURSE_GROUPS: Record<IuIclCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>> = {
  IU: [
    { id: 'speaking', label: '口语课程', courseIds: ['light-esl', 'power-speaking-4', 'power-speaking-6', 'power-speaking-8'] },
    { id: 'ielts', label: '雅思', courseIds: ['ielts', 'ielts-guarantee-8', 'ielts-guarantee-12'] },
    { id: 'beginner', label: '初学者', courseIds: ['beginner-4', 'beginner-6'] },
    { id: 'business', label: '商务英语', courseIds: ['business-4', 'business-6'] },
  ],
  ICL: [
    { id: 'speaking', label: '口语课程', courseIds: ['light-speaking', 'power-speaking-4', 'power-speaking-6', 'power-speaking-8'] },
    { id: 'ielts', label: '雅思', courseIds: ['ielts', 'ielts-guarantee-8', 'ielts-guarantee-12'] },
    { id: 'business', label: '商务英语', courseIds: ['business-4', 'business-6'] },
  ],
};

/** Price ratio of a 1–3 week row (40/60/80%); four weeks and longer are proportional. */
export const iuIclPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const round2 = (value: number): number => Math.round(value * 100) / 100;

interface IuIclPackage {
  course: QuotePlanRow;
  room: QuotePlanRow;
  /** Course plus room at the regular price, before any discount. */
  regular: number;
  price: number;
}

/** One IU or ICL student: plan, conditions and every amount the template and quote image show. */
export class IuIclPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: IuIclQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'power-speaking-4', 'campus-triple', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * iuIclPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  private get packages(): IuIclPackageData { return this.pricing.iuIclPackages; }

  /** Guarantee courses run only as a whole 8-week or 12-week block. */
  minimumWeeks(courseId: string): number {
    return this.packages.courses[courseId]?.fixedWeeks ?? 0;
  }

  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const fixed = this.packages.courses[course.id]?.fixedWeeks;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (fixed && weeks && weeks !== fixed) return `${course.name}只能读${fixed}周，请把课程周数改为${fixed}周。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.packageMixError;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private get lowSeasonRule(): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.enabled && (rule.ruleKind === IU_ICL_LOW_SEASON_RULE_ID || rule.id === IU_ICL_LOW_SEASON_RULE_ID));
  }

  private get window(): { from: string; through: string; minimum: number } {
    const rule = this.lowSeasonRule;
    return {
      from: rule?.coverageStart || IU_ICL_LOW_SEASON_START,
      through: rule?.coverageEnd || IU_ICL_LOW_SEASON_END,
      minimum: Math.max(rule?.minimumCourseWeeks ?? 4, rule?.minimumAccommodationWeeks ?? 4, 4),
    };
  }

  private packagePrice(courseId: string, roomId: string, weeks: number): number | undefined {
    const promoCourse = this.packages.courses[courseId]?.promoCourse;
    const promoRoom = this.packages.rooms[roomId]?.promoRoom;
    const table = promoCourse && promoRoom ? this.packages.prices[promoCourse]?.[promoRoom] : undefined;
    if (table === undefined) return undefined;
    const fixed = this.packages.courses[courseId]?.fixedWeeks;
    if (fixed) return fixed === weeks ? table : undefined;
    return Math.round(table * weeks / 4);
  }

  /**
   * School packages: a package course and a campus room starting on the same Sunday for the same weeks (at least 4),
   * wholly inside the low-season window. The package price replaces both, so neither is discounted again.
   */
  private get appliedPackages(): IuIclPackage[] {
    if (!this.lowSeasonRule) return [];
    const { from, through, minimum } = this.window;
    const rooms = this.quotePlan.mergedRows('room').map(row => ({ row, used: false }));
    const result: IuIclPackage[] = [];
    for (const course of this.quotePlan.mergedRows('course')) {
      if (course.weeks < minimum || course.startDate < from || this.quotePlan.end(course) > through) continue;
      const match = rooms.find(item => !item.used && item.row.startDate === course.startDate && item.row.weeks === course.weeks);
      if (!match) continue;
      const price = this.packagePrice(course.optionId, match.row.optionId, course.weeks);
      if (price === undefined) continue;
      match.used = true;
      const regular = this.quotePlan.price('course', course) + this.quotePlan.price('room', match.row);
      result.push({ course, room: match.row, regular, price: Math.min(price, regular) });
    }
    return result;
  }

  /** Package weeks a split plan (a change of course or room inside the window) leaves unpriced. */
  private get packageMixError(): string {
    if (!this.lowSeasonRule || (this.quotePlan.courses.length < 2 && this.quotePlan.rooms.length < 2)) return '';
    const { from, through, minimum } = this.window;
    const start = Date.parse(`${from}T00:00:00Z`);
    const end = Date.parse(`${through}T00:00:00Z`);
    const packageRoomWeeks = new Set(this.quotePlan.weekStarts(this.quotePlan.rooms.filter(row => this.packages.rooms[row.optionId]?.promoRoom)));
    const eligible = this.quotePlan.weekStarts(this.quotePlan.courses.filter(row => this.packages.courses[row.optionId]?.promoCourse))
      .filter(week => packageRoomWeeks.has(week) && week >= start && week + 6 * DAY <= end);
    if (eligible.length < minimum) return '';
    const priced = new Set(this.appliedPackages.flatMap(item => this.quotePlan.weekStarts([item.course])));
    return eligible.some(week => !priced.has(week)) ? '淡季套餐期间中途换课或换房，套餐价请联系顾问确认。' : '';
  }

  private get packageRegular(): number { return round2(this.appliedPackages.reduce((sum, item) => sum + item.regular, 0)); }
  private get packageDiscount(): number { return round2(this.appliedPackages.reduce((sum, item) => sum + item.regular - item.price, 0)); }

  /** 思达启航9折 on the course and room charges the packages do not cover. */
  private get sidaDiscount(): number {
    const rule = this.enabledRule(IU_ICL_SIDA_RULE_ID);
    if (!rule || rule.discountType !== 'percentage') return 0;
    const base = Math.max(0, this.tuition + this.accommodation - this.packageRegular);
    return round2(base * rule.discountValue / 100);
  }

  get promotionDiscountTotal(): number { return round2(this.packageDiscount + this.sidaDiscount); }

  get discountNames(): string {
    return [
      this.appliedPackages.length ? this.lowSeasonRule?.name ?? '校方淡季套餐价' : '',
      this.sidaDiscount > 0 ? this.enabledRule(IU_ICL_SIDA_RULE_ID)?.name ?? '' : '',
    ].filter(Boolean).join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  /** Set when the package waived the registration fee of a new student. */
  get registrationWaiverName(): string | undefined {
    return !this.returningStudent && this.appliedPackages.length && this.lowSeasonRule?.waiveRegistration
      ? this.lowSeasonRule.name : undefined;
  }

  get registration(): number {
    if (this.returningStudent && this.enabledRule(IU_ICL_RETURNING_RULE_ID)) return 0;
    return this.registrationWaiverName !== undefined ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get quoteUsd(): number {
    return Math.max(0, round2(this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    const packages = this.appliedPackages;
    if (packages.length) {
      const rule = this.lowSeasonRule!;
      const detail = packages.map(item => `${item.course.weeks}周课程＋校内宿舍套餐价${item.price.toLocaleString('en-US')}美元`).join('；');
      lines.push({
        icon: '惠', label: rule.name, value: -this.packageDiscount,
        note: `${detail}（原价${this.packageRegular.toLocaleString('en-US')}美元），已免注册费，套餐部分不再打折`,
        promotionKey: rule.id,
      });
    }
    const sida = this.sidaDiscount;
    if (sida > 0) {
      const rule = this.enabledRule(IU_ICL_SIDA_RULE_ID)!;
      lines.push({ icon: '折', label: rule.name, value: -sida, note: rule.description, promotionKey: rule.id });
    }
    return lines;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁外出须有监护人陪同，并提前向前台或学生经理提交外出申请；没有家长同行的未成年学生，手机按学校规定的时间管理。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** 30-day entry: one extension at 5–8 weeks, two at 9–12 …; 59-day entry: the first at 9–12 weeks. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const covered = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - covered) / 4));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaSequence(rule: CiaLocalFeeRule): readonly number[] {
    return (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks === 1 ? `${formatPhp(rule.amount)}／周`
        : rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const extensions = this.visaExtensionCount;
    const visaRule = this.rule('visa-extension');
    const sequence = visaRule ? this.visaSequence(visaRule) : [];
    const visaTotal = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0).reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `按${this.visaLabel}预估，${extensions ? `本次${extensions}次` : '本次无需延期'}；${visaRule?.note ?? ''}`;
    const roomWeeks = plan.rooms.filter(row => iuIclStaysAtSchool(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
    const staying = roomWeeks > 0 ? 1 : 0;
    const courseTypes = new Set(plan.courses.map(row => row.optionId)).size;
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('visa-extension', extensions, visaNote, visaTotal, visaRule ? `${formatPhp(sequence[0] ?? visaRule.amount)}起／次` : undefined),
      ...create('acr-i-card', !longTerm && plan.stayWeeks >= 9 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('textbooks', courseTypes, undefined, undefined, `${formatPhp(this.rule('textbooks')?.amount ?? 0)}／种课程`),
      ...create('airport-pickup', staying),
      ...create('room-deposit', staying),
      ...create('maintenance', roomWeeks),
      ...create('electricity', roomWeeks),
      ...create('laundry', roomWeeks),
    ].map(item => longTerm && item.quantity === 0 && item.note === longTermNote ? { ...item, waived: true } : item);
  }
}

export class IuIclQuote extends PhSchoolQuote<IuIclPageStudent> {
  constructor(pricing: IuIclQuotePricing, campus: IuIclCampus) {
    super(pricing, {
      createStudent: () => new IuIclPageStudent(pricing),
      headingPrefix: campus,
      image: { schoolCode: campus, schoolName: IU_ICL_SCHOOL_NAMES[campus], filePrefix: campus, heroSrc: IU_ICL_QUOTE_IMAGE_HERO[campus] },
      priceMultiplier: weeks => iuIclPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      layoutVersion: 2,
    });
  }
}

export class IuIclPlanComparison extends PhPlanComparison<IuIclPageStudent> {
  constructor(pricing: IuIclQuotePricing, campus: IuIclCampus, conditions: () => IuIclPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new IuIclPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: `${campus} 方案对比报价`,
      courseGroups: IU_ICL_COMPARE_COURSE_GROUPS[campus],
      peakRate: () => 0,
      extraNotes: (results: readonly PhComparePlanResult[]) => results.some(item => item.discountNames.includes('套餐'))
        ? ['校方淡季套餐价只适用于2026/09/01–2027/01/16期间、同日期课程和校内宿舍读满4周的方案。'] : [],
      layoutVersion: 2,
    });
  }
}

/** The employee quote-image editor's preview: one sample student priced only from the edited document. */
export function iuIclPreviewQuoteImage(
  content: CiaContentConfig, campus: IuIclCampus, rates: { usdToCny: number; phpPerCny: number; date: string },
): QuoteImageCardData {
  const pricing: IuIclQuotePricing = {
    ...createCiaQuotePricing(content),
    usdToCny: rates.usdToCny,
    phpPerCny: rates.phpPerCny,
    exchangeRateDate: rates.date,
    usingLiveExchangeRates: Number.isFinite(rates.usdToCny),
    iuIclPackages: iuIclPackageData(content),
  };
  return new IuIclQuote(pricing, campus).quoteImageData;
}
