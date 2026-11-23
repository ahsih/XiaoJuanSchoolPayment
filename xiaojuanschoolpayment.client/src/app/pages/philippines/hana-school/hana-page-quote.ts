// HANA Academy on the shared Philippine school quote and plan comparison. HANA's own rules are calculated
// here per student: listed prices are peak-season prices, low-season weeks get the long-stay discount, the
// adult “付4周读8周” offer replaces that discount when the plan qualifies, Junior Camp has weekly season
// prices, and local fees follow the room type week by week. The template's PhSchoolQuote and
// PhPlanComparison only add students up and lay out the result. Keep this file free of Angular, DOM and
// storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  HANA_ADULT_IDS,
  HANA_BIG_PROMO_WINDOWS,
  HANA_CAMP_IDS,
  HANA_CAMP_RATES,
  HANA_CAMP_ROOM,
  HANA_CURRENT_PRICES_PAY_BY,
  HANA_DOUBLE_ROOM_ID,
  HANA_FAMILY_2_MONTHS,
  HANA_GOLF_IDS,
  HANA_GUARDIAN_IDS,
  HANA_JUNIOR_IDS,
  HANA_KINDER_IDS,
  HANA_LIGHT_ESL_ID,
  HANA_NO_CLASS_ID,
  HANA_PEAK_SEASONS,
  HANA_ROOM_WEEKLY_FEES,
  HANA_SENIOR_COUPLE_ROOM_ID,
  HANA_SENIOR_ID,
  HANA_SINGLE_ROOM_ID,
  HANA_TRIPLE_ROOM_ID,
  hanaBigPromoRatio,
  hanaLowSeasonRate,
} from './hana-content-config';

export const HANA_QUOTE_IMAGE_HERO = '/assets/hana/campus/pool-fountain.webp';
const LOW_SEASON_RULE_ID = 'hana-low-season';
const BIG_PROMO_RULE_ID = 'hana-big-promo';
const RETURNING_RULE_ID = 'hana-returning-registration';
/** “付4周读8周”: 4 weeks of Light ESL (770) plus a double room (700). */
const BIG_PROMO_PRICE = 1470;
const DAY = 86400000;
const KID_IDS: readonly string[] = [...HANA_JUNIOR_IDS, ...HANA_KINDER_IDS];

/** Everything HANA's quote reads; the page component is one. */
export interface HanaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const HANA_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '成人英语', courseIds: [HANA_LIGHT_ESL_ID, 'general-esl', 'native-esl', 'native-only'] },
  { id: 'exam', label: '考试课程', courseIds: ['toeic', 'ielts'] },
  { id: 'golf', label: '英语＋高尔夫', courseIds: [...HANA_GOLF_IDS] },
  { id: 'junior', label: '青少年（家长陪同）', courseIds: [...HANA_JUNIOR_IDS] },
  { id: 'kinder', label: '幼儿园', courseIds: [...HANA_KINDER_IDS] },
  { id: 'guardian', label: '陪读家长', courseIds: [...HANA_GUARDIAN_IDS] },
] as const;

const iso = (time: number): string => new Date(time).toISOString().slice(0, 10);
const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const round2 = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const formatUsd = (value: number): string => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** A study week belongs to the season of its Wednesday, as in the school's own calculator. */
export const hanaIsPeakWeek = (weekStart: number): boolean => {
  const wednesday = iso(weekStart + 3 * DAY);
  return HANA_PEAK_SEASONS.some(range => range.start <= wednesday && wednesday <= range.end);
};
const inBigPromoWindow = (weekStart: number): boolean =>
  HANA_BIG_PROMO_WINDOWS.some(window => iso(weekStart) >= window.start && iso(weekStart + 6 * DAY) <= window.end);

/** One HANA student: plan, conditions and every amount the template and quote image show. */
export class HanaPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** A child under 18 studying without a parent (outside the camp) pays the school's guardian care. */
  unaccompanied = false;
  /** 付4周读8周 is on by default whenever the plan qualifies; the student may decline its review duty. */
  bigPromoChosen = true;
  readonly extraChoices: readonly PhExtraChoice[];
  private readonly today = localToday();

  constructor(private readonly pricing: HanaQuotePricing) {
    // Prices are worked out here (proratePrice false): the camp's weekly season prices do not scale.
    this.quotePlan = new SchoolQuotePlan(
      HANA_LIGHT_ESL_ID, HANA_DOUBLE_ROOM_ID, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : this.isCamp
          ? [{ id: HANA_CAMP_ROOM.id, name: HANA_CAMP_ROOM.name, details: HANA_CAMP_ROOM.note }]
          : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
      24, true, false,
    );
    const student = this;
    const promo: PhExtraChoice = {
      label: '付4周读8周',
      options: [{ value: true, label: '参加' }, { value: false, label: '不参加' }],
      inComparison: false,
      get visible() { return student.bigPromoEligible && !!student.rule(BIG_PROMO_RULE_ID); },
      get note() {
        return student.bigPromoChosen
          ? '参加须在课程结束后发布100词以上的英文评价和5张以上照片；不可与淡季折扣同享，名额有限，以学校确认为准。'
          : '';
      },
      get value() { return student.bigPromoChosen; },
      set value(chosen: unknown) { student.bigPromoChosen = chosen === true || chosen === 'true'; },
    };
    const minor: PhExtraChoice = {
      label: '家长是否同行',
      options: [{ value: false, label: '家长同行' }, { value: true, label: '独自来读（加监护照护）' }],
      get visible() { return student.selectedAgeGroup === 'minor' && !student.isCamp; },
      get note() { return student.unaccompanied ? '无家长陪同的未成年学生每4周加收12,000比索监护照护费，到校后支付。' : ''; },
      get value() { return student.unaccompanied; },
      set value(selected: unknown) { student.unaccompanied = selected === true || selected === 'true'; },
    };
    this.extraChoices = [promo, minor];
  }

  // ---- plan helpers ------------------------------------------------------------------------------

  private get courseIds(): string[] { return this.quotePlan.courses.map(row => row.optionId); }
  get isCamp(): boolean { return this.courseIds.some(id => HANA_CAMP_IDS.includes(id)); }
  private get isSenior(): boolean { return this.courseIds.includes(HANA_SENIOR_ID); }

  /** The camp's room is part of the package: picking or leaving the camp swaps the room (template hook). */
  planOptionChanged(): void {
    const camp = this.isCamp;
    for (const row of this.quotePlan.rooms) {
      if (camp && row.optionId !== HANA_CAMP_ROOM.id) row.optionId = HANA_CAMP_ROOM.id;
      if (!camp && row.optionId === HANA_CAMP_ROOM.id) row.optionId = HANA_DOUBLE_ROOM_ID;
    }
    if (camp) this.selectedAgeGroup = 'minor';
  }

  private rowWeekStarts(row: QuotePlanRow): number[] {
    return this.quotePlan.weekStarts([row]);
  }

  /** Price of a row: 1–3 week totals use the short-stay ratio of the student's total weeks. */
  private prorate(fourWeekPrice: number, weeks: number): number {
    const total = this.quotePlan.courseWeeks;
    if (!Number.isInteger(total) || total < 1) return 0;
    const tier = total >= 4 ? 4 : total;
    const ratio = this.pricing.shortTermPriceRatios[String(tier)] ?? tier / 4;
    return round2(fourWeekPrice * ratio / tier * weeks);
  }

  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    if (kind === 'room') {
      if (row.optionId === HANA_CAMP_ROOM.id) return 0;
      return this.prorate(this.pricing.roomFees.find(item => item.id === row.optionId)?.fee ?? 0, row.weeks);
    }
    if (HANA_CAMP_IDS.includes(row.optionId)) return this.campRowPrice(row);
    return this.prorate(this.pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027 ?? 0, row.weeks);
  }

  /**
   * Junior Camp: the first four camp weeks at the season's weekly package price, later weeks at the
   * season's extra-week price; 1–3 week camps scale like other short stays (1 week low season = 700).
   */
  private campRowPrice(row: QuotePlanRow): number {
    const rates = HANA_CAMP_RATES[row.optionId as 'camp-a' | 'camp-b'];
    if (!rates) return 0;
    const campWeeks = this.quotePlan.weekStarts(this.quotePlan.courses.filter(item => HANA_CAMP_IDS.includes(item.optionId)));
    const total = campWeeks.length;
    if (!total) return 0;
    const ratio = this.pricing.shortTermPriceRatios[String(total)];
    const scale = total < 4 && ratio ? ratio / (total / 4) : 1;
    const sum = this.rowWeekStarts(row).reduce((amount, week) => {
      const peak = hanaIsPeakWeek(week);
      const extra = campWeeks.indexOf(week) >= 4;
      return amount + (extra ? (peak ? HANA_CAMP_RATES.extraPeak : HANA_CAMP_RATES.extraLow) : (peak ? rates.peak : rates.low));
    }, 0);
    return round2(sum * scale);
  }

  private get courseWeekStarts(): number[] { return this.quotePlan.weekStarts(this.quotePlan.courses); }
  get lowWeeks(): number { return this.courseWeekStarts.filter(week => !hanaIsPeakWeek(week)).length; }
  get peakWeeksInPlan(): number { return this.courseWeekStarts.filter(week => hanaIsPeakWeek(week)).length; }

  private courseAt(week: number): string {
    return this.quotePlan.courses.find(row => this.rowWeekStarts(row).includes(week))?.optionId ?? '';
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  get courseLengthError(): string {
    for (const course of this.pricing.courseFees) {
      const minimum = course.minimumWeeks ?? 0;
      const weeks = this.quotePlan.courses.filter(row => row.optionId === course.id).reduce((sum, row) => sum + row.weeks, 0);
      if (minimum && weeks && weeks < minimum) return `${course.name}须至少就读${minimum}周，请把周数改为${minimum}周或以上。`;
    }
    const golfWeeks = this.quotePlan.courses.filter(row => HANA_GOLF_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
    if (golfWeeks === 1 || golfWeeks === 3) return '高尔夫课程2周起，没有1周和3周，请调整周数。';
    return '';
  }

  private weeksIn(roomIds: readonly string[]): number[] {
    return this.quotePlan.weekStarts(this.quotePlan.rooms.filter(row => roomIds.includes(row.optionId)));
  }

  private get roomError(): string {
    const plan = this.quotePlan;
    const roomIds = plan.rooms.map(row => row.optionId);
    if (this.isCamp) {
      if (this.courseIds.some(id => !HANA_CAMP_IDS.includes(id))) return '青少年英语营请整段报名，不能和其他课程混排。';
      if (roomIds.some(id => id !== HANA_CAMP_ROOM.id)) return '青少年英语营已含住宿，请把住宿选为营地双人间。';
      if (this.selectedAgeGroup !== 'minor') return '青少年英语营只收7–17岁学生，请把年龄选为未满18岁。';
      return '';
    }
    if (roomIds.includes(HANA_SENIOR_COUPLE_ROOM_ID) && this.courseIds.some(id => id !== HANA_SENIOR_ID)) {
      return '乐龄夫妻房只供报名乐龄课程的夫妻，请改选其他房型。';
    }
    if (this.courseIds.some(id => KID_IDS.includes(id))) {
      if (this.selectedAgeGroup !== 'minor') return '青少年和幼儿园课程请把年龄选为未满18岁。';
      if (roomIds.includes(HANA_SINGLE_ROOM_ID)) return '孩子须与家长同住，请选双人间、三人间或家庭房。';
    }
    if (this.selectedAgeGroup === 'adult' && roomIds.includes(HANA_TRIPLE_ROOM_ID)
      && this.courseIds.some(id => HANA_ADULT_IDS.includes(id))) {
      return '成人课程只可住单人间、双人间或家庭房；三人间供家长和孩子同住。';
    }
    const offSeasonFamily2 = this.weeksIn(['family-2'])
      .some(week => !HANA_FAMILY_2_MONTHS.includes(new Date(week + 3 * DAY).getUTCMonth() + 1));
    if (offSeasonFamily2) return '2人家庭房只在3–6月、9–12月开放；1–2月和7–8月请选3人以上家庭房或双人间。';
    return '';
  }

  private get seasonError(): string {
    const peakWeeksOf = (courseId: string) => this.quotePlan.courses
      .filter(row => row.optionId === courseId)
      .some(row => this.rowWeekStarts(row).some(hanaIsPeakWeek));
    const peaks = HANA_PEAK_SEASONS.map(range => `${range.start.slice(5).replace('-', '/')}–${range.end.slice(5).replace('-', '/')}`);
    if (peakWeeksOf(HANA_SENIOR_ID)) return `乐龄课程只在淡季开放，请避开旺季（${peaks.slice(1).join('、')}）。`;
    if (peakWeeksOf(HANA_NO_CLASS_ID)) return '旺季家长须报名课程（家长陪读或Light），“家长不上课”只在淡季可选。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.today > HANA_CURRENT_PRICES_PAY_BY) return 'HANA 2027年新价格尚未公布，请联系思达启航顾问报价。';
    return this.quotePlan.error || this.courseLengthError || this.roomError || this.seasonError;
  }

  // ---- promotions -------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(item => item.id === id && item.enabled);
  }

  /** Adult Light ESL with a double room (or a parent's 3-person family room) inside the offer's dates. */
  get bigPromoEligible(): boolean {
    const plan = this.quotePlan;
    if (this.selectedAgeGroup !== 'adult' || !plan.courses.length) return false;
    if (plan.courses.some(row => row.optionId !== HANA_LIGHT_ESL_ID)) return false;
    if (plan.rooms.some(row => ![HANA_DOUBLE_ROOM_ID, 'family-3'].includes(row.optionId))) return false;
    const weeks = this.courseWeekStarts;
    const low = weeks.filter(week => !hanaIsPeakWeek(week));
    if (!low.length || !low.every(inBigPromoWindow)) return false;
    return low.length === weeks.length || (weeks.length >= 4 && low.length >= 2);
  }

  get bigPromoApplies(): boolean {
    return this.bigPromoChosen && this.bigPromoEligible && !!this.rule(BIG_PROMO_RULE_ID);
  }

  /** What the low-season weeks would normally cost (course and room, before any discount). */
  private lowWeekPrice(kinds: readonly QuotePlanKind[]): number {
    let amount = 0;
    for (const kind of kinds) {
      for (const row of this.quotePlan.rows(kind)) {
        const price = this.quotePlan.price(kind, row);
        if (!price || !row.weeks) continue;
        const low = this.rowWeekStarts(row).filter(week => !hanaIsPeakWeek(week)).length;
        amount += price / row.weeks * low;
      }
    }
    return amount;
  }

  get bigPromoPrice(): number { return round2(BIG_PROMO_PRICE * hanaBigPromoRatio(this.lowWeeks)); }
  get bigPromoDiscount(): number {
    return this.bigPromoApplies ? Math.max(0, round2(this.lowWeekPrice(['course', 'room']) - this.bigPromoPrice)) : 0;
  }

  /** Percentage of the student's low-season weeks, taken from the course they study that week. */
  get lowSeasonDiscount(): number {
    if (this.bigPromoApplies || !this.rule(LOW_SEASON_RULE_ID)) return 0;
    const low = this.lowWeeks;
    let amount = 0;
    for (const kind of ['course', 'room'] as const) {
      for (const row of this.quotePlan.rows(kind)) {
        const price = this.quotePlan.price(kind, row);
        if (!price || !row.weeks) continue;
        for (const week of this.rowWeekStarts(row)) {
          if (hanaIsPeakWeek(week)) continue;
          const rate = hanaLowSeasonRate(kind === 'course' ? row.optionId : this.courseAt(week), low);
          amount += price / row.weeks * rate / 100;
        }
      }
    }
    return round2(amount);
  }

  private get lowSeasonNote(): string {
    if (this.isSenior && this.courseIds.every(id => id === HANA_SENIOR_ID)) return '乐龄课程淡季课程费和住宿费减10%。';
    const rate = hanaLowSeasonRate(this.courseIds.find(id => hanaLowSeasonRate(id, this.lowWeeks) > 0) ?? '', this.lowWeeks);
    const peak = this.peakWeeksInPlan ? `；旺季${this.peakWeeksInPlan}周按原价` : '';
    return `淡季${this.lowWeeks}周，课程费和住宿费减${rate}%${peak}。`;
  }

  /** Non-cash benefits this plan qualifies for. */
  private get gifts(): Array<{ label: string; note: string; key: string }> {
    const gifts: Array<{ label: string; note: string; key: string }> = [];
    const low = this.lowWeeks;
    const adult = this.courseIds.some(id => HANA_ADULT_IDS.includes(id) || HANA_GUARDIAN_IDS.includes(id));
    if (adult && low >= 8 && !this.bigPromoApplies) {
      const times = low >= 16 ? 12 : low >= 12 ? 8 : 4;
      gifts.push({ label: '淡季长住福利', note: `淡季${low}周：按摩${times}次或健身房${times}周（成人1名）。`, key: LOW_SEASON_RULE_ID });
    }
    if (low > 0 && this.courseIds.some(id => id === 'junior-a' || id === 'junior-b')) {
      gifts.push({ label: '淡季免费晚间课', note: 'Junior A、B学生淡季平日晚上18:15–19:00免费上课。', key: LOW_SEASON_RULE_ID });
    }
    const yearEnd = this.quotePlan.covers('2026-12-14', '2027-01-01')
      && this.courseIds.some(id => !HANA_KINDER_IDS.includes(id) && id !== HANA_NO_CLASS_ID);
    if (yearEnd) {
      gifts.push({ label: '2026年末补课', note: '在校度过12/24、12/25、12/31和1/1假期，12/14–12/18每天加1节菲师一对一，共5节。', key: 'year-end' });
    }
    return gifts;
  }

  get promotionDiscountTotal(): number { return round2(this.bigPromoDiscount + this.lowSeasonDiscount); }

  get discountNames(): string {
    if (this.bigPromoApplies) return this.rule(BIG_PROMO_RULE_ID)?.name ?? '';
    return this.lowSeasonDiscount > 0 ? this.rule(LOW_SEASON_RULE_ID)?.name ?? '' : '';
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && this.rule(RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly seasonalSurcharge = 0;
  /** HANA charges no peak surcharge, so the template's surcharge lines stay empty. */
  readonly peakWeeks = 0;

  get quoteUsd(): number {
    return Math.max(0, round2(this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    const promo = this.rule(BIG_PROMO_RULE_ID);
    if (this.bigPromoApplies && promo) {
      const peak = this.peakWeeksInPlan ? `；旺季${this.peakWeeksInPlan}周按原价` : '';
      lines.push({
        icon: '惠', label: promo.name, value: -this.bigPromoDiscount, promotionKey: promo.id,
        note: `淡季${this.lowWeeks}周按${formatUsd(this.bigPromoPrice)}美元计${peak}；课程结束后须发布100词以上英文评价和5张以上照片，名额有限，以学校确认为准。`,
      });
    }
    const low = this.rule(LOW_SEASON_RULE_ID);
    if (this.lowSeasonDiscount > 0 && low) {
      lines.push({ icon: '惠', label: low.name, value: -this.lowSeasonDiscount, note: this.lowSeasonNote, promotionKey: low.id });
    }
    for (const gift of this.gifts) lines.push({ icon: '赠', label: gift.label, value: 0, note: gift.note, promotionKey: gift.key });
    return lines;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return 'Junior A／B／C须有家长同行（家长另报家长课程或“家长不上课”）；幼儿园收3–7岁；独自来读的7–17岁孩子可选青少年英语营。未满15岁独自入境菲律宾须办理WEG。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const weeks = this.quotePlan.stayWeeks;
    return Math.min(5, Math.max(0, Math.ceil((weeks - (this.visaType === 'tourist30' ? 4 : 8)) / 4)));
  }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** SSP and E-Card: stays of 3+ weeks, except a non-studying parent, a low-season kindergarten child and a short offer stay. */
  private get sspExemption(): string {
    if (this.courseIds.every(id => id === HANA_NO_CLASS_ID)) return '不上课的家长不需要办理SSP。';
    if (this.courseIds.every(id => HANA_KINDER_IDS.includes(id)) && !this.peakWeeksInPlan) return '幼儿园淡季入读不需要办理SSP。';
    if (this.bigPromoApplies && this.quotePlan.courseWeeks <= 4) return '付4周读8周学习4周以内不需要办理SSP。';
    if (this.quotePlan.stayWeeks < 3) return '停留不满3周不需要办理SSP。';
    return '';
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const create = (id: string, quantity: number, total: number, unitLabel: string, note?: string): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      return rule ? [{ item: rule.name, unitLabel, quantity, total, note: note ?? rule.note }] : [];
    };
    const once = (id: string, quantity: number, note?: string): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      return rule ? create(id, quantity, rule.amount * quantity, `${formatPhp(rule.amount)}／次`, note) : [];
    };
    if (this.isSenior && this.courseIds.every(id => id === HANA_SENIOR_ID)) {
      return [{ item: '当地费用', unitLabel: '已含', quantity: 1, total: 0, note: '乐龄课程价格已含SSP、签证、水电杂费、电费（80度内）、学生证和接机等当地费用，只另付押金。' }];
    }

    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const extensions = this.visaExtensionCount;
    const visaRule = this.feeRule('visa-extension');
    const sequence = (this.visaType === 'tourist59' ? visaRule?.tourist59Rates : visaRule?.rates) ?? [visaRule?.amount ?? 0];
    const visaAmounts = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0);
    const visaTotal = visaAmounts.reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `按${this.visaLabel}预估，${extensions ? `本次${extensions}次` : '本次无需续签'}；${visaRule?.note ?? ''}`;
    const visaRows = [
      ...create('visa-extension', extensions, visaTotal, `${formatPhp(sequence[0] ?? 0)}起／次`, visaNote),
      ...once('acr-i-card', !longTerm && plan.stayWeeks >= 9 ? 1 : 0, longTerm ? longTermNote : undefined),
    ];
    if (longTerm) visaRows.forEach(row => { row.waived = true; });

    if (this.isCamp) {
      return [
        { item: '当地费用', unitLabel: '已含', quantity: 1, total: 0, note: '英语营费用已含SSP、E-Card、水电杂费、电费、教材、学生证和机场接送；第5周起签证续签另付。' },
        ...visaRows,
      ];
    }

    const exemption = this.sspExemption;
    const ssp = longTerm ? 0 : exemption ? 0 : 1;
    const sspNote = longTerm ? longTermNote : exemption || undefined;
    const sspRows = [...once('ssp', ssp, sspNote), ...once('ssp-e-card', ssp, sspNote)];
    if (longTerm) sspRows.forEach(row => { row.waived = true; });

    // Utility and electricity per person per room type, by the weeks spent in that room.
    const roomRows = (id: 'utility' | 'electricity'): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const rows: SchoolLocalFee[] = [];
      for (const roomId of [...new Set(plan.rooms.map(row => row.optionId))]) {
        const fees = HANA_ROOM_WEEKLY_FEES[roomId];
        const weeks = this.weeksIn([roomId]).length;
        if (!fees || !weeks) continue;
        const weekly = fees[id] / fees.people;
        const room = this.pricing.roomFees.find(item => item.id === roomId)?.name ?? '';
        const shared = fees.people > 1 ? `每间${formatPhp(fees[id] * 4)}／4周，按${fees.people}人平均` : '';
        rows.push({
          item: rule.name, unitLabel: `${formatPhp(weekly * 4)}／4周`, quantity: weeks, total: Math.round(weekly * weeks),
          note: `${room}${shared ? `：${shared}` : ''}，按${weeks}周计。${id === 'electricity' ? '每间每4周含80度，超出每度22比索从押金扣。' : '含水费、清洁、洗衣、安保、饮用水、泳池和维护。'}`,
        });
      }
      return rows;
    };
    const care = this.selectedAgeGroup === 'minor' && this.unaccompanied ? plan.roomWeeks : 0;
    const careRule = this.feeRule('minor-care');
    return [
      ...sspRows,
      ...visaRows,
      ...once('student-id', 1),
      ...roomRows('utility'),
      ...roomRows('electricity'),
      ...(care && careRule ? create('minor-care', care, Math.round(careRule.amount / 4 * care), `${formatPhp(careRule.amount)}／4周`, `无家长陪同的未成年学生，按${care}周计。`) : []),
    ];
  }
}

export class HanaQuote extends PhSchoolQuote<HanaPageStudent> {
  constructor(pricing: HanaQuotePricing) {
    super(pricing, {
      createStudent: () => new HanaPageStudent(pricing),
      headingPrefix: 'HANA',
      image: { schoolCode: 'HANA', schoolName: '菲律宾克拉克HANA语言学校', filePrefix: 'HANA', heroSrc: HANA_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => pricing.shortTermPriceRatios[String(weeks)] ?? weeks / 4,
      optionalFeeItems: students => hanaOptionalFees(students, pricing),
      layoutVersion: 2,
    });
  }

  /** Non-cash benefits say 赠送 instead of “0 美元”. */
  override get schoolPaymentItems() { return super.schoolPaymentItems.map(giftAmount); }
  override get quoteImageData() {
    const data = super.quoteImageData;
    return { ...data, paymentItems: data.paymentItems.map(giftAmount) };
  }
}

const giftAmount = <T extends { icon: string; amount: string; accent?: boolean }>(item: T): T =>
  item.icon === '赠' ? { ...item, amount: '赠送', accent: false } : item;

/** Pickup, deposit and textbooks: paid at school, outside the local-fee total. */
function hanaOptionalFees(students: readonly HanaPageStudent[], pricing: HanaQuotePricing): PhOptionalFeeItem[] {
  const rate = pricing.phpPerCny;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / rate), 'zh-CN')} 元`;
  const rule = (id: string) => pricing.localFeeRules.find(item => item.id === id && item.enabled);
  const items: PhOptionalFeeItem[] = [];
  const pickup = rule('pickup');
  const pickupNeeded = students.some(student => !student.isCamp && !student.quotePlan.courses.every(row => row.optionId === HANA_SENIOR_ID));
  if (pickup && pickupNeeded) {
    items.push({
      label: pickup.name,
      amount: `克拉克 ${formatPhp(pickup.amount)}／马尼拉 ${formatPhp(pickup.secondaryAmount ?? 0)}`,
      cnyAmount: `${cny(pickup.amount)}／${cny(pickup.secondaryAmount ?? 0).replace('约人民币 ', '')}`,
      note: pickup.note,
    });
  }
  const deposit = rule('deposit');
  if (deposit && students.some(student => !student.isCamp)) {
    const payers = students.filter(student => !student.isCamp).length;
    const total = deposit.amount * payers;
    items.push({ label: deposit.name, amount: formatPhp(total), cnyAmount: cny(total), note: `${deposit.note}${payers > 1 ? `（${payers}人）` : ''}` });
  }
  const books = rule('books');
  if (books && students.some(student => !student.isCamp)) {
    items.push({ label: books.name, amount: '每本 300–400 比索', cnyAmount: `${cny(300)}起／本`, note: books.note });
  }
  return items;
}

export class HanaPlanComparison extends PhPlanComparison<HanaPageStudent> {
  constructor(pricing: HanaQuotePricing, conditions: () => HanaPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new HanaPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.unaccompanied = from.unaccompanied;
        // Comparisons show standard prices; the offer fixes its own room and course.
        to.bigPromoChosen = false;
      },
      heading: 'HANA 方案对比报价',
      courseGroups: HANA_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
