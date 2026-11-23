// EV Academy La Mer on the shared Philippine school quote and plan comparison. All La Mer prices and rules come
// from the content document (la-mer-content-config.ts or the published revision): ordinary course and room prices
// with 40/65/85% short stays, the per-week school offer by Monday course start, the Sida rate on what remains, the
// summer surcharge, and the family packages (whole-family prices by version, season, room and weeks). A family
// package is chosen as a course; it brings one 家庭房 room choice and is never shown in the course list or 方案对比.
// Keep this file free of Angular, DOM and storage access (mini-program-ready).
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanOption, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import { createCiaQuotePricing, type CiaQuoteCourse, type CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison, type PhCompareFocus } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import { LA_MER_FAMILY_WEEKS } from './la-mer-content-config';
import type { LaMerFamilyPrice, LaMerFamilyVersion, LaMerPolicy } from './la-mer-types';

/** Everything La Mer's quote reads; the page component is one. */
export interface LaMerQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** Family packages and what they include, from the content document's quoteSettings.laMer. */
  laMerPolicy: LaMerPolicy;
}

export const LA_MER_QUOTE_IMAGE_HERO = '/assets/la-mer/campus/pool-sunset.webp';
export const LA_MER_FAMILY_PREFIX = 'family-';
export const LA_MER_FAMILY_ROOM_ID = 'family-room';
const FAMILY_ROOM: QuotePlanOption = { id: LA_MER_FAMILY_ROOM_ID, name: '家庭房（含在亲子套餐内）', details: '亲子套餐整包价已含住宿和三餐' };
const FAMILY_DETAILS = '孩子每天5节一对一；监护人每天3节一对一＋2节团体课；整包价含住宿、三餐和列明的学杂费';
const DEFAULT_COURSE = 'esl-classic';
const DEFAULT_ROOM = 'double';
const DAY = 86400000;
/** Order of the family rooms in the course list. */
const FAMILY_ROOM_ORDER = ['pool-double', 'double', 'pool-triple', 'triple', 'quad'];

const VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const LA_MER_COMPARE_COURSE_GROUPS = [
  { id: 'speaking', label: '综合英语与口语强化', courseIds: ['esl-classic', 'power-speaking-6', 'power-speaking-8'] },
  { id: 'senior', label: '熟龄英语', courseIds: ['senior', 'esl-classic'] },
] as const;

export const isLaMerFamilyCourse = (courseId: string): boolean => courseId.startsWith(LA_MER_FAMILY_PREFIX);
const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const slash = (value: string) => value.replace(/-/g, '/');
const addDays = (date: string, days: number): string => {
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time) ? new Date(time + days * DAY).toISOString().slice(0, 10) : '';
};
const enabledRule = (pricing: LaMerQuotePricing, kind: string): CiaPromotionRule | undefined =>
  pricing.promotions.find(rule => rule.enabled && rule.ruleKind === kind);

/** Multiple of the four-week price for a row of this many weeks (1/2/3 weeks: the content document's ratios). */
export function laMerPriceMultiplier(weeks: number, ratios: Record<string, number>): number {
  return weeks >= 4 ? weeks / 4 : ratios[String(weeks)] ?? Number.NaN;
}

/** The family packages as course choices, one per room and family size; cached per policy object. */
const familyOptionCache = new WeakMap<LaMerPolicy, QuotePlanOption[]>();
function familyOptions(policy: LaMerPolicy | undefined): QuotePlanOption[] {
  if (!policy) return [];
  let options = familyOptionCache.get(policy);
  if (!options) {
    const seen = new Map<string, LaMerFamilyPrice>();
    for (const version of policy.familyVersions.filter(item => item.enabled)) {
      for (const item of version.packages.filter(entry => entry.enabled)) {
        const key = `${item.id}-${item.people}`;
        if (!seen.has(key)) seen.set(key, item);
      }
    }
    const order = (item: LaMerFamilyPrice) => {
      const index = FAMILY_ROOM_ORDER.indexOf(item.id);
      return (index < 0 ? FAMILY_ROOM_ORDER.length : index) * 10 + item.people;
    };
    options = [...seen.values()].sort((a, b) => order(a) - order(b)).map(item => ({
      id: `${LA_MER_FAMILY_PREFIX}${item.id}-${item.people}`,
      name: `亲子套餐｜${item.name}（${item.people}人）`,
      details: FAMILY_DETAILS,
    }));
    familyOptionCache.set(policy, options);
  }
  return options;
}

/** One La Mer student (or, with a family package, one family) as the template binds it. */
export class LaMerPageStudent implements PhPageStudent {
  readonly visaOptions = VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType: string = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  readonly courseLengthError = '';
  private courseSource?: readonly CiaQuoteCourse[];
  private familySource?: readonly QuotePlanOption[];
  private courseOptionCache: QuotePlanOption[] = [];
  private roomSource?: readonly CiaQuoteRoom[];
  private roomOptionCache: QuotePlanOption[] = [];

  /** allowFamily: false for 方案对比 plans, which compare ordinary courses only. */
  constructor(private readonly pricing: LaMerQuotePricing, private readonly allowFamily = true) {
    this.quotePlan = new SchoolQuotePlan(
      DEFAULT_COURSE, DEFAULT_ROOM, nextQuoteSunday(), Array.from({ length: 24 }, (_, index) => index + 1),
      kind => kind === 'course' ? this.courseOptions() : this.roomOptions(),
      (kind, row) => this.basePrice(kind, row),
    );
  }

  // ---- choices ----------------------------------------------------------------------------------

  private courseOptions(): QuotePlanOption[] {
    const courses = this.pricing.courseFees ?? [];
    const families = this.allowFamily ? familyOptions(this.pricing.laMerPolicy) : [];
    if (this.courseSource !== courses || this.familySource !== families) {
      this.courseSource = courses;
      this.familySource = families;
      this.courseOptionCache = [...courses.map(course => ({ id: course.id, name: course.name, details: course.schedule })), ...families];
    }
    return this.courseOptionCache;
  }

  private roomOptions(): QuotePlanOption[] {
    if (this.isFamily) return [FAMILY_ROOM];
    const rooms = this.pricing.roomFees ?? [];
    if (this.roomSource !== rooms) {
      this.roomSource = rooms;
      this.roomOptionCache = rooms.map(room => ({ id: room.id, name: room.name, details: room.note }));
    }
    return this.roomOptionCache;
  }

  get isFamily(): boolean { return this.quotePlan.courses.some(row => isLaMerFamilyCourse(row.optionId)); }

  /** A family package brings its own family room and runs as one period; leaving it restores a normal room. */
  planOptionChanged(): void {
    const plan = this.quotePlan;
    if (this.isFamily) {
      const weeks = plan.courseWeeks;
      const family = plan.courses.find(row => isLaMerFamilyCourse(row.optionId))!;
      plan.courses.splice(0, plan.courses.length, { ...family, weeks, startDate: plan.courses[0].startDate });
      plan.rooms.splice(1);
      plan.rooms[0].optionId = LA_MER_FAMILY_ROOM_ID;
      plan.rooms[0].startDate = plan.courses[0].startDate;
      plan.rooms[0].weeks = weeks;
      if (!LA_MER_FAMILY_WEEKS.includes(weeks)) plan.setStayWeeks(4);
      this.selectedAgeGroup = 'adult';
    } else {
      for (const row of plan.rooms) {
        if (row.optionId === LA_MER_FAMILY_ROOM_ID) row.optionId = DEFAULT_ROOM;
      }
    }
  }

  // ---- prices -----------------------------------------------------------------------------------

  /** The plan prorates rows by the student's tier; a family row returns its exact package price for the whole stay. */
  private basePrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    if (kind === 'room' && row.optionId === LA_MER_FAMILY_ROOM_ID) return 0;
    if (kind === 'course' && isLaMerFamilyCourse(row.optionId)) {
      const weeks = this.quotePlan.courseWeeks;
      const price = this.familyPackage?.prices[String(weeks)];
      return typeof price === 'number' && price > 0 ? price / weeks * row.weeks : 0;
    }
    const fee = kind === 'course'
      ? (() => { const course = this.pricing.courseFees.find(item => item.id === row.optionId); return course ? course.tuition2027 || course.tuition : undefined; })()
      : this.pricing.roomFees.find(item => item.id === row.optionId)?.fee;
    return (fee ?? Number.NaN) * laMerPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
  }

  private get familyCourseId(): string { return this.quotePlan.courses.find(row => isLaMerFamilyCourse(row.optionId))?.optionId ?? ''; }

  /** Family size from the package choice id (family-<room>-<people>). */
  get familyPeople(): number {
    const match = /-(\d+)$/.exec(this.familyCourseId);
    return match ? Number(match[1]) : 0;
  }

  private get familyRoomId(): string {
    return this.familyCourseId.slice(LA_MER_FAMILY_PREFIX.length).replace(/-\d+$/, '');
  }

  private versionAt(date: string): LaMerFamilyVersion | undefined {
    return (this.pricing.laMerPolicy?.familyVersions ?? [])
      .filter(version => version.enabled && date >= version.start && date <= version.end)
      .sort((a, b) => b.priority - a.priority)[0];
  }

  private seasonAt(date: string, version: LaMerFamilyVersion): 'off' | 'peak' {
    return version.peakRanges.some(range => date >= range.start && date <= range.end) ? 'peak' : 'off';
  }

  /** The package of the version and season of the arrival date. */
  get familyPackage(): LaMerFamilyPrice | undefined {
    if (!this.isFamily) return undefined;
    const start = this.quotePlan.courses[0]?.startDate ?? '';
    const version = this.versionAt(start);
    if (!version) return undefined;
    const season = this.seasonAt(start, version);
    return version.packages.find(item => item.enabled && item.id === this.familyRoomId && item.people === this.familyPeople
      && (item.season === 'all' || item.season === season));
  }

  private get familyError(): string {
    const plan = this.quotePlan;
    if (plan.courses.length !== 1 || plan.rooms.some(row => row.optionId !== LA_MER_FAMILY_ROOM_ID)) {
      return '亲子套餐请整段选择同一个套餐，不要和普通课程或住宿分段组合。';
    }
    const weeks = plan.courseWeeks;
    if (!LA_MER_FAMILY_WEEKS.includes(weeks)) return `亲子套餐只有${LA_MER_FAMILY_WEEKS.join('、')}周的整包价，请调整周数。`;
    const start = plan.courses[0].startDate;
    const version = this.versionAt(start);
    if (!version) return '这个入学日期没有亲子套餐价格，请联系顾问。';
    const days = Array.from({ length: weeks * 7 }, (_, index) => addDays(start, index));
    if (days.some(day => this.versionAt(day)?.id !== version.id)) return '这个方案跨越两个亲子价格期，请调整日期或联系顾问核价。';
    if (days.some(day => version.exclusions.some(range => day >= range.start && day <= range.end))) return '学校在这段日期不开放亲子套餐，请调整入学日期。';
    const season = this.seasonAt(start, version);
    if (days.some(day => this.seasonAt(day, version) !== season)) return '这个方案跨淡旺季，学校没有混合价格，请调整日期或联系顾问核价。';
    const price = this.familyPackage?.prices[String(weeks)];
    if (!(typeof price === 'number' && price > 0)) return '这个日期没有该房型和人数的亲子套餐，请换房型或联系顾问。';
    return '';
  }

  get quoteError(): string {
    const plan = this.quotePlan;
    if (plan.error) return plan.error;
    if (this.isFamily) return this.familyError;
    if (![this.tuition, this.accommodation].every(value => Number.isFinite(value))) return '当前价格配置不完整，请联系顾问核对。';
    if (this.localFees.some(fee => !Number.isFinite(fee.total))) return '到校学杂费配置不完整，请联系顾问核对。';
    return '';
  }

  minimumWeeks(_courseId: string): number { return 0; }

  get tuition(): number { return round(this.quotePlan.total('course')); }
  get accommodation(): number { return this.isFamily ? 0 : round(this.quotePlan.total('room')); }
  get registration(): number { return this.isFamily || this.returningStudent ? 0 : this.pricing.registrationFee; }

  /** Family packages include their registration; each member's 500-dollar deposit is part of the package total. */
  get registrationNote(): string | undefined {
    if (!this.isFamily) return undefined;
    const deposit = this.pricing.laMerPolicy?.familyDepositPerPerson ?? 0;
    const people = this.familyPeople;
    return `亲子套餐整包价已含注册费；报名时付订金${deposit}美元／人（${people}人共${deposit * people}美元，含在总价内），余款在出发前4周付清`;
  }

  /** Weeks of the course or room that touch an enabled summer range (family packages price their season instead). */
  get peakWeeks(): number {
    if (this.isFamily) return 0;
    const plan = this.quotePlan;
    const weeks = new Set<number>();
    for (const range of this.pricing.peakSeasonRanges.filter(item => item.enabled !== false)) {
      const from = plan.date(range.start), to = plan.date(range.end);
      if (from === null || to === null) continue;
      for (const week of plan.weekStarts([...plan.courses, ...plan.rooms])) {
        if (week <= to && week + 6 * DAY >= from) weeks.add(week);
      }
    }
    return weeks.size;
  }
  get seasonalSurcharge(): number { return round(this.peakWeeks * this.pricing.seasonalFeePerWeek); }

  /** The school offer: per course week (per family member), when the first class Monday falls in its window. */
  get schoolDiscount(): number {
    const rule = enabledRule(this.pricing, 'lamer-course-start');
    const plan = this.quotePlan;
    const monday = addDays(plan.courses[0]?.startDate ?? '', 1);
    const weeks = plan.courseWeeks;
    if (!rule || !monday || (rule.arrivalStart && monday < rule.arrivalStart) || (rule.arrivalEnd && monday > rule.arrivalEnd)
      || weeks < (rule.minimumCourseWeeks || 0)) return 0;
    const people = this.isFamily ? this.familyPeople : 1;
    return round(Math.min(this.tuition + this.accommodation, people * weeks * rule.discountValue));
  }

  /** 思达启航 rate on the course and room (or the whole package) after the school offer. */
  get sidaDiscount(): number {
    const rule = enabledRule(this.pricing, 'lamer-after-school');
    if (!rule) return 0;
    return round((this.tuition + this.accommodation - this.schoolDiscount) * rule.discountValue / 100);
  }

  get promotionDiscountTotal(): number { return round(this.schoolDiscount + this.sidaDiscount); }
  get discountNames(): string {
    return [
      this.schoolDiscount ? enabledRule(this.pricing, 'lamer-course-start')?.name : '',
      this.sidaDiscount ? enabledRule(this.pricing, 'lamer-after-school')?.name : '',
    ].filter(Boolean).join('、');
  }

  get quoteUsd(): number {
    return round(this.tuition + this.accommodation - this.promotionDiscountTotal + this.registration + this.seasonalSurcharge);
  }

  get paymentLines(): SchoolPaymentLine[] {
    const school = enabledRule(this.pricing, 'lamer-course-start');
    const sida = enabledRule(this.pricing, 'lamer-after-school');
    const plan = this.quotePlan;
    const people = this.isFamily ? this.familyPeople : 1;
    const ranges = this.pricing.peakSeasonRanges.filter(range =>
      range.enabled !== false && plan.overlapWeeks(range.start, range.end, [...plan.courses, ...plan.rooms]) > 0);
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge,
        note: `每周${this.pricing.seasonalFeePerWeek}美元 × ${this.peakWeeks}周；${ranges.map(range => `${range.label} ${slash(range.start)}–${slash(range.end)}`).join('；')}；课程与住宿同一周只算一次，不参与折扣`,
      }] : []),
      ...(school && this.schoolDiscount ? [{
        icon: '惠', label: school.name, value: -this.schoolDiscount,
        note: `${slash(addDays(plan.courses[0].startDate, 1))}开课，每${people > 1 ? '位成员' : '人'}每周${school.discountValue}美元${people > 1 ? ` × ${people}人` : ''} × ${plan.courseWeeks}周`,
        promotionKey: school.id,
      }] : []),
      ...(sida && this.sidaDiscount ? [{
        icon: '惠', label: sida.name, value: -this.sidaDiscount,
        note: this.isFamily ? `亲子套餐整包价在学校优惠后再打${(100 - sida.discountValue) / 10}折` : `课程和住宿在学校优惠后再打${(100 - sida.discountValue) / 10}折；注册费和旺季附加费不打折`,
        promotionKey: sida.id,
      }] : []),
    ];
  }

  /** 2027 summer dates of the ordinary courses are not published yet, so that surcharge is not in the total. */
  get extraPaymentNote(): string {
    if (this.isFamily) return '';
    const plan = this.quotePlan;
    const known = this.pricing.peakSeasonRanges.some(range => range.enabled !== false && range.start.startsWith('2027-'));
    return !known && plan.overlapWeeks('2027-06-27', '2027-08-28', [...plan.courses, ...plan.rooms]) > 0
      ? '2027年暑期普通课程是否加收旺季附加费，学校尚未公布，本报价未计入，以学校通知为准。' : '';
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return VISA_OPTIONS.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁的学生平日不能外出，周末须由监护人陪同（门禁21:00）；孩子随家长来读，请在课程里选亲子套餐。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get visaDays(): '30' | '59' { return this.visaType === 'tourist59' ? '59' : '30'; }

  /** First tourist-visa extension needed: after 4 weeks on a 30-day visa, after 8 weeks on a 59-day visa. */
  private extensionNeeded(weeks: number): boolean { return weeks > (this.visaDays === '30' ? 4 : 8); }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const stayWeeks = plan.stayWeeks;
    const roomWeeks = plan.roomWeeks;
    const family = this.isFamily;
    const people = family ? this.familyPeople : 1;
    const included = new Set(family ? this.pricing.laMerPolicy?.familyIncludedFeeIds ?? [] : []);
    const fees: SchoolLocalFee[] = [];
    const rules = this.pricing.localFeeRules
      .filter(rule => rule.enabled && rule.includeInTotal && rule.billingRule !== 'optional' && !included.has(rule.id))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    for (const rule of rules) {
      if ((rule.id === 'visa-30' && this.visaDays !== '30') || (rule.id === 'visa-59' && this.visaDays !== '59')) continue;
      const fee = this.localFee(rule, stayWeeks, roomWeeks);
      if (people > 1) {
        fees.push({ ...fee, unitLabel: `${fee.unitLabel} × ${people}人`, quantity: fee.quantity * people, total: round(fee.total * people), note: `${fee.note.replace(/[。；\s]+$/, '')}；每位成员各付` });
      } else {
        fees.push(fee);
      }
    }
    return fees;
  }

  private localFee(rule: CiaLocalFeeRule, stayWeeks: number, roomWeeks: number): SchoolLocalFee {
    const amount = rule.amount;
    if (rule.billingRule === 'visa-extension-schedule') {
      const index = Math.ceil(stayWeeks / 4) - (this.visaDays === '30' ? 2 : 3);
      const total = index < 0 ? 0 : rule.rates?.[index] ?? Number.NaN;
      return {
        item: rule.name, unitLabel: `${this.visaDays}天旅游签证 · 停留${stayWeeks}周累计`,
        quantity: index < 0 ? 0 : index + 1, total, note: rule.note,
      };
    }
    if (rule.billingRule === 'first-visa-extension') {
      // ACR I-CARD: once the stay passes 59 days (from week 9), whatever the entry visa.
      const charged = stayWeeks >= 9;
      return { item: rule.name, unitLabel: `${amount.toLocaleString('en-US')}比索／人`, quantity: charged ? 1 : 0, total: charged ? amount : 0, note: rule.note };
    }
    if (rule.billingRule === 'long-term-or-first-extension') {
      const charged = this.extensionNeeded(stayWeeks);
      return { item: rule.name, unitLabel: `${amount.toLocaleString('en-US')}比索／人`, quantity: charged ? 1 : 0, total: charged ? amount : 0, note: rule.note };
    }
    if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') {
      const weeks = rule.billingRule === 'per-accommodation-period' ? roomWeeks : this.quotePlan.courseWeeks;
      const period = rule.periodWeeks || 1;
      const quantity = rule.rounding === 'ceil' ? Math.ceil(weeks / period) : weeks / period;
      return {
        item: rule.name, unitLabel: `${amount.toLocaleString('en-US')}比索／${period === 1 ? '周' : `${period}周`}`,
        quantity, total: round(amount * quantity), note: rule.note,
      };
    }
    return { item: rule.name, unitLabel: `${amount.toLocaleString('en-US')}比索／人`, quantity: 1, total: amount, note: rule.note };
  }

  /** Refundable room deposit by stay length (1–3 / 4–8 / 9+ weeks), per person; a family pays it for each member. */
  get roomDeposit(): number {
    const rule = this.pricing.localFeeRules.find(item => item.id === 'deposit' && item.enabled);
    if (!rule) return 0;
    const weeks = this.quotePlan.stayWeeks;
    const amount = rule.rates?.[weeks < 4 ? 0 : weeks <= 8 ? 1 : 2] ?? rule.amount;
    return amount * (this.isFamily ? this.familyPeople : 1);
  }
}

/** Textbooks, the refundable deposit and pickup: references outside the local-fee total. */
function laMerOptionalFees(pricing: LaMerQuotePricing, students: readonly LaMerPageStudent[], quote: PhSchoolQuote<LaMerPageStudent>): PhOptionalFeeItem[] {
  const cny = (php: number) => quoteCurrencyText(Math.round(php / pricing.phpPerCny), 'zh-CN');
  const rule = (id: string) => pricing.localFeeRules.find(item => item.id === id && item.enabled);
  const allFamily = students.every(student => student.isFamily);
  const items: PhOptionalFeeItem[] = [];
  const books = rule('books');
  if (books && !allFamily) {
    items.push({ label: books.name, amount: '按书单实购', cnyAmount: '', note: books.note });
  }
  const deposit = rule('deposit');
  if (deposit) {
    const total = students.reduce((sum, student) => sum + student.roomDeposit, 0);
    items.push({
      label: deposit.name,
      amount: quote.formatPhp(total),
      cnyAmount: `约人民币 ${cny(total)} 元`,
      note: `${deposit.note}${students.length > 1 || students.some(student => student.isFamily) ? '（合计）' : ''}`,
    });
  }
  const pickup = rule('pickup');
  if (pickup && !allFamily) {
    items.push({ label: pickup.name, amount: quote.formatPhp(pickup.amount), cnyAmount: `约人民币 ${cny(pickup.amount)} 元`, note: pickup.note });
  }
  return items;
}

export class LaMerQuote extends PhSchoolQuote<LaMerPageStudent> {
  constructor(pricing: LaMerQuotePricing) {
    super(pricing, {
      createStudent: () => new LaMerPageStudent(pricing),
      headingPrefix: 'EV La Mer',
      image: { schoolCode: 'EV La Mer', schoolName: '菲律宾宿务EV Academy La Mer校区', filePrefix: 'EV-La-Mer', heroSrc: LA_MER_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => laMerPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => laMerOptionalFees(pricing, students, quote),
      layoutVersion: 2,
    });
  }
}

export class LaMerPlanComparison extends PhPlanComparison<LaMerPageStudent> {
  constructor(pricing: LaMerQuotePricing, conditions: () => LaMerPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new LaMerPageStudent(pricing, false),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'EV La Mer 方案对比报价',
      courseGroups: LA_MER_COMPARE_COURSE_GROUPS,
      peakRate: () => pricing.seasonalFeePerWeek,
      layoutVersion: 2,
    });
  }

  /** A family package is not compared; plan A then starts from the default course and room. */
  override start(focus?: PhCompareFocus): void {
    super.start(focus);
    const first = this.plans[0];
    if (first && (isLaMerFamilyCourse(first.quotePlan.courses[0]?.optionId ?? '') || first.quotePlan.rooms[0]?.optionId === LA_MER_FAMILY_ROOM_ID)) {
      first.quotePlan.courses[0].optionId = DEFAULT_COURSE;
      first.quotePlan.rooms[0].optionId = DEFAULT_ROOM;
      this.applyFocus(this.focus);
    }
  }
}

/**
 * The staff quote-image editor's preview: one student, four weeks from the next Sunday, as an ordinary course or as the
 * first family package, priced from the edited content document with the editor's exchange rates.
 */
export function buildLaMerPreviewQuote(
  content: CiaContentConfig, mode: 'ordinary' | 'family', rates: { usdToCny: number; phpPerCny: number; exchangeRateDate: string },
) {
  const policy = content.quoteSettings.laMer;
  const pricing: LaMerQuotePricing = {
    ...createCiaQuotePricing(content),
    laMerPolicy: policy ?? { familyDepositPerPerson: 0, minimumChildAge: 7, familyComposition: 'any-guardian-child', familyExtras: 'separate', familyIncludedFeeIds: [], familyVersions: [] },
    usdToCny: rates.usdToCny,
    phpPerCny: rates.phpPerCny,
    exchangeRateDate: rates.exchangeRateDate,
    usingLiveExchangeRates: Number.isFinite(rates.usdToCny),
  };
  const quote = new LaMerQuote(pricing);
  const student = quote.students[0];
  const family = mode === 'family' ? familyOptions(policy)[0] : undefined;
  if (family) {
    student.quotePlan.courses[0].optionId = family.id;
    student.planOptionChanged();
  }
  return quote.quoteImageData;
}
