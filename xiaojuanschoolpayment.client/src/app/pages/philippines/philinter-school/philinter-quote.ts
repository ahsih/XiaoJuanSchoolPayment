import { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { SchoolVisaType } from '../../../components/school-group-quote';
import { CiaLocalFeeRule, CiaPromotionRule, CiaQuoteSettings } from '../cia-school/cia-content-config';

export const PHILINTER_AGE_RULE = '成人课程按就读当年度满18岁判断；未满18岁仅可报名Junior课程（12–17岁），须与已满18岁的监护人同住一间房，不可分房。';
export const PHILINTER_FAMILY_RULE = '亲子预付定金500美元／人，属于学费预付款，不额外加收。';
export const PHILINTER_WINTER_RULE = '寒假：校内宿舍需注册至少6周，校外Azon公寓至少4周；临近日期可能弹性开放短周数，须学校确认。';
export const PHILINTER_SUMMER_RULE = '就读区间只要部分涵盖暑假高峰：校内宿舍需注册至少8周，校外Azon公寓至少4周；临近日期可能弹性开放短周数，须学校确认。';
export const PHILINTER_PROMOTION = '2026/08/16–12/25期间，每完成8个连续合资格课程周优惠300美元；仅校内三人房、Azon单人房及双人房，IELTS及TOEIC保证班、走读不参加。不得与其他校方优惠或Voucher并用；思达课程及住宿9折另计。';
// Match Sunday arrival / Saturday departure and preserve the eight-week season.
export const PHILINTER_SUMMER_PERIODS = [
  { start: '2026-07-05', end: '2026-08-29', estimated: false },
  { start: '2027-07-04', end: '2027-08-28', estimated: true },
] as const;
export const philinterMultiplier = (weeks: number, ratios: Record<string, number> = { '1': 0.45, '2': 0.65, '3': 0.85 }) => ratios[String(weeks)] ?? weeks / 4;
export const nextPhilinterSunday = () => {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  date.setUTCDate(date.getUTCDate() + (7 - date.getUTCDay()) % 7);
  return date.toISOString().slice(0, 10);
};

/** Only complete study weeks covered by eligible accommodation earn the offer. */
export function philinterPromotion(plan: SchoolQuotePlan, rule?: CiaPromotionRule): number {
  if (rule && !rule.enabled) return 0;
  const eligibleRoomIds = rule?.eligibleRoomIds?.length ? rule.eligibleRoomIds : ['in-campus-triple', 'azon-single', 'azon-twin'];
  const eligibleRooms = plan.days(plan.rooms.filter(row => eligibleRoomIds.includes(row.optionId)));
  const weeks = plan.weekStarts(plan.courses.filter(row => !row.optionId.includes('guarantee')));
  const from = plan.date(rule?.coverageStart || '2026-08-16')!, to = plan.date(rule?.coverageEnd || '2026-12-25')!;
  const blockWeeks = Math.max(1, rule?.minimumCourseWeeks || 8);
  const day = 86400000, week = 7 * day;
  let last = 0, run = 0, blocks = 0;
  for (const start of weeks) {
    const eligible = start >= from && start + 6 * day <= to &&
      Array.from({ length: 7 }, (_, index) => start + index * day).every(date => eligibleRooms.has(date));
    if (!eligible) { run = 0; last = 0; continue; }
    run = start === last + week ? run + 1 : 1;
    if (run % blockWeeks === 0) blocks++;
    last = start;
  }
  return blocks * (rule?.discountValue ?? 300);
}

export interface PhilinterCoursePrice { id: string; name: string; tuition: number; suitable: string; }
export interface PhilinterRoomPrice { id: string; name: string; fee: number; note: string; }
export interface PhilinterLocalFee { item: string; unitLabel: string; quantity: number; total: number; note: string; }

export class PhilinterStudentCalculator {
  readonly plan: SchoolQuotePlan;
  ageGroup: 'adult' | 'junior' | 'under12' = 'adult';
  guardianSameRoom = false;
  visaType: SchoolVisaType = 'tourist59';
  returningStudent = false;
  pickup: 'none' | 'weekend' | 'other' = 'none';

  constructor(
    private readonly courses: () => PhilinterCoursePrice[],
    private readonly rooms: () => PhilinterRoomPrice[],
    private readonly registrationFee: () => number,
    private readonly seasonalFeePerWeek: () => number,
    private readonly quoteSettings: () => CiaQuoteSettings,
    private readonly localFeeRules: () => CiaLocalFeeRule[],
    start = nextPhilinterSunday(),
  ) {
    this.plan = new SchoolQuotePlan('light-esl', 'in-campus-triple', start,
      Array.from({ length: 24 }, (_, index) => index + 1),
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: course.name, details: course.suitable }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0) * philinterMultiplier(row.weeks, this.quoteSettings().shortStayRatios));
  }

  get isMinor() { return this.ageGroup === 'junior'; }
  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get initialVisaDays() { return this.visaType === 'tourist30' ? 30 : 59; }
  private get promotionRules() { return this.quoteSettings().promotions ?? []; }
  private get sidaRule() { return this.promotionRules.find(rule => rule.id === 'philinter-sida-90' && rule.enabled); }
  private get schoolPromotionRule() { return this.promotionRules.find(rule => rule.id === 'philinter-low-season' && rule.enabled); }
  private get returningWaiver() { return this.promotionRules.some(rule => rule.id === 'philinter-returning-registration' && rule.enabled && rule.waiveRegistration); }
  private feeRule(id: string) { return this.localFeeRules().find(rule => rule.id === id && rule.enabled); }
  get registration() { return this.returningStudent && this.returningWaiver ? 0 : this.registrationFee(); }
  get base() { return this.plan.total('course') + this.plan.total('room'); }
  get sidaDiscount() { return Math.round(this.base * (this.sidaRule?.discountValue ?? 0)) / 100; }
  get schoolDiscount() { return this.schoolPromotionRule ? philinterPromotion(this.plan, this.schoolPromotionRule) : 0; }
  get summerPeriods() { return this.quoteSettings().peakSeasonRanges.filter(period => period.enabled).map(period => ({ ...period, estimated: period.id.includes('2027') || period.label.includes('预估'), weeks: this.plan.overlapWeeks(period.start, period.end) })); }
  get summerWeeks() { return this.summerPeriods.reduce((sum, period) => sum + period.weeks, 0); }
  get summerSurcharge() { return this.summerWeeks * this.seasonalFeePerWeek(); }
  get totalUsd() { return Math.round(Math.max(0, this.registration + this.base - this.sidaDiscount - this.schoolDiscount + this.summerSurcharge) * 100) / 100; }
  get visaExtensions() { return this.longTermVisa ? 0 : Math.ceil(Math.max(0, this.plan.stayWeeks * 7 - this.initialVisaDays) / 30); }
  get roomDeposit() {
    const rule = this.feeRule('deposit');
    if (!rule) return 0;
    const weeks = this.plan.stayWeeks;
    return weeks <= 2 ? rule.amount : weeks <= 7 ? rule.amount + 1000 : weeks <= 11 ? rule.amount + 2000 : rule.secondaryAmount ?? rule.amount + 3000;
  }
  get visaNote() {
    return this.longTermVisa
      ? '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。'
      : `按${this.initialVisaDays}天旅游签证及当前完整停留时间预估，本次续签${this.visaExtensions}次；${this.feeRule('visa-extension')?.note ?? '实际以学校及移民局收费为准。'}`;
  }
  get localFees(): PhilinterLocalFee[] {
    const periodFor = (id: string) => Math.max(1, Math.ceil(this.plan.roomWeeks / (this.feeRule(id)?.periodWeeks ?? 4)));
    const acr = !this.longTermVisa && this.visaExtensions > 0 ? 1 : 0;
    const arp = this.longTermVisa || this.visaExtensions > 0 ? 1 : 0;
    const row = (id: string, quantity: number, total?: number, note?: string): PhilinterLocalFee | null => {
      const rule = this.feeRule(id);
      if (!rule?.includeInTotal) return null;
      const unitLabel = rule.billingRule === 'per-accommodation-period'
        ? `${rule.amount.toLocaleString('en-US')} 比索／${rule.periodWeeks ?? 4}周`
        : rule.billingRule === 'visa-extension-schedule'
          ? `${rule.amount.toLocaleString('en-US')} 比索／次（预估）`
          : `${rule.amount.toLocaleString('en-US')} 比索／${id === 'books' ? '套（预估）' : '人'}`;
      return { item: rule.name, unitLabel, quantity, total: total ?? rule.amount * quantity, note: note ?? rule.note };
    };
    const visa = this.feeRule('visa-extension');
    const rates = visa?.rates?.length ? visa.rates : [visa?.amount ?? 0];
    const visaTotal = Array.from({ length: this.visaExtensions }, (_, index) => rates[Math.min(index, rates.length - 1)] ?? 0)
      .reduce((sum, amount) => sum + amount, 0);
    return [
      row('ssp', this.longTermVisa ? 0 : 1, undefined, this.longTermVisa ? this.visaNote : undefined),
      row('ssp-i-card', this.longTermVisa ? 0 : 1, undefined, this.longTermVisa ? this.visaNote : undefined),
      row('acr-i-card', acr, undefined, this.longTermVisa ? this.visaNote : undefined),
      row('arp', arp, undefined, this.longTermVisa ? `长期签证仍计收一次；${this.feeRule('arp')?.note ?? ''}` : undefined),
      row('management', periodFor('management')),
      row('electricity', periodFor('electricity')),
      row('water', periodFor('water')),
      row('visa-extension', this.visaExtensions, visaTotal, this.visaNote),
      row('books', this.plan.courses.length),
      row('student-id', 1),
    ].filter((item): item is PhilinterLocalFee => item !== null);
  }
  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupAmount() {
    const rule = this.feeRule('pickup');
    return this.pickup === 'weekend' ? rule?.amount ?? 0 : this.pickup === 'other' ? rule?.secondaryAmount ?? rule?.amount ?? 0 : 0;
  }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (this.ageGroup === 'under12') return '学校最低接受12岁亲子儿童，未满12岁不能报名。';
    const juniors = this.plan.courses.filter(row => row.optionId.startsWith('junior'));
    if (this.isMinor && juniors.length !== this.plan.courses.length) return '12–17岁学生仅可选择Junior课程。';
    if (!this.isMinor && juniors.length) return 'Junior课程仅限12–17岁学生。';
    if (this.isMinor && (!this.guardianSameRoom || this.plan.rooms.some(row => row.optionId.includes('single')))) return '12–17岁学生须与已满18岁的监护人同住一间双人或三人房，不可分房。';
    const speaking = this.plan.courses.filter(row => row.optionId === 'speaking' || row.optionId === 'junior-speaking');
    if (speaking.reduce((sum, row) => sum + row.weeks, 0) > 8) return 'Speaking及Junior Speaking口语课程最长8周。';
    for (const row of this.plan.courses) {
      const required = row.optionId.includes('guarantee-8') ? 8 : row.optionId.includes('guarantee-12') ? 12 : 0;
      if (required && row.weeks !== required) return `所选保证班须完整报名${required}周。`;
    }
    return '';
  }
}
