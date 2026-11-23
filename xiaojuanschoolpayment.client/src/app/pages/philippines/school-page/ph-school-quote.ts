// Shared quote for every school page built on the Philippine school template: single and group
// modes, payment lines, local fees, totals and the full-detail quote image. Each school supplies
// its own per-student calculator (PhQuoteStudent); this class only adds the students up and lays
// out what they return, so the quote form and image look the same for every school.
// CiaQuote extends it and the WeChat mini program bundles it: keep it free of Angular, DOM and
// storage access.
import { applyEditableQuoteImageCopy, applySchoolQuoteImageLayout, SchoolQuotePlan } from '../../../components/school-quote-plan';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { groupLocalFees, groupPaymentLines, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { QuoteImageCardData, QuoteImageContactCard, QuoteImageLocalFeeItem, QuoteImagePaymentItem } from '../../../components/quote-image-types';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';

/** What the shared quote needs from one student's calculator. */
export interface PhQuoteStudent {
  readonly quotePlan: SchoolQuotePlan;
  readonly quoteError: string;
  readonly registration: number;
  readonly tuition: number;
  readonly accommodation: number;
  readonly peakWeeks: number;
  /** Peak-season surcharge in dollars; each school applies its own weekly rate. */
  readonly seasonalSurcharge: number;
  readonly quoteUsd: number;
  /** Surcharges, discounts and other school charges after registration, course and room. */
  readonly paymentLines: SchoolPaymentLine[];
  readonly localFees: SchoolLocalFee[];
  returningStudent: boolean;
  /** Name of the promotion that waived this student's registration fee, if one did. */
  readonly registrationWaiverName?: string;
  /** A single quote's registration note after the standard line (CELLA family packages: 整包价已含注册费). */
  readonly registrationNote?: string;
  /** An amount the student pays outside the school total (CIA's IAU fee), shown beside the total. */
  readonly extraPaymentNote?: string;
  /** The conditions the price depends on, for the image's 报价条件 line (layoutVersion 2). */
  readonly visaLabel?: string;
  readonly selectedAgeGroup?: 'adult' | 'minor';
  readonly selectedRegistrationDate?: string;
}

/** Prices and settings the shared quote reads; the page component is one, the mini program builds one. */
export interface PhQuotePricing {
  courseFees: ReadonlyArray<{ id: string; name: string }>;
  roomFees: ReadonlyArray<{ id: string; name: string }>;
  registrationFee: number;
  seasonalFeePerWeek: number;
  peakSeasonRanges: readonly CiaPeakSeasonRange[];
  promotions: CiaPromotionRule[];
  localFeeRules: CiaLocalFeeRule[];
  quoteImageSettings: CiaQuoteImageSettings;
  /** Exchange rates from the Frankfurter rules; NaN while unavailable (export stays blocked). */
  usdToCny: number;
  phpPerCny: number;
  exchangeRateDate: string;
  usingLiveExchangeRates: boolean;
}

export interface PhSchoolPaymentItem extends QuoteImagePaymentItem {
  previewKind: string;
  previewId: string;
}

export interface PhOptionalFeeItem {
  label: string;
  amount: string;
  cnyAmount: string;
  note: string;
}

export interface PhSchoolQuoteOptions<S extends PhQuoteStudent> {
  createStudent(): S;
  /** Quote heading: `${prefix}${weeks}周报价` for one student, `${prefix} ${n}人报价` for a group. */
  headingPrefix: string;
  /** Quote image header: school code, name, file prefix and campus photo. */
  image: { schoolCode: string; schoolName: string; filePrefix: string; heroSrc: string };
  /** Short-stay price ratio for a row of this many weeks, for the image's short-stay notes. */
  priceMultiplier(weeks: number): number;
  /** Optional fees outside the local-fee total; defaults to the content document's excluded rules. */
  optionalFeeItems?(students: readonly S[], quote: PhSchoolQuote<S>): PhOptionalFeeItem[];
  /** Show the students' extra-payment notes in full beside the image total (CIA). */
  expandTotalNote?: boolean;
  /**
   * The quote image template under the user's review (2026-11-21, CIA only until approved): `CIA 4周报价` with a
   * space, the 报价条件 line, a 小计 row per student in group quotes, local-fee rows that do not apply this time
   * merged into one 本次不产生 row, and the chosen consultant's contact card (see QuoteImageCardData.layoutVersion).
   */
  layoutVersion?: 2;
}

export const PH_REGISTRATION_NOTE = '一次性费用，老学员返校免费';

export class PhSchoolQuote<S extends PhQuoteStudent> {
  readonly students: S[];

  constructor(
    protected readonly pricing: PhQuotePricing,
    protected readonly options: PhSchoolQuoteOptions<S>,
  ) {
    this.students = [options.createStudent()];
  }
  quoteMode: 'single' | 'group' = 'single';
  /** The consultant chosen in the quote, for the contact card of layoutVersion 2 images. */
  contactCard?: QuoteImageContactCard;
  /** Whether the quote image shows the chosen consultant (layoutVersion 2), so the page offers the choice. */
  get usesContactCard(): boolean { return this.options.layoutVersion === 2; }
  private requestedStudentCount = 2;
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) {
      while (this.students.length < value) this.students.push(this.options.createStudent());
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
  get quoteHeading() {
    const prefix = this.options.headingPrefix;
    const space = this.options.layoutVersion === 2 ? ' ' : '';
    return this.quoteMode === 'single' ? `${prefix}${space}${this.selectedWeeks}周报价` : `${prefix} ${this.activeStudents.length}人报价`;
  }
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
    if (this.quoteMode === 'single') {
      const own = this.students[0].registrationNote;
      if (own) return `${PH_REGISTRATION_NOTE}；${own}`;
      const waiver = this.students[0].registrationWaiverName;
      return PH_REGISTRATION_NOTE + (waiver !== undefined && !this.students[0].returningStudent ? `；本次${waiver}免收注册费` : '');
    }
    const paid = this.activeStudents.filter(student => student.registration > 0).length;
    return `${PH_REGISTRATION_NOTE}；本次计收${paid}人 × ${this.formatUsd(this.pricing.registrationFee)}美元${paid < this.activeStudents.length ? '，其余已免' : ''}`;
  }
  get schoolPaymentItems(): PhSchoolPaymentItem[] {
    const sources = this.activeStudents.flatMap(student => student.paymentLines);
    return [{ icon:'注', label:'注册费', amount:`${this.formatUsd(this.payableRegistrationFee)} 美元`, note:this.registrationNote,
      previewKind: 'section', previewId: 'quote-registration' },
      ...groupPaymentLines(this.activeStudents, false).map((line, index) => ({
        ...line,
        previewKind: sources[index].promotionKey ? 'promotion' : 'section',
        previewId: sources[index].promotionKey ?? 'quote-season',
      }))];
  }
  get optionalFeeItems(): PhOptionalFeeItem[] {
    if (this.options.optionalFeeItems) return this.options.optionalFeeItems(this.activeStudents, this);
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

  /** Amounts due outside the school total, one line per student who has one. */
  get extraPaymentNote(): string {
    return this.activeStudents.flatMap((student,index) => student.extraPaymentNote ? [`${this.quoteMode === 'group' ? '学生'+(index+1)+'：' : ''}${student.extraPaymentNote}`] : []).join('\n');
  }

  get tuitionForSelectedWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.tuition,0); }
  get roomFeeForSelectedWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.accommodation,0); }
  get peakSeasonWeeks(): number { return this.activeStudents.reduce((sum,student)=>sum+student.peakWeeks,0); }
  get isPeakSeason(): boolean {
    return this.peakSeasonWeeks > 0;
  }
  get seasonalSurcharge(): number {
    return this.activeStudents.reduce((sum, student) => sum + student.seasonalSurcharge, 0);
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

  get payableRegistrationFee(): number { return this.activeStudents.reduce((sum,student)=>sum+student.registration,0); }
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
    const image = this.options.image;
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
      weeks => this.options.priceMultiplier(weeks),
    )))];
    const quote = buildPhilippinesDetailedQuote({
      schoolCode:image.schoolCode, schoolName:image.schoolName, filePrefix:image.filePrefix, heroSrc:image.heroSrc,
      weeks:this.selectedWeeks, startDate:this.selectedStartDate, usdToCny:this.pricing.usdToCny, totalUsd:this.quoteUsd,
      fullFeeDetails:true, localFeeTableLayout:'web', paymentItems,
      localFeeItems:this.estimatedLocalFees.map(fee=>({label:fee.item,unit:fee.unitLabel,quantity:this.formatFeeQuantity(fee.quantity),amount:this.formatPhp(fee.total),note:this.quoteImageLocalFeeNote(fee.item,fee.note)})),
      localFeeTotal:this.estimatedLocalFeeTotal, localCurrencyName:'比索', localFeeCny:this.estimatedLocalFeeCny,
      localFeeNote:settings.localFeeIntro,
      optionalFeeItems:this.optionalFeeItems.map(fee=>({...fee,note:this.quoteImageLocalFeeNote(fee.label,fee.note)})), ruleNotes:[],
    });
    const editedQuote = applyEditableQuoteImageCopy(quote, settings, this.pricing.promotions, this.pricing.localFeeRules);
    const result = applySchoolQuoteImageLayout({
      ...editedQuote, totalNote:this.extraPaymentNote, ...(this.options.expandTotalNote ? { expandTotalNote:true } : {}),
      // The note is money paid outside the total, so it must stand out (user request 2026-11-23).
      ...(this.options.expandTotalNote && this.extraPaymentNote ? { emphasizeTotalNote:true } : {}),
      paymentSectionTitle:settings.paymentSectionTitle,
      localFeeTitle:settings.localFeeSectionTitle,
      serviceSectionTitle:settings.serviceSectionTitle,
      benefitItems:settings.benefits,
      serviceLocations:settings.serviceLocations,
      alumniBenefitTitle:settings.alumniBenefitTitle,
      alumniBenefitItems:[{title:settings.alumniBenefitTitle,subtitle:'',text:settings.alumniBenefitText}],
      noteTitle:settings.noteSectionTitle,
      importantNotes:[...warnings,...notes,...settings.footerNotes],
    },image.schoolCode,this.selectedWeeks,this.selectedStartDate,this.quoteUsd,this.pricing.usdToCny);
    const data: QuoteImageCardData = {...result,
      paymentSectionTitle:settings.paymentSectionTitle,
      localFeeTitle:settings.localFeeSectionTitle,
      headingText:this.quoteHeading, fileName:`${this.quoteHeading}-${this.selectedStartDate.replace(/-/g,'')}.png`,
      conversionRates:{usdToCny:this.pricing.usdToCny,phpPerCny:this.pricing.phpPerCny,date:this.pricing.usingLiveExchangeRates?this.pricing.exchangeRateDate:undefined}};
    if (this.options.layoutVersion !== 2) return data;
    return {
      ...data,
      layoutVersion: 2,
      paymentItems: [...data.paymentItems, ...this.studentSubtotalItems()],
      localFeeItems: this.mergeZeroLocalFees(data.localFeeItems ?? []),
      quoteConditions: this.quoteConditions,
      ...(this.contactCard ? { contactCard: this.contactCard } : {}),
    };
  }

  /** One student's conditions, e.g. 新学员 · 18岁及以上 · 59天旅游签证 · 报名日 2026/11/21. */
  studentConditionText(student: S): string {
    return [
      student.returningStudent ? '老学员' : '新学员',
      student.selectedAgeGroup === 'minor' ? '未满18岁' : student.selectedAgeGroup === 'adult' ? '18岁及以上' : '',
      student.visaLabel ?? '',
      student.selectedRegistrationDate ? `报名日 ${student.selectedRegistrationDate.replace(/-/g, '/')}` : '',
    ].filter(Boolean).join(' · ');
  }

  /** The 报价条件 lines: one for a single quote, and in a group one per set of students with the same conditions. */
  get quoteConditions(): string[] {
    const students = this.activeStudents;
    const texts = students.map(student => this.studentConditionText(student));
    if (this.quoteMode === 'single') return texts.slice(0, 1).filter(Boolean);
    const groups = [...new Set(texts)];
    if (groups.length === 1) return groups[0] ? [`${students.length}人相同：${groups[0]}`] : [];
    return groups.map(text => {
      const numbers = texts.flatMap((candidate, index) => candidate === text ? [index + 1] : []);
      return `学生${numbers.join('、')}：${text}`;
    });
  }

  /** Group quotes: each student's own school total (and local fees) for split payments (AA). */
  private studentSubtotalItems(): QuoteImagePaymentItem[] {
    if (this.quoteMode !== 'group') return [];
    return this.activeStudents.map((student, index) => {
      const localFees = student.localFees.reduce((sum, fee) => sum + fee.total, 0);
      const cny = Math.round(student.quoteUsd * this.pricing.usdToCny);
      return {
        icon: '计',
        label: `学生${index + 1} 小计`,
        amount: `${this.formatUsd(student.quoteUsd)} 美元`,
        note: `约人民币 ${cny.toLocaleString('zh-CN')} 元；到校学杂费另付约 ${this.formatPhp(localFees)}`,
        subtotal: true,
      };
    });
  }

  /**
   * Local-fee rows that do not apply to this plan (quantity 0) become one 本次不产生 row; amounts are unchanged.
   * Rows waived for a long-term visa keep their own row, because their note asks the adviser to confirm the waiver.
   */
  private mergeZeroLocalFees(items: QuoteImageLocalFeeItem[]): QuoteImageLocalFeeItem[] {
    const zero = this.estimatedLocalFees.filter(fee => fee.quantity === 0 && fee.total === 0 && !fee.waived);
    if (zero.length === 0) return items;
    const zeroNames = new Set(zero.map(fee => fee.item));
    const kept = items.filter(item => !zeroNames.has(item.label));
    const names = [...new Set(zero.map(fee => fee.item.replace(/^学生[\d、]+ · /, '')))];
    return [...kept, {
      label: '本次不产生',
      unit: '—',
      quantity: '0',
      amount: this.formatPhp(0),
      note: `${names.join('、')}：按本次周数和签证计算，不需要交；读得更久或换签证时会自动计入。`,
    }];
  }

  private quoteImageRegistrationNote(): string {
    const dynamicText = this.registrationNote.startsWith(PH_REGISTRATION_NOTE)
      ? this.registrationNote.slice(PH_REGISTRATION_NOTE.length).replace(/^；/, '')
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

  protected joinQuoteImageNotes(...parts: Array<string | undefined>): string {
    return parts.map(part => part?.trim()).filter(Boolean).join('；');
  }
}
