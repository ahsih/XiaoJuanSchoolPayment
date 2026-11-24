// English Fella on the shared Philippine school quote and plan comparison, one campus per page. The school's own
// prices, offers, minor rules and local fees are calculated here per student; the template's PhSchoolQuote and
// PhPlanComparison only add students up and lay out the result. The page's course and room lists are already
// limited to its campus (fellaCampusContent). Keep this file free of Angular, DOM and storage access, so the
// WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { FELLA_CHRISTMAS_RULE_ID, FELLA_RETURNING_RULE_ID, FELLA_SIDA_RULE_ID } from './fella-content-config';
import { FELLA_PAGE_CONTENT } from './fella-page-content';
import {
  FELLA_CAMPUS_NAMES,
  FELLA_CHILD_COURSE_IDS,
  FELLA_CHRISTMAS_MAX,
  FELLA_CHRISTMAS_WEEKS,
  FELLA_FAMILY_COURSE_IDS,
  FELLA_GUARANTEE_COURSE_IDS,
  FELLA_SMALL_BOOK_COURSE_IDS,
  fellaGuardianFee,
  fellaRoomDeposit,
  type FellaCampus,
} from './fella-pricing';

const DAY = 86400000;
/** Family members' pickup (亲子课程 30% off the 1,000-peso pickup). */
const FAMILY_PICKUP = 700;

/** Everything English Fella's quote reads; the page component is one. */
export interface FellaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const FELLA_COMPARE_COURSE_GROUPS: Readonly<Record<FellaCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>>> = {
  campus1: [
    { id: 'pic', label: '综合英语', courseIds: ['pic-4', 'pic-5', 'pic-6'] },
    { id: 'ielts', label: '雅思', courseIds: ['pift-e', 'pift', 'pirc', 'pigi'] },
    { id: 'toeic', label: '托业', courseIds: ['toeic-esl', 'toeic-practice', 'toeic-guarantee'] },
    { id: 'toefl', label: '托福', courseIds: ['ppt', 'ptft'] },
  ],
  campus2: [
    { id: 'pic', label: '综合英语／商务', courseIds: ['pic-4', 'pic-5', 'pic-6', 'ebc'] },
    { id: 'ielts', label: '雅思', courseIds: ['pift-e', 'pift', 'pirc'] },
    { id: 'toeic', label: '托业', courseIds: ['toeic-esl', 'toeic-practice'] },
    { id: 'toefl', label: '托福', courseIds: ['ppt', 'ptft'] },
  ],
};

/** Price ratio of a 1–3 week row (30/60/90%); four weeks and longer are proportional. */
export const fellaPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const roundCents = (value: number): number => Math.round(value * 100) / 100;

/** One of English Fella's choices under 学生情况 (template: PhPageStudent.extraChoices). */
interface FellaExtraChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

/** One English Fella student: plan, conditions and every amount the template and quote image show. */
export class FellaPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly extraChoices: readonly PhExtraChoice[];
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** First campus: a 15–17-year-old whose parent studies at the school too pays no guardian fee. */
  withParent = false;

  constructor(private readonly pricing: FellaQuotePricing, readonly campus: FellaCampus) {
    this.quotePlan = new SchoolQuotePlan(
      'pic-4', 'twin-2a', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * fellaPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
    const student = this;
    const parent: FellaExtraChoice<boolean> = {
      label: '家长是否同校就读',
      options: [{ value: false, label: '单独就读' }, { value: true, label: '家长也在第一校区读' }],
      inComparison: true,
      get visible() { return campus === 'campus1' && student.selectedAgeGroup === 'minor'; },
      get note() {
        return student.withParent ? '' : '15–17岁单独就读，另付未成年管理费：读1–2周50美元，3–4周100美元，之后每周25美元。';
      },
      get value() { return student.withParent; },
      set value(value: boolean) { student.withParent = value; },
    };
    this.extraChoices = campus === 'campus1' ? [parent] : [];
  }

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  private hasCourse(ids: readonly string[]): boolean {
    return this.quotePlan.courses.some(row => ids.includes(row.optionId));
  }

  get courseLengthError(): string {
    for (const id of FELLA_GUARANTEE_COURSE_IDS) {
      const weeks = this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
      if (weeks && weeks !== 12) return `${this.courseName(id)}12周为一期，请选择连续12周。`;
    }
    const child = this.quotePlan.courses.find(row => FELLA_CHILD_COURSE_IDS.includes(row.optionId));
    if (child && this.selectedAgeGroup === 'adult') return `${this.courseName(child.optionId)}是儿童课程，请把年龄段改为“未满18岁”。`;
    if (this.selectedAgeGroup === 'minor' && this.hasCourse(['gec'])) return 'GEC家长课程是陪读家长读的课程，未满18岁的学生请选儿童课程或其他课程。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  get minorNote(): string {
    return this.campus === 'campus1'
      ? '第一校区只收15岁以上学生；15–17岁单独就读另付未成年管理费，周六上午课必须参加，周五门禁22:00。带孩子来读书请看第二校区。'
      : '第二校区收5岁以上学生：5–6岁读P-JEC，7–15岁读JEC，未满15岁须家长陪读；陪读家长可以报GEC家长课程。一家人可用多人报价一起算。';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Christmas windows whose class days (Monday to Friday) fall in a course week; 100 dollars each, at most 200. */
  get christmasWindows(): number {
    const weekStarts = this.quotePlan.weekStarts();
    return FELLA_CHRISTMAS_WEEKS.filter(window => {
      const from = Date.parse(`${window.start}T00:00:00Z`);
      const to = Date.parse(`${window.end}T00:00:00Z`);
      return weekStarts.some(start => start + DAY <= to && start + 5 * DAY >= from);
    }).length;
  }

  get christmasDiscount(): number {
    const rule = this.enabledRule(FELLA_CHRISTMAS_RULE_ID);
    if (!rule) return 0;
    return Math.min(FELLA_CHRISTMAS_MAX, this.christmasWindows * rule.discountValue);
  }

  /** 思达启航 5% from 4 course weeks, not on family courses: (tuition + room − Christmas) × 5%. */
  get sidaDiscount(): number {
    const rule = this.enabledRule(FELLA_SIDA_RULE_ID);
    if (!rule || this.quotePlan.courseWeeks < rule.minimumCourseWeeks || this.hasCourse(FELLA_FAMILY_COURSE_IDS)) return 0;
    return roundCents(Math.max(0, this.tuition + this.accommodation - this.christmasDiscount) * rule.discountValue / 100);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    const applied: Array<{ rule: CiaPromotionRule; amount: number }> = [];
    const christmas = this.enabledRule(FELLA_CHRISTMAS_RULE_ID);
    if (christmas && this.christmasDiscount > 0) applied.push({ rule: christmas, amount: this.christmasDiscount });
    const sida = this.enabledRule(FELLA_SIDA_RULE_ID);
    if (sida && this.sidaDiscount > 0) applied.push({ rule: sida, amount: this.sidaDiscount });
    return applied;
  }

  get promotionDiscountTotal(): number {
    return roundCents(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return this.appliedPromotions.map(item => item.rule.name).join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && this.enabledRule(FELLA_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  /** First campus only: a 15–17-year-old studying without a parent (Guardian Fee on the 2026 sheet). */
  get guardianFee(): number {
    if (this.campus !== 'campus1' || this.selectedAgeGroup !== 'minor' || this.withParent) return 0;
    return fellaGuardianFee(this.quotePlan.courseWeeks);
  }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.guardianFee - this.promotionDiscountTotal;
    return Math.max(0, roundCents(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const guardian: SchoolPaymentLine[] = this.guardianFee
      ? [{ icon: '管', label: '未成年学生单独到校服务费', value: this.guardianFee, note: '15–17岁单独就读：1–2周50美元，3–4周100美元，之后每周25美元；不参与优惠' }]
      : [];
    return [
      ...guardian,
      ...this.appliedPromotions.map(({ rule, amount }) => ({
        icon: rule.id === FELLA_SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note: rule.id === FELLA_CHRISTMAS_RULE_ID ? `${rule.description}；本次${this.christmasWindows}周` : rule.description,
        promotionKey: rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

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

  private visaSequence(rule: CiaLocalFeeRule): number[] {
    return (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
  }

  /** One textbook set per course type: 1,500 pesos for 1–2 weeks (and the parent course), otherwise 2,500. */
  private get bookSets(): number[] {
    const weeks = new Map<string, number>();
    for (const row of this.quotePlan.courses) weeks.set(row.optionId, (weeks.get(row.optionId) ?? 0) + row.weeks);
    const rule = this.rule('books');
    const full = rule?.amount ?? 0;
    const small = rule?.secondaryAmount ?? full;
    return [...weeks.entries()].map(([id, total]) => FELLA_SMALL_BOOK_COURSE_IDS.includes(id) || total <= 2 ? small : full);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks === 1 ? `${formatPhp(rule.amount)}／周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };

    const visaRule = this.rule('visa-extension');
    const sequence = visaRule ? this.visaSequence(visaRule) : [];
    const visaTotal = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0)
      .reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;

    const eCard = this.rule('ssp-e-card');
    const eCardAmount = eCard && plan.stayWeeks <= 1 ? eCard.secondaryAmount ?? eCard.amount : eCard?.amount ?? 0;

    const management = this.rule('management');
    const managementTotal = management && plan.roomWeeks > 0
      ? (management.secondaryAmount ?? management.amount) + management.amount * (plan.roomWeeks - 1) : 0;

    const books = this.bookSets;
    const firstExtension = !longTerm && extensions > 0 ? 1 : 0;
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, sequence.length ? `${formatPhp(sequence[0])}起／次` : undefined),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined, longTerm ? 0 : eCardAmount, `${formatPhp(eCardAmount)}／次`),
      ...create('acr-i-card', firstExtension, longTerm ? longTermNote : undefined),
      ...create('arp', firstExtension, longTerm ? longTermNote : undefined),
      ...create('management', plan.roomWeeks, undefined, managementTotal, '首周1,000，之后500比索／周'),
      ...create('books', books.length, undefined, books.reduce((sum, amount) => sum + amount, 0), '1,500或2,500比索／套'),
      ...create('student-id', 1),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }

  /** Room deposit by stay length (refundable, outside the total). */
  get roomDeposit(): number { return fellaRoomDeposit(this.quotePlan.stayWeeks); }
  /** Pickup: family-course members pay 700 pesos instead of 1,000. */
  pickupFee(standard: number): number { return this.hasCourse(FELLA_FAMILY_COURSE_IDS) ? FAMILY_PICKUP : standard; }
}

/** Room deposit, padlock deposit and pickup, outside the local-fee total, added up over the students. */
function fellaOptionalFees(pricing: FellaQuotePricing, students: readonly FellaPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  const group = count > 1 ? `（${count}人）` : '';
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const total = students.reduce((sum, student) =>
        sum + (rule.id === 'deposit' ? student.roomDeposit : rule.id === 'pickup' ? student.pickupFee(rule.amount) : rule.amount), 0);
      const note = rule.id === 'deposit' && count === 1
        ? `本次停留${students[0].quotePlan.stayWeeks}周，${formatPhp(total)}；${rule.note}`
        : `${rule.note}${group}`;
      return { label: rule.name, amount: formatPhp(total), cnyAmount: cny(total), note };
    });
}

export class FellaQuote extends PhSchoolQuote<FellaPageStudent> {
  constructor(pricing: FellaQuotePricing, campus: FellaCampus) {
    super(pricing, {
      createStudent: () => new FellaPageStudent(pricing, campus),
      headingPrefix: FELLA_CAMPUS_NAMES[campus],
      image: {
        schoolCode: 'FELLA',
        schoolName: `菲律宾宿务English Fella${campus === 'campus1' ? '第一校区' : '第二校区'}`,
        filePrefix: campus === 'campus1' ? 'English-Fella-Campus1' : 'English-Fella-Campus2',
        heroSrc: FELLA_PAGE_CONTENT[campus].quoteImageHero,
      },
      priceMultiplier: weeks => fellaPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => fellaOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class FellaPlanComparison extends PhPlanComparison<FellaPageStudent> {
  private courseSource?: FellaQuotePricing['courseFees'];
  private comparable: FellaQuotePricing['courseFees'] = [];

  constructor(private readonly fellaPricing: FellaQuotePricing, campus: FellaCampus, conditions: () => FellaPageStudent) {
    super(fellaPricing, conditions, {
      createStudent: () => new FellaPageStudent(fellaPricing, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.withParent = from.withParent;
      },
      heading: `${FELLA_CAMPUS_NAMES[campus]} 方案对比报价`,
      courseGroups: FELLA_COMPARE_COURSE_GROUPS[campus],
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }

  /** Family courses are priced for a family together, so plans compare the other courses only. */
  override get courseOptions(): FellaQuotePricing['courseFees'] {
    if (this.courseSource !== this.fellaPricing.courseFees) {
      this.courseSource = this.fellaPricing.courseFees;
      this.comparable = (this.fellaPricing.courseFees ?? []).filter(item => !FELLA_FAMILY_COURSE_IDS.includes(item.id));
    }
    return this.comparable;
  }
}
