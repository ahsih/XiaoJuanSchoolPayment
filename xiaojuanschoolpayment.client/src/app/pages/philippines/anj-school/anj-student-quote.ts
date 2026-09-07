import { QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import {
  ANJ_BIRTHDAY_DISCOUNT,
  ANJ_BIRTHDAY_REGISTRATION_START,
  ANJ_CONTINUATION_PERIODS,
  ANJ_NEW_PROMOTION_PERIODS,
  ANJ_WEEK_OPTIONS,
  AnjCourse,
  AnjRoom,
  AnjWeekOption,
} from './anj-pricing';

export type AnjEnrollmentStatus = 'new' | 'continuation';
export type AnjVisaType = 'tourist30' | 'tourist59';
export type AnjPickupAirport = 'none' | 'manila' | 'clark';

export const ANJ_VISA_OPTIONS = [
  { value: 'tourist59', label: '59天旅游签证' },
  { value: 'tourist30', label: '30天旅游签证' },
] as const;

export interface AnjQuotePrices {
  courses: readonly AnjCourse[];
  rooms: readonly AnjRoom[];
  registrationFee: number;
  sidaDiscountRate: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string }[];
  sharedRoomShare?: (student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom, fullPrice: number) => number;
  sharedRoomFactor?: (student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom) => number;
  sharedRoomError?: (student: AnjStudentQuote, row: QuotePlanRow, room: AnjRoom) => string;
  sidaDiscountShare?: (student: AnjStudentQuote, exactDiscount: number) => number;
}

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** A&J-only pricing, promotion and local-fee rules used by the shared quote UI. */
export class AnjStudentQuote {
  constructor(private readonly prices: AnjQuotePrices) {}

  selectedRegistrationDate = localToday();
  birthMonth = 1;
  birthDay = 1;
  enrollmentStatus: AnjEnrollmentStatus = 'new';
  readonly visaOptions = ANJ_VISA_OPTIONS;
  visaType: AnjVisaType = 'tourist59';
  pickupAirport: AnjPickupAirport = 'none';
  readonly weekOptions = ANJ_WEEK_OPTIONS;

  readonly quotePlan = new SchoolQuotePlan(
    'eco-relax-lite',
    'deluxe-triple',
    nextSunday(),
    this.weekOptions,
    (kind) => kind === 'course'
      ? this.prices.courses.map((course) => ({ id: course.id, name: course.name, details: `${course.type}｜${course.lessons}` }))
      : this.prices.rooms.map((room) => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => kind === 'course' ? this.coursePrice(row) : this.roomPrice(row),
  );

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['new', 'continuation'].includes(this.enrollmentStatus)) return '请选择新生或续课状态。';
    if (!this.validBirthday) return '请输入有效的出生月和出生日期。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的入境签证。';
    if (!['none', 'manila', 'clark'].includes(this.pickupAirport)) return '请选择有效的接机安排。';

    for (const row of this.quotePlan.courses) {
      const course = this.course(row.optionId);
      if (course?.allowedWeeks && !course.allowedWeeks.includes(row.weeks as AnjWeekOption)) {
        return `${course.name}仅可选择${course.allowedWeeks.join('、')}周。`;
      }
    }

    for (const row of this.quotePlan.rooms) {
      const room = this.room(row.optionId);
      if (!room || room.priceMode !== 'per-room') continue;
      const error = this.prices.sharedRoomError?.(this, row, room);
      if (error) return error;
      if (!this.prices.sharedRoomError && room.minOccupancy > 1) {
        return `${room.name}须在多人报价中由${room.minOccupancy}名学生选择相同入住日期。`;
      }
    }

    return '';
  }

  get validBirthday(): boolean {
    if (!Number.isInteger(this.birthMonth) || !Number.isInteger(this.birthDay)) return false;
    if (this.birthMonth < 1 || this.birthMonth > 12 || this.birthDay < 1 || this.birthDay > 31) return false;
    const date = new Date(Date.UTC(2000, this.birthMonth - 1, this.birthDay));
    return date.getUTCMonth() === this.birthMonth - 1 && date.getUTCDate() === this.birthDay;
  }

  get firstCourseStart(): string {
    return this.quotePlan.courses.map((row) => row.startDate).filter((value) => this.quotePlan.date(value) !== null).sort()[0] ?? '';
  }

  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get registration() { return this.prices.registrationFee; }
  get registrationDiscount() { return this.prices.registrationFee; }

  get promotionPeriod() {
    if (this.enrollmentStatus !== 'new') return undefined;
    return ANJ_NEW_PROMOTION_PERIODS.find((period) => this.firstCourseStart >= period.start && this.firstCourseStart <= period.end);
  }

  get continuationPeriod() {
    if (this.enrollmentStatus !== 'continuation') return undefined;
    return ANJ_CONTINUATION_PERIODS.find((period) => this.firstCourseStart >= period.start && this.firstCourseStart <= period.end);
  }

  get regularDiscount(): number {
    return this.promotionPeriod?.regularDiscounts[this.quotePlan.courseWeeks as AnjWeekOption] ?? 0;
  }

  get lowSeasonDiscount(): number {
    return (this.promotionPeriod?.lowSeasonPerFourWeeks ?? 0) * Math.floor(this.quotePlan.courseWeeks / 4);
  }

  get birthdayEligible(): boolean {
    if (this.enrollmentStatus !== 'new' || !this.validBirthday || this.quotePlan.courseWeeks < 4) return false;
    if (this.selectedRegistrationDate < ANJ_BIRTHDAY_REGISTRATION_START) return false;
    const admission = this.quotePlan.date(this.firstCourseStart);
    if (admission === null) return false;
    const date = new Date(admission);
    const year = date.getUTCFullYear();
    const admissionMonth = date.getUTCMonth() + 1;
    if (year === 2026) {
      const eligibleEndings = admissionMonth <= 3 ? [3, 6, 9] : admissionMonth <= 6 ? [2, 4, 8] : admissionMonth <= 9 ? [7] : [0, 1, 5];
      return eligibleEndings.includes(this.birthDay % 10);
    }
    return year >= 2027 && admissionMonth === this.birthMonth;
  }

  get birthdayDiscount() { return this.birthdayEligible ? ANJ_BIRTHDAY_DISCOUNT : 0; }

  get continuationDiscount(): number {
    return this.continuationPeriod?.discounts[this.quotePlan.courseWeeks as AnjWeekOption] ?? 0;
  }

  get fixedSchoolDiscounts() {
    return this.enrollmentStatus === 'continuation'
      ? this.continuationDiscount
      : this.regularDiscount + this.birthdayDiscount + this.lowSeasonDiscount;
  }

  get sidaDiscount() {
    const discountedBase = Math.max(0, this.tuition + this.accommodation - this.fixedSchoolDiscounts);
    const exactDiscount = discountedBase * (1 - this.prices.sidaDiscountRate);
    return this.prices.sidaDiscountShare?.(this, exactDiscount) ?? rounded(exactDiscount);
  }

  get peakWeeks(): number {
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter((week) => this.prices.peakSeasonRanges.some((range) => {
      const start = this.quotePlan.date(range.start);
      const end = this.quotePlan.date(range.end);
      return start !== null && end !== null && week <= end && week + 6 * DAY >= start;
    })).length;
  }

  get seasonalSurcharge() { return this.peakWeeks * this.prices.seasonalFeePerWeek; }

  get quoteUsd() {
    return Math.max(0, rounded(
      this.registration + this.tuition + this.accommodation + this.seasonalSurcharge
      - this.registrationDiscount - this.fixedSchoolDiscounts - this.sidaDiscount,
    ));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const peakRanges = this.prices.peakSeasonRanges.filter((range) => this.quotePlan.overlapWeeks(range.start, range.end, this.quotePlan.courses) > 0);
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge,
        note: `${this.prices.seasonalFeePerWeek}美元／学习周 × ${this.peakWeeks}周；${peakRanges.map((range) => `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`).join('；')}；不参与优惠`,
      }] : []),
      { icon: '免', label: '思达免注册费', value: -this.registrationDiscount, note: '通过思达报名，免收一次性100美元注册费', promotionKey: 'registration' },
      ...(this.regularDiscount ? [{
        icon: '惠', label: 'A&J常规优惠', value: -this.regularDiscount,
        note: `${this.promotionPeriod?.label}；按入学日和累计${this.quotePlan.courseWeeks}个课程周计算`, promotionKey: 'anj-regular',
      }] : []),
      ...(this.birthdayDiscount ? [{
        icon: '生', label: 'A&J生日优惠', value: -this.birthdayDiscount,
        note: `${this.birthdayRuleText}；报名不少于4周并须提交生日证明`, promotionKey: 'anj-birthday',
      }] : []),
      ...(this.lowSeasonDiscount ? [{
        icon: '淡', label: 'A&J淡季优惠', value: -this.lowSeasonDiscount,
        note: `${this.promotionPeriod?.lowSeasonPerFourWeeks}美元／完整4课程周 × ${Math.floor(this.quotePlan.courseWeeks / 4)}段；按入学日适用`, promotionKey: 'anj-low-season',
      }] : []),
      ...(this.continuationDiscount ? [{
        icon: '续', label: 'A&J续课优惠', value: -this.continuationDiscount,
        note: `${this.continuationPeriod?.label}；按续课新增课程开始日和新增${this.quotePlan.courseWeeks}周计算，不与新生优惠叠加`, promotionKey: 'anj-continuation',
      }] : []),
      { icon: '折', label: '思达95折', value: -this.sidaDiscount, note: '先扣A&J固定优惠，再对剩余课程费和住宿费按95折计算', promotionKey: 'sida' },
    ];
  }

  get birthdayRuleText(): string {
    const admission = this.quotePlan.date(this.firstCourseStart);
    if (admission === null) return '生日资格待确认';
    const date = new Date(admission);
    if (date.getUTCFullYear() >= 2027) return `入学月份与生日月份同为${this.birthMonth}月`;
    return `出生日期尾数${this.birthDay % 10}符合${date.getUTCMonth() + 1}月入学档期`;
  }

  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  get localFees(): SchoolLocalFee[] {
    const extensions = this.visaExtensionCount;
    const waterFees = new Map<string, SchoolLocalFee>();
    for (const row of this.quotePlan.rooms) {
      const room = this.room(row.optionId);
      if (!room) continue;
      const share = room.priceMode === 'per-room' ? (this.prices.sharedRoomFactor?.(this, row, room) ?? 1) : 1;
      const quantity = (row.weeks / 4) * share;
      const key = `${room.waterGroup}-${room.waterFee4w}`;
      const current = waterFees.get(key);
      const note = `${room.waterGroup}房型按住宿周数估算；超出预计用量另收25比索／kW。`;
      if (current) {
        current.quantity += quantity;
        current.total += room.waterFee4w * quantity;
      } else {
        waterFees.set(key, {
          item: `水电费（${room.waterGroup}）`, unitLabel: `${room.waterFee4w.toLocaleString('en-US')} 比索／4周`,
          quantity, total: room.waterFee4w * quantity, note,
        });
      }
    }

    const textbookPeriods = this.quotePlan.courseWeeks / 4;
    const acr = extensions > 0 ? 1 : 0;
    const manilaPickup = this.pickupAirport === 'manila' ? 1 : 0;
    const clarkPickup = this.pickupAirport === 'clark' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: 1, total: 7800, note: '移民局收取，通常有效6个月；更换学校需要重新办理。' },
      { item: 'SSP-E Card', unitLabel: '4,500 比索／次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I Card 外国人身份证', unitLabel: '4,000 比索／次', quantity: acr, total: acr * 4000, note: `按${this.visaLabel}和完整停留日期预估，第一次需要续签时办理；以学校及移民局要求为准。` },
      ...waterFees.values(),
      { item: '签证续签', unitLabel: '4,940 比索／30天', quantity: extensions, total: extensions * 4940, note: `按${this.visaLabel}及完整停留日期预估；${extensions ? `本次预计续签${extensions}次` : '本次预计无需续签'}，实际以移民局及学校办理为准。` },
      { item: '教材费', unitLabel: '1,500 比索／4课程周', quantity: textbookPeriods, total: 1500 * textbookPeriods, note: '按累计课程周数估算；不同课程所需教材不同，入学后新增教材按实际购买。' },
      { item: '学生证', unitLabel: '200 比索／次', quantity: 1, total: 200, note: '一次性费用。' },
      { item: '马尼拉机场接机', unitLabel: '3,000 比索／次', quantity: manilaPickup, total: manilaPickup * 3000, note: '学生自由选择；指定周日固定时间团体接机。' },
      { item: '克拉克机场接机', unitLabel: '3,000 比索／次', quantity: clarkPickup, total: clarkPickup * 3000, note: '学生自由选择；指定周日固定时间团体接机。' },
    ];
  }

  get uses2027Price() {
    return [...this.quotePlan.courses, ...this.quotePlan.rooms].some((row) => row.startDate >= '2027-01-01');
  }

  get priceYearWarning() {
    return this.uses2027Price ? '当前暂按2026课程及住宿价格估算2027入学方案，最终须以A&J公布的2027价目表确认。' : '';
  }

  get pickupLabel() {
    if (this.pickupAirport === 'manila') return '马尼拉机场接机';
    if (this.pickupAirport === 'clark') return '克拉克机场接机';
    return '不需要学校接机';
  }

  private course(id: string) { return this.prices.courses.find((course) => course.id === id); }
  private room(id: string) { return this.prices.rooms.find((room) => room.id === id); }

  private coursePrice(row: QuotePlanRow): number {
    const course = this.course(row.optionId);
    if (!course) return 0;
    if (course.feeByWeeks) return course.feeByWeeks[row.weeks as AnjWeekOption] ?? 0;
    return rounded((course.fee4w ?? 0) * (row.weeks / 4));
  }

  private roomPrice(row: QuotePlanRow): number {
    const room = this.room(row.optionId);
    if (!room) return 0;
    const fullPrice = rounded(room.fee4w * (row.weeks / 4));
    return room.priceMode === 'per-room'
      ? (this.prices.sharedRoomShare?.(this, row, room, fullPrice) ?? fullPrice)
      : fullPrice;
  }
}
