// GITC (Iloilo and Cebu campuses) on the shared Philippine school quote and plan comparison. GITC's own prices and
// local fees are calculated here per student; PhSchoolQuote and PhPlanComparison only add students up and lay them
// out. Each page quotes its own campus only. Keep this file free of Angular, DOM and storage access, so the WeChat mini
// program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { CiaLocalFeeRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  GITC_2027_ARRIVAL_START,
  GITC_FACILITY_PARTIAL,
  GITC_MAX_WEEKS,
  GITC_UTILITY_PARTIAL,
  GITC_VISA_TOTALS_30,
  GITC_VISA_TOTALS_59,
  type GitcCampus,
  type GitcCourseContent,
  type GitcRoomContent,
} from './gitc-content-config';

/** Campus names in headings, the quote image and file names. */
export const GITC_CAMPUS_NAMES: Readonly<Record<GitcCampus, { short: string; full: string; file: string; hero: string }>> = {
  iloilo: { short: 'GITC Iloilo', full: '菲律宾伊洛伊洛GITC College语言学校', file: 'GITC-Iloilo', hero: '/assets/gitc-iloilo/campus-main.webp' },
  cebu: { short: 'GITC Cebu', full: '菲律宾宿务GITC College语言学校（Cebu校区）', file: 'GITC-Cebu', hero: '/assets/gitc-cebu/campus-main.webp' },
};

const DEFAULTS: Readonly<Record<GitcCampus, { course: string; room: string }>> = {
  iloilo: { course: 'il-regular', room: 'il-one-spatial-single' },
  cebu: { course: 'cb-regular', room: 'cb-capsule-regular' },
};

const compareGroups = (prefix: string) => [
  { id: 'esl', label: 'ESL课程', courseIds: [`${prefix}-basic`, `${prefix}-regular`, `${prefix}-power`] },
  { id: 'test', label: '考试课程', courseIds: [`${prefix}-pre-ielts`, `${prefix}-pre-toeic`, `${prefix}-ielts-guarantee`, `${prefix}-toeic-guarantee`] },
];
export const GITC_COMPARE_COURSE_GROUPS: Readonly<Record<GitcCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>>> = {
  iloilo: compareGroups('il'),
  cebu: compareGroups('cb'),
};

/** Everything GITC's quote reads; the page component is one. */
export interface GitcQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  shortTermPriceRatios: Record<string, number>;
  /** Content rows with both price years and GITC-only room fields. */
  gitcCourses: GitcCourseContent[];
  gitcRooms: GitcRoomContent[];
}

const money = (value: number): number => Math.round(value * 100) / 100;
const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;

/** A 4-week amount for any number of weeks with the school's own 1–3 week table (facility fee, on-campus utilities). */
export const gitcPeriodFee = (weeks: number, fourWeeks: number, partial: readonly number[]): number =>
  weeks <= 0 ? 0 : fourWeeks * Math.floor(weeks / 4) + (partial[weeks % 4] ?? 0);

interface GitcChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

type Pickup = 'iloilo' | 'kalibo' | 'cebu' | 'none';

/** One GITC student: plan, conditions and every amount the template and quote image show. */
export class GitcPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly extraChoices: readonly PhExtraChoice[];
  visaType = 'tourist30';
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  pickup: Pickup;

  constructor(
    private readonly pricing: GitcQuotePricing,
    readonly campus: GitcCampus,
    /** The students this one is quoted with; a shared room needs all its occupants. A single quote has only itself. */
    private readonly householdOf: (student: GitcPageStudent) => readonly GitcPageStudent[] = student => [student],
  ) {
    const student = this;
    const defaults = DEFAULTS[campus];
    this.pickup = campus === 'cebu' ? 'cebu' : 'iloilo';
    this.quotePlan = new SchoolQuotePlan(
      defaults.course, defaults.room, nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => kind === 'course' ? student.coursePrice(row) : student.roomPrice(row),
      GITC_MAX_WEEKS,
    );
    const pickup: GitcChoice<Pickup> = {
      label: '机场接机',
      options: campus === 'cebu'
        ? [{ value: 'cebu', label: '麦克坦机场（1,000比索）' }, { value: 'none', label: '不需要' }]
        : [
          { value: 'iloilo', label: 'Iloilo机场（1,000比索）' },
          { value: 'kalibo', label: 'Kalibo机场（5,000比索）' },
          { value: 'none', label: '不需要' },
        ],
      visible: true,
      note: campus === 'cebu' ? '宿务麦克坦机场到学校。' : 'Iloilo机场或Kalibo（长滩岛）机场到住宿。',
      get value() { return student.pickup; },
      set value(value: Pickup) { student.pickup = value; },
    };
    this.extraChoices = [pickup];
  }

  // ---- catalogue ---------------------------------------------------------------------------------

  private courseContent(id: string): GitcCourseContent | undefined { return this.pricing.gitcCourses.find(item => item.id === id); }
  private roomContent(id: string): GitcRoomContent | undefined { return this.pricing.gitcRooms.find(item => item.id === id); }
  private weeksOfCourse(id: string): number {
    return this.quotePlan.courses.filter(row => row.optionId === id).reduce((sum, row) => sum + row.weeks, 0);
  }

  get courseStart(): string {
    return this.quotePlan.courses.map(row => row.startDate).filter(value => this.quotePlan.date(value) !== null).sort()[0]
      ?? this.quotePlan.startDate;
  }

  /** Courses starting from 2027-02-15 (arrival 2027-02-14 or later) pay the 2027 price list, for the whole stay. */
  get uses2027Prices(): boolean { return this.courseStart >= GITC_2027_ARRIVAL_START; }

  private fourWeekCoursePrice(id: string): number {
    const course = this.courseContent(id);
    if (!course) return 0;
    return this.uses2027Prices ? course.tuition2027 : course.tuition;
  }
  private fourWeekRoomPrice(id: string): number {
    const room = this.roomContent(id);
    if (!room) return 0;
    return this.uses2027Prices ? (room.price2027Pending ? 0 : room.fee2027 ?? 0) : room.fee;
  }

  /** Under 4 weeks in total: 1/2/3 weeks cost 40/75/90% of four weeks; from 4 weeks every segment is proportional. */
  private ratio(weeks: number, totalWeeks: number): number {
    return totalWeeks < 4 ? this.pricing.shortTermPriceRatios[String(weeks)] ?? weeks / 4 : weeks / 4;
  }
  private coursePrice(row: QuotePlanRow): number {
    return this.fourWeekCoursePrice(row.optionId) * this.ratio(row.weeks, this.quotePlan.courseWeeks);
  }
  private roomPrice(row: QuotePlanRow): number {
    return this.fourWeekRoomPrice(row.optionId) * this.ratio(row.weeks, this.quotePlan.roomWeeks);
  }

  // ---- checks ------------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number { return this.courseContent(courseId)?.minimumWeeks ?? 0; }

  get courseLengthError(): string {
    for (const id of new Set(this.quotePlan.courses.map(row => row.optionId))) {
      const course = this.courseContent(id);
      const minimum = course?.minimumWeeks ?? 0;
      if (course && minimum && this.weeksOfCourse(id) < minimum) return `${course.name}最低报名${minimum}周，请调整周数。`;
    }
    return '';
  }

  private get availabilityError(): string {
    const period = this.uses2027Prices ? '2027/02/15起开课' : '2027/02/15前开课';
    for (const row of this.quotePlan.courses) {
      const course = this.courseContent(row.optionId);
      if (course && this.fourWeekCoursePrice(row.optionId) <= 0) return `${course.name}在${period}时不开设，请改选其他课程。`;
    }
    for (const row of this.quotePlan.rooms) {
      const room = this.roomContent(row.optionId);
      if (!room || this.fourWeekRoomPrice(row.optionId) > 0) continue;
      return this.uses2027Prices && room.price2027Pending
        ? `${room.label}的2027年价格待学校确认，暂不能报价，请改选其他房型或咨询顾问。`
        : `${room.label}在${period}时不再开放，请改选其他房型。`;
    }
    return '';
  }

  get household(): readonly GitcPageStudent[] { return this.householdOf(this); }

  /** The room type this student sleeps in during the week starting on this Sunday. */
  roomAt(weekStart: number): string | undefined {
    return this.quotePlan.rooms.find(row => this.quotePlan.weekStarts([row]).includes(weekStart))?.optionId;
  }

  /** A twin (2) or family triple (3) price needs that many students of the quote in the same room type on the same weeks. */
  private get sharedRoomError(): string {
    for (const row of this.quotePlan.rooms) {
      const room = this.roomContent(row.optionId);
      const share = room?.shareCount ?? 0;
      if (!room || share < 2) continue;
      const shared = this.quotePlan.weekStarts([row]).every(start => {
        const count = this.household.filter(member => member.roomAt(start) === row.optionId).length;
        return count > 0 && count % share === 0;
      });
      if (!shared) return `${room.label}是${share}人同住的每人价格，请用多人报价，由同住的${share}人选同一房型和相同日期。`;
    }
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.availabilityError || this.courseLengthError || this.sharedRoomError;
  }

  // ---- school payment ----------------------------------------------------------------------------

  /** Returning students pay no registration fee (rule for every Philippine school). */
  get registration(): number { return this.returningStudent ? 0 : this.pricing.registrationFee; }
  get tuition(): number { return money(this.quotePlan.total('course')); }
  get accommodation(): number { return money(this.quotePlan.total('room')); }
  /** GITC has no peak-season surcharge and no published offer. */
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;
  readonly promotionDiscountTotal = 0;
  readonly discountNames = '';
  get quoteUsd(): number { return money(this.registration + this.tuition + this.accommodation); }
  get paymentLines(): SchoolPaymentLine[] { return []; }

  // ---- conditions --------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get minorNote(): string { return '未成年学生须由监护人陪同或另行确认监护安排；寒暑假可考虑学校的青少年营地。'; }

  // ---- local fees --------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  /** Months of stay for the visa table: up to 4 weeks is 1 month, 5–8 weeks 2 months, and so on (24 weeks = 6). */
  get stayMonths(): number { return Math.max(1, Math.ceil(this.quotePlan.stayWeeks / 4)); }

  private feeRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  private get visaTotal(): number {
    const rule = this.feeRule('visa-extension');
    const table = this.visaType === 'tourist59' ? rule?.tourist59Rates ?? GITC_VISA_TOTALS_59 : rule?.rates ?? GITC_VISA_TOTALS_30;
    return table[Math.min(table.length - 1, this.stayMonths - 1)] ?? 0;
  }

  /** ACR I-Card comes with the first extension: from week 5 on a 30-day entry, from week 9 on a 59-day entry. */
  private get needsAcr(): boolean {
    return this.quotePlan.stayWeeks > (this.visaType === 'tourist59' ? 8 : 4);
  }

  private get onCampusWeeks(): number {
    return this.quotePlan.rooms
      .filter(row => this.roomContent(row.optionId)?.location === '校内')
      .reduce((sum, row) => sum + row.weeks, 0);
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
    const stayWeeks = plan.stayWeeks;
    const facilityRule = this.feeRule('facility');
    const utilityRule = this.feeRule('utilities-cebu');
    const onCampus = this.onCampusWeeks;
    const pickupId = this.pickup === 'none' ? '' : `pickup-${this.pickup}`;
    return [
      ...(pickupId ? create(pickupId, 1) : []),
      ...create('facility', Math.round(stayWeeks / 4 * 100) / 100, {
        total: gitcPeriodFee(stayWeeks, facilityRule?.amount ?? 5000, GITC_FACILITY_PARTIAL),
      }),
      ...(this.campus === 'cebu' && onCampus
        ? create('utilities-cebu', Math.round(onCampus / 4 * 100) / 100, {
          total: gitcPeriodFee(onCampus, utilityRule?.amount ?? 7000, GITC_UTILITY_PARTIAL),
        })
        : []),
      ...create('ssp', 1, { visa: true }),
      ...create('ssp-i-card', 1, { visa: true }),
      ...create('visa-extension', visaTotal ? 1 : 0, { visa: true, total: visaTotal, note: visaNote, unit: '按停留月数' }),
      ...create('acr-i-card', this.needsAcr ? 1 : 0, { visa: true }),
      ...create('student-id', 1),
      ...create('books', Math.ceil(plan.courseWeeks / 4)),
    ];
  }
}

export class GitcQuote extends PhSchoolQuote<GitcPageStudent> {
  constructor(pricing: GitcQuotePricing, campus: GitcCampus) {
    const holder: { quote?: GitcQuote } = {};
    const names = GITC_CAMPUS_NAMES[campus];
    super(pricing, {
      createStudent: () => new GitcPageStudent(pricing, campus, student => {
        const group = holder.quote?.activeStudents ?? [];
        return group.includes(student) ? group : [student];
      }),
      headingPrefix: names.short,
      image: { schoolCode: 'GITC', schoolName: names.full, filePrefix: names.file, heroSrc: names.hero },
      priceMultiplier: weeks => pricing.shortTermPriceRatios[String(weeks)] ?? weeks / 4,
      layoutVersion: 2,
    });
    holder.quote = this;
  }
}

/** The comparison prices one person, so it leaves out shared-room prices and rooms the school has not priced. */
const onePersonRooms = (pricing: GitcQuotePricing): GitcQuotePricing => new Proxy(pricing, {
  get: (target, key) => key === 'roomFees'
    ? target.roomFees.filter(room => {
      const content = target.gitcRooms.find(item => item.id === room.id);
      return !(content?.shareCount && content.shareCount > 1);
    })
    : Reflect.get(target, key),
});

export class GitcPlanComparison extends PhPlanComparison<GitcPageStudent> {
  constructor(page: GitcQuotePricing, campus: GitcCampus, conditions: () => GitcPageStudent) {
    const pricing = onePersonRooms(page);
    super(pricing, conditions, {
      createStudent: () => new GitcPageStudent(pricing, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.pickup = from.pickup;
      },
      heading: `${GITC_CAMPUS_NAMES[campus].short} 方案对比报价`,
      courseGroups: GITC_COMPARE_COURSE_GROUPS[campus],
      extraNotes: () => campus === 'iloilo' ? ['双人房和家庭三人房须同行亲友同住，请用多人报价计算。'] : [],
      layoutVersion: 2,
    });
  }
}
