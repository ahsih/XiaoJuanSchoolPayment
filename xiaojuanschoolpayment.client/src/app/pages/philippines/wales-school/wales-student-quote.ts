import {
  SCHOOL_VISA_OPTIONS,
  SchoolLocalFee,
  SchoolPaymentLine,
  SchoolVisaType,
} from '../../../components/school-group-quote';
import { QuotePlanRow, SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';

export interface WalesCoursePrice {
  id: string;
  name: string;
  tuition: number;
  suitable: string;
  note: string;
  minWeeks?: number;
  maxWeeks?: number;
}

export interface WalesRoomPrice {
  id: string;
  name: string;
  fee: number;
  note: string;
}

export interface WalesQuotePrices {
  courseFees: WalesCoursePrice[];
  roomFees: WalesRoomPrice[];
  registrationFee: number;
}

export type WalesStudentStatus = 'new' | 'current' | 'returning';
export type WalesPickupType = 'none' | 'manila-group' | 'clark-group' | 'manila-private' | 'clark-private';

const DAY = 86_400_000;
const LONG_STAY_DISCOUNTS: Readonly<Record<number, number>> = { 8: 200, 12: 300, 16: 400, 20: 550, 24: 700 };

/** One WALES student owns their independent profile, periods, fees and promotions. */
export class WalesStudentQuote {
  readonly weekOptions = [4, 6, 8, 12, 16, 20, 24];
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  age = 18;
  studentStatus: WalesStudentStatus = 'new';
  selectedRegistrationDate = '2026-09-07';
  visaType: SchoolVisaType = 'tourist59';
  selectedPickup: WalesPickupType = 'none';

  readonly quotePlan = new SchoolQuotePlan(
    'eep-lite',
    'share-type-double',
    '2026-09-13',
    this.weekOptions,
    (kind) => kind === 'course'
      ? this.prices.courseFees.map((course) => ({
        id: course.id,
        name: course.name,
        details: `${course.suitable}；${course.note}`,
      }))
      : this.prices.roomFees.map((room) => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => this.rowPrice(kind, row),
  );

  constructor(private readonly prices: WalesQuotePrices) {}

  get courseFees() { return this.prices.courseFees; }
  get roomFees() { return this.prices.roomFees; }
  get registrationFee() { return this.prices.registrationFee; }
  get registrationAmount() { return this.registrationFee; }
  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }
  get isLongTermVisa() { return ['student', 'work', 'srrv', 'sirv'].includes(this.visaType); }
  get initialVisaDays(): 30 | 59 { return this.visaType === 'tourist30' ? 30 : 59; }
  get tuitionTotal() { return this.quotePlan.total('course'); }
  get accommodationTotal() { return this.quotePlan.total('room'); }

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (!Number.isInteger(this.age) || this.age < 1 || this.age > 100) return '请填写1–100岁的抵达时实际年龄。';
    if (!['new', 'current', 'returning'].includes(this.studentStatus)) return '请选择有效的学生身份。';
    if (!this.quotePlan.date(this.selectedRegistrationDate)) return '请选择有效的报名注册日期。';
    if (this.selectedRegistrationDate > this.quotePlan.startDate) return '报名注册日期不能晚于当前方案最早开始日期。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.isLongTermVisa) return `${this.visaLabel}的SSP、SSP I-CARD、ACR及续签规则未在WALES资料中明确，须由顾问确认后才能生成报价图片。`;
    for (const row of this.quotePlan.courses) {
      if (row.optionId === 'pte' && ![4, 8, 12].includes(row.weeks)) return 'PTE每条课程仅开放4、8或12周。';
      if (row.optionId === 'ielts-guarantee' && ![8, 12, 16, 20, 24].includes(row.weeks)) return 'IELTS Guarantee每条课程仅开放8、12、16、20或24周。';
    }
    return '';
  }

  get hasSixWeekPeriod() {
    return [...this.quotePlan.courses, ...this.quotePlan.rooms].some((row) => row.weeks === 6);
  }

  get hasCourseGap(): boolean {
    const rows = [...this.quotePlan.courses].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return rows.some((row, index) => index > 0 && this.nextDay(this.quotePlan.end(rows[index - 1])) !== row.startDate);
  }

  get yearEndEligibleRooms(): QuotePlanRow[] {
    if (this.studentStatus === 'current') return [];
    return this.quotePlan.rooms.filter((row) =>
      (row.startDate === '2026-11-29' && [4, 6].includes(row.weeks)) ||
      (row.startDate === '2026-12-13' && row.weeks === 4));
  }

  get yearEndAccommodationDiscount(): number {
    return this.roundMoney(this.yearEndEligibleRooms.reduce((sum, row) => sum + this.rowPrice('room', row) * 0.4, 0));
  }

  get baseLongStayDiscount(): number {
    return LONG_STAY_DISCOUNTS[this.quotePlan.courseWeeks] ?? 0;
  }

  get longStayCandidate(): boolean {
    return this.studentStatus === 'new' &&
      this.selectedRegistrationDate >= '2025-08-01' &&
      this.selectedRegistrationDate <= this.firstCourseStart &&
      this.isBesaGroupArrival(this.firstCourseStart) &&
      this.baseLongStayDiscount > 0 &&
      this.yearEndAccommodationDiscount === 0;
  }

  get isLongStayPromotionEligible(): boolean {
    return this.longStayCandidate && !this.hasCourseGap;
  }

  get peakSeasonOverlapWeeks(): number {
    return this.isLongStayPromotionEligible
      ? this.quotePlan.overlapWeeks('2026-06-28', '2026-08-08', this.quotePlan.courses)
      : 0;
  }

  get peakSeasonDiscountReduction(): number {
    return Math.floor(this.peakSeasonOverlapWeeks / 2) * 50;
  }

  get longStayDiscountAmount(): number {
    return this.isLongStayPromotionEligible
      ? Math.max(0, this.baseLongStayDiscount - this.peakSeasonDiscountReduction)
      : 0;
  }

  get promotionWarning(): string {
    if (this.longStayCandidate && this.hasCourseGap) {
      return '多条课程之间存在空档，长周数优惠未自动套用；请由顾问向WALES确认是否仍可合并计算。';
    }
    return '';
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      ...(this.yearEndAccommodationDiscount > 0 ? [{
        icon: '惠',
        label: '2026年末住宿六折优惠',
        value: -this.yearEndAccommodationDiscount,
        note: `仅本学生符合的${this.yearEndEligibleRooms.length}条住宿按六折；限10名、在校生不适用、不与其他优惠叠加，名额须由学校确认。`,
        promotionKey: 'wales-year-end-2026',
      }] : []),
      ...(this.longStayDiscountAmount > 0 ? [{
        icon: '惠',
        label: '长周数优惠',
        value: -this.longStayDiscountAmount,
        note: this.peakSeasonDiscountReduction > 0
          ? `${this.quotePlan.courseWeeks}周原优惠${this.baseLongStayDiscount}美元；旺季重叠${this.peakSeasonOverlapWeeks}周，优惠减少${this.peakSeasonDiscountReduction}美元。`
          : `${this.quotePlan.courseWeeks}个连续课程周优惠${this.baseLongStayDiscount}美元；最终以学校确认活动有效为准。`,
        promotionKey: 'wales-long-stay',
      }] : []),
    ];
  }

  get quoteUsd(): number {
    return Math.max(0, this.roundMoney(
      this.registrationAmount + this.tuitionTotal + this.accommodationTotal
      - this.yearEndAccommodationDiscount - this.longStayDiscountAmount,
    ));
  }

  get visaExtensionCount(): number {
    if (this.isLongTermVisa) return 0;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - this.initialVisaDays) / 30));
  }

  get visaExtensionTotal(): number {
    return this.visaExtensionCount > 0 ? 6410 + (this.visaExtensionCount - 1) * 4440 : 0;
  }

  get pickupAmount(): number {
    return ({ none: 0, 'manila-group': 3000, 'clark-group': 3000, 'manila-private': 12000, 'clark-private': 8000 } as const)[this.selectedPickup];
  }

  get pickupLabel(): string {
    return ({
      none: '不需要接机',
      'manila-group': '马尼拉团体接机',
      'clark-group': '克拉克团体接机',
      'manila-private': '马尼拉个人接机',
      'clark-private': '克拉克个人接机',
    } as const)[this.selectedPickup];
  }

  get localFees(): SchoolLocalFee[] {
    const roomPeriods = this.quotePlan.roomWeeks / 4;
    const extensions = this.visaExtensionCount;
    const visaUnconfirmed = this.isLongTermVisa;
    const fees: SchoolLocalFee[] = [
      {
        item: 'SSP特殊学习许可证', unitLabel: visaUnconfirmed ? '待顾问确认' : '7,800比索／次',
        quantity: visaUnconfirmed ? 0 : 1, total: visaUnconfirmed ? 0 : 7800,
        note: visaUnconfirmed ? `${this.visaLabel}规则未由WALES明确，暂不计入且不代表免收。` : '学校2026价表列示的一次性特别学习许可费用。',
      },
      {
        item: 'SSP I-CARD', unitLabel: visaUnconfirmed ? '待顾问确认' : '4,500比索／次',
        quantity: visaUnconfirmed ? 0 : 1, total: visaUnconfirmed ? 0 : 4500,
        note: visaUnconfirmed ? `${this.visaLabel}规则未由WALES明确，暂不计入且不代表免收。` : '学校2026价表列示的一次性SSP身份卡费用。',
      },
      {
        item: '签证续签', unitLabel: visaUnconfirmed ? '待顾问确认' : extensions > 1 ? '首次6,410；其后4,440比索／30天' : '首次6,410比索／30天',
        quantity: extensions, total: visaUnconfirmed ? 0 : this.visaExtensionTotal,
        note: visaUnconfirmed ? `${this.visaLabel}续签规则未由WALES明确，暂不计入且不代表免收。` : `按${this.initialVisaDays}天旅游签证及${this.quotePlan.stayWeeks}周完整停留跨度估算；以实际获准停留期限为准。`,
      },
      {
        item: 'ACR I-CARD', unitLabel: visaUnconfirmed ? '待顾问确认' : '4,000比索／次',
        quantity: visaUnconfirmed ? 0 : extensions > 0 ? 1 : 0, total: visaUnconfirmed ? 0 : extensions > 0 ? 4000 : 0,
        note: visaUnconfirmed ? `${this.visaLabel}规则未由WALES明确，暂不计入且不代表免收。` : '首次需要签证续签时计入。',
      },
      { item: '管理费', unitLabel: '1,000比索／4住宿周', quantity: roomPeriods, total: 1000 * roomPeriods, note: '按本学生全部住宿周数比例计算。' },
      { item: '水电费', unitLabel: '3,500比索／4住宿周', quantity: roomPeriods, total: 3500 * roomPeriods, note: '按本学生全部住宿周数比例计算。' },
      { item: '学生证', unitLabel: '300比索／次', quantity: 1, total: 300, note: '每名学生一次性费用。' },
      { item: '宿舍保证金', unitLabel: '5,000比索／人', quantity: 1, total: 5000, note: '每名学生分别计入；符合退还条件时按校方规定退回。' },
      ...this.courseFeeRows(),
      {
        item: '机场接机',
        unitLabel: this.selectedPickup === 'none' ? '未选择' : `${quoteMoney(this.pickupAmount)}比索／次`,
        quantity: this.selectedPickup === 'none' ? 0 : 1,
        total: this.pickupAmount,
        note: `${this.pickupLabel}；按本学生选择计算，团体接机按学校BESA接机日安排，个人接机须提前确认。`,
      },
    ];
    return fees.map((fee) => ({ ...fee, total: this.roundMoney(fee.total) }));
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }

  private courseFeeRows(): SchoolLocalFee[] {
    const multiple = this.quotePlan.courses.length > 1;
    return this.quotePlan.courses.flatMap((row, index) => {
      const course = this.courseFees.find((item) => item.id === row.optionId);
      const textbookUnit = ['eep-lite', 'eep', 'infinity-lite'].includes(row.optionId) ? 1500 : 2000;
      const rows: SchoolLocalFee[] = [{
        item: multiple ? `教材费 · 课程${index + 1}` : '教材费',
        unitLabel: `${quoteMoney(textbookUnit)}比索／4课程周`,
        quantity: row.weeks / 4,
        total: textbookUnit * row.weeks / 4,
        note: `${course?.name ?? '所选课程'}｜${row.startDate.replace(/-/g, '/')}–${this.quotePlan.end(row).replace(/-/g, '/')}，按本课程行分别计算。`,
      }];
      if (row.optionId === 'pte') {
        const amount = ({ 4: 8000, 8: 9000, 12: 11000 } as Record<number, number>)[row.weeks] ?? 0;
        rows.push({
          item: multiple ? `PTE模拟考试及当地费用 · 课程${index + 1}` : 'PTE模拟考试及当地费用',
          unitLabel: `${quoteMoney(amount)}比索／期`, quantity: amount > 0 ? 1 : 0, total: amount,
          note: `${row.weeks}周PTE课程专属费用；学校价表4/8/12周分别列8,000/9,000/11,000比索。`,
        });
      }
      if (row.optionId === 'ielts-guarantee') {
        rows.push({
          item: multiple ? `IELTS Guarantee考试及当地费用 · 课程${index + 1}` : 'IELTS Guarantee考试及当地费用',
          unitLabel: '18,000比索／期', quantity: 1, total: 18000,
          note: `${row.weeks}周IELTS Guarantee课程专属费用；考试及保证条件须向学校确认。`,
        });
      }
      return rows;
    });
  }

  private get firstCourseStart(): string {
    return this.quotePlan.courses.map((row) => row.startDate).sort()[0] ?? '';
  }

  private rowPrice(kind: 'course' | 'room', row: QuotePlanRow): number {
    const rate = kind === 'course'
      ? this.courseFees.find((course) => course.id === row.optionId)?.tuition ?? 0
      : this.roomFees.find((room) => room.id === row.optionId)?.fee ?? 0;
    return this.roundMoney(rate * row.weeks / 4);
  }

  private nextDay(value: string): string {
    const date = this.quotePlan.date(value);
    return date === null ? '' : new Date(date + DAY).toISOString().slice(0, 10);
  }

  private isBesaGroupArrival(value: string): boolean {
    const date = this.quotePlan.date(value);
    const first = this.quotePlan.date('2025-08-10');
    const last = this.quotePlan.date('2026-12-27');
    if (date === null || first === null || last === null || new Date(date).getUTCDay() !== 0 || date < first || date > last) return false;
    return Math.round((date - first) / DAY) % 28 === 0;
  }

  private roundMoney(value: number): number { return Math.round(value * 100) / 100; }
}
