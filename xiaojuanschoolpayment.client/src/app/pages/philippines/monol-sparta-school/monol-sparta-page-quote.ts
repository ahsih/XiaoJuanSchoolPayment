// MONOL Sparta on the shared Philippine school quote and plan comparison. MONOL Sparta's own prices, offers, visa
// sequences and pickup choices are calculated here per student; the template's PhSchoolQuote and PhPlanComparison
// only add students up and lay out the result. Never use MONOL main-campus prices or rules here. Keep this file
// free of Angular, DOM and storage access, so the WeChat mini program can bundle it later.
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { QuoteImageCardData } from '../../../components/quote-image-types';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { MONOL_SPARTA_QUOTE_IMAGE_HERO } from './monol-sparta-page-content';

/** Everything MONOL Sparta's quote reads; the page component is one. */
export interface MonolSpartaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

/** China tourist visas from the handbook, and the Hong Kong and Macau visa-free stays from the school's visa sheet. */
export const MONOL_SPARTA_VISA_OPTIONS = [
  { value: 'tourist59', label: '中国护照（59天旅游签证）' },
  { value: 'tourist30', label: '中国护照（30天旅游签证）' },
  { value: 'hongkong14', label: '香港特区护照（免签停留14天）' },
  { value: 'macau7', label: '澳门特区护照（免签停留7天）' },
] as const;

export type MonolSpartaPickup = 'none' | 'manila-group' | 'clark-group' | 'manila-special' | 'clark-special';

const PICKUP_OPTIONS: ReadonlyArray<{ value: MonolSpartaPickup; label: string }> = [
  { value: 'manila-group', label: '马尼拉机场团体接机' },
  { value: 'clark-group', label: '克拉克机场团体接机' },
  { value: 'manila-special', label: '马尼拉机场个人接机（单独派车）' },
  { value: 'clark-special', label: '克拉克机场个人接机（单独派车）' },
  { value: 'none', label: '不需要接机' },
];
const PICKUP_RULE_IDS: Record<MonolSpartaPickup, string> = {
  none: '', 'manila-group': 'manila-group-pickup', 'clark-group': 'clark-group-pickup',
  'manila-special': 'manila-special-pickup', 'clark-special': 'clark-special-pickup',
};
const SNS_OPTIONS: ReadonlyArray<{ value: boolean; label: string }> = [
  { value: false, label: '不参加' },
  { value: true, label: '参加（每满4周再减100美元）' },
];

export const MONOL_SPARTA_COURSE_RULE_ID = 'sparta-course-2026';
export const MONOL_SPARTA_ROOM_RULE_ID = 'sparta-room-2026';
export const MONOL_SPARTA_SNS_RULE_ID = 'sparta-sns-2026';

/** Both courses are compared against each other. */
export const MONOL_SPARTA_COMPARE_COURSE_GROUPS = [
  { id: 'all', label: 'ESL／雅思', courseIds: ['booster-esl', 'master-ielts'] },
] as const;

/** The Hong Kong and Macau sheet: a first short extension, then the 30-day sequence. */
const VISA_FREE_FIRST_EXTENSION = 2460;
/** Stay over 59 days: the TVV ACR I-CARD reference applies. */
const TVV_ACR_MIN_WEEKS = 9;

const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const formatPhp = (value: number) => `${Math.round(value).toLocaleString('en-US')} 比索`;

/** Extensions a stay of this many weeks needs, by passport and entry visa (handbook and visa sheet). */
export function monolSpartaVisaExtensions(visaType: string, weeks: number): number {
  const after = (threshold: number) => Math.max(0, Math.ceil((weeks - threshold) / 4));
  if (visaType === 'tourist30') return weeks <= 4 ? 0 : 1 + after(8);
  if (visaType === 'tourist59') return after(8);
  const visaFreeWeeks = visaType === 'macau7' ? 1 : 2;
  if (weeks <= visaFreeWeeks) return 0;
  if (weeks === visaFreeWeeks + 1) return 1;
  return 2 + after(8);
}

/** One MONOL Sparta student: plan, conditions and every amount the template and quote image show. */
export class MonolSpartaPageStudent implements PhPageStudent {
  readonly visaOptions = MONOL_SPARTA_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  /** Registration fee is waived for everyone, so new or returning changes nothing here. */
  returningStudent = false;
  /** The 2026 offers need registration by 2026/12/31. */
  selectedRegistrationDate = localToday();
  pickup: MonolSpartaPickup = 'manila-group';
  snsSelected = false;
  readonly extraChoices: readonly PhExtraChoice[];
  readonly courseLengthError = '';

  constructor(private readonly pricing: MonolSpartaQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'booster-esl', 'triple-room', nextQuoteSunday(), [],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * row.weeks / 4;
      },
    );
    const student = this;
    const pickup: PhExtraChoice = {
      label: '接机',
      options: PICKUP_OPTIONS,
      visible: true,
      get note() { return student.pickupNote; },
      get value() { return student.pickup; },
      set value(value: unknown) { student.pickup = value as MonolSpartaPickup; },
    };
    const sns: PhExtraChoice = {
      label: 'SNS活动',
      options: SNS_OPTIONS,
      get visible() { return student.snsAvailable; },
      get note() {
        return student.snsSelected
          ? '每满4周在小红书、TikTok、Instagram等平台发1条在校动态；学校可能随时结束活动，报名前由顾问向学校确认。'
          : '';
      },
      get value() { return student.snsSelected; },
      set value(value: unknown) { student.snsSelected = value === true; },
    };
    this.extraChoices = [pickup, sns];
  }

  /** Both courses can be quoted from four weeks; 1–3 weeks are quoted by the school. */
  minimumWeeks(): number { return 4; }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的护照／签证类型。';
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日。';
    return this.quotePlan.error;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private registrationMatches(rule: CiaPromotionRule): boolean {
    const registration = this.selectedRegistrationDate;
    if (this.quotePlan.date(registration) === null) return false;
    if (rule.registrationStart && registration < rule.registrationStart) return false;
    return !rule.registrationEnd || registration <= rule.registrationEnd;
  }

  /** Study weeks the student also lives on campus; a split course or room still counts all its weeks together. */
  get studyAndStayWeeks(): number {
    const roomWeeks = new Set(this.quotePlan.weekStarts(this.quotePlan.rooms));
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(week => roomWeeks.has(week)).length;
  }

  /** Complete four-week blocks an offer counts. */
  blocks(rule: CiaPromotionRule | undefined): number {
    if (!rule || !this.registrationMatches(rule)) return 0;
    return Math.floor(this.studyAndStayWeeks / 4);
  }

  get snsAvailable(): boolean {
    const rule = this.rule(MONOL_SPARTA_SNS_RULE_ID);
    return !!rule && this.registrationMatches(rule);
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; blocks: number }> {
    const ids = [MONOL_SPARTA_COURSE_RULE_ID, MONOL_SPARTA_ROOM_RULE_ID, ...(this.snsSelected ? [MONOL_SPARTA_SNS_RULE_ID] : [])];
    return ids
      .map(id => this.rule(id))
      .filter((rule): rule is CiaPromotionRule => !!rule)
      .map(rule => {
        const blocks = this.blocks(rule);
        const cap = rule.appliesTo === 'tuition' ? this.tuition : rule.appliesTo === 'accommodation' ? this.accommodation : this.tuition + this.accommodation;
        return { rule, blocks, amount: Math.min(cap, blocks * rule.discountValue) };
      })
      .filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return this.appliedPromotions.map(item => item.rule.name).join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  /** The school's 100-dollar registration fee is waived for every student who enrols through 思达启航. */
  readonly registration = 0;
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  private get peak() {
    const weeks = this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]);
    return calculateAssociationPeakSurcharge('MONOL-SPARTA', weeks, this.pricing.peakSeasonRanges, this.pricing.seasonalFeePerWeek);
  }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }

  get quoteUsd(): number {
    return Math.max(0, round(this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...this.appliedPromotions.map(({ rule, amount, blocks }) => ({
        icon: '惠',
        label: rule.name,
        value: -amount,
        note: `${rule.description}；本次${blocks}个4周`,
        promotionKey: rule.id,
      })),
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '暑期旺季附加费', value: this.seasonalSurcharge,
        note: `学习或住宿周与暑期旺季重叠：${associationPeakBreakdownText(this.peak)}；同一周课程和住宿只算一次，不参与优惠`,
      }] : []),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未满18岁的学生请先告诉顾问，由顾问向学校确认入学条件和监护安排。';
  }

  private get pickupNote(): string {
    const rule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    if (!rule) return this.pickup === 'none' ? '自行到校，请提前告诉顾问到校时间。' : '';
    return rule.includeInTotal
      ? `${formatPhp(rule.amount)}／人，计入到校学杂费；按学校团体接机班次。`
      : `整车${formatPhp(rule.amount)}，另列在到校学杂费下方，不计入合计。`;
  }

  // ---- local fees -------------------------------------------------------------------------------

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return id ? this.pricing.localFeeRules.find(item => item.id === id && item.enabled) : undefined;
  }

  get visaExtensionCount(): number { return monolSpartaVisaExtensions(this.visaType, this.quotePlan.stayWeeks); }

  /** Extension amounts in order: a 59-day entry has its own sequence; Hong Kong and Macau start with a short step. */
  private visaSequence(rule: CiaLocalFeeRule): number[] {
    const thirty = rule.rates?.length ? rule.rates : [rule.amount];
    if (this.visaType === 'tourist59') return rule.tourist59Rates?.length ? rule.tourist59Rates : thirty;
    if (this.visaType === 'tourist30') return thirty;
    return [VISA_FREE_FIRST_EXTENSION, ...thirty];
  }

  get needsTvvAcr(): boolean { return this.quotePlan.stayWeeks >= TVV_ACR_MIN_WEEKS; }

  get selectedSpecialPickup(): CiaLocalFeeRule | undefined {
    const rule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    return rule && !rule.includeInTotal ? rule : undefined;
  }

  get localFees(): SchoolLocalFee[] {
    const once = (id: string, quantity = 1): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      return rule ? [{ item: rule.name, unitLabel: `${formatPhp(rule.amount)}／次`, quantity, total: rule.amount * quantity, note: rule.note }] : [];
    };
    const visaRule = this.feeRule('visa-extension');
    const visa: SchoolLocalFee[] = [];
    if (visaRule) {
      const count = this.visaExtensionCount;
      const sequence = this.visaSequence(visaRule);
      const total = Array.from({ length: count }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0).reduce((sum, amount) => sum + amount, 0);
      visa.push({
        item: visaRule.name,
        unitLabel: `${formatPhp(sequence[0] ?? visaRule.amount)}起／次`,
        quantity: count,
        total,
        note: `按${this.visaLabel}、${this.quotePlan.stayWeeks}周停留预估，${count ? `本次${count}次` : '本次无需延签'}；${visaRule.note}`,
      });
    }
    const pickupRule = this.feeRule(PICKUP_RULE_IDS[this.pickup]);
    return [
      ...once('ssp'),
      ...once('ssp-acr'),
      ...visa,
      ...(pickupRule?.includeInTotal ? [{ item: pickupRule.name, unitLabel: `${formatPhp(pickupRule.amount)}／人`, quantity: 1, total: pickupRule.amount, note: pickupRule.note }] : []),
    ];
  }
}

/** Deposit, the TVV ACR reference and a chosen individual pickup: listed under the local fees, never in the total. */
function monolSpartaOptionalFees(
  pricing: MonolSpartaQuotePricing, students: readonly MonolSpartaPageStudent[], quote: PhSchoolQuote<MonolSpartaPageStudent>,
): PhOptionalFeeItem[] {
  const rule = (id: string) => pricing.localFeeRules.find(item => item.id === id && item.enabled);
  const count = students.length;
  const group = count > 1;
  const label = (indexes: number[]) => indexes.map(index => `学生${index + 1}`).join('、');
  const cny = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value), 'zh-CN')} 元`;
  const items: PhOptionalFeeItem[] = [];
  const deposit = rule('security-deposit');
  if (deposit) {
    const total = deposit.amount * count;
    items.push({
      label: deposit.name,
      amount: deposit.currency === 'USD' ? `${quote.formatUsd(total)} 美元` : quote.formatPhp(total),
      cnyAmount: cny(deposit.currency === 'USD' ? total * pricing.usdToCny : total / pricing.phpPerCny),
      note: `${deposit.note}${group ? `（${count}人）` : ''}`,
    });
  }
  const tvv = rule('tvv-acr');
  const tvvStudents = students.map((student, index) => student.needsTvvAcr ? index : -1).filter(index => index >= 0);
  if (tvv && tvvStudents.length) {
    items.push({
      label: tvv.name, amount: quote.formatPhp(tvv.amount), cnyAmount: cny(tvv.amount / pricing.phpPerCny),
      note: `${tvv.note}${group ? `（${label(tvvStudents)}）` : ''}`,
    });
  }
  for (const id of ['manila-special-pickup', 'clark-special-pickup']) {
    const pickup = rule(id);
    const chosen = students.map((student, index) => student.selectedSpecialPickup?.id === id ? index : -1).filter(index => index >= 0);
    if (!pickup || !chosen.length) continue;
    items.push({
      label: pickup.name, amount: quote.formatPhp(pickup.amount), cnyAmount: cny(pickup.amount / pricing.phpPerCny),
      note: `${pickup.note}${group ? `（${label(chosen)}）` : ''}`,
    });
  }
  return items;
}

export class MonolSpartaQuote extends PhSchoolQuote<MonolSpartaPageStudent> {
  constructor(pricing: MonolSpartaQuotePricing) {
    super(pricing, {
      createStudent: () => new MonolSpartaPageStudent(pricing),
      headingPrefix: 'MONOL斯巴达校区',
      image: { schoolCode: 'MONOL-SPARTA', schoolName: '菲律宾碧瑶MONOL斯巴达校区', filePrefix: 'MONOL-Sparta', heroSrc: MONOL_SPARTA_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => weeks / 4,
      optionalFeeItems: (students, quote) => monolSpartaOptionalFees(pricing, students, quote),
      layoutVersion: 2,
    });
  }

  /** Everyone is free of the school's registration fee, so the standard returning-student line is left out. */
  override get registrationNote(): string {
    const fee = this.formatUsd(this.pricing.registrationFee);
    const people = this.quoteMode === 'group' ? `，本次${this.activeStudents.length}人全部免收` : '';
    return `学校原价${fee}美元／人，通过思达启航报名免收${people}`;
  }

  /** MONOL Sparta has only a few local-fee rows, so the image drops the empty space under them. */
  override get quoteImageData(): QuoteImageCardData {
    return { ...super.quoteImageData, compactDetailedSections: true };
  }
}

export class MonolSpartaPlanComparison extends PhPlanComparison<MonolSpartaPageStudent> {
  constructor(pricing: MonolSpartaQuotePricing, conditions: () => MonolSpartaPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new MonolSpartaPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
        to.pickup = from.pickup;
        to.snsSelected = from.snsSelected;
      },
      heading: 'MONOL斯巴达校区 方案对比报价',
      courseGroups: MONOL_SPARTA_COMPARE_COURSE_GROUPS,
      layoutVersion: 2,
    });
  }
}
