// GLC on the shared Philippine school quote and plan comparison. GLC's own prices, offers, family packages and local
// fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up and
// lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program can bundle it.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhCompareFocus, PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  GLC_FAMILY_ROOM_IDS,
  GLC_FREE_PICKUP_AMOUNT,
  GLC_GUARDIAN_FEE_PER_WEEK,
  GLC_GUARDIAN_ROOM_ID,
  GLC_HOTEL_ROOM_IDS,
  GLC_PEAK_SEASONS,
  GLC_PICKUP_OPTIONS,
  GLC_REGISTRATION_PICKUP_RULE_ID,
  GLC_RETURNING_RULE_ID,
  GLC_SCHOOL_WINDOW_PREFIX,
  GLC_SHORT_STAY_FEE_PER_WEEK,
  GLC_SIDA_RULE_ID,
  GLC_SPARTA_ROOM_IDS,
  glcCourseFacts,
  type GlcTextbookType,
} from './glc-content-config';
import { GLC_QUOTE_IMAGE_HERO } from './glc-page-content';

const DAY = 86400000;
const WEEK = 7 * DAY;

/** Everything GLC's quote reads; the page component is one. */
export interface GlcQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const GLC_COMPARE_COURSE_GROUPS = [
  { id: 'speaking', label: '口语课程', courseIds: ['light-power-speaking', 'power-speaking', 'intensive-power-speaking', 'ultra7-power-speaking'] },
  { id: 'ielts', label: '雅思', courseIds: ['general-ielts', 'intensive-ielts', 'ultra8-ielts', 'ultra-ielts-sparta'] },
  { id: 'toeic', label: '托业', courseIds: ['general-toeic', 'intensive-toeic', 'ultra8-toeic', 'ultra-toeic-sparta'] },
  { id: 'business', label: '商务英语', courseIds: ['business-course', 'ultra7-business'] },
] as const;

/** GLC prices every week alike (the school quotes per week); 1–3-week stays pay a separate short-term charge. */
export const glcPriceMultiplier = (weeks: number): number => weeks / 4;

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const round = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const localToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

/** Whether the Sunday-to-Saturday week starting at `start` (epoch ms) touches a 2027 winter or summer week. */
export const isGlcPeakWeek = (start: number): boolean =>
  GLC_PEAK_SEASONS.some(season => start <= parseDay(season.end) && start + 6 * DAY >= parseDay(season.start));

/** Complete runs of four consecutive weeks among sorted week starts. */
const fourWeekBlocks = (starts: readonly number[]): number => {
  let blocks = 0;
  let run = 0;
  let previous = Number.NaN;
  for (const start of starts) {
    run = start - previous === WEEK ? run + 1 : 1;
    previous = start;
    if (run === 4) {
      blocks++;
      run = 0;
    }
  }
  return blocks;
};

/** ESL online books: 1–8 weeks 3,000, 9–16 5,000, 17–24 7,000 pesos, then 1,000 per further 4 weeks. */
export const glcEslBookFee = (weeks: number): number => {
  if (weeks <= 0) return 0;
  if (weeks <= 8) return 3000;
  if (weeks <= 16) return 5000;
  if (weeks <= 24) return 7000;
  return 7000 + 1000 * Math.ceil((weeks - 24) / 4);
};

/** IELTS, TOEIC or Business books per course type: 1–4 weeks 5,000, 5–12 7,500, 13–24 10,000, 25–48 15,000 pesos. */
export const glcExamBookFee = (weeks: number): number => {
  if (weeks <= 0) return 0;
  if (weeks <= 4) return 5000;
  if (weeks <= 12) return 7500;
  if (weeks <= 24) return 10000;
  return 15000;
};

/** Management fee: 1–3 weeks 3,000/4,000/5,000 pesos, from 4 weeks the 4-week rate per week. */
export const glcManagementFee = (weeks: number, fourWeekAmount: number): number => {
  if (weeks <= 0) return 0;
  if (weeks < 4) return [3000, 4000, 5000][weeks - 1];
  return fourWeekAmount / 4 * weeks;
};

type MinorBand = '15-17' | '12-14' | '5-11';
const MINOR_BANDS: ReadonlyArray<{ value: MinorBand; label: string }> = [
  { value: '15-17', label: '15–17岁' },
  { value: '12-14', label: '12–14岁' },
  { value: '5-11', label: '5–11岁' },
];
const BOOK_NAMES: Record<Exclude<GlcTextbookType, 'esl'>, string> = { ielts: '雅思', toeic: '托业', business: '商务英语' };

/** One GLC student, or one whole family on a family package, as the template binds it. */
export class GlcPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  selectedRegistrationDate = localToday();
  returningStudent = false;
  pickupOption = 'sunday-one-way';
  minorBand: MinorBand = '15-17';
  accompanied = true;
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly pricing: GlcQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'power-speaking', 'main-double', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.basePrice(kind, row),
    );
    const student = this;
    const pickup: PhExtraChoice = {
      label: '机场接送',
      options: GLC_PICKUP_OPTIONS.map(option => ({ value: option.value, label: option.label })),
      visible: true,
      inComparison: false,
      get note() { return student.pickupNote; },
      get value() { return student.pickupOption; },
      set value(next: unknown) { student.pickupOption = String(next); },
    };
    const band: PhExtraChoice = {
      label: '未成年年龄段',
      options: MINOR_BANDS,
      get visible() { return student.selectedAgeGroup === 'minor' && !student.isFamily; },
      note: '',
      get value() { return student.minorBand; },
      set value(next: unknown) {
        student.minorBand = MINOR_BANDS.some(option => option.value === next) ? next as MinorBand : '15-17';
        student.planOptionChanged();
      },
    };
    const parents: PhExtraChoice = {
      label: '是否有家长陪读',
      options: [{ value: true, label: '家长陪读' }, { value: false, label: '独自就读（另付监护费）' }],
      get visible() { return student.selectedAgeGroup === 'minor' && !student.isFamily && student.minorBand === '12-14'; },
      get note() {
        return student.unaccompanied
          ? `监护费每周${GLC_GUARDIAN_FEE_PER_WEEK}美元，住主楼三人间，须选往返接送机。` : '';
      },
      get value() { return student.accompanied; },
      set value(next: unknown) {
        student.accompanied = next === true || next === 'true';
        student.planOptionChanged();
      },
    };
    this.extraChoices = [pickup, band, parents];
  }

  /** The 4-week catalogue price of an option at `row.weeks` (prorated by the plan at the student's tier). */
  private basePrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    const fourWeeks = kind === 'course'
      ? this.pricing.courseFees.find(item => item.id === row.optionId)?.tuition ?? 0
      : this.pricing.roomFees.find(item => item.id === row.optionId)?.fee ?? 0;
    return fourWeeks * row.weeks / 4;
  }

  // ---- what the plan holds ----------------------------------------------------------------------

  /** Family package size when the first course is one. */
  get familySize(): number {
    return glcCourseFacts(this.quotePlan?.courses[0]?.optionId ?? '').familySize ?? 0;
  }
  get isFamily(): boolean { return this.familySize > 0; }
  /** People this quote covers: the whole family on a family package, otherwise one. */
  get personCount(): number { return this.familySize || 1; }
  get unaccompanied(): boolean {
    return this.selectedAgeGroup === 'minor' && !this.isFamily && this.minorBand === '12-14' && !this.accompanied;
  }
  private get isSparta(): boolean { return this.quotePlan.courses.some(row => glcCourseFacts(row.optionId).sparta); }

  /** A family package brings a family room, a Sparta course an Annex2 room, an unaccompanied 12–14-year-old the triple. */
  planOptionChanged(): void {
    const family = this.familySize;
    const allowed = family ? GLC_FAMILY_ROOM_IDS[family] ?? [] : this.isSparta ? GLC_SPARTA_ROOM_IDS
      : this.unaccompanied ? [GLC_GUARDIAN_ROOM_ID] : [];
    if (allowed.length) {
      for (const row of this.quotePlan.rooms) {
        if (!allowed.includes(row.optionId)) row.optionId = family === 2 && !this.isSparta ? 'main-double' : allowed[0];
      }
    }
    if (this.unaccompanied && !this.pickup.roundTrip) {
      this.pickupOption = this.pickup.sunday ? 'sunday-round-trip' : 'weekday-round-trip';
    }
  }

  private get firstCourseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
  }
  private get courseWeekStarts(): number[] { return this.quotePlan.weekStarts(this.quotePlan.courses); }
  private get arrivesInPeak(): boolean {
    const start = parseDay(this.firstCourseStart);
    return Number.isFinite(start) && isGlcPeakWeek(start);
  }
  /** Study weeks that touch the 2027 winter or summer; no offers apply to them. */
  get peakStudyWeeks(): number { return this.courseWeekStarts.filter(isGlcPeakWeek).length; }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    if (this.isFamily) return '亲子套餐按整个家庭报价：全家同住一间房，家长可以不上课，未满15岁的孩子只上一对一。';
    if (this.minorBand === '5-11') return '5–11岁报儿童英语，须有家长陪读；家长一起读书可以报亲子套餐。';
    if (this.minorBand === '12-14') return '12–14岁报青少年口语；独自就读要付监护费、住三人间，并往返接送机。';
    return '15–17岁可报口语、雅思和托业课程（商务英语须满18岁）；平日不能外出，周末须有20岁以上成人陪同。';
  }

  minimumWeeks(_courseId: string): number { return 0; }
  readonly courseLengthError = '';

  get quoteError(): string {
    const plan = this.quotePlan;
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (plan.error) return plan.error;
    const facts = plan.courses.map(row => glcCourseFacts(row.optionId));
    const family = this.familySize;
    if (facts.some(item => item.kind === 'family')) {
      if (new Set(plan.courses.map(row => row.optionId)).size > 1) return '亲子套餐请只选一种，不能和其他课程混报。';
      if (!plan.rooms.every(row => (GLC_FAMILY_ROOM_IDS[family] ?? []).includes(row.optionId))) {
        return family === 2 ? '两人亲子套餐请住双人间。' : `${family}人亲子套餐请住主楼${family === 3 ? '三' : '四'}人间。`;
      }
    } else {
      const minor = this.selectedAgeGroup === 'minor';
      const band = minor ? this.minorBand : 'adult';
      for (const item of facts) {
        if (item.kind === 'kids' && band !== '5-11') return '儿童英语只收5–11岁的孩子。';
        if (item.kind === 'junior' && band !== '12-14') return '青少年口语只收12–14岁的学生。';
        if (item.kind === 'adult' && (band === '5-11' || band === '12-14')) {
          return band === '5-11' ? '5–11岁请报儿童英语或亲子套餐。' : '12–14岁请报青少年口语或亲子套餐。';
        }
        if (item.kind === 'adult' && minor && (item.minimumAge ?? 0) >= 18) return '商务英语须满18岁。';
      }
      if (this.isSparta && !plan.rooms.every(row => GLC_SPARTA_ROOM_IDS.includes(row.optionId))) {
        return '斯巴达课程只能住副楼 Annex2 单人间或双人间。';
      }
      if (this.unaccompanied) {
        if (!plan.rooms.every(row => row.optionId === GLC_GUARDIAN_ROOM_ID)) return '独自就读的12–14岁学生须住主楼三人间。';
        if (!this.pickup.roundTrip) return '独自就读的12–14岁学生须选往返接送机。';
      }
      if (minor && this.peakStudyWeeks > 0) {
        return '2027年寒暑假只收入学时满18岁的成人和少量家庭；带孩子请报亲子套餐，并让顾问向学校确认名额。';
      }
    }
    const summer = GLC_PEAK_SEASONS.find(season => season.minimumWeeks > 0);
    if (summer && plan.overlapWeeks(summer.start, summer.end) > 0 && plan.courseWeeks < summer.minimumWeeks) {
      return `${summer.label}至少读${summer.minimumWeeks}周。`;
    }
    return '';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** The school's annual offer: 150 dollars per four consecutive eligible weeks wholly inside one window, never peak weeks. */
  private windowBlocks(rule: CiaPromotionRule): number {
    if (!rule.enabled || !rule.coverageStart || !rule.coverageEnd || (rule.newStudentsOnly && this.returningStudent)) return 0;
    const from = parseDay(rule.coverageStart);
    const through = parseDay(rule.coverageEnd);
    const rows = this.quotePlan.courses.filter(row => !rule.eligibleCourseIds?.length || rule.eligibleCourseIds.includes(row.optionId));
    const starts = this.quotePlan.weekStarts(rows).filter(start => start >= from && start + 6 * DAY <= through && !isGlcPeakWeek(start));
    return fourWeekBlocks(starts);
  }

  private get schoolWindows(): Array<{ rule: CiaPromotionRule; blocks: number }> {
    return this.pricing.promotions
      .filter(rule => rule.id.startsWith(GLC_SCHOOL_WINDOW_PREFIX))
      .map(rule => ({ rule, blocks: this.windowBlocks(rule) }))
      .filter(item => item.blocks > 0);
  }

  get schoolOfferAmount(): number {
    return this.schoolWindows.reduce((sum, item) => sum + item.blocks * (item.rule.incrementValue ?? item.rule.discountValue), 0);
  }

  /** 思达启航: 50 dollars per four consecutive course weeks outside the winter and summer, every course. */
  get sidaOfferAmount(): number {
    const rule = this.enabledRule(GLC_SIDA_RULE_ID);
    if (!rule || (rule.newStudentsOnly && this.returningStudent)) return 0;
    const blocks = fourWeekBlocks(this.courseWeekStarts.filter(start => !isGlcPeakWeek(start)));
    return blocks * (rule.incrementValue ?? rule.discountValue);
  }

  /** One Sunday one-way pickup per person, from the registration offer or the school's annual offer, never in the peak. */
  get freePickup(): boolean {
    if (!this.pickup.sunday || this.arrivesInPeak) return false;
    const rule = this.enabledRule(GLC_REGISTRATION_PICKUP_RULE_ID);
    if (rule && this.quotePlan.courseWeeks >= rule.minimumCourseWeeks) {
      const date = this.selectedRegistrationDate;
      if ((!rule.registrationStart || date >= rule.registrationStart) && (!rule.registrationEnd || date <= rule.registrationEnd)) return true;
    }
    const start = this.firstCourseStart;
    return this.schoolWindows.some(item => start >= (item.rule.coverageStart ?? '') && start <= (item.rule.coverageEnd ?? ''));
  }

  get promotionDiscountTotal(): number {
    return round(this.schoolOfferAmount + this.sidaOfferAmount + (this.freePickup ? GLC_FREE_PICKUP_AMOUNT * this.personCount : 0));
  }

  get discountNames(): string {
    return [
      this.schoolOfferAmount > 0 ? '学校年度优惠' : '',
      this.sidaOfferAmount > 0 ? '思达启航专属优惠' : '',
      this.freePickup ? '周日免费接机' : '',
    ].filter(Boolean).join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    const waived = this.returningStudent && !!this.enabledRule(GLC_RETURNING_RULE_ID);
    return waived ? 0 : this.pricing.registrationFee * this.personCount;
  }
  get registrationNote(): string | undefined {
    return this.isFamily ? `亲子套餐${this.personCount}人，每人一次` : undefined;
  }
  get tuition(): number { return round(this.quotePlan.total('course')); }
  /** Each family member pays the room price. */
  get accommodation(): number { return round(this.quotePlan.total('room') * this.personCount); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  private get pickup() {
    return GLC_PICKUP_OPTIONS.find(option => option.value === this.pickupOption) ?? GLC_PICKUP_OPTIONS[0];
  }
  get pickupFee(): number { return this.pickup.amount * this.personCount; }
  get pickupNote(): string {
    if (this.pickup.value === 'none') return '';
    return this.freePickup ? '本次符合周日免费接机优惠，减一次单程接机35美元。' : '';
  }
  /** 1–3-week stays: 60 dollars per week per person. */
  get shortStayFee(): number {
    const weeks = this.quotePlan.stayWeeks;
    return weeks > 0 && weeks < 4 ? GLC_SHORT_STAY_FEE_PER_WEEK * weeks * this.personCount : 0;
  }
  get guardianFee(): number { return this.unaccompanied ? GLC_GUARDIAN_FEE_PER_WEEK * this.quotePlan.stayWeeks : 0; }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.pickupFee + this.shortStayFee + this.guardianFee
      - this.promotionDiscountTotal;
    return Math.max(0, round(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const people = this.personCount;
    const each = people > 1 ? `每人${this.pickup.amount}美元 × ${people}人` : '';
    const lines: SchoolPaymentLine[] = [];
    if (this.pickupFee > 0) {
      lines.push({ icon: '接', label: '机场接机', value: this.pickupFee, note: [this.pickup.label, each].filter(Boolean).join('；') });
    }
    if (this.shortStayFee > 0) {
      lines.push({
        icon: '短', label: '短期附加费', value: this.shortStayFee,
        note: `读1–3周每周${GLC_SHORT_STAY_FEE_PER_WEEK}美元${people > 1 ? `／人 × ${people}人` : ''}，本次${this.quotePlan.stayWeeks}周`,
      });
    }
    if (this.guardianFee > 0) {
      lines.push({ icon: '护', label: '未成年监护费', value: this.guardianFee, note: `独自就读的12–14岁学生每周${GLC_GUARDIAN_FEE_PER_WEEK}美元，本次${this.quotePlan.stayWeeks}周` });
    }
    const school = this.schoolWindows;
    if (school.length) {
      const blocks = school.reduce((sum, item) => sum + item.blocks, 0);
      lines.push({
        icon: '惠', label: '学校年度优惠', value: -this.schoolOfferAmount, promotionKey: school[0].rule.id,
        note: `适用课程在优惠期间每满连续4周减${school[0].rule.incrementValue ?? school[0].rule.discountValue}美元，本次${blocks}个4周；寒暑假学习周不计入`,
      });
    }
    const sida = this.enabledRule(GLC_SIDA_RULE_ID);
    if (sida && this.sidaOfferAmount > 0) {
      lines.push({
        icon: '折', label: sida.name, value: -this.sidaOfferAmount, promotionKey: sida.id,
        note: `课程每满连续4周减${sida.incrementValue ?? sida.discountValue}美元，本次${this.sidaOfferAmount / (sida.incrementValue ?? sida.discountValue)}个4周；寒暑假学习周不计入`,
      });
    }
    if (this.freePickup) {
      lines.push({
        icon: '惠', label: '周日免费接机', value: -GLC_FREE_PICKUP_AMOUNT * people, promotionKey: GLC_REGISTRATION_PICKUP_RULE_ID,
        note: `送一次周日单程接机${people > 1 ? `，${people}人` : ''}`,
      });
    }
    return lines;
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension per started 30 days beyond the entry visa (30-day visa from week 5, 59-day visa from week 9). */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  private weeksOfBooks(type: GlcTextbookType): number {
    return this.quotePlan.courses
      .filter(row => glcCourseFacts(row.optionId).textbook === type)
      .reduce((sum, row) => sum + row.weeks, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const people = this.personCount;
    const each = people > 1 ? '／人' : '';
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const familyNote = people > 1 ? `；按全家${people}人计算` : '';
    const row = (id: string, quantity: number, total: number, unitLabel: string, note?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      return [{
        item: rule.name, unitLabel, quantity: quantity * people, total: total * people,
        note: `${note ?? rule.note}${quantity > 0 ? familyNote : ''}`,
      }];
    };
    const once = (id: string, quantity: number, note?: string) => {
      const rule = this.rule(id);
      return rule ? row(id, quantity, rule.amount * quantity, `${formatPhp(rule.amount)}${each}`, note) : [];
    };

    const visaRule = this.rule('visa-extension');
    const extensions = this.visaExtensionCount;
    const visaTotal = visaRule ? this.visaExtensionAmounts(visaRule).reduce((sum, amount) => sum + amount, 0) : 0;
    const visaFirst = visaRule ? (this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount : 0;
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;

    const roomWeeks = plan.roomWeeks;
    const dormWeeks = plan.rooms.filter(item => !GLC_HOTEL_ROOM_IDS.includes(item.optionId)).reduce((sum, item) => sum + item.weeks, 0);
    const management = this.rule('management');
    const electricity = this.rule('electricity');
    const eslWeeks = this.weeksOfBooks('esl');
    const examBooks = (['ielts', 'toeic', 'business'] as const)
      .map(type => ({ type, weeks: this.weeksOfBooks(type) }))
      .filter(item => item.weeks > 0);
    const examTotal = examBooks.reduce((sum, item) => sum + glcExamBookFee(item.weeks), 0);
    const examNote = examBooks.length
      ? `${examBooks.map(item => `${BOOK_NAMES[item.type]}${item.weeks}周`).join('、')}；${this.rule('books-exam')?.note ?? ''}`
      : undefined;

    return [
      ...row('visa-extension', extensions, visaTotal, `${formatPhp(visaFirst)}起${each}／次`, visaNote),
      ...once('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...once('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      // ACR I-CARD comes with the first visa extension (user rule 2026-11-24, every Philippine school).
      ...once('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...(management ? row('management', roomWeeks, glcManagementFee(roomWeeks, management.amount),
        `${formatPhp(management.amount / 4)}${each}／周`) : []),
      ...(electricity ? row('electricity', dormWeeks, electricity.amount * dormWeeks, `${formatPhp(electricity.amount)}${each}／周`) : []),
      ...row('books-esl', eslWeeks > 0 ? 1 : 0, glcEslBookFee(eslWeeks), `按周数${each}`,
        eslWeeks > 0 ? `英语课程${eslWeeks}周；${this.rule('books-esl')?.note ?? ''}` : undefined),
      ...row('books-exam', examBooks.length, examTotal, `按课程和周数${each}`, examNote),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

export class GlcQuote extends PhSchoolQuote<GlcPageStudent> {
  constructor(pricing: GlcQuotePricing) {
    super(pricing, {
      createStudent: () => new GlcPageStudent(pricing),
      headingPrefix: 'GLC',
      image: { schoolCode: 'GLC', schoolName: '菲律宾宿务GLC语言学校', filePrefix: 'GLC', heroSrc: GLC_QUOTE_IMAGE_HERO },
      priceMultiplier: glcPriceMultiplier,
      layoutVersion: 2,
    });
  }

  /** A family package is one whole-family price, so families are quoted one at a time. */
  override get quoteError(): string {
    if (this.quoteMode === 'group' && this.activeStudents.some(student => student.isFamily)) {
      return '亲子套餐按整个家庭报价，请用单人报价，每个家庭单独报一份。';
    }
    return super.quoteError;
  }

  /** A family's conditions name the family instead of an age group. */
  override studentConditionText(student: GlcPageStudent): string {
    if (!student.isFamily) return super.studentConditionText(student);
    return [student.returningStudent ? '老学员' : '新学员', `${student.personCount}人家庭`, student.visaLabel].join(' · ');
  }
}

/**
 * The page's prices without the family packages: 方案对比 compares one student's plans, while a family package is one
 * whole-family price with its own room rules.
 */
class GlcComparePricingView implements PhComparePricing {
  private courseSource?: readonly CiaQuoteCourse[];
  private courseCache: CiaQuoteCourse[] = [];

  constructor(private readonly source: GlcQuotePricing) {}

  get courseFees(): CiaQuoteCourse[] {
    if (this.courseSource !== this.source.courseFees) {
      this.courseSource = this.source.courseFees;
      this.courseCache = (this.source.courseFees ?? []).filter(course => glcCourseFacts(course.id).kind !== 'family');
    }
    return this.courseCache;
  }
  get roomFees() { return this.source.roomFees; }
  get registrationFee() { return this.source.registrationFee; }
  get seasonalFeePerWeek() { return this.source.seasonalFeePerWeek; }
  get peakSeasonRanges() { return this.source.peakSeasonRanges; }
  get promotions() { return this.source.promotions; }
  get localFeeRules() { return this.source.localFeeRules; }
  get quoteImageSettings() { return this.source.quoteImageSettings; }
  get usdToCny() { return this.source.usdToCny; }
  get phpPerCny() { return this.source.phpPerCny; }
  get exchangeRateDate() { return this.source.exchangeRateDate; }
  get usingLiveExchangeRates() { return this.source.usingLiveExchangeRates; }
}

export class GlcPlanComparison extends PhPlanComparison<GlcPageStudent> {
  constructor(pricing: GlcQuotePricing, conditions: () => GlcPageStudent) {
    super(new GlcComparePricingView(pricing), conditions, {
      createStudent: () => new GlcPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        // A family's conditions do not describe one student; the plans then compare a new adult student.
        to.selectedAgeGroup = from.isFamily ? 'adult' : from.selectedAgeGroup;
        to.minorBand = from.minorBand;
        to.accompanied = from.accompanied;
        to.returningStudent = from.isFamily ? false : from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
        to.pickupOption = from.pickupOption;
      },
      heading: 'GLC 方案对比报价',
      courseGroups: GLC_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      extraNotes: () => ['学校费用合计已含机场接机；读1–3周另收每周60美元短期附加费。'],
      layoutVersion: 2,
    });
  }

  /** Plan A starts from the normal quote; a family package becomes one adult on Power Speaking. */
  override start(focus: PhCompareFocus = this.focus): void {
    super.start(focus);
    const first = this.plans[0];
    if (!first || glcCourseFacts(this.courseId(first)).kind !== 'family') return;
    this.setCourse(first, 'power-speaking');
    this.setRoom(first, 'main-double');
    this.applyFocus(focus);
  }
}
