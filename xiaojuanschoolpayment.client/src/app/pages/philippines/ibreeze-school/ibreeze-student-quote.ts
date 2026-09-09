import { SchoolQuotePlan, quoteMoney } from '../../../components/school-quote-plan';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import { IBREEZE_COURSES, IBREEZE_ROOMS } from './ibreeze-catalog';
import { createDefaultIbreezeContentConfig } from './ibreeze-content-config';

const DEFAULT_IBREEZE_CONTENT = createDefaultIbreezeContentConfig();

export interface IbreezeQuotePrices {
  courseOptions: typeof IBREEZE_COURSES;
  roomOptions: typeof IBREEZE_ROOMS;
  registrationFee: number;
  seasonalFeePerWeek: number;
  usdToCny: number;
  phpPerCny: number;
  exchangeRateDate: string;
  exchangeRateLive: boolean;
  contentConfig?: () => CiaContentConfig;
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
  private get contentConfig() { return this.prices.contentConfig?.() ?? DEFAULT_IBREEZE_CONTENT; }
  private promotion(id: string): CiaPromotionRule | undefined { return this.contentConfig.quoteSettings.promotions.find(item => item.id === id); }
  get sidaDiscountRate() {
    const rule = this.promotion('sida-discount');
    return rule?.enabled === false ? 1 : 1 - ((rule?.discountValue ?? 10) / 100);
  }
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
  get registrationAmount() {
    const rule = this.promotion('returning-registration');
    return this.returningStudent && rule?.enabled !== false ? 0 : this.registrationFee;
  }
  roomPromotionRate(id: string) {
    const rule = this.septemberRules.find(item => item.enabled && item.eligibleRoomIds?.includes(id));
    return rule?.discountValue ?? 0;
  }
  private get septemberRules() { return ['september-twin', 'september-multi'].map(id => this.promotion(id)).filter((item): item is CiaPromotionRule => !!item); }
  private promotionDateEligible(rule: CiaPromotionRule): boolean {
    return (!rule.registrationStart || this.selectedRegistrationDate >= rule.registrationStart)
      && (!rule.registrationEnd || this.selectedRegistrationDate <= rule.registrationEnd)
      && (!rule.arrivalStart || this.selectedStartDate >= rule.arrivalStart)
      && (!rule.arrivalEnd || this.selectedStartDate <= rule.arrivalEnd);
  }
  get septemberPromotionEligible() {
    return this.septemberRules.some(rule => rule.enabled && this.promotionDateEligible(rule));
  }
  get septemberPromotionDiscount() {
    return this.septemberRules.filter(rule => rule.enabled && this.promotionDateEligible(rule)).reduce((total, rule) => total
      + this.quotePlan.rooms.filter(row => rule.eligibleRoomIds?.includes(row.optionId))
        .reduce((sum, row) => sum + Math.floor(row.weeks / (rule.incrementWeeks ?? 4)) * (rule.incrementValue ?? rule.discountValue), 0), 0);
  }
  get septemberPromotionText() {
    const descriptions = this.septemberRules.filter(item => item.enabled).map(item => item.description);
    return descriptions.join(' ');
  }
  get christmasPromotionDiscount() {
    const rule = this.promotion('christmas-2026');
    return rule?.enabled && rule.coverageStart && rule.coverageEnd && this.quotePlan.covers(rule.coverageStart, rule.coverageEnd)
      ? rule.discountValue : 0;
  }
  get christmasPromotionText() { return this.promotion('christmas-2026')?.description ?? '2026/12/27–2027/01/02期间在读，每位学生额外优惠100美元。'; }
  get peakSeasonWeeks() {
    const ranges = this.contentConfig?.quoteSettings.peakSeasonRanges.filter(item => item.enabled)
      ?? [{ start: '2026-06-28', end: '2026-08-15' }, { start: '2027-06-27', end: '2027-08-14' }];
    return ranges.reduce((sum, range) => sum + this.quotePlan.overlapWeeks(range.start, range.end), 0);
  }
  get seasonalSurcharge() { return this.peakSeasonWeeks * this.seasonalFeePerWeek; }
  get guardianRequired() { return this.isMinor && this.minorWithoutParent; }
  get minorManagementFee() { return this.guardianRequired ? Math.ceil(this.quotePlan.stayWeeks / 4) * (this.contentConfig?.quoteSettings.minorManagementFeePerPeriod ?? 100) : 0; }
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
  get visaExtensionTotal() {
    const fee = this.contentConfig?.localFees.find(item => item.id === 'visa-extension');
    return (fee?.rates ?? [5140, 6410, 4440, 5040, 4440]).slice(0, this.visaExtensionCount).reduce((sum, amount) => sum + amount, 0);
  }
  get localFees(): LocalFee[] {
    const defaults: CiaLocalFeeRule[] = [
      { id: 'ssp', name: 'SSP特殊学习许可证', currency: 'PHP', amount: 7800, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '移民局收取；按报名学习时长办理，续费及换校需重新办理。', enabled: true, sortOrder: 0 },
      { id: 'ssp-e-card', name: 'SSP E-CARD', currency: 'PHP', amount: 4500, billingRule: 'once', waiveForLongTermVisa: true, includeInTotal: true, note: '入学时与SSP同时办理，只收一次。', enabled: true, sortOrder: 1 },
      { id: 'acr-i-card', name: 'ACR-I CARD 外国人身份证', currency: 'PHP', amount: 4000, billingRule: 'first-visa-extension', waiveForLongTermVisa: true, includeInTotal: true, note: '首次续签时计入一次。', enabled: true, sortOrder: 2 },
      { id: 'arp', name: 'ARP外国人登记', currency: 'PHP', amount: 300, billingRule: 'long-term-or-first-extension', includeInTotal: true, note: '旅游签证首次续签或长期签证时计入一次。', enabled: true, sortOrder: 3 },
      { id: 'management', name: '维护管理费', currency: 'PHP', amount: 4000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '校内教学楼及其他设施维护费。', enabled: true, sortOrder: 4 },
      { id: 'electricity', name: '校内电费', currency: 'PHP', amount: 2000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收。', enabled: true, sortOrder: 5 },
      { id: 'water', name: '水费', currency: 'PHP', amount: 1000, billingRule: 'per-accommodation-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '仅校内住宿计收。', enabled: true, sortOrder: 6 },
      { id: 'visa-extension', name: '签证续签', currency: 'PHP', amount: 5140, rates: [5140, 6410, 4440, 5040, 4440], billingRule: 'visa-extension-schedule', waiveForLongTermVisa: true, includeInTotal: true, note: '按签证与停留天数累计。', enabled: true, sortOrder: 7 },
      { id: 'books', name: '教材费', currency: 'PHP', amount: 2000, billingRule: 'per-course-period', periodWeeks: 4, rounding: 'ceil', includeInTotal: true, note: '依课程及学习进度实际购买。', enabled: true, sortOrder: 8 },
      { id: 'student-card', name: '学生证', currency: 'PHP', amount: 400, billingRule: 'once', includeInTotal: true, note: '一次性费用。', enabled: true, sortOrder: 9 },
    ];
    const fees = (this.contentConfig?.localFees ?? defaults).filter(item => item.enabled && item.includeInTotal).sort((a, b) => a.sortOrder - b.sortOrder);
    return fees.map(fee => this.calculateLocalFee(fee));
  }
  get localFeesTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText() { return `约 ${Math.round(this.localFeesTotal / this.phpPerCny).toLocaleString('zh-CN')} 元`; }
  get depositAmount() {
    const settings = this.contentConfig?.quoteSettings;
    return this.quotePlan.roomWeeks >= 8 ? settings?.roomDeposit8WeeksOrMore ?? 5000 : settings?.roomDepositUnder8Weeks ?? 3000;
  }
  get optionalFeeItems() {
    const settings = this.contentConfig?.quoteSettings;
    const sundayPickup = settings?.airportPickupSundayUsd ?? 30;
    const saturdayPickup = settings?.airportPickupSaturdayUsd ?? 50;
    return [
      { label: '宿务麦克坦机场接机', amount: this.guardianRequired ? '已含' : `周日${quoteMoney(sundayPickup)}美元／周六${quoteMoney(saturdayPickup)}美元`,
        cnyAmount: this.guardianRequired ? '' : `约人民币 ${Math.round(sundayPickup * this.usdToCny)}／${Math.round(saturdayPickup * this.usdToCny)} 元`,
        note: this.guardianRequired ? '已包含在未成年管理费中，不重复收费' : '可选，也可自行前往；不计入学杂费合计' },
      { label: '房间押金（可退）', amount: this.formatPhp(this.depositAmount),
        cnyAmount: `约人民币 ${Math.round(this.depositAmount / this.phpPerCny).toLocaleString('zh-CN')} 元`,
        note: '不足8周3,000比索，8周及以上5,000比索；无损坏及无欠费时可退' },
    ];
  }
  get schoolPaymentItems() {
    const sidaRule = this.promotion('sida-discount');
    const christmasRule = this.promotion('christmas-2026');
    const peakRanges = this.contentConfig.quoteSettings.peakSeasonRanges.filter(item => item.enabled);
    return [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationAmount)} 美元`, note: '一次性费用，老学员返校免费' },
      ...(sidaRule?.enabled === false ? [] : [{ icon: '折', label: sidaRule?.name ?? '思达折扣', amount: `− ${this.formatUsd(this.sidaDiscountAmount)} 美元`, note: sidaRule?.description ?? '课程费和住宿费享9折' }]),
      ...(this.septemberPromotionDiscount ? [{ icon: '惠', label: '9月住宿优惠', amount: `− ${this.formatUsd(this.septemberPromotionDiscount)} 美元`, note: this.septemberPromotionText }] : []),
      ...(this.christmasPromotionDiscount ? [{ icon: '惠', label: christmasRule?.name ?? '圣诞特别优惠', amount: `− ${this.formatUsd(this.christmasPromotionDiscount)} 美元`, note: this.christmasPromotionText }] : []),
      ...(this.seasonalSurcharge ? [{ icon: '附', label: '暑期附加费', amount: `${this.formatUsd(this.seasonalSurcharge)} 美元`, note: `${this.formatUsd(this.seasonalFeePerWeek)}美元／周，本次覆盖${this.peakSeasonWeeks}周；${peakRanges.map(item => `${item.start.replace(/-/g, '/')}–${item.end.slice(5).replace('-', '/')}${item.label.includes('预估') ? '预估' : '适用'}`).join('；')}` }] : []),
      ...(this.isMinor ? [{ icon: '监', label: '未成年管理费', amount: `${this.formatUsd(this.minorManagementFee)} 美元`, note: `${this.formatUsd(this.contentConfig.quoteSettings.minorManagementFeePerPeriod ?? 100)}美元／4周；${this.guardianNote}` }] : []),
    ];
  }

  formatUsd(value: number) { return quoteMoney(value); }
  formatPhp(value: number) { return `${quoteMoney(value)} 比索`; }
  private calculateLocalFee(fee: CiaLocalFeeRule): LocalFee {
    const periodWeeks = fee.periodWeeks ?? 4;
    const relevantWeeks = ['electricity', 'water'].includes(fee.id) ? this.campusWeeks
      : fee.billingRule === 'per-course-period' ? this.quotePlan.courseWeeks : this.quotePlan.roomWeeks;
    const periodQuantity = fee.rounding === 'proportional' ? relevantWeeks / periodWeeks : Math.ceil(relevantWeeks / periodWeeks);
    const extensions = this.visaExtensionCount;
    const waived = this.isLongTermVisa && fee.waiveForLongTermVisa;
    let quantity = 1;
    let total = fee.amount;
    if (waived) { quantity = 0; total = 0; }
    else if (fee.billingRule === 'per-accommodation-period' || fee.billingRule === 'per-course-period') { quantity = periodQuantity; total = fee.amount * quantity; }
    else if (fee.billingRule === 'first-visa-extension') { quantity = extensions > 0 ? 1 : 0; total = fee.amount * quantity; }
    else if (fee.billingRule === 'long-term-or-first-extension') { quantity = this.isLongTermVisa || extensions > 0 ? 1 : 0; total = fee.amount * quantity; }
    else if (fee.billingRule === 'visa-extension-schedule') { quantity = extensions; total = (fee.rates ?? [fee.amount]).slice(0, extensions).reduce((sum, value) => sum + value, 0); }
    const amount = fee.billingRule === 'per-accommodation-period' || fee.billingRule === 'per-course-period'
      ? `${quoteMoney(fee.amount)} 比索／${periodWeeks}周`
      : fee.billingRule === 'visa-extension-schedule' && extensions > 1 ? '按续签次数累计' : `${quoteMoney(fee.amount)} 比索／次`;
    const touristVisaNote = `按${this.initialVisaDays}天旅游签证预估`;
    const editableVisaNote = fee.note.split('；长期签证')[0].trim();
    const note = waived ? this.visaExemptionNote : fee.billingRule === 'visa-extension-schedule'
      ? extensions
        ? `${touristVisaNote}；${editableVisaNote} 本次${extensions}次：${(fee.rates ?? [fee.amount]).slice(0, extensions).map(value => quoteMoney(value)).join('、')}比索。`
        : `${touristVisaNote}；${editableVisaNote} 本次无需续签。`
      : fee.billingRule === 'first-visa-extension' && !this.isLongTermVisa ? `${touristVisaNote}；${fee.note}` : fee.note;
    return { item: fee.name, amount, quantity, total: this.roundMoney(total), note };
  }
  private roundMoney(value: number) { return Math.round(value * 10) / 10; }
  private isDateBetween(value: string, start: string, end: string) { return value >= start && value <= end; }
}
