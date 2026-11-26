// CampusTop on the shared Philippine school quote and plan comparison, one campus per page. Courses are priced by
// class days and rooms by nights, as the school's own quote system does (qq-pricing.ts); meals, pickup and the 2027
// meal and companion rules are calculated here per student. The template's PhSchoolQuote and PhPlanComparison only
// add students up and lay out the result. Keep this file free of Angular, DOM and storage access, so the WeChat mini
// program can bundle it later.
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { QQ_RETURNING_RULE_ID } from './qq-content-config';
import { QQ_PAGE_CONTENT } from './qq-page-content';
import {
  QQ_2026_MEAL_RULE_UNTIL,
  QQ_CAMPUS_NAMES,
  QQ_EXTRA_DAY_FEE,
  QQ_GROUP_PACKAGE_IDS,
  QQ_MEAL_DAILY,
  QQ_PEAK_2027,
  QQ_PEAK_MINIMUM,
  QQ_PICKUP_FEE,
  QQ_ROOMS,
  qqClassDays,
  qqClosedWeekdays,
  qqCoursePrice,
  qqFourWeekPrice,
  qqFourWeekRoomPrice,
  qqHolidayClassDays,
  qqMealPrice,
  qqRoomPrice,
  qqStayDays,
  qqVisaFee,
  type QqCampus,
} from './qq-pricing';

const DAY = 86400000;
const HOTEL_IDS = QQ_ROOMS.filter(room => room.group === '合作酒店').map(room => room.id);
const FIFTEEN_PLUS_ROOM_IDS = QQ_ROOMS.filter(room => room.fifteenPlus).map(room => room.id);

/** Everything CampusTop's quote reads; the page component is one. */
export interface QqQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
}

export const QQ_COMPARE_COURSE_GROUPS: ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }> = [
  { id: 'one-to-one', label: '纯一对一', courseIds: ['one4', 'one6', 'one8'] },
  { id: 'with-group', label: '一对一 + 小团课', courseIds: ['one4-group2', 'one6-group2'] },
];

const formatPhp = (value: number): string => `${Math.round(value).toLocaleString('en-US')} 比索`;
const roundCents = (value: number): number => Math.round(value * 100) / 100;
const isoDay = (time: number): string => new Date(time).toISOString().slice(0, 10);
const todayIso = (): string => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** Age bands the school's rules use: under 15 (one-to-one only, a guardian at school), 15–17 and 18 or older. */
export type QqAgeBand = 'adult' | 'teen' | 'child';
export type QqMealChoice = 'buy' | 'skip-2026';

interface QqExtraChoice<T> extends PhExtraChoice {
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

/** One CampusTop student: plan, conditions and every amount the template and quote image show. */
export class QqPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly extraChoices: readonly PhExtraChoice[];
  readonly hideAgeGroup = true;
  visaType = 'tourist30';
  returningStudent = false;
  ageBand: QqAgeBand = 'adult';
  meals: QqMealChoice = 'buy';
  pickup = true;
  /** Hotel room shared with another student of this quote, who pays the room. */
  sharesRoom = false;
  /** Guardians at school who do not study (children under 15 only). */
  companions = 1;

  constructor(private readonly pricing: QqQuotePricing, readonly campus: QqCampus) {
    const student = this;
    this.quotePlan = new SchoolQuotePlan(
      'one4', 'capsule', nextQuoteSunday(), [1, 2, 3],
      kind => kind === 'course'
        ? pricing.courseFees.map(option => ({ id: option.id, name: option.name, details: option.schedule }))
        : pricing.roomFees.map(option => ({ id: option.id, name: option.name, details: option.note })),
      (kind, row) => student.rowPrice(kind, row),
      24, true,
      // Exact class-day and night prices per row, not a share of a four-week price.
      false,
    );
    const choice = <T>(value: QqExtraChoice<T>): QqExtraChoice<T> => value;
    this.extraChoices = [
      choice<QqAgeBand>({
        label: '抵达时年龄',
        options: [{ value: 'adult', label: '18岁及以上' }, { value: 'teen', label: '15–17岁' }, { value: 'child', label: '4–14岁' }],
        inComparison: true,
        visible: true,
        get note() {
          return student.ageBand === 'child'
            ? '4–14岁只能报一对一课程，不能住太空舱宿舍，必须有一位监护人在校陪同。'
            : student.ageBand === 'teen' ? '15–17岁可以单独来读，不强制监护人陪同。' : '18岁及以上的学生，学校不允许陪同人员在校。';
        },
        get value() { return student.ageBand; },
        set value(value: QqAgeBand) { student.ageBand = value; },
      }),
      choice<number>({
        label: '陪同家长（不上课）',
        options: [{ value: 1, label: '1人' }, { value: 2, label: '2人' }, { value: 0, label: '家长也报名上课' }],
        inComparison: true,
        get visible() { return student.ageBand === 'child'; },
        get note() {
          return student.companions === 0
            ? '家长也上课时请用多人报价加上家长；家长的课程不能多于孩子，午休时间要一致；旺季不能再有不上课的人陪同。'
            : '陪同家长不上课：淡季也必须订餐，7/11–8/14旺季不能订餐；7–8月最多1人陪同。';
        },
        get value() { return student.companions; },
        set value(value: number) { student.companions = value; },
      }),
      choice<QqMealChoice>({
        label: '餐食',
        options: [{ value: 'buy', label: '订餐（2027年起必须订）' }, { value: 'skip-2026', label: '不订餐（2026/12/31前报名）' }],
        inComparison: true,
        visible: true,
        get note() {
          return student.meals === 'buy'
            ? '学校餐厅一日三餐，从第一个上课日算到最后一个上课日：读1周105美元，2周以上每天10美元。'
            : '2026年12月31日（含）前提交报名的，2027年入学仍可按2026年规则不订餐。';
        },
        get value() { return student.meals; },
        set value(value: QqMealChoice) { student.meals = value; },
      }),
      choice<boolean>({
        label: '接机',
        options: [{ value: true, label: '需要接机' }, { value: false, label: '不需要' }],
        inComparison: true,
        visible: true,
        note: '宿务机场接机每人30美元，开课当天或前一天，送到学校或校区附近的酒店、公寓。',
        get value() { return student.pickup; },
        set value(value: boolean) { student.pickup = value; },
      }),
      choice<boolean>({
        label: '酒店房间',
        options: [{ value: false, label: '单独一间' }, { value: true, label: '和同行学员同住' }],
        inComparison: false,
        get visible() { return student.quotePlan.rooms.some(row => HOTEL_IDS.includes(row.optionId)); },
        note: '酒店按间收费；和同行学员同住时，房费算在同住学员的报价里，本人不再计房费。',
        get value() { return student.sharesRoom; },
        set value(value: boolean) { student.sharesRoom = value; },
      }),
    ];
  }

  get selectedAgeGroup(): 'adult' | 'minor' { return this.ageBand === 'adult' ? 'adult' : 'minor'; }
  set selectedAgeGroup(value: 'adult' | 'minor') { this.ageBand = value === 'adult' ? 'adult' : this.ageBand === 'adult' ? 'teen' : this.ageBand; }

  // ---- prices of plan rows ----------------------------------------------------------------------

  /** A course row: class days of its weeks; a room row: its nights (the last row ends on the leaving Saturday). */
  private rowPrice(kind: QuotePlanKind, row: QuotePlanRow): number {
    if (kind === 'course') {
      const price = qqCoursePrice(row.optionId, qqClassDays(this.campus, row.startDate, row.weeks));
      return roundCents(price * this.editedRatio(this.pricing.courseFees.find(item => item.id === row.optionId)?.tuition2027, qqFourWeekPrice(row.optionId)));
    }
    if (this.sharesRoom && HOTEL_IDS.includes(row.optionId)) return 0;
    const price = qqRoomPrice(row.optionId, row.startDate, this.roomNights(row), this.capsuleNights);
    return roundCents(price * this.editedRatio(this.pricing.roomFees.find(item => item.id === row.optionId)?.fee, qqFourWeekRoomPrice(row.optionId)));
  }

  /** A four-week price an employee changed in the content document scales the school's day or night rates. */
  private editedRatio(published: number | undefined, standard: number): number {
    return published && standard && published !== standard ? published / standard : 1;
  }

  private roomNights(row: QuotePlanRow): number {
    const last = this.quotePlan?.rooms.at(-1);
    return row.weeks * 7 - (last && last.id === row.id ? 1 : 0);
  }

  /** Nights in the capsule dormitory over the whole stay (sets its nightly rate). */
  get capsuleNights(): number {
    return (this.quotePlan?.rooms ?? []).filter(row => row.optionId === 'capsule').reduce((sum, row) => sum + this.roomNights(row), 0);
  }

  minimumWeeks(): number { return 0; }

  private courseName(id: string): string {
    return this.pricing.courseFees.find(item => item.id === id)?.name ?? id;
  }

  /** First class day (the Monday after arrival) and last class day (the Friday before leaving). */
  private get classSpan(): { first: number; last: number } | null {
    const starts = this.quotePlan.weekStarts();
    if (!starts.length) return null;
    return { first: starts[0] + DAY, last: starts.at(-1)! + 5 * DAY };
  }

  private daysInSpan(filter: (day: string) => boolean): number {
    const span = this.classSpan;
    if (!span) return 0;
    let days = 0;
    for (let time = span.first; time <= span.last; time += DAY) if (filter(isoDay(time))) days++;
    return days;
  }

  private static inPeak(day: string): boolean { return day >= QQ_PEAK_2027.start && day <= QQ_PEAK_2027.end; }

  private get touchesPeakMonths(): boolean {
    const span = this.classSpan;
    if (!span) return false;
    const first = isoDay(span.first - DAY), last = isoDay(span.last + DAY);
    return first <= '2027-08-31' && last >= '2027-07-01';
  }

  get courseLengthError(): string {
    const group = this.quotePlan.courses.find(row => QQ_GROUP_PACKAGE_IDS.includes(row.optionId));
    if (group && this.ageBand === 'child') return `${this.courseName(group.optionId)}含小团课，只收15岁以上学生；4–14岁请选4节、6节或8节一对一。`;
    if (this.ageBand === 'child' && this.quotePlan.rooms.some(row => FIFTEEN_PLUS_ROOM_IDS.includes(row.optionId))) {
      return '太空舱宿舍只收15岁以上学生，4–14岁请选学校的合作酒店。';
    }
    const span = this.classSpan;
    if (span) {
      const firstDay = isoDay(span.first);
      if (firstDay >= QQ_PEAK_MINIMUM.start && firstDay <= QQ_PEAK_MINIMUM.end && this.quotePlan.courseWeeks < QQ_PEAK_MINIMUM.weeks) {
        return '2027/07/25–08/07入学的学生最少报名2周。';
      }
    }
    if (this.ageBand === 'child' && this.companions > 1 && this.touchesPeakMonths) return '7–8月旺季最多1名陪同家长，请改为1人。';
    if (this.meals === 'skip-2026' && todayIso() > QQ_2026_MEAL_RULE_UNTIL) return '2027年起所有学生必须订餐，请选择“订餐”。';
    return '';
  }

  get quoteError(): string {
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    return this.quotePlan.error || this.courseLengthError;
  }

  get minorNote(): string {
    return '4–14岁只能报一对一，不能住太空舱，须有监护人在校陪同；15–17岁可以单独来读。';
  }

  // ---- school payment ---------------------------------------------------------------------------

  private enabledRule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }

  get registration(): number {
    return this.returningStudent && this.enabledRule(QQ_RETURNING_RULE_ID) ? 0 : this.pricing.registrationFee;
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  readonly peakWeeks = 0;
  readonly seasonalSurcharge = 0;
  readonly promotionDiscountTotal = 0;
  readonly discountNames = '';

  /** Under 15 with a guardian who does not study: no meals in the 2027 peak (7/11–8/14). */
  private get childWithoutMealsInPeak(): boolean { return this.ageBand === 'child' && this.companions > 0; }

  /** Calendar days from the first to the last class day on which this student buys meals. */
  get mealDays(): number {
    if (this.meals !== 'buy') return 0;
    return this.daysInSpan(day => !(this.childWithoutMealsInPeak && QqPageStudent.inPeak(day)));
  }

  get mealFee(): number {
    const allDays = this.daysInSpan(() => true);
    const days = this.mealDays;
    if (!days) return 0;
    return days === allDays ? qqMealPrice(this.quotePlan.courseWeeks, days) : QQ_MEAL_DAILY * days;
  }

  /** Guardians who do not study buy meals outside the peak (2027 rule), at 10 dollars a day. */
  get companionCount(): number { return this.ageBand === 'child' ? this.companions : 0; }
  get companionMealDays(): number {
    if (this.meals !== 'buy' || !this.companionCount) return 0;
    return this.daysInSpan(day => !QqPageStudent.inPeak(day));
  }
  get companionMealFee(): number {
    const days = this.companionMealDays;
    if (!days) return 0;
    const allDays = this.daysInSpan(() => true);
    const each = days === allDays ? qqMealPrice(this.quotePlan.courseWeeks, days) : QQ_MEAL_DAILY * days;
    return each * this.companionCount;
  }

  /** Philippine holidays with class inside the course; the school adds 35 dollars for each (Holiday Fee). */
  get holidayClassDays(): string[] {
    return this.quotePlan.courses.flatMap(row => qqHolidayClassDays(this.campus, row.startDate, row.weeks));
  }
  get holidayFee(): number { return this.holidayClassDays.length * QQ_EXTRA_DAY_FEE; }

  get pickupFee(): number { return this.pickup ? QQ_PICKUP_FEE * (1 + this.companionCount) : 0; }

  get quoteUsd(): number {
    return Math.max(0, roundCents(this.registration + this.tuition + this.accommodation + this.mealFee + this.companionMealFee + this.holidayFee + this.pickupFee));
  }

  /** Class days and the closed holidays inside the course, for the course note. */
  get classDaysText(): string {
    const days = this.quotePlan.courses.reduce((sum, row) => sum + qqClassDays(this.campus, row.startDate, row.weeks), 0);
    const closed = this.quotePlan.courses.flatMap(row => qqClosedWeekdays(this.campus, row.startDate, row.weeks));
    const closedText = closed.length ? `，其中${closed.map(day => day.slice(5).replace('-', '/')).join('、')}学校停课不收费` : '';
    return `共${days}个上课日${closedText}`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    const lines: SchoolPaymentLine[] = [];
    if (this.mealFee) {
      const partial = this.childWithoutMealsInPeak && this.mealDays < this.daysInSpan(() => true);
      lines.push({
        icon: '餐', label: '餐食费', value: this.mealFee,
        note: `学校餐厅一日三餐，${this.mealDays}天${partial ? '（7/11–8/14旺季不上课家长陪同的孩子不能订餐）' : ''}；读1周105美元，2周以上每天10美元`,
      });
    }
    if (this.companionMealFee) {
      lines.push({
        icon: '餐', label: `陪同家长餐食费（${this.companionCount}人）`, value: this.companionMealFee,
        note: `2027年起不上课的陪同家长也必须订餐，每人${this.companionMealDays}天；7/11–8/14旺季不能订餐`,
      });
    }
    if (this.holidayFee) {
      const days = this.holidayClassDays.map(day => day.slice(5).replace('-', '/')).join('、');
      lines.push({ icon: '假', label: '公众假期上课费', value: this.holidayFee, note: `${days}是菲律宾公众假期，学校照常上课，每天另收35美元` });
    }
    if (this.pickupFee) {
      lines.push({ icon: '车', label: '宿务机场接机', value: this.pickupFee, note: `每人30美元${this.companionCount ? `，含陪同家长${this.companionCount}人` : ''}` });
    }
    return lines;
  }

  // ---- conditions -------------------------------------------------------------------------------

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  // ---- local fees -------------------------------------------------------------------------------

  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(item => item.id === id && item.enabled);
  }

  get stayDays(): number { return qqStayDays(this.quotePlan.stayWeeks); }

  get localFees(): SchoolLocalFee[] {
    const longTerm = this.longTermVisa;
    const longTermNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const create = (id: string, quantity: number, total: number, unitLabel: string, note?: string): SchoolLocalFee[] => {
      const rule = this.rule(id);
      return rule ? [{ item: rule.name, unitLabel, quantity, total, note: note ?? rule.note }] : [];
    };
    const ssp = this.rule('ssp')?.amount ?? 0;
    const acr = this.rule('acr-i-card')?.amount ?? 0;
    const id = this.rule('student-id')?.amount ?? 0;
    const power = this.rule('electricity')?.amount ?? 0;
    const visaTourist = this.visaType === 'tourist59' ? 'tourist59' : 'tourist30';
    const visaTotal = longTerm ? 0 : qqVisaFee(visaTourist, this.stayDays);
    const visaNote = longTerm ? longTermNote
      : `按${this.visaLabel}、在菲律宾${this.stayDays}天预估${visaTotal ? '' : '，本次无需续签'}；${this.rule('visa-extension')?.note ?? ''}`;
    const icard = !longTerm && this.stayDays > 59 ? 1 : 0;
    const nights = this.capsuleNights;
    return [
      ...create('visa-extension', visaTotal ? 1 : 0, visaTotal, '按停留天数累计', visaNote),
      ...create('ssp', longTerm ? 0 : 1, longTerm ? 0 : ssp, `${formatPhp(ssp)}／次`, longTerm ? longTermNote : undefined),
      ...create('acr-i-card', icard, icard * acr, `${formatPhp(acr)}／次`, longTerm ? longTermNote : undefined),
      ...create('student-id', 1, id, `${formatPhp(id)}／次`),
      ...create('electricity', nights, nights * power, `${formatPhp(power)}／晚`),
    ].map(item => longTerm && item.quantity === 0 && item.note === longTermNote ? { ...item, waived: true } : item);
  }
}

/** Textbooks: bought at school as the course needs, about 1,000–2,000 pesos, outside the local-fee total. */
function qqOptionalFees(pricing: QqQuotePricing, students: readonly QqPageStudent[]): PhOptionalFeeItem[] {
  const books = pricing.localFeeRules.find(rule => rule.id === 'books' && rule.enabled);
  if (!books) return [];
  const count = students.length;
  const low = (books.secondaryAmount ?? books.amount) * count, high = books.amount * count;
  const cny = (value: number) => quoteCurrencyText(Math.round(value / pricing.phpPerCny), 'zh-CN');
  return [{
    label: books.name,
    amount: `约 ${low.toLocaleString('en-US')}–${high.toLocaleString('en-US')} 比索`,
    cnyAmount: `约人民币 ${cny(low)}–${cny(high)} 元`,
    note: `${books.note}${count > 1 ? `（${count}人）` : ''}`,
  }];
}

export class QqQuote extends PhSchoolQuote<QqPageStudent> {
  constructor(pricing: QqQuotePricing, campus: QqCampus) {
    super(pricing, {
      createStudent: () => new QqPageStudent(pricing, campus),
      headingPrefix: QQ_CAMPUS_NAMES[campus],
      image: {
        schoolCode: 'QQ',
        schoolName: `菲律宾宿务${QQ_CAMPUS_NAMES[campus]}`,
        filePrefix: campus === 'itp' ? 'QQEnglish-IT-Park' : 'QQEnglish-Beach-Front',
        heroSrc: QQ_PAGE_CONTENT[campus].quoteImageHero,
      },
      priceMultiplier: weeks => weeks / 4,
      optionalFeeItems: students => qqOptionalFees(pricing, students),
      layoutVersion: 2,
    });
  }
}

export class QqPlanComparison extends PhPlanComparison<QqPageStudent> {
  constructor(pricing: QqQuotePricing, campus: QqCampus, conditions: () => QqPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new QqPageStudent(pricing, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.ageBand = from.ageBand;
        to.returningStudent = from.returningStudent;
        to.meals = from.meals;
        to.pickup = from.pickup;
        to.companions = from.companions;
      },
      heading: `${QQ_CAMPUS_NAMES[campus]} 方案对比报价`,
      courseGroups: QQ_COMPARE_COURSE_GROUPS,
      peakRate: () => 0,
      extraNotes: () => ['课程费按实际上课天数计算，学校停课的假期不收课程费；餐食和接机已计入学校费用。'],
      layoutVersion: 2,
    });
  }
}
