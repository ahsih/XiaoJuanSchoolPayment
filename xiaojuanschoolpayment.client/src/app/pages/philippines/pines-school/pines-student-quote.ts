import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';

interface PinesQuotePrices {
  courseFees: { id: string; name: string; tuition: number; suitable: string }[];
  roomFees: { id: string; name: string; fee: number; note: string }[];
  registrationFee: number;
  sidaDiscountRate: number;
  offSeasonDiscountPerFourWeeks: number;
  twelveWeekDiscount: number;
  longStayMinimumWeeks: number;
  longStayBaseDiscount: number;
  longStayIncrementWeeks: number;
  longStayIncrementDiscount: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string }[];
}

export const PINES_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

export type PinesVisaType = typeof PINES_VISA_OPTIONS[number]['value'];
export type PinesPickupAirport = 'none' | 'manila' | 'clark';

export const pinesPriceMultiplier = (weeks: number): number => {
  if (weeks === 2) return 0.65;
  if (weeks === 3) return 0.85;
  return weeks / 4;
};

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const campusGroup = (id: string) => id.includes('ielts') ? '雅思校区 IELTS Campus' : '主校区 Main Campus';
const stripCampusPrefix = (value: string) => value.replace(/^(主校区|雅思校区)(?:\s+Main Campus|\s+IELTS Campus)?(?:｜|\s*)/u, '');
const localToday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/** PINES-only pricing and fee rules used by the shared group-quote presentation. */
export class PinesStudentQuote {
  constructor(private readonly prices: PinesQuotePrices) {}

  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = localToday();
  readonly visaOptions = PINES_VISA_OPTIONS;
  visaType: PinesVisaType = 'tourist59';
  pickupAirport: PinesPickupAirport = 'none';
  readonly weekOptions = Array.from({ length: 23 }, (_, index) => index + 2);

  readonly quotePlan = new SchoolQuotePlan(
    'light-esl-4',
    'main-sextuple',
    nextSunday(),
    this.weekOptions,
    (kind) => kind === 'course'
      ? this.prices.courseFees.map((course) => ({
          id: course.id,
          name: course.name,
          details: stripCampusPrefix(course.suitable),
          group: campusGroup(course.id),
        }))
      : this.prices.roomFees.map((room) => ({
          id: room.id,
          name: stripCampusPrefix(room.name),
          details: room.note,
          group: campusGroup(room.id),
        })),
    (kind, row) => {
      const rate = kind === 'course'
        ? this.prices.courseFees.find((course) => course.id === row.optionId)?.tuition
        : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return rounded((rate ?? 0) * pinesPriceMultiplier(row.weeks));
    },
  );

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['adult', 'minor'].includes(this.selectedAgeGroup)) return '请选择抵达时年龄段。';
    if (!this.visaOptions.some((option) => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (!['none', 'manila', 'clark'].includes(this.pickupAirport)) return '请选择有效的接机安排。';

    for (const course of this.quotePlan.courses) {
      if (course.optionId.includes('guarantee-12-weeks') && course.weeks < 12) return 'IELTS 12周保证班的每段课程至少选择12周。';
      if (course.optionId.includes('guarantee-8-weeks') && course.weeks < 8) return 'IELTS 8周保证班的每段课程至少选择8周。';
    }

    for (const course of this.quotePlan.courses) {
      const courseStart = this.quotePlan.date(course.startDate);
      const courseEnd = this.quotePlan.date(this.quotePlan.end(course));
      if (courseStart === null || courseEnd === null) continue;
      const courseCampus = course.optionId.includes('ielts') ? 'ielts' : 'main';
      const mismatchedRoom = this.quotePlan.rooms.find((room) => {
        const roomStart = this.quotePlan.date(room.startDate);
        const roomEnd = this.quotePlan.date(this.quotePlan.end(room));
        if (roomStart === null || roomEnd === null || roomEnd < courseStart || roomStart > courseEnd) return false;
        return !room.optionId.startsWith(`${courseCampus}-`);
      });
      if (mismatchedRoom) return '课程与住宿所属校区不一致；主校区课程请选择主校区房型，雅思课程请选择雅思校区房型。';
    }

    return '';
  }

  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }
  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get registration() { return this.prices.registrationFee; }
  get registrationDiscount() { return this.prices.registrationFee; }

  get peakWeeks(): number {
    return this.quotePlan.weekStarts(this.quotePlan.courses).filter((week) =>
      this.prices.peakSeasonRanges.some((range) => {
        const start = this.quotePlan.date(range.start);
        const end = this.quotePlan.date(range.end);
        return start !== null && end !== null && week <= end && week + 6 * DAY >= start;
      }),
    ).length;
  }

  get seasonalSurcharge() { return this.peakWeeks * this.prices.seasonalFeePerWeek; }

  get offSeasonBlocks(): number {
    const registrationDeadline = this.quotePlan.date('2026-12-31')!;
    const registrationDate = this.quotePlan.date(this.selectedRegistrationDate);
    if (registrationDate === null || registrationDate > registrationDeadline) return 0;

    const peakWeekStarts = new Set<number>();
    for (const range of this.prices.peakSeasonRanges) {
      this.quotePlan.weekStarts(this.quotePlan.courses).forEach((week) => {
        const start = this.quotePlan.date(range.start);
        const end = this.quotePlan.date(range.end);
        if (start !== null && end !== null && week <= end && week + 6 * DAY >= start) peakWeekStarts.add(week);
      });
    }
    const eligibleWeeks = this.quotePlan.weekStarts(this.quotePlan.courses)
      .filter((week) => !peakWeekStarts.has(week));
    return Math.floor(eligibleWeeks.length / 4);
  }

  get offSeasonDiscount() { return this.offSeasonBlocks * this.prices.offSeasonDiscountPerFourWeeks; }
  get twelveWeekDiscount() { return this.quotePlan.courseWeeks >= 12 ? this.prices.twelveWeekDiscount : 0; }
  get longStayDiscount(): number {
    if (this.quotePlan.courseWeeks < this.prices.longStayMinimumWeeks) return 0;
    const additionalBlocks = Math.floor(
      (this.quotePlan.courseWeeks - this.prices.longStayMinimumWeeks) / this.prices.longStayIncrementWeeks,
    );
    return this.prices.longStayBaseDiscount + additionalBlocks * this.prices.longStayIncrementDiscount;
  }
  get fixedCourseRoomDiscounts() { return this.offSeasonDiscount + this.twelveWeekDiscount + this.longStayDiscount; }
  get sidaDiscount() {
    const discountedBase = Math.max(0, this.tuition + this.accommodation - this.fixedCourseRoomDiscounts);
    return rounded(discountedBase * (1 - this.prices.sidaDiscountRate));
  }
  get quoteUsd() {
    return Math.max(0, rounded(
      this.registration + this.tuition + this.accommodation + this.seasonalSurcharge
      - this.registrationDiscount - this.fixedCourseRoomDiscounts - this.sidaDiscount,
    ));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const ranges = this.prices.peakSeasonRanges.filter((range) => this.quotePlan.overlapWeeks(range.start, range.end, this.quotePlan.courses) > 0);
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge,
        note: `${this.prices.seasonalFeePerWeek}美元／学习周 × ${this.peakWeeks}周；${ranges.map((range) => `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`).join('；')}；不参与折扣`,
      }] : []),
      { icon: '免', label: '思达免注册费', value: -this.registrationDiscount, note: '所有通过思达报名的学生免收100美元注册费', promotionKey: 'registration' },
      ...(this.offSeasonDiscount ? [{ icon: '惠', label: '常规淡季优惠', value: -this.offSeasonDiscount, note: `2026/12/31前注册，未覆盖旺季的课程共${this.quotePlan.courseWeeks - this.peakWeeks}周，每满4周减150美元，共${this.offSeasonBlocks}段`, promotionKey: 'off-season' }] : []),
      ...(this.twelveWeekDiscount ? [{ icon: '惠', label: '12周以上额外优惠', value: -this.twelveWeekDiscount, note: '累计课程达到12周，一次减100美元', promotionKey: 'twelve-week' }] : []),
      ...(this.longStayDiscount ? [{ icon: '长', label: '长期优惠', value: -this.longStayDiscount, note: `累计课程${this.quotePlan.courseWeeks}周；16周减100美元，之后每增加2周叠加25美元；可与其他优惠叠加`, promotionKey: `long-stay-${this.longStayDiscount}` }] : []),
      { icon: '折', label: '思达95折', value: -this.sidaDiscount, note: '课程费和住宿费先减固定优惠，再按95折计算', promotionKey: 'sida' },
    ];
  }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  get localFees(): SchoolLocalFee[] {
    const periods = this.quotePlan.roomWeeks / 4;
    const extensions = this.visaExtensionCount;
    const acr = extensions > 0 ? 1 : 0;
    const manilaPickup = this.pickupAirport === 'manila' ? 1 : 0;
    const clarkPickup = this.pickupAirport === 'clark' ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／次', quantity: 1, total: 7800, note: '移民局收取，通常有效6个月；更换学校需重新办理。' },
      { item: 'SSP-E Card', unitLabel: '4,500 比索／次', quantity: 1, total: 4500, note: '入学时与SSP同时办理，只收一次。' },
      { item: 'ACR-I Card 外国人身份证', unitLabel: '4,000 比索／次', quantity: acr, total: acr * 4000, note: `按${this.visaLabel}预估，第一次签证续签时办理；以学校及移民局要求为准。` },
      { item: '水电费', unitLabel: '3,000 比索／4周', quantity: periods, total: rounded(3000 * periods), note: '按住宿周数计算；此为预估，超额用电另收25比索／kW。' },
      { item: '签证续签', unitLabel: '6,210 比索／30天', quantity: extensions, total: extensions * 6210, note: `按${this.visaLabel}及完整停留跨度预估；${extensions ? `本次预计续签${extensions}次` : '本次预计无需续签'}，实际以移民局及学校办理为准。` },
      { item: '学生证', unitLabel: '200 比索／次', quantity: 1, total: 200, note: '一次性费用。' },
      { item: '马尼拉机场接机', unitLabel: '3,000 比索／次', quantity: manilaPickup, total: manilaPickup * 3000, note: '由学生自由选择；指定周日团体接机。' },
      { item: '克拉克机场接机', unitLabel: '3,000 比索／次', quantity: clarkPickup, total: clarkPickup * 3000, note: '由学生自由选择；指定周日团体接机。' },
    ];
  }

  get campusDeposit() {
    const quantity = this.quotePlan.roomWeeks / 4;
    return { quantity, total: rounded(4000 * quantity) };
  }

  get pickupLabel() {
    if (this.pickupAirport === 'manila') return '马尼拉机场接机';
    if (this.pickupAirport === 'clark') return '克拉克机场接机';
    return '不需要学校接机';
  }

  get shortStayNotes() { return this.quotePlan.shortStayNotes(pinesPriceMultiplier); }
}
