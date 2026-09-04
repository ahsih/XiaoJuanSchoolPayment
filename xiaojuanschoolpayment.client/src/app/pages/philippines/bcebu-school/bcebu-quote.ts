import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlan, presentSchoolQuote, quoteMoney } from '../../../components/school-quote-plan';
import { BCebuCourse, BCebuRoom, BCEBU_LOCAL_FEE_INTRO, BCEBU_LONG_STAY_NOTE, BCEBU_PROMOTION_DATES, BCEBU_REGISTRATION_NOTE, BCEBU_REPORTER_NOTE, bcebuLongStay, bcebuMultiplier, bcebuOffSeason } from './bcebu-pricing';
import { SchoolVisaType } from '../../../components/school-group-quote';

const DAY = 86400000;
const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export interface BCebuLocalFee { item: string; amount: string; quantity: number; total: number; note: string; }

export class BCebuQuote {
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

  constructor(readonly courses: () => BCebuCourse[], readonly rooms: () => BCebuRoom[], readonly registration: () => number, start: string) {
    this.plan = new SchoolQuotePlan('speed-esl', 'triple-bunk', start,
      Array.from({ length: 52 }, (_, i) => i + 1),
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: course.name, details: [course.suitable, course.note].filter(Boolean).join('；') }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => money(bcebuMultiplier(row.weeks) * (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.tuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.fee ?? 0)), 52);
  }

  // The shared list starts on Sunday; school admission and promotion dates are Mondays.
  get entryDate() {
    const first = this.plan.courses.map(row => row.startDate).sort()[0];
    const date = this.plan.date(first);
    return date === null ? '' : new Date(date + DAY).toISOString().slice(0, 10);
  }
  get adultEligible() { return this.minorCare === 'none' && !this.plan.courses.some(row => ['junior-esl', 'kindergarten'].includes(row.optionId)); }
  get offSeason() { return bcebuOffSeason(this.entryDate) && (this.family || this.adultEligible); }
  get seasonRate() { return this.offSeason ? this.family ? 0.9 : 0.85 : 1; }
  get reporterEligible() { return !this.family && this.adultEligible && bcebuOffSeason(this.entryDate) && this.plan.courseWeeks >= 4; }
  get reporterDiscount() { return this.reporter && this.reporterEligible ? this.plan.courseWeeks * 25 : 0; }
  get base() { return this.plan.total('course') + this.plan.total('room'); }
  get offSeasonDiscount() { return money((this.base - this.reporterDiscount) * (1 - this.seasonRate)); }
  get sidaDiscount() { return money((this.base - this.reporterDiscount - this.offSeasonDiscount) * 0.1); }
  get longStayDiscount() { return bcebuLongStay(this.plan.courseWeeks); }
  get peakWeeks() { return this.plan.overlapWeeks('2026-07-05', '2026-08-15'); }
  get peakFee() { return this.peakWeeks * 40; }
  get minorRate() { return this.family || this.minorCare === 'none' ? 0 : this.minorCare === 'under15' ? 100 : 50; }
  get minorFee() { return this.minorRate * this.plan.roomWeeks; }
  get total() { return money(Math.max(0, this.base - this.reporterDiscount - this.offSeasonDiscount - this.sidaDiscount - this.longStayDiscount) + this.peakFee + this.minorFee); }
  get prepaid() {
    const off = money(this.base * (1 - this.seasonRate));
    return money(Math.max(0, this.base - off - money((this.base - off) * 0.1) - this.longStayDiscount) + this.peakFee + this.minorFee);
  }
  get refund() { return money(this.prepaid - this.total); }
  get settlementNote() {
    return this.reporterDiscount ? `预收${quoteMoney(this.prepaid)}美元；完成活动毕业后预计退${quoteMoney(this.refund)}美元。` : '';
  }
  get minorNote() { return `无家长陪同：15岁以下100美元/周，15–未满18岁50美元/周；按住宿周数收取，不打折，含毕业时机场接送。${this.minorCare === 'under15' && !this.family ? '独自入学年龄资格须向学校确认，旺季不单独接收15岁以下学生。' : ''}`; }
  get peakNote() { return `2026/7/5–8/15就读期间40美元/周，本次${this.peakWeeks}周；附加费不参与折扣。`; }
  get error() {
    if (this.plan.error) return this.plan.error;
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (this.plan.courses.some(row => row.optionId === 'ielts-guarantee' && row.weeks < 12)) return 'IELTS GUARANTEE需12周起报，并提供雅思官方成绩。';
    if (!this.family && this.minorCare === 'under15' && this.peakWeeks > 0) return '旺季不单独接收15岁以下学员，请改为亲子或咨询夏令营。';
    return '';
  }
  get visaCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }
  get visaNote() { return this.longTermVisa ? '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。' : `按${this.initialVisaDays}天初始签证预估，本次续签${this.visaCount}次，每次5,130比索、有效期30天。学校统一办理，如遇上课时间不额外补课；实际以学校及移民局收费为准。`; }
  get localFees(): BCebuLocalFee[] {
    const roomPeriods = Math.ceil(this.plan.roomWeeks / 4), coursePeriods = Math.ceil(this.plan.courseWeeks / 4);
    const acr = !this.longTermVisa && this.visaCount > 0 ? 1 : 0;
    const arp = this.longTermVisa || this.visaCount > 0 ? 1 : 0;
    return [
      { item: 'SSP特殊学习许可证', amount: '7,800 比索 / 次', quantity: this.longTermVisa ? 0 : 1, total: this.longTermVisa ? 0 : 7800, note: this.longTermVisa ? this.visaNote : '移民局收取，按报名学习时长办理；续费及换校需要重新办理' },
      { item: 'SSP-E CARD', amount: '4,500 比索 / 次', quantity: this.longTermVisa ? 0 : 1, total: this.longTermVisa ? 0 : 4500, note: this.longTermVisa ? this.visaNote : '移民局收取，入学和SSP同时办理，只收一次' },
      { item: 'ACR-I CARD 外国人身份证', amount: '4,000 比索 / 次', quantity: acr, total: 4000 * acr, note: this.longTermVisa ? this.visaNote : `移民局收取，学校统一办理；按${this.initialVisaDays}天初始签证预估，第一次续签时办理` },
      { item: 'ARP外国人登记', amount: '300 比索 / 次', quantity: arp, total: 300 * arp, note: this.longTermVisa ? '长期签证仍计收一次，暂按300比索预估；须由顾问确认学校最新政策。' : '旅游签证首次续签时计入一次，暂按300比索预估；须由顾问确认学校最新政策。' },
      { item: '维护管理费', amount: '2,000 比索 / 4周', quantity: roomPeriods, total: 2000 * roomPeriods, note: '校内教学楼及其他设施维护费；按住宿周数每4周计算，不足4周先按1份预估' },
      { item: '水电费', amount: '4,000 比索 / 4周', quantity: roomPeriods, total: 4000 * roomPeriods, note: '按住宿周数每4周计算，不足4周先按1份预估' },
      { item: '签证续签', amount: '5,130 比索 / 次', quantity: this.visaCount, total: 5130 * this.visaCount, note: this.visaNote },
      { item: '教材费', amount: '2,000 比索 / 4周', quantity: coursePeriods, total: 2000 * coursePeriods, note: '预估金额，按课程周数每4周预估1份，不足4周先按1份；不同课程所需教材不同，学完后需重新购买，以实际购买为准' },
      { item: '学生证', amount: '200 比索 / 次', quantity: 1, total: 200, note: '一次性费用' },
    ];
  }
  get localTotal() { return this.localFees.reduce((sum, row) => sum + row.total, 0); }
  get optionalFees() {
    return [
      { item: '宿务马克坦机场团体接机', total: this.pickup === 'none' ? 0 : this.pickup === 'group' ? 1000 : 1500, note: `周日团体接机1,000比索／人，工作日1,500比索／人；${this.pickup === 'none' ? '本次未选接机。' : '本次按1人计费。'}学校团体接机，可能需在机场等候同批其他学生。` },
      { item: '房间押金', total: this.plan.roomWeeks <= 4 ? 3000 : 5000, note: `1–4周3,000比索，5–24周5,000比索；只收一次，无损坏及额外扣费时毕业可退。${this.plan.roomWeeks > 24 ? '超过24周暂按5,000比索预估，需学校确认。' : ''}` },
    ];
  }
  get paymentItems(): QuoteImagePaymentItem[] {
    return [
      { icon: '注', label: '注册费', amount: `${quoteMoney(this.registration())} 美元`, note: BCEBU_REGISTRATION_NOTE },
      { icon: '免', label: '免注册费优惠', amount: `− ${quoteMoney(this.registration())} 美元`, note: '通过思达报名免注册费', accent: true },
      { icon: '记', label: '记者活动优惠', amount: this.reporterDiscount ? `− ${quoteMoney(this.reporterDiscount)} 美元` : '未参与', note: `${BCEBU_PROMOTION_DATES}；${BCEBU_REPORTER_NOTE}`, accent: this.reporterDiscount > 0 },
      { icon: '淡', label: '淡季优惠', amount: this.offSeason ? `− ${quoteMoney(this.offSeasonDiscount)} 美元` : '不适用', note: `${BCEBU_PROMOTION_DATES}；成人课程及住宿85折，亲子9折，不限房型${this.family ? '；本次按亲子计算，每位学员分别报价' : ''}`, accent: this.offSeason },
      { icon: '思', label: '思达启航专属折扣', amount: `− ${quoteMoney(this.sidaDiscount)} 美元`, note: '课程及住宿在记者、淡季优惠后再享9折', accent: true },
      { icon: '长', label: '长期优惠', amount: this.longStayDiscount ? `− ${quoteMoney(this.longStayDiscount)} 美元` : '未满8周', note: BCEBU_LONG_STAY_NOTE, accent: this.longStayDiscount > 0 },
      ...(this.peakFee ? [{ icon: '旺', label: '旺季附加费', amount: `${quoteMoney(this.peakFee)} 美元`, note: this.peakNote }] : []),
      ...(this.minorFee ? [{ icon: '管', label: '未成年单独在校管理费', amount: `${quoteMoney(this.minorFee)} 美元`, note: this.minorNote }] : []),
    ];
  }
  imageData(usdToCny: number, phpPerCny: number, exchangeNote: string) {
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: "B'Cebu", schoolName: "B'Cebu", filePrefix: 'BCEBU', heroSrc: '/assets/philippines/bcebu-campus-hero.webp',
      weeks: this.plan.courseWeeks, startDate: this.entryDate, usdToCny, totalUsd: this.total,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems: this.paymentItems,
      localFeeItems: this.localFees.map(fee => ({ label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: `${quoteMoney(fee.total)} 比索`, note: fee.note })),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / phpPerCny), localFeeNote: BCEBU_LOCAL_FEE_INTRO,
      optionalFeeItems: this.optionalFees.map(fee => ({ label: fee.item, amount: `${quoteMoney(fee.total)} 比索`, cnyAmount: `人民币预计约 ${Math.round(fee.total / phpPerCny).toLocaleString('zh-CN')} 元`, note: fee.note })),
      ruleNotes: [],
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
        '学费需到校前2周交齐；最终以学校空房、优惠及实收为准。',
      ], note: '',
    }, this.plan, "B'Cebu", this.total, usdToCny);
  }
}
