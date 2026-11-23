// CIP English Kepos on the shared Philippine school quote and plan comparison. CIP's own prices, offers, course
// rules and local fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add
// students up and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini
// program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { QuoteImageCardData, QuoteImagePaymentItem } from '../../../components/quote-image-types';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolPaymentItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  CIP_COURSE_RULES,
  CIP_DORM_ROOM_IDS,
  CIP_HOTEL_ROOM_IDS,
  CIP_LONG_STAY_RULE_ID,
  CIP_LONG_STAY_TIERS,
  CIP_OFF_SEASON_RULE_ID,
  CIP_PEAK_MONTHS,
  CIP_RETURNING_RULE_ID,
  CIP_USD_FROM,
  type CipMinorBand,
} from './cip-content-config';
import { CIP_QUOTE_IMAGE_HERO } from './cip-page-content';

const DAY = 86400000;

/** Everything CIP's quote reads; the page component is one. */
export interface CipQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CIP_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '综合英语', courseIds: ['regular-esl', 'power-esl', 'native-esl', 'intensive-esl'] },
  { id: 'speaking', label: '口语强化', courseIds: ['speaking-master', 'native-master', 'power-esl'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-basic', 'ielts-intensive', 'ielts-native'] },
  { id: 'light', label: '轻量课程', courseIds: ['light-esl', 'premium-native-light'] },
] as const;

/** Price ratio of a 1–3 week row (40/65/85%); four weeks and longer are proportional. */
export const cipPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

/**
 * A course's 4-week rate for a student taking it for totalWeeks in all: a whole-course price for that length
 * (IELTS Guarantee 12 weeks, 3,600) gives its own rate; otherwise the list price.
 */
export const cipCourseRate = (fee: CiaQuoteCourse, totalWeeks: number): number => {
  const whole = fee.feeByWeeks?.[String(totalWeeks)];
  return whole ? whole / totalWeeks * 4 : fee.tuition2027;
};

/** The first Sunday the page quotes: next Sunday, but never before the first dollar-priced week. */
export const cipDefaultStart = (now = new Date()): string => {
  const next = nextQuoteSunday(now);
  return next < CIP_USD_FROM ? CIP_USD_FROM : next;
};

const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const monthOf = (time: number): number => new Date(time).getUTCMonth() + 1;

export const CIP_MINOR_BANDS: ReadonlyArray<{ value: CipMinorBand; label: string; courses: string }> = [
  { value: 'primary', label: '7–11岁', courses: '只能报 Primary English 儿童英语' },
  { value: 'junior', label: '12–15岁', courses: '只能报 Junior ESL 或 Junior Native 青少年课程' },
  { value: 'senior', label: '16–17岁', courses: '只能报全斯巴达课程（Intensive ESL 和雅思课程），不能报半斯巴达、轻量和短期课程' },
];

export const CIP_OFF_SEASON_GIFT = '任选1项：1节菲律宾老师一对一升级为外籍老师一对一，或每天加1节菲律宾老师一对一，或付双人间价格住单人间A（视空房）；另送克拉克机场接机';

/** One CIP student: plan, conditions and every amount the template and quote image show. */
export class CipPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  minorBand: CipMinorBand = 'junior';
  returningStudent = false;
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly pricing: CipQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'regular-esl', 'double', cipDefaultStart(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => {
        const course = kind === 'course' ? pricing.courseFees.find(item => item.id === row.optionId) : undefined;
        const base = course
          ? cipCourseRate(course, this.weeksOfCourse(course.id))
          : pricing.roomFees.find(item => item.id === row.optionId)?.fee;
        return (base ?? 0) * cipPriceMultiplier(row.weeks, pricing.shortTermPriceRatios);
      },
    );
    const student = this;
    const bandChoice: PhExtraChoice & { value: CipMinorBand } = {
      label: '抵达时年龄',
      options: CIP_MINOR_BANDS.map(band => ({ value: band.value, label: band.label })),
      get visible() { return student.selectedAgeGroup === 'minor'; },
      get note() { return `${CIP_MINOR_BANDS.find(band => band.value === student.minorBand)?.courses ?? ''}。`; },
      get value() { return student.minorBand; },
      set value(value: CipMinorBand) { student.minorBand = value; },
    };
    this.extraChoices = [bandChoice];
  }

  /** Weeks of one course over all of the student's course rows. */
  weeksOfCourse(courseId: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === courseId).reduce((sum, row) => sum + row.weeks, 0);
  }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  /** The shortest length a course allows (IELTS Basic 4, IELTS Guarantee 8), for the comparison. */
  minimumWeeks(courseId: string): number {
    return CIP_COURSE_RULES[courseId]?.allowedWeeks?.[0] ?? 0;
  }

  /** Whether the student's age allows the course (CIP course rules: juniors 7–15, 16–17 full Sparta only). */
  courseAllowed(courseId: string): boolean {
    const rule = CIP_COURSE_RULES[courseId];
    if (!rule) return true;
    if (this.selectedAgeGroup === 'adult') return rule.level !== 'junior';
    if (this.minorBand === 'senior') return rule.level === 'sparta';
    return rule.juniorBand === this.minorBand;
  }

  /** Lengths the price list offers; a course split over several rows counts all of them. */
  get courseLengthError(): string {
    for (const id of [...new Set(this.quotePlan.courses.map(row => row.optionId))]) {
      const rule = CIP_COURSE_RULES[id];
      const weeks = this.weeksOfCourse(id);
      if (rule?.allowedWeeks && !rule.allowedWeeks.includes(weeks)) return `${this.courseName(id)}只能报${rule.allowedWeeks.join('周或')}周。`;
      if (rule?.maxWeeks && weeks > rule.maxWeeks) return `${this.courseName(id)}最多报${rule.maxWeeks}周。`;
    }
    return '';
  }

  private get ageError(): string {
    const blocked = this.quotePlan.courses.find(row => !this.courseAllowed(row.optionId));
    if (!blocked) return '';
    if (this.selectedAgeGroup === 'adult') return '青少年课程只收7–15岁的学生，成人请选择其他课程。';
    const band = CIP_MINOR_BANDS.find(item => item.value === this.minorBand);
    return `${band?.label ?? ''}的学生${band?.courses ?? ''}，请换一门课程。`;
  }

  private get roomError(): string {
    const hotel = this.quotePlan.rooms.some(row => CIP_HOTEL_ROOM_IDS.includes(row.optionId));
    if (hotel && this.quotePlan.courses.some(row => CIP_COURSE_RULES[row.optionId]?.level === 'sparta')) {
      return '全斯巴达课程只能住校内宿舍，请换成宿舍房型。';
    }
    if (this.selectedAgeGroup === 'minor' && this.quotePlan.rooms.some(row => row.optionId === 'hotel-king-single')) {
      return '未成年学生不能单独入住酒店豪华大床房（1人住）。';
    }
    return '';
  }

  /** Arrivals before 2027 use the school's renminbi list, which this page does not quote. */
  private get dateError(): string {
    const first = [...this.quotePlan.courses, ...this.quotePlan.rooms].map(row => row.startDate).sort()[0] ?? this.quotePlan.startDate;
    return first && first < CIP_USD_FROM
      ? '2027年1月3日之前入学按学校的人民币价格报价，请改为2027年入学，或联系思达启航顾问报价。' : '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.dateError || this.ageError || this.courseLengthError || this.roomError;
  }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Study weeks whose Monday to Friday all lie inside the off-season offer and outside June–August. */
  offSeasonWeeks(rule = this.enabledRule(CIP_OFF_SEASON_RULE_ID)): number {
    if (!rule) return 0;
    const from = rule.coverageStart ? parseDay(rule.coverageStart) : -Infinity;
    const through = rule.coverageEnd ? parseDay(rule.coverageEnd) : Infinity;
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter(start => {
      const monday = start + DAY;
      const friday = start + 5 * DAY;
      return monday >= from && friday <= through
        && !CIP_PEAK_MONTHS.includes(monthOf(monday)) && !CIP_PEAK_MONTHS.includes(monthOf(friday));
    }).length;
  }

  promotionAmount(rule: CiaPromotionRule): number {
    if (!rule.enabled) return 0;
    if (rule.id === CIP_OFF_SEASON_RULE_ID) return Math.floor(this.offSeasonWeeks(rule) / 4) * rule.discountValue;
    if (rule.id === CIP_LONG_STAY_RULE_ID) {
      const weeks = this.quotePlan.courseWeeks;
      const tiers = rule.discountTiers
        ? Object.entries(rule.discountTiers).map(([tier, amount]) => ({ weeks: Number(tier), amount })).sort((a, b) => b.weeks - a.weeks)
        : CIP_LONG_STAY_TIERS;
      return tiers.find(tier => weeks >= tier.weeks)?.amount ?? 0;
    }
    return 0;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number }> {
    return this.pricing.promotions
      .filter(rule => rule.enabled)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => ({ rule, amount: this.promotionAmount(rule) }))
      .filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return Math.round(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0) * 100) / 100;
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  /** The non-cash off-season benefits apply once any study week falls in the offer. */
  get offSeasonGift(): boolean { return this.offSeasonWeeks() > 0; }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number {
    return this.returningStudent && !!this.enabledRule(CIP_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation - this.promotionDiscountTotal;
    return Math.max(0, Math.round(total * 100) / 100);
  }

  get paymentLines(): SchoolPaymentLine[] {
    return this.appliedPromotions.map(({ rule, amount }) => ({
      icon: '惠',
      label: rule.name,
      value: -amount,
      note: rule.id === CIP_OFF_SEASON_RULE_ID ? `${rule.description}；本次${this.offSeasonWeeks(rule)}周符合` : rule.description,
      promotionKey: rule.id,
    }));
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return '未成年学生入学前须由家长和学生签署同意书；外出须由20岁以上的成人陪同并事先取得经理同意，门禁21:00。青少年课程收7–15岁。';
  }

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

  /** Extension amounts in order; a 59-day entry starts with the second step. */
  private visaExtensionAmounts(rule: CiaLocalFeeRule): number[] {
    const sequence = (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => sequence[index] ?? sequence.at(-1) ?? rule.amount);
  }

  /** Weeks in the campus dormitory; Clover Hotel charges no electricity and no dormitory deposit. */
  get dormWeeks(): number {
    return this.quotePlan.rooms.filter(row => CIP_DORM_ROOM_IDS.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
  }

  /** The refundable dormitory deposit: 2,000 / 3,000 / 4,000 / 5,000 pesos by dormitory weeks. */
  get dormDeposit(): number {
    const weeks = this.dormWeeks;
    if (!weeks) return 0;
    return weeks <= 2 ? 2000 : weeks <= 4 ? 3000 : weeks <= 8 ? 4000 : 5000;
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.visaExtensionCount;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, note?: string, total?: number, unitLabel?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      if (!rule) return [];
      const unit = unitLabel ?? (rule.periodWeeks === 1 ? `${formatPhp(rule.amount)}／周`
        : rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{ item: rule.name, unitLabel: unit, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note }];
    };
    const visaRule = this.rule('visa-extension');
    const visaTotal = visaRule ? this.visaExtensionAmounts(visaRule).reduce((sum, amount) => sum + amount, 0) : 0;
    const visaUnit = visaRule
      ? `${formatPhp((this.visaType === 'tourist59' ? visaRule.tourist59Rates ?? visaRule.rates : visaRule.rates)?.[0] ?? visaRule.amount)}起／次`
      : '';
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const permits = plan.stayWeeks >= 24 ? 2 : 1;
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, visaUnit),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('ssp', longTerm ? 0 : permits, longTerm ? longTermNote : undefined),
      ...create('ssp-i-card', longTerm ? 0 : permits, longTerm ? longTermNote : undefined),
      ...create('electricity', this.dormWeeks),
      ...create('utility', plan.roomWeeks),
      ...create('id-card', 1),
      ...create('textbooks', Math.ceil(plan.courseWeeks / 4)),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

/** Deposit, pickup, laundry and extra nights: references outside the local-fee total. */
function cipOptionalFeeItems(pricing: CipQuotePricing, students: readonly CipPageStudent[]): PhOptionalFeeItem[] {
  const rule = (id: string) => pricing.localFeeRules.find(item => item.id === id && item.enabled);
  const cny = (php: number) => Number.isFinite(pricing.phpPerCny) && pricing.phpPerCny > 0
    ? `约人民币 ${quoteCurrencyText(Math.round(php / pricing.phpPerCny), 'zh-CN')} 元` : '';
  const items: PhOptionalFeeItem[] = [];
  const deposit = rule('deposit');
  if (deposit) {
    const total = students.reduce((sum, student) => sum + student.dormDeposit, 0);
    const people = students.filter(student => student.dormDeposit > 0).length;
    items.push(total
      ? { label: deposit.name, amount: formatPhp(total), cnyAmount: cny(total), note: `${deposit.note}${people > 1 ? `（${people}人）` : ''}` }
      : { label: deposit.name, amount: '住酒店不收', cnyAmount: '', note: deposit.note });
  }
  const pickup = rule('pickup');
  if (pickup) {
    const count = students.length;
    const clark = count >= 3 ? 2000 : count === 2 ? 1500 : 1000;
    const free = students.every(student => student.offSeasonGift);
    items.push(free
      ? { label: pickup.name, amount: '克拉克机场免费', cnyAmount: '', note: pickup.note }
      : { label: pickup.name, amount: formatPhp(clark), cnyAmount: cny(clark), note: `${pickup.note}${count > 1 ? `（${count}人，克拉克机场）` : '（克拉克机场）'}` });
  }
  const laundry = rule('laundry');
  if (laundry) items.push({ label: laundry.name, amount: '150–300 比索／次', cnyAmount: '', note: laundry.note });
  const night = rule('extra-night');
  if (night) items.push({ label: night.name, amount: `${formatPhp(night.amount)}／晚`, cnyAmount: cny(night.amount), note: night.note });
  return items;
}

export class CipQuote extends PhSchoolQuote<CipPageStudent> {
  constructor(pricing: CipQuotePricing) {
    super(pricing, {
      createStudent: () => new CipPageStudent(pricing),
      headingPrefix: 'CIP',
      image: { schoolCode: 'CIP', schoolName: '菲律宾克拉克CIP语言学校', filePrefix: 'CIP', heroSrc: CIP_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => cipPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => cipOptionalFeeItems(pricing, students),
      layoutVersion: 2,
    });
  }

  /** The off-season benefits, once for the students who qualify (named in a group quote). */
  private get giftItem(): QuoteImagePaymentItem | undefined {
    const eligible = this.activeStudents.map((student, index) => ({ student, index })).filter(({ student }) => student.offSeasonGift);
    if (!eligible.length) return undefined;
    const who = this.quoteMode === 'group' && eligible.length < this.activeStudents.length
      ? `${eligible.map(({ index }) => `学生${index + 1}`).join('、')}：` : '';
    return {
      icon: '赠', label: '淡季福利', amount: `${this.quoteMode === 'group' ? '每人' : ''}任选1项`,
      note: `${who}${CIP_OFF_SEASON_GIFT}；6–8月期间前两项暂停，之后恢复`,
    };
  }

  override get schoolPaymentItems(): PhSchoolPaymentItem[] {
    const gift = this.giftItem;
    return gift ? [...super.schoolPaymentItems, { ...gift, previewKind: 'section', previewId: 'quote-breakdown' }] : super.schoolPaymentItems;
  }

  override get quoteImageData(): QuoteImageCardData {
    const data = super.quoteImageData;
    const gift = this.giftItem;
    return gift ? { ...data, paymentItems: [...data.paymentItems, gift] } : data;
  }
}

export class CipPlanComparison extends PhPlanComparison<CipPageStudent> {
  constructor(pricing: CipQuotePricing, conditions: () => CipPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new CipPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.minorBand = from.minorBand;
        to.returningStudent = from.returningStudent;
      },
      heading: 'CIP 方案对比报价',
      courseGroups: CIP_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
      extraNotes: results => results.some(result => result.courseId === 'ielts-guarantee')
        ? ['雅思保分班只能报8周或12周。'] : [],
    });
  }
}
