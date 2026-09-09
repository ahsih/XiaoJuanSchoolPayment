import { SchoolVisaType } from '../../../components/school-group-quote';
import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { CiaLocalFeeRule } from '../cia-school/cia-content-config';

export interface EvCoursePrice { id: string; name: string; tuition: number; suitable: string; }
export interface EvRoomPrice { id: string; name: string; fee: number; note: string; }
export interface EvLocalFee { item: string; unitLabel: string; quantity: number; total: number; note: string; }

const DAY = 86_400_000;
export const EV_PEAK_SEASONS = [
  { start: '2027-07-04', end: '2027-08-28', label: '2027/07/04–2027/08/28' },
] as const;
export const EV_PEAK_SEASON_DATE_RANGE = EV_PEAK_SEASONS.map(season => season.label).join('；');
export const evPriceMultiplier = (weeks: number, ratios: Record<string, number> = { '1': .4, '2': .65, '3': .85 }) =>
  weeks < 4 ? (ratios[String(weeks)] ?? weeks / 4) : weeks / 4;

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
            group: course.id.startsWith('sparta-') ? '斯巴达课程' : '半斯巴达课程',
          }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0) * evPriceMultiplier(row.weeks, this.shortStayRatios()));
  }

  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get initialVisaDays() { return this.visaType === 'tourist30' ? 30 : 59; }
  get tuition() { return this.plan.total('course'); }
  get accommodation() { return this.plan.total('room'); }
  get peakWeeks() { return this.overlapUniqueWeeks(this.peakSeasons()); }
  get peakSurcharge() { return this.peakWeeks * this.seasonalFeePerWeek(); }
  get discountBase() { return this.tuition + this.accommodation + this.peakSurcharge; }
  get discountAmount() { return this.discountBase * Math.max(0, this.discountPercent()) / 100; }
  get minorPeriods() { return this.isMinorStudent ? Math.ceil(this.plan.courseWeeks / 4) : 0; }
  get minorFee() { return this.minorPeriods * this.minorFeePerPeriod(); }
  get registration() { return this.returningStudent && this.returningRegistrationWaiver() ? 0 : this.registrationFee(); }
  get totalUsd() { return this.registration + this.discountBase - this.discountAmount + this.minorFee; }
  get onCampusWeeks() { return this.plan.rooms.filter(row => !row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get offCampusWeeks() { return this.plan.rooms.filter(row => row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get visaExtensionCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }
  get visaExtensionTotal() {
    const rule = this.rule('visa-extension');
    const rates = rule?.rates?.length ? rule.rates : [rule?.amount ?? 5430, 4700];
    return Array.from({ length: this.visaExtensionCount }, (_, index) => rates[Math.min(index, rates.length - 1)] ?? 0)
      .reduce((sum, amount) => sum + amount, 0);
  }
  get roomDeposit() {
    const rule = this.rule('room-deposit');
    return this.plan.stayWeeks <= 8 ? (rule?.amount ?? 3000) : (rule?.secondaryAmount ?? 5000);
  }
  get visaNote() {
    const visaRule = this.rule('visa-extension');
    const rates = visaRule?.rates?.length ? visaRule.rates : [visaRule?.amount ?? 5430, 4700];
    const firstRate = rates[0] ?? 0;
    const laterRate = rates[Math.min(1, rates.length - 1)] ?? firstRate;
    return this.longTermVisa
      ? '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。'
      : `按${this.initialVisaDays}天旅游签证及当前完整停留时间预估，本次续签${this.visaExtensionCount}次；首次约${firstRate.toLocaleString()}比索，后续约${laterRate.toLocaleString()}比索／次，以移民局实收为准。`;
  }
  get localFees(): EvLocalFee[] {
    const roomPeriods = Math.max(1, Math.ceil(this.plan.roomWeeks / 4));
    const textbookPeriods = Math.max(1, Math.ceil(this.plan.courseWeeks / 4));
    const acr = !this.longTermVisa && this.visaExtensionCount > 0 ? 1 : 0;
    const arp = this.longTermVisa || this.visaExtensionCount > 0 ? 1 : 0;
    const onCampus = this.onCampusWeeks ? Math.ceil(this.onCampusWeeks / 4) : 0;
    const offCampus = this.offCampusWeeks ? Math.ceil(this.offCampusWeeks / 4) : 0;
    const quantities: Record<string, number> = {
      'ssp': this.longTermVisa ? 0 : 1,
      'ssp-e-card': this.longTermVisa ? 0 : 1,
      'acr-i-card': acr,
      'arp': arp,
      'on-campus-management': onCampus,
      'off-campus-management': offCampus,
      'electricity': roomPeriods,
      'water': roomPeriods,
      'visa-extension': this.visaExtensionCount,
      'books': textbookPeriods,
      'student-id': 1,
    };
    return this.localFeeRules()
      .filter(rule => rule.enabled && rule.includeInTotal)
      .map(rule => {
        const quantity = quantities[rule.id] ?? this.quantityFor(rule, roomPeriods, textbookPeriods);
        const total = rule.id === 'visa-extension' ? this.visaExtensionTotal : rule.amount * quantity;
        const note = this.longTermVisa && ['ssp', 'ssp-e-card', 'acr-i-card'].includes(rule.id) ? this.visaNote : rule.note;
        return { item: rule.name, unitLabel: this.unitLabel(rule), quantity, total, note };
      });
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupAmount() { return this.pickup === 'sunday' ? (this.rule('cebu-pickup')?.amount ?? 1200) : 0; }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (this.plan.courses.some(row => row.optionId === 'sparta-ielts-guarantee' && row.weeks < 12)) return '雅思保证班需满足学校已确认的最低学习周数。';
    return '';
  }
  get paymentRows() { return this.plan.paymentItems(); }
  format(value: number) { return quoteMoney(value); }

  private rule(id: string): CiaLocalFeeRule | undefined {
    return this.localFeeRules().find(item => item.id === id && item.enabled);
  }

  private quantityFor(rule: CiaLocalFeeRule, roomPeriods: number, textbookPeriods: number): number {
    if (rule.billingRule === 'per-accommodation-period') return roomPeriods;
    if (rule.billingRule === 'per-course-period') return textbookPeriods;
    if (rule.billingRule === 'first-visa-extension') return this.longTermVisa ? 0 : Number(this.visaExtensionCount > 0);
    if (rule.billingRule === 'long-term-or-first-extension') return Number(this.longTermVisa || this.visaExtensionCount > 0);
    if (rule.billingRule === 'visa-extension-schedule') return this.visaExtensionCount;
    return 1;
  }

  private unitLabel(rule: CiaLocalFeeRule): string {
    const amount = rule.amount.toLocaleString('en-US');
    if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') return `${amount} 比索／${rule.periodWeeks ?? 4}周`;
    if (rule.billingRule === 'visa-extension-schedule') return `首续${amount}比索`;
    return `${amount} 比索／人`;
  }

  private overlapUniqueWeeks(seasons: ReadonlyArray<{ start: string; end: string }>) {
    const ranges = seasons.map(season => ({
      from: Date.parse(`${season.start}T00:00:00Z`),
      to: Date.parse(`${season.end}T00:00:00Z`),
    }));
    const weeks = new Set<number>();
    for (const row of [...this.plan.courses, ...this.plan.rooms]) {
      const rowStart = this.plan.date(row.startDate);
      if (rowStart === null) continue;
      for (let index = 0; index < row.weeks; index++) {
        const weekStart = rowStart + index * 7 * DAY;
        const weekEnd = weekStart + 6 * DAY;
        if (ranges.some(range => weekStart <= range.to && weekEnd >= range.from)) weeks.add(weekStart);
      }
    }
    return weeks.size;
  }
}
