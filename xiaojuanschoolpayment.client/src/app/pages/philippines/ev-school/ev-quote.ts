import { SchoolVisaType } from '../../../components/school-group-quote';
import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';

export interface EvCoursePrice { id: string; name: string; tuition: number; suitable: string; }
export interface EvRoomPrice { id: string; name: string; fee: number; note: string; }
export interface EvLocalFee { item: string; unitLabel: string; quantity: number; total: number; note: string; }

const DAY = 86_400_000;
export const evPriceMultiplier = (weeks: number) => weeks === 1 ? .4 : weeks === 2 ? .65 : weeks === 3 ? .85 : weeks / 4;

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
    startDate = '2026-09-06',
  ) {
    this.plan = new SchoolQuotePlan('semi-sparta-esl', 'quad-bunk', startDate,
      Array.from({ length: 24 }, (_, index) => index + 1),
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: course.name, details: course.suitable }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0) * evPriceMultiplier(row.weeks));
  }

  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get initialVisaDays() { return this.visaType === 'tourist30' ? 30 : 59; }
  get tuition() { return this.plan.total('course'); }
  get accommodation() { return this.plan.total('room'); }
  get discountBase() { return this.tuition + this.accommodation; }
  get discountAmount() { return this.discountBase * .05; }
  get peakWeeks() { return this.overlapUniqueWeeks('2026-07-05', '2026-08-29'); }
  get peakSurcharge() { return this.peakWeeks * this.seasonalFeePerWeek(); }
  get minorPeriods() { return this.isMinorStudent ? Math.ceil(this.plan.courseWeeks / 4) : 0; }
  get minorFee() { return this.minorPeriods * this.minorFeePerPeriod(); }
  get registration() { return this.returningStudent ? 0 : this.registrationFee(); }
  get totalUsd() { return this.registration + this.discountBase - this.discountAmount + this.peakSurcharge + this.minorFee; }
  get onCampusWeeks() { return this.plan.rooms.filter(row => !row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get offCampusWeeks() { return this.plan.rooms.filter(row => row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get visaExtensionCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }
  get visaExtensionTotal() { return this.visaExtensionCount ? 5430 + (this.visaExtensionCount - 1) * 4700 : 0; }
  get roomDeposit() { return this.plan.stayWeeks <= 8 ? 3000 : 5000; }
  get visaNote() {
    return this.longTermVisa
      ? '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。'
      : `按${this.initialVisaDays}天旅游签证及当前完整停留时间预估，本次续签${this.visaExtensionCount}次；首次约5,430比索，后续约4,700比索／次，以移民局实收为准。`;
  }
  get localFees(): EvLocalFee[] {
    const roomPeriods = Math.max(1, Math.ceil(this.plan.roomWeeks / 4));
    const textbookPeriods = Math.max(1, Math.ceil(this.plan.courseWeeks / 4));
    const acr = !this.longTermVisa && this.visaExtensionCount > 0 ? 1 : 0;
    const arp = this.longTermVisa || this.visaExtensionCount > 0 ? 1 : 0;
    const onCampus = this.onCampusWeeks ? Math.ceil(this.onCampusWeeks / 4) : 0;
    const offCampus = this.offCampusWeeks ? Math.ceil(this.offCampusWeeks / 4) : 0;
    return [
      { item: 'SSP特殊学习许可证', unitLabel: '7,800 比索／人', quantity: this.longTermVisa ? 0 : 1, total: this.longTermVisa ? 0 : 7800, note: this.longTermVisa ? this.visaNote : '移民局收取，按报名学习时长办理；续费或换校需重新办理' },
      { item: 'SSP E-CARD', unitLabel: '4,500 比索／人', quantity: this.longTermVisa ? 0 : 1, total: this.longTermVisa ? 0 : 4500, note: this.longTermVisa ? this.visaNote : '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I Card 外国人身份证', unitLabel: '4,000 比索／人', quantity: acr, total: 4000 * acr, note: this.longTermVisa ? this.visaNote : '旅游签证首次续签时办理，由学校统一处理' },
      { item: 'ARP外国人登记', unitLabel: '300 比索／人', quantity: arp, total: 300 * arp, note: this.longTermVisa ? '长期签证仍计收一次，暂按300比索预估；须由顾问确认学校最新政策。' : '旅游签证首次续签时计入一次，暂按300比索预估；须由顾问确认学校最新政策。' },
      { item: '校内管理费', unitLabel: '2,000 比索／4周', quantity: onCampus, total: 2000 * onCampus, note: '仅校内住宿计收；每4周计算，不足4周按4周预估' },
      { item: '校外宿舍管理费', unitLabel: '4,000 比索／4周', quantity: offCampus, total: 4000 * offCampus, note: '仅校外住宿计收；每4周计算，不足4周按4周预估' },
      { item: '电费', unitLabel: '2,000 比索／4周', quantity: roomPeriods, total: 2000 * roomPeriods, note: '按住宿周数预估；每周超过15kW用电量，超出部分另收20比索／kW' },
      { item: '水费', unitLabel: '1,200 比索／4周', quantity: roomPeriods, total: 1200 * roomPeriods, note: '按住宿周数预估；公共用水和房间用水' },
      { item: '签证续签', unitLabel: '首续5,430比索', quantity: this.visaExtensionCount, total: this.visaExtensionTotal, note: this.visaNote },
      { item: '教材费', unitLabel: '2,000 比索／4周', quantity: textbookPeriods, total: 2000 * textbookPeriods, note: '按累计课程周数预估；换课或实际购买不同教材时调整' },
      { item: '学生证', unitLabel: '500 比索／人', quantity: 1, total: 500, note: '一次性费用' },
    ];
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupAmount() { return this.pickup === 'sunday' ? 1200 : 0; }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (this.plan.courses.some(row => row.optionId === 'sparta-ielts-guarantee' && row.weeks < 12)) return '雅思保证班需满足学校已确认的最低学习周数。';
    return '';
  }
  get paymentRows() { return this.plan.paymentItems(); }
  format(value: number) { return quoteMoney(value); }

  private overlapUniqueWeeks(start: string, end: string) {
    const from = Date.parse(`${start}T00:00:00Z`), to = Date.parse(`${end}T00:00:00Z`);
    const weeks = new Set<number>();
    for (const row of [...this.plan.courses, ...this.plan.rooms]) {
      const rowStart = this.plan.date(row.startDate);
      if (rowStart === null) continue;
      for (let index = 0; index < row.weeks; index++) {
        const weekStart = rowStart + index * 7 * DAY;
        if (weekStart <= to && weekStart + 6 * DAY >= from) weeks.add(weekStart);
      }
    }
    return weeks.size;
  }
}
