// PINES on the shared Philippine school quote and plan comparison. Prices follow the registration date
// (2026 prices and offers before 2027-02-01, 2027 ones from then on) and local fees the arrival date (2027 fees
// from 2027-02-01), as the school's 2026-11 notice says. The template's PhSchoolQuote and PhPlanComparison only
// add students up and lay out the result. Keep this file free of Angular, DOM and storage access.
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import {
  associationPeakBreakdownText,
  associationPeakRateForWeek,
  calculateAssociationPeakSurcharge,
} from '../association-peak-surcharge';
import type { CiaCourseContent, CiaLocalFeeRule, CiaPromotionRule, CiaRoomContent } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  createDefaultPinesContentConfig,
  PINES_2027_LOCAL_FEE_ARRIVAL_START,
  PINES_2027_PRICE_REGISTRATION_START,
  PINES_FIXED_WEEK_COURSES,
  PINES_GLOBAL_YOUTH_COURSE_ID,
  PINES_GLOBAL_YOUTH_ROOM_ID,
  PINES_JUNIOR_COURSE_ID,
  PINES_MATERIAL_TIERS,
} from './pines-content-config';

export const PINES_QUOTE_IMAGE_HERO = '/assets/pines/campus/exterior.webp';
/** Refundable room deposit for students arriving from 2027-02-01 (the 2027 list's “Hotel Deposit”). */
export const PINES_2027_ROOM_DEPOSIT_USD = 100;
const SIDA_RULE_ID = 'pines-sida-discount';
const OFF_SEASON_2026_RULE_ID = 'pines-off-season';
const DAY = 86400000;
const DEFAULT_CONTENT = createDefaultPinesContentConfig();

export const PINES_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

/** Everything PINES's quote reads; the page component is one. */
export interface PinesQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** The applied content document's catalogue, with the 2027 prices the shared mapping leaves out. */
  pinesCourses?: readonly CiaCourseContent[];
  pinesRooms?: readonly CiaRoomContent[];
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const PINES_COMPARE_COURSE_GROUPS = [
  { id: 'speaking', label: '口语与综合英语', courseIds: ['power-speaking', 'intensive-esl', 'light-esl-4', 'power-esl-5', 'power-esl-7'] },
  { id: 'ielts', label: '雅思', courseIds: ['pre-ielts', 'ielts-regular', 'ielts-intensive'] },
  { id: 'business', label: '商务与托业', courseIds: ['business-english-practical', 'business-english-executive', 'toeic-toeic-speaking'] },
] as const;

/** Price ratio of a 2–3 week row; four weeks and longer are proportional. */
export const pinesPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const rounded = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;
const slashDate = (value: string): string => value.replace(/-/g, '/');

/** One PINES student: plan, conditions and every amount the template and quote image show. */
export class PinesPageStudent implements PhPageStudent {
  readonly visaOptions = PINES_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** Tuition, rooms and offers follow the registration date (2027 prices from 2027-02-01). */
  selectedRegistrationDate = localToday();

  constructor(private readonly pricing: PinesQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'power-speaking', 'quad', nextQuoteSunday(), [2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
    );
  }

  // ---- prices -----------------------------------------------------------------------------------

  /** Registrations from 2027-02-01 pay the 2027 price list. */
  get uses2027Prices(): boolean { return this.selectedRegistrationDate >= PINES_2027_PRICE_REGISTRATION_START; }

  /** First Sunday of the stay; local fees switch to the 2027 list for arrivals from 2027-02-01. */
  get arrivalDate(): string {
    return [...this.quotePlan.courses, ...this.quotePlan.rooms].map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }
  get uses2027LocalFees(): boolean { return this.arrivalDate >= PINES_2027_LOCAL_FEE_ARRIVAL_START; }

  private courseContent(id: string): CiaCourseContent | undefined {
    return (this.pricing.pinesCourses ?? DEFAULT_CONTENT.courses).find(item => item.id === id);
  }

  private roomContent(id: string): CiaRoomContent | undefined {
    return (this.pricing.pinesRooms ?? DEFAULT_CONTENT.rooms).find(item => item.id === id);
  }

  /** Four-week course price for this registration date; a fixed-length course spreads its package price. 0 = not offered. */
  courseRate(id: string): number {
    const course = this.courseContent(id);
    if (!course) return this.pricing.courseFees.find(item => item.id === id)?.tuition ?? 0;
    const fixedWeeks = PINES_FIXED_WEEK_COURSES[id];
    const packagePrice = fixedWeeks ? (this.uses2027Prices ? course.feeByWeeks2027 : course.feeByWeeks)?.[String(fixedWeeks)] : undefined;
    if (fixedWeeks && packagePrice) return packagePrice * 4 / fixedWeeks;
    return this.uses2027Prices ? course.tuition2027 : course.tuition;
  }

  roomRate(id: string): number {
    const room = this.roomContent(id);
    if (!room) return this.pricing.roomFees.find(item => item.id === id)?.fee ?? 0;
    return this.uses2027Prices ? room.fee2027 ?? room.fee : room.fee;
  }

  private rowPrice(kind: 'course' | 'room', row: QuotePlanRow): number {
    const rate = kind === 'course' ? this.courseRate(row.optionId) : this.roomRate(row.optionId);
    return rate * pinesPriceMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
  }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return PINES_FIXED_WEEK_COURSES[courseId] ?? this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  /** Guarantee courses run a fixed number of weeks; the youth camp needs at least four. */
  get courseLengthError(): string {
    for (const id of new Set(this.quotePlan.courses.map(row => row.optionId))) {
      const weeks = this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
      const fixed = PINES_FIXED_WEEK_COURSES[id];
      if (fixed && weeks !== fixed) return `${this.courseName(id)}固定${fixed}周，请把这门课程改为${fixed}周（之后可再接其他课程）。`;
      const minimum = this.minimumWeeks(id);
      if (!fixed && minimum && weeks < minimum) return `${this.courseName(id)}须至少读${minimum}周，请把课程周数改为${minimum}周或以上。`;
    }
    return '';
  }

  /** A course without a price for this registration date (TOEIC Guarantee opens with the 2027 list). */
  private get notOfferedError(): string {
    const missing = this.quotePlan.courses.find(row => this.courseRate(row.optionId) <= 0);
    if (missing) {
      return this.uses2027Prices
        ? `${this.courseName(missing.optionId)}暂无价格，请联系顾问。`
        : `${this.courseName(missing.optionId)}从2027年2月1日起报名才开设，请把报名注册日改为2027年2月1日或以后，或改选其他课程。`;
    }
    return this.quotePlan.rooms.some(row => this.roomRate(row.optionId) <= 0) ? '所选房型暂无价格，请联系顾问。' : '';
  }

  /** Since 2026-08-23 students under 18 may take only the youth IELTS camp or, with a parent, the junior family course. */
  private get ageError(): string {
    const youthCourses = [PINES_GLOBAL_YOUTH_COURSE_ID, PINES_JUNIOR_COURSE_ID];
    const courses = this.quotePlan.courses.map(row => row.optionId);
    if (this.selectedAgeGroup === 'minor') {
      return courses.every(id => youthCourses.includes(id))
        ? ''
        : '18岁以下不可报成人课程：13–17岁请选青少年雅思营，7–15岁由家长陪同可选亲子青少年课程。';
    }
    return courses.some(id => youthCourses.includes(id))
      ? '青少年雅思营和亲子青少年课程只收18岁以下学生，请把年龄改为“未满18岁”，或改选其他课程。'
      : '';
  }

  /** The youth camp and its dormitory go together. */
  private get youthRoomError(): string {
    const youthCourse = this.quotePlan.courses.some(row => row.optionId === PINES_GLOBAL_YOUTH_COURSE_ID);
    const youthRoom = this.quotePlan.rooms.some(row => row.optionId === PINES_GLOBAL_YOUTH_ROOM_ID);
    const otherRoom = this.quotePlan.rooms.some(row => row.optionId !== PINES_GLOBAL_YOUTH_ROOM_ID);
    const otherCourse = this.quotePlan.courses.some(row => row.optionId !== PINES_GLOBAL_YOUTH_COURSE_ID);
    if (youthCourse && otherRoom) return '青少年雅思营的学生须住青少年宿舍，请把住宿改为青少年宿舍。';
    if (youthRoom && otherCourse) return '青少年宿舍只给青少年雅思营的学生，请改选其他房型。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    return this.quotePlan.error || this.courseLengthError || this.notOfferedError || this.ageError
      || this.youthRoomError;
  }

  // ---- surcharge and promotions -----------------------------------------------------------------

  private get enabledPeakRanges() { return this.pricing.peakSeasonRanges.filter(range => range.enabled); }

  get peakCalculation() {
    return calculateAssociationPeakSurcharge(
      'PINES',
      this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]),
      this.enabledPeakRanges,
      this.pricing.seasonalFeePerWeek,
    );
  }
  get peakWeeks(): number { return this.peakCalculation.weeks; }
  get seasonalSurcharge(): number { return this.peakCalculation.total; }

  /** Course weeks outside the summer peak season, which the regular offers count. */
  get offPeakCourseWeeks(): number {
    const ranges = this.enabledPeakRanges.map(range => ({ start: Date.parse(`${range.start}T00:00:00Z`), end: Date.parse(`${range.end}T00:00:00Z`) }));
    return this.quotePlan.weekStarts(this.quotePlan.courses)
      .filter(week => !ranges.some(range => week <= range.end && week + 6 * DAY >= range.start)).length;
  }

  private get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }

  private eligible(rule: CiaPromotionRule): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    if (this.quotePlan.courseWeeks < rule.minimumCourseWeeks || this.quotePlan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    const registration = this.selectedRegistrationDate;
    if (rule.registrationStart && registration < rule.registrationStart) return false;
    if (rule.registrationEnd && registration > rule.registrationEnd) return false;
    if (rule.arrivalStart && this.courseStart < rule.arrivalStart) return false;
    if (rule.arrivalEnd && this.courseStart > rule.arrivalEnd) return false;
    return true;
  }

  /** Cash amount of one school offer (the percentage Sida rate is worked on the full price, before them). */
  private fixedAmount(rule: CiaPromotionRule): number {
    if (rule.discountType === 'none' || rule.discountType === 'percentage' || !this.eligible(rule)) return 0;
    if (rule.discountType === 'per-course-week') return this.offPeakCourseWeeks * rule.discountValue;
    if (rule.id === OFF_SEASON_2026_RULE_ID) return Math.floor(this.offPeakCourseWeeks / 4) * rule.discountValue;
    const steps = rule.incrementWeeks && rule.incrementValue
      ? Math.floor((this.quotePlan.courseWeeks - rule.minimumCourseWeeks) / rule.incrementWeeks) : 0;
    return rule.discountValue + Math.max(0, steps) * (rule.incrementValue ?? 0);
  }

  private get orderedRules(): CiaPromotionRule[] {
    return this.pricing.promotions.filter(rule => rule.enabled).slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /** The 思达启航 rate comes off the full course and room price first, then the school's cash offers (user rule
   *  2026-11-24: PINES's files give no order, so the order that is cheaper for the student). */
  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    const percentages = this.orderedRules
      .filter(rule => rule.discountType === 'percentage' && this.eligible(rule))
      .map(rule => {
        const base = rule.appliesTo === 'tuition' ? this.tuition
          : rule.appliesTo === 'accommodation' ? this.accommodation
            : this.tuition + this.accommodation;
        return { rule, amount: rounded(base * rule.discountValue / 100) };
      })
      .filter(item => item.amount > 0);
    const fixed = this.orderedRules
      .map(rule => ({ rule, amount: rounded(this.fixedAmount(rule)) }))
      .filter(item => item.amount > 0);
    return [...percentages, ...fixed];
  }

  get promotionDiscountTotal(): number {
    return rounded(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registrationWaiverName(): string | undefined {
    return this.orderedRules.find(rule => rule.waiveRegistration && this.eligible(rule))?.name;
  }

  get registration(): number {
    return this.returningStudent || this.registrationWaiverName !== undefined ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal;
    return Math.max(0, rounded(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const peakRanges = this.enabledPeakRanges.filter(range =>
      this.quotePlan.overlapWeeks(range.start, range.end, [...this.quotePlan.courses, ...this.quotePlan.rooms]) > 0);
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺',
        label: '暑期旺季附加费',
        value: this.seasonalSurcharge,
        note: `${associationPeakBreakdownText(this.peakCalculation)}；${peakRanges.map(range => `${slashDate(range.start)}–${slashDate(range.end)}`).join('；')}；同一周课程和住宿只算一次，不打折`,
      }] : []),
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.id === SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: rule.discountType === 'per-course-week' || rule.id === OFF_SEASON_2026_RULE_ID
          ? `${rule.description}；本次旺季以外${this.offPeakCourseWeeks}周`
          : rule.discountType === 'fixed' && rule.incrementWeeks
            ? `${rule.description}；本次课程${this.quotePlan.courseWeeks}周`
            : rule.description,
        promotionKey: rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '18岁以下不可报成人课程：13–17岁可报青少年雅思营（老师同住管理）；7–15岁由家长陪同可报亲子青少年课程，家长同时报家长课程。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** A rule's dated replacement applies when the stay starts on or after its effective date. */
  private dated(rule: CiaLocalFeeRule): { amount: number; rates?: number[]; note: string } {
    const future = !!rule.futureEffectiveStart && this.arrivalDate >= rule.futureEffectiveStart;
    return future
      ? { amount: rule.futureAmount ?? rule.amount, rates: rule.futureRates ?? rule.rates, note: rule.futureNote ?? rule.note }
      : { amount: rule.amount, rates: rule.rates, note: rule.note };
  }

  /** One extension per four weeks of stay beyond the entry visa (user rule 2026-11-24): a 30-day visa needs one at
   *  5–8 weeks and two at 9–12; a 59-day visa none up to 8 weeks and one at 9–12. */
  get visaExtensionCount(): number {
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - (this.visaType === 'tourist30' ? 4 : 8)) / 4));
  }

  /** Extension amounts in order; a 59-day entry starts one step later in the 2027 30-day sequence. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const { amount, rates } = this.dated(rule);
    const base = rates?.length ? rates : [amount];
    const sequence = this.uses2027LocalFees && this.visaType === 'tourist59' && base.length > 1 ? base.slice(1) : base;
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? amount);
  }

  get acrNeeded(): boolean {
    return this.uses2027LocalFees ? this.quotePlan.stayWeeks >= 9 : this.visaExtensionCount > 0;
  }

  /** 2027 textbooks: per started four weeks of each course, by the course's book tier. */
  private get materials(): { periods: number; total: number; rates: number[] } {
    const rule = this.rule('materials');
    if (!rule) return { periods: 0, total: 0, rates: [] };
    const { amount, rates } = this.dated(rule);
    if (amount <= 0) return { periods: 0, total: 0, rates: [] };
    const tiers = rates?.length ? rates : [amount];
    const weeksByCourse = new Map<string, number>();
    for (const row of this.quotePlan.courses) weeksByCourse.set(row.optionId, (weeksByCourse.get(row.optionId) ?? 0) + row.weeks);
    let periods = 0;
    let total = 0;
    const used = new Set<number>();
    for (const [id, weeks] of weeksByCourse) {
      const count = Math.ceil(weeks / (rule.periodWeeks ?? 4));
      const rate = tiers[PINES_MATERIAL_TIERS[id] ?? 0] ?? tiers[0];
      periods += count;
      total += count * rate;
      used.add(rate);
    }
    return { periods, total, rates: [...used].sort((a, b) => a - b) };
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const visaLabel = this.visaLabel;
    const fees: SchoolLocalFee[] = [];
    const add = (id: string, quantity: number, unitLabel?: string, total?: number, notePrefix = ''): void => {
      const rule = this.rule(id);
      if (!rule) return;
      const { amount, note } = this.dated(rule);
      if (amount <= 0 && total === undefined) return;
      const unit = unitLabel ?? (rule.periodWeeks
        ? `${formatPhp(amount)}／${rule.periodWeeks === 1 ? '周' : `${rule.periodWeeks}周`}`
        : `${formatPhp(amount)}／次`);
      fees.push({ item: rule.name, unitLabel: unit, quantity, total: rounded(total ?? amount * quantity), note: notePrefix ? `${notePrefix}；${note}` : note });
    };
    add('ssp', 1);
    add('ssp-e-card', 1);
    add('acr-i-card', this.acrNeeded ? 1 : 0, undefined, undefined, `按${visaLabel}预估`);
    const utilities = this.rule('utilities');
    add('utilities', rounded(plan.roomWeeks / (utilities?.periodWeeks ?? 4)));
    const maintenance = this.rule('maintenance');
    add('maintenance', rounded(plan.roomWeeks / (maintenance?.periodWeeks ?? 1)));
    const visaRule = this.rule('visa-extension');
    if (visaRule) {
      const amounts = this.visaExtensionAmounts(visaRule);
      const count = amounts.length;
      add('visa-extension', count, `${formatPhp(amounts[0] ?? this.dated(visaRule).amount)}起／次`,
        amounts.reduce((sum, value) => sum + value, 0),
        count ? `按${visaLabel}预估，本次${count}次` : `按${visaLabel}预估，本次无需续签`);
    }
    const books = this.materials;
    if (books.periods) {
      add('materials', books.periods, `${books.rates.map(rate => Math.round(rate).toLocaleString('en-US')).join('／')} 比索／4周`, books.total);
    }
    add('student-id', 1);
    return fees;
  }
}

/** Reference rows outside the local-fee total; the room deposit is 100 dollars for 2027 arrivals. */
function pinesOptionalFeeItems(
  pricing: PinesQuotePricing,
  students: readonly PinesPageStudent[],
  quote: PhSchoolQuote<PinesPageStudent>,
): PhOptionalFeeItem[] {
  const count = students.length;
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.id === 'room-deposit' && students.every(student => student.uses2027LocalFees)) {
        const usd = PINES_2027_ROOM_DEPOSIT_USD * count;
        return {
          label: rule.name,
          amount: `${quote.formatUsd(usd)} 美元`,
          cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(usd * pricing.usdToCny), 'zh-CN')} 元`,
          note: `无损坏、无欠费时毕业退还${count > 1 ? `（${count}人合计）` : ''}`,
        };
      }
      const total = rule.amount * (rule.multiplyByStudents ? count : 1);
      const perPerson = !rule.multiplyByStudents && count > 1;
      const unit = rule.periodWeeks ? `／${rule.periodWeeks}周` : '';
      return {
        label: rule.name,
        amount: `${quote.formatPhp(total)}${unit}${perPerson ? '／人' : ''}`,
        cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(total / pricing.phpPerCny), 'zh-CN')} 元${unit}${perPerson ? '／人' : ''}`,
        note: `${rule.note}${rule.multiplyByStudents && count > 1 ? `（${count}人合计）` : ''}`,
      };
    });
}

export class PinesQuote extends PhSchoolQuote<PinesPageStudent> {
  constructor(pricing: PinesQuotePricing) {
    super(pricing, {
      createStudent: () => new PinesPageStudent(pricing),
      headingPrefix: 'PINES',
      image: { schoolCode: 'PINES', schoolName: '菲律宾碧瑶PINES语言学校', filePrefix: 'PINES', heroSrc: PINES_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => pinesPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => pinesOptionalFeeItems(pricing, students, quote),
      layoutVersion: 2,
    });
  }
}

export class PinesPlanComparison extends PhPlanComparison<PinesPageStudent> {
  constructor(pricing: PinesQuotePricing, conditions: () => PinesPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new PinesPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: 'PINES 方案对比报价',
      courseGroups: PINES_COMPARE_COURSE_GROUPS,
      peakRate: () => associationPeakRateForWeek('PINES', '2027-06-27', pricing.seasonalFeePerWeek),
      layoutVersion: 2,
    });
  }
}
