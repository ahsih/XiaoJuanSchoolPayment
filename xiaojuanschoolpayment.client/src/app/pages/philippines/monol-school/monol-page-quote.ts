// MONOL main campus on the shared Philippine school quote and plan comparison. MONOL's own prices, offers, visa
// sequence and pickup choices are calculated here per student; the template's PhSchoolQuote and PhPlanComparison
// only add students up and lay out the result. Never use MONOL Sparta's prices or rules here. Keep this file free
// of Angular, DOM and storage access, so the WeChat mini program can bundle it later.
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { QuoteImageCardData } from '../../../components/quote-image-types';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { MONOL_QUOTE_IMAGE_HERO } from './monol-page-content';

/** Everything MONOL's quote reads; the page component is one. */
export interface MonolQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  /** 1/2/3 weeks as a share of the four-week price (the content document's shortStayRatios). */
  shortTermPriceRatios: Record<string, number>;
}

export const MONOL_VISA_OPTIONS = [
  { value: 'tourist59', label: '中国护照（59天旅游签证）' },
  { value: 'tourist30', label: '中国护照（30天旅游签证）' },
] as const;

export type MonolPickup = 'none' | 'manila-group' | 'clark-group' | 'manila-special' | 'clark-special';

const PICKUP_OPTIONS: ReadonlyArray<{ value: MonolPickup; label: string }> = [
  { value: 'manila-group', label: '马尼拉机场团体接机' },
  { value: 'clark-group', label: '克拉克机场团体接机' },
  { value: 'manila-special', label: '马尼拉机场个人接机（单独派车）' },
  { value: 'clark-special', label: '克拉克机场个人接机（单独派车）' },
  { value: 'none', label: '不需要接机' },
];
const PICKUP_RULE_IDS: Record<MonolPickup, string> = {
  none: '', 'manila-group': 'manila-group-pickup', 'clark-group': 'clark-group-pickup',
  'manila-special': 'manila-special-pickup', 'clark-special': 'clark-special-pickup',
};
const YES_NO = (yes: string): ReadonlyArray<{ value: boolean; label: string }> => [
  { value: false, label: '不参加' },
  { value: true, label: yes },
];

export const MONOL_REGISTRATION_RULE_ID = 'monol-registration-waiver';
export const MONOL_COURSE_RULE_ID = 'monol-off-season-course-2026';
export const MONOL_ROOM_RULE_ID = 'monol-off-season-room-2026';
export const MONOL_SNS_RULE_ID = 'monol-sns';
export const MONOL_LONG_TERM_RULE_ID = 'monol-long-term';
export const MONOL_CHRISTMAS_RULE_ID = 'monol-christmas';

/** Premium Single A and B: two large beds, up to four people; each extra person pays this per four weeks. */
export const MONOL_PREMIUM_ROOM_IDS = ['premium-single-room', 'premium-single-b'];
export const MONOL_PREMIUM_SHARER_FEE = 200;

/** The 2026 poster: study and stay weeks touching 2027/06/27–08/21 earn none of its four-week offers. */
export const MONOL_PROMOTION_BLACKOUT = { start: '2027-06-27', end: '2027-08-21' } as const;

/** Courses a student usually weighs against each other. */
export const MONOL_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL', courseIds: ['esl-4', 'general-esl'] },
  { id: 'goal', label: '雅思／LEAP', courseIds: ['ielts', 'leap-english', 'general-esl'] },
] as const;

/** Stay over 59 days: the TVV ACR I-CARD reference applies. */
const TVV_ACR_MIN_WEEKS = 9;
const DAY = 86400000;

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const formatPhp = (value: number) => `${Math.round(value).toLocaleString('en-US')} 比索`;

/** Share of the four-week price: 1/2/3 weeks at the school's short-stay rates, four weeks and more pro rata. */
export const monolPriceMultiplier = (weeks: number, ratios: Record<string, number>): number => ratios[String(weeks)] ?? weeks / 4;

/** Extensions a stay of this many weeks needs: a 30-day visa from week 5, a 59-day visa from week 9, then every four weeks. */
export function monolVisaExtensions(visaType: string, weeks: number): number {
  const after = (threshold: number) => Math.max(0, Math.ceil((weeks - threshold) / 4));
  return visaType === 'tourist30' ? (weeks <= 4 ? 0 : 1 + after(8)) : after(8);
}

/** One MONOL main-campus student: plan, conditions and every amount the template and quote image show. */
export class MonolPageStudent implements PhPageStudent {
  readonly visaOptions = MONOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  /** Registration fee is waived for everyone, so new or returning changes nothing here. */
  returningStudent = false;
  /** The 2026 offers need registration by 2026/12/31; the long-stay offer from 2026/09/07. */
  selectedRegistrationDate = localToday();
  pickup: MonolPickup = 'manila-group';
  snsSelected = false;
  /** Second to fourth person in a Premium Single: 200 dollars per four weeks, no room offers. */
  premiumSharer = false;
  readonly extraChoices: readonly PhExtraChoice[];
  readonly courseLengthError = '';

  constructor(private readonly pricing: MonolQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'general-esl', 'triple-room', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
    );
    const student = this;
    const pickup: PhExtraChoice = {
      label: '接机',
      options: PICKUP_OPTIONS,
      visible: true,
      get note() { return student.pickupNote; },
      get value() { return student.pickup; },
      set value(value: unknown) { student.pickup = value as MonolPickup; },
    };
    const sharer: PhExtraChoice = {
      label: '高级单人间同住',
      options: [
        { value: false, label: '第一位入住（按房价）' },
        { value: true, label: '第2–4位同住者（200美元／4周）' },
      ],
      get visible() { return student.staysInPremium; },
      inComparison: false,
      get note() {
        return student.premiumSharer
          ? '和第一位同进同出；加的住宿费不享受住宿优惠。'
          : '高级单人间最多4人同住；同住的家人、伴侣或朋友请把他们的报价选成“第2–4位同住者”。';
      },
      get value() { return student.premiumSharer; },
      set value(value: unknown) { student.premiumSharer = value === true; },
    };
    const sns: PhExtraChoice = {
      label: 'SNS活动',
      options: YES_NO('参加（每满4周再减100美元）'),
      get visible() { return student.snsAvailable; },
      get note() {
        return student.snsSelected
          ? '在小红书、Instagram、TikTok等任一平台发1篇在校故事；学校可能随时结束活动，报名前由顾问向学校确认。'
          : '';
      },
      get value() { return student.snsSelected; },
      set value(value: unknown) { student.snsSelected = value === true; },
    };
    this.extraChoices = [pickup, sharer, sns];
  }

  // ---- prices ----------------------------------------------------------------------------------

  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    const multiplier = monolPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
    if (kind === 'room' && this.premiumSharer && MONOL_PREMIUM_ROOM_IDS.includes(row.optionId)) return MONOL_PREMIUM_SHARER_FEE * multiplier;
    const base = kind === 'course'
      ? this.pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
      : this.pricing.roomFees.find(item => item.id === row.optionId)?.fee;
    return (base ?? 0) * multiplier;
  }

  get staysInPremium(): boolean { return this.quotePlan.rooms.some(row => MONOL_PREMIUM_ROOM_IDS.includes(row.optionId)); }

  minimumWeeks(): number { return 0; }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日。';
    return this.quotePlan.error;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private registrationMatches(rule: CiaPromotionRule): boolean {
    const registration = this.selectedRegistrationDate;
    if (this.quotePlan.date(registration) === null) return false;
    if (rule.registrationStart && registration < rule.registrationStart) return false;
    return !rule.registrationEnd || registration <= rule.registrationEnd;
  }

  /** Room type each accommodation week starts in. */
  private roomByWeek(): Map<number, string> {
    const byWeek = new Map<number, string>();
    for (const row of this.quotePlan.rooms) {
      for (const week of this.quotePlan.weekStarts([row])) byWeek.set(week, row.optionId);
    }
    return byWeek;
  }

  /** Study weeks the student also lives on campus; a split course or room still counts all its weeks together. */
  get studyAndStayWeeks(): number {
    const rooms = this.roomByWeek();
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(week => rooms.has(week)).length;
  }

  /** Study-and-stay weeks outside the poster's summer exclusion, optionally only in some rooms. */
  private offerWeeks(accept: (roomId: string) => boolean = () => true): number {
    const rooms = this.roomByWeek();
    const from = this.quotePlan.date(MONOL_PROMOTION_BLACKOUT.start) ?? 0;
    const to = this.quotePlan.date(MONOL_PROMOTION_BLACKOUT.end) ?? 0;
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(week => {
      const roomId = rooms.get(week);
      return roomId !== undefined && accept(roomId) && !(week <= to && week + 6 * DAY >= from);
    }).length;
  }

  get snsAvailable(): boolean {
    const rule = this.rule(MONOL_SNS_RULE_ID);
    return !!rule && this.registrationMatches(rule)
      && this.quotePlan.rooms.some(row => (rule.eligibleRoomIds ?? []).includes(row.optionId));
  }

  private longTermAmount(rule: CiaPromotionRule): number {
    const weeks = this.studyAndStayWeeks;
    const tiers = Object.entries(rule.discountTiers ?? {}).map(([tier, amount]) => [Number(tier), amount] as const);
    return tiers.filter(([tier]) => weeks >= tier).reduce((best, [, amount]) => Math.max(best, amount), 0);
  }

  private christmasApplies(rule: CiaPromotionRule): boolean {
    const arrival = this.quotePlan.courses[0]?.startDate ?? '';
    return !!arrival && arrival >= (rule.arrivalStart ?? '') && arrival <= (rule.arrivalEnd ?? '9999-12-31')
      && this.quotePlan.rooms[0]?.startDate === arrival && this.studyAndStayWeeks >= rule.minimumCourseWeeks;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; detail: string }> {
    const applied: Array<{ rule: CiaPromotionRule; amount: number; detail: string }> = [];
    const blocks = (weeks: number) => Math.floor(weeks / 4);
    const course = this.rule(MONOL_COURSE_RULE_ID);
    if (course && this.registrationMatches(course)) {
      const count = blocks(this.offerWeeks());
      applied.push({ rule: course, amount: Math.min(this.tuition, count * course.discountValue), detail: `本次${count}个4周` });
    }
    const notShared = (roomId: string) => !(this.premiumSharer && MONOL_PREMIUM_ROOM_IDS.includes(roomId));
    const room = this.rule(MONOL_ROOM_RULE_ID);
    if (room && this.registrationMatches(room)) {
      const count = blocks(this.offerWeeks(notShared));
      applied.push({ rule: room, amount: count * room.discountValue, detail: `本次${count}个4周` });
    }
    const sns = this.rule(MONOL_SNS_RULE_ID);
    if (sns && this.snsSelected && this.snsAvailable) {
      const count = blocks(this.offerWeeks(roomId => (sns.eligibleRoomIds ?? []).includes(roomId)));
      applied.push({ rule: sns, amount: count * sns.discountValue, detail: `本次${count}个4周` });
    }
    const longTerm = this.rule(MONOL_LONG_TERM_RULE_ID);
    if (longTerm && this.registrationMatches(longTerm)) {
      applied.push({ rule: longTerm, amount: this.longTermAmount(longTerm), detail: `本次学习并住宿${this.studyAndStayWeeks}周` });
    }
    const christmas = this.rule(MONOL_CHRISTMAS_RULE_ID);
    if (christmas && this.christmasApplies(christmas)) {
      applied.push({ rule: christmas, amount: christmas.discountValue, detail: `本次${this.quotePlan.courses[0].startDate.replace(/-/g, '/')}入学` });
    }
    // Room offers never go below the room price.
    const roomOffers = applied.filter(item => item.rule.appliesTo === 'accommodation');
    let roomLeft = this.accommodation;
    for (const item of roomOffers) {
      item.amount = Math.min(item.amount, roomLeft);
      roomLeft -= item.amount;
    }
    return applied.filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return this.appliedPromotions.map(item => item.rule.name).join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  /** The school's 100-dollar registration fee is waived for every student who enrols through 思达启航. */
  readonly registration = 0;
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  private get peak() {
    const weeks = this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]);
    return calculateAssociationPeakSurcharge('MONOL', weeks, this.pricing.peakSeasonRanges, this.pricing.seasonalFeePerWeek);
  }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }

  get quoteUsd(): number {
    return Math.max(0, round(this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...this.appliedPromotions.map(({ rule, amount, detail }) => ({
        icon: '惠',
        label: rule.name,
        value: -amount,
        note: `${rule.description}；${detail}`,
        promotionKey: rule.id,
      })),
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '暑期旺季附加费', value: this.seasonalSurcharge,
        note: `学习或住宿周与暑期旺季重叠：${associationPeakBreakdownText(this.peak)}；同一周课程和住宿只算一次，不参与优惠`,
      }] : []),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁的学生外出要有外出许可单并由监护人或成年学生陪同；入学条件和监护安排由顾问向学校确认。';
  }

  private get pickupNote(): string {
    const rule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    if (!rule) return this.pickup === 'none' ? '自行到校，请提前告诉顾问到校时间。' : '';
    return rule.includeInTotal
      ? `${formatPhp(rule.amount)}／人，计入到校学杂费；按BESA团体接机日和班次。`
      : `整车${formatPhp(rule.amount)}，另列在到校学杂费下方，不计入合计。`;
  }

  // ---- local fees -------------------------------------------------------------------------------

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return id ? this.pricing.localFeeRules.find(item => item.id === id && item.enabled) : undefined;
  }

  get visaExtensionCount(): number { return monolVisaExtensions(this.visaType, this.quotePlan.stayWeeks); }

  private visaSequence(rule: CiaLocalFeeRule): number[] {
    const thirty = rule.rates?.length ? rule.rates : [rule.amount];
    return this.visaType === 'tourist59' && rule.tourist59Rates?.length ? rule.tourist59Rates : thirty;
  }

  get needsTvvAcr(): boolean { return this.quotePlan.stayWeeks >= TVV_ACR_MIN_WEEKS; }

  get selectedSpecialPickup(): CiaLocalFeeRule | undefined {
    const rule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    return rule && !rule.includeInTotal ? rule : undefined;
  }

  /** Meal estimate for the accommodation weeks (outside the total). */
  get mealEstimate(): number {
    const rule = this.feeRule('meals');
    return rule ? rule.amount * this.quotePlan.roomWeeks / (rule.periodWeeks || 4) : 0;
  }

  get localFees(): SchoolLocalFee[] {
    const once = (id: string): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      return rule ? [{ item: rule.name, unitLabel: `${formatPhp(rule.amount)}／次`, quantity: 1, total: rule.amount, note: rule.note }] : [];
    };
    const visaRule = this.feeRule('visa-extension');
    const visa: SchoolLocalFee[] = [];
    if (visaRule) {
      const count = this.visaExtensionCount;
      const sequence = this.visaSequence(visaRule);
      const total = Array.from({ length: count }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0).reduce((sum, amount) => sum + amount, 0);
      visa.push({
        item: visaRule.name,
        unitLabel: `${formatPhp(sequence[0] ?? visaRule.amount)}起／次`,
        quantity: count,
        total,
        note: `按${this.visaLabel}、${this.quotePlan.stayWeeks}周停留预估，${count ? `本次${count}次` : '本次无需延签'}；${visaRule.note}`,
      });
    }
    const pickupRule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    return [
      ...once('ssp'),
      ...once('ssp-acr'),
      ...visa,
      ...(pickupRule?.includeInTotal ? [{ item: pickupRule.name, unitLabel: `${formatPhp(pickupRule.amount)}／人`, quantity: 1, total: pickupRule.amount, note: pickupRule.note }] : []),
    ];
  }
}

/** Deposit, meals, the TVV ACR reference and a chosen individual pickup: listed under the local fees, never in the total. */
function monolOptionalFees(pricing: MonolQuotePricing, students: readonly MonolPageStudent[], quote: PhSchoolQuote<MonolPageStudent>): PhOptionalFeeItem[] {
  const rule = (id: string) => pricing.localFeeRules.find(item => item.id === id && item.enabled);
  const count = students.length;
  const group = count > 1;
  const label = (indexes: number[]) => indexes.map(index => `学生${index + 1}`).join('、');
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value), 'zh-CN')} 元`;
  const items: PhOptionalFeeItem[] = [];
  const deposit = rule('security-deposit');
  if (deposit) {
    const total = deposit.amount * count;
    items.push({
      label: deposit.name,
      amount: deposit.currency === 'USD' ? `${quote.formatUsd(total)} 美元` : quote.formatPhp(total),
      cnyAmount: cny(deposit.currency === 'USD' ? total * pricing.usdToCny : total / pricing.phpPerCny),
      note: `${deposit.note}${group ? `（${count}人）` : ''}`,
    });
  }
  const meals = rule('meals');
  const mealTotal = students.reduce((sum, student) => sum + student.mealEstimate, 0);
  if (meals && mealTotal > 0) {
    items.push({
      label: `${meals.name}（参考）`, amount: quote.formatPhp(mealTotal), cnyAmount: cny(mealTotal / pricing.phpPerCny),
      note: `按每4周约${formatPhp(meals.amount)}估算${group ? `（${count}人合计）` : ''}；${meals.note}`,
    });
  }
  const tvv = rule('tvv-acr');
  const tvvStudents = students.map((student, index) => student.needsTvvAcr ? index : -1).filter(index => index >= 0);
  if (tvv && tvvStudents.length) {
    items.push({
      label: tvv.name, amount: quote.formatPhp(tvv.amount), cnyAmount: cny(tvv.amount / pricing.phpPerCny),
      note: `${tvv.note}${group ? `（${label(tvvStudents)}）` : ''}`,
    });
  }
  for (const id of ['manila-special-pickup', 'clark-special-pickup']) {
    const pickup = rule(id);
    const chosen = students.map((student, index) => student.selectedSpecialPickup?.id === id ? index : -1).filter(index => index >= 0);
    if (!pickup || !chosen.length) continue;
    items.push({
      label: pickup.name, amount: quote.formatPhp(pickup.amount), cnyAmount: cny(pickup.amount / pricing.phpPerCny),
      note: `${pickup.note}${group ? `（${label(chosen)}）` : ''}`,
    });
  }
  return items;
}

export class MonolQuote extends PhSchoolQuote<MonolPageStudent> {
  constructor(pricing: MonolQuotePricing) {
    super(pricing, {
      createStudent: () => new MonolPageStudent(pricing),
      headingPrefix: 'MONOL主校区',
      image: { schoolCode: 'MONOL', schoolName: '菲律宾碧瑶MONOL主校区', filePrefix: 'MONOL', heroSrc: MONOL_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => monolPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => monolOptionalFees(pricing, students, quote),
      layoutVersion: 2,
    });
  }

  /** Everyone is free of the school's registration fee, so the standard returning-student line is left out. */
  override get registrationNote(): string {
    const fee = this.formatUsd(this.pricing.registrationFee);
    const people = this.quoteMode === 'group' ? `，本次${this.activeStudents.length}人全部免收` : '';
    return `学校原价${fee}美元／人，通过思达启航报名免收${people}`;
  }

  /** MONOL has only a few local-fee rows, so the image drops the empty space under them. */
  override get quoteImageData(): QuoteImageCardData {
    return { ...super.quoteImageData, compactDetailedSections: true };
  }
}

export class MonolPlanComparison extends PhPlanComparison<MonolPageStudent> {
  constructor(pricing: MonolQuotePricing, conditions: () => MonolPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new MonolPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
        to.pickup = from.pickup;
        to.snsSelected = from.snsSelected;
      },
      heading: 'MONOL主校区 方案对比报价',
      courseGroups: MONOL_COMPARE_COURSE_GROUPS,
      layoutVersion: 2,
    });
  }
}

