import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { IBREEZE_COURSES, IBREEZE_ROOMS } from './ibreeze-catalog';

export interface IbreezeQuotePrices {
  courseOptions: typeof IBREEZE_COURSES;
  roomOptions: typeof IBREEZE_ROOMS;
  registrationFee: number;
  seasonalFeePerWeek: number;
  usdToCny: number;
  phpPerCny: number;
  exchangeRateDate: string;
  exchangeRateLive: boolean;
}
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; }
export type IbreezeVisaType = 30 | 59 | 'student' | 'work' | 'srrv' | 'sirv';

/** One person owns all their periods. Concurrent students never share overlap validation. */
export class IbreezeStudentQuote {
  constructor(private readonly prices: IbreezeQuotePrices) {}
  get courseOptions() { return this.prices.courseOptions; }
  get roomOptions() { return this.prices.roomOptions; }
  get registrationFee() { return this.prices.registrationFee; }
  get seasonalFeePerWeek() { return this.prices.seasonalFeePerWeek; }
  get usdToCny() { return this.prices.usdToCny; }
  get phpPerCny() { return this.prices.phpPerCny; }
  get exchangeRateDate() { return this.prices.exchangeRateDate; }
  get exchangeRateLive() { return this.prices.exchangeRateLive; }
  readonly sidaDiscountRate = 0.9;
  readonly septemberRegistrationEnd = '2026-09-30';
  readonly weekOptions = [4, 8, 12, 16, 20, 24];
  returningStudent = false;
  readonly visaOptions: { value: IbreezeVisaType; label: string }[] = [
    { value: 30, label: '30天旅游签证' }, { value: 59, label: '59天旅游签证' },
    { value: 'student', label: '学生签证' }, { value: 'work', label: '工作签证' },
    { value: 'srrv', label: 'SRRV绿卡' }, { value: 'sirv', label: 'SIRV卡' },
  ];
  visaType: IbreezeVisaType = 30;
  get initialVisaDays(): 30 | 59 { return this.visaType === 59 ? 59 : 30; }
  set initialVisaDays(value: 30 | 59) { this.visaType = value; }
  get visaLabel() { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  get isLongTermVisa() { return ['student', 'work', 'srrv', 'sirv'].includes(String(this.visaType)); }
  get visaExemptionNote() { return `${this.visaLabel}暂按免收预估；各校要求及政策可能不同，须由顾问向学校确认是否免收。`; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  selectedRegistrationDate = '2026-09-01';
  private ageGroup: 'adult' | '16-17' | 'under-16' = 'adult';
  get selectedAgeGroup() { return this.ageGroup; }
  set selectedAgeGroup(value: 'adult' | '16-17' | 'under-16') {
    this.ageGroup = value;
    if (value === 'adult') this.minorWithoutParent = false;
  }
  minorWithoutParent = false;

  readonly quotePlan = new SchoolQuotePlan('intensive-speaking', 'quad-main', '2026-09-06', this.weekOptions,
    kind => kind === 'course'
      ? this.courseOptions.map(course => ({ id: course.id, name: course.name, details: course.lessons }))
      : this.roomOptions.map(room => ({ id: room.id, name: room.name, details: room.note })),
    (kind, row) => {
      const rate = kind === 'course'
        ? (this.isMinor ? this.juniorTuitionPerFourWeeks : this.courseOptions.find(course => course.id === row.optionId)?.tuition ?? 0)
        : this.roomOptions.find(room => room.id === row.optionId)?.fee ?? 0;
      return this.roundMoney(rate * row.weeks / 4);
    });

  get tuitionForSelectedWeeks() { return this.quotePlan.total('course'); }
  get roomFeeForSelectedWeeks() { return this.quotePlan.total('room'); }
  get isMinor() { return this.selectedAgeGroup !== 'adult'; }
  get juniorTuitionPerFourWeeks() { return this.courseOptions.find(course => course.id === 'junior-english')?.tuition ?? 1290; }
  get courseAndRoomBase() { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get sidaDiscountAmount() { return this.roundMoney(this.courseAndRoomBase * (1 - this.sidaDiscountRate)); }
  get afterSidaDiscount() { return this.courseAndRoomBase - this.sidaDiscountAmount; }
  get registrationAmount() { return this.returningStudent ? 0 : this.registrationFee; }
  roomPromotionRate(id: string) {
    return ['twin-main', 'twin-ib2'].includes(id) ? 120 : ['triple-main', 'quad-main', 'quad-ib2'].includes(id) ? 200 : 0;
  }
  get septemberPromotionEligible() {
    return this.isDateBetween(this.selectedRegistrationDate, '2026-09-01', this.septemberRegistrationEnd)
      && this.selectedStartDate < '2026-12-27';
  }
  get septemberPromotionDiscount() {
    return this.septemberPromotionEligible
      ? this.quotePlan.rooms.reduce((sum, row) => sum + Math.floor(row.weeks / 4) * this.roomPromotionRate(row.optionId), 0) : 0;
  }
  get septemberPromotionText() {
    return '2026年9月1日–30日报名、12月27日前抵达；IB1/IB2双人间每4周减120美元，IB1三人间及IB1/IB2四人间每4周减200美元。';
  }
  get christmasPromotionDiscount() {
    return this.quotePlan.covers('2026-12-27', '2027-01-02') ? 100 : 0;
  }
  get christmasPromotionText() { return '2026/12/27–2027/01/02期间在读，每位学生额外优惠100美元。'; }
  get peakSeasonWeeks() {
    return this.quotePlan.overlapWeeks('2026-06-28', '2026-08-15')
      + this.quotePlan.overlapWeeks('2027-06-27', '2027-08-14');
  }
  get seasonalSurcharge() { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get guardianRequired() { return this.isMinor && this.minorWithoutParent; }
  get minorManagementFee() { return this.guardianRequired ? Math.ceil(this.quotePlan.stayWeeks / 4) * 100 : 0; }
  get guardianNote() { return '无父母陪同时收取，含接机及每4周一次跳岛费用。'; }
  get quoteError() {
    if (this.quotePlan.error) return this.quotePlan.error;
    if (!this.visaOptions.some(option => option.value === this.visaType)) return '请选择有效的签证类型。';
    if (this.selectedAgeGroup === 'under-16' && this.quotePlan.courses.some(row => row.optionId !== 'junior-english')) return '未满16岁须选择青少年英语课程，请调整课程安排后再生成报价。';
    if (!this.quotePlan.date(this.selectedRegistrationDate)) return '请选择有效的报名注册日期。';
    return '';
  }
  get courseEligibilityText() {
    if (this.selectedAgeGroup === 'under-16') return '未满16岁：按青少年课程安排及收费。';
    if (this.selectedAgeGroup === '16-17') return '16–17岁：可选择其他课程，课程费按青少年英语标准计算。';
    return '18岁及以上：按所选课程收费。';
  }
  get quoteUsd() {
    return Math.max(0, this.roundMoney(this.registrationAmount + this.afterSidaDiscount + this.seasonalSurcharge
      + this.minorManagementFee - this.septemberPromotionDiscount - this.christmasPromotionDiscount));
  }
  get quoteUsdText() { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText() { return `约 ${Math.round(this.quoteUsd * this.usdToCny).toLocaleString('zh-CN')} 元`; }
  get exchangeRateText() { return this.exchangeRateLive && this.exchangeRateDate ? `汇率日期 ${this.exchangeRateDate}` : '暂按备用汇率估算'; }
  get campusWeeks() { return this.quotePlan.rooms.filter(row => !row.optionId.startsWith('off-campus-')).reduce((sum, row) => sum + row.weeks, 0); }
  get visaExtensionCount() { return this.isLongTermVisa ? 0 : Math.max(0, Math.ceil((this.quotePlan.stayWeeks * 7 - this.initialVisaDays) / 30)); }
  get visaExtensionTotal() { return [5140, 6410, 4440, 5040, 4440].slice(0, this.visaExtensionCount).reduce((sum, fee) => sum + fee, 0); }
  get localFees(): LocalFee[] {
    const accommodationPeriods = Math.ceil(this.quotePlan.roomWeeks / 4);
    const coursePeriods = Math.ceil(this.quotePlan.courseWeeks / 4);
    const campusPeriods = Math.ceil(this.campusWeeks / 4);
    const extensions = this.visaExtensionCount;
    const extensionRates = [5140, 6410, 4440, 5040, 4440].slice(0, extensions);
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索／次', quantity: this.isLongTermVisa ? 0 : 1, total: this.isLongTermVisa ? 0 : 7800, note: this.isLongTermVisa ? this.visaExemptionNote : '移民局收取；按报名学习时长办理，续费及换校需重新办理' },
      { item: 'SSP E-CARD', amount: '4,500 比索／次', quantity: this.isLongTermVisa ? 0 : 1, total: this.isLongTermVisa ? 0 : 4500, note: this.isLongTermVisa ? this.visaExemptionNote : '入学时与SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,000 比索／次', quantity: extensions ? 1 : 0, total: extensions ? 4000 : 0, note: this.isLongTermVisa ? this.visaExemptionNote : `按${this.initialVisaDays}天旅游签证预估，首次续签时计入；实际以学校办理为准` },
      { item: '维护管理费', amount: '4,000 比索／4周', quantity: accommodationPeriods, total: 4000 * accommodationPeriods, note: '校内教学楼及其他设施维护费' },
      { item: '校内电费', amount: '2,000 比索／4周', quantity: campusPeriods, total: 2000 * campusPeriods, note: '仅校内住宿计收；每周含20度电，超额另收23比索／度' },
      { item: '水费', amount: '1,000 比索／4周', quantity: campusPeriods, total: 1000 * campusPeriods, note: '仅校内住宿计收' },
      { item: '签证续签', amount: extensions <= 1 ? '5,140 比索／首次' : '按续签次数累计', quantity: extensions, total: this.visaExtensionTotal,
        note: this.isLongTermVisa ? this.visaExemptionNote : extensions ? `按${this.initialVisaDays}天旅游签证、每次续签30天预估，本次${extensions}次：${extensionRates.map(fee => quoteMoney(fee)).join('、')}比索；以学校及移民局实收为准` : `按${this.initialVisaDays}天旅游签证预估，本次无需续签；实际以签证获准停留期限为准` },
      { item: '教材费', amount: '2,000 比索／4周', quantity: coursePeriods, total: 2000 * coursePeriods, note: '每4周约2,000–3,000比索，先按2,000比索预估；依课程及学习进度实际购买' },
      { item: '学生证', amount: '400 比索／次', quantity: 1, total: 400, note: '一次性费用' },
    ];
  }
  get localFeesTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText() { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get depositAmount() { return this.quotePlan.roomWeeks >= 8 ? 5000 : 3000; }
  get optionalFeeItems() {
    return [
      { label: '宿务麦克坦机场接机', amount: this.guardianRequired ? '已含' : '周日30美元／周六50美元',
        cnyAmount: this.guardianRequired ? '' : `约人民币 ${Math.round(30 * this.usdToCny)}／${Math.round(50 * this.usdToCny)} 元`,
        note: this.guardianRequired ? '已包含在未成年管理费中，不重复收费' : '可选，也可自行前往；不计入学杂费合计' },
      { label: '房间押金（可退）', amount: this.formatPhp(this.depositAmount),
        cnyAmount: `约人民币 ${Math.round(this.depositAmount / this.phpPerCny).toLocaleString('zh-CN')} 元`,
        note: '不足8周3,000比索，8周及以上5,000比索；无损坏及无欠费时可退' },
    ];
  }
  get schoolPaymentItems() {
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationAmount)} 美元`, note: '一次性费用，老学员返校免费' },
      { icon: '折', label: '思达折扣', amount: `− ${this.formatUsd(this.sidaDiscountAmount)} 美元`, note: '课程费和住宿费享9折' },
      ...(this.septemberPromotionDiscount ? [{ icon: '惠', label: '9月住宿优惠', amount: `− ${this.formatUsd(this.septemberPromotionDiscount)} 美元`, note: this.septemberPromotionText }] : []),
      ...(this.christmasPromotionDiscount ? [{ icon: '惠', label: '圣诞特别优惠', amount: '− 100 美元', note: this.christmasPromotionText }] : []),
      ...(this.seasonalSurcharge ? [{ icon: '附', label: '暑期附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `40美元／周，本次覆盖${this.peakSeasonWeeks}周；${this.quotePlan.overlapWeeks('2027-06-27', '2027-08-14') ? '2027/06/27–08/14预估（周日至周六）' : '2026/06/28–08/15适用'}` }] : []),
      ...(this.isMinor ? [{ icon: '监', label: '未成年管理费', amount: `${this.formatUsd(this.minorManagementFee)} 美元`, note: `100美元／4周；${this.guardianNote}` }] : []),
    ];
  }

  formatUsd(value: number) { return quoteMoney(value); }
  formatPhp(value: number) { return `${quoteMoney(value)} 比索`; }
  private roundMoney(value: number) { return Math.round(value * 10) / 10; }
  private isDateBetween(value: string, start: string, end: string) { return value >= start && value <= end; }
}
