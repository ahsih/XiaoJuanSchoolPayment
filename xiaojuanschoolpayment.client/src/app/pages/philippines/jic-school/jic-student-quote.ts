import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule } from '../cia-school/cia-content-config';
import {
  JIC_DEFAULT_START_DATE,
  JIC_WEEK_OPTIONS,
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
  get peakWeeks(): number {
    const ranges = this.prices.rules?.peakSeasonRanges.filter(range => range.enabled) ?? [
      { id: 'fallback', label: '2026暑期旺季', start: '2026-06-28', end: '2026-08-22', enabled: true },
    ];
    return ranges.reduce((sum, range) => sum + this.quotePlan.overlapWeeks(range.start, range.end), 0);
  }
  get seasonalSurcharge(): number { return this.peakWeeks * this.prices.seasonalFeePerWeek; }

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
    return tiers[0]?.[1] ?? rule?.discountValue ?? 0;
  }
  get longTermNote(): string {
    const rule = this.promotion('jic-long-term');
    if (!rule) return '长期优惠目前已停用。';
    if (this.courseWeeks < rule.minimumCourseWeeks) return `未满${rule.minimumCourseWeeks}周；${rule.description}`;
    if (this.selectedRegistrationDate < (rule.registrationStart || '0000-01-01') || this.arrivalDate < (rule.arrivalStart || '0000-01-01')) return `报名日及到校日须符合优惠日期；${rule.description}`;
    return `${this.courseWeeks}周符合长期优惠，减${money(this.longTermDiscount)}美元；${rule.description}`;
  }

  private get offSeasonRule(): CiaPromotionRule | undefined {
    return this.promotions.find(rule => rule.ruleKind?.startsWith('jic-off-season') &&
      this.arrivalDate >= (rule.arrivalStart || '0000-01-01') && this.arrivalDate <= (rule.arrivalEnd || '9999-12-31'));
  }
  private offSeasonRate(room: JicRoomFee): number {
    const rule = this.offSeasonRule;
    if (!rule) return 0;
    if (room.category === 'quad') return rule.discountValue;
    if (room.category === 'twin') return rule.incrementValue ?? 0;
    if (rule.ruleKind === 'jic-off-season-2026' || room.campus === 'challenger' || room.premium2027SingleEligible) return rule.incrementValue ?? 0;
    return 0;
  }
  get offSeasonDiscount(): number {
    if (this.isExtensionStudent || !this.offSeasonRule) return 0;
    return this.quotePlan.rooms.reduce((sum, row) => {
      const room = this.prices.roomFees.find((item) => item.id === row.optionId);
      return sum + (room ? Math.floor(row.weeks / 4) * this.offSeasonRate(room) : 0);
    }, 0);
  }
  get offSeasonNote(): string {
    if (this.isExtensionStudent) return '淡季优惠不适用于在校延长。';
    if (!this.offSeasonRule) return '当前到校日不在已启用的淡季到校窗口内。';
    if (!this.offSeasonDiscount) return '当前房型不符合该档期条件；Premium 2027单人房仅无阳台雅房适用。';
    return `${this.offSeasonRule.name}，按各住宿段的完整4周计算，共减${money(this.offSeasonDiscount)}美元；${this.offSeasonRule.description}`;
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
    if (this.isExtensionStudent) return '节日优惠不适用于在校延长。';
    if (this.firstRoom?.category === 'single') return '仅双人房及四人房适用，单人房不适用。';
    if (!this.holidayDiscount) return '当前到校日不在已启用的圣诞及节日优惠窗口。';
    return `到校日及房型符合${this.holidayRule?.name ?? '节日优惠'}，一次减${money(this.holidayDiscount)}美元；${this.holidayRule?.description ?? ''}`;
  }

  get registrationDiscount(): number {
    const rule = this.promotion('jic-registration');
    return rule && (this.returningStudent || this.isExtensionStudent || this.courseWeeks >= rule.minimumCourseWeeks) ? this.prices.registrationFee : 0;
  }
  get registrationDiscountNote(): string {
    if (this.isExtensionStudent) return '在校延长不重复收取注册费。';
    if (this.returningStudent) return '老学员返校免收一次性注册费。';
    const rule = this.promotion('jic-registration');
    if (!rule) return '注册费优惠目前已停用。';
    if (this.courseWeeks >= rule.minimumCourseWeeks) return `${rule.minimumCourseWeeks}周及以上免收${money(this.prices.registrationFee)}美元注册费。`;
    return `当前未满${rule.minimumCourseWeeks}周；新生一次性注册费${money(this.prices.registrationFee)}美元。`;
  }

  get paymentLines(): SchoolPaymentLine[] {
    return [
      { icon: '旺', label: '旺季附加费', value: this.seasonalSurcharge, note: this.peakWeeks ? `实际覆盖${this.peakWeeks}个已启用旺季课程周 × ${this.prices.seasonalFeePerWeek}美元；优惠不抵扣旺季费。` : '当前课程日期未覆盖已启用旺季。' },
      { icon: '免', label: '注册费优惠', value: -this.registrationDiscount, note: this.registrationDiscountNote, promotionKey: 'jic-registration' },
      { icon: '淡', label: this.offSeasonRule?.name ?? '淡季优惠', value: -this.offSeasonDiscount, note: this.offSeasonNote, promotionKey: this.offSeasonRule?.id ?? 'jic-off-season-none' },
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
    const extensions = this.visaExtensionCount;
    const fees = this.prices.rules?.localFees.filter(fee => fee.enabled && fee.includeInTotal) ?? this.fallbackLocalFees;
    return fees.map(fee => {
      const periodWeeks = Math.max(1, fee.periodWeeks ?? 4);
      const periodQuantity = (weeks: number) => fee.rounding === 'ceil' ? Math.ceil(weeks / periodWeeks) : weeks / periodWeeks;
      let quantity = 0;
      if (fee.id === 'challenger-elective') quantity = this.campus === 'challenger' && this.includeChallengerSpecialElective ? periodQuantity(this.courseWeeks) : 0;
      else if (fee.id === 'ielts-guarantee') quantity = this.quotePlan.courses.some(row => row.optionId === 'challenger-ielts-guarantee') ? 1 : 0;
      else if (fee.billingRule === 'once') quantity = 1;
      else if (fee.billingRule === 'first-visa-extension') quantity = extensions > 0 ? 1 : 0;
      else if (fee.billingRule === 'per-accommodation-period') quantity = periodQuantity(this.roomWeeks);
      else if (fee.billingRule === 'per-course-period') quantity = periodQuantity(this.courseWeeks);
      else if (fee.billingRule === 'selected-manila-pickup') quantity = this.airportPickup === 'manila' ? 1 : 0;
      else if (fee.billingRule === 'selected-clark-pickup') quantity = this.airportPickup === 'clark' ? 1 : 0;
      else if (fee.billingRule === 'visa-extension-schedule') quantity = extensions;
      const total = fee.billingRule === 'visa-extension-schedule' && fee.rates?.length
        ? Array.from({ length: extensions }, (_, index) => fee.rates?.[Math.min(index, fee.rates.length - 1)] ?? fee.amount).reduce((sum, amount) => sum + amount, 0)
        : fee.amount * quantity;
      const unit = fee.billingRule === 'visa-extension-schedule' ? '每30天' : fee.billingRule.includes('period') ? `${periodWeeks}周` : '次';
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
    return this.promotions.find(rule => rule.ruleKind === 'jic-holiday' &&
      this.arrivalDate >= (rule.arrivalStart || '0000-01-01') && this.arrivalDate <= (rule.arrivalEnd || '9999-12-31') &&
      (!rule.eligibleRoomIds?.length || (!!roomId && rule.eligibleRoomIds.includes(roomId))));
  }

  private get fallbackPromotions(): CiaPromotionRule[] {
    const base = (id: string, ruleKind: string): CiaPromotionRule => ({ id, name: id, ruleKind, description: '', enabled: true, sortOrder: 0, priority: 0, stackable: true, newStudentsOnly: false, discountType: 'fixed', discountValue: 0, appliesTo: 'school-total', waiveRegistration: false, minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, coverageTarget: 'none' });
    return [
      { ...base('jic-registration', 'jic-registration'), minimumCourseWeeks: 12, waiveRegistration: true },
      { ...base('jic-off-season-2026', 'jic-off-season-2026'), name: '2026淡季优惠', discountValue: 150, incrementValue: 50, arrivalStart: '2026-08-23', arrivalEnd: '2027-01-09' },
      { ...base('jic-off-season-2027-a', 'jic-off-season-2027'), name: '2027淡季优惠', discountValue: 100, incrementValue: 50, arrivalStart: '2027-02-21', arrivalEnd: '2027-06-26' },
      { ...base('jic-off-season-2027-b', 'jic-off-season-2027'), name: '2027淡季优惠', discountValue: 100, incrementValue: 50, arrivalStart: '2027-08-22', arrivalEnd: '2028-01-08' },
      { ...base('jic-long-term', 'jic-long-term'), minimumCourseWeeks: 12, registrationStart: '2026-03-08', arrivalStart: '2026-03-08', discountTiers: { '12': 300, '16': 400, '20': 500, '24': 600 } },
      { ...base('jic-besa', 'jic-besa'), registrationStart: '2026-04-01', registrationEnd: '2026-06-30', arrivalStart: '2026-08-23', arrivalEnd: '2026-12-13', incrementValue: 100, incrementWeeks: 4 },
      ...[['2026-11-29', '2026-12-13', 200], ['2026-12-27', '2027-01-10', 200], ['2027-11-28', '2027-12-12', 150], ['2027-12-26', '2028-01-09', 150]].map(([start, end, amount], index) => ({ ...base(`jic-holiday-${index}`, 'jic-holiday'), arrivalStart: String(start), arrivalEnd: String(end), discountValue: Number(amount) })),
    ];
  }

  private get fallbackLocalFees(): CiaLocalFeeRule[] {
    const fee = (id: string, name: string, amount: number, billingRule: CiaLocalFeeRule['billingRule'], sortOrder: number, periodWeeks?: number): CiaLocalFeeRule => ({ id, name, amount, currency: 'PHP', billingRule, periodWeeks, includeInTotal: true, note: '', enabled: true, sortOrder });
    return [
      fee('ssp', 'SSP特殊学习许可证', 7800, 'once', 0), fee('ssp-e-card', 'SSP-E CARD', 4500, 'once', 1), fee('acr-i-card', 'ACR-I CARD 外国人身份证', 4000, 'first-visa-extension', 2),
      fee('maintenance', '维护管理费', 1000, 'per-accommodation-period', 3, 4), fee('utilities', '水电费', 3000, 'per-accommodation-period', 4, 4),
      fee('manila-pickup', '马尼拉机场接机', 3000, 'selected-manila-pickup', 5), fee('clark-pickup', '克拉克机场接机', 3000, 'selected-clark-pickup', 6),
      { ...fee('visa-extension', '签证续签', 4940, 'visa-extension-schedule', 7), rates: [4940] },
      { ...fee('books', '教材费', 1900, 'per-course-period', 8, 8), rounding: 'ceil' }, fee('student-card', '学生证', 200, 'once', 9),
      fee('laundry', '洗衣服务', 1200, 'per-accommodation-period', 10, 4), fee('challenger-elective', 'Challenger特别选修课', 2000, 'per-course-period', 11, 4), fee('ielts-guarantee', 'IELTS保分班额外费用', 18000, 'once', 12),
    ];
  }
}
