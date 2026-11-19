import { textbookRuleQuantity } from '../school-textbook-estimate';
import { SchoolVisaType } from '../../../components/school-group-quote';
import { QuotePlanKind, QuotePlanRow, SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule } from '../cia-school/cia-content-config';
import { calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import { EV_IELTS_GUARANTEE_ID } from './ev-content-config';

export interface EvCoursePrice {
  id: string;
  name: string;
  tuition: number;
  suitable: string;
  /** Whole-course tuition for exact short guarantee lengths, keyed by total weeks. */
  feeByWeeks?: Record<string, number>;
  minimumWeeks?: number;
}
export interface EvRoomPrice { id: string; name: string; fee: number; note: string; }
export interface EvLocalFee { item: string; unitLabel: string; quantity: number; total: number; note: string; }

export const EV_PEAK_SEASONS = [
  { start: '2027-07-04', end: '2027-08-28', label: '2027/07/04–2027/08/28' },
] as const;
export const EV_PEAK_SEASON_DATE_RANGE = EV_PEAK_SEASONS.map(season => season.label).join('；');
export const evPriceMultiplier = (weeks: number, ratios: Record<string, number> = { '1': .4, '2': .65, '3': .85 }) =>
  weeks < 4 ? (ratios[String(weeks)] ?? weeks / 4) : weeks / 4;

/** 2026-08-10 sheet: 30-day entries extend from week 5, 59-day entries from week 9, then every 4 weeks. */
const EV_TOURIST30_EXTENSIONS = [5430, 6400, 4430, 4430, 4430];
const EV_TOURIST59_EXTENSIONS = [6700, 4430, 4430, 4430];
const EV_DEPOSIT_TIERS = [2000, 3000, 5000];
const isOffCampus = (roomId: string) => roomId.startsWith('off-campus');
const isSparta = (courseId: string) => courseId.startsWith('sparta-');

export class EvStudentCalculator {
  readonly plan: SchoolQuotePlan;
  isMinorStudent = false;
  visaType: SchoolVisaType = 'tourist59';
  returningStudent = false;
  pickup: 'none' | 'sunday' = 'none';

  constructor(
    private readonly courses: () => EvCoursePrice[],
    private readonly rooms: () => EvRoomPrice[],
    private readonly registrationFee: () => number,
    private readonly seasonalFeePerWeek: () => number,
    private readonly minorFeePerPeriod: () => number,
    private readonly shortStayRatios: () => Record<string, number> = () => ({ '1': .4, '2': .65, '3': .85 }),
    private readonly peakSeasons: () => ReadonlyArray<{ start: string; end: string }> = () => EV_PEAK_SEASONS,
    private readonly discountPercent: () => number = () => 5,
    private readonly localFeeRules: () => CiaLocalFeeRule[] = () => [],
    private readonly returningRegistrationWaiver: () => boolean = () => true,
    startDate = '2026-09-06',
  ) {
    this.plan = new SchoolQuotePlan('semi-sparta-esl', 'quad-bunk', startDate,
      Array.from({ length: 24 }, (_, index) => index + 1),
      kind => kind === 'course'
        ? this.courses().map(course => ({
            id: course.id,
            name: course.name,
            details: course.suitable,
            group: isSparta(course.id) ? '斯巴达课程' : '半斯巴达课程',
          }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0) * this.priceMultiplier(row.weeks),
      24, true);
    const ordinaryPrice = this.plan.price;
    // Short guarantee courses use the school's exact whole-course amounts, shared across their rows.
    this.plan.price = (kind: QuotePlanKind, row: QuotePlanRow) => {
      const exact = kind === 'course' ? this.guaranteeRowPrice(row) : null;
      return exact ?? ordinaryPrice(kind, row);
    };
  }

  get usesFourWeekAverage() {
    // A change of course or room does not turn part of a four-week quote into a short stay.
    // Keep the duration local to this student, without adding course and room weeks or date gaps.
    return this.plan.courseWeeks >= 4;
  }
  priceMultiplier(weeks: number) {
    return this.usesFourWeekAverage ? weeks / 4 : evPriceMultiplier(weeks, this.shortStayRatios());
  }
  private course(id: string) { return this.courses().find(course => course.id === id); }
  get guaranteeWeeks() {
    return this.plan.courses.filter(row => row.optionId === EV_IELTS_GUARANTEE_ID).reduce((sum, row) => sum + row.weeks, 0);
  }
  private guaranteeRowPrice(row: QuotePlanRow): number | null {
    const course = this.course(row.optionId);
    const weeks = this.guaranteeWeeks;
    const total = course?.feeByWeeks?.[String(weeks)];
    if (row.optionId !== EV_IELTS_GUARANTEE_ID || total === undefined || !weeks) return null;
    return Math.round(total * row.weeks / weeks * 100) / 100;
  }
  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get initialVisaDays() { return this.visaType === 'tourist30' ? 30 : 59; }
  get tuition() { return this.plan.total('course'); }
  get accommodation() { return this.plan.total('room'); }
  get peakCalculation() {
    return calculateAssociationPeakSurcharge(
      'EV',
      this.plan.weekStarts([...this.plan.courses, ...this.plan.rooms]),
      this.peakSeasons(),
      this.seasonalFeePerWeek(),
    );
  }
  get peakWeeks() { return this.peakCalculation.weeks; }
  get peakSurcharge() { return this.peakCalculation.total; }
  get discountBase() { return this.tuition + this.accommodation; }
  get discountAmount() { return this.discountBase * Math.max(0, this.discountPercent()) / 100; }
  get minorPeriods() { return this.isMinorStudent ? Math.ceil(this.plan.courseWeeks / 4) : 0; }
  get minorFee() { return this.minorPeriods * this.minorFeePerPeriod(); }
  get registration() { return this.returningStudent && this.returningRegistrationWaiver() ? 0 : this.registrationFee(); }
  get totalUsd() { return this.registration + this.discountBase - this.discountAmount + this.peakSurcharge + this.minorFee; }
  get onCampusWeeks() { return this.plan.rooms.filter(row => !isOffCampus(row.optionId)).reduce((sum, row) => sum + row.weeks, 0); }
  get offCampusWeeks() { return this.plan.rooms.filter(row => isOffCampus(row.optionId)).reduce((sum, row) => sum + row.weeks, 0); }
  private get extensionRates(): number[] {
    const rule = this.rule('visa-extension');
    if (this.visaType === 'tourist30') return rule?.rates?.length ? rule.rates : EV_TOURIST30_EXTENSIONS;
    return rule?.tourist59Rates?.length ? rule.tourist59Rates : EV_TOURIST59_EXTENSIONS;
  }
  get visaExtensionCount() {
    if (this.longTermVisa) return 0;
    const coveredWeeks = this.visaType === 'tourist30' ? 4 : 8;
    return Math.max(0, Math.ceil((this.plan.stayWeeks - coveredWeeks) / 4));
  }
  get visaExtensionTotal() {
    const rates = this.extensionRates;
    return Array.from({ length: this.visaExtensionCount }, (_, index) => rates[Math.min(index, rates.length - 1)] ?? 0)
      .reduce((sum, amount) => sum + amount, 0);
  }
  /** ACR I-Card is needed once a stay passes 59 days, whatever the entry visa. */
  get needsAcr() { return !this.longTermVisa && this.plan.stayWeeks >= 9; }
  get roomDeposit() {
    const rule = this.rule('room-deposit');
    const tiers = rule?.rates?.length === 3 ? rule.rates : EV_DEPOSIT_TIERS;
    const weeks = this.plan.stayWeeks;
    return weeks <= 3 ? tiers[0] : weeks <= 8 ? tiers[1] : tiers[2];
  }
  get visaNote() {
    if (this.longTermVisa) return '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。';
    return this.visaExtensionCount
      ? `按${this.initialVisaDays}天旅游签证、停留${this.plan.stayWeeks}周预估续签${this.visaExtensionCount}次；以移民局实收为准。`
      : `按${this.initialVisaDays}天旅游签证、停留${this.plan.stayWeeks}周，无需续签。`;
  }
  get localFees(): EvLocalFee[] {
    const textbookPeriods = textbookRuleQuantity(this.plan.courses, this.rule('books'), 4);
    const weeksFor = (id: string) => id === 'on-campus-management' ? this.onCampusWeeks
      : id === 'off-campus-management' ? this.offCampusWeeks : this.plan.roomWeeks;
    const quantities: Record<string, number> = {
      'ssp': this.longTermVisa ? 0 : 1,
      'ssp-e-card': this.longTermVisa ? 0 : 1,
      'acr-i-card': Number(this.needsAcr),
      'arp': this.longTermVisa || this.visaExtensionCount > 0 ? 1 : 0,
      'visa-extension': this.visaExtensionCount,
      'books': textbookPeriods,
      'student-id': 1,
    };
    return this.localFeeRules()
      .filter(rule => rule.enabled && rule.includeInTotal)
      .map(rule => {
        const quantity = quantities[rule.id] ?? (rule.billingRule === 'per-accommodation-period'
          ? this.periodQuantity(weeksFor(rule.id), rule)
          : this.quantityFor(rule, textbookPeriods));
        const total = rule.id === 'visa-extension' ? this.visaExtensionTotal : rule.amount * quantity;
        const note = this.longTermVisa && ['ssp', 'ssp-e-card', 'acr-i-card'].includes(rule.id) ? this.visaNote : rule.note;
        return { item: rule.name, unitLabel: this.unitLabel(rule), quantity, total, note };
      });
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupAmount() { return this.pickup === 'sunday' ? (this.rule('cebu-pickup')?.amount ?? 1200) : 0; }
  /** The off-campus condo is only open to Semi-Sparta course students. */
  get spartaInCondo(): boolean {
    const sparta = new Set(this.plan.weekStarts(this.plan.courses.filter(row => isSparta(row.optionId))));
    return this.plan.weekStarts(this.plan.rooms.filter(row => isOffCampus(row.optionId))).some(week => sparta.has(week));
  }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    const minimum = this.course(EV_IELTS_GUARANTEE_ID)?.minimumWeeks ?? 8;
    if (this.guaranteeWeeks && this.guaranteeWeeks < minimum) return `雅思保分班至少${minimum}周。`;
    if (this.spartaInCondo) return '校外公寓仅限半斯巴达课程，请改选半斯巴达课程或校内房型。';
    return '';
  }
  get paymentRows() { return this.plan.paymentItems(); }
  format(value: number) { return quoteMoney(value); }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.localFeeRules().find(item => item.id === id && item.enabled);
  }

  private periodQuantity(weeks: number, rule: CiaLocalFeeRule): number {
    if (!weeks) return 0;
    const period = rule.periodWeeks ?? 4;
    return rule.rounding === 'proportional' ? weeks / period : Math.ceil(weeks / period);
  }

  private quantityFor(rule: CiaLocalFeeRule, textbookPeriods: number): number {
    if (rule.billingRule === 'per-course-period') return textbookPeriods;
    if (rule.billingRule === 'first-visa-extension') return Number(this.needsAcr);
    if (rule.billingRule === 'long-term-or-first-extension') return Number(this.longTermVisa || this.visaExtensionCount > 0);
    if (rule.billingRule === 'visa-extension-schedule') return this.visaExtensionCount;
    return 1;
  }

  private unitLabel(rule: CiaLocalFeeRule): string {
    const amount = rule.amount.toLocaleString('en-US');
    if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') {
      const period = rule.periodWeeks ?? 4;
      return period === 1 ? `${amount} 比索／周` : `${amount} 比索／${period}周`;
    }
    if (rule.billingRule === 'visa-extension-schedule') return '按签证与停留周数';
    return `${amount} 比索／人`;
  }

}
