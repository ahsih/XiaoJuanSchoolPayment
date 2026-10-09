import { textbookGroups, textbookPeriods } from '../school-textbook-estimate';
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

  private eligibleWeeks(kind: 'course' | 'room', rule: CiaPromotionRule, roomIds?: string[]): number {
    if (!rule.enabled || (rule.newStudentsOnly && this.returningStudent)) return 0;
    if (this.quotePlan.courseWeeks < rule.minimumCourseWeeks || this.quotePlan.roomWeeks < rule.minimumAccommodationWeeks) return 0;
    const registration = this.quotePlan.date(this.selectedRegistrationDate);
    if (registration === null || (rule.registrationStart && this.selectedRegistrationDate < rule.registrationStart) || (rule.registrationEnd && this.selectedRegistrationDate > rule.registrationEnd)) return 0;
    const rows = kind === 'course' ? this.quotePlan.courses : this.quotePlan.rooms;
    const other = kind === 'course' ? this.quotePlan.rooms : this.quotePlan.courses;
    let weeks = 0;
    for (const row of rows) {
      if (roomIds && !roomIds.includes(row.optionId)) continue;
      const start = this.quotePlan.date(row.startDate);
      if (start === null) continue;
      for (let week = 0; week < row.weeks; week++) {
        const from = new Date(start + week * 7 * DAY).toISOString().slice(0, 10);
        const to = new Date(start + (week * 7 + 6) * DAY).toISOString().slice(0, 10);
        if (from <= '2027-08-21' && to >= '2027-06-27') continue;
        if (this.quotePlan.covers(from, to, other)) weeks++;
      }
    }
    return weeks;
  }
  private offSeasonSummary(kind: 'course' | 'room'): { blocks: number; discount: number; rules: CiaPromotionRule[] } {
    const rule = this.prices.promotionRules.find(item => item.enabled && item.id.startsWith(`monol-off-season-${kind}`));
    const blocks = rule ? Math.floor(this.eligibleWeeks(kind, rule) / 4) : 0;
    return { blocks, discount: blocks * (rule?.discountValue ?? 0), rules: rule ? [rule] : [] };
  }
  get offSeasonCourseBlocks() { return this.offSeasonSummary('course').blocks; }
  get offSeasonRoomBlocks() { return this.offSeasonSummary('room').blocks; }
  get offSeasonCourseDiscount() { return this.offSeasonSummary('course').discount; }
  get offSeasonRoomDiscount() { return this.offSeasonSummary('room').discount; }
  get isBreakfastEligible() { return this.quotePlan.courses.some(row => row.startDate <= '2027-12-31'); }
  get snsEligibleBlocks() {
    const rule = this.promotion('monol-sns');
    return rule ? Math.floor(this.eligibleWeeks('room', rule, rule.eligibleRoomIds) / 4) : 0;
  }
  get snsDiscount() { return this.applySnsPromotion ? this.snsEligibleBlocks * (this.promotion('monol-sns')?.discountValue ?? 0) : 0; }
  get longTermDiscount() {
    const rule = this.promotion('monol-long-term');
    if (!rule || this.selectedRegistrationDate < (rule.registrationStart ?? '') || this.selectedRegistrationDate > (rule.registrationEnd ?? '9999')) return 0;
    if (this.quotePlan.courseWeeks !== this.quotePlan.roomWeeks) return 0;
    return ({ 16: 150, 20: 200, 24: 300 } as Record<number, number>)[this.quotePlan.courseWeeks] ?? 0;
  }
  get christmasDiscount() {
    const rule = this.promotion('monol-christmas');
    const arrival = this.quotePlan.courses[0]?.startDate;
    return rule && arrival && arrival >= (rule.arrivalStart ?? '') && arrival <= (rule.arrivalEnd ?? '9999')
      && this.quotePlan.courseWeeks >= rule.minimumCourseWeeks && this.quotePlan.roomWeeks >= rule.minimumAccommodationWeeks
      && this.quotePlan.rooms[0]?.startDate === arrival ? rule.discountValue : 0;
  }

  get quoteBeforeDiscounts() { return this.registration + this.tuition + this.accommodation; }
  get quoteUsd() {
    return Math.max(0, rounded(this.quoteBeforeDiscounts - this.registrationDiscount
      - this.offSeasonCourseDiscount - this.offSeasonRoomDiscount - this.snsDiscount - this.longTermDiscount - this.christmasDiscount));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const registration = this.promotion('monol-registration-waiver');
    const courseSummary = this.offSeasonSummary('course');
    const roomSummary = this.offSeasonSummary('room');
    const snsRule = this.promotion('monol-sns');
    return [
      ...(['long-term', 'christmas'] as const).flatMap(key => {
        const rule = this.promotion(`monol-${key}`);
        const value = key === 'long-term' ? this.longTermDiscount : this.christmasDiscount;
        return rule && value ? [{ icon: '惠', label: rule.name, value: -value, note: rule.description, promotionKey: key }] : [];
      }),
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
      { icon: '早', label: '上课日免费早餐', amount: this.isBreakfastEligible ? '适用' : '未适用', note: '截至2027/12/31提供上课日免费早餐，周末及节假日除外；超出有效期的日期不适用。' },
      ...(!this.snsDiscount && snsRule ? [{ icon: '惠', label: snsRule.name, amount: '未适用', note: snsRule.description }] : []),
    ];
  }

  get visaExtensionCount() {
    const initialDays = this.visaType === 'tourist30' ? 30 : 59;
    return Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - initialDays) / 30));
  }
  get textbookQuantity() {
    return textbookPeriods(this.quotePlan.courses, 4);
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
          quantity = rule.id === 'books' ? textbookPeriods(this.quotePlan.courses, period, rule.rounding === 'ceil' ? 'ceil' : 'proportional') : this.quotePlan.courses.reduce((sum, row) => sum + (rule.rounding === 'ceil' ? Math.ceil(row.weeks / period) : row.weeks / period), 0);
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
