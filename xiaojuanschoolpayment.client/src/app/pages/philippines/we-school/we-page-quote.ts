// WE Academy on the shared Philippine school quote and plan comparison. WE's own prices, 2027 off-season
// promotion, season minimums, dormitory/WE Residence rules and local fees are calculated here per student; the
// template's PhSchoolQuote and PhPlanComparison only add students up and lay out the result. Keep this file free
// of Angular, DOM and storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePlanResult, PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  WE_BUSY_MONTHS,
  WE_BUSY_SEASON_DEPOSIT_USD,
  WE_DORM_SINGLE_ID,
  WE_GUARDIAN_COURSE_ID,
  WE_JUNIOR_COURSE_IDS,
  WE_KINDER_COURSE_ID,
  WE_NO_CLASS_COURSE_ID,
  WE_NO_DORM_SINGLE_COURSE_IDS,
  WE_PROMOTION_2027,
  WE_RESIDENCE_ROOM_IDS,
  WE_RETURNING_RULE_ID,
  WE_SIDA_RULE_ID,
} from './we-content-config';

export const WE_QUOTE_IMAGE_HERO = '/assets/we/campus/building-1.webp';
/** The agency discount the school allows for a WE Residence stay in the busy season (residence notice, November 2026). */
const RESIDENCE_BUSY_SIDA_RATE = 5;
const DAY = 86400000;

/** Everything WE's quote reads; the page component is one. */
export interface WeQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const WE_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '一般英语', courseIds: ['esl-4', 'esl-5', 'esl-6'] },
  { id: 'native', label: '外教混合', courseIds: ['native-mix-light', 'native-mix-general', 'native-mix-intensive'] },
  { id: 'exam', label: '考试与商务', courseIds: ['toeic', 'toefl', 'ielts', 'business'] },
  { id: 'junior', label: '青少年与幼儿', courseIds: [...WE_JUNIOR_COURSE_IDS, WE_KINDER_COURSE_ID] },
  { id: 'golf', label: '高尔夫英语', courseIds: ['esl-golf', 'esl-golf-round'] },
] as const;

/** Price ratio of a 1–3 week row (35%/60%/80% of four weeks); four weeks and longer are proportional. */
export const wePriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const isResidence = (row: QuotePlanRow): boolean => WE_RESIDENCE_ROOM_IDS.includes(row.optionId);
/** A study week (Sunday start) is busy when one of its class days, Monday to Friday, falls in a busy month. */
const busyWeek = (start: number): boolean =>
  [1, 5].some(offset => WE_BUSY_MONTHS.includes(new Date(start + offset * DAY).getUTCMonth() + 1));
/** Whether any study week between two dates (Sunday start, Saturday end) is a busy week. */
export const weStayTouchesBusySeason = (startDate: string, endDate: string): boolean => {
  const start = parseDay(startDate), end = parseDay(endDate);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  for (let week = start; week <= end; week += 7 * DAY) if (busyWeek(week)) return true;
  return false;
};
const BUSY_DEPOSIT_NOTE = `本次入住含旺季（12–2月、6–8月），报名时须与注册费一起先付押金${WE_BUSY_SEASON_DEPOSIT_USD}美元，可抵扣学费全款，不是额外费用。`;

/** One WE student: plan, conditions and every amount the template and quote image show. */
export class WePageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: WeQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'esl-4', 'dorm-twin', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * wePriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  // ---- plan facts -------------------------------------------------------------------------------

  private get residenceRows(): QuotePlanRow[] { return this.quotePlan.rooms.filter(isResidence); }
  private get dormRows(): QuotePlanRow[] { return this.quotePlan.rooms.filter(row => !isResidence(row)); }
  /** A parent at WE Residence who takes no class: no tuition, no SSP and no agency discount. */
  get noClass(): boolean { return this.quotePlan.courses.every(row => row.optionId === WE_NO_CLASS_COURSE_ID); }
  private busyWeeks(rows: QuotePlanRow[]): number { return this.quotePlan.weekStarts(rows).filter(busyWeek).length; }
  get touchesBusySeason(): boolean {
    return this.busyWeeks([...this.quotePlan.courses, ...this.quotePlan.rooms]) > 0;
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(_courseId: string): number { return 0; }

  /** Season minimums: WE Residence 4 weeks in the busy season, otherwise 2; dormitory 2 weeks in the busy season. */
  get stayLengthError(): string {
    const residenceWeeks = this.quotePlan.weekStarts(this.residenceRows).length;
    if (residenceWeeks) {
      const minimum = this.busyWeeks(this.residenceRows) ? 4 : 2;
      if (residenceWeeks < minimum) return `WE公寓旺季（12–2月、6–8月）至少住4周，淡季至少2周；本次须住满${minimum}周，请调整周数。`;
    }
    const dormWeeks = this.quotePlan.weekStarts(this.dormRows).length;
    if (dormWeeks && dormWeeks < 2 && this.busyWeeks(this.dormRows)) return '旺季（12–2月、6–8月）住宿舍至少2周，请调整周数。';
    return '';
  }

  get courseRoomError(): string {
    const courses = this.quotePlan.courses.map(row => row.optionId);
    if (courses.includes(WE_NO_CLASS_COURSE_ID) && this.dormRows.length) {
      return '只陪读不上课仅限住WE公寓的家长；住宿舍的家长须报一门课程（可选家长英语ESL 3，课时可转给孩子）。';
    }
    if (courses.some(id => WE_NO_DORM_SINGLE_COURSE_IDS.includes(id)) && this.dormRows.some(row => row.optionId === WE_DORM_SINGLE_ID)) {
      return '家长英语ESL 3、青少年和幼儿园课程不能住宿舍单人间，请改选双人间、三人间、四人间、家庭房或WE公寓。';
    }
    const childCourse = courses.some(id => [...WE_JUNIOR_COURSE_IDS, WE_KINDER_COURSE_ID].includes(id));
    if (childCourse && this.selectedAgeGroup === 'adult') return '青少年和幼儿园课程只收未成年学生，请在学生情况里改选未满18岁。';
    const parentCourse = courses.some(id => [WE_GUARDIAN_COURSE_ID, WE_NO_CLASS_COURSE_ID].includes(id));
    if (parentCourse && this.selectedAgeGroup === 'minor') return '家长英语和只陪读不上课须由成年监护人报名，请调整学生情况或课程。';
    return '';
  }

  /** Shown right under the plan: a course/room combination or stay length WE does not accept. */
  get courseLengthError(): string { return this.courseRoomError || this.stayLengthError; }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  // ---- promotions -------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Study weeks inside the offer's dates, in its courses or rooms (all stay weeks when it names neither). */
  coveredWeeks(rule: CiaPromotionRule): number {
    const plan = this.quotePlan;
    const rows = rule.eligibleRoomIds?.length
      ? plan.rooms.filter(row => rule.eligibleRoomIds!.includes(row.optionId))
      : rule.eligibleCourseIds?.length
        ? plan.courses.filter(row => rule.eligibleCourseIds!.includes(row.optionId))
        : [...plan.courses, ...plan.rooms];
    const starts = plan.weekStarts(rows);
    if (!rule.coverageStart || !rule.coverageEnd) return starts.length;
    const from = parseDay(rule.coverageStart);
    const through = parseDay(rule.coverageEnd);
    return starts.filter(start => start >= from && start + 6 * DAY <= through).length;
  }

  /** The stay starts on or after the offer's first Sunday and has at least two weeks inside its dates. */
  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    const start = this.quotePlan.startDate;
    if (rule.arrivalStart && start < rule.arrivalStart) return false;
    if (rule.arrivalEnd && start > rule.arrivalEnd) return false;
    if (rule.coverageStart && rule.coverageEnd) {
      const stayWeeks = this.coveredWeeks({ ...rule, eligibleCourseIds: undefined, eligibleRoomIds: undefined });
      if (stayWeeks < WE_PROMOTION_2027.minimumWeeks) return false;
    }
    return this.coveredWeeks(rule) > 0;
  }

  /** School cash offers (the 2027 off-season course, guardian and room discounts). */
  private get schoolPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.enabled && rule.id !== WE_SIDA_RULE_ID && rule.discountType === 'per-course-week')
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.eligible(rule) ? this.coveredWeeks(rule) * rule.discountValue : 0 }))
      .filter(item => item.amount > 0);
  }

  /** 思达启航折扣: 10% of the full course and room price, taken before the school's offers (WE's files set no order,
   *  so the order that is cheaper for the student is used); 5% for a busy-season WE Residence stay; none without a class. */
  get sidaRate(): number {
    const rule = this.enabledRule(WE_SIDA_RULE_ID);
    if (!rule || this.noClass) return 0;
    return this.busyWeeks(this.residenceRows) ? Math.min(rule.discountValue, RESIDENCE_BUSY_SIDA_RATE) : rule.discountValue;
  }

  private get sidaAmount(): number {
    return Math.round((this.tuition + this.accommodation) * this.sidaRate) / 100;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    const sida = this.enabledRule(WE_SIDA_RULE_ID);
    const amount = this.sidaAmount;
    return [...(sida && amount > 0 ? [{ rule: sida, amount }] : []), ...this.schoolPromotions];
  }

  /** Non-cash offers (the free native option class) that this plan qualifies for. */
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

  get registration(): number {
    return this.returningStudent && !!this.enabledRule(WE_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal;
    return Math.max(0, Math.round(total * 100) / 100);
  }

  /** The busy-season deposit is paid with the registration fee but is not part of the school total. */
  get extraPaymentNote(): string { return this.touchesBusySeason ? BUSY_DEPOSIT_NOTE : ''; }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.id === WE_SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: rule.id === WE_SIDA_RULE_ID
          ? `课程费和住宿费按原价享${this.sidaRate === 5 ? '95' : (100 - this.sidaRate) / 10}折${this.sidaRate < rule.discountValue ? '（旺季住WE公寓）' : ''}`
          : `${rule.description}；本次${this.coveredWeeks(rule)}周`,
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
    return '4–6岁可读幼儿园课程，小学到初中可读青少年课程；未成年学生须由父母等直系亲属陪同（监护人须为成年人），外出须由监护人带领。';
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
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const visaLabel = this.visaLabel;
    const longTermNote = `${visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const noClassNote = '只陪读不上课，不用办SSP学习许可。';
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks === 1 ? '' : rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note, ...(longTerm && note === longTermNote ? { waived: true } : {}) }];
    };
    const sspQuantity = longTerm || this.noClass ? 0 : 1;
    const sspNote = longTerm ? longTermNote : this.noClass ? noClassNote : undefined;
    const visaRule = this.rule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaTotal = visaAmounts.reduce((sum, amount) => sum + amount, 0);
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${visaLabel}预估，本次${extensions}次` : `按${visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const dormWeeks = plan.weekStarts(this.dormRows).length;
    const residenceWeeks = plan.weekStarts(this.residenceRows).length;
    return [
      ...create('ssp', sspQuantity, sspNote),
      ...create('ssp-e-card', sspQuantity, sspNote),
      ...create('acr-i-card', !longTerm && plan.stayWeeks * 7 > 59 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...(dormWeeks ? create('dorm-service', dormWeeks) : []),
      ...(residenceWeeks ? create('residence-service', residenceWeeks) : []),
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('student-id', 1),
    ];
  }
}

export class WeQuote extends PhSchoolQuote<WePageStudent> {
  constructor(pricing: WeQuotePricing) {
    super(pricing, {
      createStudent: () => new WePageStudent(pricing),
      headingPrefix: 'WE',
      image: { schoolCode: 'WE', schoolName: '菲律宾克拉克WE语言学校', filePrefix: 'WE', heroSrc: WE_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => wePriceMultiplier(weeks, pricing.shortTermPriceRatios),
      expandTotalNote: true,
      layoutVersion: 2,
    });
  }

  /** Deposit rows only for the housing someone in this quote actually uses. */
  override get optionalFeeItems() {
    const students = this.activeStudents;
    const name = (id: string) => this.pricing.localFeeRules.find(rule => rule.id === id)?.name;
    const dorm = students.some(student => student.quotePlan.rooms.some(row => !isResidence(row)));
    const residence = students.some(student => student.quotePlan.rooms.some(isResidence));
    const hidden = new Set([...(dorm ? [] : [name('dorm-deposit')]), ...(residence ? [] : [name('residence-deposit')])]);
    return super.optionalFeeItems.filter(item => !hidden.has(item.label));
  }

  /** The free native option class is a non-cash gift, so its row says 赠送 instead of “0 美元”. */
  override get schoolPaymentItems() { return super.schoolPaymentItems.map(giftAmount); }
  override get quoteImageData() {
    const data = super.quoteImageData;
    return { ...data, paymentItems: data.paymentItems.map(giftAmount) };
  }
}

const giftAmount = <T extends { icon: string; amount: string; accent?: boolean }>(item: T): T =>
  item.icon === '赠' ? { ...item, amount: '赠送', accent: false } : item;

export class WePlanComparison extends PhPlanComparison<WePageStudent> {
  constructor(pricing: WeQuotePricing, conditions: () => WePageStudent) {
    super(pricing, conditions, {
      createStudent: () => new WePageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'WE 方案对比报价',
      courseGroups: WE_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      extraNotes: (results: readonly PhComparePlanResult[]) =>
        results.some(result => weStayTouchesBusySeason(result.startDate, result.endDate))
          ? [`旺季（12–2月、6–8月）入住，报名时每人先付押金${WE_BUSY_SEASON_DEPOSIT_USD}美元，可抵扣学费全款，不是额外费用。`]
          : [],
      layoutVersion: 2,
    });
  }
}
