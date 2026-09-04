import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, SchoolVisaType, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';

interface CiaQuotePrices {
  courseFees: { id: string; name: string; schedule: string; tuition: number; tuition2027: number }[];
  roomFees: { id: string; name: string; fee: number }[];
  registrationFee: number;
  discount: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly { label: string; start: string; end: string }[];
}
export const ciaPriceMultiplier = (weeks: number) => ({ 1: 0.4, 2: 0.6, 3: 0.8 }[weeks] ?? weeks / 4);
const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

/** CIA policy only; independent people can study on the same dates. */
export class CiaStudentQuote {
  constructor(private readonly prices: CiaQuotePrices) {}
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  returningStudent = false;
  selectedRegistrationDate = today();
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  visaType: SchoolVisaType = 'tourist59';
  readonly weekOptions = [1,2,3,4,6,8,12,16,20,24];
  readonly quotePlan = new SchoolQuotePlan('regular-esl', 'd4', '2026-09-06', this.weekOptions,
    kind => kind === 'course' ? this.prices.courseFees.map(course => ({ id: course.id, name: course.name, details: course.schedule }))
      : this.prices.roomFees.map(room => ({ id: room.id, name: room.name, details: '' })),
    (kind, row) => {
      const course = this.prices.courseFees.find(course => course.id === row.optionId);
      const rate = kind === 'course' ? (this.selectedRegistrationDate >= '2026-09-01' && row.startDate >= '2027-01-01' ? course?.tuition2027 : course?.tuition)
        : this.prices.roomFees.find(room => room.id === row.optionId)?.fee;
      return (rate ?? 0) * ciaPriceMultiplier(row.weeks);
    });
  get quoteError() {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (this.quotePlan.date(this.selectedRegistrationDate) === null) return '请选择有效的报名注册日期。';
    if (!['adult','minor'].includes(this.selectedAgeGroup)) return '请选择抵达时年龄段。';
    return this.visaOptions.some(option => option.value === this.visaType) ? '' : '请选择有效的签证类型。';
  }
  get isLongTermVisa() { return !['tourist30','tourist59'].includes(this.visaType); }
  get visaLabel() { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get visaExemptionNote() { return `${this.visaLabel}暂按免收预估；须由顾问向学校确认政策是否调整及是否免收。`; }
  get visaExtensionCount() { return this.isLongTermVisa ? 0 : Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - (this.visaType === 'tourist30' ? 30 : 59)) / 30)); }
  get visaRates() { return [6410,4540,4540,4540,5650].slice(0, this.visaExtensionCount); }
  get tuition() { return this.quotePlan.total('course'); }
  get accommodation() { return this.quotePlan.total('room'); }
  get christmasEligible() { return this.quotePlan.covers('2026-12-20','2027-01-02') && this.quotePlan.covers('2026-12-20','2027-01-02',this.quotePlan.rooms); }
  get registration() { return this.returningStudent || this.christmasEligible ? 0 : this.prices.registrationFee; }
  get sidaDiscount() { return rounded((this.tuition + this.accommodation) * (1 - this.prices.discount)); }
  get christmasDiscount() { return this.christmasEligible ? 200 : 0; }
  get peakWeeks() {
    return this.quotePlan.weekStarts([...this.quotePlan.courses,...this.quotePlan.rooms]).filter(week => this.prices.peakSeasonRanges.some(range => week <= this.quotePlan.date(range.end)! && week + 6 * 86400000 >= this.quotePlan.date(range.start)!)).length;
  }
  get seasonalSurcharge() { return this.peakWeeks * this.prices.seasonalFeePerWeek; }
  get iauNote() { return this.quotePlan.courses.some(row => row.optionId === 'college-immersion') ? 'IAU一次性注册费50美元另计（未计入上述合计）。' : ''; }
  get quoteUsd() { return Math.max(0, rounded(this.registration + this.tuition + this.accommodation + this.seasonalSurcharge - this.sidaDiscount - this.christmasDiscount)); }
  get paymentLines(): SchoolPaymentLine[] {
    const ranges = this.prices.peakSeasonRanges.filter(range => this.quotePlan.overlapWeeks(range.start, range.end, [...this.quotePlan.courses,...this.quotePlan.rooms]) > 0);
    return [
      ...(this.seasonalSurcharge ? [{ icon:'旺', label:'旺季附加费', value:this.seasonalSurcharge, note:`${this.prices.seasonalFeePerWeek}美元／周 × ${this.peakWeeks}周；${ranges.map(range => `${range.start.replace(/-/g,'/')}–${range.end.replace(/-/g,'/')}`).join('；')}；不参与折扣` }] : []),
      { icon:'折', label:'思达折扣', value:-this.sidaDiscount, note:'课程费和住宿费享95折', promotionKey:'sida' },
      ...(this.christmasEligible ? [{ icon:'惠', label:'圣诞新年优惠', value:-200, note:'课程及住宿完整覆盖2026/12/20–2027/01/02，减200美元且免注册费', promotionKey:'christmas' }] : []),
    ];
  }
  get localFees(): SchoolLocalFee[] {
    const periods = this.quotePlan.roomWeeks / 4;
    const extensions = this.visaExtensionCount, long = this.isLongTermVisa, acr = extensions ? 1 : 0;
    const books = Math.ceil(this.quotePlan.courseWeeks / 8);
    // User-confirmed: ARP remains payable for long-term visas, unlike the four exempt items.
    const arp = long || extensions > 0 ? 1 : 0;
    return [
      { item:'SSP特殊学习许可证', unitLabel:'8,000 比索／次', quantity:long?0:1, total:long?0:8000, note:long ? this.visaExemptionNote : '按报名学习时长办理；续费或换校须学校确认。' },
      { item:'SSP-E Card', unitLabel:'4,500 比索／次', quantity:long?0:1, total:long?0:4500, note:long ? this.visaExemptionNote : '入学时与SSP同时办理，按一次性费用估算。' },
      { item:'ACR-I Card 外国人身份证', unitLabel:'4,500 比索／次', quantity:acr, total:acr*4500, note:long ? this.visaExemptionNote : `按${this.visaLabel}预估，首次续签时计入一次；以学校办理要求为准。` },
      { item:'ARP外国人登记', unitLabel:'300 比索／次', quantity:arp, total:arp*300, note:long ? '长期签证仍计收一次，暂按300比索预估；实际政策及收费须顾问向学校确认。' : '首次续签时计入一次，暂按300比索预估；实际政策及收费须顾问向学校确认。' },
      { item:'综合管理费', unitLabel:'4,000 比索／4周', quantity:periods, total:4000*periods, note:'按每4周4,000比索／人计算。' },
      { item:'电费', unitLabel:'2,000 比索／4周', quantity:periods, total:2000*periods, note:'以菲律宾当地电价为准；超过基本用电额度时另行收费，单价可能按当地电力公司调整。' },
      { item:'水费', unitLabel:'1,000 比索／4周', quantity:periods, total:1000*periods, note:'按每4周1,000比索／人计算。' },
      { item:'签证续签', unitLabel:extensions > 1 ? '按续签次数累计' : '首续6,410 比索', quantity:extensions, total:this.visaRates.reduce((a,b)=>a+b,0),
        note:long ? this.visaExemptionNote : `按${this.visaLabel}预估，${extensions ? `本次${extensions}次：${this.visaRates.map(quoteMoney).join('、')}比索` : '本次无需续签'}；实际依签证及停留天数办理。` },
      { item:'教材费', unitLabel:'2,000 比索／套', quantity:books, total:books*2000, note:'每套2,000比索，约使用8周；ESL、IELTS、Business、ESP通常9本，TOEIC通常7本，实际按课程与学习进度发放。' },
      { item:'照片费', unitLabel:'200 比索／次', quantity:1, total:200, note:'一次性费用。' },
    ];
  }
}
