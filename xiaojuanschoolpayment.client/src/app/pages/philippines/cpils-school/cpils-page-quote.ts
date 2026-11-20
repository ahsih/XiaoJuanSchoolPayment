// CPILS on the shared Philippine school quote and plan comparison. CPILS prices every row from its
// dated content document (2026 grandfathered prices, exact 2027 short stays and guarantee packages,
// see cpils-pricing.ts); this file adds its offers, peak surcharge and local fees per student and
// hands the results to the template. Keep it free of Angular, DOM and storage access.
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import { nextQuoteSunday, QuotePlanKind, QuotePlanRow, SchoolQuotePlan } from '../../../components/school-quote-plan';
import type { QuoteImageCardData, QuoteImagePaymentItem } from '../../../components/quote-image-types';
import type { CiaContentConfig, CiaLocalFeeRule, CiaPromotionRule } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { associationPeakBreakdownText, calculateAssociationPeakSurcharge } from '../association-peak-surcharge';
import { textbookPeriods } from '../school-textbook-estimate';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolPaymentItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhPageStudent } from '../school-page/ph-school-profile';
import {
  CPILS_PARENT_CHILD_COURSE_IDS,
  cpils2027Eligible,
  cpilsMergedCourses,
  cpilsMonday,
  cpilsMoney,
  cpilsPolicyError,
  cpilsPriceYear,
  cpilsRowPrice,
} from './cpils-pricing';

export const CPILS_QUOTE_IMAGE_HERO = '/assets/cpils/campus-main.webp';
export const CPILS_WEEK_OPTIONS = Array.from({ length: 24 }, (_, index) => index + 1);
const DAY = 86400000;
const MINOR_NOTE = '未成年学生按所选课程收费，入学及监护要求须顾问确认。';
const EXTENSION_ITEMS = ['acr-i-card', 'arp', 'visa-extension'];

/** Everything CPILS's quote reads; the page component is one. */
export interface CpilsQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  /** The applied content document; rows are priced from its dated catalogue. */
  readonly cpilsContent: CiaContentConfig;
}

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CPILS_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: '综合英语', courseIds: ['general-esl-light', 'general-esl', 'general-esl-plus', 'esl-premium', 'premier-sparta'] },
  { id: 'ielts', label: '雅思', courseIds: ['pre-ielts-course', 'ielts-course', 'ielts-guarantee-8-weeks', 'ielts-guarantee-12-weeks'] },
  { id: 'toeic', label: '托业／托福', courseIds: ['toeic-course', 'toeic-guarantee', 'toefl-course'] },
  {
    id: 'career', label: '商务与职业英语',
    courseIds: ['business-english', 'power-speaking-and-modern-communication', 'tesol', 'medical-english', 'hotel-hospitality', 'barista-beverage', 'working-holiday'],
  },
  { id: 'family', label: '亲子课程', courseIds: CPILS_PARENT_CHILD_COURSE_IDS },
] as const;

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const php = (value: number) => `${Math.round(value).toLocaleString('en-US')} 比索`;

/** A local-fee rule as it applies on a date (2027 rows switch on their effective date). */
export function cpilsDatedFee(rule: CiaLocalFeeRule, date: string): CiaLocalFeeRule {
  if (!rule.futureEffectiveStart || date < rule.futureEffectiveStart) return rule;
  return {
    ...rule, name: rule.futureName ?? rule.name, amount: rule.futureAmount ?? rule.amount,
    periodWeeks: rule.futurePeriodWeeks ?? rule.periodWeeks, rounding: rule.futureRounding ?? rule.rounding,
    rates: rule.futureRates ?? rule.rates, note: rule.futureNote ?? rule.note,
  };
}

/** One CPILS student as the template sees it. */
export class CpilsPageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quotePlan: SchoolQuotePlan;
  readonly minorNote = MINOR_NOTE;
  selectedAgeGroup: 'adult' | 'minor' = 'adult';
  visaType = 'tourist59';
  returningStudent = false;
  selectedRegistrationDate = today();

  constructor(private readonly pricing: CpilsQuotePricing) {
    this.quotePlan = new SchoolQuotePlan('general-esl', 'regular-quad', nextQuoteSunday(), CPILS_WEEK_OPTIONS,
      kind => kind === 'course'
        ? pricing.courseFees.map(course => ({ id: course.id, name: course.name, details: this.courseDetails(course) }))
        : pricing.roomFees.map(room => ({ id: room.id, name: room.name, details: room.note })),
      (kind, row) => cpilsRowPrice(pricing.cpilsContent, this, kind, row), 24, true, false);
  }

  private get content() { return this.pricing.cpilsContent; }
  private rule(id: string): CiaPromotionRule | undefined {
    return this.pricing.promotions.find(rule => rule.id === id && rule.enabled);
  }
  private localRule(id: string): CiaLocalFeeRule | undefined {
    return this.pricing.localFeeRules.find(rule => rule.id === id && rule.enabled);
  }
  private get startsIn2027(): boolean { return cpilsMonday(this.quotePlan.courses[0]?.startDate ?? '') >= '2027-01-01'; }
  private kindOf(row: QuotePlanRow): QuotePlanKind { return this.quotePlan.courses.includes(row) ? 'course' : 'room'; }
  private get sidaRate(): number { return 1 - (this.rule('cpils-sida')?.discountValue ?? 0) / 100; }
  private get base(): number { return this.tuition + this.accommodation; }

  /** The course row's schedule and the price year it was charged at. */
  private courseDetails(course: CiaQuoteCourse): string {
    const year = cpilsPriceYear(this.content, this);
    const yearNote = year === 'unconfirmed' ? '所选日期价格待顾问确认'
      : `${year}年价格${year === 2026 && this.startsIn2027 ? '，不适用2027年学校优惠' : ''}`;
    return [course.schedule, yearNote].filter(Boolean).join('；');
  }

  get quoteError(): string {
    return this.quotePlan.error || cpilsPolicyError(this.content, this)
      || (!this.visaOptions.some(option => option.value === this.visaType) ? '请选择有效的签证类型。' : '');
  }
  /** Fixed course lengths are already reported by quoteError, so the extra form warning stays empty. */
  readonly courseLengthError = '';

  /** Guarantee packages and specialty courses have fixed lengths; the shortest one is the minimum. */
  minimumWeeks(courseId: string): number {
    const course = this.content.courses.find(item => item.id === courseId);
    const weeks = course?.allowedWeeks2027;
    return weeks?.length ? Math.min(...weeks) : 0;
  }

  get registration(): number { return this.returningStudent ? 0 : this.pricing.registrationFee; }
  get tuition(): number { return this.quotePlan.total('course'); }
  get accommodation(): number { return this.quotePlan.total('room'); }
  get sidaDiscount(): number { return cpilsMoney(this.base * (1 - this.sidaRate)); }

  /** 2026 off-season 5% for a row of 4+ weeks starting in its window (2026 course starts only). */
  private offSeasonRule(row: QuotePlanRow): CiaPromotionRule | undefined {
    if (cpilsMonday(row.startDate) >= '2027-01-01') return undefined;
    return ['cpils-off-season-spring', 'cpils-off-season-fall'].map(id => this.rule(id)).find(rule => !!rule
      && row.weeks >= Math.max(rule.minimumCourseWeeks, rule.minimumAccommodationWeeks)
      && (!rule.arrivalStart || row.startDate >= rule.arrivalStart)
      && (!rule.arrivalEnd || row.startDate <= rule.arrivalEnd));
  }
  private get scholarshipRule(): CiaPromotionRule | undefined {
    const rule = this.rule('cpils-scholarship-2027');
    return cpils2027Eligible(this.content, this, rule) ? rule : undefined;
  }
  /** The 2027 scholarship (5% after Sida's rate), or the 2026 off-season 5% on qualifying rows. */
  get offSeasonDiscount(): number {
    const scholarship = this.scholarshipRule;
    if (scholarship) return cpilsMoney(this.base * this.sidaRate * scholarship.discountValue / 100);
    if (this.startsIn2027) return 0;
    return cpilsMoney([...this.quotePlan.courses, ...this.quotePlan.rooms].reduce((sum, row) => {
      const rule = this.offSeasonRule(row);
      return rule ? sum + this.quotePlan.price(this.kindOf(row), row) * this.sidaRate * rule.discountValue / 100 : sum;
    }, 0));
  }
  private get offSeasonAppliedRule(): CiaPromotionRule | undefined {
    return this.scholarshipRule ?? [...this.quotePlan.courses, ...this.quotePlan.rooms]
      .map(row => this.offSeasonRule(row)).find((rule): rule is CiaPromotionRule => !!rule);
  }

  private get noWindowRule(): CiaPromotionRule | undefined {
    return this.rule(cpilsPriceYear(this.content, this) === 2027 ? 'cpils-no-window-2027' : 'cpils-no-window');
  }
  /** Rooms without an outside window: a fixed amount per complete 4 weeks. */
  get noWindowDiscount(): number {
    if (this.startsIn2027) {
      const rule = this.rule('cpils-no-window-2027');
      if (!rule || !cpils2027Eligible(this.content, this, rule)) return 0;
      const weeks = this.quotePlan.rooms.filter(row => rule.eligibleRoomIds?.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
      return Math.floor(weeks / Math.max(1, rule.incrementWeeks ?? 4)) * rule.discountValue;
    }
    const rule = this.rule('cpils-no-window');
    if (!rule) return 0;
    return this.quotePlan.rooms
      .filter(row => !!this.offSeasonRule(row) && ['no-window-single', 'no-window-twin'].includes(row.optionId))
      .reduce((sum, row) => sum + Math.floor(row.weeks / Math.max(1, rule.incrementWeeks ?? 4)) * rule.discountValue, 0);
  }

  private get holidayRule(): CiaPromotionRule | undefined {
    if (this.startsIn2027) return undefined;
    const rules = ['cpils-holiday-new-year', 'cpils-holiday-christmas']
      .map(id => this.rule(id)).filter((rule): rule is CiaPromotionRule => !!rule);
    const date = this.selectedRegistrationDate;
    return rules.find(rule =>
      (!rule.registrationStart || (date >= rule.registrationStart && date <= (rule.registrationEnd || rule.registrationStart)))
      && !!rule.coverageStart && !!rule.coverageEnd && this.quotePlan.covers(rule.coverageStart, rule.coverageEnd));
  }
  /** Christmas / New Year: the larger offer whose dates the whole stay covers. */
  get holidayDiscount(): number { return this.holidayRule?.discountValue ?? 0; }

  /** Course weeks touching an enabled peak range (CPILS charges study weeks only), at the CALA
   *  joint-notice rate: 40 dollars a week through 2026, 60 from 2027. */
  private get peak() {
    return calculateAssociationPeakSurcharge('CPILS', this.quotePlan.weekStarts(this.quotePlan.courses),
      this.pricing.peakSeasonRanges.filter(range => range.enabled), this.pricing.seasonalFeePerWeek);
  }
  get peakWeeks(): number { return this.peak.weeks; }
  get seasonalSurcharge(): number { return this.peak.total; }

  get promotionDiscountTotal(): number {
    return this.sidaDiscount + this.offSeasonDiscount + this.noWindowDiscount + this.holidayDiscount;
  }
  get quoteUsd(): number {
    return Math.max(0, cpilsMoney(this.registration + this.base - this.promotionDiscountTotal + this.seasonalSurcharge));
  }
  get discountNames(): string {
    const sida = this.rule('cpils-sida');
    return [
      this.sidaDiscount > 0 ? sida?.name : '',
      this.offSeasonDiscount > 0 ? this.offSeasonAppliedRule?.name : '',
      this.noWindowDiscount > 0 ? this.noWindowRule?.name : '',
      this.holidayDiscount > 0 ? this.holidayRule?.name : '',
    ].filter(Boolean).join('、');
  }

  get paymentLines(): SchoolPaymentLine[] {
    const sida = this.rule('cpils-sida');
    const offSeason = this.offSeasonAppliedRule;
    const noWindow = this.noWindowRule;
    const holiday = this.holidayRule;
    const defaultNoWindow = noWindow?.id === 'cpils-no-window-2027'
      && noWindow.description.startsWith('报名2026/09/29–2027/12/27')
      ? '无对外窗单人／双人房，窗户面向走廊；符合2027年优惠报名及开课条件，可与其他优惠同享。'
      : noWindow?.description ?? '';
    return [
      ...(sida && this.sidaDiscount ? [{ icon: '折', label: sida.name, value: -this.sidaDiscount, note: sida.description, promotionKey: sida.id }] : []),
      ...(offSeason && this.offSeasonDiscount ? [{ icon: '淡', label: offSeason.name, value: -this.offSeasonDiscount, note: offSeason.description, promotionKey: offSeason.id }] : []),
      ...(noWindow && this.noWindowDiscount ? [{ icon: '房', label: noWindow.name, value: -this.noWindowDiscount, note: defaultNoWindow, promotionKey: noWindow.id }] : []),
      ...(holiday ? [{ icon: '节', label: holiday.name, value: -holiday.discountValue, note: holiday.description, promotionKey: holiday.id }] : []),
      ...(this.seasonalSurcharge ? [{
        icon: '旺', label: '暑假附加费', value: this.seasonalSurcharge,
        note: `学习周与旺季重叠：${associationPeakBreakdownText(this.peak)}；不参与折扣`,
        promotionKey: 'cpils-summer',
      }] : []),
    ];
  }

  /** Non-cash official exam gifts for the selected exam courses. */
  get examBenefits(): string[] {
    if (this.quoteError) return [];
    const courses = cpilsMergedCourses(this.quotePlan);
    if (this.startsIn2027) {
      const ielts = this.rule('cpils-ielts-exam-2027');
      const toeic = this.rule('cpils-toeic-exam-2027');
      const ieltsEligible = !!ielts && cpils2027Eligible(this.content, this, ielts)
        && courses.some(row => ielts.eligibleCourseIds?.includes(row.optionId) && row.weeks >= ielts.minimumCourseWeeks);
      const toeicWeeks = courses.filter(row => toeic?.eligibleCourseIds?.includes(row.optionId)).reduce((sum, row) => sum + row.weeks, 0);
      const toeicEligible = !!toeic && cpils2027Eligible(this.content, this, toeic) && toeicWeeks >= toeic.minimumCourseWeeks;
      return [
        ...(ieltsEligible ? [`雅思课程一次注册12周及以上：赠${ielts.discountValue}次雅思官方考试`] : []),
        ...(toeicEligible ? [`托业课程：赠${Math.min(6, Math.floor(toeicWeeks / Math.max(1, toeic.incrementWeeks ?? 4)) * toeic.discountValue)}次官方考试`] : []),
      ];
    }
    return courses.flatMap(row => {
      if (row.optionId === 'ielts-course' && row.weeks >= 12) return ['雅思课程12周及以上：赠1次雅思官方考试'];
      if (row.optionId.startsWith('ielts-guarantee-')) return ['雅思保分班：赠1次雅思机考'];
      if (['toeic-course', 'toeic-guarantee'].includes(row.optionId) && row.weeks >= 4) {
        const name = this.pricing.courseFees.find(course => course.id === row.optionId)?.name ?? '托业课程';
        return [`${name}：赠${Math.min(6, 1 + Math.floor((row.weeks - 4) / 4))}次官方考试`];
      }
      return [];
    });
  }

  get visaLabel(): string { return this.visaOptions.find(option => option.value === this.visaType)?.label ?? ''; }
  private get longTermVisa(): boolean { return !['tourist30', 'tourist59'].includes(this.visaType); }
  /**
   * Immigration steps: a 30-day entry pays the first 29-day extension (5,130) and then the second
   * (6,400, with ACR I-CARD and ARP); a 59-day entry already includes the first, so its first
   * extension is the second step.
   */
  private get stepOffset(): number { return this.visaType === 'tourist59' ? 1 : 0; }
  private get extensionCount(): number {
    return this.longTermVisa ? 0 : Math.max(0, Math.ceil((this.quotePlan.stayWeeks - (this.visaType === 'tourist30' ? 4 : 8)) / 4));
  }
  private extensionDate(index: number): string {
    const weeks = (this.visaType === 'tourist30' ? 4 : 8) + index * 4;
    const start = this.quotePlan.date(this.quotePlan.startDate);
    return start === null ? '' : new Date(start + weeks * 7 * DAY).toISOString().slice(0, 10);
  }
  /** Whether the stay reaches the extension that needs ACR I-CARD and ARP, and its date. */
  private get secondStepDate(): string | undefined {
    const index = 1 - this.stepOffset;
    return this.extensionCount > index ? this.extensionDate(index) : undefined;
  }
  private get extensionTotal(): number {
    const rule = this.localRule('visa-extension');
    if (!rule) return 0;
    return Array.from({ length: this.extensionCount }, (_, index) => {
      const dated = cpilsDatedFee(rule, this.extensionDate(index));
      const step = index + this.stepOffset;
      return dated.rates?.[step] ?? dated.rates?.at(-1) ?? dated.amount;
    }).reduce((sum, value) => sum + value, 0);
  }

  get localFees(): SchoolLocalFee[] {
    const plan = this.quotePlan;
    const extensions = this.extensionCount;
    const longTerm = this.longTermVisa;
    const secondStep = this.secondStepDate;
    const visaNote = `${this.visaLabel}相关费用暂按0估算，是否免收请由顾问向学校确认，以学校最新政策为准。`;
    const rows: SchoolLocalFee[] = [];
    for (const base of this.pricing.localFeeRules.filter(rule => rule.enabled && rule.includeInTotal)) {
      const extensionItem = EXTENSION_ITEMS.includes(base.id);
      const date = extensionItem && !longTerm
        ? (base.id === 'visa-extension' ? this.extensionDate(0) : secondStep ?? plan.startDate)
        : plan.startDate;
      const rule = cpilsDatedFee(base, date);
      let quantity = 1;
      let total: number | undefined;
      let note = rule.note;
      let unitLabel = `${php(rule.amount)}／次`;
      if (rule.billingRule === 'per-accommodation-period' || rule.billingRule === 'per-course-period') {
        const weeks = rule.billingRule === 'per-course-period' ? plan.courseWeeks : plan.roomWeeks;
        quantity = weeks / Math.max(1, rule.periodWeeks ?? 4);
        if (rule.rounding === 'ceil') quantity = Math.ceil(quantity);
        if (base.id === 'books') quantity = textbookPeriods(plan.courses, rule.periodWeeks ?? 4, rule.rounding === 'ceil' ? 'ceil' : 'proportional');
        unitLabel = `${php(rule.amount)}／${rule.periodWeeks ?? 4}周`;
        // Only the management rate changes during a stay; split on the real effective date.
        if (base.id === 'management' && base.futureEffectiveStart && plan.startDate < base.futureEffectiveStart && plan.endDate >= base.futureEffectiveStart) {
          const boundary = Date.parse(base.futureEffectiveStart);
          const days = [...plan.days(plan.rooms)];
          const before = days.filter(day => day < boundary).length;
          const after = days.length - before;
          const future = cpilsDatedFee(base, base.futureEffectiveStart);
          quantity = plan.roomWeeks;
          total = cpilsMoney(before / 7 * base.amount / (base.periodWeeks ?? 4) + after / 7 * future.amount / (future.periodWeeks ?? 4));
          unitLabel = `${php(base.amount / (base.periodWeeks ?? 4))}→${php(future.amount / (future.periodWeeks ?? 4))}／周`;
          note = future.note;
        }
      }
      if (base.id === 'acr-i-card') {
        quantity = !longTerm && secondStep ? 1 : 0;
        note = longTerm ? visaNote : `按${this.visaLabel}预估；${rule.note}`;
      }
      if (base.id === 'arp') {
        quantity = longTerm || secondStep ? 1 : 0;
        if (longTerm) note = `${this.visaLabel}仍预留一次；${rule.note}`;
      }
      if (base.id === 'visa-extension') {
        quantity = extensions;
        total = this.extensionTotal;
        unitLabel = '按所选签证及学校续签方案';
        note = longTerm ? visaNote
          : extensions ? `按${this.visaLabel}预估，本次${extensions}次；${rule.note}`
            : `按${this.visaLabel}预估，本次无需续签。`;
      }
      if (longTerm && rule.waiveForLongTermVisa) {
        quantity = 0;
        total = 0;
        note = visaNote;
      }
      // A row zeroed for a long-term visa keeps its own line in the image, because its note asks the adviser to confirm.
      const waived = longTerm && note === visaNote;
      rows.push({ item: rule.name, unitLabel, quantity, total: total ?? cpilsMoney(rule.amount * quantity), note, ...(waived ? { waived: true } : {}) });
    }
    return rows;
  }
}

/** Pickup, room deposit and ID-Load stay outside the local-fee total; each follows its own 2027 date. */
function cpilsOptionalFeeItems(pricing: CpilsQuotePricing, students: readonly CpilsPageStudent[]): PhOptionalFeeItem[] {
  const count = students.length;
  return pricing.localFeeRules
    .filter(rule => rule.enabled && !rule.includeInTotal && rule.id !== 'crtv')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rule => {
      const dated = students.map(student => cpilsDatedFee(rule, student.quotePlan.startDate));
      const total = rule.multiplyByStudents ? dated.reduce((sum, item) => sum + item.amount, 0) : dated[0].amount;
      const perPerson = !rule.multiplyByStudents && count > 1;
      return {
        label: dated[0].name,
        amount: `${php(total)}${perPerson ? '／人' : ''}`,
        cnyAmount: `约人民币 ${quoteCurrencyText(Math.round(total / pricing.phpPerCny), 'zh-CN')} 元${perPerson ? '／人' : ''}`,
        note: `${dated[0].note}${rule.multiplyByStudents && count > 1 ? `（${count}人）` : ''}`,
      };
    });
}

export class CpilsQuote extends PhSchoolQuote<CpilsPageStudent> {
  constructor(pricing: CpilsQuotePricing) {
    super(pricing, {
      createStudent: () => new CpilsPageStudent(pricing),
      headingPrefix: 'CPILS',
      image: { schoolCode: 'CPILS', schoolName: 'CPILS', filePrefix: 'CPILS', heroSrc: CPILS_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => weeks / 4,
      optionalFeeItems: students => cpilsOptionalFeeItems(pricing, students),
      // The CIA quote image template (title card with consultant QR, 报价条件, per-student 小计).
      layoutVersion: 2,
    });
  }

  /** Exam gifts of every active student, labelled per student in a group quote. */
  get examBenefits(): string[] {
    return this.activeStudents.flatMap((student, index) =>
      student.examBenefits.map(note => this.quoteMode === 'group' ? `学生${index + 1}：${note}` : note));
  }

  private get examItem(): QuoteImagePaymentItem | undefined {
    const notes = this.examBenefits;
    return notes.length ? { icon: '赠', label: '官方考试赠送', amount: '按课程赠送', note: notes.join('；') } : undefined;
  }

  override get schoolPaymentItems(): PhSchoolPaymentItem[] {
    const items = super.schoolPaymentItems;
    const exam = this.examItem;
    return exam ? [...items, { ...exam, previewKind: 'section', previewId: 'quote-breakdown' }] : items;
  }

  override get quoteImageData(): QuoteImageCardData {
    const data = super.quoteImageData;
    const exam = this.examItem;
    const minors = this.activeStudents.flatMap((student, index) => student.selectedAgeGroup === 'minor'
      ? [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${MINOR_NOTE}`] : []);
    return {
      ...data,
      paymentItems: exam ? [...data.paymentItems, exam] : data.paymentItems,
      importantNotes: [...minors, ...(data.importantNotes ?? [])],
    };
  }
}

export class CpilsPlanComparison extends PhPlanComparison<CpilsPageStudent> {
  constructor(pricing: CpilsQuotePricing, conditions: () => CpilsPageStudent) {
    super(pricing, conditions, {
      createStudent: () => new CpilsPageStudent(pricing),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: 'CPILS 方案对比报价',
      courseGroups: CPILS_COMPARE_COURSE_GROUPS,
      layoutVersion: 2,
      extraNotes: results => results.some(result => result.courseId.includes('guarantee'))
        ? ['保分班为固定周数套餐，须一次注册对应周数。'] : [],
    });
  }
}
