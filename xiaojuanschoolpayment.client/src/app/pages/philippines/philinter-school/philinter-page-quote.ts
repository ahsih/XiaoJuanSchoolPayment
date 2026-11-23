// Philinter on the shared Philippine school quote and plan comparison. Philinter's own prices, offers and local
// fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up
// and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program can
// bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import {
  associationPeakBreakdownText,
  associationPeakRateForWeek,
  calculateAssociationPeakSurcharge,
  type AssociationPeakCalculation,
} from '../association-peak-surcharge';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { textbookRuleQuantity } from '../school-textbook-estimate';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote, PH_REGISTRATION_NOTE } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  PHILINTER_2027_ONLY_COURSE_IDS,
  PHILINTER_AZON_ROOM_IDS,
  PHILINTER_FIXED_WEEKS,
  PHILINTER_JUNIOR_COURSE_IDS,
  PHILINTER_LOW_SEASON_RULE_ID,
  PHILINTER_NEW_COURSE_START,
  PHILINTER_RETURNING_RULE_ID,
  PHILINTER_SIDA_RULE_ID,
} from './philinter-content-config';
import { PHILINTER_QUOTE_IMAGE_HERO } from './philinter-page-content';

const DAY = 86400000;
/** Azon water for a stay of 1, 2 or 3 weeks (2026-10-19 sheet); from 4 weeks it is the weekly rate. */
const AZON_SHORT_WATER = [450, 650, 850];

/** Everything Philinter's quote reads; the page component is one. */
export interface PhilinterQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** Four-week room prices for stays whose first arrival is on or after priceSwitchArrival. */
  roomFees2027: Record<string, number>;
  registrationFee2027: number;
  /** Empty while the school has not said when its 2027 list takes effect: every stay pays the 2026 prices. */
  priceSwitchArrival: string;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const PHILINTER_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL／口语', courseIds: ['intensive-esl', 'general-esl', 'light-esl', 'intensive-power-speaking'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-intensive', 'ielts-guarantee-12-weeks'] },
  { id: 'toeic', label: '托业', courseIds: ['toeic-regular', 'toeic-guarantee-12-weeks'] },
  { id: 'business', label: '商务英语', courseIds: ['basic-business', 'advanced-business'] },
] as const;

/** Price ratio of a 1–3 week row (45/65/85%); four weeks and longer are proportional. */
export const philinterPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const slashDate = (value: string): string => value.replace(/-/g, '/');

/**
 * The 2026 low-season offer: 300 dollars for every 8 consecutive study weeks inside the offer's dates that are also
 * covered by an eligible room (campus triple, Azon single or twin). Guarantee courses do not count. The published
 * end date is the last Friday of class; the Saturday checkout belongs to that week.
 */
export function philinterLowSeasonDiscount(plan: SchoolQuotePlan, rule: CiaPromotionRule): number {
  if (!rule.enabled || !rule.coverageStart || !rule.coverageEnd) return 0;
  const eligibleRooms = plan.days(plan.rooms.filter(row => (rule.eligibleRoomIds ?? []).includes(row.optionId)));
  const weeks = plan.weekStarts(plan.courses.filter(row => !row.optionId.includes('guarantee')));
  const from = plan.date(rule.coverageStart)!;
  const to = plan.date(rule.coverageEnd)!;
  const blockWeeks = Math.max(1, rule.minimumCourseWeeks || 8);
  let last = 0;
  let run = 0;
  let blocks = 0;
  for (const start of weeks) {
    const eligible = start >= from && start + 5 * DAY <= to
      && Array.from({ length: 7 }, (_, index) => start + index * DAY).every(date => eligibleRooms.has(date));
    if (!eligible) { run = 0; last = 0; continue; }
    run = start === last + 7 * DAY ? run + 1 : 1;
    if (run % blockWeeks === 0) blocks++;
    last = start;
  }
  return blocks * rule.discountValue;
}

/** One Philinter student: plan, conditions and every amount the template and quote image show. */
export class PhilinterPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;

  constructor(private readonly pricing: PhilinterQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'general-esl', 'in-campus-triple', nextQuoteSunday(), Array.from({ length: 24 }, (_, index) => index + 1),
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : this.roomFee(row.optionId);
        return (base ?? 0) * philinterPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
  }

  /** First arrival of the stay; the 2027 price list applies to the whole stay from its switch date. */
  private get firstArrival(): string {
    const plan = this.quotePlan;
    if (!plan) return '';
    return [...plan.courses, ...plan.rooms].map(row => row.startDate).sort()[0] ?? plan.startDate;
  }

  get uses2027Prices(): boolean {
    const start = this.pricing.priceSwitchArrival;
    return !!start && this.firstArrival >= start;
  }

  private roomFee(id: string): number {
    const fee = this.pricing.roomFees.find(item => item.id === id)?.fee ?? 0;
    return this.uses2027Prices ? this.pricing.roomFees2027[id] ?? fee : fee;
  }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  private courseWeeks(id: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
  }

  minimumWeeks(courseId: string): number {
    const fixed = PHILINTER_FIXED_WEEKS[courseId];
    return fixed ? Math.min(...fixed) : this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  /** Fixed-length courses, minimum lengths, 2027-only courses, and the age rules. */
  get courseLengthError(): string {
    const plan = this.quotePlan;
    for (const id of new Set(plan.courses.map(row => row.optionId))) {
      const weeks = this.courseWeeks(id);
      const fixed = PHILINTER_FIXED_WEEKS[id];
      if (fixed && !fixed.includes(weeks)) {
        const length = fixed.length > 1 ? `${fixed[0]}–${fixed[fixed.length - 1]}` : `${fixed[0]}`;
        return `${this.courseName(id)}固定报名${length}周，请把这门课的周数改为${length}周。`;
      }
      const minimum = this.pricing.courseFees.find(item => item.id === id)?.minimumWeeks ?? 0;
      if (minimum && weeks < minimum) return `${this.courseName(id)}须至少报名${minimum}周。`;
      if (PHILINTER_2027_ONLY_COURSE_IDS.includes(id) && this.firstArrival < PHILINTER_NEW_COURSE_START) {
        return `${this.courseName(id)}是2027年新课程，须2027年1月3日或以后入学。`;
      }
    }
    const junior = plan.courses.filter(row => PHILINTER_JUNIOR_COURSE_IDS.includes(row.optionId));
    if (this.selectedAgeGroup === 'minor') {
      if (junior.length !== plan.courses.length) return '未满18岁只能报青少年课程（Junior ESL、Junior IELTS或青少年精品口语）。';
      if (plan.rooms.some(row => row.optionId.includes('single'))) return '未满18岁须与监护人同住双人间或三人间，不能住单人间。';
    } else if (junior.length) {
      return '青少年课程只收18岁以下学生，成人请选其他课程；陪读家长只能报轻松ESL。';
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  // ---- peak season -------------------------------------------------------------------------------

  get peakCalculation(): AssociationPeakCalculation {
    const plan = this.quotePlan;
    return calculateAssociationPeakSurcharge(
      'PHILINTER',
      plan.weekStarts([...plan.courses, ...plan.rooms]),
      this.pricing.peakSeasonRanges.filter(range => range.enabled !== false),
      this.pricing.seasonalFeePerWeek,
    );
  }

  /** Summer stays need 8 dormitory or 4 Azon weeks; shorter ones only when the school agrees, so this is a note, not a block. */
  get summerMinimumNote(): string {
    if (!this.seasonalSurcharge) return '';
    const azon = this.azonWeeks;
    const dorm = this.quotePlan.roomWeeks - azon;
    const short = (dorm > 0 && dorm < 8) || (azon > 0 && azon < 4);
    return short ? '；暑期校内宿舍须至少报8周、Azon公寓至少4周，更短须学校确认' : '';
  }

  get peakWeeks(): number { return this.peakCalculation.weeks; }
  get seasonalSurcharge(): number { return this.peakCalculation.total; }

  // ---- offers ------------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** 思达启航 10% on the full course and room price, before the school's offer. */
  get sidaDiscount(): number {
    const rule = this.enabledRule(PHILINTER_SIDA_RULE_ID);
    if (!rule || rule.discountType !== 'percentage') return 0;
    return Math.round((this.tuition + this.accommodation) * rule.discountValue) / 100;
  }

  get lowSeasonDiscount(): number {
    const rule = this.enabledRule(PHILINTER_LOW_SEASON_RULE_ID);
    if (!rule || (rule.newStudentsOnly && this.returningStudent)) return 0;
    return philinterLowSeasonDiscount(this.quotePlan, rule);
  }

  get promotionDiscountTotal(): number {
    return Math.round((this.sidaDiscount + this.lowSeasonDiscount) * 100) / 100;
  }

  get discountNames(): string {
    return [
      this.sidaDiscount ? this.enabledRule(PHILINTER_SIDA_RULE_ID)?.name : '',
      this.lowSeasonDiscount ? this.enabledRule(PHILINTER_LOW_SEASON_RULE_ID)?.name : '',
    ].filter(Boolean).join('、');
  }

  // ---- school payment ----------------------------------------------------------------------------

  get registrationFee(): number {
    return this.uses2027Prices ? this.pricing.registrationFee2027 : this.pricing.registrationFee;
  }

  get registration(): number {
    return this.returningStudent && !!this.enabledRule(PHILINTER_RETURNING_RULE_ID) ? 0 : this.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal;
    return Math.max(0, Math.round(total * 100) / 100);
  }

  get paymentLines(): SchoolPaymentLine[] {
    const plan = this.quotePlan;
    const ranges = this.pricing.peakSeasonRanges.filter(range =>
      range.enabled !== false && plan.overlapWeeks(range.start, range.end, [...plan.courses, ...plan.rooms]) > 0);
    const sida = this.enabledRule(PHILINTER_SIDA_RULE_ID);
    const lowSeason = this.enabledRule(PHILINTER_LOW_SEASON_RULE_ID);
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺',
        label: '旺季附加费',
        value: this.seasonalSurcharge,
        note: `${associationPeakBreakdownText(this.peakCalculation)}；${ranges
          .map(range => `${range.label} ${slashDate(range.start)}–${slashDate(range.end)}`)
          .join('；')}；课程和住宿重叠的周只算一次，不参与折扣${this.summerMinimumNote}`,
      }] : []),
      ...(sida && this.sidaDiscount ? [{ icon: '折', label: sida.name, value: -this.sidaDiscount, note: sida.description, promotionKey: sida.id }] : []),
      ...(lowSeason && this.lowSeasonDiscount ? [{
        icon: '惠',
        label: lowSeason.name,
        value: -this.lowSeasonDiscount,
        note: `${lowSeason.description}本次${this.lowSeasonDiscount / lowSeason.discountValue}个8周`,
        promotionKey: lowSeason.id,
      }] : []),
    ];
  }

  // ---- conditions --------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁只能报青少年课程（Junior ESL收7–17岁，Junior IELTS和青少年精品口语收12–17岁），须与一位成年监护人同住双人间或三人间，监护人只能报轻松ESL，可用多人报价一起算；外出须有成人陪同。';
  }

  // ---- local fees --------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** Extensions by stay length: from week 5 on a 30-day entry, from week 9 on a 59-day entry, then every 4 weeks. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const freeWeeks = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - freeWeeks) / 4));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private get azonWeeks(): number {
    return this.quotePlan.rooms.filter(row => PHILINTER_AZON_ROOM_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  /** Refundable room deposit by stay length (2026-10-19 sheet). */
  get roomDeposit(): number {
    const rule = this.rule('deposit');
    if (!rule) return 0;
    const weeks = this.quotePlan.stayWeeks;
    return weeks <= 2 ? rule.amount : weeks <= 7 ? 3000 : weeks <= 11 ? 4000 : 5000;
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.billingRule === 'per-accommodation-period' ? `${formatPhp(rule.amount)}／周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.rule('visa-extension');
    const sequence = visaRule?.rates?.length ? visaRule.rates : [visaRule?.amount ?? 0];
    const visaTotal = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence[sequence.length - 1])
      .reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const roomWeeks = plan.roomWeeks;
    const azonWeeks = this.azonWeeks;
    const dormWeeks = roomWeeks - azonWeeks;
    const water = this.rule('water');
    const waterTotal = water
      ? dormWeeks * water.amount + (azonWeeks > 0 && azonWeeks < 4 ? AZON_SHORT_WATER[azonWeeks - 1] : azonWeeks * water.amount)
      : 0;
    const electricity = this.rule('electricity');
    const electricityTotal = electricity ? roomWeeks * electricity.amount + (azonWeeks ? electricity.secondaryAmount ?? 0 : 0) : 0;
    const books = this.rule('books');
    const bookSets = textbookRuleQuantity(plan.courses, books, 4);
    return [
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-i-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('arp', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('visa-extension', extensions, visaNote, visaTotal, visaRule ? `${formatPhp(sequence[0])}起／次` : undefined),
      ...create('management', roomWeeks),
      ...create('water', roomWeeks, undefined, waterTotal),
      ...create('electricity', roomWeeks, undefined, electricityTotal),
      ...create('books', bookSets, undefined, undefined, books ? `${formatPhp(books.amount)}／4周` : undefined),
      ...create('student-id', 1),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

/** Pickup and the tiered room deposit, outside the local-fee total. */
function philinterOptionalFeeItems(
  pricing: PhilinterQuotePricing, students: readonly PhilinterPageStudent[], quote: PhSchoolQuote<PhilinterPageStudent>,
): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.id === 'deposit') {
        const total = students.reduce((sum, student) => sum + student.roomDeposit, 0);
        return { label: rule.name, amount: quote.formatPhp(total), cnyAmount: cny(total), note: `${rule.note}${count > 1 ? `（${count}人合计）` : ''}` };
      }
      const perPerson = count > 1 ? '／人' : '';
      if (rule.secondaryAmount) {
        return {
          label: rule.name,
          amount: `${quote.formatPhp(rule.amount)}／${rule.secondaryLabel || '另一时段'}${quote.formatPhp(rule.secondaryAmount)}`,
          cnyAmount: `${cny(rule.amount)}／${quoteCurrencyText(Math.round(rule.secondaryAmount / pricing.phpPerCny), 'zh-CN')} 元`,
          note: rule.note,
        };
      }
      return { label: rule.name, amount: `${quote.formatPhp(rule.amount)}${perPerson}`, cnyAmount: `${cny(rule.amount)}${perPerson}`, note: rule.note };
    });
}

export class PhilinterQuote extends PhSchoolQuote<PhilinterPageStudent> {
  constructor(pricing: PhilinterQuotePricing) {
    super(pricing, {
      createStudent: () => new PhilinterPageStudent(pricing),
      headingPrefix: 'Philinter',
      image: { schoolCode: 'Philinter', schoolName: '菲律宾宿务Philinter语言学校', filePrefix: 'Philinter', heroSrc: PHILINTER_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => philinterPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => philinterOptionalFeeItems(pricing, students, quote),
      layoutVersion: 2,
    });
  }

  /** A group may mix 2026 (120 dollars) and 2027 (150 dollars) registration fees, so the note lists the amounts. */
  override get registrationNote(): string {
    if (this.quoteMode === 'single') return super.registrationNote;
    const paid = this.activeStudents.filter(student => student.registration > 0);
    const amounts = [...new Set(paid.map(student => student.registration))]
      .map(amount => `${paid.filter(student => student.registration === amount).length}人 × ${this.formatUsd(amount)}美元`);
    return `${PH_REGISTRATION_NOTE}；本次计收${amounts.join('、') || '0人'}${paid.length < this.activeStudents.length ? '，其余已免' : ''}`;
  }
}

export class PhilinterPlanComparison extends PhPlanComparison<PhilinterPageStudent> {
  constructor(pricing: PhilinterQuotePricing, conditions: () => PhilinterPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new PhilinterPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
      },
      heading: 'Philinter 方案对比报价',
      courseGroups: PHILINTER_COMPARE_COURSE_GROUPS,
      peakRate: () => associationPeakRateForWeek('PHILINTER', '2027-01-03', pricing.seasonalFeePerWeek),
      layoutVersion: 2,
    });
  }
}
