// BECI (EOP, City and Sparta campuses) on the shared Philippine school quote and plan comparison. BECI's own prices,
// offers and local fees are calculated here per student; PhSchoolQuote and PhPlanComparison only add students up and
// lay them out. Each page quotes its own campus only. Keep this file free of Angular, DOM and storage access, so the
// WeChat mini program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  BECI_2027_PRICE_REGISTRATION_START,
  BECI_EARLY_BIRD_RULE_KIND,
  BECI_LONG_STAY_RULE_KIND,
  BECI_MAX_WEEKS,
  BECI_OFF_SEASON_RULE_KIND,
  BECI_PEAK_2027_RANGE,
  BECI_PROMOTION_IDS,
  BECI_VISA_TOTALS_30,
  BECI_VISA_TOTALS_59,
  type BeciCampus,
  type BeciCourseContent,
  type BeciRoomContent,
} from './beci-content-config';

const DAY = 86400000;

/** Campus names in headings, the quote image and file names. */
export const BECI_CAMPUS_NAMES: Readonly<Record<BeciCampus, { short: string; full: string; file: string; hero: string }>> = {
  eop: { short: 'BECI EOP', full: '菲律宾碧瑶BECI EOP校区', file: 'BECI-EOP', hero: '/assets/philippines/beci-eop-campus.webp' },
  city: { short: 'BECI City', full: '菲律宾碧瑶BECI City校区', file: 'BECI-City', hero: '/assets/beci-city/building-1.webp' },
  sparta: { short: 'BECI Sparta', full: '菲律宾碧瑶BECI斯巴达校区', file: 'BECI-Sparta', hero: '/assets/beci-sparta/campus-aerial.webp' },
};

/** Default course and room of each campus's quote. */
const DEFAULTS: Readonly<Record<BeciCampus, { course: string; room: string }>> = {
  eop: { course: 'eop-speed-esl', room: 'eop-triple' },
  city: { course: 'city-lite-esl', room: 'city-studio-quad' },
  sparta: { course: 'sparta-24-esl', room: 'sparta-quad' },
};

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const BECI_COMPARE_COURSE_GROUPS: Readonly<Record<BeciCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>>> = {
  eop: [
    { id: 'esl', label: 'ESL课程', courseIds: ['eop-lite-esl', 'eop-speed-esl', 'eop-sparta-esl'] },
    { id: 'test', label: '考试课程', courseIds: ['eop-ielts', 'eop-toeic'] },
    { id: 'junior', label: '青少年课程', courseIds: ['eop-junior-esl', 'eop-junior-ielts'] },
  ],
  city: [{ id: 'esl', label: 'ESL课程', courseIds: ['city-lite-esl', 'city-native-esl', 'city-unlimited-esl'] }],
  sparta: [{ id: 'sparta', label: '斯巴达课程', courseIds: ['sparta-24-esl', 'sparta-ielts', 'sparta-toeic'] }],
};

/** Everything BECI's quote reads; the page component is one. */
export interface BeciQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** Content rows with BECI-only fields (2026 prices, textbook fees, pair rooms). */
  beciCourses: BeciCourseContent[];
  beciRooms: BeciRoomContent[];
}

const money = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const parseDay = (value: string): number => Date.parse(`${value}T00:00:00Z`);
const pad = (value: number) => String(value).padStart(2, '0');
/** Today as YYYY-MM-DD in the visitor's own calendar (the registration date the quote assumes). */
export const beciToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

interface BeciChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

/** One BECI student: plan, conditions and every amount the template and quote image show. */
export class BeciPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly extraChoices: readonly PhExtraChoice[];
  visaType = 'tourist59';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = beciToday();
  pickup = true;
  /** EOP: 40 and older live in single rooms only. Sparta: the campus takes students aged 18–40. */
  over40 = false;
  /** Sparta: one group class a day upgraded to one-to-one (500 pesos a week). */
  spartaUpgrade = false;

  constructor(
    private readonly pricing: BeciQuotePricing,
    readonly campus: BeciCampus,
    /** The students this one is quoted with; a pair room needs two of them. A single quote has only itself. */
    private readonly householdOf: (student: BeciPageStudent) => readonly BeciPageStudent[] = student => [student],
  ) {
    const student = this;
    const defaults = DEFAULTS[campus];
    this.quotePlan = new SchoolQuotePlan(
      defaults.course, defaults.room, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => kind === 'course' ? student.coursePrice(row) : student.roomPrice(row),
      BECI_MAX_WEEKS,
    );
    const pickup: BeciChoice<boolean> = {
      label: 'BESA周日团体接机',
      options: [{ value: true, label: '需要（3,000比索）' }, { value: false, label: '不需要' }],
      visible: true,
      note: '马尼拉或克拉克机场，指定周日统一接机。',
      get value() { return student.pickup; },
      set value(value: boolean) { student.pickup = value; },
    };
    const over40: BeciChoice<boolean> = campus === 'sparta'
      ? {
        label: '年龄是否超过40岁',
        options: [{ value: false, label: '40岁及以下' }, { value: true, label: '超过40岁' }],
        visible: true,
        note: 'Sparta校区接收18–40岁的学生。',
        get value() { return student.over40; },
        set value(value: boolean) { student.over40 = value; },
      }
      : {
        label: '是否40岁及以上',
        options: [{ value: false, label: '40岁以下' }, { value: true, label: '40岁及以上' }],
        visible: true,
        note: 'EOP校区40岁及以上的学生必须入住单人间。',
        get value() { return student.over40; },
        set value(value: boolean) { student.over40 = value; },
      };
    const upgrade: BeciChoice<boolean> = {
      label: '小组课升级一对一',
      options: [{ value: false, label: '不需要' }, { value: true, label: '升级1节（每周500比索）' }],
      visible: true,
      note: '每天保留规定课数，把其中1节小组课改为一对一；到校后另付。',
      get value() { return student.spartaUpgrade; },
      set value(value: boolean) { student.spartaUpgrade = value; },
    };
    this.extraChoices = campus === 'sparta' ? [over40, upgrade, pickup] : campus === 'eop' ? [over40, pickup] : [pickup];
  }

  // ---- catalogue ---------------------------------------------------------------------------------

  private courseContent(id: string): BeciCourseContent | undefined { return this.pricing.beciCourses.find(item => item.id === id); }
  private roomContent(id: string): BeciRoomContent | undefined { return this.pricing.beciRooms.find(item => item.id === id); }
  private weeksOfCourse(id: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
  }

  /** Registrations before 2027-01-01 keep the 2026 price list (the school's transition rule). */
  get uses2026Prices(): boolean {
    return !!this.selectedRegistrationDate && this.selectedRegistrationDate < BECI_2027_PRICE_REGISTRATION_START;
  }

  /** The 4-week price for this registration date: the 2026 list price where the 2027 list raised it. */
  private fourWeekCoursePrice(id: string): number {
    const listed = this.pricing.courseFees.find(item => item.id === id)?.tuition2027 ?? 0;
    const old = this.courseContent(id)?.price2026;
    return this.uses2026Prices && old ? old : listed;
  }
  private fourWeekRoomPrice(id: string): number {
    const listed = this.pricing.roomFees.find(item => item.id === id)?.fee ?? 0;
    const old = this.roomContent(id)?.price2026;
    return this.uses2026Prices && old ? old : listed;
  }

  /** 1/2/3 weeks cost 40/60/80% of four weeks; longer stays are proportional. Guarantee courses have no short-stay price. */
  private ratio(weeks: number, courseId?: string): number {
    if (courseId && (this.courseContent(courseId)?.minimumWeeks ?? 0) >= 4) return weeks / 4;
    return this.pricing.shortTermPriceRatios[String(weeks)] ?? weeks / 4;
  }

  private coursePrice(row: QuotePlanRow): number {
    return this.fourWeekCoursePrice(row.optionId) * this.ratio(row.weeks, row.optionId);
  }
  private roomPrice(row: QuotePlanRow): number {
    return this.fourWeekRoomPrice(row.optionId) * this.ratio(row.weeks);
  }

  // ---- checks ------------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    return this.courseContent(courseId)?.minimumWeeks ?? 0;
  }

  get courseLengthError(): string {
    for (const id of new Set(this.quotePlan.courses.map(row => row.optionId))) {
      const course = this.courseContent(id);
      const minimum = course?.minimumWeeks ?? 0;
      if (course && minimum && this.weeksOfCourse(id) < minimum) return `${course.name}最低报名${minimum}周，请调整周数。`;
    }
    return '';
  }

  get household(): readonly BeciPageStudent[] { return this.householdOf(this); }

  /** The room type this student sleeps in during the week starting on this Sunday. */
  roomAt(weekStart: number): string | undefined {
    return this.quotePlan.rooms.find(row => this.quotePlan.weekStarts([row]).includes(weekStart))?.optionId;
  }

  /** A pair price needs two students (or two per room) in the same room type on the same weeks. */
  private get pairRoomError(): string {
    for (const row of this.quotePlan.rooms) {
      const room = this.roomContent(row.optionId);
      if (!room?.pairRoom) continue;
      const paired = this.quotePlan.weekStarts([row]).every(start => {
        const count = this.household.filter(member => member.roomAt(start) === row.optionId).length;
        return count > 0 && count % 2 === 0;
      });
      if (!paired) return `${room.label || room.name}是两人同住价，请用多人报价，由同住的两人选同一房型和相同日期。`;
    }
    return '';
  }

  private get campusRuleError(): string {
    if (this.campus === 'sparta') {
      if (this.selectedAgeGroup === 'minor') return 'Sparta校区接收18–40岁的学生，未满18岁请选EOP或City校区。';
      if (this.over40) return 'Sparta校区接收18–40岁的学生，超过40岁请选EOP或City校区。';
    }
    if (this.campus === 'eop' && this.over40) {
      const shared = this.quotePlan.rooms.find(row => !this.roomContent(row.optionId)?.single);
      if (shared) return 'EOP校区40岁及以上的学生必须入住单人间，请改选单人间。';
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (!this.selectedRegistrationDate) return '请填写报名注册日。';
    return this.quotePlan.error || this.courseLengthError || this.campusRuleError || this.pairRoomError;
  }

  // ---- offers ------------------------------------------------------------------------------------

  get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).filter(value => this.quotePlan.date(value) !== null).sort()[0]
      ?? this.quotePlan.startDate;
  }

  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  /** Off-season 10%: the arrival day decides, for the whole stay; 2027 periods are for EOP and City only. */
  private get offSeasonRule(): CiaPromotionRule | undefined {
    const start = this.courseStart;
    const courses = this.quotePlan.courses.map(row => row.optionId);
    return this.pricing.promotions.find(rule => rule.enabled && rule.ruleKind === BECI_OFF_SEASON_RULE_KIND
      && (!rule.arrivalStart || start >= rule.arrivalStart) && (!rule.arrivalEnd || start <= rule.arrivalEnd)
      && (!rule.eligibleCourseIds?.length || courses.every(id => rule.eligibleCourseIds!.includes(id))));
  }
  get offSeasonDiscount(): number {
    const rule = this.offSeasonRule;
    return rule ? money((this.tuition + this.accommodation) * rule.discountValue / 100) : 0;
  }

  /** Long-stay offer by total course weeks (8/12/16/20/24 weeks), after the off-season discount. */
  private get longStay(): { rule: CiaPromotionRule; amount: number } | undefined {
    const rule = this.pricing.promotions.find(item => item.enabled && item.ruleKind === BECI_LONG_STAY_RULE_KIND);
    if (!rule?.discountTiers) return undefined;
    const weeks = this.quotePlan.courseWeeks;
    const tier = Object.keys(rule.discountTiers).map(Number).filter(value => value <= weeks).sort((a, b) => b - a)[0];
    const amount = tier ? rule.discountTiers[String(tier)] ?? 0 : 0;
    return amount > 0 ? { rule, amount } : undefined;
  }

  /** Early bird: registrations confirmed by 2026-11-30 pay no 2027 summer peak surcharge. */
  private get earlyBird(): CiaPromotionRule | undefined {
    const rule = this.pricing.promotions.find(item => item.enabled && item.ruleKind === BECI_EARLY_BIRD_RULE_KIND);
    const date = this.selectedRegistrationDate;
    return rule && date && (!rule.registrationStart || date >= rule.registrationStart) && (!rule.registrationEnd || date <= rule.registrationEnd)
      ? rule : undefined;
  }

  get promotionDiscountTotal(): number {
    const schoolOffers = Math.min(this.tuition + this.accommodation, this.offSeasonDiscount + (this.longStay?.amount ?? 0));
    return money(schoolOffers + this.earlyBirdWaiver);
  }

  get discountNames(): string {
    return [this.offSeasonRule?.name, this.longStay?.rule.name, this.earlyBirdWaiver ? this.earlyBird?.name : '']
      .filter(Boolean).join('、');
  }

  // ---- school payment ----------------------------------------------------------------------------

  /** Every student registered through 思达启航 is free of the registration fee, and returning students always are. */
  get registration(): number {
    return this.returningStudent || this.rule(BECI_PROMOTION_IDS.registration) ? 0 : this.pricing.registrationFee;
  }
  get registrationWaiverName(): string | undefined {
    return this.rule(BECI_PROMOTION_IDS.registration) ? '思达启航' : undefined;
  }
  get tuition(): number { return money(this.quotePlan.total('course')); }
  get accommodation(): number { return money(this.quotePlan.total('room')); }

  private peakFor(onlyIn2027: boolean) {
    const ranges = this.pricing.peakSeasonRanges.filter(range => range.enabled !== false);
    const end2027 = parseDay(BECI_PEAK_2027_RANGE.end);
    const start2027 = parseDay(BECI_PEAK_2027_RANGE.start);
    const weeks = this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms])
      .filter(start => !onlyIn2027 || (start <= end2027 && start + 6 * DAY >= start2027));
    return calculateAssociationPeakSurcharge('BECI', weeks, ranges, this.pricing.seasonalFeePerWeek);
  }
  /** BESA summer peak: 40 dollars a week in 2026, 60 in 2027; course and room weeks count once, never discounted. */
  private get peak() { return this.peakFor(false); }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }
  get earlyBirdWaiver(): number { return this.earlyBird ? this.peakFor(true).total : 0; }

  get quoteUsd(): number {
    return Math.max(0, money(this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.promotionDiscountTotal));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const off = this.offSeasonRule;
    const long = this.longStay;
    const early = this.earlyBirdWaiver ? this.earlyBird : undefined;
    return [
      ...(off && this.offSeasonDiscount ? [{ icon: '淡', label: off.name, value: -this.offSeasonDiscount, note: off.description, promotionKey: off.id }] : []),
      ...(long ? [{ icon: '长', label: long.rule.name, value: -long.amount, note: `${long.rule.description.replace(/[。；\s]+$/, '')}；本次按${this.quotePlan.courseWeeks}周计算。`, promotionKey: long.rule.id }] : []),
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '暑期旺季附加费', value: this.seasonalSurcharge,
        note: `学习周与暑期旺季重叠：${associationPeakBreakdownText(this.peak)}；不参与折扣`,
        promotionKey: 'beci-peak',
      }] : []),
      ...(early ? [{ icon: '早', label: early.name, value: -this.earlyBirdWaiver, note: early.description, promotionKey: early.id }] : []),
    ];
  }

  // ---- conditions --------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string {
    return this.campus === 'sparta'
      ? 'Sparta校区接收18–40岁的学生。'
      : '主要接收15岁及以上的学生；14岁及以下的学生须由监护人陪同。';
  }

  // ---- local fees --------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** Months of stay for the visa table: up to 4 weeks is 1 month, 5–8 weeks 2 months, and so on (24 weeks = 6). */
  get stayMonths(): number { return Math.max(1, Math.ceil(this.quotePlan.stayWeeks / 4)); }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private get visaTotal(): number {
    const rule = this.feeRule('visa-extension');
    const table = (this.visaType === 'tourist59' ? rule?.tourist59Rates ?? BECI_VISA_TOTALS_59 : rule?.rates ?? BECI_VISA_TOTALS_30);
    return table[Math.min(table.length - 1, this.stayMonths - 1)] ?? 0;
  }

  /** Textbooks per started 4 weeks of each course: Lite ESL 1,000, Speed ESL 1,500, other courses 2,000 pesos. */
  private get books(): { total: number; periods: number; rates: number[] } {
    let total = 0;
    let periods = 0;
    const rates: number[] = [];
    for (const id of new Set(this.quotePlan.courses.map(row => row.optionId))) {
      const rate = this.courseContent(id)?.textbookPer4w ?? this.feeRule('books')?.amount ?? 0;
      const count = Math.ceil(this.weeksOfCourse(id) / 4);
      total += rate * count;
      periods += count;
      rates.push(rate);
    }
    return { total, periods, rates };
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, options: { note?: string; total?: number; unit?: string; visa?: boolean } = {}): SchoolLocalFee[] => {
      const rule = this.feeRule(id);
      if (!rule) return [];
      const waived = !!options.visa && longTerm;
      const unit = options.unit ?? (rule.periodWeeks ? `${formatPhp(rule.amount)}／${rule.periodWeeks}周` : `${formatPhp(rule.amount)}／次`);
      return [{
        item: rule.name, unitLabel: unit,
        quantity: waived ? 0 : quantity,
        total: waived ? 0 : options.total ?? rule.amount * quantity,
        note: waived ? longTermNote : options.note ?? rule.note,
        ...(waived ? { waived: true } : {}),
      }];
    };
    const visaTotal = this.visaTotal;
    const visaNote = visaTotal
      ? `按${this.visaLabel}入境、停留约${this.stayMonths}个月预估；最终以移民局实收为准。`
      : `按${this.visaLabel}入境、停留约${this.stayMonths}个月，本次无需延期。`;
    const books = this.books;
    const bookRates = [...new Set(books.rates)];
    const roomPeriods = Math.round(plan.roomWeeks / 4 * 100) / 100;
    const stayDays = plan.stayWeeks * 7;
    return [
      ...create('ssp', 1, { visa: true }),
      ...create('ssp-e-card', 1, { visa: true }),
      ...create('visa-extension', visaTotal ? 1 : 0, { visa: true, total: visaTotal, note: visaNote, unit: '按停留月数' }),
      ...create('acr-i-card', stayDays > 59 ? 1 : 0, { visa: true }),
      ...create('student-id', 1),
      ...create('books', books.periods, { total: books.total, unit: bookRates.length === 1 ? `${formatPhp(bookRates[0])}／4周` : '按课程／4周' }),
      ...create('utilities', roomPeriods, { total: Math.round(3000 * plan.roomWeeks / 4) }),
      ...create('maintenance', roomPeriods, { total: Math.round(1000 * plan.roomWeeks / 4) }),
      ...create('laundry', Math.ceil(plan.roomWeeks / 4)),
      ...(this.pickup ? create('besa-pickup', 1) : []),
      ...(this.campus === 'sparta' && this.spartaUpgrade
        ? create('sparta-upgrade', plan.courseWeeks, { unit: `${formatPhp(500)}／周` })
        : []),
    ];
  }
}

export class BeciQuote extends PhSchoolQuote<BeciPageStudent> {
  constructor(pricing: BeciQuotePricing, campus: BeciCampus) {
    const holder: { quote?: BeciQuote } = {};
    const names = BECI_CAMPUS_NAMES[campus];
    super(pricing, {
      createStudent: () => new BeciPageStudent(pricing, campus, student => {
        const group = holder.quote?.activeStudents ?? [];
        return group.includes(student) ? group : [student];
      }),
      headingPrefix: names.short,
      image: { schoolCode: 'BECI', schoolName: names.full, filePrefix: names.file, heroSrc: names.hero },
      priceMultiplier: weeks => pricing.shortTermPriceRatios[String(weeks)] ?? weeks / 4,
      layoutVersion: 2,
    });
    holder.quote = this;
  }
}

/** The comparison prices one person, so it leaves out the two-person pair prices. */
const onePersonRooms = (pricing: BeciQuotePricing): BeciQuotePricing => new Proxy(pricing, {
  get: (target, key) => key === 'roomFees'
    ? target.roomFees.filter(room => !target.beciRooms.find(item => item.id === room.id)?.pairRoom)
    : Reflect.get(target, key),
});

export class BeciPlanComparison extends PhPlanComparison<BeciPageStudent> {
  constructor(page: BeciQuotePricing, campus: BeciCampus, conditions: () => BeciPageStudent) {
    const pricing = onePersonRooms(page);
    super(pricing, conditions, {
      createStudent: () => new BeciPageStudent(pricing, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
        to.pickup = from.pickup;
        to.over40 = from.over40;
        to.spartaUpgrade = from.spartaUpgrade;
      },
      heading: `${BECI_CAMPUS_NAMES[campus].short} 方案对比报价`,
      courseGroups: BECI_COMPARE_COURSE_GROUPS[campus],
      peakRate: () => 60,
      extraNotes: () => campus === 'city' ? ['Studio两人同住价须两人同行，请用多人报价计算。'] : [],
      layoutVersion: 2,
    });
  }
}
