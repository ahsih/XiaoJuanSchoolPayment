// B'Cebu on the shared Philippine school quote and plan comparison. B'Cebu's own prices, discount order, family
// and minor rules, reporter offer and local fees are calculated here per student; the template's PhSchoolQuote and
// PhPlanComparison only add students up and lay out the result. Keep this file free of Angular, DOM and storage
// access, so the WeChat mini program can bundle it later.
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { textbookPeriods } from '../school-textbook-estimate';
import {
  BCEBU_FAMILY_RULE_ID,
  BCEBU_LONG_STAY_RULE_ID,
  BCEBU_OFF_SEASON_RULE_IDS,
  BCEBU_REGISTRATION_RULE_ID,
  BCEBU_REPORTER_RULE_ID,
  BCEBU_RETURNING_RULE_ID,
  BCEBU_SIDA_RULE_ID,
} from './bcebu-content-config';
import {
  BCEBU_IELTS_GUARANTEE_ID,
  BCEBU_JUNIOR_COURSE_ID,
  BCEBU_KIDS_COURSE_ID,
  BCEBU_KIDS_ROOM_IDS,
  BCEBU_LITE_40_COURSE_ID,
  BCEBU_LONG_STAY_TIERS,
  bcebuLongStay,
  bcebuMultiplier,
} from './bcebu-pricing';

export const BCEBU_QUOTE_IMAGE_HERO = '/assets/bcebu/campus-building.webp';
const DAY = 86400000;
/** The guarantee course runs exactly one 12-week term. */
const GUARANTEE_WEEKS = 12;
const FAMILY_TRIPLE_ROOM_ID = 'family-triple-extra-bed';
const TWO_PLUS_ONE_ROOM_ID = 'two-plus-one';

/** Everything B'Cebu's quote reads; the page component is one. */
export interface BCebuQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  minorFeeHighSchoolPerWeek: number;
  minorFeeJuniorPerWeek: number;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const BCEBU_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '综合英语', courseIds: ['speed-esl', 'intensive-esl', 'b-sparta'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts', 'ielts-sparta', BCEBU_IELTS_GUARANTEE_ID] },
  { id: 'light', label: '轻松课程', courseIds: ['lite-esl4', BCEBU_LITE_40_COURSE_ID] },
  { id: 'business', label: '商务英语', courseIds: ['business-english', 'speed-esl', 'intensive-esl'] },
] as const;

export type BCebuMinorStage = 'high' | 'junior' | 'kids';
const STAGE_OPTIONS: ReadonlyArray<{ value: BCebuMinorStage; label: string }> = [
  { value: 'high', label: '高中（15–17岁）' },
  { value: 'junior', label: '小学或初中' },
  { value: 'kids', label: '未上小学（4–6岁）' },
];
const FAMILY_OPTIONS: ReadonlyArray<{ value: boolean; label: string }> = [
  { value: false, label: '单独报名' },
  { value: true, label: '亲子家庭' },
];
const REPORTER_OPTIONS: ReadonlyArray<{ value: boolean; label: string }> = [
  { value: false, label: '不参加' },
  { value: true, label: '参加记者活动' },
];

interface BCebuExtraChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const round = (value: number): number => Math.round(value * 100) / 100;
const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const isoDay = (value: number): string => new Date(value).toISOString().slice(0, 10);
const slashDate = (value: string): string => value.replace(/-/g, '/');
const formatUsd = (value: number): string => quoteCurrencyText(round(value), 'zh-CN');
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
/** 10 → 9折, 15 → 85折. */
const discountLabel = (percent: number): string => {
  const rate = 100 - percent;
  return `${rate % 10 === 0 ? rate / 10 : rate}折`;
};

/** One B'Cebu student: plan, conditions and every amount the template and quote image show. */
export class BCebuPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** 亲子家庭: a parent and child (or children) come together; each member is quoted on their own. */
  family = false;
  /** School stage of a student under 18; decides the management fee and which courses fit. */
  minorStage: BCebuMinorStage = 'high';
  reporter = false;
  /** B'Cebu's choices under 学生情况 (template: PhPageStudent.extraChoices). */
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly pricing: BCebuQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'speed-esl', 'triple-bunk', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
    );
    const student = this;
    const family: BCebuExtraChoice<boolean> = {
      label: '报名方式',
      options: FAMILY_OPTIONS,
      visible: true,
      get note() {
        return student.family
          ? '亲子家庭每位成员分别报价；报名时每人先付500美元订金，算作学费预付款，不另外收取。暑假亲子之间不能转让课程，每人至少报4周。'
          : '';
      },
      get value() { return student.family; },
      set value(value: boolean) { student.family = value; },
    };
    const stage: BCebuExtraChoice<BCebuMinorStage> = {
      label: '在读阶段',
      options: STAGE_OPTIONS,
      get visible() { return student.selectedAgeGroup === 'minor'; },
      get note() { return student.stageNote; },
      get value() { return student.minorStage; },
      set value(value: BCebuMinorStage) { student.minorStage = value; },
    };
    const reporter: BCebuExtraChoice<boolean> = {
      label: '记者活动',
      options: REPORTER_OPTIONS,
      inComparison: false,
      get visible() { return student.reporterAvailable; },
      get note() { return student.reporter ? student.reporterRule?.description ?? '' : ''; },
      get value() { return student.reporter; },
      set value(value: boolean) { student.reporter = value; },
    };
    this.extraChoices = [family, stage, reporter];
  }

  // ---- prices -----------------------------------------------------------------------------------

  /** High-school students may take any course but Junior ESL, at the Junior ESL price (price list footnote). */
  private get highSchoolStudent(): boolean { return this.selectedAgeGroup === 'minor' && this.minorStage === 'high'; }

  private rowPrice(kind: 'course' | 'room', row: QuotePlanRow): number {
    const multiplier = bcebuMultiplier(row.weeks, this.pricing.shortTermPriceRatios);
    if (kind === 'room') return (this.pricing.roomFees.find(item => item.id === row.optionId)?.fee ?? 0) * multiplier;
    const course = this.pricing.courseFees.find(item => item.id === row.optionId);
    const junior = this.pricing.courseFees.find(item => item.id === BCEBU_JUNIOR_COURSE_ID);
    const tuition = this.highSchoolStudent && junior && row.optionId !== BCEBU_KIDS_COURSE_ID
      ? junior.tuition2027 || junior.tuition
      : course?.tuition2027 || course?.tuition || 0;
    return tuition * multiplier;
  }

  // ---- checks ----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  private weeksOf(courseId: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === courseId).reduce((sum, row) => sum + row.weeks, 0);
  }

  private takes(courseId: string): boolean { return this.quotePlan.courses.some(row => row.optionId === courseId); }
  private stays(roomId: string): boolean { return this.quotePlan.rooms.some(row => row.optionId === roomId); }

  /** IELTS Guarantee is one 12-week term. */
  get courseLengthError(): string {
    const weeks = this.weeksOf(BCEBU_IELTS_GUARANTEE_ID);
    if (!weeks || weeks === GUARANTEE_WEEKS) return '';
    const name = this.pricing.courseFees.find(item => item.id === BCEBU_IELTS_GUARANTEE_ID)?.name ?? '雅思保证班';
    return `${name}每期${GUARANTEE_WEEKS}周，请把课程周数改为${GUARANTEE_WEEKS}周。`;
  }

  private get peakWeekCount(): number {
    const rows = [...this.quotePlan.courses, ...this.quotePlan.rooms];
    return this.activePeakRanges.reduce((sum, range) => sum + this.quotePlan.overlapWeeks(range.start, range.end, rows), 0);
  }

  private overlapsPeak(rows: QuotePlanRow[]): boolean {
    return this.activePeakRanges.some(range => this.quotePlan.overlapWeeks(range.start, range.end, rows) > 0);
  }

  /** Who may take which course, with whom and in which room (price list footnotes, 2027 summer notice). */
  get eligibilityError(): string {
    const minor = this.selectedAgeGroup === 'minor';
    const stage = minor ? this.minorStage : undefined;
    const roomsOf = (id: string) => this.quotePlan.rooms.filter(row => row.optionId === id);
    if (this.takes(BCEBU_JUNIOR_COURSE_ID) && stage !== 'junior') {
      return stage === 'high'
        ? 'Junior ESL只接收小学和初中学生；高中生请选其他课程（学费按Junior ESL计算）。'
        : 'Junior ESL只接收小学和初中学生，请在学生情况里选未成年和在读阶段。';
    }
    if (stage === 'kids') {
      if (this.quotePlan.courses.some(row => row.optionId !== BCEBU_KIDS_COURSE_ID)) return '未上小学的孩子请选Kids Center幼儿课程。';
      if (!this.family) return '4–6岁的孩子须家长陪同，请把报名方式改为亲子家庭。';
    } else if (this.takes(BCEBU_KIDS_COURSE_ID)) {
      return 'Kids Center只接收4–6岁、还没上小学的孩子，请在学生情况里选未成年和在读阶段。';
    }
    if (this.takes(BCEBU_KIDS_COURSE_ID) && this.quotePlan.rooms.some(row => !BCEBU_KIDS_ROOM_IDS.includes(row.optionId))) {
      return 'Kids Center只可住双人间+客厅、双人间或三人间，请调整房型。';
    }
    if (minor && this.takes(BCEBU_LITE_40_COURSE_ID)) return 'Lite ESL 2只接收40岁以上学生，请改选其他课程。';
    if (this.stays(FAMILY_TRIPLE_ROOM_ID) && !this.family) return '双人间+客厅（亲子3人加床）只接受亲子家庭，请把报名方式改为亲子家庭或改选其他房型。';
    if (this.overlapsPeak(roomsOf(TWO_PLUS_ONE_ROOM_ID))) return '2+1宿舍只在淡季开放，暑假旺季请改选其他房型。';
    if (minor && !this.family && stage === 'junior' && this.peakWeekCount > 0) {
      return '暑假学校不单独接收16岁以下学生（须参加夏令营），请改为亲子家庭报名，或请顾问咨询夏令营。';
    }
    if (this.family && this.peakWeekCount > 0 && this.quotePlan.courseWeeks < 4) return '暑假亲子家庭每位学生至少报4周。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.eligibilityError;
  }

  // ---- promotions -------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(item => item.id === id && item.enabled);
  }

  /** Classes start on the Monday after the first course Sunday; B'Cebu's offers go by that date. */
  get entryDate(): string {
    const first = this.quotePlan.courses.map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
    const day = parseDay(first);
    return Number.isFinite(day) ? isoDay(day + DAY) : first;
  }

  private inWindow(rule: CiaPromotionRule): boolean {
    const entry = this.entryDate;
    return (!rule.arrivalStart || entry >= rule.arrivalStart) && (!rule.arrivalEnd || entry <= rule.arrivalEnd);
  }

  /** The off-season window this entry falls in, if any. */
  get offSeasonRule(): CiaPromotionRule | undefined {
    return BCEBU_OFF_SEASON_RULE_IDS.map(id => this.rule(id)).find(rule => !!rule && this.inWindow(rule));
  }

  /** Adult promotions leave out unaccompanied minors and the Junior and Kids courses. */
  private get adultEligible(): boolean {
    return this.selectedAgeGroup === 'adult'
      && !this.takes(BCEBU_JUNIOR_COURSE_ID) && !this.takes(BCEBU_KIDS_COURSE_ID);
  }

  private get offSeasonPercent(): number {
    const rule = this.offSeasonRule;
    if (!rule || !(this.family || this.adultEligible)) return 0;
    const familyCap = this.rule(BCEBU_FAMILY_RULE_ID)?.discountValue;
    return this.family && familyCap !== undefined ? Math.min(rule.discountValue, familyCap) : rule.discountValue;
  }

  get reporterRule(): CiaPromotionRule | undefined { return this.rule(BCEBU_REPORTER_RULE_ID); }

  /** The 2026 reporter offer: adults on their own, entering in a 2026 off-season window, from four course weeks. */
  get reporterAvailable(): boolean {
    const rule = this.reporterRule;
    return !!rule && !this.family && this.adultEligible && !!this.offSeasonRule && this.inWindow(rule)
      && this.quotePlan.courseWeeks >= rule.minimumCourseWeeks;
  }

  get longStayDiscount(): number {
    const rule = this.rule(BCEBU_LONG_STAY_RULE_ID);
    if (!rule) return 0;
    return bcebuLongStay(this.quotePlan.courseWeeks, rule.discountTiers ?? BCEBU_LONG_STAY_TIERS);
  }

  get reporterDiscount(): number {
    const rule = this.reporterRule;
    return this.reporter && this.reporterAvailable && rule ? this.quotePlan.courseWeeks * rule.discountValue : 0;
  }

  /** Confirmed order: long-stay and reporter deductions first, then the off-season and Sida percentages. */
  private discounts(reporter: number) {
    const base = this.tuition + this.accommodation;
    const percentageBase = Math.max(0, base - this.longStayDiscount - reporter);
    const offSeason = round(percentageBase * this.offSeasonPercent / 100);
    const sidaRate = this.rule(BCEBU_SIDA_RULE_ID)?.discountValue ?? 0;
    const sida = round((percentageBase - offSeason) * sidaRate / 100);
    return { offSeason, sida, total: round(this.longStayDiscount + reporter + offSeason + sida) };
  }

  get offSeasonDiscount(): number { return this.discounts(this.reporterDiscount).offSeason; }
  get sidaDiscount(): number { return this.discounts(this.reporterDiscount).sida; }
  get promotionDiscountTotal(): number { return this.discounts(this.reporterDiscount).total; }

  get discountNames(): string {
    const names: string[] = [];
    if (this.longStayDiscount) names.push(this.rule(BCEBU_LONG_STAY_RULE_ID)!.name);
    if (this.reporterDiscount) names.push(this.reporterRule!.name);
    if (this.offSeasonDiscount) names.push(this.offSeasonRule!.name);
    if (this.sidaDiscount) names.push(this.rule(BCEBU_SIDA_RULE_ID)!.name);
    return names.join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registrationWaiverName(): string | undefined {
    const rule = this.rule(BCEBU_REGISTRATION_RULE_ID);
    return rule?.waiveRegistration && !(rule.newStudentsOnly && this.returningStudent) ? rule.name : undefined;
  }

  /** Follows the shared registration note; uses the waiver's own wording, because its name already says “免注册费”. */
  get registrationNote(): string | undefined {
    if (this.registrationWaiverName === undefined) return undefined;
    return this.rule(BCEBU_REGISTRATION_RULE_ID)?.description.replace(/[。.]$/, '') || undefined;
  }

  get registration(): number {
    const returningWaiver = this.returningStudent && !!this.rule(BCEBU_RETURNING_RULE_ID);
    return returningWaiver || this.registrationWaiverName !== undefined ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  private get activePeakRanges() { return this.pricing.peakSeasonRanges.filter(range => range.enabled !== false); }
  /** Study or accommodation weeks touching a summer range, each counted once. */
  get peakWeeks(): number { return this.peakWeekCount; }
  get seasonalSurcharge(): number { return this.peakWeeks * this.pricing.seasonalFeePerWeek; }

  /** Students under 18 without a parent pay by accommodation week; never discounted. */
  get minorFeePerWeek(): number {
    if (this.selectedAgeGroup !== 'minor' || this.family) return 0;
    if (this.minorStage === 'high') return this.pricing.minorFeeHighSchoolPerWeek;
    if (this.minorStage === 'junior') return this.pricing.minorFeeJuniorPerWeek;
    return 0;
  }
  get minorFee(): number { return this.minorFeePerWeek * this.quotePlan.roomWeeks; }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal
      + this.seasonalSurcharge + this.minorFee;
    return Math.max(0, round(total));
  }

  /** With the reporter offer the school first takes the amount without it and refunds the difference after graduation. */
  get reporterPrepaid(): number {
    if (!this.reporterDiscount) return 0;
    return round(this.quoteUsd + this.promotionDiscountTotal - this.discounts(0).total);
  }

  get extraPaymentNote(): string | undefined {
    if (!this.reporterDiscount) return undefined;
    const refund = round(this.reporterPrepaid - this.quoteUsd);
    return `记者活动：报名时先按${formatUsd(this.reporterPrepaid)}美元付款（未减记者优惠），完成活动毕业后学校退还${formatUsd(refund)}美元，上方合计为退款后的金额。`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    const ranges = this.activePeakRanges.filter(range =>
      this.quotePlan.overlapWeeks(range.start, range.end, [...this.quotePlan.courses, ...this.quotePlan.rooms]) > 0);
    if (this.seasonalSurcharge) {
      lines.push({
        icon: '旺', label: '暑假附加费', value: this.seasonalSurcharge,
        note: `${this.pricing.seasonalFeePerWeek}美元／周 × ${this.peakWeeks}周；${ranges
          .map(range => `${range.label} ${slashDate(range.start)}–${slashDate(range.end)}`).join('；')}；不参与折扣`,
      });
    }
    const longStay = this.rule(BCEBU_LONG_STAY_RULE_ID);
    if (longStay && this.longStayDiscount) {
      lines.push({ icon: '惠', label: longStay.name, value: -this.longStayDiscount, note: `课程${this.quotePlan.courseWeeks}周；${longStay.description}`, promotionKey: longStay.id });
    }
    const reporter = this.reporterRule;
    if (reporter && this.reporterDiscount) {
      lines.push({ icon: '惠', label: reporter.name, value: -this.reporterDiscount, note: `${reporter.discountValue}美元／周 × ${this.quotePlan.courseWeeks}周；先付后退，见合计下方说明`, promotionKey: reporter.id });
    }
    const offSeason = this.offSeasonRule;
    if (offSeason && this.offSeasonDiscount) {
      lines.push({
        icon: '惠', label: offSeason.name, value: -this.offSeasonDiscount,
        note: `${slashDate(this.entryDate)}入学，课程和住宿${discountLabel(this.offSeasonPercent)}${this.family ? '（亲子家庭）' : ''}`,
        promotionKey: offSeason.id,
      });
    }
    const sida = this.rule(BCEBU_SIDA_RULE_ID);
    if (sida && this.sidaDiscount) {
      lines.push({ icon: '折', label: sida.name, value: -this.sidaDiscount, note: sida.description, promotionKey: sida.id });
    }
    if (this.minorFee) {
      lines.push({
        icon: '未', label: '未成年管理费', value: this.minorFee,
        note: `${this.minorStage === 'high' ? '高中生' : '小学或初中生'}无家长陪同，${this.minorFeePerWeek}美元／周 × ${this.quotePlan.roomWeeks}周；含毕业送机，不参与折扣`,
      });
    }
    return lines;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  get minorNote(): string {
    return `无家长陪同时另收管理费：高中生${this.pricing.minorFeeHighSchoolPerWeek}美元／周，小学和初中生${this.pricing.minorFeeJuniorPerWeek}美元／周，按住宿周数计算，含毕业送机。暑假不单独接收16岁以下学生。`;
  }

  private get stageNote(): string {
    if (this.minorStage === 'high') return '高中生可报Junior ESL以外的课程，学费按Junior ESL计算。';
    if (this.minorStage === 'junior') return '请选Junior ESL（每天6节一对一）。';
    return '请选Kids Center幼儿课程，须家长陪同。';
  }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** Each extension adds about 30 days: from week 5 on a 30-day entry, from week 9 on a 59-day entry. */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const covered = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - covered) / 4));
  }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, options: { note?: string; total?: number; unit?: string; waived?: boolean } = {}): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const unit = options.unit ?? (rule.periodWeeks === 1 ? `${formatPhp(rule.amount)}／周`
        : rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{
        item: rule.name, unitLabel: unit, quantity, total: options.total ?? rule.amount * quantity,
        note: options.note ?? rule.note, ...(options.waived ? { waived: true } : {}),
      }];
    };
    const waived = (id: string, quantity: number): SchoolLocalFee[] =>
      longTerm ? create(id, 0, { note: longTermNote, waived: true }) : create(id, quantity);
    const arp = this.feeRule('arp');
    const arpAmount = arp?.futureEffectiveStart && arp.futureAmount !== undefined && this.entryDate >= arp.futureEffectiveStart
      ? arp.futureAmount : arp?.amount ?? 0;
    const arpQuantity = longTerm || extensions > 0 ? 1 : 0;
    const visaRule = this.feeRule('visa-extension');
    const visaAmounts = visaRule ? this.visaExtensionAmounts(visaRule) : [];
    const visaStart = visaRule ? ((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount) : 0;
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const books = this.feeRule('books');
    return [
      ...waived('ssp', 1),
      ...waived('ssp-e-card', 1),
      ...waived('acr-i-card', extensions > 0 ? 1 : 0),
      ...create('arp', arpQuantity, { total: arpAmount * arpQuantity, unit: `${formatPhp(arpAmount)}／次` }),
      ...create('management', plan.roomWeeks),
      ...create('electricity', plan.roomWeeks),
      ...create('water', plan.roomWeeks),
      ...(longTerm
        ? create('visa-extension', 0, { note: longTermNote, waived: true })
        : create('visa-extension', extensions, { note: visaNote, total: visaAmounts.reduce((sum, amount) => sum + amount, 0), unit: `${formatPhp(visaStart)}起／次` })),
      ...create('books', books ? textbookPeriods(plan.courses, books.periodWeeks ?? 4) : 0),
      ...create('student-id', 1),
    ];
  }

  /** Refundable dormitory deposit: 3,000 pesos up to four weeks, 5,000 from five weeks. */
  get dormDeposit(): number {
    const rule = this.feeRule('deposit');
    if (!rule) return 0;
    return this.quotePlan.roomWeeks >= 5 ? rule.secondaryAmount ?? rule.amount : rule.amount;
  }
}

/** Pickup and the dormitory deposit stay outside the local-fee total; the deposit follows each student's stay. */
function bcebuOptionalFeeItems(pricing: BCebuQuotePricing, students: readonly BCebuPageStudent[], quote: PhSchoolQuote<BCebuPageStudent>): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN');
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      if (rule.id === 'deposit') {
        const total = students.reduce((sum, student) => sum + student.dormDeposit, 0);
        return {
          label: rule.name,
          amount: quote.formatPhp(total),
          cnyAmount: `约人民币 ${cny(total)} 元`,
          note: `${rule.note}${count > 1 ? `（${count}人合计）` : ''}`,
        };
      }
      if (rule.secondaryAmount) {
        return {
          label: rule.name,
          amount: `${quote.formatPhp(rule.amount)}／${rule.secondaryLabel || '其他时间'}${quote.formatPhp(rule.secondaryAmount)}`,
          cnyAmount: `约人民币 ${cny(rule.amount)}／${cny(rule.secondaryAmount)} 元${count > 1 ? '／人' : ''}`,
          note: rule.note,
        };
      }
      const total = rule.amount * (rule.multiplyByStudents ? count : 1);
      return { label: rule.name, amount: quote.formatPhp(total), cnyAmount: `约人民币 ${cny(total)} 元`, note: rule.note };
    });
}

export class BCebuQuote extends PhSchoolQuote<BCebuPageStudent> {
  constructor(pricing: BCebuQuotePricing) {
    super(pricing, {
      createStudent: () => new BCebuPageStudent(pricing),
      headingPrefix: "B'Cebu",
      image: { schoolCode: "B'Cebu", schoolName: "菲律宾宿务B'Cebu语言学校", filePrefix: 'BCEBU', heroSrc: BCEBU_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => bcebuMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: (students, quote) => bcebuOptionalFeeItems(pricing, students, quote),
      // The reporter offer's pay-first, refund-later note must show in full beside the image total.
      expandTotalNote: true,
      layoutVersion: 2,
    });
  }
}

export class BCebuPlanComparison extends PhPlanComparison<BCebuPageStudent> {
  constructor(pricing: BCebuQuotePricing, conditions: () => BCebuPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new BCebuPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.family = from.family;
        to.minorStage = from.minorStage;
      },
      heading: "B'Cebu 方案对比报价",
      courseGroups: BCEBU_COMPARE_COURSE_GROUPS,
      peakRate: () => pricing.seasonalFeePerWeek,
      layoutVersion: 2,
    });
  }
}
