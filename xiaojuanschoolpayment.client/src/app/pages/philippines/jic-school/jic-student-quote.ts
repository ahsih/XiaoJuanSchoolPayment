import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import {
  JIC_DEFAULT_START_DATE,
  JIC_WEEK_OPTIONS,
  JicAirportPickup,
  JicCampus,
  JicCourseFee,
  JicRoomFee,
} from './jic-pricing';

export type JicVisaType = 'tourist30' | 'tourist59';

interface JicQuotePrices {
  courseFees: JicCourseFee[];
  roomFees: JicRoomFee[];
  registrationFee: number;
  seasonalFeePerWeek: number;
}

const DAY = 86_400_000;
const money = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** JIC-specific pricing and promotion rules. Presentation and group aggregation live outside this class. */
export class JicStudentQuote {
  campus: JicCampus = 'challenger';
  selectedRegistrationDate = today();
  returningStudent = false;
  isExtensionStudent = false;
  visaType: JicVisaType = 'tourist59';
  airportPickup: JicAirportPickup = 'none';
  includeChallengerSpecialElective = false;

  readonly visaOptions = [
    { value: 'tourist59' as const, label: '59天旅游签证（默认）' },
    { value: 'tourist30' as const, label: '30天旅游签证' },
  ];
  readonly airportPickupOptions = [
    { value: 'none' as const, label: '不需要接机' },
    { value: 'manila' as const, label: '马尼拉机场团体接机' },
    { value: 'clark' as const, label: '克拉克机场团体接机' },
  ];

  readonly quotePlan = new SchoolQuotePlan(
    'challenger-esl-lite',
    'challenger-quad-bunk',
    JIC_DEFAULT_START_DATE,
    JIC_WEEK_OPTIONS,
    (kind) => kind === 'course'
      ? this.prices.courseFees.filter((course) => course.campus === this.campus).map((course) => ({ id: course.id, name: course.displayName, details: course.suitable }))
      : this.prices.roomFees.filter((room) => room.campus === this.campus).map((room) => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => {
      const fourWeekRate = kind === 'course'
        ? this.prices.courseFees.find((course) => course.id === row.optionId)?.tuition
        : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return (fourWeekRate ?? 0) * row.weeks / 4;
    },
  );

  constructor(private readonly prices: JicQuotePrices) {}

  setCampus(campus: JicCampus): void {
    this.campus = campus;
    const defaultCourse = campus === 'challenger' ? 'challenger-esl-lite' : 'premium-speaking-starter-7';
    const defaultRoom = campus === 'challenger' ? 'challenger-quad-bunk' : 'premium-quad-no-balcony';
    for (const row of this.quotePlan.courses) {
      if (!this.prices.courseFees.some((course) => course.id === row.optionId && course.campus === campus)) row.optionId = defaultCourse;
    }
    for (const row of this.quotePlan.rooms) {
      if (!this.prices.roomFees.some((room) => room.id === row.optionId && room.campus === campus)) row.optionId = defaultRoom;
    }
    if (campus !== 'challenger') this.includeChallengerSpecialElective = false;
  }

  get campusLabel(): string { return this.campus === 'challenger' ? 'Challenger 挑战校区（主校区）' : 'Premium 高级校区'; }
  get arrivalDate(): string { return this.quotePlan.startDate; }
  get courseWeeks(): number { return this.quotePlan.courseWeeks; }
  get roomWeeks(): number { return this.quotePlan.roomWeeks; }
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }

  get quoteError(): string {
    if (!['challenger', 'premium'].includes(this.campus)) return '请选择有效的JIC校区。';
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的旅游签证停留期。';
    if (!this.airportPickupOptions.some((option) => option.value === this.airportPickup)) return '请选择有效的接机方式。';
    return '';
  }

  get fourWeekBlocks(): number { return Math.floor(Math.min(this.courseWeeks, this.roomWeeks) / 4); }
  get peakWeeks(): number { return this.quotePlan.overlapWeeks('2026-06-28', '2026-08-22'); }
  get seasonalSurcharge(): number { return this.peakWeeks * this.prices.seasonalFeePerWeek; }

  get longTermEligible(): boolean {
    return this.courseWeeks >= 12 && this.selectedRegistrationDate >= '2026-03-08' && this.arrivalDate >= '2026-03-08';
  }
  get longTermDiscount(): number {
    if (!this.longTermEligible) return 0;
    if (this.courseWeeks >= 24) return 600;
    if (this.courseWeeks >= 20) return 500;
    if (this.courseWeeks >= 16) return 400;
    return 300;
  }
  get longTermNote(): string {
    if (this.courseWeeks < 12) return '未满12周；12／16／20／24周分别减300／400／500／600美元。';
    if (this.selectedRegistrationDate < '2026-03-08' || this.arrivalDate < '2026-03-08') return '要求报名日及到校日均为2026/03/08或以后。';
    return `${this.courseWeeks}周符合长期优惠，减${money(this.longTermDiscount)}美元；在校延长也可使用，可与其他优惠叠加。`;
  }

  private get offSeasonYear(): 2026 | 2027 | null {
    if (this.arrivalDate >= '2026-08-23' && this.arrivalDate <= '2027-01-09') return 2026;
    if (
      (this.arrivalDate >= '2027-02-21' && this.arrivalDate <= '2027-06-26') ||
      (this.arrivalDate >= '2027-08-22' && this.arrivalDate <= '2028-01-08')
    ) return 2027;
    return null;
  }
  private offSeasonRate(room: JicRoomFee): number {
    if (this.offSeasonYear === 2026) return room.category === 'quad' ? 150 : 50;
    if (this.offSeasonYear !== 2027) return 0;
    if (room.category === 'quad') return 100;
    if (room.category === 'twin') return 50;
    if (room.campus === 'challenger' || room.premium2027SingleEligible) return 50;
    return 0;
  }
  get offSeasonDiscount(): number {
    if (this.isExtensionStudent || !this.offSeasonYear) return 0;
    return this.quotePlan.rooms.reduce((sum, row) => {
      const room = this.prices.roomFees.find((item) => item.id === row.optionId);
      return sum + (room ? Math.floor(row.weeks / 4) * this.offSeasonRate(room) : 0);
    }, 0);
  }
  get offSeasonNote(): string {
    if (this.isExtensionStudent) return '淡季优惠不适用于在校延长。';
    if (!this.offSeasonYear) return '当前到校日不在2026下半年或2027两段淡季到校窗口内。';
    if (!this.offSeasonDiscount) return '当前房型不符合该档期条件；Premium 2027单人房仅无阳台雅房适用。';
    return `${this.offSeasonYear}淡季到校优惠，按各住宿段的完整4周计算，共减${money(this.offSeasonDiscount)}美元；不可用于在校延长。`;
  }

  get besaEligible(): boolean {
    return !this.isExtensionStudent && this.fourWeekBlocks > 0 &&
      this.selectedRegistrationDate >= '2026-04-01' && this.selectedRegistrationDate <= '2026-06-30' &&
      this.arrivalDate >= '2026-08-23' && this.arrivalDate <= '2026-12-13';
  }
  get besaDiscount(): number { return this.besaEligible ? this.fourWeekBlocks * 100 : 0; }
  get besaNote(): string {
    if (this.isExtensionStudent) return 'BESA优惠不适用于在校延长。';
    if (this.selectedRegistrationDate < '2026-04-01' || this.selectedRegistrationDate > '2026-06-30') return '报名日须在2026/04/01–06/30。';
    if (this.arrivalDate < '2026-08-23' || this.arrivalDate > '2026-12-13') return '到校日须在2026/08/23–12/13。';
    return `每完整4周减100美元，本次按${this.fourWeekBlocks}个完整4周减${money(this.besaDiscount)}美元；6周只计1个完整4周。`;
  }

  private get firstRoom(): JicRoomFee | undefined {
    const row = [...this.quotePlan.rooms].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    return this.prices.roomFees.find((room) => room.id === row?.optionId);
  }
  get holidayDiscount(): number {
    if (this.isExtensionStudent || this.courseWeeks < 4 || this.firstRoom?.category === 'single') return 0;
    if (
      (this.arrivalDate >= '2026-11-29' && this.arrivalDate <= '2026-12-13') ||
      (this.arrivalDate >= '2026-12-27' && this.arrivalDate <= '2027-01-10')
    ) return 200;
    if (
      (this.arrivalDate >= '2027-11-28' && this.arrivalDate <= '2027-12-12') ||
      (this.arrivalDate >= '2027-12-26' && this.arrivalDate <= '2028-01-09')
    ) return 150;
    return 0;
  }
  get holidayNote(): string {
    if (this.isExtensionStudent) return '节日优惠不适用于在校延长。';
    if (this.firstRoom?.category === 'single') return '仅双人房及四人房适用，单人房不适用。';
    if (!this.holidayDiscount) return '当前到校日不在2026或2027圣诞及节日优惠窗口。';
    return `到校日及房型符合节日优惠，一次减${money(this.holidayDiscount)}美元；可与其他优惠叠加。`;
  }

  get registrationDiscount(): number {
    return this.returningStudent || this.isExtensionStudent || this.courseWeeks >= 12 ? this.prices.registrationFee : 0;
  }
  get registrationDiscountNote(): string {
    if (this.isExtensionStudent) return '在校延长不重复收取注册费。';
    if (this.returningStudent) return '老学员返校免收一次性注册费。';
    if (this.courseWeeks >= 12) return '思达长期学生注册费优惠：12周及以上免收100美元注册费。';
    return '当前未满12周；新生一次性注册费100美元。';
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      { icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge, note: this.peakWeeks ? `2026/06/28–08/22实际覆盖${this.peakWeeks}个课程周 × ${this.prices.seasonalFeePerWeek}美元；优惠不抵扣旺季费。` : '当前课程日期未覆盖2026/06/28–08/22旺季。' },
      { icon: '免', label: '注册费优惠', value: -this.registrationDiscount, note: this.registrationDiscountNote, promotionKey: 'jic-registration' },
      { icon: '淡', label: '淡季优惠', value: -this.offSeasonDiscount, note: this.offSeasonNote, promotionKey: `jic-off-season-${this.offSeasonYear ?? 'none'}` },
      { icon: '长', label: '长期优惠', value: -this.longTermDiscount, note: this.longTermNote, promotionKey: 'jic-long-term' },
      { icon: '节', label: '圣诞及节日优惠', value: -this.holidayDiscount, note: this.holidayNote, promotionKey: 'jic-holiday' },
      { icon: '惠', label: 'BESA优惠', value: -this.besaDiscount, note: this.besaNote, promotionKey: 'jic-besa' },
    ];
  }

  get quoteUsd(): number {
    return Math.max(0, this.prices.registrationFee + this.tuition + this.accommodation + this.paymentLines.reduce((sum, line) => sum + line.value, 0));
  }

  get visaLabel(): string { return this.visaType === 'tourist30' ? '30天旅游签证' : '59天旅游签证'; }
  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }
  get localFees(): SchoolLocalFee[] {
    const accommodationPeriods = this.roomWeeks / 4;
    const bookSets = Math.max(1, Math.ceil(this.courseWeeks / 8));
    const extensions = this.visaExtensionCount;
    const electivePeriods = this.campus === 'challenger' && this.includeChallengerSpecialElective ? this.courseWeeks / 4 : 0;
    const guarantee = this.quotePlan.courses.some((row) => row.optionId === 'challenger-ielts-guarantee') ? 1 : 0;
    const manilaPickup = this.airportPickup === 'manila' ? 1 : 0;
    const clarkPickup = this.airportPickup === 'clark' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: 1, total: 7800, note: '移民局收取，按报名学习时长办理；续费及换校需要重新办理。' },
      { item: 'SSP-E CARD', unitLabel: '4,500 比索／次', quantity: 1, total: 4500, note: '移民局收取，入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I CARD 外国人身份证', unitLabel: '4,000 比索／次', quantity: extensions > 0 ? 1 : 0, total: extensions > 0 ? 4000 : 0, note: `按${this.visaLabel}预估，第一次续签时办理，只收一次；不能按半个周期计费。` },
      { item: '维护管理费', unitLabel: '1,000 比索／4周', quantity: accommodationPeriods, total: 1000 * accommodationPeriods, note: '校内教学楼及其他设施维护费；超过4周按实际周数比例预估，6周为1.5个计费单位。' },
      { item: '水电费', unitLabel: '3,000 比索／4周', quantity: accommodationPeriods, total: 3000 * accommodationPeriods, note: '超过4周按实际周数比例预估，6周为1.5个计费单位。' },
      { item: '马尼拉机场接机', unitLabel: '3,000 比索／次', quantity: manilaPickup, total: 3000 * manilaPickup, note: '自由选择是否需要；周日固定时间团体接机，选择后计入学杂费预估。' },
      { item: '克拉克机场接机', unitLabel: '3,000 比索／次', quantity: clarkPickup, total: 3000 * clarkPickup, note: '自由选择是否需要；周日固定时间团体接机，选择后计入学杂费预估。' },
      { item: '签证续签', unitLabel: '4,940 比索／每30天', quantity: extensions, total: 4940 * extensions, note: `按${this.visaLabel}及完整停留跨度预估${extensions}次；每次续签增加30天，实际由移民局按个人情况收取。` },
      { item: '教材费', unitLabel: '1,900 比索／套', quantity: bookSets, total: 1900 * bookSets, note: '按每套教材约使用8周预估；课程教材不同，学完后需要按实际进度购买新教材。' },
      { item: '学生证', unitLabel: '200 比索／次', quantity: 1, total: 200, note: '一次性费用，包含拍摄照片。' },
      { item: '洗衣服务', unitLabel: '1,200 比索／4周', quantity: accommodationPeriods, total: 1200 * accommodationPeriods, note: '每周2次洗衣服务，包含洗涤、烘干和折叠；超过4周按实际周数比例预估。' },
      { item: 'Challenger特别选修课', unitLabel: '2,000 比索／4周', quantity: electivePeriods, total: 2000 * electivePeriods, note: '仅在主动勾选Challenger特别选修课时计入；超过4周按实际周数比例预估。' },
      { item: 'IELTS保分班额外费用', unitLabel: '18,000 比索／次', quantity: guarantee, total: 18000 * guarantee, note: '仅选择IELTS Guarantee雅思保分班时计入；每周六强制模拟考试，具体保证条件须由顾问确认。' },
    ];
  }
  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
}
