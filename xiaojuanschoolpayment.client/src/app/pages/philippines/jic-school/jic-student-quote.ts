import { textbookGroups, textbookType } from '../school-textbook-estimate';
import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule } from '../cia-school/cia-content-config';
import {
  associationPeakBreakdownText,
  BESA_PEAK_RANGE_2027,
  calculateAssociationPeakSurcharge,
} from '../association-peak-surcharge';
import {
  isJicTermStart,
  JIC_WEEK_OPTIONS,
  nextJicTermStart,
  JicAirportPickup,
  JicCampus,
  JicCourseFee,
  JicRoomFee,
} from './jic-pricing';

export type JicVisaType = 'tourist30' | 'tourist59';

export interface JicQuoteRules {
  localFees: CiaLocalFeeRule[];
  promotions: CiaPromotionRule[];
  peakSeasonRanges: CiaPeakSeasonRange[];
}

interface JicQuotePrices {
  courseFees: JicCourseFee[];
  roomFees: JicRoomFee[];
  registrationFee: number;
  seasonalFeePerWeek: number;
  rules?: JicQuoteRules;
}

const money = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
const DAY = 86400000;
const parseDay = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Date.parse(`${value}T00:00:00Z`) : NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};
const SHORT_STAY_MULTIPLIERS: Record<number, number> = { 1: 0.4, 2: 0.65, 3: 0.85 };
const durationMultiplier = (weeks: number): number => SHORT_STAY_MULTIPLIERS[weeks] ?? weeks / 4;
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
  visaType: JicVisaType = 'tourist30';
  airportPickup: JicAirportPickup = 'none';
  includeChallengerSpecialElective = false;

  readonly visaOptions = [
    { value: 'tourist30' as const, label: '30天旅游签证（默认）' },
    { value: 'tourist59' as const, label: '59天旅游签证' },
  ];
  readonly airportPickupOptions = [
    { value: 'none' as const, label: '不需要接机' },
    { value: 'manila' as const, label: '马尼拉机场团体接机' },
    { value: 'clark' as const, label: '克拉克机场团体接机' },
  ];

  readonly quotePlan = new SchoolQuotePlan(
    'challenger-esl-lite',
    'challenger-quad-bunk',
    nextJicTermStart(),
    JIC_WEEK_OPTIONS,
    (kind) => kind === 'course'
      ? this.prices.courseFees.filter((course) => course.campus === this.campus).map((course) => ({ id: course.id, name: course.displayName, details: course.schedule }))
      : this.prices.roomFees.filter((room) => room.campus === this.campus).map((room) => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => {
      const fourWeekRate = kind === 'course'
        ? this.prices.courseFees.find((course) => course.id === row.optionId)?.tuition
        : this.prices.roomFees.find((room) => room.id === row.optionId)?.fee;
      return (fourWeekRate ?? 0) * durationMultiplier(row.weeks);
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
  private get peakRanges(): CiaPeakSeasonRange[] {
    return this.prices.rules?.peakSeasonRanges.filter(range => range.enabled) ?? [
      { id: 'jic-peak-2026', label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22', enabled: true },
      { id: 'jic-peak-2027', label: '2027暑期旺季', ...BESA_PEAK_RANGE_2027, enabled: true },
    ];
  }
  get peakCalculation() {
    return calculateAssociationPeakSurcharge(
      'JIC',
      this.quotePlan.weekStarts([...this.quotePlan.courses, ...this.quotePlan.rooms]),
      this.peakRanges,
      this.prices.seasonalFeePerWeek,
    );
  }
  /** Week starting on this day touches an enabled peak range (the same test as the surcharge). */
  private isPeakWeek(week: number): boolean {
    return this.peakRanges.some(range => week <= parseDay(range.end, -Infinity) && week + 6 * DAY >= parseDay(range.start, Infinity));
  }

  /**
   * JIC counts term weeks: a new term starts every second Sunday. Arriving on another Sunday or leaving before a
   * term ends costs 8,000 pesos each time (a reference row; the school confirms).
   */
  get oddWeekEvents(): number {
    const start = this.quotePlan.startDate, end = this.quotePlan.endDate;
    if (!start || !end) return 0;
    const next = new Date(parseDay(end, 0) + DAY).toISOString().slice(0, 10);
    return (isJicTermStart(start) ? 0 : 1) + (isJicTermStart(next) ? 0 : 1);
  }
  get peakWeeks(): number { return this.peakCalculation.weeks; }
  get seasonalSurcharge(): number { return this.peakCalculation.total; }

  get longTermEligible(): boolean {
    const rule = this.promotion('jic-long-term');
    if (!rule) return false;
    return this.courseWeeks >= rule.minimumCourseWeeks &&
      this.selectedRegistrationDate >= (rule.registrationStart || '0000-01-01') &&
      this.arrivalDate >= (rule.arrivalStart || '0000-01-01');
  }
  get longTermDiscount(): number {
    if (!this.longTermEligible) return 0;
    const rule = this.promotion('jic-long-term');
    const tiers = Object.entries(rule?.discountTiers ?? { '12': 300, '16': 400, '20': 500, '24': 600 })
      .map(([weeks, amount]) => [Number(weeks), amount] as const)
      .filter(([weeks]) => Number.isFinite(weeks) && weeks <= this.courseWeeks)
      .sort((a, b) => b[0] - a[0]);
    const [tierWeeks, amount] = tiers[0] ?? [0, rule?.discountValue ?? 0];
    // Past the last tier (24 weeks) each further complete four weeks adds another 100 dollars.
    return amount + (tierWeeks >= 24 ? Math.floor((this.courseWeeks - tierWeeks) / 4) * 100 : 0);
  }
  get longTermNote(): string {
    const rule = this.promotion('jic-long-term');
    if (!rule) return '长期优惠目前已停用。';
    if (this.courseWeeks < rule.minimumCourseWeeks) return `未满${rule.minimumCourseWeeks}周；${rule.description}`;
    if (this.selectedRegistrationDate < (rule.registrationStart || '0000-01-01') || this.arrivalDate < (rule.arrivalStart || '0000-01-01')) return `报名日及到校日须符合优惠日期；${rule.description}`;
    return `${this.courseWeeks}周符合长期优惠，减${money(this.longTermDiscount)}美元；${rule.description}`;
  }

  /** Per four weeks: quad rooms the rule's discountValue, twin rooms its incrementValue; singles depend on the window. */
  private offSeasonRate(rule: CiaPromotionRule, room: JicRoomFee): number {
    if (room.category === 'quad') return rule.discountValue;
    if (room.category === 'twin') return rule.incrementValue ?? 0;
    // 2027 windows: no single room at Challenger, and at Premium only the 单人雅房 (Dormitory 2).
    if (rule.ruleKind === 'jic-off-season-2026' || room.premium2027SingleEligible) return rule.incrementValue ?? 0;
    return 0;
  }
  /**
   * The off-season offer counts study weeks inside each window (the rule's arrivalStart–arrivalEnd, Sunday to
   * Saturday), not the arrival date; peak weeks never count. Every complete four weeks inside a window earns that
   * window's rate for the room; a block across two room types takes the lower rate.
   */
  private get offSeasonBlocks(): Array<{ rule: CiaPromotionRule; blocks: number; amount: number }> {
    if (this.isExtensionStudent) return [];
    const results: Array<{ rule: CiaPromotionRule; blocks: number; amount: number }> = [];
    for (const rule of this.promotions.filter(item => item.ruleKind?.startsWith('jic-off-season'))) {
      const start = parseDay(rule.arrivalStart, -Infinity), end = parseDay(rule.arrivalEnd, Infinity);
      const weeks = this.quotePlan.rooms.flatMap(row => {
        const room = this.prices.roomFees.find(item => item.id === row.optionId);
        if (!room) return [];
        const rate = this.offSeasonRate(rule, room);
        return this.quotePlan.weekStarts([row])
          .filter(week => week >= start && week + 6 * DAY <= end && !this.isPeakWeek(week))
          .map(week => ({ week, rate }));
      }).sort((a, b) => a.week - b.week);
      let blocks = 0, amount = 0;
      for (let index = 0; index + 4 <= weeks.length; index += 4) {
        const rate = Math.min(...weeks.slice(index, index + 4).map(item => item.rate));
        if (rate > 0) { blocks += 1; amount += rate; }
      }
      if (amount > 0) results.push({ rule, blocks, amount });
    }
    return results;
  }
  get offSeasonDiscount(): number {
    return this.offSeasonBlocks.reduce((sum, item) => sum + item.amount, 0);
  }
  get offSeasonBlockCount(): number {
    return this.offSeasonBlocks.reduce((sum, item) => sum + item.blocks, 0);
  }
  private get offSeasonRule(): CiaPromotionRule | undefined { return this.offSeasonBlocks[0]?.rule; }
  get offSeasonNote(): string {
    if (this.isExtensionStudent) return '淡季优惠不适用于在校延长。';
    if (!this.offSeasonDiscount) return '学习日期或房型不符合淡季优惠。';
    return `淡季学习每满4周按房型优惠，本次${this.offSeasonBlockCount}个4周，共减${money(this.offSeasonDiscount)}美元；旺季周不计。`;
  }

  get besaEligible(): boolean {
    const rule = this.promotion('jic-besa');
    return !!rule && !this.isExtensionStudent && this.fourWeekBlocks > 0 &&
      this.selectedRegistrationDate >= (rule.registrationStart || '0000-01-01') && this.selectedRegistrationDate <= (rule.registrationEnd || '9999-12-31') &&
      this.arrivalDate >= (rule.arrivalStart || '0000-01-01') && this.arrivalDate <= (rule.arrivalEnd || '9999-12-31');
  }
  get besaDiscount(): number { return this.besaEligible ? this.fourWeekBlocks * (this.promotion('jic-besa')?.incrementValue ?? 100) : 0; }
  get besaNote(): string {
    const rule = this.promotion('jic-besa');
    if (!rule) return 'BESA优惠目前已停用。';
    if (this.isExtensionStudent) return 'BESA优惠不适用于在校延长。';
    if (this.selectedRegistrationDate < (rule.registrationStart || '0000-01-01') || this.selectedRegistrationDate > (rule.registrationEnd || '9999-12-31')) return `报名日须在${rule.registrationStart}–${rule.registrationEnd}。`;
    if (this.arrivalDate < (rule.arrivalStart || '0000-01-01') || this.arrivalDate > (rule.arrivalEnd || '9999-12-31')) return `到校日须在${rule.arrivalStart}–${rule.arrivalEnd}。`;
    return `每完整${rule.incrementWeeks ?? 4}周减${money(rule.incrementValue ?? 100)}美元，本次减${money(this.besaDiscount)}美元；${rule.description}`;
  }

  private get firstRoom(): JicRoomFee | undefined {
    const row = [...this.quotePlan.rooms].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    return this.prices.roomFees.find((room) => room.id === row?.optionId);
  }
  get holidayDiscount(): number {
    if (this.isExtensionStudent || this.courseWeeks < 4 || this.firstRoom?.category === 'single') return 0;
    return this.holidayRule?.discountValue ?? 0;
  }
  get holidayNote(): string {
    if (this.isExtensionStudent) return '圣诞优惠不适用于在校延长。';
    if (this.firstRoom?.category === 'single') return '仅双人房及四人房适用，单人房不适用。';
    if (!this.holidayDiscount) return '到校日不是圣诞优惠的开学日。';
    return `${this.arrivalDate.replace(/-/g, '/')}开学日入学，住双人房或四人间，读满4周，一次减${money(this.holidayDiscount)}美元。`;
  }

  get registrationDiscount(): number {
    return this.prices.registrationFee;
  }
  get registrationDiscountNote(): string {
    if (this.isExtensionStudent) return '在校延长不重复收取注册费。';
    if (this.returningStudent) return '老学员返校免收一次性注册费。';
    return `通过思达启航报名，免收一次性${money(this.prices.registrationFee)}美元注册费。`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      { icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge, note: this.peakWeeks ? `${associationPeakBreakdownText(this.peakCalculation)}；同一周课程与住宿只计一次，优惠不抵扣旺季费。` : '当前日期未覆盖已启用旺季。' },
      { icon: '免', label: '思达启航注册费减免', value: -this.registrationDiscount, note: this.registrationDiscountNote, promotionKey: 'jic-registration' },
      { icon: '淡', label: '淡季优惠', value: -this.offSeasonDiscount, note: this.offSeasonNote, promotionKey: this.offSeasonRule?.id ?? 'jic-off-season-none' },
      { icon: '长', label: '长期优惠', value: -this.longTermDiscount, note: this.longTermNote, promotionKey: 'jic-long-term' },
      { icon: '节', label: '圣诞优惠', value: -this.holidayDiscount, note: this.holidayNote, promotionKey: this.holidayRule?.id ?? 'jic-holiday' },
      { icon: '惠', label: 'BESA优惠', value: -this.besaDiscount, note: this.besaNote, promotionKey: 'jic-besa' },
    ];
  }

  get quoteUsd(): number {
    return Math.max(0, this.prices.registrationFee + this.tuition + this.accommodation + this.paymentLines.reduce((sum, line) => sum + line.value, 0));
  }

  get visaLabel(): string { return this.visaType === 'tourist30' ? '30天旅游签证' : '59天旅游签证'; }
  /** One extension per further 30 days: a 30-day visa from week 5, a 59-day visa from week 9 (user rule 2026-11-24). */
  get visaExtensionCount(): number {
    const weeks = this.quotePlan.stayWeeks;
    const covered = this.visaType === 'tourist30' ? 4 : 8;
    return weeks > covered ? Math.ceil((weeks - covered) / 4) : 0;
  }
  /** A 59-day visa's first extension is the school's second one (6,210 pesos). */
  private get visaRateOffset(): number { return this.visaType === 'tourist59' ? 1 : 0; }
  get localFees(): SchoolLocalFee[] {
    const extensions = this.visaExtensionCount;
    const fees = this.prices.rules?.localFees.filter(fee => fee.enabled && fee.includeInTotal) ?? this.fallbackLocalFees;
    return fees.map(fee => {
      const periodWeeks = Math.max(1, fee.periodWeeks ?? 4);
      const periodQuantity = (weeks: number) => {
        if (weeks <= 0) return 0;
        return fee.rounding === 'ceil' ? Math.ceil(weeks / periodWeeks) : Math.max(1, weeks / periodWeeks);
      };
      let quantity = 0;
      if (fee.id === 'books') {
        const selected = textbookGroups(this.quotePlan.courses, id => {
          const course = this.prices.courseFees.find(course => course.id === id);
          return textbookType(id) + ':' + (course?.materialFee ?? 0);
        }).map(group => {
          const row = this.quotePlan.courses.find(row => {
            const course = this.prices.courseFees.find(course => course.id === row.optionId);
            return textbookType(row.optionId) + ':' + (course?.materialFee ?? 0) === group.type;
          })!;
          return { row: { ...row, weeks: group.weeks }, course: this.prices.courseFees.find(course => course.id === row.optionId) };
        });
        const quantity = selected.reduce((sum, item) => sum + (item.course?.materialFee ? Math.ceil(item.row.weeks / 4) : 0), 0);
        const total = selected.reduce((sum, item) => sum + (item.course?.materialFee ?? 0) * Math.ceil(item.row.weeks / 4), 0);
        const missing = selected.filter(item => !item.course?.materialFee).map(item => item.course?.displayName ?? item.row.optionId);
        const details = selected.filter(item => item.course?.materialFee).map(item => `${item.course?.displayName} ${money(item.course?.materialFee ?? 0)}比索／4周`).join('；');
        return {
          item: fee.name,
          unitLabel: '按所选课程／每开始4周',
          quantity,
          total,
          note: `${details || '按所选课程的教材费计算。'}${missing.length ? `；${missing.join('、')}暂无教材金额，本次暂计0比索并需顾问确认。` : ''}`,
        };
      }
      if (fee.id === 'challenger-elective') quantity = this.campus === 'challenger' && this.includeChallengerSpecialElective ? periodQuantity(this.courseWeeks) : 0;
      else if (fee.id === 'ielts-guarantee') quantity = this.quotePlan.courses.filter(row => row.optionId === 'challenger-ielts-guarantee').reduce((sum, row) => sum + Math.ceil(row.weeks / 8), 0);
      else if (fee.billingRule === 'once') quantity = 1;
      else if (fee.billingRule === 'first-visa-extension') quantity = extensions > 0 ? 1 : 0;
      else if (fee.billingRule === 'per-accommodation-period') quantity = periodQuantity(this.roomWeeks);
      else if (fee.billingRule === 'per-course-period') quantity = periodQuantity(this.courseWeeks);
      else if (fee.billingRule === 'selected-manila-pickup') quantity = this.airportPickup === 'manila' ? 1 : 0;
      else if (fee.billingRule === 'selected-clark-pickup') quantity = this.airportPickup === 'clark' ? 1 : 0;
      else if (fee.billingRule === 'visa-extension-schedule') quantity = extensions;
      const total = fee.billingRule === 'visa-extension-schedule' && fee.rates?.length
        ? Array.from({ length: extensions }, (_, index) => fee.rates?.[Math.min(index + this.visaRateOffset, fee.rates.length - 1)] ?? fee.amount).reduce((sum, amount) => sum + amount, 0)
        : fee.amount * quantity;
      const unit = fee.billingRule === 'visa-extension-schedule' ? '按学校累计表' : fee.billingRule.includes('period') ? `${periodWeeks}周` : '次';
      return { item: fee.name, unitLabel: `${money(fee.amount)} 比索／${unit}`, quantity, total, note: fee.note };
    });
  }
  get localFeeTotal(): number { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }

  private get promotions(): CiaPromotionRule[] {
    return this.prices.rules?.promotions.filter(rule => rule.enabled) ?? this.fallbackPromotions;
  }

  private promotion(ruleKind: string): CiaPromotionRule | undefined {
    return this.promotions.find(rule => rule.ruleKind === ruleKind);
  }

  private get holidayRule(): CiaPromotionRule | undefined {
    const roomId = this.firstRoom?.id;
    // Only the term-start Sundays inside the window qualify (2026: 11/29, 12/13, 12/27, 1/10).
    return this.promotions.find(rule => rule.ruleKind === 'jic-holiday' && isJicTermStart(this.arrivalDate) &&
      this.arrivalDate >= (rule.arrivalStart || '0000-01-01') && this.arrivalDate <= (rule.arrivalEnd || '9999-12-31') &&
      (!rule.eligibleRoomIds?.length || (!!roomId && rule.eligibleRoomIds.includes(roomId))));
  }

  private get fallbackPromotions(): CiaPromotionRule[] {
    const base = (id: string, ruleKind: string): CiaPromotionRule => ({ id, name: id, ruleKind, description: '', enabled: true, sortOrder: 0, priority: 0, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, coverageTarget: 'none' });
    return [
      { ...base('jic-registration', 'jic-registration'), name: '思达启航注册费减免', description: '所有通过思达启航报名的学生均免收一次性注册费；老学员返校同样免费。', minimumCourseWeeks: 0, waiveRegistration: true },
      { ...base('jic-off-season-2026', 'jic-off-season-2026'), name: '淡季优惠', discountValue: 150, incrementValue: 50, arrivalStart: '2026-08-23', arrivalEnd: '2027-01-09' },
      { ...base('jic-off-season-2027-a', 'jic-off-season-2027'), name: '淡季优惠', discountValue: 100, incrementValue: 50, arrivalStart: '2027-02-21', arrivalEnd: '2027-06-26' },
      { ...base('jic-off-season-2027-b', 'jic-off-season-2027'), name: '淡季优惠', discountValue: 100, incrementValue: 50, arrivalStart: '2027-08-22', arrivalEnd: '2028-01-08' },
      { ...base('jic-long-term', 'jic-long-term'), minimumCourseWeeks: 12, registrationStart: '2026-03-08', arrivalStart: '2026-03-08', discountTiers: { '12': 300, '16': 400, '20': 500, '24': 600 } },
      { ...base('jic-besa', 'jic-besa'), registrationStart: '2026-04-01', registrationEnd: '2026-06-30', arrivalStart: '2026-08-23', arrivalEnd: '2026-12-13', incrementValue: 100, incrementWeeks: 4 },
      ...[['2026-11-29', '2027-01-10', 200], ['2027-11-28', '2028-01-09', 150]].map(([start, end, amount], index) => ({ ...base(`jic-holiday-${index}`, 'jic-holiday'), arrivalStart: String(start), arrivalEnd: String(end), discountValue: Number(amount) })),
    ];
  }

  private get fallbackLocalFees(): CiaLocalFeeRule[] {
    const fee = (id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], sortOrder: number, periodWeeks?: number): CiaLocalFeeRule => ({ id, name, amount, currency: 'PHP', billingRule, periodWeeks, includeInTotal: true, note: '', enabled: true, sortOrder });
    return [
      fee('ssp', 'SSP特殊学习许可证', 7800, 'once', 0), fee('ssp-e-card', 'SSP-E CARD', 4500, 'once', 1), fee('acr-i-card', 'ACR-I CARD 外国人身份证', 4000, 'first-visa-extension', 2),
      fee('maintenance', '维护管理费', 1200, 'per-accommodation-period', 3, 4), fee('utilities', '水电费', 3000, 'per-accommodation-period', 4, 4),
      fee('manila-pickup', '马尼拉机场接机', 3000, 'selected-manila-pickup', 5), fee('clark-pickup', '克拉克机场接机', 3000, 'selected-clark-pickup', 6),
      { ...fee('visa-extension', '签证续签', 4940, 'visa-extension-schedule', 7), rates: [4940, 6210, 4240, 4240, 4240] },
      { ...fee('books', '教材费', 0, 'per-course-period', 8, 4), rounding: 'ceil' }, fee('student-card', '学生证', 200, 'once', 9),
      fee('laundry', '洗衣服务', 1200, 'per-accommodation-period', 10, 4), fee('challenger-elective', '付费特别课', 2000, 'per-course-period', 11, 4), fee('ielts-guarantee', 'IELTS保分班额外费用', 18000, 'once', 12),
    ];
  }
}
