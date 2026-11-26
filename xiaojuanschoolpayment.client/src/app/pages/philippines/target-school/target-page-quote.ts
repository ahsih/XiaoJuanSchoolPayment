// TARGET on the shared Philippine school quote and plan comparison. TARGET's own prices, offers, peak surcharge and
// local fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up
// and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program can
// bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { textbookGroups } from '../school-textbook-estimate';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  TARGET_CAMPAIGN_RULE_ID,
  TARGET_IELTS_COURSE_IDS,
  TARGET_IELTS_GUARANTEE_ID,
  TARGET_NO_CAMPAIGN_RANGES,
  TARGET_PEAK_WAIVER_WEEKS,
  TARGET_RETURNING_RULE_ID,
  TARGET_ROOM_UPGRADES,
  TARGET_SIDA_RULE_ID,
  TARGET_UPGRADE_PATHS,
  TARGET_UPGRADE_RULE_ID,
} from './target-content-config';
import { TARGET_QUOTE_IMAGE_HERO } from './target-page-content';

const DAY = 86400000;
/** A stay longer than this many weeks pays the exit clearance (ECC). */
const ECC_AFTER_WEEKS = 24;

/** Everything TARGET's quote reads; the page component is one. */
export interface TargetQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const TARGET_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL课程', courseIds: ['lite4', 'target4', 'target5', 'target6', 'ultimate8'] },
  { id: 'ielts', label: '雅思课程', courseIds: ['ielts-regular', 'ultimate8', 'target6'] },
  { id: 'working', label: '打工度假', courseIds: ['working-holiday', 'target5', 'target6'] },
] as const;

/**
 * The school's 1/2/3-week columns are 0.4, 0.6 and 0.8 of the four-week price; four weeks and longer are the four-week
 * price ÷ 4 × weeks. The shared plan applies the student's total-weeks tier to every row (the school's rule when a
 * student changes course or room).
 */
export const targetPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

/** The school's textbook steps for one course type: 1 week 500, 2 weeks 1,000, 3–4 weeks 2,000, 5–8 weeks 3,000, then +1,000 every 4 weeks. */
export const targetTextbookFee = (weeks: number): number =>
  weeks <= 0 ? 0 : weeks === 1 ? 500 : weeks === 2 ? 1000 : weeks <= 4 ? 2000 : weeks <= 8 ? 3000 : 3000 + Math.ceil((weeks - 8) / 4) * 1000;

/** School campaign discount per non-peak week: 3 weeks 20, 4–11 weeks 30, 12 weeks and more 35 dollars. */
export const targetCampaignRate = (totalWeeks: number): number =>
  totalWeeks >= 12 ? 35 : totalWeeks >= 4 ? 30 : totalWeeks === 3 ? 20 : 0;

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const formatUsd = (value: number): string => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const roundCents = (value: number): number => Math.round(value * 100) / 100;
const isoDate = (value: number): string => new Date(value).toISOString().slice(0, 10);
const localToday = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const overlaps = (weekStart: number, start: string, end: string): boolean =>
  isoDate(weekStart) <= end && isoDate(weekStart + 6 * DAY) >= start;

/** One TARGET student: plan, conditions and every amount the template and quote image show. */
export class TargetPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  /** The upgrade offer depends on it. */
  selectedRegistrationDate = localToday();

  constructor(private readonly pricing: TargetQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'target4', 'six', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * targetPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
      52,
    );
  }

  minimumWeeks(courseId: string): number {
    return this.pricing.courseFees.find(item => item.id === courseId)?.minimumWeeks ?? 0;
  }

  get courseLengthError(): string {
    const guaranteeWeeks = this.quotePlan.courses
      .filter(row => row.optionId === TARGET_IELTS_GUARANTEE_ID)
      .reduce((sum, row) => sum + row.weeks, 0);
    return guaranteeWeeks > 0 && guaranteeWeeks !== 12 ? 'IELTS 雅思保分班只按12周报名，请选12周。' : '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.selectedRegistrationDate)) return '请选择有效的报名日期。';
    return this.quotePlan.error || this.courseLengthError;
  }

  get minorNote(): string {
    return '学校的学生一般是15岁以上；家长陪同时，6岁以上的孩子可报 LITE 4 或 TARGET 4 亲子课程。独自留学的未成年人（含18岁高中生）每周另付2,000比索安心服务费，门禁22:00，原则上不能单独外出。';
  }

  // ---- weeks ------------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private get courseWeekStarts(): number[] { return this.quotePlan.weekStarts(this.quotePlan.courses); }
  private get totalWeeks(): number { return this.quotePlan.courseWeeks; }

  /** Study weeks inside a published peak range (the calendar's 2027 summer peak). */
  private get peakWeekCount(): number {
    const ranges = this.pricing.peakSeasonRanges.filter(range => range.enabled !== false);
    return this.courseWeekStarts.filter(week => ranges.some(range => overlaps(week, range.start, range.end))).length;
  }

  /** A student whose courses add up to 8 weeks or more pays no surcharge. */
  get peakWaived(): boolean { return this.peakWeekCount > 0 && this.totalWeeks >= TARGET_PEAK_WAIVER_WEEKS; }
  get peakWeeks(): number { return this.peakWaived ? 0 : this.peakWeekCount; }
  get seasonalSurcharge(): number { return roundCents(this.peakWeeks * this.pricing.seasonalFeePerWeek); }

  // ---- offers -----------------------------------------------------------------------------------

  get campaignRate(): number { return this.enabledRule(TARGET_CAMPAIGN_RULE_ID) ? targetCampaignRate(this.totalWeeks) : 0; }
  /** Study weeks outside the peak weeks, the ones the campaign discount counts. */
  get campaignWeeks(): number {
    if (!this.campaignRate) return 0;
    return this.courseWeekStarts.filter(week => !TARGET_NO_CAMPAIGN_RANGES.some(range => overlaps(week, range.start, range.end))).length;
  }
  get campaignDiscount(): number { return roundCents(this.campaignWeeks * this.campaignRate); }

  /** 思达启航 10% on the package and the peak surcharge after the school's campaign discount (user decision 2026-11-26). */
  get sidaDiscount(): number {
    const rule = this.enabledRule(TARGET_SIDA_RULE_ID);
    if (!rule) return 0;
    return roundCents(Math.max(0, this.tuition + this.accommodation + this.seasonalSurcharge - this.campaignDiscount) * rule.discountValue / 100);
  }

  get promotionDiscountTotal(): number { return roundCents(this.campaignDiscount + this.sidaDiscount); }

  get discountNames(): string {
    return [
      this.campaignDiscount > 0 ? this.enabledRule(TARGET_CAMPAIGN_RULE_ID)?.name : '',
      this.sidaDiscount > 0 ? this.enabledRule(TARGET_SIDA_RULE_ID)?.name : '',
      this.upgradeText ? this.enabledRule(TARGET_UPGRADE_RULE_ID)?.name : '',
    ].filter(Boolean).join('、');
  }

  /**
   * 限时尊享升级计划: registration by the deadline, entry in the window, the whole stay on one of TARGET 4/5/6, and
   * 4 weeks and more (course), 8 weeks and more (and room), 12 weeks and more (and a choice); user decision 2026-11-26. Mixed courses never
   * qualify (school notice, November 2026). Returns '' when the student does not qualify.
   */
  get upgradeText(): string {
    const rule = this.enabledRule(TARGET_UPGRADE_RULE_ID);
    if (!rule) return '';
    const registration = this.selectedRegistrationDate;
    const start = this.quotePlan.startDate;
    if (!registration || (rule.registrationEnd && registration > rule.registrationEnd)) return '';
    if (!start || (rule.arrivalStart && start < rule.arrivalStart) || (rule.arrivalEnd && start > rule.arrivalEnd)) return '';
    const courseIds = new Set(this.quotePlan.courses.map(row => row.optionId));
    const [courseId] = [...courseIds];
    if (courseIds.size !== 1 || !TARGET_UPGRADE_PATHS[courseId]) return '';
    const weeks = this.totalWeeks;
    if (weeks < 4) return '';
    const parts = [`免费升1档课程：${TARGET_UPGRADE_PATHS[courseId]}${courseId === 'target6' ? '（雅思须符合学校分级要求，未达到时升ULTIMATE 8）' : ''}`];
    if (weeks >= 8) {
      const room = TARGET_ROOM_UPGRADES[this.quotePlan.rooms[0]?.optionId ?? ''];
      parts.push(room ? `免费升1档房型：${room}（按学校实际空房安排，不保证指定房型）` : '单人房没有更高房型可升');
    }
    if (weeks >= 12) parts.push('另外二选一：最后4周免费升ULTIMATE 8或雅思课程，或免费参加2次TARGET周末旅游');
    return `${parts.join('；')}。名额有限、额满即止，以学校确认为准`;
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    if (this.returningStudent && this.enabledRule(TARGET_RETURNING_RULE_ID)) return 0;
    return this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get quoteUsd(): number {
    return Math.max(0, roundCents(this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    const rate = this.pricing.seasonalFeePerWeek;
    if (this.seasonalSurcharge > 0) {
      lines.push({ icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge, note: `${this.peakWeeks}周在2027/06/27–08/14旺季，每周${formatUsd(rate)}美元；读满${TARGET_PEAK_WAIVER_WEEKS}周免收` });
    } else if (this.peakWaived) {
      lines.push({ icon: '旺', label: '旺季附加费', value: 0, note: `${this.peakWeekCount}周在2027/06/27–08/14旺季；读满${TARGET_PEAK_WAIVER_WEEKS}周免收附加费，但旺季的周没有学校长期优惠` });
    }
    const campaign = this.enabledRule(TARGET_CAMPAIGN_RULE_ID);
    if (campaign && this.campaignDiscount > 0) {
      const peakWeeks = this.totalWeeks - this.campaignWeeks;
      lines.push({
        icon: '惠', label: campaign.name, value: -this.campaignDiscount, promotionKey: campaign.id,
        note: `读${this.totalWeeks}周，每周减${this.campaignRate}美元 × ${this.campaignWeeks}周${peakWeeks > 0 ? `（${peakWeeks}个旺季周不减）` : ''}`,
      });
    }
    const sida = this.enabledRule(TARGET_SIDA_RULE_ID);
    if (sida && this.sidaDiscount > 0) {
      lines.push({ icon: '折', label: sida.name, value: -this.sidaDiscount, promotionKey: sida.id, note: sida.description });
    }
    const upgrade = this.upgradeText;
    const upgradeRule = this.enabledRule(TARGET_UPGRADE_RULE_ID);
    if (upgrade && upgradeRule) {
      lines.push({ icon: '升', label: `${upgradeRule.name}（免费）`, value: 0, promotionKey: upgradeRule.id, note: upgrade });
    }
    return lines;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension for every started 30 days beyond the entry visa (user rule for every Philippine school). */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  /** Extension amounts in order; past the school's table each further extension repeats its last step (estimate). */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  private get visaBeyondTable(): boolean {
    const rule = this.rule('visa');
    const sequence = (this.visaType === 'tourist59' ? rule?.tourist59Rates ?? rule?.rates : rule?.rates) ?? [];
    return this.visaExtensionCount > sequence.length;
  }

  private get textbookTotal(): number {
    return textbookGroups(this.quotePlan.courses, id => TARGET_IELTS_COURSE_IDS.includes(id) ? 'ielts' : 'esl')
      .reduce((sum, group) => sum + targetTextbookFee(group.weeks), 0);
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
    const visaRule = this.rule('visa');
    const visaTotal = visaRule ? this.visaExtensionAmounts(visaRule).reduce((sum, amount) => sum + amount, 0) : 0;
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}${this.visaBeyondTable ? '（超出学校价目表的续签暂按最后一档5,800比索预估，须学校确认）' : ''}；${visaRule?.note ?? ''}`;
    const ecc = !longTerm && plan.stayWeeks > ECC_AFTER_WEEKS ? 1 : 0;
    const books = this.textbookTotal;
    return [
      ...create('visa', extensions, visaNote, visaTotal, '按学校续签表'),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('ssp-e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('ecc', ecc, longTerm ? longTermNote : undefined),
      ...create('books', books > 0 ? 1 : 0, undefined, books, '按学习周数'),
      ...create('electricity', plan.roomWeeks),
      ...create('water', plan.roomWeeks),
      ...create('management', plan.roomWeeks),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

export class TargetQuote extends PhSchoolQuote<TargetPageStudent> {
  constructor(pricing: TargetQuotePricing) {
    super(pricing, {
      createStudent: () => new TargetPageStudent(pricing),
      headingPrefix: 'TARGET',
      image: { schoolCode: 'TARGET', schoolName: '菲律宾宿务TARGET Global English Academy', filePrefix: 'TARGET', heroSrc: TARGET_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => targetPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      layoutVersion: 2,
    });
  }

  protected override get registrationBaseNote(): string { return '一次性费用，复课生免收'; }
}

export class TargetPlanComparison extends PhPlanComparison<TargetPageStudent> {
  constructor(pricing: TargetQuotePricing, conditions: () => TargetPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new TargetPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: 'TARGET 方案对比报价',
      courseGroups: TARGET_COMPARE_COURSE_GROUPS,
      peakRate: () => pricing.seasonalFeePerWeek,
      extraNotes: () => ['课程价含课程和校内住宿；2027/06/27–08/14旺季每周加40美元，读满8周免收，旺季的周没有学校长期优惠。'],
      layoutVersion: 2,
    });
  }
}
