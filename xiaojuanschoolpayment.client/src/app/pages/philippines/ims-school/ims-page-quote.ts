// IMS Academy on the shared Philippine school quote and plan comparison. IMS's own prices, offers, age rules and
// local fees are calculated here per student; the template's PhSchoolQuote and PhPlanComparison only add students up
// and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini program can
// bundle it later.
//
// Offer order (user rule 2026-11-24: the 思达启航 discount comes off the full price first, then school offers): the
// 思达启航 5% on tuition and room, except the four 2+2 weeks, which IMS's offer sheet says take no 5%; then the 2+2
// offer, the off-season 300 dollars per four weeks (75 per off-season week, as the sheet's examples count leftover
// weeks) and the long-stay tier on paid course weeks. Registration (100 dollars) is charged to every student.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { textbookGroups } from '../school-textbook-estimate';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  IMS_GUARANTEE_COURSE_IDS,
  IMS_JUNIOR_COURSE_IDS,
  IMS_LONG_STAY_RULE_ID,
  IMS_LOW_SEASON_RULE_ID,
  IMS_PEAK_MONTHS,
  IMS_REGISTRATION_NOTE,
  IMS_SIDA_RULE_ID,
  IMS_TWO_PLUS_TWO_RULE_ID,
  IMS_TWO_PLUS_TWO_TASKS,
  IMS_WALK_IN_ROOM_ID,
} from './ims-content-config';
import { IMS_QUOTE_IMAGE_HERO } from './ims-page-content';

const DAY = 86400000;
/** Courses for students aged 20 or older (brochure course table); Senior ESL is for 50 and older. */
const ADULT_ONLY_COURSE_IDS: readonly string[] = ['toeic-speaking', 'opic', 'mommy-tesol', 'tesol-light', 'parents-esl', 'senior-esl'];

/** Everything IMS's quote reads; the page component is one. */
export interface ImsQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const IMS_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL', courseIds: ['premium-esl', 'intensive-esl', 'essential-esl-6', 'essential-esl-5', 'essential-esl-4'] },
  { id: 'speaking', label: '口语与职业英语', courseIds: ['power-speaking', 'business-english', 'working-holiday'] },
  { id: 'ielts', label: '雅思', courseIds: ['pre-ielts', 'ielts', 'ielts-guarantee'] },
  { id: 'toeic', label: '托业', courseIds: ['pre-toeic', 'toeic', 'toeic-guarantee'] },
] as const;

/** Price ratio of a 1–3 week stay (30/60/80%); four weeks and longer are proportional. */
export const imsPriceMultiplier = (weeks: number, ratios: Record<string, number>): number =>
  ratios[String(weeks)] ?? weeks / 4;

const roundCents = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const formatUsd = (value: number): string => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

type ImsMinorAge = '15-17' | '7-14';
type ImsMinorService = 'none' | 'guardian-service' | 'school-management';

/** One IMS student: plan, conditions and every amount the template and quote image show. */
export class ImsPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  /** IMS charges registration to returning students too, so the template hides the choice. */
  returningStudent = false;
  readonly hideReturning = true;

  private readonly twoPlusTwoChoice: PhExtraChoice;
  private readonly minorAgeChoice: PhExtraChoice;
  private readonly minorServiceChoice: PhExtraChoice;
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly pricing: ImsQuotePricing) {
    this.quotePlan = new SchoolQuotePlan(
      'essential-esl-4', 'quadruple', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => this.rowPrice(kind, row),
      24, true, false,
    );
    const student = this;
    this.twoPlusTwoChoice = {
      label: '2+2达人活动',
      options: [{ value: false, label: '不参加' }, { value: true, label: '参加（前4周付2周）' }],
      inComparison: false,
      value: false,
      get visible() { return student.twoPlusTwoRuleEnabled; },
      get note() { return student.twoPlusTwoNote; },
    };
    this.minorAgeChoice = {
      label: '未成年学生年龄',
      options: [{ value: '15-17', label: '15–17岁' }, { value: '7-14', label: '7–14岁' }],
      value: '15-17',
      get visible() { return student.selectedAgeGroup === 'minor'; },
      note: '',
    };
    this.minorServiceChoice = {
      label: '未成年服务（可选）',
      options: [
        { value: 'none', label: '不需要' },
        { value: 'guardian-service', label: `监护服务（${student.serviceRate('guardian-service')}美元／4周）` },
        { value: 'school-management', label: `国际学生管理服务（${student.serviceRate('school-management')}美元／4周）` },
      ],
      inComparison: false,
      value: 'none',
      get visible() { return student.selectedAgeGroup === 'minor'; },
      get note() { return student.minorServiceNote; },
    };
    this.extraChoices = [this.twoPlusTwoChoice, this.minorAgeChoice, this.minorServiceChoice];
  }

  get joinsTwoPlusTwo(): boolean { return this.twoPlusTwoChoice.value === true; }
  set joinsTwoPlusTwo(value: boolean) { this.twoPlusTwoChoice.value = value; }
  get minorAge(): ImsMinorAge { return this.minorAgeChoice.value as ImsMinorAge; }
  set minorAge(value: ImsMinorAge) { this.minorAgeChoice.value = value; }
  get minorService(): ImsMinorService { return this.minorServiceChoice.value as ImsMinorService; }
  set minorService(value: ImsMinorService) { this.minorServiceChoice.value = value; }

  // ---- prices -----------------------------------------------------------------------------------

  private course(id: string): CiaQuoteCourse | undefined { return this.pricing.courseFees.find(item => item.id === id); }
  private room(id: string): CiaQuoteRoom | undefined { return this.pricing.roomFees.find(item => item.id === id); }
  private isGuarantee(id: string): boolean { return IMS_GUARANTEE_COURSE_IDS.includes(id) && !!this.course(id)?.feeByWeeks; }

  /** Guarantee courses are whole packages; other rows follow the student's own total course weeks. */
  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    if (kind === 'course' && this.isGuarantee(row.optionId)) return this.course(row.optionId)?.feeByWeeks?.[String(row.weeks)] ?? 0;
    const base = kind === 'course' ? this.course(row.optionId)?.tuition2027 ?? 0 : this.room(row.optionId)?.fee ?? 0;
    const weeks = this.quotePlan.courseWeeks;
    if (!Number.isInteger(weeks) || weeks < 1) return 0;
    if (weeks >= 4) return roundCents(base / 4 * row.weeks);
    return roundCents(base * imsPriceMultiplier(weeks, this.pricing.shortTermPriceRatios) / weeks * row.weeks);
  }

  minimumWeeks(courseId: string): number {
    return this.course(courseId)?.minimumWeeks ?? 0;
  }

  // ---- rules ------------------------------------------------------------------------------------

  get courseLengthError(): string {
    for (const row of this.quotePlan.courses) {
      const course = this.course(row.optionId);
      if (!course) continue;
      if (this.isGuarantee(row.optionId) && !course.feeByWeeks?.[String(row.weeks)]) {
        const lengths = Object.keys(course.feeByWeeks ?? {}).join('、');
        return `${course.name}须连续读${lengths}周中的一种，请调整周数。`;
      }
      const minimum = this.minimumWeeks(row.optionId);
      if (!this.isGuarantee(row.optionId) && minimum > 0 && row.weeks < minimum) return `${course.name}至少要读${minimum}周。`;
    }
    return '';
  }

  /** Age rules of the brochure's course table: Junior 7–14, most courses 15+, some 20+ (Senior ESL 50+). */
  private get ageError(): string {
    const courses = this.quotePlan.courses.map(row => row.optionId);
    const junior = courses.filter(id => IMS_JUNIOR_COURSE_IDS.includes(id));
    if (this.selectedAgeGroup === 'adult') {
      return junior.length ? 'Junior少儿课程只收7–14岁的孩子，请把年龄段选为“未满18岁”。' : '';
    }
    if (this.minorAge === '7-14') {
      return junior.length === courses.length ? '' : '7–14岁的孩子请选Junior少儿课程，由家长陪同报名。';
    }
    if (junior.length) return 'Junior少儿课程只收7–14岁的孩子。';
    const adultOnly = courses.find(id => ADULT_ONLY_COURSE_IDS.includes(id));
    return adultOnly ? `${this.course(adultOnly)?.name ?? '这门课'}只收成年学生，请换一门课程。` : '';
  }

  private get minorServiceError(): string {
    if (this.selectedAgeGroup !== 'minor' || this.minorService === 'none') return '';
    if (this.quotePlan.courseWeeks < 4) return '未成年服务按4周起计，请选4周以上或改为不需要。';
    if (this.minorService === 'guardian-service' && this.peakCourseWeeks > 0) return '监护服务只在淡季提供，1、6、7、8月不能选。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError || this.ageError || this.minorServiceError;
  }

  get minorNote(): string {
    return '15–17岁可以报标注15岁以上的课程；7–14岁的孩子报Junior少儿课程，家长陪同时须报Parents ESL。家长外出时学校17:30–20:30免费照看孩子。';
  }

  private get minorServiceNote(): string {
    if (this.minorService === 'guardian-service') return '监护服务只在淡季（1、6、7、8月以外）提供，费用计入学校费用。';
    if (this.minorService === 'school-management') return '国际学生管理服务的具体内容请顾问向学校确认，费用计入学校费用。';
    return '';
  }

  // ---- weeks ------------------------------------------------------------------------------------

  /** A course week belongs to the month of its Wednesday. */
  private monthOf(weekStart: number): number { return new Date(weekStart + 3 * DAY).getUTCMonth() + 1; }
  private isOffSeason(weekStart: number): boolean { return !IMS_PEAK_MONTHS.includes(this.monthOf(weekStart)); }
  private get courseWeekStarts(): number[] { return this.quotePlan.weekStarts(this.quotePlan.courses); }
  private get peakCourseWeeks(): number { return this.courseWeekStarts.filter(start => !this.isOffSeason(start)).length; }

  // ---- offers -----------------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  get twoPlusTwoRuleEnabled(): boolean { return !!this.enabledRule(IMS_TWO_PLUS_TWO_RULE_ID); }

  /** Why the first four weeks cannot take 2+2, or '' when they can. */
  private get twoPlusTwoBlocker(): string {
    const plan = this.quotePlan;
    if (plan.courseWeeks < 4) return '要读满4周才能参加。';
    const firstCourse = plan.courses[0], firstRoom = plan.rooms[0];
    if (!firstCourse || !firstRoom || firstCourse.weeks < 4 || firstRoom.weeks < 4) return '前4周要读同一门课、住同一种房型。';
    if (this.isGuarantee(firstCourse.optionId)) return '保分班是整期价，不能参加。';
    if (this.courseWeekStarts.slice(0, 4).some(start => !this.isOffSeason(start))) return '前4周有1、6、7、8月的课，不是淡季。';
    return '';
  }

  get twoPlusTwoApplies(): boolean {
    return this.twoPlusTwoRuleEnabled && this.joinsTwoPlusTwo && !this.twoPlusTwoBlocker;
  }

  private get twoPlusTwoNote(): string {
    if (!this.joinsTwoPlusTwo) return '淡季前4周只付2周的课程费和住宿费，要在社交平台发学习体验；不想发的同学可以选淡季减300美元。';
    const blocker = this.twoPlusTwoBlocker;
    if (blocker) return `本次不能参加2+2：${blocker}`;
    return `要求：${IMS_TWO_PLUS_TWO_TASKS.join('；')}。这4周不再享思达启航95折和淡季减免。`;
  }

  /** Four-week course and room prices of the 2+2 block, and what the student pays for them (2-week prices). */
  private get twoPlusTwoBlock(): { gross: number; paid: number } {
    if (!this.twoPlusTwoApplies) return { gross: 0, paid: 0 };
    const course = this.course(this.quotePlan.courses[0].optionId)?.tuition2027 ?? 0;
    const room = this.room(this.quotePlan.rooms[0].optionId)?.fee ?? 0;
    const ratio = imsPriceMultiplier(2, this.pricing.shortTermPriceRatios);
    return { gross: roundCents(course + room), paid: roundCents((course + room) * ratio) };
  }

  get twoPlusTwoDiscount(): number {
    const block = this.twoPlusTwoBlock;
    return roundCents(block.gross - block.paid);
  }

  /** 思达启航 5% on tuition and room, leaving out the 2+2 weeks. */
  get sidaDiscount(): number {
    const rule = this.enabledRule(IMS_SIDA_RULE_ID);
    if (!rule) return 0;
    return roundCents(Math.max(0, this.tuition + this.accommodation - this.twoPlusTwoBlock.gross) * rule.discountValue / 100);
  }

  /** Off-season course weeks outside the 2+2 block. */
  get lowSeasonWeeks(): number {
    const rule = this.enabledRule(IMS_LOW_SEASON_RULE_ID);
    if (!rule || this.quotePlan.courseWeeks < rule.minimumCourseWeeks) return 0;
    const skip = this.twoPlusTwoApplies ? 4 : 0;
    return this.courseWeekStarts.slice(skip).filter(start => this.isOffSeason(start)).length;
  }

  get lowSeasonDiscount(): number {
    const rule = this.enabledRule(IMS_LOW_SEASON_RULE_ID);
    return rule ? this.lowSeasonWeeks * rule.discountValue : 0;
  }

  /** Course weeks paid for: the four 2+2 weeks count as two. */
  get paidCourseWeeks(): number { return this.quotePlan.courseWeeks - (this.twoPlusTwoApplies ? 2 : 0); }

  get longStayDiscount(): number {
    const tiers = this.enabledRule(IMS_LONG_STAY_RULE_ID)?.discountTiers ?? {};
    const reached = Object.keys(tiers).map(Number).filter(weeks => this.paidCourseWeeks >= weeks).sort((a, b) => b - a)[0];
    return reached ? tiers[reached] ?? 0 : 0;
  }

  private get appliedPromotions(): Array<{ rule: CiaPromotionRule; amount: number; note: string }> {
    const items: Array<{ id: string; amount: number; note: (rule: CiaPromotionRule) => string }> = [
      { id: IMS_SIDA_RULE_ID, amount: this.sidaDiscount, note: rule => rule.description },
      {
        id: IMS_TWO_PLUS_TWO_RULE_ID, amount: this.twoPlusTwoDiscount,
        note: () => `淡季前4周按2周的课程费和住宿费收取；要在社交平台发学习体验并配合学校采访`,
      },
      {
        id: IMS_LOW_SEASON_RULE_ID, amount: this.lowSeasonDiscount,
        note: rule => `淡季每周减${rule.discountValue}美元（每4周${rule.discountValue * 4}美元）；本次${this.lowSeasonWeeks}周淡季`,
      },
      {
        id: IMS_LONG_STAY_RULE_ID, amount: this.longStayDiscount,
        note: () => `按付费课程周数计算，本次${this.paidCourseWeeks}周`,
      },
    ];
    return items.flatMap(item => {
      const rule = this.enabledRule(item.id);
      return rule && item.amount > 0 ? [{ rule, amount: roundCents(item.amount), note: item.note(rule) }] : [];
    });
  }

  get promotionDiscountTotal(): number {
    return roundCents(this.appliedPromotions.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string {
    return [...new Set(this.appliedPromotions.map(item => item.rule.name))].join('、');
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number { return this.pricing.registrationFee; }
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;

  serviceRate(id: 'guardian-service' | 'school-management'): number {
    return this.pricing.localFeeRules.find(rule => rule.id === id)?.amount ?? (id === 'guardian-service' ? 450 : 2100);
  }

  /** The chosen minor service, per four course weeks and proportional beyond (the price list's 4–24-week rows). */
  get minorServiceFee(): number {
    if (this.selectedAgeGroup !== 'minor' || this.minorService === 'none' || this.minorServiceError) return 0;
    return roundCents(this.serviceRate(this.minorService) * this.quotePlan.courseWeeks / 4);
  }

  get quoteUsd(): number {
    const total = this.registration + this.tuition + this.accommodation + this.minorServiceFee - this.promotionDiscountTotal;
    return Math.max(0, roundCents(total));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const chosen = this.minorService;
    const service: SchoolPaymentLine[] = this.minorServiceFee && chosen !== 'none'
      ? [{
        icon: '护',
        label: chosen === 'guardian-service' ? '监护服务 Guardian Service' : '国际学生管理服务',
        value: this.minorServiceFee,
        note: `${this.serviceRate(chosen)}美元／4周，按${this.quotePlan.courseWeeks}周计算`,
      }]
      : [];
    return [
      ...service,
      ...this.appliedPromotions.map(({ rule, amount, note }) => ({
        icon: rule.id === IMS_SIDA_RULE_ID ? '折' : '惠',
        label: rule.name,
        value: -amount,
        note,
        promotionKey: rule.id,
      })),
    ];
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** One extension per started four weeks beyond the entry visa: from week 5 (30 days) or week 9 (59 days). */
  get visaExtensionCount(): number {
    if (this.longTermVisa) return 0;
    const covered = this.visaType === 'tourist59' ? 8 : 4;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks - covered) / 4));
  }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private visaSequence(rule: CiaLocalFeeRule): number[] {
    return (this.visaType === 'tourist59' ? rule.tourist59Rates ?? rule.rates : rule.rates) ?? [rule.amount];
  }

  /** Weeks in school rooms (walk-in weeks pay no water, electricity or air-conditioning). */
  get dormWeeks(): number {
    return this.quotePlan.rooms.filter(row => row.optionId !== IMS_WALK_IN_ROOM_ID).reduce((sum, row) => sum + row.weeks, 0);
  }

  get staysAtSchool(): boolean { return this.dormWeeks > 0; }

  get localFees(): SchoolLocalFee[] {
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
    const sequence = visaRule ? this.visaSequence(visaRule) : [];
    const visaTotal = Array.from({ length: extensions }, (_, index) => sequence[index] ?? sequence.at(-1) ?? 0).reduce((sum, amount) => sum + amount, 0);
    const visaNote = longTerm ? longTermNote
      : `${extensions ? `按${this.visaLabel}预估，本次${extensions}次` : `按${this.visaLabel}预估，本次无需续签`}；${visaRule?.note ?? ''}`;
    const bookRule = this.rule('books');
    const bookSets = textbookGroups(this.quotePlan.courses).length;
    return [
      ...create('visa-extension', extensions, visaNote, visaTotal, `${formatPhp(sequence[0] ?? 0)}起／次`),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('e-card', longTerm ? 0 : 1, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', !longTerm && extensions > 0 ? 1 : 0, longTerm ? longTermNote : undefined),
      ...create('books', bookSets, bookRule ? `本次${bookSets}种课程；${bookRule.note}` : undefined, undefined, bookRule ? `${formatPhp(bookRule.amount)}／套` : undefined),
      ...create('student-id', 1),
      ...create('water', this.dormWeeks),
      ...create('electricity', this.dormWeeks),
      ...create('aircon', this.dormWeeks),
    ].map(fee => longTerm && fee.quantity === 0 && fee.note === longTermNote ? { ...fee, waived: true } : fee);
  }
}

/** Deposit, pickup, drop-off, walk-in lunch and the extra-class prices, outside the local-fee total. */
function imsOptionalFees(pricing: ImsQuotePricing, students: readonly ImsPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  const staying = students.filter(student => student.staysAtSchool).length;
  const walkIn = students.some(student => student.quotePlan.rooms.some(row => row.optionId === IMS_WALK_IN_ROOM_ID));
  const cnyFromPhp = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN')} 元`;
  const cnyFromUsd = (value: number) => `约人民币 ${quoteCurrencyText(Math.round(value * pricing.usdToCny), 'zh-CN')} 元`;
  const group = (people: number) => (count > 1 ? `（${people}人）` : '');
  const rules = pricing.localFeeRules.filter(rule => rule.enabled && !rule.includeInTotal).sort((a, b) => a.sortOrder - b.sortOrder);
  const items: PhOptionalFeeItem[] = [];
  for (const rule of rules.filter(item => item.currency === 'PHP')) {
    if (rule.id === 'walk-in-lunch' && !walkIn) continue;
    const people = rule.id === 'deposit' ? staying : count;
    if (people === 0) continue;
    const total = rule.multiplyByStudents ? rule.amount * people : rule.amount;
    items.push({ label: rule.name, amount: formatPhp(total), cnyAmount: cnyFromPhp(total), note: `${rule.note}${rule.multiplyByStudents ? group(people) : ''}` });
  }
  const extra = rules.filter(rule => rule.currency === 'USD' && rule.id.startsWith('additional-'));
  if (extra.length) {
    const amount = (id: string) => extra.find(rule => rule.id === `additional-${id}`)?.amount;
    const line = (label: string, prefix: string) => {
      const parts = [['一对一', amount(`${prefix}-one-to-one`)], ['小组课', amount(`${prefix}-group`)], ['小组课换一对一', amount(`${prefix}-group-to-one`)]]
        .filter(([, value]) => value !== undefined).map(([name, value]) => `${name}${formatUsd(value as number)}`);
      return parts.length ? `${label}：${parts.join('、')}美元` : '';
    };
    const amounts = extra.map(rule => rule.amount);
    const low = Math.min(...amounts), high = Math.max(...amounts);
    items.push({
      label: '加课（每4周，每天多1节）',
      amount: `${formatUsd(low)}–${formatUsd(high)} 美元`,
      cnyAmount: `${cnyFromUsd(low)}起`,
      note: [line('ESL', 'esl'), line('专项课程（雅思、托业等）', 'special')].filter(Boolean).join('；'),
    });
  }
  return items;
}

export class ImsQuote extends PhSchoolQuote<ImsPageStudent> {
  constructor(pricing: ImsQuotePricing) {
    super(pricing, {
      createStudent: () => new ImsPageStudent(pricing),
      headingPrefix: 'IMS',
      image: { schoolCode: 'IMS', schoolName: '菲律宾宿务IMS Academy语言学校', filePrefix: 'IMS', heroSrc: IMS_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => imsPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      optionalFeeItems: students => imsOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }

  /** IMS charges every student, returning students too (the template's line says they are free). */
  protected override get registrationBaseNote(): string { return IMS_REGISTRATION_NOTE; }
}

export class ImsPlanComparison extends PhPlanComparison<ImsPageStudent> {
  constructor(pricing: ImsQuotePricing, conditions: () => ImsPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new ImsPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.minorAge = from.minorAge;
      },
      heading: 'IMS 方案对比报价',
      courseGroups: IMS_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      layoutVersion: 2,
    });
  }
}
