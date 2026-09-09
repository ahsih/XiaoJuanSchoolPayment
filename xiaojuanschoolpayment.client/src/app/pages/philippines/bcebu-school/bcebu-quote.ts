import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlan, presentSchoolQuote, quoteMoney } from '../../../components/school-quote-plan';
import { BCebuCourse, BCebuRoom, BCEBU_LOCAL_FEE_INTRO, BCEBU_LONG_STAY_NOTE, BCEBU_PROMOTION_DATES, BCEBU_REGISTRATION_NOTE, BCEBU_REPORTER_NOTE, bcebuLongStay, bcebuMultiplier, bcebuOffSeason } from './bcebu-pricing';
import { SchoolVisaType } from '../../../components/school-group-quote';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import { createDefaultBCebuContentConfig } from './bcebu-content-config';

const DAY = 86400000;
const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export interface BCebuLocalFee { item: string; amount: string; quantity: number; total: number; note: string; }

export class BCebuQuote {
  private readonly defaultContent = createDefaultBCebuContentConfig();
  readonly plan: SchoolQuotePlan;
  family = false;
  minorCare: 'none' | 'under15' | '15to17' = 'none';
  reporter = false;
  pickup: 'none' | 'group' | 'weekday' = 'none';
  visaType: SchoolVisaType = 'tourist30';
  returningStudent = false;
  get initialVisaDays(): 30 | 59 { return this.visaType === 'tourist59' ? 59 : 30; }
  set initialVisaDays(value: number) { this.visaType = value === 59 ? 'tourist59' : 'tourist30'; }
  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }

  constructor(readonly courses: () => BCebuCourse[], readonly rooms: () => BCebuRoom[], readonly registration: () => number, start: string, readonly content?: () => CiaContentConfig) {
    this.plan = new SchoolQuotePlan('speed-esl', 'triple-bunk', start,
      Array.from({ length: 52 }, (_, i) => i + 1),
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: course.name, details: [course.suitable, course.note].filter(Boolean).join('；') }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => money(this.multiplier(row.weeks) * (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0)), 52);
  }

  private get contentValue() { return this.content?.() ?? this.defaultContent; }
  private get settings() { return this.contentValue.quoteSettings; }
  private get imageSettings() { return this.contentValue.quoteImageSettings; }
  private get feeRules() { return this.contentValue.localFees; }
  private promotion(id: string): CiaPromotionRule | undefined { return this.settings?.promotions.find(rule => rule.id === id && rule.enabled); }
  private feeRule(id: string): CiaLocalFeeRule | undefined { return this.feeRules.find(rule => rule.id === id && rule.enabled); }
  multiplier(weeks: number) { return this.settings?.shortStayRatios[String(weeks)] ?? bcebuMultiplier(weeks); }

  // The shared list starts on Sunday; school admission and promotion dates are Mondays.
  get entryDate() {
    const first = this.plan.courses.map(row => row.startDate).sort()[0];
    const date = this.plan.date(first);
    return date === null ? '' : new Date(date + DAY).toISOString().slice(0, 10);
  }
  get adultEligible() { return this.minorCare === 'none' && !this.plan.courses.some(row => ['junior-esl', 'kindergarten'].includes(row.optionId)); }
  private get activeOffSeasonRule() {
    return ['bcebu-off-season-spring', 'bcebu-off-season-fall'].map(id => this.promotion(id)).find(rule => !!rule
      && (!rule.arrivalStart || this.entryDate >= rule.arrivalStart)
      && (!rule.arrivalEnd || this.entryDate <= rule.arrivalEnd));
  }
  get offSeason() { return !!this.activeOffSeasonRule && (this.family || this.adultEligible); }
  get seasonRate() {
    if (!this.offSeason) return 1;
    const percent = this.family ? this.promotion('bcebu-family-off-season')?.discountValue ?? 10 : this.activeOffSeasonRule?.discountValue ?? 15;
    return 1 - percent / 100;
  }
  get reporterEligible() { const rule = this.promotion('bcebu-reporter'); return !!rule && !this.family && this.adultEligible && !!this.activeOffSeasonRule && this.plan.courseWeeks >= rule.minimumCourseWeeks; }
  get reporterDiscount() { return this.reporter && this.reporterEligible ? this.plan.courseWeeks * (this.promotion('bcebu-reporter')?.discountValue ?? 25) : 0; }
  get base() { return this.plan.total('course') + this.plan.total('room'); }
  get offSeasonDiscount() { return money((this.base - this.reporterDiscount) * (1 - this.seasonRate)); }
  get sidaDiscount() { return money((this.base - this.reporterDiscount - this.offSeasonDiscount) * ((this.promotion('bcebu-sida-90')?.discountValue ?? 10) / 100)); }
  get longStayDiscount() {
    const rule = this.promotion('bcebu-long-stay');
    if (!rule || this.plan.courseWeeks < rule.minimumCourseWeeks) return 0;
    if (this.plan.courseWeeks < 12) return rule.discountValue;
    const step = Math.max(1, rule.incrementWeeks ?? 4), value = rule.incrementValue ?? 100;
    return value * (1 + Math.floor((this.plan.courseWeeks - 12) / step));
  }
  get peakWeeks() { return (this.settings?.peakSeasonRanges.filter(range => range.enabled) ?? [{ start: '2026-07-05', end: '2026-08-15' }]).reduce((sum, range) => sum + this.plan.overlapWeeks(range.start, range.end), 0); }
  get peakFee() { return this.peakWeeks * (this.settings?.peakSeasonFeePerWeek ?? 40); }
  get minorRate() { return this.family || this.minorCare === 'none' ? 0 : this.minorCare === 'under15' ? this.settings?.minorManagementFeeUnder15PerWeek ?? 100 : this.settings?.minorManagementFeeAge15To17PerWeek ?? 50; }
  get minorFee() { return this.minorRate * this.plan.roomWeeks; }
  get payableRegistration() { return this.returningStudent || this.promotion('bcebu-registration-waiver')?.waiveRegistration ? 0 : this.registration(); }
  get total() { return money(this.payableRegistration + Math.max(0, this.base - this.reporterDiscount - this.offSeasonDiscount - this.sidaDiscount - this.longStayDiscount) + this.peakFee + this.minorFee); }
  get prepaid() {
    const off = money(this.base * (1 - this.seasonRate));
    const sidaPercent = (this.promotion('bcebu-sida-90')?.discountValue ?? 10) / 100;
    return money(this.payableRegistration + Math.max(0, this.base - off - money((this.base - off) * sidaPercent) - this.longStayDiscount) + this.peakFee + this.minorFee);
  }
  get refund() { return money(this.prepaid - this.total); }
  get settlementNote() {
    return this.reporterDiscount ? `预收${quoteMoney(this.prepaid)}美元；完成活动毕业后预计退${quoteMoney(this.refund)}美元。` : '';
  }
  get minorNote() { return `无家长陪同：15岁以下${this.settings?.minorManagementFeeUnder15PerWeek ?? 100}美元/周，15–未满18岁${this.settings?.minorManagementFeeAge15To17PerWeek ?? 50}美元/周；按住宿周数收取，不打折，含毕业时机场接送。${this.minorCare === 'under15' && !this.family ? '独自入学年龄资格须向学校确认，旺季不单独接收15岁以下学生。' : ''}`; }
  get peakNote() { const ranges = (this.settings?.peakSeasonRanges.filter(range => range.enabled) ?? []).map(range => `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`).join('、') || '2026/7/5–8/15'; return `${ranges}就读期间${this.settings?.peakSeasonFeePerWeek ?? 40}美元/周，本次${this.peakWeeks}周；附加费不参与折扣。`; }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (this.plan.courses.some(row => row.optionId === 'ielts-guarantee' && row.weeks < 12)) return 'IELTS GUARANTEE需12周起报，并提供雅思官方成绩。';
    if (!this.family && this.minorCare === 'under15' && this.peakWeeks > 0) return '旺季不单独接收15岁以下学员，请改为亲子或咨询夏令营。';
    return '';
  }
  get visaCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }
  get visaNote() { const amount = this.feeRule('visa-extension')?.amount ?? 5130; return this.longTermVisa ? '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。' : `按${this.initialVisaDays}天初始签证预估，本次续签${this.visaCount}次，每次${amount.toLocaleString('en-US')}比索、有效期30天。学校统一办理，如遇上课时间不额外补课；实际以学校及移民局收费为准。`; }
  get localFees(): BCebuLocalFee[] {
    const roomPeriods = Math.ceil(this.plan.roomWeeks / 4), coursePeriods = Math.ceil(this.plan.courseWeeks / 4);
    const acr = !this.longTermVisa && this.visaCount > 0 ? 1 : 0;
    const arp = this.longTermVisa || this.visaCount > 0 ? 1 : 0;
    const create = (id: string, quantity: number, fallbackAmount: number, fallbackName: string, fallbackNote: string, period?: number): BCebuLocalFee[] => {
      const rule = this.feeRule(id);
      if (this.feeRules.length && !rule) return [];
      const amount = rule?.amount ?? fallbackAmount;
      return [{ item: rule?.name ?? fallbackName, amount: `${amount.toLocaleString('en-US')} 比索 / ${period ? `${period}周` : '次'}`, quantity, total: amount * quantity, note: rule?.note ?? fallbackNote }];
    };
    return [
      ...create('ssp', this.longTermVisa ? 0 : 1, 7800, 'SSP特殊学习许可证', this.longTermVisa ? this.visaNote : '移民局收取，按报名学习时长办理；续费及换校需要重新办理'),
      ...create('ssp-e-card', this.longTermVisa ? 0 : 1, 4500, 'SSP-E CARD', this.longTermVisa ? this.visaNote : '移民局收取，入学和SSP同时办理，只收一次'),
      ...create('acr-i-card', acr, 4000, 'ACR-I CARD 外国人身份证', this.longTermVisa ? this.visaNote : `移民局收取，学校统一办理；按${this.initialVisaDays}天初始签证预估，第一次续签时办理`),
      ...create('arp', arp, 300, 'ARP外国人登记', this.longTermVisa ? '长期签证仍计收一次，须由顾问确认学校最新政策。' : '旅游签证首次续签时计入一次，须由顾问确认学校最新政策。'),
      ...create('management', roomPeriods, 2000, '维护管理费', '按住宿周数每4周计算，不足4周先按1份预估', this.feeRule('management')?.periodWeeks ?? 4),
      ...create('utilities', roomPeriods, 4000, '水电费', '按住宿周数每4周计算，不足4周先按1份预估', this.feeRule('utilities')?.periodWeeks ?? 4),
      ...create('visa-extension', this.visaCount, 5130, '签证续签', this.longTermVisa ? this.visaNote : `${this.visaNote}${this.feeRule('visa-extension')?.note ? `；${this.feeRule('visa-extension')!.note}` : ''}`),
      ...create('books', coursePeriods, 2000, '教材费', '按课程周数每4周预估1份，以实际购买为准', this.feeRule('books')?.periodWeeks ?? 4),
      ...create('student-id', 1, 200, '学生证', '一次性费用'),
    ];
  }
  get localTotal() { return this.localFees.reduce((sum, row) => sum + row.total, 0); }
  get optionalFees() {
    const pickupRule = this.feeRule('pickup');
    const depositRule = this.feeRule('deposit');
    const pickupAmount = pickupRule?.amount ?? 1000, weekdayAmount = pickupRule?.secondaryAmount ?? 1500;
    const depositShort = depositRule?.amount ?? 3000, depositLong = depositRule?.secondaryAmount ?? 5000;
    return [
      { item: pickupRule?.name ?? '宿务马克坦机场团体接机', total: this.pickup === 'none' ? 0 : this.pickup === 'group' ? pickupAmount : weekdayAmount, note: `${pickupRule?.note ?? `周日团体接机${pickupAmount.toLocaleString('en-US')}比索／人，工作日${weekdayAmount.toLocaleString('en-US')}比索／人`}；${this.pickup === 'none' ? '本次未选接机。' : '本次按1人计费。'}` },
      { item: depositRule?.name ?? '房间押金', total: this.plan.roomWeeks <= 4 ? depositShort : depositLong, note: `${depositRule?.note ?? `1–4周${depositShort.toLocaleString('en-US')}比索，5–24周${depositLong.toLocaleString('en-US')}比索；只收一次，无损坏及额外扣费时毕业可退。`}${this.plan.roomWeeks > 24 ? `超过24周暂按${depositLong.toLocaleString('en-US')}比索预估，需学校确认。` : ''}` },
    ];
  }
  get paymentItems(): QuoteImagePaymentItem[] {
    const reporter = this.promotion('bcebu-reporter');
    const sida = this.promotion('bcebu-sida-90');
    const longStay = this.promotion('bcebu-long-stay');
    const offSeason = [this.promotion('bcebu-off-season-spring'), this.promotion('bcebu-off-season-fall')].filter(Boolean) as CiaPromotionRule[];
    return [
      { icon: '注', label: '注册费', amount: `${quoteMoney(this.registration())} 美元`, note: this.imageSettings.paymentNotes.registration || BCEBU_REGISTRATION_NOTE },
      { icon: '免', label: this.promotion('bcebu-registration-waiver')?.name ?? '免注册费优惠', amount: `− ${quoteMoney(this.registration())} 美元`, note: this.promotion('bcebu-registration-waiver')?.description ?? '通过思达报名免注册费', accent: true },
      { icon: '记', label: reporter?.name ?? '记者活动优惠', amount: this.reporterDiscount ? `− ${quoteMoney(this.reporterDiscount)} 美元` : '未参与', note: reporter?.description ?? `${BCEBU_PROMOTION_DATES}；${BCEBU_REPORTER_NOTE}`, accent: this.reporterDiscount > 0 },
      { icon: '淡', label: '淡季优惠', amount: this.offSeason ? `− ${quoteMoney(this.offSeasonDiscount)} 美元` : '不适用', note: `${offSeason.map(rule => rule.description).join('；')}${this.family ? '；本次按亲子计算，每位学员分别报价' : ''}`, accent: this.offSeason },
      { icon: '思', label: sida?.name ?? '思达启航专属折扣', amount: `− ${quoteMoney(this.sidaDiscount)} 美元`, note: sida?.description ?? '课程及住宿在记者、淡季优惠后再享9折', accent: true },
      { icon: '长', label: longStay?.name ?? '长期优惠', amount: this.longStayDiscount ? `− ${quoteMoney(this.longStayDiscount)} 美元` : `未满${longStay?.minimumCourseWeeks ?? 8}周`, note: longStay?.description ?? BCEBU_LONG_STAY_NOTE, accent: this.longStayDiscount > 0 },
      ...(this.peakFee ? [{ icon: '旺', label: '旺季附加费', amount: `${quoteMoney(this.peakFee)} 美元`, note: this.peakNote }] : []),
      ...(this.minorFee ? [{ icon: '管', label: '未成年单独在校管理费', amount: `${quoteMoney(this.minorFee)} 美元`, note: this.minorNote }] : []),
    ];
  }
  imageData(usdToCny: number, phpPerCny: number, exchangeNote: string) {
    const settings = this.imageSettings;
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: "B'Cebu", schoolName: "B'Cebu", filePrefix: 'BCEBU', heroSrc: '/assets/philippines/bcebu-campus-hero.webp',
      weeks: this.plan.courseWeeks, startDate: this.entryDate, usdToCny, totalUsd: this.total,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems: this.paymentItems,
      localFeeItems: this.localFees.map(fee => { const id = this.feeRules.find(rule => rule.name === fee.item)?.id ?? ''; return { label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: `${quoteMoney(fee.total)} 比索`, note: settings.localFeeNotes[id] || fee.note }; }),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / phpPerCny), localFeeNote: settings.localFeeIntro || BCEBU_LOCAL_FEE_INTRO,
      optionalFeeItems: this.optionalFees.map(fee => { const id = this.feeRules.find(rule => rule.name === fee.item)?.id ?? ''; return { label: fee.item, amount: `${quoteMoney(fee.total)} 比索`, cnyAmount: `人民币预计约 ${Math.round(fee.total / phpPerCny).toLocaleString('zh-CN')} 元`, note: settings.localFeeNotes[id] || fee.note }; }),
      ruleNotes: settings.footerNotes,
    });
    return presentSchoolQuote({ ...quote,
      totalLabel: this.reporterDiscount ? '完成记者活动后学校费用' : '最终应付学校金额',
      totalNote: this.settlementNote,
      exchangeRateText: '',
      importantNotes: [
        ...this.plan.shortStayNotes(bcebuMultiplier),
        ...(this.plan.stayWeeks > 24 ? ['超过24周的证件续办、押金及其他实际费用需向学校确认。'] : []),
        ...(this.family ? ['亲子预付订金500美元/人，属于学费预付款，不重复加入总额；15岁以上可自由选择ESL、雅思等课程，按所选课程计费。'] : []),
        exchangeNote,
        ...settings.footerNotes,
      ], note: '',
      paymentSectionTitle: settings.paymentSectionTitle,
      localFeeTitle: settings.localFeeSectionTitle,
      serviceSectionTitle: settings.serviceSectionTitle,
      benefitItems: settings.benefits,
      serviceLocations: settings.serviceLocations,
      alumniBenefitTitle: settings.alumniBenefitTitle,
      alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
      noteTitle: settings.noteSectionTitle,
    }, this.plan, "B'Cebu", this.total, usdToCny);
  }
}
