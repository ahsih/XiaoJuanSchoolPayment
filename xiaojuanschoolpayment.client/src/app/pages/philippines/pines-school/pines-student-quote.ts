import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';

interface PinesQuotePrices {
  courseFees: { id: string; name: string; tuition: number; suitable: string }[];
  roomFees: { id: string; name: string; fee: number; note: string }[];
  registrationFee: number;
  registrationWaiverEnabled: boolean;
  sidaDiscountRate: number;
  offSeasonDiscountPerFourWeeks: number;
  offSeasonRegistrationEnd: string;
  twelveWeekMinimumWeeks: number;
  twelveWeekDiscount: number;
  longStayMinimumWeeks: number;
  longStayBaseDiscount: number;
  longStayIncrementWeeks: number;
  longStayIncrementDiscount: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string }[];
  shortStayRatios: Record<string, number>;
  localFeeRules: CiaLocalFeeRule[];
  promotionRules: CiaPromotionRule[];
}

export const PINES_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' },
  { value: 'tourist59', label: '59天旅游签证' },
] as const;

export type PinesVisaType = typeof PINES_VISA_OPTIONS[number]['value'];
export type PinesPickupAirport = 'none' | 'manila' | 'clark';

export const pinesPriceMultiplier = (
  weeks: number,
  ratios: Record<string, number> = { '2': 0.65, '3': 0.85 },
): number => {
  if (ratios[String(weeks)] !== undefined) return ratios[String(weeks)];
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
      return rounded((rate ?? 0) * pinesPriceMultiplier(row.weeks, this.prices.shortStayRatios));
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
  get registrationDiscount() {
    const rule = this.promotion('pines-registration-waiver');
    return this.prices.registrationWaiverEnabled && rule?.waiveRegistration && this.isPromotionEligible(rule) ? this.prices.registrationFee : 0;
  }

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
    const registrationDeadline = this.quotePlan.date(this.prices.offSeasonRegistrationEnd);
    const registrationDate = this.quotePlan.date(this.selectedRegistrationDate);
    if (registrationDeadline === null || registrationDate === null || registrationDate > registrationDeadline) return 0;

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

  get offSeasonDiscount() {
    const rule = this.promotion('pines-off-season');
    if (!rule || !this.isPromotionEligible(rule) || !this.offSeasonBlocks) return 0;
    const eligibleWeeks = this.offSeasonBlocks * 4;
    if (rule.discountType === 'percentage') return rounded(this.tuition * eligibleWeeks / Math.max(1, this.quotePlan.courseWeeks) * rule.discountValue / 100);
    if (rule.discountType === 'per-course-week') return rounded(eligibleWeeks * rule.discountValue);
    return rounded(this.offSeasonBlocks * this.prices.offSeasonDiscountPerFourWeeks);
  }
  get twelveWeekDiscount() {
    const rule = this.promotion('pines-twelve-week');
    if (!rule || !this.isPromotionEligible(rule) || this.quotePlan.courseWeeks < this.prices.twelveWeekMinimumWeeks) return 0;
    return this.promotionDiscount(rule, this.promotionBase(rule), this.prices.twelveWeekDiscount);
  }
  get longStayDiscount(): number {
    const rule = this.promotion('pines-long-stay');
    if (!rule || !this.isPromotionEligible(rule) || this.quotePlan.courseWeeks < this.prices.longStayMinimumWeeks) return 0;
    if (rule.discountType !== 'fixed') return this.promotionDiscount(rule, this.promotionBase(rule), this.prices.longStayBaseDiscount);
    const additionalBlocks = Math.floor(
      (this.quotePlan.courseWeeks - this.prices.longStayMinimumWeeks) / this.prices.longStayIncrementWeeks,
    );
    return this.prices.longStayBaseDiscount + additionalBlocks * this.prices.longStayIncrementDiscount;
  }
  get fixedCourseRoomDiscounts() { return this.offSeasonDiscount + this.twelveWeekDiscount + this.longStayDiscount; }
  get sidaDiscount() {
    const rule = this.promotion('pines-sida-discount');
    if (!rule || !this.isPromotionEligible(rule)) return 0;
    const priorDiscounts = rule.appliesTo === 'accommodation' ? 0 : this.fixedCourseRoomDiscounts;
    const discountedBase = Math.max(0, this.promotionBase(rule) - priorDiscounts);
    if (rule.discountType === 'fixed') return Math.min(discountedBase, rule.discountValue);
    if (rule.discountType === 'per-course-week') return Math.min(discountedBase, rounded(this.quotePlan.courseWeeks * rule.discountValue));
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
    const registration = this.promotion('pines-registration-waiver');
    const offSeason = this.promotion('pines-off-season');
    const twelveWeek = this.promotion('pines-twelve-week');
    const longStay = this.promotion('pines-long-stay');
    const sida = this.promotion('pines-sida-discount');
    return [
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge,
        note: `${this.prices.seasonalFeePerWeek}美元／学习周 × ${this.peakWeeks}周；${ranges.map((range) => `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`).join('；')}；不参与折扣`,
      }] : []),
      ...(this.registrationDiscount ? [{ icon: '免', label: registration?.name ?? '免注册费', value: -this.registrationDiscount, note: registration?.description ?? '', promotionKey: 'registration' }] : []),
      ...(this.offSeasonDiscount ? [{ icon: '惠', label: offSeason?.name ?? '常规淡季优惠', value: -this.offSeasonDiscount, note: `${offSeason?.description ?? ''}；本次符合${this.offSeasonBlocks}个完整周期`, promotionKey: 'off-season' }] : []),
      ...(this.twelveWeekDiscount ? [{ icon: '惠', label: twelveWeek?.name ?? '长期课程优惠', value: -this.twelveWeekDiscount, note: twelveWeek?.description ?? '', promotionKey: 'twelve-week' }] : []),
      ...(this.longStayDiscount ? [{ icon: '长', label: longStay?.name ?? '长期优惠', value: -this.longStayDiscount, note: `${longStay?.description ?? ''}；本次累计课程${this.quotePlan.courseWeeks}周`, promotionKey: `long-stay-${this.longStayDiscount}` }] : []),
      ...(this.sidaDiscount ? [{ icon: '折', label: sida?.name ?? '思达折扣', value: -this.sidaDiscount, note: sida?.description ?? '', promotionKey: 'sida' }] : []),
    ];
  }

  get visaExtensionCount(): number {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }

  get localFees(): SchoolLocalFee[] {
    return this.prices.localFeeRules
      .filter(rule => rule.enabled && rule.includeInTotal)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => {
        const quantity = this.feeQuantity(rule);
        const notePrefix = ['acr-i-card', 'visa-extension'].includes(rule.id)
          ? `按${this.visaLabel}预估；${rule.id === 'visa-extension' ? (this.visaExtensionCount ? `本次预计续签${this.visaExtensionCount}次` : '本次预计无需续签') : ''}`
          : '';
        return {
          item: rule.name,
          unitLabel: this.feeUnit(rule),
          quantity,
          total: this.feeTotal(rule, quantity),
          note: [notePrefix, rule.note].filter(Boolean).join('；'),
        };
      });
  }

  get campusDeposit() {
    const rule = this.prices.localFeeRules.find(item => item.id === 'campus-deposit');
    const quantity = rule ? this.feeQuantity(rule) : 0;
    return { quantity, total: rule ? this.feeTotal(rule, quantity) : 0 };
  }

  get pickupLabel() {
    if (this.pickupAirport === 'manila') return '马尼拉机场接机';
    if (this.pickupAirport === 'clark') return '克拉克机场接机';
    return '不需要学校接机';
  }

  get shortStayNotes() { return this.quotePlan.shortStayNotes(weeks => pinesPriceMultiplier(weeks, this.prices.shortStayRatios)); }

  private promotion(id: string): CiaPromotionRule | undefined {
    return this.prices.promotionRules.find(item => item.id === id && item.enabled);
  }

  private isPromotionEligible(rule: CiaPromotionRule): boolean {
    if (rule.newStudentsOnly && this.returningStudent) return false;
    if (this.quotePlan.courseWeeks < rule.minimumCourseWeeks || this.quotePlan.roomWeeks < rule.minimumAccommodationWeeks) return false;
    const registration = this.quotePlan.date(this.selectedRegistrationDate);
    const registrationStart = this.quotePlan.date(rule.registrationStart ?? '');
    const registrationEnd = this.quotePlan.date(rule.registrationEnd ?? '');
    if (registrationStart !== null && (registration === null || registration < registrationStart)) return false;
    if (registrationEnd !== null && (registration === null || registration > registrationEnd)) return false;
    const arrival = Math.min(...this.quotePlan.courses.map(row => this.quotePlan.date(row.startDate) ?? Number.MAX_SAFE_INTEGER));
    const arrivalStart = this.quotePlan.date(rule.arrivalStart ?? '');
    const arrivalEnd = this.quotePlan.date(rule.arrivalEnd ?? '');
    if (arrivalStart !== null && arrival < arrivalStart) return false;
    if (arrivalEnd !== null && arrival > arrivalEnd) return false;
    if (rule.coverageTarget !== 'none' && rule.coverageStart && rule.coverageEnd) {
      const courseOverlap = this.quotePlan.overlapWeeks(rule.coverageStart, rule.coverageEnd, this.quotePlan.courses) > 0;
      const roomOverlap = this.quotePlan.overlapWeeks(rule.coverageStart, rule.coverageEnd, this.quotePlan.rooms) > 0;
      if (!courseOverlap || (rule.coverageTarget === 'course-and-accommodation' && !roomOverlap)) return false;
    }
    return true;
  }

  private promotionBase(rule: CiaPromotionRule): number {
    if (rule.appliesTo === 'tuition') return this.tuition;
    if (rule.appliesTo === 'accommodation') return this.accommodation;
    if (rule.appliesTo === 'school-total') return this.registration + this.tuition + this.accommodation + this.seasonalSurcharge;
    return this.tuition + this.accommodation;
  }

  private promotionDiscount(rule: CiaPromotionRule, base: number, fallback: number): number {
    if (rule.discountType === 'percentage') return rounded(base * rule.discountValue / 100);
    if (rule.discountType === 'per-course-week') return rounded(this.quotePlan.courseWeeks * rule.discountValue);
    if (rule.discountType === 'none') return 0;
    return rounded(fallback);
  }

  private feeQuantity(rule: CiaLocalFeeRule): number {
    if (rule.id === 'manila-pickup') return this.pickupAirport === 'manila' ? 1 : 0;
    if (rule.id === 'clark-pickup') return this.pickupAirport === 'clark' ? 1 : 0;
    if (rule.billingRule === 'first-visa-extension' || rule.billingRule === 'long-term-or-first-extension') return this.visaExtensionCount > 0 ? 1 : 0;
    if (rule.billingRule === 'visa-extension-schedule') return this.visaExtensionCount;
    if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') {
      const weeks = rule.billingRule === 'per-accommodation-period' ? this.quotePlan.roomWeeks : this.quotePlan.courseWeeks;
      const periods = weeks / Math.max(1, rule.periodWeeks ?? 4);
      return rule.rounding === 'ceil' ? Math.ceil(periods) : periods;
    }
    if (rule.billingRule === 'optional') return 0;
    return 1;
  }

  private feeTotal(rule: CiaLocalFeeRule, quantity: number): number {
    if (rule.billingRule === 'visa-extension-schedule' && rule.rates?.length) {
      return rounded(Array.from({ length: quantity }, (_, index) => rule.rates![Math.min(index, rule.rates!.length - 1)] ?? rule.amount)
        .reduce((sum, amount) => sum + amount, 0));
    }
    return rounded(rule.amount * quantity);
  }

  private feeUnit(rule: CiaLocalFeeRule): string {
    const amount = Math.round(rule.amount).toLocaleString('en-US');
    if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') return `${amount} 比索／${rule.periodWeeks ?? 4}周`;
    if (rule.billingRule === 'visa-extension-schedule') return `${amount} 比索／30天`;
    return `${amount} 比索／次`;
  }
}
