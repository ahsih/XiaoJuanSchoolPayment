import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';

interface MonolQuotePrices {
  courseFees: { id: string; name: string; tuition: number; suitable: string; note: string }[];
  roomFees: { id: string; name: string; fee: number; note: string }[];
  registrationFee: number;
  registrationDiscount: number;
  offSeasonCourseDiscountPerBlock: number;
  offSeasonRoomDiscountPerBlock: number;
  snsDiscountPerBlock: number;
}

export const MONOL_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

export type MonolVisaType = typeof MONOL_VISA_OPTIONS[number]['value'];
export type MonolPickupAirport = 'none' | 'manila' | 'clark';

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const localToday = () => localDate(new Date());
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return localDate(date);
};

/** MONOL owns its prices and promotions; the shared plan only supplies the CIA-style multi-row UI. */
export class MonolStudentQuote {
  constructor(private readonly prices: MonolQuotePrices) {}

  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = localToday();
  readonly visaOptions = MONOL_VISA_OPTIONS;
  visaType: MonolVisaType = 'tourist59';
  pickupAirport: MonolPickupAirport = 'manila';
  applySnsPromotion = false;
  readonly weekOptions = [2, 3, 4, 8, 12, 16, 20, 24];

  readonly quotePlan = new SchoolQuotePlan(
    'esl-4',
    'quad-room',
    nextSunday(),
    this.weekOptions,
    (kind) => kind === 'course'
      ? this.prices.courseFees.map((course) => ({
          id: course.id,
          name: course.name,
          details: [course.suitable, course.note].filter(Boolean).join('；'),
        }))
      : this.prices.roomFees.map((room) => ({
          id: room.id,
          name: room.name,
          details: [room.note, '住宿费不含餐费'].filter(Boolean).join('；'),
        })),
    (kind, row) => {
      const rate = kind === 'course'
        ? this.prices.courseFees.find((course) => course.id === row.optionId)?.tuition
        : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return rounded((rate ?? 0) * row.weeks / 4);
    },
  );

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['adult', 'minor'].includes(this.selectedAgeGroup)) return '请选择抵达时年龄段。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的入境签证。';
    if (!['none', 'manila', 'clark'].includes(this.pickupAirport)) return '请选择有效的接机安排。';
    return '';
  }

  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get registration() { return this.prices.registrationFee; }
  get registrationDiscount() { return Math.min(this.registration, this.prices.registrationDiscount); }
  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }

  private rowIsOffSeason(row: { startDate: string; weeks: number }): boolean {
    const start = this.quotePlan.date(row.startDate);
    const end = this.quotePlan.date(new Date((start ?? 0) + (row.weeks * 7 - 1) * DAY).toISOString().slice(0, 10));
    const earlyEnd = this.quotePlan.date('2026-06-27');
    const lateStart = this.quotePlan.date('2026-08-23');
    const promotionEnd = this.quotePlan.date('2026-12-31');
    if (start === null || end === null || earlyEnd === null || lateStart === null || promotionEnd === null) return false;
    return end <= earlyEnd || (start >= lateStart && start <= promotionEnd);
  }

  get offSeasonCourseBlocks() {
    return this.quotePlan.courses.reduce((sum, row) => sum + (this.rowIsOffSeason(row) ? Math.floor(row.weeks / 4) : 0), 0);
  }
  get offSeasonRoomBlocks() {
    return this.quotePlan.rooms.reduce((sum, row) => sum + (this.rowIsOffSeason(row) ? Math.floor(row.weeks / 4) : 0), 0);
  }
  get offSeasonCourseDiscount() { return this.offSeasonCourseBlocks * this.prices.offSeasonCourseDiscountPerBlock; }
  get offSeasonRoomDiscount() { return this.offSeasonRoomBlocks * this.prices.offSeasonRoomDiscountPerBlock; }
  get isBreakfastEligible() { return this.offSeasonCourseBlocks > 0; }

  get snsEligibleBlocks(): number {
    const from = this.quotePlan.date('2026-01-01')!;
    const to = this.quotePlan.date('2026-06-27')!;
    const eligibleRooms = this.quotePlan.rooms.filter((room) =>
      ['premium-single-room', 'standard-single-room', 'small-single-room'].includes(room.optionId));
    let blocks = 0;
    for (const course of this.quotePlan.courses) {
      const courseStart = this.quotePlan.date(course.startDate);
      if (courseStart === null) continue;
      for (let block = 0; block < Math.floor(course.weeks / 4); block += 1) {
        const blockStart = courseStart + block * 28 * DAY;
        const blockEnd = blockStart + 27 * DAY;
        if (blockStart >= from && blockEnd <= to && this.quotePlan.covers(
          new Date(blockStart).toISOString().slice(0, 10),
          new Date(blockEnd).toISOString().slice(0, 10),
          eligibleRooms,
        )) blocks += 1;
      }
    }
    return blocks;
  }
  get snsDiscount() { return this.applySnsPromotion ? this.snsEligibleBlocks * this.prices.snsDiscountPerBlock : 0; }

  get quoteBeforeDiscounts() { return this.registration + this.tuition + this.accommodation; }
  get quoteUsd() {
    return Math.max(0, rounded(this.quoteBeforeDiscounts - this.registrationDiscount
      - this.offSeasonCourseDiscount - this.offSeasonRoomDiscount - this.snsDiscount));
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      { icon: '免', label: '思达注册费优惠', value: -this.registrationDiscount, note: '通过思达报名免100美元注册费。', promotionKey: 'registration' },
      ...(this.offSeasonCourseDiscount ? [{
        icon: '惠', label: '淡季课程优惠', value: -this.offSeasonCourseDiscount,
        note: `${this.offSeasonCourseBlocks}个完整4周，每段课程费减100美元。`, promotionKey: 'off-season-course',
      }] : []),
      ...(this.offSeasonRoomDiscount ? [{
        icon: '惠', label: '淡季住宿优惠', value: -this.offSeasonRoomDiscount,
        note: `${this.offSeasonRoomBlocks}个完整4周，每段住宿费减100美元。`, promotionKey: 'off-season-room',
      }] : []),
      ...(this.snsDiscount ? [{
        icon: '惠', label: 'SNS特别活动', value: -this.snsDiscount,
        note: `${this.snsEligibleBlocks}个完整4周符合日期与房型条件；须完成小红书及抖音发布要求，活动可能随时结束。`, promotionKey: 'sns',
      }] : []),
    ];
  }

  get statusLines(): QuoteImagePaymentItem[] {
    return [
      ...(!this.offSeasonCourseDiscount ? [{ icon: '惠', label: '淡季课程优惠', amount: '未适用', note: '课程在2026/6/28前结束，或于2026/8/23后开始且在2026年内入学时，每个完整4周减100美元。' }] : []),
      ...(!this.offSeasonRoomDiscount ? [{ icon: '惠', label: '淡季住宿优惠', amount: '未适用', note: '住宿在2026/6/28前结束，或于2026/8/23后开始且在2026年内入住时，每个完整4周减100美元。' }] : []),
      { icon: '早', label: '淡季工作日免费早餐', amount: this.isBreakfastEligible ? '适用' : '未适用', note: '符合淡季条件且在2026/12/31前的工作日提供免费早餐。' },
      ...(!this.snsDiscount ? [{ icon: '惠', label: 'SNS特别活动', amount: '未适用', note: '2026/1/1–6/27，仅限高级单人间、标准单人间和小单间；勾选参加且每个完整4周完成小红书及抖音发布要求后减100美元。' }] : []),
    ];
  }

  get visaExtensionCount() {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }
  get textbookQuantity() {
    return this.quotePlan.courses.reduce((sum, row) => sum + Math.ceil(row.weeks / 4), 0);
  }

  get localFees(): SchoolLocalFee[] {
    const extensions = this.visaExtensionCount;
    const acr = extensions > 0 ? 1 : 0;
    const manila = this.pickupAirport === 'manila' ? 1 : 0;
    const clark = this.pickupAirport === 'clark' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800比索／次', quantity: 1, total: 7800, note: '移民局收取，有效期6个月；更换学校需重新办理。' },
      { item: 'SSP-I Card', unitLabel: '4,500比索／次', quantity: 1, total: 4500, note: '移民局收取，入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I Card 外国人身份证', unitLabel: '4,000比索／次', quantity: acr, total: 4000 * acr, note: `按${this.visaLabel}和完整停留跨度预估；第一次签证续签时办理。` },
      { item: '签证续签', unitLabel: '4,940比索／30天', quantity: extensions, total: 4940 * extensions, note: `按${this.visaLabel}和完整停留跨度预估；每次续签有效期30天，实际以移民局及学校收取为准。` },
      { item: '教材费', unitLabel: '2,000比索／4周', quantity: this.textbookQuantity, total: 2000 * this.textbookQuantity, note: '此为预估；使用电子教材免费，需自带电子设备。' },
      { item: '学生证', unitLabel: '130比索／次', quantity: 1, total: 130, note: '一次性费用。' },
      { item: '马尼拉机场接机', unitLabel: '3,000比索／次', quantity: manila, total: 3000 * manila, note: '由学生自由选择是否需要；周日固定时间团体接机。' },
      { item: '克拉克机场接机', unitLabel: '3,000比索／次', quantity: clark, total: 3000 * clark, note: '由学生自由选择是否需要；周日固定时间团体接机。' },
    ];
  }

  get roomDeposit() { return 4000; }
  get mealQuantity() { return this.quotePlan.roomWeeks / 4; }
  get mealEstimate() { return rounded(14000 * this.mealQuantity); }
}
