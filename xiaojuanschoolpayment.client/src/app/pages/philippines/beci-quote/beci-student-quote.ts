import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import {
  BECI_OFF_SEASON_RANGES,
  BECI_PEAK_RANGES,
  BECI_WEEK_OPTIONS,
  BeciCampusPricing,
  beciLongStayDiscount,
  beciPriceMultiplier,
} from './beci-pricing';

export type BeciVisaType = 'tourist30' | 'tourist59';
export type BeciPickup = 'none' | 'manila' | 'clark';

const DAY = 86400000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function nextSunday(): string {
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = (7 - date.getDay()) % 7;
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export class BeciStudentQuote {
  arrivalAge = 18;
  visaType: BeciVisaType = 'tourist59';
  pickup: BeciPickup = 'none';
  cityCoupleRateSelected = false;
  readonly visaOptions = [
    { value: 'tourist59' as const, label: '59天旅游签证（默认）' },
    { value: 'tourist30' as const, label: '30天旅游签证' },
  ];
  readonly pickupOptions = [
    { value: 'none' as const, label: '不需要接机' },
    { value: 'manila' as const, label: '马尼拉机场接机' },
    { value: 'clark' as const, label: '克拉克机场接机' },
  ];

  readonly quotePlan: SchoolQuotePlan;

  constructor(readonly campus: BeciCampusPricing) {
    this.quotePlan = new SchoolQuotePlan(
      campus.defaultCourseId,
      campus.defaultRoomId,
      nextSunday(),
      BECI_WEEK_OPTIONS,
      (kind) => kind === 'course'
        ? campus.courses.map((course) => ({
            id: course.id,
            name: course.name,
            details: [course.schedule, course.note].filter(Boolean).join('；'),
          }))
        : campus.rooms.map((room) => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => {
        const base = kind === 'course'
          ? campus.courses.find((course) => course.id === row.optionId)?.price ?? 0
          : this.roomFourWeekPrice(row.optionId);
        return rounded(base * beciPriceMultiplier(row.weeks));
      },
    );
  }

  private roomFourWeekPrice(roomId: string): number {
    if (this.campus.id === 'city' && roomId === 'city-studio-twin' && this.cityCoupleRateSelected) {
      return 750;
    }
    return this.campus.rooms.find((room) => room.id === roomId)?.price ?? 0;
  }

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (!Number.isInteger(this.arrivalAge) || this.arrivalAge < 0 || this.arrivalAge > 100) {
      return '请输入0–100岁的整数抵达年龄。';
    }
    const invalidCourse = this.quotePlan.courses.find((row) => {
      const minimum = this.campus.courses.find((course) => course.id === row.optionId)?.minimumWeeks ?? 1;
      return row.weeks < minimum;
    });
    if (invalidCourse) return 'BECI斯巴达IELTS保证班须选择12周或以上。';
    if (this.campus.id === 'eop' && this.arrivalAge >= 40) {
      const invalidRoom = this.quotePlan.rooms.find((row) =>
        !this.campus.rooms.find((room) => room.id === row.optionId)?.single,
      );
      if (invalidRoom) return 'EOP校区40岁及以上学生只能选择单人间。';
    }
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的旅游签证天数。';
    if (!this.pickupOptions.some((option) => option.value === this.pickup)) return '请选择有效的接机选项。';
    return '';
  }

  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  get registrationOriginal(): number { return 100; }
  get registrationDiscount(): number { return 100; }

  get entryDate(): string {
    return this.quotePlan.courses.map((row) => row.startDate).filter(Boolean).sort()[0] ?? '';
  }

  get offSeasonEligible(): boolean {
    return BECI_OFF_SEASON_RANGES.some((range) => this.entryDate >= range.start && this.entryDate <= range.end);
  }

  get offSeasonDiscount(): number {
    return this.offSeasonEligible ? rounded((this.tuition + this.accommodation) * 0.1) : 0;
  }

  get longStayDiscount(): number { return beciLongStayDiscount(this.quotePlan.courseWeeks); }

  get peakWeeks(): number {
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter((week) =>
      BECI_PEAK_RANGES.some((range) => {
        const start = this.quotePlan.date(range.start)!;
        const end = this.quotePlan.date(range.end)!;
        return week <= end && week + 6 * DAY >= start;
      }),
    ).length;
  }

  get peakSurcharge(): number { return this.peakWeeks * 40; }

  get quoteUsd(): number {
    return Math.max(0, rounded(
      this.registrationOriginal + this.tuition + this.accommodation + this.peakSurcharge
      - this.registrationDiscount - this.offSeasonDiscount - this.longStayDiscount,
    ));
  }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const result: SchoolPaymentLine[] = [
      { icon: '注', label: '注册费原价', value: 100, note: '每名学生一次；通过思达报名另列100美元优惠。' },
      { icon: '惠', label: '思达注册费优惠', value: -100, note: '所有通过思达报名的学生均优惠100美元注册费。', promotionKey: 'beci-registration-waiver' },
    ];
    if (this.offSeasonDiscount > 0) result.push({
      icon: '淡', label: '2026淡季九折优惠', value: -this.offSeasonDiscount,
      note: `入学日${this.entryDate.replace(/-/g, '/')}符合优惠；整段课程费与住宿费减10%。`,
      promotionKey: 'beci-off-season',
    });
    if (this.longStayDiscount > 0) result.push({
      icon: '长', label: '长期学习优惠', value: -this.longStayDiscount,
      note: `${this.quotePlan.courseWeeks}周课程适用；淡季九折后再扣减。`, promotionKey: 'beci-long-stay',
    });
    if (this.peakSurcharge > 0) result.push({
      icon: '旺', label: '碧瑶旺季附加费', value: this.peakSurcharge,
      note: `40美元／课程重叠周 × ${this.peakWeeks}周；不参与折扣。`,
    });
    return result;
  }

  get localFees(): SchoolLocalFee[] {
    const accommodationPeriods = Math.ceil(this.quotePlan.roomWeeks / 4);
    const textbookPeriods = Math.ceil(this.quotePlan.courseWeeks / 8);
    const pickupSelected = this.pickup !== 'none';
    const pickupLabel = this.pickup === 'manila' ? '马尼拉机场接机' : this.pickup === 'clark' ? '克拉克机场接机' : '机场接机';
    const visaLabel = this.visaType === 'tourist30' ? '30天旅游签证' : '59天旅游签证';
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: 1, total: 7800, note: '移民局收取；按报名学习时长办理，续费及换校需要重新确认。' },
      { item: 'SSP-E CARD', unitLabel: '4,500 比索／次', quantity: 1, total: 4500, note: '移民局收取；入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I CARD外国人身份证', unitLabel: '4,000 比索／次', quantity: this.visaExtensionCount > 0 ? 1 : 0, total: this.visaExtensionCount > 0 ? 4000 : 0, note: '第一次需要签证续签时预估办理，最终以移民局实收为准。' },
      { item: '维护管理费', unitLabel: '1,000 比索／4周', quantity: accommodationPeriods, total: 1000 * accommodationPeriods, note: '校内教学楼及其他设施维护费，按每开始4周预估。' },
      { item: '水电费', unitLabel: '3,000 比索／4周', quantity: accommodationPeriods, total: 3000 * accommodationPeriods, note: '按每开始4周预估；超过学校额度后按学校实际用量另收。' },
      { item: pickupLabel, unitLabel: '3,000 比索／次', quantity: pickupSelected ? 1 : 0, total: pickupSelected ? 3000 : 0, note: pickupSelected ? '学生已选择接机，计入学杂费合计；指定周日团体接机，最终安排需确认。' : '默认未选择，不计入学杂费合计；学生可选择马尼拉或克拉克机场接机。' },
      { item: '签证续签', unitLabel: '4,940 比索／30天', quantity: this.visaExtensionCount, total: 4940 * this.visaExtensionCount, note: `按${visaLabel}及完整停留跨度预估${this.visaExtensionCount}次；最终以移民局实际情况和实收金额为准。` },
      { item: '教材费', unitLabel: '2,000 比索／套', quantity: textbookPeriods, total: 2000 * textbookPeriods, note: '暂按每开始8个课程周使用一套预估；不同课程教材不同，最终以学校发放为准。' },
      { item: '学生证', unitLabel: '200 比索／次', quantity: 1, total: 200, note: '一次性费用，含照片。' },
      { item: '洗衣服务', unitLabel: '1,500 比索／4周', quantity: accommodationPeriods, total: 1500 * accommodationPeriods, note: '按每开始4周预估；每周一至周四送洗，含洗涤、烘干和折叠。' },
    ];
  }

  get depositReference(): SchoolLocalFee {
    return { item: '房间押金', unitLabel: '3,000 比索／人', quantity: 1, total: 3000, note: '不计入学杂费合计；无损坏、无欠费并按学校规则完成退房后可退。' };
  }

  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get visaSummary(): string { return `${this.visaType === 'tourist30' ? 30 : 59}天旅游签证；预计续签${this.visaExtensionCount}次`; }
  get pickupSummary(): string { return this.pickupOptions.find((option) => option.value === this.pickup)?.label ?? ''; }
  format(value: number): string { return quoteMoney(value); }
}
