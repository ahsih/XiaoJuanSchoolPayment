// I.BREEZE on the shared Philippine school quote and plan comparison. I.BREEZE's own prices (by registration
// date), November and Christmas offers, the 思达启航 5%, summer surcharge, minor fee and local fees stay in
// IbreezeStudentQuote; this file only presents one student the way the template's PhSchoolQuote and
// PhPlanComparison read it. Keep it free of Angular, DOM and storage access (mini-program-ready).
import { SCHOOL_VISA_OPTIONS, SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import { IBREEZE_COURSES, IBREEZE_ROOMS } from './ibreeze-catalog';
import { IbreezeQuotePrices, IbreezeStudentQuote, IbreezeVisaType } from './ibreeze-student-quote';

/** Everything the I.BREEZE page quote reads; the page component is one. */
export interface IbreezeQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  /** The applied content document (published revision or defaults): 2027 prices, short-stay tables, offers. */
  readonly ibreezeContent: CiaContentConfig;
}

export const IBREEZE_QUOTE_IMAGE_HERO = '/assets/ibreeze/campus/prime-campus.webp';

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const IBREEZE_COMPARE_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL课程', courseIds: ['intensive-speaking', 'light-esl', 'power-esl', 'intensive-beginner'] },
  { id: 'exam', label: '考试课程', courseIds: ['ielts-starter', 'ielts-target', 'toeic-target'] },
] as const;

/** 2027 summer: the off-campus condo takes only family students (IbreezeStudentQuote.quoteError). */
const CONDO_FAMILY_SUMMER = { start: '2027-06-27', end: '2027-08-14' };

type MinorBand = '16-17' | 'under-16';

const AGE_BAND_OPTIONS: ReadonlyArray<{ value: MinorBand; label: string }> = [
  { value: '16-17', label: '16–17岁' },
  { value: 'under-16', label: '5–15岁' },
];
const GUARDIAN_OPTIONS = [
  { value: false, label: '有父母陪同' },
  { value: true, label: '单独就读（监护管理费100美元／4周）' },
] as const;
const FAMILY_OPTIONS = [
  { value: false, label: '否' },
  { value: true, label: '是，家庭同行' },
] as const;

/** One of I.BREEZE's choices under 学生情况 (template: PhPageStudent.extraChoices). */
interface IbreezeExtraChoice<T> extends PhExtraChoice {
  readonly label: string;
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const round = (value: number) => Math.round(value * 100) / 100;
const toTemplateVisa = (value: IbreezeVisaType): string => value === 30 ? 'tourist30' : value === 59 ? 'tourist59' : value;
const fromTemplateVisa = (value: string): IbreezeVisaType =>
  value === 'tourist59' ? 59 : value === 'student' || value === 'work' || value === 'srrv' || value === 'sirv' ? value : 30;

/**
 * The prices the student calculator reads, from the page's (published) course and room lists. The option lists
 * are rebuilt only when the page replaces its price lists, so the quote form's selects stay stable.
 */
class IbreezePricesView implements IbreezeQuotePrices {
  private courseSource?: readonly CiaQuoteCourse[];
  private roomSource?: readonly CiaQuoteRoom[];
  private courseCache: typeof IBREEZE_COURSES = [];
  private roomCache: typeof IBREEZE_ROOMS = [];

  constructor(private readonly pricing: IbreezeQuotePricing) {}

  get courseOptions(): typeof IBREEZE_COURSES {
    // The page builds its quote before its price lists; until then the compiled catalog gives the first selections.
    if (!this.pricing.courseFees) return IBREEZE_COURSES;
    if (this.courseSource !== this.pricing.courseFees) {
      this.courseSource = this.pricing.courseFees;
      this.courseCache = this.pricing.courseFees.map(item => ({
        id: item.id, name: item.name, tuition: item.tuition, lessons: item.schedule, suitable: item.suitable, note: item.note,
      }));
    }
    return this.courseCache;
  }

  get roomOptions(): typeof IBREEZE_ROOMS {
    if (!this.pricing.roomFees) return IBREEZE_ROOMS;
    if (this.roomSource !== this.pricing.roomFees) {
      this.roomSource = this.pricing.roomFees;
      this.roomCache = this.pricing.roomFees.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
    }
    return this.roomCache;
  }

  get registrationFee() { return this.pricing.registrationFee ?? 150; }
  get seasonalFeePerWeek() { return this.pricing.seasonalFeePerWeek ?? 40; }
  get usdToCny() { return this.pricing.usdToCny; }
  get phpPerCny() { return this.pricing.phpPerCny; }
  get exchangeRateDate() { return this.pricing.exchangeRateDate; }
  get exchangeRateLive() { return this.pricing.usingLiveExchangeRates; }
  readonly contentConfig = () => this.pricing.ibreezeContent;
}

/** One I.BREEZE student as the template binds it: conditions, I.BREEZE's own choices and every amount. */
export class IbreezePageStudent implements PhPageStudent {
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly quote: IbreezeStudentQuote;
  /** Remembered while the student is an adult, so switching back to minor keeps the chosen age band. */
  private minorBand: MinorBand = '16-17';
  /** The minor's age band, the minor fee and summer family travel, shown under 学生情况. */
  readonly extraChoices: readonly PhExtraChoice[];
  /** I.BREEZE's course-length rules (IELTS Starter 3–8 weeks, IELTS Target 4+, Business 4 at most) come through quoteError. */
  readonly courseLengthError = '';

  constructor(prices: IbreezeQuotePrices) {
    this.quote = new IbreezeStudentQuote(prices);
    const student = this;
    const ageBand: IbreezeExtraChoice<MinorBand> = {
      label: '抵达时年龄',
      options: AGE_BAND_OPTIONS,
      get visible() { return student.quote.isMinor; },
      get note() {
        return student.minorBand === 'under-16'
          ? '未满16岁须读青少年英语课程，可与家长同行，家长选成人课程。'
          : '16–17岁可选其他课程，课程费按青少年英语计算。';
      },
      get value() { return student.minorBand; },
      set value(band: MinorBand) {
        student.minorBand = band;
        if (student.quote.isMinor) student.quote.selectedAgeGroup = band;
      },
    };
    const guardian: IbreezeExtraChoice<boolean> = {
      label: '父母是否陪同',
      options: GUARDIAN_OPTIONS,
      get visible() { return student.quote.isMinor; },
      get note() { return student.quote.minorWithoutParent ? '监护管理费含免费机场接送和每4周一次跳岛游。' : ''; },
      get value() { return student.quote.minorWithoutParent; },
      set value(selected: boolean) { student.quote.minorWithoutParent = selected; },
    };
    const family: IbreezeExtraChoice<boolean> = {
      label: '是否家庭同行',
      options: FAMILY_OPTIONS,
      get visible() {
        return student.quote.familyTravel || student.quotePlan.overlapWeeks(CONDO_FAMILY_SUMMER.start, CONDO_FAMILY_SUMMER.end,
          student.quotePlan.rooms.filter(row => row.optionId.startsWith('off-campus-'))) > 0;
      },
      get note() { return '2027/06/27–08/14暑期，校外公寓只接受家庭学生。'; },
      get value() { return student.quote.familyTravel; },
      set value(selected: boolean) { student.quote.familyTravel = selected; },
    };
    this.extraChoices = [ageBand, guardian, family];
  }

  get quotePlan(): SchoolQuotePlan { return this.quote.quotePlan; }

  // ---- conditions -------------------------------------------------------------------------------

  get visaType(): string { return toTemplateVisa(this.quote.visaType); }
  set visaType(value: string) { this.quote.visaType = fromTemplateVisa(value); }
  get visaLabel(): string { return this.quote.visaLabel; }

  get selectedAgeGroup(): 'adult' | 'minor' { return this.quote.isMinor ? 'minor' : 'adult'; }
  set selectedAgeGroup(value: 'adult' | 'minor') {
    this.quote.selectedAgeGroup = value === 'adult' ? 'adult' : this.minorBand;
  }
  /** For 方案对比: copies the age band with the age group. */
  get ageBand(): MinorBand { return this.minorBand; }
  set ageBand(value: MinorBand) {
    this.minorBand = value;
    if (this.quote.isMinor) this.quote.selectedAgeGroup = value;
  }

  get minorNote(): string {
    return '未满18岁（国际年龄）按青少年英语课程收费；没有父母陪同的未成年学生另收监护管理费100美元／4周。';
  }

  /** I.BREEZE's prices depend on the registration date (2027 prices from 2027/01/01) and its offers on both dates. */
  get selectedRegistrationDate(): string { return this.quote.selectedRegistrationDate; }
  set selectedRegistrationDate(value: string) { this.quote.selectedRegistrationDate = value; }

  get returningStudent(): boolean { return this.quote.returningStudent; }
  set returningStudent(value: boolean) { this.quote.returningStudent = value; }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number { return this.quote.minimumWeeks(courseId); }
  get quoteError(): string { return this.quote.quoteError; }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number { return this.quote.registrationAmount; }
  get tuition(): number { return this.quote.tuitionForSelectedWeeks; }
  get accommodation(): number { return this.quote.roomFeeForSelectedWeeks; }
  get peakWeeks(): number { return this.quote.peakSeasonWeeks; }
  get seasonalSurcharge(): number { return this.quote.seasonalSurcharge; }
  get quoteUsd(): number { return this.quote.quoteUsd; }

  private get discounts(): Array<{ label: string; key: string; amount: number; note: string }> {
    const quote = this.quote;
    const percent = Math.round((1 - quote.sidaDiscountRate) * 100);
    return [
      { label: '11月住宿优惠', key: quote.eligibleNovemberRuleIds[0] ?? 'november-twin', amount: quote.novemberPromotionDiscount, note: quote.novemberQuoteNote },
      { label: '圣诞特别优惠', key: 'christmas-2026', amount: quote.christmasPromotionDiscount, note: quote.christmasPromotionText },
      { label: '9月住宿优惠', key: 'september-twin', amount: quote.septemberPromotionDiscount, note: quote.septemberPromotionText },
      {
        label: '思达启航折扣', key: 'sida-discount', amount: quote.sidaDiscountAmount,
        note: `官方课程费和住宿费合计优惠${percent}%；注册费、暑期附加费、监护管理费和到校学杂费不参与。`,
      },
    ].filter(item => item.amount > 0);
  }

  get promotionDiscountTotal(): number {
    return round(this.discounts.reduce((sum, item) => sum + item.amount, 0));
  }

  get discountNames(): string { return this.discounts.map(item => item.label).join('、'); }

  get paymentLines(): SchoolPaymentLine[] {
    const quote = this.quote;
    return [
      ...(quote.seasonalSurcharge ? [{
        icon: '旺', label: '暑期附加费', value: quote.seasonalSurcharge,
        note: `${quote.formatUsd(quote.seasonalFeePerWeek)}美元／周，本次${quote.peakSeasonWeeks}周；同一周课程与住宿只计一次，不参与优惠。`,
      }] : []),
      ...(quote.minorManagementFee ? [{
        icon: '监', label: '监护管理费', value: quote.minorManagementFee,
        note: `100美元／4周；${quote.guardianNote}`,
      }] : []),
      ...this.discounts.map(item => ({ icon: '惠', label: item.label, value: -item.amount, note: item.note, promotionKey: item.key })),
    ];
  }

  // ---- local fees -------------------------------------------------------------------------------

  get localFees(): SchoolLocalFee[] {
    return this.quote.localFees.map(fee => ({
      item: fee.item,
      unitLabel: fee.amount,
      quantity: fee.quantity,
      total: fee.total,
      note: fee.note,
      ...(fee.waived ? { waived: true } : {}),
    }));
  }
}

/** Airport pickup and the refundable room deposit: references outside the local-fee total. */
function ibreezeOptionalFees(students: readonly IbreezePageStudent[], quote: PhSchoolQuote<IbreezePageStudent>, pricing: IbreezeQuotePricing): PhOptionalFeeItem[] {
  const settings = pricing.ibreezeContent.quoteSettings;
  const sunday = settings.airportPickupSundayUsd ?? 30;
  const saturday = settings.airportPickupSaturdayUsd ?? 50;
  const usdCny = (usd: number) => quoteCurrencyText(Math.round(usd * pricing.usdToCny), 'zh-CN');
  const phpCny = (php: number) => quoteCurrencyText(Math.round(php / pricing.phpPerCny), 'zh-CN');
  const withGuardian = students.filter(student => student.quote.guardianRequired).length;
  const allIncluded = students.length > 0 && withGuardian === students.length;
  const deposits = [...new Set(students.map(student => student.quote.depositAmount))].sort((a, b) => a - b);
  return [
    {
      label: '宿务麦克坦机场接机（价格参考）',
      amount: allIncluded ? '已含' : `周日${quote.formatUsd(sunday)}美元／周六${quote.formatUsd(saturday)}美元`,
      cnyAmount: allIncluded ? '' : `约人民币 ${usdCny(sunday)}／${usdCny(saturday)} 元`,
      note: allIncluded
        ? '已含在监护管理费中，不重复收费。'
        : `可选，也可自行前往；不计入学杂费合计${withGuardian ? '；单独就读的未成年学生已含在监护管理费中' : ''}${students.length > 1 ? '；多人同行按车辆安排确认，不按人数相加' : ''}。`,
    },
    {
      label: '房间押金（可退参考）',
      amount: deposits.map(value => quote.formatPhp(value)).join('／'),
      cnyAmount: `约人民币 ${deposits.map(phpCny).join('／')} 元`,
      note: '住宿不足8周3,000比索，8周及以上5,000比索；退房检查无损坏、无欠费后退还，共住房间不按人数相加。',
    },
  ];
}

export class IbreezeQuote extends PhSchoolQuote<IbreezePageStudent> {
  constructor(pricing: IbreezeQuotePricing) {
    const prices = new IbreezePricesView(pricing);
    super(pricing, {
      createStudent: () => new IbreezePageStudent(prices),
      headingPrefix: 'I.BREEZE',
      image: {
        schoolCode: 'IBREEZE',
        schoolName: '菲律宾宿务I.BREEZE语言学校',
        filePrefix: 'I-BREEZE',
        heroSrc: IBREEZE_QUOTE_IMAGE_HERO,
      },
      // Short stays use the school's exact tables, so no ratio note is printed (shortStayNotes returns none).
      priceMultiplier: weeks => weeks / 4,
      optionalFeeItems: (students, quote) => ibreezeOptionalFees(students, quote, pricing),
      layoutVersion: 2,
    });
  }
}

export class IbreezePlanComparison extends PhPlanComparison<IbreezePageStudent> {
  constructor(pricing: IbreezeQuotePricing, conditions: () => IbreezePageStudent) {
    const prices = new IbreezePricesView(pricing);
    super(pricing, conditions, {
      createStudent: () => new IbreezePageStudent(prices),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.ageBand = from.ageBand;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.quote.minorWithoutParent = from.quote.minorWithoutParent;
        to.quote.familyTravel = from.quote.familyTravel;
        to.returningStudent = from.returningStudent;
        to.selectedRegistrationDate = from.selectedRegistrationDate;
      },
      heading: 'I.BREEZE 方案对比报价',
      courseGroups: IBREEZE_COMPARE_COURSE_GROUPS,
      layoutVersion: 2,
    });
  }
}
