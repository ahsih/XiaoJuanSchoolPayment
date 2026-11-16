// CIA quote calculator without a host page: students, group mode, payment lines, local fees,
// totals, and the full-detail quote image data. CiaSchoolComponent delegates to it, and the WeChat
// mini program bundles it (SiDaQiHangWeChat scripts/sync-quote-engine.mjs), so both produce the
// same quote from the same published content. Prices and rules come only from a CiaContentConfig
// (the published employee revision or its defaults); this file adds none of its own.
// Keep it free of Angular, DOM and storage access.
import { applyEditableQuoteImageCopy, applySchoolQuoteImageLayout } from '../../../components/school-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { groupLocalFees, groupPaymentLines, SchoolLocalFee } from '../../../components/school-group-quote';
import type { QuoteImageCardData, QuoteImagePaymentItem } from '../../../components/quote-image-types';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { CiaQuotePrices, CiaStudentQuote, ciaPriceMultiplier } from './cia-student-quote';
import type { CiaContentConfig, CiaPeakSeasonRange, CiaQuoteImageSettings } from './cia-content-config';

/** Campus photo at the top right of the CIA quote image. */
export const CIA_QUOTE_IMAGE_HERO = '/assets/cia/campus-building.webp';

export interface CiaQuoteCourse {
  id: string;
  name: string;
  tuition: number;
  tuition2027: number;
  suitable: string;
  schedule: string;
  note: string;
}

export interface CiaQuoteRoom {
  id: string;
  name: string;
  fee: number;
  note: string;
}

/** Everything the calculator reads. The website component is one; the mini program builds one. */
export interface CiaQuotePricing extends CiaQuotePrices {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  peakSeasonRanges: CiaPeakSeasonRange[];
  quoteImageSettings: CiaQuoteImageSettings;
  /** Exchange rates from the Frankfurter rules; NaN while unavailable (export stays blocked). */
  usdToCny: number;
  phpPerCny: number;
  exchangeRateDate: string;
  usingLiveExchangeRates: boolean;
}

export interface CiaSchoolPaymentItem extends QuoteImagePaymentItem {
  previewKind: string;
  previewId: string;
}

export interface CiaOptionalFeeItem {
  label: string;
  amount: string;
  cnyAmount: string;
  note: string;
}

/** A published revision or its defaults must carry these before the calculator uses them. */
export function isCiaContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'CIA'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/**
 * Copy the calculator's prices and rules from a (cloned) content document, exactly as the CIA
 * page does when a revision is published. Courses and rooms are replaced only when the document
 * enables at least one.
 */
export function applyCiaQuoteContent(target: CiaQuotePricing, content: CiaContentConfig): void {
  const courses = content.courses
    .filter(item => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const rooms = content.rooms
    .filter(item => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (courses.length > 0) {
    target.courseFees = courses.map(item => ({
      id: item.id,
      name: item.name,
      tuition: item.tuition,
      tuition2027: item.tuition2027,
      suitable: item.suitable,
      schedule: item.schedule,
      note: item.note,
    }));
  }
  if (rooms.length > 0) {
    target.roomFees = rooms.map(item => ({
      id: item.id,
      name: item.name,
      fee: item.fee,
      note: item.note,
    }));
  }
  target.localFeeRules = content.localFees;
  const settings = content.quoteSettings;
  target.registrationFee = settings.registrationFee;
  target.futurePriceRegistrationStart = settings.futurePriceRegistrationStart;
  target.futurePriceArrivalStart = settings.futurePriceArrivalStart;
  target.shortTermPriceRatios = { ...settings.shortStayRatios };
  target.seasonalFeePerWeek = settings.peakSeasonFeePerWeek;
  target.peakSeasonRanges = settings.peakSeasonRanges;
  target.promotions = settings.promotions;
  target.quoteImageSettings = content.quoteImageSettings;
}

/** Pricing built only from one (cloned) content document, for hosts without other price sources. */
export function createCiaQuotePricing(content: CiaContentConfig): CiaQuotePricing {
  const pricing: CiaQuotePricing = {
    courseFees: [],
    roomFees: [],
    registrationFee: 0,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortTermPriceRatios: {},
    seasonalFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: [],
    localFeeRules: [],
    quoteImageSettings: content.quoteImageSettings,
    usdToCny: Number.NaN,
    phpPerCny: Number.NaN,
    exchangeRateDate: '',
    usingLiveExchangeRates: false,
  };
  applyCiaQuoteContent(pricing, content);
  return pricing;
}

export class CiaQuote {
  readonly students: CiaStudentQuote[];

  constructor(private readonly pricing: CiaQuotePricing) {
    this.students = [new CiaStudentQuote(pricing)];
  }
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(new CiaStudentQuote(this.pricing));
    }
  }
  setQuoteMode(value: 'single' | 'group') {
    this.quoteMode = value;
    if (value === 'group') this.studentCount = this.requestedStudentCount;
  }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0,1) : this.students.slice(0,Math.max(2,Math.min(20,Math.floor(this.studentCount)||2))); }
  get quotePlan() { return this.students[0].quotePlan; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  get selectedStartDate() { return this.quotePlan.startDate; }
  get quoteHeading() { return this.quoteMode === 'single' ? `CIA${this.selectedWeeks}周报价` : `CIA ${this.activeStudents.length}人报价`; }
  get quoteError() {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.quoteError);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? '学生' + (index+1) + '：' : ''}${this.activeStudents[index].quoteError}`;
  }

  /** After a content change, move rows whose course or room is no longer offered to the first option. */
  retainValidSelections(): void {
    for (const student of this.students) {
      for (const row of student.quotePlan.courses) {
        if (!this.pricing.courseFees.some(item => item.id === row.optionId)) {
          row.optionId = this.pricing.courseFees[0]?.id ?? row.optionId;
        }
      }
      for (const row of student.quotePlan.rooms) {
        if (!this.pricing.roomFees.some(item => item.id === row.optionId)) {
          row.optionId = this.pricing.roomFees[0]?.id ?? row.optionId;
        }
      }
    }
  }

  get registrationNote() {
    const base = '一次性费用，老学员返校免费';
    if (this.quoteMode === 'single') {
      const waiver = this.students[0].promotionResults.find(result => result.rule.waiveRegistration);
      return base + (waiver && !this.students[0].returningStudent ? `；本次${waiver.rule.name}免收注册费` : '');
    }
    const paid = this.activeStudents.filter(student => student.registration > 0).length;
    return `${base}；本次计收${paid}人 × ${this.formatUsd(this.pricing.registrationFee)}美元${paid < this.activeStudents.length ? '，其余已免' : ''}`;
  }
  get schoolPaymentItems(): CiaSchoolPaymentItem[] {
    const sources = this.activeStudents.flatMap(student => student.paymentLines);
    return [{ icon:'注', label:'注册费', amount:`${this.formatUsd(this.payableRegistrationFee)} 美元`, note:this.registrationNote,
      previewKind: 'section', previewId: 'quote-registration' },
      ...groupPaymentLines(this.activeStudents, false).map((line, index) => ({
        ...line,
        previewKind: sources[index].promotionKey ? 'promotion' : 'section',
        previewId: sources[index].promotionKey ?? 'quote-season',
      }))];
  }
  get optionalFeeItems(): CiaOptionalFeeItem[] {
    const count = this.activeStudents.length;
    const phpPerCny = this.pricing.phpPerCny;
    return this.pricing.localFeeRules
      .filter(rule => rule.enabled && !rule.includeInTotal)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(rule => {
        const quantity = rule.multiplyByStudents ? count : 1;
        const total = rule.amount * quantity;
        const amount = rule.secondaryAmount
          ? `${this.formatPhp(rule.amount)}／${rule.secondaryLabel || '另一时段'}${this.formatPhp(rule.secondaryAmount)}`
          : this.formatPhp(total);
        const cnyAmount = rule.secondaryAmount
          ? `约人民币 ${quoteCurrencyText(Math.round(rule.amount / phpPerCny), 'zh-CN')}／${quoteCurrencyText(Math.round(rule.secondaryAmount / phpPerCny), 'zh-CN')} 元`
          : `约人民币 ${quoteCurrencyText(Math.round(total / phpPerCny), 'zh-CN')} 元`;
        const groupNote = rule.multiplyByStudents && count > 1 ? `（${count}人）` : '';
        return { label: rule.name, amount, cnyAmount, note: `${rule.note}${groupNote}` };
      });
  }

  get iauRegistrationFeeNote(): string {
    return this.activeStudents.flatMap((student,index) => student.iauNote ? [`${this.quoteMode === 'group' ? '学生'+(index+1)+'：' : ''}${student.iauNote}`] : []).join('\n');
  }

  get tuitionForSelectedWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.tuition,0); }
  get roomFeeForSelectedWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.accommodation,0); }
  get peakSeasonWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.peakWeeks,0); }
  get isPeakSeason(): boolean {
    return this.peakSeasonWeeks > 0;
  }
  get seasonalSurcharge(): number {
    return this.peakSeasonWeeks * this.pricing.seasonalFeePerWeek;
  }
  get coveredPeakSeasonLabels(): string {
    return this.pricing.peakSeasonRanges
      .filter(({ enabled, start, end }) => enabled !== false &&
        this.activeStudents.some(student => student.quotePlan.overlapWeeks(
          start,
          end,
          [...student.quotePlan.courses, ...student.quotePlan.rooms],
        ) > 0),
      )
      .map(({ label }) => label)
      .join('、');
  }
  get peakSeasonStatusText(): string {
    if (!this.isPeakSeason) {
      return '当前选择的入学日期与学习周数未覆盖旺季，附加费为0美元。';
    }

    const scope = this.quoteMode === 'group' ? '当前多人方案合计' : '当前方案';
    return `${scope}覆盖${this.coveredPeakSeasonLabels}共${this.peakSeasonWeeks}个学生周，已自动计入${this.formatUsd(this.seasonalSurcharge)}美元。`;
  }
  get peakSeasonCalendarRanges(): CiaPeakSeasonRange[] {
    return this.pricing.peakSeasonRanges
      .filter(({ enabled, start }) => enabled !== false && start.startsWith('2027-'))
      .slice()
      .sort((a, b) => a.start.localeCompare(b.start));
  }
  get peakSeason2027RangeText(): string {
    return this.peakSeasonCalendarRanges
      .map(range => `${range.label} ${this.formatPeakSeasonRange(range)}`)
      .join('；');
  }
  formatPeakSeasonRange(range: CiaPeakSeasonRange): string {
    return `${range.start.replace(/-/g, '/')}–${range.end.replace(/-/g, '/')}`;
  }

  get isChristmasPromotionEligible(): boolean { return this.activeStudents.some(student=>student.christmasEligible); }
  get payableRegistrationFee(): number { return this.activeStudents.reduce((sum,student)=>sum+student.registration,0); }
  get sidaDiscountAmount(): number { return this.activeStudents.reduce((sum,student)=>sum+student.sidaDiscount,0); }
  get christmasDiscountAmount(): number { return this.activeStudents.reduce((sum,student)=>sum+student.christmasDiscount,0); }
  get totalDiscountAmount(): number {
    return this.activeStudents.reduce((sum, student) => sum + student.promotionDiscountTotal, 0)
      + this.activeStudents.length * this.pricing.registrationFee - this.payableRegistrationFee;
  }
  get quoteUsd(): number { return this.activeStudents.reduce((sum,student)=>sum+student.quoteUsd,0); }

  get quoteUsdText(): string {
    return `${this.formatUsd(this.quoteUsd)} 美元`;
  }

  get quoteCnyText(): string {
    const rounded = Math.round(this.quoteUsd * this.pricing.usdToCny);
    return `人民币预计金额：约 ${rounded.toLocaleString('zh-CN')} 元`;
  }

  get exchangeRateDateText(): string {
    if (!this.pricing.exchangeRateDate) {
      return '最新参考汇率待更新';
    }

    return this.pricing.exchangeRateDate.replace(/-/g, '/');
  }

  get exchangeRateSummary(): string {
    return `参考汇率：1美元 ≈ ${quoteCurrencyText(this.pricing.usdToCny, 'zh-CN', { maximumFractionDigits: 6 })}元人民币（${this.pricing.usingLiveExchangeRates ? this.exchangeRateDateText : '最新参考汇率待更新'}）`;
  }

  get estimatedLocalFees(): SchoolLocalFee[] { return groupLocalFees(this.activeStudents); }

  get estimatedLocalFeeTotal(): number {
    return this.estimatedLocalFees.reduce((total, fee) => total + fee.total, 0);
  }

  get estimatedLocalFeeCny(): number {
    return Math.round(this.estimatedLocalFeeTotal / this.pricing.phpPerCny);
  }

  formatPhp(value: number): string { if (!Number.isFinite(value)) return '汇率待更新';
    return `${Math.round(value).toLocaleString('en-US')} 比索`;
  }

  formatFeeQuantity(value: number): string {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  }

  formatUsd(value: number): string { if (!Number.isFinite(value)) return '汇率待更新';
    return value.toLocaleString('en-US', {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
      maximumFractionDigits: 2,
    });
  }

  get quoteImageData(): QuoteImageCardData {
    const settings = this.pricing.quoteImageSettings;
    const paymentItems = [{
      ...this.schoolPaymentItems[0],
      note: this.quoteImageRegistrationNote(),
    },
      ...(['课','宿'] as const).flatMap(icon => this.activeStudents.flatMap((student,index) => student.quotePlan.paymentItems().filter(item=>item.icon===icon).map(item=>({
        ...item,
        label:`${this.quoteMode === 'group' ? '学生'+(index+1)+' · ' : ''}${item.label.replace(/^课程费/,'课程名称').replace(/^住宿费/,'住宿名称')}`,
        note:this.joinQuoteImageNotes(
          item.note,
          icon === '课' ? settings.paymentNotes.course : settings.paymentNotes.accommodation,
        ),
      })))),
      ...groupPaymentLines(this.activeStudents,true).map(item => ({
        ...item,
        note:this.joinQuoteImageNotes(item.note, settings.paymentNotes.promotion),
      }))];
    const warnings = this.activeStudents.flatMap((student,index)=>student.quotePlan.warning ? [`${this.quoteMode==='group'?'学生'+(index+1)+'：':''}${student.quotePlan.warning}`] : []);
    const notes = [...new Set(this.activeStudents.flatMap(student=>student.quotePlan.shortStayNotes(
      weeks => ciaPriceMultiplier(weeks, this.pricing.shortTermPriceRatios),
    )))];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode:'CIA', schoolName:'CIA', filePrefix:'CIA', heroSrc:CIA_QUOTE_IMAGE_HERO,
      weeks:this.selectedWeeks, startDate:this.selectedStartDate, usdToCny:this.pricing.usdToCny, totalUsd:this.quoteUsd,
      fullFeeDetails:true, localFeeTableLayout:'web', paymentItems,
      localFeeItems:this.estimatedLocalFees.map(fee=>({label:fee.item,unit:fee.unitLabel,quantity:this.formatFeeQuantity(fee.quantity),amount:this.formatPhp(fee.total),note:this.quoteImageLocalFeeNote(fee.item,fee.note)})),
      localFeeTotal:this.estimatedLocalFeeTotal, localCurrencyName:'比索', localFeeCny:this.estimatedLocalFeeCny,
      localFeeNote:settings.localFeeIntro,
      optionalFeeItems:this.optionalFeeItems.map(fee=>({...fee,note:this.quoteImageLocalFeeNote(fee.label,fee.note)})), ruleNotes:[],
    });
    const editedQuote = applyEditableQuoteImageCopy(quote, settings, this.pricing.promotions, this.pricing.localFeeRules);
    const result = applySchoolQuoteImageLayout({
      ...editedQuote, totalNote:this.iauRegistrationFeeNote, expandTotalNote:true,
      paymentSectionTitle:settings.paymentSectionTitle,
      localFeeTitle:settings.localFeeSectionTitle,
      serviceSectionTitle:settings.serviceSectionTitle,
      benefitItems:settings.benefits,
      serviceLocations:settings.serviceLocations,
      alumniBenefitTitle:settings.alumniBenefitTitle,
      alumniBenefitItems:[{title:settings.alumniBenefitTitle,subtitle:'',text:settings.alumniBenefitText}],
      noteTitle:settings.noteSectionTitle,
      importantNotes:[...warnings,...notes,...settings.footerNotes],
    },'CIA',this.selectedWeeks,this.selectedStartDate,this.quoteUsd,this.pricing.usdToCny);
    return {...result,
      paymentSectionTitle:settings.paymentSectionTitle,
      localFeeTitle:settings.localFeeSectionTitle,
      headingText:this.quoteHeading, fileName:`${this.quoteHeading}-${this.selectedStartDate.replace(/-/g,'')}.png`,
      conversionRates:{usdToCny:this.pricing.usdToCny,phpPerCny:this.pricing.phpPerCny,date:this.pricing.usingLiveExchangeRates?this.pricing.exchangeRateDate:undefined}};
  }

  private quoteImageRegistrationNote(): string {
    const defaultText = '一次性费用，老学员返校免费';
    const dynamicText = this.registrationNote.startsWith(defaultText)
      ? this.registrationNote.slice(defaultText.length).replace(/^；/, '')
      : this.registrationNote;
    return this.joinQuoteImageNotes(this.pricing.quoteImageSettings.paymentNotes.registration, dynamicText);
  }

  private quoteImageLocalFeeNote(item: string, calculatedNote: string): string {
    const name = item.replace(/^学生[\d、]+ · /, '');
    const rule = this.pricing.localFeeRules.find(candidate => candidate.name === name);
    if (!rule) return calculatedNote;
    const editedNote = this.pricing.quoteImageSettings.localFeeNotes[rule.id];
    if (editedNote === undefined || editedNote === rule.note) return calculatedNote;
    if (calculatedNote.includes(rule.note)) return calculatedNote.replace(rule.note, editedNote);
    return this.joinQuoteImageNotes(editedNote, calculatedNote);
  }

  private joinQuoteImageNotes(...parts: Array<string | undefined>): string {
    return parts.map(part => part?.trim()).filter(Boolean).join('；');
  }
}
