// Cebu Blue Ocean Academy (蓝海CBOA) on the shared Philippine school quote and plan comparison. The school's own rules
// are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up and lay
// out the result. The school's price notes decide the year: tuition, rooms and offers by registration date (2026
// prices and offers before 2027/02/01, 2027 ones from it), local fees by entry date. Keep this file free of Angular,
// DOM and storage access, so the WeChat mini program can bundle it later.
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import { textbookGroups } from '../school-textbook-estimate';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  CBOA_ADULT_ONLY_FROM,
  CBOA_COUPLE_ROOM_ID,
  CBOA_FAMILY_COURSE_IDS,
  CBOA_JUNIOR_COURSE_ID,
  CBOA_OCEAN_SUITES_ROOM_IDS,
  CBOA_PRICE_SWITCH,
  CBOA_SURVIVAL_COURSE_ID,
} from './cboa-content-config';

export const CBOA_QUOTE_IMAGE_HERO = '/assets/cebu-blue-ocean/suites/pool.webp';
export const CBOA_WEEK_OPTIONS = Array.from({ length: 24 }, (_, index) => index + 1);
const DAY = 86400000;
const SIDA_RULE_ID = 'sida-95';
const SURVIVAL_MAX_WEEKS = 4;

/** Everything the CBOA quote reads; the page component is one. */
export interface CboaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** The applied content document; rows are priced from its two price years. */
  readonly cboaContent: CiaContentConfig;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CBOA_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '口语ESL', courseIds: ['light-esl', 'intensive-esl', 'survival-esl', 'power-esl-5', 'power-esl-7'] },
  { id: 'exam', label: '考试与商务', courseIds: ['toeic', 'ielts', 'business', 'ebe'] },
] as const;

/** Price ratio of a 1–3 week row; four weeks and longer are proportional. */
export const cboaPriceMultiplier = (weeks: number, ratios: Record<string, number>): number => ratios[String(weeks)] ?? weeks / 4;

/** 2026 before the switch day, 2027 from it (registration date for prices, entry date for local fees). */
export const cboaPriceYear = (date: string): 2026 | 2027 => (date && date >= CBOA_PRICE_SWITCH ? 2027 : 2026);

const money = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
const php = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const slash = (value: string): string => value.replace(/-/g, '/');
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** A local-fee rule as it applies to an entry date (2027 rows switch on 2027/02/01). */
export function cboaDatedFee(rule: CiaLocalFeeRule, entryDate: string): CiaLocalFeeRule {
  if (!rule.futureEffectiveStart || !entryDate || entryDate < rule.futureEffectiveStart) return rule;
  return {
    ...rule, name: rule.futureName ?? rule.name, amount: rule.futureAmount ?? rule.amount,
    rates: rule.futureRates ?? rule.rates, note: rule.futureNote ?? rule.note,
  };
}

/** Which textbook rule a course uses (the 2027 price list prices TOEIC, Business and IELTS books apart). */
const bookRuleId = (courseId: string): string =>
  courseId === 'toeic' ? 'books-toeic'
    : courseId === 'ielts' ? 'books-ielts'
      : courseId === 'business' || courseId === 'ebe' ? 'books-business'
        : 'books-general';

/** One CBOA student: plan, conditions and every amount the template and quote image show. */
export class CboaPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = localToday();

  constructor(private readonly pricing: CboaQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'intensive-esl', 'egi-triple-ocean', nextQuoteSunday(), CBOA_WEEK_OPTIONS,
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
    );
  }

  private get content(): CiaContentConfig { return this.pricing.cboaContent; }
  /** The price year from the registration date (the school's price notes). */
  get priceYear(): 2026 | 2027 { return cboaPriceYear(this.selectedRegistrationDate); }
  /** The local-fee year from the entry date. */
  private get entryDate(): string { return this.quotePlan.startDate; }

  /** Four-week price of a course or room in the student's price year; 0 when that year has no price. */
  fourWeekPrice(kind: QuotePlanKind, optionId: string): number {
    if (kind === 'course') {
      const item = this.content.courses.find(course => course.id === optionId);
      return (this.priceYear === 2027 ? item?.tuition2027 : item?.tuition) ?? 0;
    }
    const item = this.content.rooms.find(room => room.id === optionId);
    return (this.priceYear === 2027 ? item?.fee2027 ?? item?.fee : item?.fee) ?? 0;
  }

  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    return this.fourWeekPrice(kind, row.optionId) * cboaPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
  }

  private name(kind: QuotePlanKind, id: string): string {
    return (kind === 'course' ? this.pricing.courseFees : this.pricing.roomFees).find(item => item.id === id)?.name ?? id;
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(_courseId: string): number { return 0; }

  /** A course or room the 2026 price list does not have (EBE, the Couple Room) needs a 2027 registration. */
  private get missingPriceError(): string {
    for (const kind of ['course', 'room'] as const) {
      const row = this.quotePlan.rows(kind).find(item => this.fourWeekPrice(kind, item.optionId) <= 0);
      if (row) return `${this.name(kind, row.optionId)}是2027年新增的选项，${slash(CBOA_PRICE_SWITCH)}起报名才可选，请改选其他${kind === 'course' ? '课程' : '房型'}或调整报名日期。`;
    }
    return '';
  }

  get courseLengthError(): string {
    const weeks = this.quotePlan.courses.filter(row => row.optionId === CBOA_SURVIVAL_COURSE_ID).reduce((sum, row) => sum + row.weeks, 0);
    return weeks > SURVIVAL_MAX_WEEKS ? `${this.name('course', CBOA_SURVIVAL_COURSE_ID)}最多读${SURVIVAL_MAX_WEEKS}周，请缩短周数或改选其他课程。` : '';
  }

  /** From 2026/08/23 entries, under-18s may only take the Junior family course; Junior is for 7–15. */
  private get ageError(): string {
    const courses = this.quotePlan.courses;
    if (this.selectedAgeGroup === 'minor') {
      const adultOnly = this.entryDate >= CBOA_ADULT_ONLY_FROM && courses.some(row => row.optionId !== CBOA_JUNIOR_COURSE_ID);
      return adultOnly ? '未满18岁只能报青少年家庭课程（7–15岁），不能报成人课程。' : '';
    }
    return courses.some(row => row.optionId === CBOA_JUNIOR_COURSE_ID) ? '青少年家庭课程只接受7–15岁的孩子，请把年龄改为未满18岁或改选其他课程。' : '';
  }

  /** The price list: the Junior and family course price does not apply during the peak season. */
  private get familyPeakError(): string {
    const rows = this.quotePlan.courses.filter(row => CBOA_FAMILY_COURSE_IDS.includes(row.optionId));
    if (!rows.length) return '';
    const ranges = this.enabledPeakRanges;
    const touching = ranges.filter(range => this.quotePlan.overlapWeeks(range.start, range.end, rows) > 0);
    return touching.length
      ? `家庭课程在暑期旺季（${touching.map(range => `${slash(range.start)}–${slash(range.end)}`).join('、')}）不按此价格，旺季亲子安排请咨询顾问。`
      : '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名日期。';
    return this.quotePlan.error || this.missingPriceError || this.courseLengthError || this.ageError || this.familyPeakError;
  }

  // ---- peak ------------------------------------------------------------------------------------

  private get enabledPeakRanges() { return this.pricing.peakSeasonRanges.filter(range => range.enabled !== false); }

  /** Study and stay weeks touching a summer peak range, each week once, at 60 dollars a week. */
  private get peak() {
    return calculateAssociationPeakSurcharge('BLUE-OCEAN', this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]),
      this.enabledPeakRanges, this.pricing.seasonalFeePerWeek);
  }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }

  /** Course weeks outside every peak range; the regular offers skip peak weeks. */
  private get offPeakCourseWeeks(): number {
    const ranges = this.enabledPeakRanges.map(range => ({ from: this.quotePlan.date(range.start), to: this.quotePlan.date(range.end) }));
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(week =>
      !ranges.some(range => range.from !== null && range.to !== null && week <= range.to && week + 6 * DAY >= range.from)).length;
  }

  // ---- promotions ------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Registration and entry windows of an offer. */
  private inWindow(rule: CiaPromotionRule): boolean {
    const date = this.selectedRegistrationDate;
    if (rule.registrationStart && date < rule.registrationStart) return false;
    if (rule.registrationEnd && date > rule.registrationEnd) return false;
    const entry = this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.entryDate;
    if (rule.arrivalStart && entry < rule.arrivalStart) return false;
    if (rule.arrivalEnd && entry > rule.arrivalEnd) return false;
    return !(rule.newStudentsOnly && this.returningStudent);
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  /** Sida's rate on the full course and room price, before the school's fixed offers (the cheaper order for students). */
  get sidaDiscount(): number {
    const rule = this.rule(SIDA_RULE_ID);
    return rule ? money((this.tuition + this.accommodation) * rule.discountValue / 100) : 0;
  }

  /** The school offer amounts by rule id, for the price year the registration date picks. */
  private get schoolOffers(): Array<{ rule: CiaPromotionRule; amount: number; note: string }> {
    const courseWeeks = this.quotePlan.courseWeeks;
    const offPeak = this.offPeakCourseWeeks;
    const offers: Array<{ rule: CiaPromotionRule; amount: number; note: string }> = [];
    const add = (id: string, amount: (rule: CiaPromotionRule) => number, note: (rule: CiaPromotionRule) => string) => {
      const rule = this.rule(id);
      if (!rule || !this.inWindow(rule)) return;
      const value = amount(rule);
      if (value > 0) offers.push({ rule, amount: money(value), note: note(rule) });
    };
    add('off-season', rule => Math.floor(offPeak / Math.max(1, rule.incrementWeeks ?? 4)) * rule.discountValue,
      rule => `${rule.description}本次${Math.floor(offPeak / Math.max(1, rule.incrementWeeks ?? 4))}个完整4周。`);
    add('twelve-week', rule => (courseWeeks >= rule.minimumCourseWeeks ? rule.discountValue : 0), rule => rule.description);
    add('long-stay', rule => this.tieredAmount(rule, courseWeeks), rule => `${rule.description}本次课程${courseWeeks}周。`);
    add('regular-2027', rule => offPeak * rule.discountValue, rule => `${rule.description}本次${offPeak}周。`);
    add('long-term-2027', rule => this.tieredAmount(rule, courseWeeks), rule => `${rule.description}本次课程${courseWeeks}周。`);
    return offers;
  }

  private tieredAmount(rule: CiaPromotionRule, weeks: number): number {
    if (weeks < rule.minimumCourseWeeks) return 0;
    const steps = rule.incrementWeeks && rule.incrementValue ? Math.floor((weeks - rule.minimumCourseWeeks) / rule.incrementWeeks) : 0;
    return rule.discountValue + steps * (rule.incrementValue ?? 0);
  }

  get promotionDiscountTotal(): number {
    return money(this.sidaDiscount + this.schoolOffers.reduce((sum, offer) => sum + offer.amount, 0));
  }

  get discountNames(): string {
    const sida = this.rule(SIDA_RULE_ID);
    return [...(this.sidaDiscount > 0 && sida ? [sida.name] : []), ...this.schoolOffers.map(offer => offer.rule.name)].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registrationWaiverName(): string | undefined {
    if (this.returningStudent) return undefined;
    return this.pricing.promotions.find(rule => rule.enabled && rule.waiveRegistration)?.name;
  }

  get registration(): number {
    return this.returningStudent || this.registrationWaiverName !== undefined ? 0 : this.pricing.registrationFee;
  }

  get quoteUsd(): number {
    return Math.max(0, money(this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const sida = this.rule(SIDA_RULE_ID);
    const peak = this.peak;
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge,
        note: `学习和住宿周与暑期旺季重叠：${associationPeakBreakdownText(peak)}；同一周只计一次，不参与优惠`,
        promotionKey: 'blue-peak',
      }] : []),
      ...(sida && this.sidaDiscount ? [{ icon: '折', label: sida.name, value: -this.sidaDiscount, note: sida.description, promotionKey: sida.id }] : []),
      ...this.schoolOffers.map(offer => ({
        icon: offer.rule.id.includes('long') || offer.rule.id === 'twelve-week' ? '长' : '惠',
        label: offer.rule.name, value: -offer.amount, note: offer.note, promotionKey: offer.rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  readonly minorNote = '2026/08/23起入学，未满18岁不能报成人课程，只能报青少年家庭课程（7–15岁）。';

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** Extensions by stay weeks, as the price list's table: a 30-day entry from week 5, a 59-day entry from week 9. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const covered = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - covered) / 4));
  }

  private localRule(id: string): CiaLocalFeeRule | undefined {
    const rule = this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
    return rule ? cboaDatedFee(rule, this.entryDate) : undefined;
  }

  private get suitesWeeks(): number {
    return this.quotePlan.rooms.filter(row => CBOA_OCEAN_SUITES_ROOM_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const extensions = this.visaExtensionCount;
    const rows: SchoolLocalFee[] = [];
    const once = (id: string, quantity: number, note?: string) => {
      const rule = this.localRule(id);
      if (!rule) return;
      const waived = longTerm && !!rule.waiveForLongTermVisa;
      rows.push({
        item: rule.name, unitLabel: `${php(rule.amount)}／次`, quantity: waived ? 0 : quantity,
        total: waived ? 0 : rule.amount * quantity, note: waived ? longTermNote : note ?? rule.note, ...(waived ? { waived: true } : {}),
      });
    };
    const weekly = (id: string, weeks: number, note?: string) => {
      const rule = this.localRule(id);
      if (!rule) return;
      rows.push({ item: rule.name, unitLabel: `${php(rule.amount)}／周`, quantity: weeks, total: rule.amount * weeks, note: note ?? rule.note });
    };
    once('ssp', 1);
    once('ssp-i-card', 1);
    // ACR I-CARD comes with the first visa extension (user decision 2026-11-24): a 30-day visa for 6 weeks pays it, a 59-day visa for 8 weeks does not.
    once('acr-i-card', extensions > 0 ? 1 : 0);
    const visa = this.localRule('visa-extension');
    if (visa) {
      const sequence = (this.visaType === 'tourist59' ? visa.tourist59Rates ?? visa.rates : visa.rates) ?? [visa.amount];
      const amounts = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? visa.amount);
      rows.push({
        item: visa.name, unitLabel: '按停留周数累计', quantity: longTerm ? 0 : extensions,
        total: longTerm ? 0 : amounts.reduce((sum, value) => sum + value, 0),
        note: longTerm ? longTermNote : `按${this.visaLabel}预估，本次${extensions ? `${extensions}次` : '无需续签'}；${visa.note}`,
        ...(longTerm ? { waived: true } : {}),
      });
    }
    weekly('maintenance', plan.stayWeeks);
    if (this.suitesWeeks) weekly('suites-utilities', this.suitesWeeks);
    for (const group of textbookGroups(plan.courses, bookRuleId)) {
      const rule = this.localRule(group.type);
      if (!rule) continue;
      const periods = Math.ceil(group.weeks / Math.max(1, rule.periodWeeks ?? 4));
      rows.push({ item: rule.name, unitLabel: `${php(rule.amount)}／${rule.periodWeeks ?? 4}周`, quantity: periods, total: rule.amount * periods, note: rule.note });
    }
    once('student-id', 1);
    return rows;
  }

  /** Ocean Suites and EGI weeks of this student, for the deposit and the metered EGI utilities. */
  get roomWeeks(): number { return this.quotePlan.roomWeeks; }
  get egiWeeks(): number { return this.quotePlan.roomWeeks - this.suitesWeeks; }
  get coupleRoom(): boolean { return this.quotePlan.rooms.some(row => row.optionId === CBOA_COUPLE_ROOM_ID); }
  get localFeeDate(): string { return this.entryDate; }
}

/** Deposit (per room week), metered EGI utilities, pickup, drop-off and laundry: outside the local-fee total. */
function cboaOptionalFeeItems(pricing: CboaQuotePricing, students: readonly CboaPageStudent[]): PhOptionalFeeItem[] {
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  const count = students.length;
  const items: PhOptionalFeeItem[] = [];
  for (const base of pricing.localFeeRules.filter(rule => rule.enabled && !rule.includeInTotal).sort((a, b) => a.sortOrder - b.sortOrder)) {
    const rule = cboaDatedFee(base, students[0]?.localFeeDate ?? '');
    if (rule.id === 'deposit') {
      const weeks = students.reduce((sum, student) => sum + student.roomWeeks, 0);
      items.push({ label: rule.name, amount: php(rule.amount * weeks), cnyAmount: cny(rule.amount * weeks), note: `${rule.note}（本次${count > 1 ? `${count}人共` : ''}${weeks}周）` });
    } else if (rule.id === 'egi-utilities') {
      if (students.some(student => student.egiWeeks > 0)) items.push({ label: rule.name, amount: '按电表计算', cnyAmount: '', note: rule.note });
    } else if (rule.secondaryAmount) {
      items.push({
        label: rule.name, amount: `${php(rule.amount)}／${rule.secondaryLabel || '另一种'}${php(rule.secondaryAmount)}`,
        cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(rule.amount / pricing.phpPerCny), 'zh-CN')}／${quoteCurrencyText(Math.round(rule.secondaryAmount / pricing.phpPerCny), 'zh-CN')} 元`,
        note: rule.note,
      });
    } else {
      items.push({ label: rule.name, amount: php(rule.amount), cnyAmount: cny(rule.amount), note: rule.note });
    }
  }
  return items;
}

export class CboaQuote extends PhSchoolQuote<CboaPageStudent> {
  constructor(pricing: CboaQuotePricing) {
    super(pricing, {
      createStudent: () => new CboaPageStudent(pricing),
      headingPrefix: '蓝海CBOA',
      image: { schoolCode: 'CBOA', schoolName: '菲律宾宿务蓝海语言学校', filePrefix: 'CBOA', heroSrc: CBOA_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => cboaPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => cboaOptionalFeeItems(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class CboaPlanComparison extends PhPlanComparison<CboaPageStudent> {
  constructor(pricing: CboaQuotePricing, conditions: () => CboaPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new CboaPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: '蓝海CBOA 方案对比报价',
      courseGroups: CBOA_COMPARE_COURSE_GROUPS,
      layoutVersion: 2,
    });
  }
}
