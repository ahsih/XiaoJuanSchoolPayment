import { QuotePlanRow, presentSchoolQuote, quoteMoney } from '../../../components/school-quote-plan';
import { GlcQuotePlan } from './glc-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { GlcCourse, GlcRoom, glcCourseName, GLC_LOCAL_FEE_INTRO, GLC_REGISTRATION_NOTE } from './glc-pricing';
import { SchoolVisaType } from '../../../components/school-group-quote';
import { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';

const DAY = 86400000;
const WEEK = 7 * DAY;
export const GLC_PROMOTION_WINDOWS = [
  ['2026-06-01', '2027-07-03'], ['2027-08-29', '2028-01-01'],
] as const;
export const GLC_PROMOTION_NOTE = '就读期间在2026/6/1–2027/7/3或2027/8/29–2028/1/1，符合条件的课程每满4周优惠150美元；轻量口语、亲子、儿童及青少年课程不适用。';
export const GLC_PICKUP_REGISTRATION_WINDOW = ['2026-04-05', '2027-01-02'] as const;
export const GLC_PICKUP_NOTE = '报名期接机优惠适用于所有课程，免费接机仅限周日；具体日期及收费见下方“另行准备”。';
export const GLC_PICKUP_FEE_NOTE = '2026年4月5日至2027年1月2日期间报名满4周，所有课程均可享周日免费接机一次；非周日接机仍收1,750比索/次。';
export const GLC_SIDA_NOTE = '思达启航专属优惠：课程每满4周减50美元，可与适用的学校优惠叠加。';

export interface GlcLocalFee {
  item: string; unit: string; quantity: number; total: number; note: string;
}

export class GlcQuoteCalculator {
  readonly weeks = Array.from({ length: 24 }, (_, index) => index + 1);
  get localFeeIntro() { return this.content?.().quoteSettings.localFeeIntro ?? GLC_LOCAL_FEE_INTRO; }
  get promotionNote() {
    const rules = this.schoolPromotionRules;
    return rules.length ? rules.map(rule => rule.description).filter(Boolean).join(' ') : GLC_PROMOTION_NOTE;
  }
  get pickupNote() { return this.promotion('glc-registration-pickup')?.description ?? GLC_PICKUP_NOTE; }
  get sidaNote() { return this.promotion('glc-sida')?.description ?? GLC_SIDA_NOTE; }
  returningStudents = 0;
  peopleOverride: number | null = null;
  registrationDate = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  })();
  pickup: 'sunday' | 'weekday' | 'none' = 'sunday';
  visaType: SchoolVisaType = 'tourist59';
  get initialVisaDays(): 30 | 59 { return this.visaType === 'tourist30' ? 30 : 59; }
  set initialVisaDays(value: 30 | 59) { this.visaType = value === 30 ? 'tourist30' : 'tourist59'; }
  readonly plan: GlcQuotePlan;

  constructor(
    readonly courses: () => GlcCourse[],
    readonly rooms: () => GlcRoom[],
    readonly registrationRate: () => number,
    readonly content?: () => CiaContentConfig,
  ) {
    this.plan = new GlcQuotePlan('power-speaking', 'annex-double', '2026-09-06', this.weeks,
      kind => kind === 'course'
        ? this.courses().map(course => ({ id: course.id, name: glcCourseName(course), details: [course.lessons, course.suitable].filter(Boolean).join('；') }))
        : this.rooms().map(room => ({ id: room.id, name: room.name, details: '按每人床位计费' })),
      (kind, row) => row.weeks * (kind === 'course'
        ? this.courses().find(course => course.id === row.optionId)?.weeklyTuition ?? 0
        : this.rooms().find(room => room.id === row.optionId)?.weeklyAccommodation ?? 0));
    this.plan.travellers = () => this.people;
  }

  course(row: QuotePlanRow) { return this.courses().find(course => course.id === row.optionId); }
  get family() { return this.plan.courses.some(row => this.course(row)?.family); }
  get people() { return this.peopleOverride ?? (this.family ? 2 : 1); }
  get returningStudentOptions() { return Array.from({ length: this.people + 1 }, (_, index) => index); }
  get registration() {
    const returningWaiver = this.promotion('glc-returning-registration');
    const returning = !this.content || returningWaiver?.waiveRegistration
      ? Math.min(this.people, Math.max(0, this.returningStudents))
      : 0;
    return (this.people - returning) * this.registrationRate();
  }
  get tuition() { return this.plan.total('course'); }
  get accommodation() { return this.plan.total('room'); }

  /** Count complete four-week blocks of consecutive eligible study weeks, across row boundaries. */
  blocks(weekStarts: number[]) {
    let previous = -Infinity, run = 0, blocks = 0;
    for (const start of [...new Set(weekStarts)].sort((a, b) => a - b)) {
      if (start !== previous + WEEK) { blocks += Math.floor(run / 4); run = 0; }
      run++; previous = start;
    }
    return blocks + Math.floor(run / 4);
  }

  private get schoolPromotionRules(): CiaPromotionRule[] {
    const configured = this.content?.().quoteSettings.promotions
      .filter(rule => rule.enabled && rule.id.startsWith('glc-school-window-'));
    if (configured?.length) return configured;
    return GLC_PROMOTION_WINDOWS.map(([coverageStart, coverageEnd], index) => ({
      id: `glc-school-window-${index + 1}`, name: '学校年度优惠', description: GLC_PROMOTION_NOTE,
      enabled: true, sortOrder: index, priority: 10 + index, stackable: true, newStudentsOnly: false,
      discountType: 'fixed', discountValue: 150, appliesTo: 'tuition', waiveRegistration: false,
      minimumCourseWeeks: 4, minimumAccommodationWeeks: 0, incrementWeeks: 4, incrementValue: 150,
      eligibleCourseIds: this.courses().filter(course => course.offSeasonEligible).map(course => course.id),
      coverageStart, coverageEnd, coverageTarget: 'course',
    }));
  }

  private promotion(id: string): CiaPromotionRule | undefined {
    return this.content?.().quoteSettings.promotions.find(rule => rule.id === id && rule.enabled);
  }

  private feeRule(id: string, fallback: Partial<CiaLocalFeeRule>): CiaLocalFeeRule {
    return this.content?.().localFees.find(rule => rule.id === id) ?? {
      id, name: String(fallback.name ?? id), currency: 'PHP', amount: Number(fallback.amount ?? 0),
      billingRule: fallback.billingRule ?? 'once', includeInTotal: fallback.includeInTotal ?? true,
      note: String(fallback.note ?? ''), enabled: true, sortOrder: Number(fallback.sortOrder ?? 0),
      ...fallback,
    } as CiaLocalFeeRule;
  }

  private schoolRuleBlocks(rule: CiaPromotionRule): number {
    const eligibleIds = rule.eligibleCourseIds?.length ? new Set(rule.eligibleCourseIds) : null;
    const eligibleRows = this.plan.courses.filter(row => !eligibleIds || eligibleIds.has(row.optionId));
    const from = rule.coverageStart ? this.plan.date(rule.coverageStart) : null;
    const to = rule.coverageEnd ? this.plan.date(rule.coverageEnd) : null;
    const starts = this.plan.weekStarts(eligibleRows).filter(start =>
      (from === null || start >= from) && (to === null || start + 6 * DAY <= to));
    return this.blocks(starts);
  }

  get schoolDiscountBlocks() { return this.schoolPromotionRules.reduce((sum, rule) => sum + this.schoolRuleBlocks(rule), 0); }
  get schoolDiscount() {
    return this.schoolPromotionRules.reduce((sum, rule) =>
      sum + this.schoolRuleBlocks(rule) * (rule.incrementValue ?? rule.discountValue), 0);
  }
  get sidaDiscount() {
    const rule = this.promotion('glc-sida');
    if (this.content && !rule) return 0;
    const eligibleIds = rule?.eligibleCourseIds?.length ? new Set(rule.eligibleCourseIds) : null;
    const rows = eligibleIds ? this.plan.courses.filter(row => eligibleIds.has(row.optionId)) : this.plan.courses;
    return this.blocks(this.plan.weekStarts(rows)) * (rule?.incrementValue ?? rule?.discountValue ?? 50);
  }
  get totalUsd() { return Math.max(0, this.registration + this.tuition + this.accommodation - this.schoolDiscount - this.sidaDiscount); }
  get registrationPickupEligible() {
    const rule = this.promotion('glc-registration-pickup');
    if (this.content && !rule) return false;
    const start = rule?.registrationStart ?? GLC_PICKUP_REGISTRATION_WINDOW[0];
    const end = rule?.registrationEnd ?? GLC_PICKUP_REGISTRATION_WINDOW[1];
    return this.plan.date(this.registrationDate) !== null && this.plan.courseWeeks >= (rule?.minimumCourseWeeks ?? 4)
      && this.registrationDate >= start && this.registrationDate <= end;
  }
  get studyPickupEligible() {
    const firstCourse = [...this.plan.courses].sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
    return this.schoolDiscountBlocks > 0 && !!firstCourse && this.schoolPromotionRules.some(rule => {
      const eligible = !rule.eligibleCourseIds?.length || rule.eligibleCourseIds.includes(firstCourse.optionId);
      return eligible && (!rule.coverageStart || firstCourse.startDate >= rule.coverageStart)
        && (!rule.coverageEnd || firstCourse.startDate <= rule.coverageEnd);
    });
  }
  get freePickup() { return this.pickup === 'sunday' && (this.registrationPickupEligible || this.studyPickupEligible); }
  get pickupAmount() {
    const travellers = this.peopleOverride ?? 1;
    return this.pickup === 'none' || this.freePickup ? 0 : this.feeRule('pickup', { amount: 1750 }).amount * travellers;
  }
  get longTermVisa() { return !['tourist30', 'tourist59'].includes(this.visaType); }
  get visaCount() { return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.plan.stayWeeks * 7 - this.initialVisaDays) / 30)); }

  get error(): string {
    if (this.plan.error) return this.plan.error;
    if (this.plan.date(this.registrationDate) === null) return '请选择有效的报名日期，用于核对接机优惠。';
    if (!['tourist30', 'tourist59', 'student', 'work', 'srrv', 'sirv'].includes(this.visaType)) return '请选择有效的签证类型。';
    if (!this.returningStudentOptions.includes(this.returningStudents)) return '请重新选择返校老学员人数。';
    for (const courseRow of this.plan.courses.filter(row => this.course(row)?.annexOnly)) {
      if (this.plan.rooms.some(room => !room.optionId.startsWith('annex-') && room.startDate <= this.plan.end(courseRow) && this.plan.end(room) >= courseRow.startDate)) {
        return '斯巴达课程期间只能选择副楼住宿，请调整对应房型。';
      }
    }
    if (this.family && this.plan.courses.some(row => !this.course(row)?.family)) return '亲子共享套餐与单人课程请分别报价，以免混淆两位学员的课程和费用。';
    return '';
  }

  get visaNote() {
    if (this.longTermVisa) return '长期签证相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。';
    return `按${this.initialVisaDays}天签证预估，每次续签30天；本次每人预计续签${this.visaCount}次，每次预估4,670比索。${this.initialVisaDays === 59 ? '若持30天签证，超过4周可能提前续签。' : ''}实际以学校及移民局办理为准。`;
  }

  get localFees(): GlcLocalFee[] {
    const accommodationPeriods = (rule: CiaLocalFeeRule) => Array.from({ length: this.people }, (_, index) => {
      const weeks = this.plan.roomsFor(index + 1).reduce((sum, row) => sum + row.weeks, 0);
      const period = Math.max(1, rule.periodWeeks ?? 4);
      return rule.rounding === 'proportional' ? weeks / period : Math.ceil(weeks / period);
    }).reduce((sum, count) => sum + count, 0);
    const textbook = (kind: 'esl' | 'ielts') => this.plan.courses.filter(row => this.course(row)?.textbook === kind).reduce((sum, row) => sum + row.weeks, 0);
    const eslWeeks = textbook('esl'), ieltsWeeks = textbook('ielts');
    const ssp = this.feeRule('ssp', { name: 'SSP特殊学习许可证', amount: 8000, waiveForLongTermVisa: true });
    const sspCard = this.feeRule('ssp-e-card', { name: 'SSP-E CARD', amount: 4500, waiveForLongTermVisa: true });
    const acr = this.feeRule('acr-i-card', { name: 'ACR-I CARD 外国人身份证', amount: 4000, waiveForLongTermVisa: true });
    const arp = this.feeRule('arp', { name: 'ARP外国人登记', amount: 300 });
    const management = this.feeRule('management', { name: '管理费', amount: 6000, periodWeeks: 4, rounding: 'ceil' });
    const water = this.feeRule('water', { name: '水费', amount: 2000, periodWeeks: 4, rounding: 'ceil' });
    const electricity = this.feeRule('electricity', { name: '电费', amount: 2000, periodWeeks: 4, rounding: 'ceil' });
    const visa = this.feeRule('visa-extension', { name: '签证续签', amount: 4670 });
    const fees: GlcLocalFee[] = [
      { item: ssp.name, unit: `${ssp.amount.toLocaleString('en-US')} 比索 / 人`, quantity: this.longTermVisa && ssp.waiveForLongTermVisa ? 0 : this.people, total: (this.longTermVisa && ssp.waiveForLongTermVisa ? 0 : this.people) * ssp.amount, note: this.longTermVisa && ssp.waiveForLongTermVisa ? this.visaNote : ssp.note },
      { item: sspCard.name, unit: `${sspCard.amount.toLocaleString('en-US')} 比索 / 人`, quantity: this.longTermVisa && sspCard.waiveForLongTermVisa ? 0 : this.people, total: (this.longTermVisa && sspCard.waiveForLongTermVisa ? 0 : this.people) * sspCard.amount, note: this.longTermVisa && sspCard.waiveForLongTermVisa ? this.visaNote : sspCard.note },
      { item: acr.name, unit: `${acr.amount.toLocaleString('en-US')} 比索 / 人`, quantity: this.longTermVisa && acr.waiveForLongTermVisa ? 0 : this.visaCount ? this.people : 0, total: (this.longTermVisa && acr.waiveForLongTermVisa ? 0 : this.visaCount ? this.people : 0) * acr.amount, note: this.longTermVisa && acr.waiveForLongTermVisa ? this.visaNote : acr.note },
      { item: arp.name, unit: `${arp.amount.toLocaleString('en-US')} 比索 / 人`, quantity: this.longTermVisa || this.visaCount ? this.people : 0, total: (this.longTermVisa || this.visaCount ? this.people : 0) * arp.amount, note: arp.note },
      ...[management, water, electricity].map(rule => { const quantity = accommodationPeriods(rule); return { item: rule.name, unit: `${rule.amount.toLocaleString('en-US')} 比索 / ${rule.periodWeeks ?? 4}周`, quantity, total: rule.amount * quantity, note: rule.note }; }),
      { item: visa.name, unit: `${visa.amount.toLocaleString('en-US')} 比索 / 次 / 人`, quantity: this.visaCount * this.people, total: this.visaCount * visa.amount * this.people, note: this.visaNote },
    ];
    const eslBooks = this.feeRule('books-esl', { name: '教材费（英语课程）', amount: 3000, periodWeeks: 8 });
    const ieltsBooks = this.feeRule('books-ielts', { name: '教材费（雅思）', amount: 5000, periodWeeks: 4 });
    if (eslWeeks && eslBooks.enabled) { const quantity = Math.ceil(eslWeeks / (eslBooks.periodWeeks ?? 8)) * this.people; fees.push({ item: eslBooks.name, unit: `${eslBooks.amount.toLocaleString('en-US')} 比索 / ${eslBooks.periodWeeks ?? 8}周 / 人预估`, quantity, total: eslBooks.amount * quantity, note: eslBooks.note }); }
    if (ieltsWeeks && ieltsBooks.enabled) { const quantity = Math.ceil(ieltsWeeks / (ieltsBooks.periodWeeks ?? 4)) * this.people; fees.push({ item: ieltsBooks.name, unit: `${ieltsBooks.amount.toLocaleString('en-US')} 比索 / ${ieltsBooks.periodWeeks ?? 4}周 / 人预估`, quantity, total: ieltsBooks.amount * quantity, note: ieltsBooks.note }); }
    const hidden = new Set((this.content?.().localFees ?? []).filter(rule => !rule.enabled).map(rule => rule.name));
    return fees.filter(fee => !hidden.has(fee.item));
  }

  get localTotal() { return this.localFees.reduce((sum, fee) => sum + fee.total, 0); }
  get pickupFeeNote() {
    const registration = this.plan.date(this.registrationDate) !== null ? `报名日期：${this.registrationDate.replace(/-/g, '/')}。` : '';
    const status = this.pickup === 'none' ? '本次不选接机，可自行前往学校。'
      : this.freePickup && !this.registrationPickupEligible ? '本次按就读期间的学校年度优惠赠送周日接机一次。'
      : this.pickup === 'sunday' && !this.freePickup ? '本次不符合免费条件，周日接机按1,750比索/次预估。' : '';
    const rule = this.promotion('glc-registration-pickup');
    const base = rule?.description ?? GLC_PICKUP_FEE_NOTE;
    return `${registration}${base}${status}`;
  }
  get optionalFees() {
    const pickup = this.feeRule('pickup', { name: '宿务马克坦机场团体接机', amount: 1750, note: '学校团体接机，可能需在机场等候同批其他学生。' });
    const deposit = this.feeRule('deposit', { name: '房间押金', amount: 3000, note: '可抵扣电费，离校按学校实际结算；不计入学杂费合计。' });
    return [
      ...(pickup.enabled ? [{ item: pickup.name, total: this.pickupAmount, note: `${this.pickupFeeNote} ${pickup.note}` }] : []),
      ...(deposit.enabled ? [{ item: deposit.name, total: deposit.amount * this.people, note: `${deposit.amount.toLocaleString('en-US')}比索/人${this.people > 1 ? `，共${this.people}人` : ''}；${deposit.note}` }] : []),
    ];
  }

  imageData(usdToCny: number, phpPerCny: number, exchangeNote: string, heroSrc: string) {
    const imageSettings = this.content?.().quoteImageSettings;
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: `注册费${this.people > 1 ? `（${this.people}人）` : ''}`, amount: `${quoteMoney(this.registration)} 美元`, note: imageSettings?.paymentNotes.registration ?? GLC_REGISTRATION_NOTE },
    ];
    if (this.schoolDiscount) paymentItems.push({ icon: '惠', label: '学校优惠', amount: `− ${quoteMoney(this.schoolDiscount)} 美元`, note: this.promotionNote, accent: true });
    if (this.sidaDiscount) paymentItems.push({ icon: '惠', label: '思达启航专属优惠', amount: `− ${quoteMoney(this.sidaDiscount)} 美元`, note: this.sidaNote, accent: true });
    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'GLC', schoolName: 'GLC', filePrefix: 'GLC', heroSrc,
      weeks: this.plan.courseWeeks, startDate: this.plan.startDate, usdToCny, totalUsd: this.totalUsd,
      fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems,
      localFeeItems: this.localFees.map(fee => ({
        label: fee.item,
        unit: fee.unit,
        quantity: String(fee.quantity),
        amount: `${quoteMoney(fee.total)} 比索`,
        note: imageSettings?.localFeeNotes[this.content?.().localFees.find(item => item.name === fee.item)?.id ?? ''] ?? fee.note,
      })),
      localFeeTotal: this.localTotal, localCurrencyName: '比索', localFeeCny: Math.round(this.localTotal / phpPerCny), localFeeNote: imageSettings?.localFeeIntro ?? this.localFeeIntro,
      optionalFeeItems: this.optionalFees.map(fee => ({
        label: fee.item,
        amount: `${quoteMoney(fee.total)} 比索`,
        cnyAmount: `人民币约 ${Math.round(fee.total / phpPerCny).toLocaleString('zh-CN')} 元`,
        note: imageSettings?.localFeeNotes[this.content?.().localFees.find(item => item.name === fee.item)?.id ?? ''] ?? fee.note,
      })),
      ruleNotes: imageSettings?.footerNotes ?? ['学费需到校前2周交齐，可由思达代收或自行转美元给学校。', '所有学生不收取寒暑假附加费。', exchangeNote],
    });
    return presentSchoolQuote({
      ...quote,
      paymentSectionTitle: imageSettings?.paymentSectionTitle ?? quote.paymentSectionTitle,
      localFeeTitle: imageSettings?.localFeeSectionTitle ?? quote.localFeeTitle,
      serviceSectionTitle: imageSettings?.serviceSectionTitle ?? quote.serviceSectionTitle,
      benefitItems: imageSettings?.benefits ?? quote.benefitItems,
      serviceLocations: imageSettings?.serviceLocations ?? quote.serviceLocations,
      alumniBenefitTitle: imageSettings?.alumniBenefitTitle ?? quote.alumniBenefitTitle,
      alumniBenefitItems: imageSettings ? [{ title: imageSettings.alumniBenefitTitle, subtitle: '', text: imageSettings.alumniBenefitText }] : quote.alumniBenefitItems,
      noteTitle: imageSettings?.noteSectionTitle ?? quote.noteTitle,
      totalNote: imageSettings?.footerNotes[0] ?? '学费需到校前2周交齐，可由思达代收或自行转美元给学校。',
      importantNotes: [...(imageSettings?.footerNotes ?? ['所有学生不收取寒暑假附加费。']), exchangeNote],
    }, this.plan, 'GLC', this.totalUsd, usdToCny);
  }
}
