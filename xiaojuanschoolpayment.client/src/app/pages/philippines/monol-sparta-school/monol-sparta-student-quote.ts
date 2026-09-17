import { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';

export interface MonolSpartaQuotePrices {
  courseFees: { id: string; name: string; tuition: number; suitable: string; note: string }[];
  roomFees: { id: string; name: string; fee: number; note: string }[];
  registrationFee: number;
  promotionRules: CiaPromotionRule[];
  localFeeRules: CiaLocalFeeRule[];
}

export const MONOL_SPARTA_VISA_OPTIONS = [
  { value: 'china59', label: '中国护照（59天旅游签证）' },
  { value: 'china30', label: '中国护照（30天旅游签证）' },
  { value: 'hongkong14', label: '香港特区护照（14天免签停留）' },
  { value: 'macau7', label: '澳门特区护照（7天免签停留）' },
] as const;

export type MonolSpartaVisaType = typeof MONOL_SPARTA_VISA_OPTIONS[number]['value'];
export type MonolSpartaPickup = 'none' | 'manila-group' | 'clark-group' | 'manila-special' | 'clark-special';

const DAY = 86_400_000;
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const today = () => localDate(new Date());
const nextSunday = () => {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return localDate(date);
};

const visaExtensionAmount = (visa: MonolSpartaVisaType, weeks: number): number => {
  if (visa === 'china59') {
    if (weeks <= 8) return 0;
    if (weeks <= 12) return 6210;
    if (weeks <= 16) return 10450;
    if (weeks <= 20) return 14690;
    return 18930;
  }
  if (visa === 'china30') {
    if (weeks <= 4) return 0;
    if (weeks <= 8) return 6210;
    if (weeks <= 12) return 10450;
    if (weeks <= 16) return 14690;
    if (weeks <= 20) return 18930;
    return 23170;
  }
  if (visa === 'hongkong14') {
    if (weeks <= 2) return 0;
    if (weeks === 3) return 2460;
    if (weeks <= 8) return 7400;
    if (weeks <= 12) return 13610;
    if (weeks <= 16) return 17850;
    if (weeks <= 20) return 22090;
    return 26330;
  }
  if (weeks <= 1) return 0;
  if (weeks === 2) return 2460;
  if (weeks <= 8) return 7400;
  if (weeks <= 12) return 13610;
  if (weeks <= 16) return 17850;
  if (weeks <= 20) return 22090;
  return 26330;
};

/** Independent MONOL Sparta calculator. No main-campus prices or rules are imported. */
export class MonolSpartaStudentQuote {
  constructor(private readonly prices: MonolSpartaQuotePrices) {}

  selectedRegistrationDate = today();
  readonly visaOptions = MONOL_SPARTA_VISA_OPTIONS;
  visaType: MonolSpartaVisaType = 'china59';
  pickup: MonolSpartaPickup = 'manila-group';
  applySnsPromotion = false;
  readonly weekOptions = [4, 8, 12, 16, 20, 24];

  readonly quotePlan = new SchoolQuotePlan(
    'booster-esl',
    'triple-room',
    nextSunday(),
    this.weekOptions,
    kind => kind === 'course'
      ? this.prices.courseFees.map(item => ({ id: item.id, name: item.name, details: [item.suitable, item.note].filter(Boolean).join('；') }))
      : this.prices.roomFees.map(item => ({ id: item.id, name: item.name, details: item.note })),
    (kind, row) => {
      const rate = kind === 'course'
        ? this.prices.courseFees.find(item => item.id === row.optionId)?.tuition
        : this.prices.roomFees.find(item => item.id === row.optionId)?.fee;
      return rounded((rate ?? 0) * row.weeks / 4);
    },
  );

  get quoteError(): string {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的护照／签证类型。';
    if (!['none', 'manila-group', 'clark-group', 'manila-special', 'clark-special'].includes(this.pickup)) return '请选择有效的接机安排。';
    return '';
  }

  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  /** 思达启航为所有通过思达报名的学生免除学校原价注册费。 */
  get registration() { return 0; }
  get visaLabel() { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }

  private rule(id: string) {
    return this.prices.promotionRules.find(item => item.id === id && item.enabled);
  }

  private registrationMatches(rule: CiaPromotionRule): boolean {
    const registration = this.quotePlan.date(this.selectedRegistrationDate);
    const start = rule.registrationStart ? this.quotePlan.date(rule.registrationStart) : null;
    const end = rule.registrationEnd ? this.quotePlan.date(rule.registrationEnd) : null;
    if (registration === null) return false;
    if (start !== null && registration < start) return false;
    return end === null || registration <= end;
  }

  private coveredBlocks(kind: 'course' | 'room', rule: CiaPromotionRule | undefined): number {
    if (!rule || !this.registrationMatches(rule)) return 0;
    const rows = kind === 'course' ? this.quotePlan.courses : this.quotePlan.rooms;
    const counterpart = kind === 'course' ? this.quotePlan.rooms : this.quotePlan.courses;
    let blocks = 0;
    for (const row of rows) {
      const start = this.quotePlan.date(row.startDate);
      if (start === null) continue;
      for (let index = 0; index < Math.floor(row.weeks / 4); index += 1) {
        const from = start + index * 28 * DAY;
        const to = from + 27 * DAY;
        const fromText = new Date(from).toISOString().slice(0, 10);
        const toText = new Date(to).toISOString().slice(0, 10);
        if (this.quotePlan.covers(fromText, toText, counterpart)) blocks += 1;
      }
    }
    return blocks;
  }

  get coursePromotionBlocks() { return this.coveredBlocks('course', this.rule('sparta-course-2026')); }
  get roomPromotionBlocks() { return this.coveredBlocks('room', this.rule('sparta-room-2026')); }
  get snsEligibleBlocks() { return this.coveredBlocks('course', this.rule('sparta-sns-2026')); }
  get coursePromotionDiscount() { return this.coursePromotionBlocks * (this.rule('sparta-course-2026')?.discountValue ?? 0); }
  get roomPromotionDiscount() { return this.roomPromotionBlocks * (this.rule('sparta-room-2026')?.discountValue ?? 0); }
  get snsDiscount() {
    const rule = this.rule('sparta-sns-2026');
    return this.applySnsPromotion && rule?.stackable
      ? this.snsEligibleBlocks * rule.discountValue
      : 0;
  }

  get quoteUsd() {
    return Math.max(0, rounded(this.registration + this.tuition + this.accommodation
      - this.coursePromotionDiscount - this.roomPromotionDiscount - this.snsDiscount));
  }

  get paymentLines(): SchoolPaymentLine[] {
    const courseRule = this.rule('sparta-course-2026');
    const roomRule = this.rule('sparta-room-2026');
    const snsRule = this.rule('sparta-sns-2026');
    return [
      ...(this.coursePromotionDiscount ? [{ icon: '惠', label: courseRule?.name ?? '课程优惠', value: -this.coursePromotionDiscount, note: `${this.coursePromotionBlocks}个完整4周；${courseRule?.description ?? ''}`, promotionKey: courseRule?.id }] : []),
      ...(this.roomPromotionDiscount ? [{ icon: '惠', label: roomRule?.name ?? '住宿优惠', value: -this.roomPromotionDiscount, note: `${this.roomPromotionBlocks}个完整4周；${roomRule?.description ?? ''}`, promotionKey: roomRule?.id }] : []),
      ...(this.snsDiscount ? [{ icon: '惠', label: snsRule?.name ?? 'SNS活动', value: -this.snsDiscount, note: `${this.snsEligibleBlocks}个完整4周；${snsRule?.description ?? ''}；活动是否开放及能否叠加须学校书面确认`, promotionKey: snsRule?.id }] : []),
    ];
  }

  get statusLines(): QuoteImagePaymentItem[] {
    const courseRule = this.rule('sparta-course-2026');
    const roomRule = this.rule('sparta-room-2026');
    const snsRule = this.rule('sparta-sns-2026');
    return [
      ...(!this.coursePromotionDiscount && courseRule ? [{ icon: '惠', label: courseRule.name, amount: '未适用', note: courseRule.description }] : []),
      ...(!this.roomPromotionDiscount && roomRule ? [{ icon: '惠', label: roomRule.name, amount: '未适用', note: roomRule.description }] : []),
      ...(!this.snsDiscount && snsRule ? [{ icon: '惠', label: snsRule.name, amount: '未计入', note: this.applySnsPromotion
        ? `${snsRule.description}；与课程及住宿优惠能否叠加未确认，默认不从总价扣除`
        : `${snsRule.description}；需手动选择，并由学校确认活动仍开放及叠加资格` }] : []),
    ];
  }

  get visaExtensionFee() { return visaExtensionAmount(this.visaType, this.quotePlan.stayWeeks); }

  get localFees(): SchoolLocalFee[] {
    return this.prices.localFeeRules
      .filter(rule => rule.enabled && rule.includeInTotal)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => {
        let quantity = 1;
        let total = rule.amount;
        let unitLabel = `${rule.amount.toLocaleString('zh-CN')}比索／次`;
        if (rule.id === 'visa-extension') {
          total = this.visaExtensionFee;
          quantity = total > 0 ? 1 : 0;
          unitLabel = total > 0 ? `${total.toLocaleString('zh-CN')}比索／累计` : '无需延签';
        } else if (rule.id === 'manila-group-pickup') {
          quantity = this.pickup === 'manila-group' ? 1 : 0;
        } else if (rule.id === 'clark-group-pickup') {
          quantity = this.pickup === 'clark-group' ? 1 : 0;
        }
        const visaNote = rule.id === 'visa-extension' ? `按${this.visaLabel}、${this.quotePlan.stayWeeks}周停留预估；` : '';
        return { item: rule.name, unitLabel, quantity, total: rounded(total * quantity), note: `${visaNote}${rule.note}` };
      });
  }

  get securityDeposit() { return this.prices.localFeeRules.find(item => item.id === 'security-deposit' && item.enabled)?.amount ?? 0; }
  get tvvAcrReference() { return this.prices.localFeeRules.find(item => item.id === 'tvv-acr' && item.enabled); }
  get selectedSpecialPickup() {
    const id = this.pickup === 'manila-special' ? 'manila-special-pickup' : this.pickup === 'clark-special' ? 'clark-special-pickup' : '';
    return id ? this.prices.localFeeRules.find(item => item.id === id && item.enabled) : undefined;
  }
}
