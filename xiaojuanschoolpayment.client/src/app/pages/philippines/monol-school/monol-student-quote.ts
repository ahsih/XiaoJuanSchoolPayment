import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';

export interface MonolQuotePrices {
  courseFees: { id: string; name: string; tuition: number; suitable: string; note: string }[];
  roomFees: { id: string; name: string; fee: number; note: string }[];
  registrationFee: number;
  shortStayRatios: Record<string, number>;
  promotionRules: CiaPromotionRule[];
  localFeeRules: CiaLocalFeeRule[];
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
      const multiplier = row.weeks < 4
        ? (this.prices.shortStayRatios[String(row.weeks)] ?? row.weeks / 4)
        : row.weeks / 4;
      return rounded((rate ?? 0) * multiplier);
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
  get registrationDiscount() {
    const rule = this.promotion('monol-registration-waiver');
    return rule?.waiveRegistration && (!rule.newStudentsOnly || !this.returningStudent) ? this.registration : 0;
  }
  get visaLabel() { return this.visaOptions.find((option) => option.value === this.visaType)?.label ?? ''; }

  private rowMatchesRule(row: { startDate: string; weeks: number }, rule: CiaPromotionRule, kind: 'course' | 'room'): boolean {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return false;
    if (kind === 'course' && row.weeks < rule.minimumCourseWeeks) return false;
    if (kind === 'room' && row.weeks < rule.minimumAccommodationWeeks) return false;
    const start = this.quotePlan.date(row.startDate);
    const end = this.quotePlan.date(new Date((start ?? 0) + (row.weeks * 7 - 1) * DAY).toISOString().slice(0, 10));
    if (start === null || end === null) return false;
    const registration = this.quotePlan.date(this.selectedRegistrationDate);
    const registrationStart = rule.registrationStart ? this.quotePlan.date(rule.registrationStart) : null;
    const registrationEnd = rule.registrationEnd ? this.quotePlan.date(rule.registrationEnd) : null;
    const arrivalStart = rule.arrivalStart ? this.quotePlan.date(rule.arrivalStart) : null;
    const arrivalEnd = rule.arrivalEnd ? this.quotePlan.date(rule.arrivalEnd) : null;
    const coverageStart = rule.coverageStart ? this.quotePlan.date(rule.coverageStart) : null;
    const coverageEnd = rule.coverageEnd ? this.quotePlan.date(rule.coverageEnd) : null;
    if (registration === null) return false;
    if (registrationStart !== null && registration < registrationStart) return false;
    if (registrationEnd !== null && registration > registrationEnd) return false;
    if (arrivalStart !== null && start < arrivalStart) return false;
    if (arrivalEnd !== null && start > arrivalEnd) return false;
    if (coverageStart !== null && start < coverageStart) return false;
    if (coverageEnd !== null && end > coverageEnd) return false;
    return true;
  }

  private offSeasonSummary(kind: 'course' | 'room'): { blocks: number; discount: number; rules: CiaPromotionRule[] } {
    const prefix = `monol-off-season-${kind}`;
    const rows = kind === 'course' ? this.quotePlan.courses : this.quotePlan.rooms;
    let blocks = 0;
    let discount = 0;
    const rules: CiaPromotionRule[] = [];
    for (const row of rows) {
      const rule = this.prices.promotionRules.find(item => item.id.startsWith(prefix) && this.rowMatchesRule(row, item, kind));
      if (!rule) continue;
      const rowBlocks = Math.floor(row.weeks / 4);
      blocks += rowBlocks;
      discount += rowBlocks * rule.discountValue;
      if (!rules.some(item => item.id === rule.id)) rules.push(rule);
    }
    return { blocks, discount, rules };
  }

  get offSeasonCourseBlocks() {
    return this.offSeasonSummary('course').blocks;
  }
  get offSeasonRoomBlocks() {
    return this.offSeasonSummary('room').blocks;
  }
  get offSeasonCourseDiscount() { return this.offSeasonSummary('course').discount; }
  get offSeasonRoomDiscount() { return this.offSeasonSummary('room').discount; }
  get isBreakfastEligible() { return this.offSeasonCourseBlocks > 0; }

  get snsEligibleBlocks(): number {
    const rule = this.promotion('monol-sns');
    if (!rule || (rule.newStudentsOnly && this.returningStudent)) return 0;
    const from = this.quotePlan.date(rule.coverageStart ?? '');
    const to = this.quotePlan.date(rule.coverageEnd ?? '');
    if (from === null || to === null) return 0;
    const eligibleRoomIds = rule.eligibleRoomIds?.length
      ? rule.eligibleRoomIds
      : ['premium-single-room', 'standard-single-room', 'small-single-room'];
    const eligibleRooms = this.quotePlan.rooms.filter((room) =>
      eligibleRoomIds.includes(room.optionId));
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
  get snsDiscount() {
    const rule = this.promotion('monol-sns');
    return this.applySnsPromotion && rule ? this.snsEligibleBlocks * rule.discountValue : 0;
  }

  get quoteBeforeDiscounts() { return this.registration + this.tuition + this.accommodation; }
  get quoteUsd() {
    return Math.max(0, rounded(this.quoteBeforeDiscounts - this.registrationDiscount
      - this.offSeasonCourseDiscount - this.offSeasonRoomDiscount - this.snsDiscount));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const registration = this.promotion('monol-registration-waiver');
    const courseSummary = this.offSeasonSummary('course');
    const roomSummary = this.offSeasonSummary('room');
    const snsRule = this.promotion('monol-sns');
    return [
      ...(this.registrationDiscount ? [{ icon: '免', label: registration?.name ?? '思达注册费优惠', value: -this.registrationDiscount, note: registration?.description ?? '通过思达报名免注册费。', promotionKey: 'registration' }] : []),
      ...(this.offSeasonCourseDiscount ? [{
        icon: '惠', label: '淡季课程优惠', value: -this.offSeasonCourseDiscount,
        note: `${this.offSeasonCourseBlocks}个完整4周；${courseSummary.rules.map(rule => rule.description).join('；') || '按当前淡季规则计算。'}`, promotionKey: 'off-season-course',
      }] : []),
      ...(this.offSeasonRoomDiscount ? [{
        icon: '惠', label: '淡季住宿优惠', value: -this.offSeasonRoomDiscount,
        note: `${this.offSeasonRoomBlocks}个完整4周；${roomSummary.rules.map(rule => rule.description).join('；') || '按当前淡季规则计算。'}`, promotionKey: 'off-season-room',
      }] : []),
      ...(this.snsDiscount ? [{
        icon: '惠', label: snsRule?.name ?? 'SNS特别活动', value: -this.snsDiscount,
        note: `${this.snsEligibleBlocks}个完整4周；${snsRule?.description ?? '符合日期、房型及发布要求。'}`, promotionKey: 'sns',
      }] : []),
    ];
  }

  get statusLines(): QuoteImagePaymentItem[] {
    const courseRules = this.prices.promotionRules.filter(item => item.enabled && item.id.startsWith('monol-off-season-course'));
    const roomRules = this.prices.promotionRules.filter(item => item.enabled && item.id.startsWith('monol-off-season-room'));
    const snsRule = this.promotion('monol-sns');
    return [
      ...(!this.offSeasonCourseDiscount && courseRules.length ? [{ icon: '惠', label: '淡季课程优惠', amount: '未适用', note: courseRules.map(rule => rule.description).join('；') }] : []),
      ...(!this.offSeasonRoomDiscount && roomRules.length ? [{ icon: '惠', label: '淡季住宿优惠', amount: '未适用', note: roomRules.map(rule => rule.description).join('；') }] : []),
      { icon: '早', label: '淡季工作日免费早餐', amount: this.isBreakfastEligible ? '适用' : '未适用', note: '符合淡季条件且在2026/12/31前的工作日提供免费早餐。' },
      ...(!this.snsDiscount && snsRule ? [{ icon: '惠', label: snsRule.name, amount: '未适用', note: snsRule.description }] : []),
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
    return this.prices.localFeeRules
      .filter(rule => rule.enabled && rule.includeInTotal)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => {
        const period = Math.max(1, rule.periodWeeks ?? 4);
        let quantity = 1;
        if (rule.id === 'acr-i-card' || rule.billingRule === 'first-visa-extension') quantity = extensions > 0 ? 1 : 0;
        else if (rule.billingRule === 'visa-extension-schedule') quantity = extensions;
        else if (rule.billingRule === 'per-course-period') {
          quantity = this.quotePlan.courses.reduce((sum, row) => sum + (rule.rounding === 'ceil' ? Math.ceil(row.weeks / period) : row.weeks / period), 0);
        } else if (rule.billingRule === 'per-accommodation-period') {
          quantity = rule.rounding === 'ceil' ? Math.ceil(this.quotePlan.roomWeeks / period) : this.quotePlan.roomWeeks / period;
        } else if (rule.id === 'manila-pickup') quantity = this.pickupAirport === 'manila' ? 1 : 0;
        else if (rule.id === 'clark-pickup') quantity = this.pickupAirport === 'clark' ? 1 : 0;
        const unitLabel = rule.billingRule === 'visa-extension-schedule' ? `${rule.amount.toLocaleString()}比索／30天`
          : rule.billingRule === 'per-course-period' || rule.billingRule === 'per-accommodation-period' ? `${rule.amount.toLocaleString()}比索／${period}周`
            : `${rule.amount.toLocaleString()}比索／次`;
        const visaNote = ['acr-i-card', 'visa-extension'].includes(rule.id) ? `按${this.visaLabel}和完整停留跨度预估；` : '';
        return { item: rule.name, unitLabel, quantity, total: rounded(rule.amount * quantity), note: `${visaNote}${rule.note}` };
      });
  }

  get roomDeposit() { return this.fee('room-deposit')?.amount ?? 0; }
  get mealQuantity() { return this.quotePlan.roomWeeks / 4; }
  get mealEstimate() {
    const fee = this.fee('meals');
    const period = Math.max(1, fee?.periodWeeks ?? 4);
    return rounded((fee?.amount ?? 0) * this.quotePlan.roomWeeks / period);
  }

  private promotion(id: string): CiaPromotionRule | undefined {
    return this.prices.promotionRules.find(item => item.id === id && item.enabled);
  }

  private fee(id: string): CiaLocalFeeRule | undefined {
    return this.prices.localFeeRules.find(item => item.id === id && item.enabled);
  }
}
