// Winning English Academy on the shared Philippine school quote and plan comparison, one campus per page. The school's
// prices, the Ayala grand-opening offer, the 思达启航 discount, the 2027 CALA peak and local fees are calculated here per
// student; the template's PhSchoolQuote and PhPlanComparison only add students up and lay out the result. The page's
// course and room lists are already limited to its campus (winningCampusContent). Keep this file free of Angular, DOM
// and storage access, so the WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import { WINNING_AYALA_OFFER_RULE_ID, WINNING_RETURNING_RULE_ID, WINNING_SIDA_RULE_ID } from './winning-content-config';
import { WINNING_PAGE_CONTENT } from './winning-page-content';
import {
  WINNING_CAMPUS_LABELS,
  WINNING_CAMPUS_NAMES,
  WINNING_CHILD_COURSE_IDS,
  WINNING_COURSE_FEES,
  WINNING_OCEAN_PAUSE,
  WINNING_OFFER_BLACKOUTS,
  WINNING_ROOM_FEES,
  WINNING_UPGRADES,
  winningBookFee,
  type WinningCampus,
} from './winning-pricing';

const DAY = 86400000;

/** Everything Winning's quote reads; the page component is one. */
export interface WinningQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const WINNING_COMPARE_COURSE_GROUPS: Readonly<Record<WinningCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>>> = {
  ayala: [
    { id: 'esl', label: 'ESL／口语', courseIds: ['esl2', 'esl4', 'ps6', 'sf8'] },
    { id: 'ielts', label: '雅思', courseIds: ['pre-ielts', 'ielts'] },
    { id: 'toeic', label: '托业', courseIds: ['pre-toeic', 'toeic'] },
    { id: 'special', label: '商务／旅游', courseIds: ['business', 'travel', 'esl4'] },
  ],
  ocean: [
    { id: 'esl', label: 'ESL／口语', courseIds: ['esl2', 'esl4', 'ps6', 'sf8'] },
    { id: 'travel', label: '旅游英语', courseIds: ['travel', 'esl4'] },
  ],
};

/** Price ratio of a 1–3 week row (40/60/80%); four weeks and longer are proportional. */
export const winningPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const roundCents = (value: number): number => Math.round(value * 100) / 100;
const time = (iso: string) => Date.parse(`${iso}T00:00:00Z`);

/** Today in China time, as the default registration date. */
export const winningToday = (now = new Date()): string => new Date(now.getTime() + 8 * 3600000).toISOString().slice(0, 10);

/** Next Sunday; at Ocean the first Sunday after the school's November–December 2026 pause (2027-01-03). */
export const winningDefaultStart = (campus: WinningCampus, now = new Date()): string => {
  const next = nextQuoteSunday(now);
  return campus === 'ocean' && next <= WINNING_OCEAN_PAUSE.end ? '2027-01-03' : next;
};

/** One Winning student: plan, conditions and every amount the template and quote image show. */
export class WinningPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** Ayala only: the grand-opening offer needs registration within 2026. */
  selectedRegistrationDate?: string;

  constructor(private readonly pricing: WinningQuotePricing, readonly campus: WinningCampus, today = winningToday()) {
    if (campus === 'ayala') this.selectedRegistrationDate = today;
    this.quotePlan = new SchoolQuotePlan(
      'esl4', campus === 'ayala' ? 'cqh-2p' : 'ocean-2p', winningDefaultStart(campus), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.listPrice(kind === 'course' ? row.optionId : '', kind === 'room' ? row.optionId : '', row.weeks),
    );
  }

  /** List price of a course or room over some weeks (short stays 40/60/80%). */
  private listPrice(courseId: string, roomId: string, weeks: number): number {
    const base = courseId
      ? this.pricing.courseFees.find(item => item.id === courseId)?.tuition2027
      : this.pricing.roomFees.find(item => item.id === roomId)?.fee;
    return (base ?? 0) * winningPriceMultiplier(weeks, this.pricing.shortTermPriceRatios);
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
    const child = this.quotePlan.courses.find(row => WINNING_CHILD_COURSE_IDS.includes(row.optionId));
    if (child && this.selectedAgeGroup === 'adult') return `${this.courseName(child.optionId)}是儿童课程，请把年龄段改为“未满18岁”。`;
    for (const row of this.quotePlan.rooms) {
      const minimum = WINNING_ROOM_FEES.find(item => item.id === row.optionId)?.minimumWeeks ?? 0;
      const weeks = this.quotePlan.rooms.filter(item => item.optionId === row.optionId).reduce((sum, item) => sum + item.weeks, 0);
      if (minimum && weeks < minimum) return 'Lyf Hotel至少要住2周，请把住宿改为2周以上。';
    }
    return '';
  }

  /** Ocean takes no arrivals in November and December 2026 (school table); Ayala and Ocean are billed apart. */
  get pauseError(): string {
    if (this.campus !== 'ocean') return '';
    const start = this.quotePlan.startDate;
    return start && start >= WINNING_OCEAN_PAUSE.start && start <= WINNING_OCEAN_PAUSE.end
      ? 'Ocean校区暂停2026年11–12月的报名，请选2027年的入学日期，或看Ayala校区。' : '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.campus === 'ayala' && this.quotePlan.date(this.selectedRegistrationDate ?? '') === null) return '请选择有效的报名日期。';
    return this.quotePlan.error || this.courseLengthError || this.pauseError;
  }

  get minorNote(): string {
    return '未满18岁的学生没有家长允许或陪同，任何时间都不能离开校园，21:00至次日07:00不能离开房间（学生手册）。6–17岁读JEP、6岁以下读幼儿英语，陪读家长可报监护人课程；一家人可用多人报价一起算。';
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Share of a row's weeks outside the offer's peak blackouts (Monday to Friday of each week). */
  private offPeakShare(row: QuotePlanRow): number {
    const weeks = this.quotePlan.weekStarts([row]);
    if (!weeks.length) return 0;
    const peak = weeks.filter(start => WINNING_OFFER_BLACKOUTS.some(range =>
      start + DAY <= time(range.end) && start + 5 * DAY >= time(range.start))).length;
    return (weeks.length - peak) / weeks.length;
  }

  private get openingOffer(): CiaPromotionRule | undefined {
    const rule = this.enabledRule(WINNING_AYALA_OFFER_RULE_ID);
    const date = this.selectedRegistrationDate ?? '';
    if (!rule || this.campus !== 'ayala' || !date) return undefined;
    if (rule.registrationEnd && date > rule.registrationEnd) return undefined;
    return rule;
  }

  /** Free upgrade: an ESL or IELTS row of 4+ weeks pays the next lower level's price for its off-peak weeks. */
  get upgradeDiscount(): number {
    if (!this.openingOffer) return 0;
    return roundCents(this.quotePlan.courses.reduce((sum, row) => {
      const lower = WINNING_UPGRADES[row.optionId];
      if (!lower || row.weeks < 4) return sum;
      const gap = this.listPrice(row.optionId, '', row.weeks) - this.listPrice(lower, '', row.weeks);
      return sum + Math.max(0, gap) * this.offPeakShare(row);
    }, 0));
  }

  /** 15% off tuition (after the upgrade) and room for the off-peak weeks. */
  get openingDiscount(): number {
    const rule = this.openingOffer;
    if (!rule) return 0;
    const rows = [...this.quotePlan.courses.map(row => ({ row, kind: 'course' as const })), ...this.quotePlan.rooms.map(row => ({ row, kind: 'room' as const }))];
    const base = rows.reduce((sum, { row, kind }) => {
      const price = kind === 'course' ? this.listPrice(row.optionId, '', row.weeks) : this.listPrice('', row.optionId, row.weeks);
      return sum + price * this.offPeakShare(row);
    }, 0) - this.upgradeDiscount;
    return roundCents(Math.max(0, base) * rule.discountValue / 100);
  }

  /** 思达启航 5% on tuition and room after the school's offer. */
  get sidaDiscount(): number {
    const rule = this.enabledRule(WINNING_SIDA_RULE_ID);
    if (!rule) return 0;
    const base = this.tuition + this.accommodation - this.upgradeDiscount - this.openingDiscount;
    return roundCents(Math.max(0, base) * rule.discountValue / 100);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; label: string; note: string; icon: string }> {
    const applied: Array<{ rule: CiaPromotionRule; amount: number; label: string; note: string; icon: string }> = [];
    const opening = this.openingOffer;
    if (opening && this.upgradeDiscount > 0) {
      applied.push({ rule: opening, amount: this.upgradeDiscount, label: '免费升级课程', icon: '升',
        note: this.quotePlan.courses.filter(row => WINNING_UPGRADES[row.optionId] && row.weeks >= 4)
          .map(row => `${this.courseName(row.optionId)}按${this.courseName(WINNING_UPGRADES[row.optionId])}的价格`).join('；') + '（只计淡季周）' });
    }
    if (opening && this.openingDiscount > 0) {
      applied.push({ rule: opening, amount: this.openingDiscount, label: 'Ayala开业淡季85折', icon: '惠',
        note: '2026年内报名，淡季周的课程费和食宿费85折；寒暑假旺季周不打折' });
    }
    const sida = this.enabledRule(WINNING_SIDA_RULE_ID);
    if (sida && this.sidaDiscount > 0) applied.push({ rule: sida, amount: this.sidaDiscount, label: sida.name, icon: '折', note: sida.description });
    return applied;
  }

  get promotionDiscountTotal(): number {
    return roundCents(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.label))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && this.enabledRule(WINNING_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  private get peakCalculation() {
    return calculateAssociationPeakSurcharge(
      'WINNING',
      this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]),
      this.pricing.peakSeasonRanges.filter(range => range.enabled),
      this.pricing.seasonalFeePerWeek,
    );
  }

  get peakWeeks(): number { return this.peakCalculation.weeks; }
  get seasonalSurcharge(): number { return this.peakCalculation.total; }

  get quoteUsd(): number {
    return Math.max(0, roundCents(this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal + this.seasonalSurcharge));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const peak = this.peakCalculation;
    return [
      ...this.appliedPromotions.map(item => ({
        icon: item.icon, label: item.label, value: -item.amount, note: item.note, promotionKey: `${item.rule.id}-${item.icon}`,
      })),
      ...(this.seasonalSurcharge ? [{
        icon: '暑', label: '暑假旺季附加费', value: this.seasonalSurcharge,
        note: `${this.pricing.peakSeasonRanges.filter(range => range.enabled).map(range => range.label).join('、')}；${associationPeakBreakdownText(peak)}；同一周课程与住宿只计一次，不参与优惠`,
      }] : []),
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

  /** Material fee per course: the school's table by the course's total weeks. */
  private get bookFees(): number[] {
    const weeks = new Map<string, number>();
    for (const row of this.quotePlan.courses) weeks.set(row.optionId, (weeks.get(row.optionId) ?? 0) + row.weeks);
    return [...weeks.entries()].map(([id, total]) =>
      winningBookFee(WINNING_COURSE_FEES.find(item => item.id === id)?.books ?? [], total));
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
    const sequence = visaRule ? (this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates) ?? [visaRule.amount] : [];
    const visaTotal = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0)
      .reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const books = this.bookFees;
    const firstExtension = !longTerm && extensions > 0 ? 1 : 0;
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, sequence.length ? `${formatPhp(sequence[0])}起／次` : undefined),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('student-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', firstExtension, longTerm ? longTermNote : undefined),
      ...create('utilities', plan.roomWeeks),
      ...create('management', plan.roomWeeks),
      ...create('books', books.length, undefined, books.reduce((sum, amount) => sum + amount, 0), '按课程和周数'),
      ...create('student-id', 1),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

/** Deposit, pickup and laundry, outside the local-fee total. */
function winningOptionalFees(pricing: WinningQuotePricing, students: readonly WinningPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  const group = count > 1 ? `（${count}人）` : '';
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const total = rule.multiplyByStudents ? rule.amount * count : rule.amount;
      return { label: rule.name, amount: formatPhp(total), cnyAmount: cny(total), note: `${rule.note}${rule.multiplyByStudents ? group : ''}` };
    });
}

export class WinningQuote extends PhSchoolQuote<WinningPageStudent> {
  constructor(pricing: WinningQuotePricing, campus: WinningCampus) {
    super(pricing, {
      createStudent: () => new WinningPageStudent(pricing, campus),
      headingPrefix: WINNING_CAMPUS_NAMES[campus],
      image: {
        schoolCode: 'WINNING',
        schoolName: `菲律宾宿务${WINNING_CAMPUS_LABELS[campus]}`,
        filePrefix: campus === 'ayala' ? 'Winning-Ayala' : 'Winning-Ocean',
        heroSrc: WINNING_PAGE_CONTENT[campus].quoteImageHero,
      },
      priceMultiplier: weeks => winningPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => winningOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class WinningPlanComparison extends PhPlanComparison<WinningPageStudent> {
  private courseSource?: WinningQuotePricing['courseFees'];
  private comparable: WinningQuotePricing['courseFees'] = [];

  constructor(private readonly winningPricing: WinningQuotePricing, campus: WinningCampus, conditions: () => WinningPageStudent) {
    super(winningPricing, conditions, {
      createStudent: () => new WinningPageStudent(winningPricing, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: `${WINNING_CAMPUS_NAMES[campus]} 方案对比报价`,
      courseGroups: WINNING_COMPARE_COURSE_GROUPS[campus],
      peakRate: () => 60,
      layoutVersion: 2,
    });
  }

  /** Children's courses are priced for a family together, so plans compare the other courses only. */
  override get courseOptions(): WinningQuotePricing['courseFees'] {
    if (this.courseSource !== this.winningPricing.courseFees) {
      this.courseSource = this.winningPricing.courseFees;
      this.comparable = (this.winningPricing.courseFees ?? []).filter(item => !WINNING_CHILD_COURSE_IDS.includes(item.id) && item.id !== 'guardian');
    }
    return this.comparable;
  }
}
