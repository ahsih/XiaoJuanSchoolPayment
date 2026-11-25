// Genius English Academy on the shared Philippine school quote and plan comparison. Genius's own prices, add-ons,
// offers and local fees are calculated here per student: 1–3 weeks use the school's exact short-stay prices and
// longer stays the 4-week price per week; the family program is priced per person and includes the room; the
// September–December offers and the 999-dollar promotion follow the school's posters. The template's PhSchoolQuote
// and PhPlanComparison only add students up and lay out the result. Keep this file free of Angular, DOM and
// storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanOption, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhCompareFocus, PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  GENIUS_ADD_ONS,
  GENIUS_B_IDS,
  GENIUS_FALL_OFFER,
  GENIUS_FAMILY_FREE_ID,
  GENIUS_FAMILY_IDS,
  GENIUS_FAMILY_KID_ID,
  GENIUS_FAMILY_KIDS_PRICE,
  GENIUS_FAMILY_MAX_WEEKS,
  GENIUS_FAMILY_PARENT_ID,
  GENIUS_FAMILY_ROOM,
  GENIUS_GE_A_ID,
  GENIUS_PROMO_999,
  GENIUS_QUAD_IDS,
  GENIUS_RETURNING_RULE_ID,
  GENIUS_SEA_VIEW_FEE,
  GENIUS_SHORT_PRICES,
  GENIUS_SIDA_RULE_ID,
  GENIUS_VISA_RATES,
  GENIUS_VISA_RATES_59,
  isGeniusSeaView,
} from './genius-content-config';
import { GENIUS_QUOTE_IMAGE_HERO } from './genius-page-media';

const DAY = 86400000;
const DEFAULT_ROOM = 'double';
const iso = (time: number): string => new Date(time).toISOString().slice(0, 10);
const round2 = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => Number.isFinite(value) ? `${Math.round(value).toLocaleString('en-US')} 比索` : '汇率待更新';
const formatUsd = (value: number): string => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** Today's local date as YYYY-MM-DD, for the 999 promotion's registration deadline. */
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** Everything Genius's quote reads; the page component is one. */
export interface GeniusQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const GENIUS_COMPARE_COURSE_GROUPS = [
  { id: 'general', label: '一般英语／强化口语', courseIds: ['ge-a', 'ge-b', 'ge-c', 'ge-d'] },
  { id: 'survival', label: '生存英语', courseIds: ['survival-a', 'survival-b'] },
  { id: 'exam', label: '商务与考试英语', courseIds: ['exam-a', 'exam-b'] },
] as const;

export type GeniusManagement = 'regular' | 'semi-sparta' | 'sparta';
export type GeniusExtraClasses = 'none' | 'one-to-one' | 'group' | 'both';

const MANAGEMENT_OPTIONS: ReadonlyArray<{ value: GeniusManagement; label: string }> = [
  { value: 'regular', label: '常规（无门禁）' },
  { value: 'semi-sparta', label: '半斯巴达（每4周加100美元）' },
  { value: 'sparta', label: '斯巴达（每4周加125美元）' },
];
const EXTRA_CLASS_OPTIONS: ReadonlyArray<{ value: GeniusExtraClasses; label: string }> = [
  { value: 'none', label: '不加课' },
  { value: 'one-to-one', label: '每天加1节一对一（每4周125美元）' },
  { value: 'group', label: '每天加1节小组课（每4周100美元）' },
  { value: 'both', label: '一对一和小组课各加1节（每4周225美元）' },
];

/** One Genius student: plan, conditions and every amount the template and quote image show. */
export class GeniusPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  management: GeniusManagement = 'regular';
  extraClasses: GeniusExtraClasses = 'none';
  /** A child under 18 on a regular course without a parent at the school pays the unaccompanied-minor fee. */
  unaccompanied = false;
  /** The 999-dollar promotion is opt-in, because it comes with social-media duties. */
  promo999Chosen = false;
  readonly extraChoices: readonly PhExtraChoice[];
  private readonly today = localToday();
  private courseSource?: readonly CiaQuoteCourse[];
  private courseOptionCache: QuotePlanOption[] = [];
  private roomSource?: readonly CiaQuoteRoom[];
  private roomOptionCache: QuotePlanOption[] = [];

  /**
   * kidsInFamily: how many family-program children the quote holds (2+ lowers each child's price);
   * allowFamily: false for 方案对比 plans, which compare regular courses only.
   */
  constructor(
    private readonly pricing: GeniusQuotePricing,
    private readonly kidsInFamily: () => number = () => 1,
    private readonly allowFamily = true,
  ) {
    // Prices are worked out here (proratePrice false): 1–3 weeks use the school's exact short-stay prices.
    this.quotePlan = new SchoolQuotePlan(
      GENIUS_GE_A_ID, DEFAULT_ROOM, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course' ? this.courseOptions() : this.roomOptions(),
      (kind, row) => this.rowPrice(kind, row),
      24, true, false,
    );
    const student = this;
    const management: PhExtraChoice = {
      label: '管理方式',
      options: MANAGEMENT_OPTIONS,
      get visible() { return !student.isFamily; },
      get note() {
        return student.management === 'regular' ? ''
          : student.management === 'sparta'
            ? '斯巴达：平日不能外出，每周成绩达到80%以上才可周末外出；周日23:00门禁。'
            : '半斯巴达：每周成绩达到70%以上平日才可外出；周日至周四23:00门禁。';
      },
      get value() { return student.management; },
      set value(mode: unknown) { student.management = mode as GeniusManagement; },
    };
    const extra: PhExtraChoice = {
      label: '加课',
      options: EXTRA_CLASS_OPTIONS,
      get visible() { return !student.isFamily; },
      note: '',
      get value() { return student.extraClasses; },
      set value(choice: unknown) { student.extraClasses = choice as GeniusExtraClasses; },
    };
    const minor: PhExtraChoice = {
      label: '家长是否同行',
      options: [{ value: false, label: '家长同行' }, { value: true, label: '独自来读（每4周加100美元）' }],
      get visible() { return student.selectedAgeGroup === 'minor' && !student.isFamily; },
      get note() { return student.unaccompanied ? '没有家长同行的未成年学生，每4周另收100美元未成年管理费。' : ''; },
      get value() { return student.unaccompanied; },
      set value(selected: unknown) { student.unaccompanied = selected === true || selected === 'true'; },
    };
    const promo: PhExtraChoice = {
      label: '999美元推广价',
      options: [{ value: false, label: '不参加' }, { value: true, label: '参加（4周999美元）' }],
      inComparison: false,
      get visible() { return student.promo999Open && !student.isFamily; },
      get note() {
        return student.promo999Chosen
          ? '只限一般英语或强化口语A＋四人间（可升级海景四人间），2026年9–12月就读整4周；须每周在社交媒体点赞并分享学校帖子2次、每周在中国社交媒体发4条快拍，展示在学校的学习和生活；注册费和学杂费另付；不和学校其他优惠同享，可以再享思达启航9折。'
          : '';
      },
      get value() { return student.promo999Chosen; },
      set value(chosen: unknown) { student.promo999Chosen = chosen === true || chosen === 'true'; },
    };
    this.extraChoices = [management, extra, minor, promo];
  }

  // ---- choices ----------------------------------------------------------------------------------

  private courseOptions(): QuotePlanOption[] {
    const courses = this.pricing.courseFees ?? [];
    if (this.courseSource !== courses) {
      this.courseSource = courses;
      this.courseOptionCache = courses
        .filter(course => this.allowFamily || !GENIUS_FAMILY_IDS.includes(course.id))
        .map(course => ({ id: course.id, name: course.name, details: course.schedule }));
    }
    return this.courseOptionCache;
  }

  private roomOptions(): QuotePlanOption[] {
    if (this.isFamily) return [{ id: GENIUS_FAMILY_ROOM.id, name: GENIUS_FAMILY_ROOM.name, details: GENIUS_FAMILY_ROOM.note }];
    const rooms = this.pricing.roomFees ?? [];
    if (this.roomSource !== rooms) {
      this.roomSource = rooms;
      this.roomOptionCache = rooms.map(room => ({ id: room.id, name: room.name, details: room.note }));
    }
    return this.roomOptionCache;
  }

  private get courseIds(): string[] { return this.quotePlan.courses.map(row => row.optionId); }
  get isFamily(): boolean { return this.courseIds.some(id => GENIUS_FAMILY_IDS.includes(id)); }
  get isFamilyKid(): boolean { return this.courseIds.includes(GENIUS_FAMILY_KID_ID); }

  /** The family room is part of the family price: picking or leaving the family program swaps the room (template hook). */
  planOptionChanged(): void {
    const family = this.isFamily;
    for (const row of this.quotePlan.rooms) {
      if (family && row.optionId !== GENIUS_FAMILY_ROOM.id) row.optionId = GENIUS_FAMILY_ROOM.id;
      if (!family && row.optionId === GENIUS_FAMILY_ROOM.id) row.optionId = DEFAULT_ROOM;
    }
    if (this.isFamilyKid) this.selectedAgeGroup = 'minor';
    else if (family) this.selectedAgeGroup = 'adult';
  }

  // ---- prices -----------------------------------------------------------------------------------

  /** The price tier: the student's total course weeks, 4 for four weeks and longer. */
  private get tier(): number {
    const weeks = this.quotePlan.courseWeeks || this.quotePlan.roomWeeks;
    return weeks >= 4 ? 4 : weeks;
  }

  /** Whole-stay price at the tier (1, 2, 3 or 4 weeks) of a course or room. */
  private tierPrice(id: string, fourWeeks: number): number {
    const tier = this.tier;
    if (tier >= 4) return fourWeeks;
    if (id === GENIUS_FAMILY_KID_ID && this.kidsInFamily() >= 2) return GENIUS_FAMILY_KIDS_PRICE.short[String(tier) as '1' | '2' | '3'];
    if (isGeniusSeaView(id)) {
      const base = GENIUS_SHORT_PRICES[id.replace(/-sea$/, '')]?.[String(tier)];
      return base === undefined ? Number.NaN : base + GENIUS_SEA_VIEW_FEE * tier / 4;
    }
    return GENIUS_SHORT_PRICES[id]?.[String(tier)] ?? Number.NaN;
  }

  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    const tier = this.tier;
    if (!tier) return 0;
    if (kind === 'room') {
      if (row.optionId === GENIUS_FAMILY_ROOM.id) return 0;
      const fee = this.pricing.roomFees.find(item => item.id === row.optionId)?.fee;
      return fee === undefined ? Number.NaN : round2(this.tierPrice(row.optionId, fee) / tier * row.weeks);
    }
    const course = this.pricing.courseFees.find(item => item.id === row.optionId);
    if (!course) return Number.NaN;
    const fourWeeks = row.optionId === GENIUS_FAMILY_KID_ID && this.kidsInFamily() >= 2
      ? GENIUS_FAMILY_KIDS_PRICE.fourWeeks : course.tuition2027 || course.tuition;
    return round2(this.tierPrice(row.optionId, fourWeeks) / tier * row.weeks);
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  /** Weeks of the regular (non-family) courses, which the add-ons and the autumn offer count. */
  private get regularCourseWeeks(): number {
    return this.quotePlan.courses.filter(row => !GENIUS_FAMILY_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  /** The class Mondays of the regular courses. */
  private get regularClassMondays(): string[] {
    return this.quotePlan.weekStarts(this.quotePlan.courses.filter(row => !GENIUS_FAMILY_IDS.includes(row.optionId)))
      .map(start => iso(start + DAY));
  }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(): number { return 0; }

  get courseLengthError(): string {
    if (!this.isFamily) return '';
    if (this.courseIds.some(id => !GENIUS_FAMILY_IDS.includes(id))) return '亲子课程请整段报名，不能和其他课程混排。';
    if (this.quotePlan.courseWeeks > GENIUS_FAMILY_MAX_WEEKS) return `亲子课程价格表到${GENIUS_FAMILY_MAX_WEEKS}周，更长的停留请咨询顾问。`;
    return '';
  }

  private get familyError(): string {
    if (!this.isFamily) {
      return this.quotePlan.rooms.some(row => row.optionId === GENIUS_FAMILY_ROOM.id) ? '请选择住宿房型。' : '';
    }
    if (this.quotePlan.rooms.some(row => row.optionId !== GENIUS_FAMILY_ROOM.id)) return '亲子课程已含住宿，请把住宿选为亲子家庭房。';
    if (this.isFamilyKid && this.selectedAgeGroup !== 'minor') return '亲子课程的孩子请把年龄选为“未满18岁”。';
    if (!this.isFamilyKid && this.selectedAgeGroup !== 'adult') return '亲子课程的家长请把年龄选为“18岁及以上”。';
    return '';
  }

  /** The 999 promotion is offered while its registration window is open. */
  get promo999Open(): boolean { return this.today <= GENIUS_PROMO_999.registrationEnd; }

  /** Whether the plan matches the 999 promotion: GE／Power Speaking A with a four-person room for exactly 4 weeks in Sep–Dec 2026. */
  private get promo999Fits(): boolean {
    const plan = this.quotePlan;
    const mondays = this.regularClassMondays;
    return this.courseIds.every(id => id === GENIUS_GE_A_ID)
      && plan.rooms.every(row => GENIUS_QUAD_IDS.includes(row.optionId))
      && plan.courseWeeks === GENIUS_PROMO_999.weeks && plan.roomWeeks === GENIUS_PROMO_999.weeks
      && mondays.length === GENIUS_PROMO_999.weeks
      && mondays.every(day => day >= GENIUS_PROMO_999.studyFrom && day <= GENIUS_PROMO_999.studyTo);
  }

  private get promo999Active(): boolean {
    return this.promo999Chosen && this.promo999Open && !this.isFamily && !!this.rule(GENIUS_PROMO_999.id);
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    const error = this.quotePlan.error || this.courseLengthError || this.familyError;
    if (error) return error;
    if (this.promo999Active && !this.promo999Fits) {
      return '999美元推广价只限一般英语或强化口语A＋四人间（或海景四人间），2026年9–12月就读整4周；请调整方案，或选择不参加。';
    }
    return '';
  }

  get minorNote(): string {
    return '未满18岁、没有家长同行的学生，每4周另收100美元未成年管理费；和家长一起来的孩子可以报亲子课程。';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** 999 promotion: course and four-person room for 999 dollars (sea-view four-person room 125 more). */
  get promo999Discount(): number {
    if (!this.promo999Active || !this.promo999Fits) return 0;
    const seaView = this.quotePlan.rooms.some(row => isGeniusSeaView(row.optionId));
    return Math.max(0, round2(this.tuition + this.accommodation - GENIUS_PROMO_999.price - (seaView ? GENIUS_SEA_VIEW_FEE : 0)));
  }

  /** Complete four regular-course weeks whose class Monday falls in September–December 2026. */
  get fallOfferBlocks(): number {
    const weeks = this.regularClassMondays.filter(day => day >= GENIUS_FALL_OFFER.from && day <= GENIUS_FALL_OFFER.to).length;
    return Math.floor(weeks / 4);
  }

  /**
   * 思达启航9折 on the course and room charges (family program and sea view included), before the school offers;
   * with the 999 promotion it is 10% of the promotion price. Registration, add-ons and local fees are not discounted.
   */
  get sidaDiscount(): number {
    const rule = this.rule(GENIUS_SIDA_RULE_ID);
    if (!rule) return 0;
    const base = this.tuition + this.accommodation - this.promo999Discount;
    return round2(Math.max(0, base) * rule.discountValue / 100);
  }

  get fallOfferDiscount(): number {
    const rule = this.rule(GENIUS_FALL_OFFER.id);
    if (!rule || this.promo999Active) return 0;
    return this.fallOfferBlocks * rule.discountValue;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; note: string }> {
    const promo = this.rule(GENIUS_PROMO_999.id);
    const fall = this.rule(GENIUS_FALL_OFFER.id);
    const sida = this.rule(GENIUS_SIDA_RULE_ID);
    return [
      ...(promo && this.promo999Discount > 0 ? [{
        rule: promo, amount: this.promo999Discount,
        note: '课程和四人间4周合计999美元（海景四人间1,124美元）；须完成社交媒体分享，不和学校其他优惠同享',
      }] : []),
      ...(sida && this.sidaDiscount > 0 ? [{
        rule: sida, amount: this.sidaDiscount,
        note: this.promo999Discount > 0 ? '推广价再打9折' : '课程费和住宿费9折，先打折再减学校优惠',
      }] : []),
      ...(fall && this.fallOfferDiscount > 0 ? [{
        rule: fall, amount: this.fallOfferDiscount,
        note: `2026年9–12月就读，每满4周减200美元；本次${this.fallOfferBlocks}个4周`,
      }] : []),
    ];
  }

  get promotionDiscountTotal(): number {
    return round2(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return this.appliedPromotions.map(item => item.rule.name).join('、');
  }

  // ---- add-ons ----------------------------------------------------------------------------------

  private get managementRate(): number {
    return this.isFamily ? 0 : this.management === 'sparta' ? GENIUS_ADD_ONS.sparta
      : this.management === 'semi-sparta' ? GENIUS_ADD_ONS.semiSparta : 0;
  }

  private get extraClassRate(): number {
    if (this.isFamily) return 0;
    return (this.extraClasses === 'one-to-one' || this.extraClasses === 'both' ? GENIUS_ADD_ONS.extraOneToOne : 0)
      + (this.extraClasses === 'group' || this.extraClasses === 'both' ? GENIUS_ADD_ONS.extraGroup : 0);
  }

  private get minorRate(): number {
    return !this.isFamily && this.selectedAgeGroup === 'minor' && this.unaccompanied ? GENIUS_ADD_ONS.unaccompaniedMinor : 0;
  }

  /** An add-on priced per 4 weeks, counted by the regular course week. */
  private addOn(rate: number): number { return round2(rate * this.regularCourseWeeks / 4); }

  private get addOnLines(): SchoolPaymentLine[] {
    const weeks = this.regularCourseWeeks;
    const lines: SchoolPaymentLine[] = [];
    if (this.managementRate) {
      const name = this.management === 'sparta' ? '斯巴达管理' : '半斯巴达管理';
      lines.push({ icon: '管', label: name, value: this.addOn(this.managementRate), note: `每4周${this.managementRate}美元 × ${weeks}周` });
    }
    if (this.extraClassRate) {
      const what = EXTRA_CLASS_OPTIONS.find(option => option.value === this.extraClasses)?.label.replace(/（.*$/, '') ?? '';
      lines.push({ icon: '课', label: '加课', value: this.addOn(this.extraClassRate), note: `${what}，每4周${this.extraClassRate}美元 × ${weeks}周` });
    }
    if (this.minorRate) {
      lines.push({ icon: '管', label: '未成年管理费', value: this.addOn(this.minorRate), note: `没有家长同行，每4周${this.minorRate}美元 × ${weeks}周` });
    }
    return lines;
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && this.rule(GENIUS_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get quoteUsd(): number {
    const addOns = this.addOnLines.reduce((sum, line) => sum + line.value, 0);
    return Math.max(0, round2(this.registration + this.tuition + this.accommodation + addOns - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...this.addOnLines,
      ...this.appliedPromotions.map(({ rule, amount, note }) => ({
        icon: '惠', label: rule.name, value: -amount, note, promotionKey: rule.id,
      })),
    ];
  }

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension per started 4 weeks beyond the entry visa: from week 5 on a 30-day visa, from week 9 on a 59-day visa. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const covered = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - covered) / 4));
  }

  private localRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** Pesos for a dollar amount the school collects in dollars, at the quote's reference rates. */
  private usdToPhp(usd: number): number { return usd * this.pricing.usdToCny * this.pricing.phpPerCny; }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const noClass = this.courseIds.length > 0 && this.courseIds.every(id => id === GENIUS_FAMILY_FREE_ID);
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const fees: SchoolLocalFee[] = [];

    const visa = this.localRule('visa-extension');
    if (visa) {
      const sequence = (this.visaType === 'tourist59' ? visa.tourist59Rates : visa.rates)
        ?? (this.visaType === 'tourist59' ? GENIUS_VISA_RATES_59 : GENIUS_VISA_RATES);
      const total = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0)
        .reduce((sum, amount) => sum + amount, 0);
      fees.push({
        item: visa.name, unitLabel: '按停留周数', quantity: extensions, total,
        note: longTerm ? longTermNote : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visa.note}`,
        ...(longTerm ? { waived: true } : {}),
      });
    }
    const ssp = this.localRule('ssp');
    if (ssp) {
      fees.push({
        item: ssp.name, unitLabel: `${formatPhp(ssp.amount)}／次`, quantity: longTerm || noClass ? 0 : 1,
        total: longTerm || noClass ? 0 : ssp.amount,
        note: longTerm ? longTermNote : noClass ? '不上课的家长不计SSP，以学校确认为准。' : ssp.note,
        ...(longTerm ? { waived: true } : {}),
      });
    }
    const acr = this.localRule('acr-i-card');
    if (acr) {
      const quantity = !longTerm && extensions > 0 ? 1 : 0;
      fees.push({
        item: acr.name, unitLabel: `${formatPhp(acr.amount)}／次`, quantity, total: acr.amount * quantity,
        note: longTerm ? longTermNote : acr.note, ...(longTerm ? { waived: true } : {}),
      });
    }
    const materials = this.localRule('materials');
    if (materials) {
      const weeksOf = (rate: 'A' | 'B') => plan.courses
        .filter(row => row.optionId !== GENIUS_FAMILY_FREE_ID
          && (GENIUS_B_IDS.includes(row.optionId) || row.optionId === GENIUS_FAMILY_KID_ID) === (rate === 'B'))
        .reduce((sum, row) => sum + row.weeks, 0);
      const setsA = Math.ceil(weeksOf('A') / 4);
      const setsB = Math.ceil(weeksOf('B') / 4);
      const usd = setsA * materials.amount + setsB * (materials.secondaryAmount ?? materials.amount);
      fees.push({
        item: materials.name, unitLabel: `${materials.amount}／${materials.secondaryAmount ?? materials.amount}美元／4周`,
        quantity: setsA + setsB, total: this.usdToPhp(usd), note: `${materials.note}本次${formatUsd(usd)}美元。`,
      });
    }
    for (const id of ['maintenance', 'laundry', 'water']) {
      const rule = this.localRule(id);
      if (!rule) continue;
      const usd = rule.amount * plan.roomWeeks;
      fees.push({
        item: rule.name, unitLabel: `${rule.amount}美元／周`, quantity: plan.roomWeeks, total: this.usdToPhp(usd),
        note: `${rule.note}本次${formatUsd(usd)}美元。`,
      });
    }
    return fees;
  }
}

/** Deposit, airport pickup and electricity, outside the local-fee total. */
function geniusOptionalFees(pricing: GeniusQuotePricing, students: readonly GeniusPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const cnyFromUsd = (usd: number) => `约人民币 ${quoteCurrencyText(Math.round(usd * pricing.usdToCny), 'zh-CN')} 元`;
  const group = count > 1 ? `（${count}人）` : '';
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.currency === 'USD') {
        const total = rule.amount * (rule.multiplyByStudents ? count : 1);
        return { label: rule.name, amount: `${formatUsd(total)} 美元`, cnyAmount: cnyFromUsd(total), note: `${rule.note}${rule.multiplyByStudents ? group : ''}` };
      }
      return { label: rule.name, amount: `每度${rule.amount}比索`, cnyAmount: '按实际用电', note: rule.note };
    });
}

export class GeniusQuote extends PhSchoolQuote<GeniusPageStudent> {
  constructor(pricing: GeniusQuotePricing) {
    const family: { kids: () => number } = { kids: () => 1 };
    super(pricing, {
      createStudent: () => new GeniusPageStudent(pricing, () => family.kids()),
      headingPrefix: 'Genius',
      image: { schoolCode: 'Genius', schoolName: '菲律宾宿务Genius English Academy语言学校', filePrefix: 'Genius', heroSrc: GENIUS_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => weeks / 4,
      optionalFeeItems: students => geniusOptionalFees(pricing, students),
      layoutVersion: 2,
    });
    family.kids = () => this.activeStudents.filter(student => student.isFamilyKid).length;
  }
}

export class GeniusPlanComparison extends PhPlanComparison<GeniusPageStudent> {
  constructor(pricing: GeniusQuotePricing, conditions: () => GeniusPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new GeniusPageStudent(pricing, () => 1, false),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.management = from.isFamily ? 'regular' : from.management;
        to.extraClasses = from.isFamily ? 'none' : from.extraClasses;
        to.unaccompanied = from.unaccompanied;
      },
      heading: 'Genius 方案对比报价',
      courseGroups: GENIUS_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }

  /** The family program is not compared. */
  override get courseOptions(): GeniusQuotePricing['courseFees'] {
    return (this.pricing as GeniusQuotePricing).courseFees.filter(course => !GENIUS_FAMILY_IDS.includes(course.id));
  }

  /** A family course is not compared; plan A then starts from the default course and room. */
  override start(focus?: PhCompareFocus): void {
    super.start(focus);
    const first = this.plans[0];
    if (first && (GENIUS_FAMILY_IDS.includes(first.quotePlan.courses[0]?.optionId ?? '') || first.quotePlan.rooms[0]?.optionId === GENIUS_FAMILY_ROOM.id)) {
      first.quotePlan.courses[0].optionId = GENIUS_GE_A_ID;
      first.quotePlan.rooms[0].optionId = DEFAULT_ROOM;
      this.applyFocus(this.focus);
    }
  }
}
