// CELLA (Uni Sparta and Premium campuses) on the shared Philippine school quote and plan comparison.
// CELLA's own prices, offers, summer surcharge and local fees stay in CellaStudentQuote; this file only
// presents one student the way the template's PhSchoolQuote and PhPlanComparison read it. Each campus page
// quotes its own campus only. Keep it free of Angular, DOM and storage access (mini-program-ready).
import type { SchoolLocalFee, SchoolPaymentLine } from '../../../components/school-group-quote';
import type { SchoolQuotePlan } from '../../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { CiaQuoteCourse, CiaQuoteRoom } from '../cia-school/cia-quote-engine';
import { PhComparePricing, PhPlanComparison } from '../school-page/ph-plan-compare';
import { PhOptionalFeeItem, PhSchoolQuote } from '../school-page/ph-school-quote';
import type { PhExtraChoice, PhPageStudent } from '../school-page/ph-school-profile';
import {
  CELLA_2027_PROMOTION,
  CELLA_CAMPUS_NAMES,
  CELLA_COURSES,
  CELLA_FAMILY_REGISTRATION_FEE,
  CELLA_LOCAL_FEES_2027,
  CELLA_LOW_SEASON_END,
  CELLA_LOW_SEASON_START,
  CELLA_ROOMS,
  CELLA_SIDA_RATE,
  CellaCampus,
  CellaCourse,
  CellaPromotionMode,
  CellaRoom,
} from './cella-pricing';
import { CellaQuoteCatalog, CellaStudentQuote } from './cella-student-quote';

/** Everything the CELLA page quote reads; the page component is one. */
export interface CellaQuotePricing extends PhComparePricing {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  /**
   * Premium's family packages from the content document. They are quoted but kept out of courseFees, so the
   * course list and 方案对比 show only ordinary courses; undefined until the content document is applied.
   */
  familyPackageFees?: CiaQuoteCourse[];
}

/** 思达启航折扣 rule of the content document; switching it off in the editor leaves the school price. */
export const CELLA_SIDA_RULE_ID = 'cella-sida';

export const CELLA_QUOTE_IMAGE_HERO: Record<CellaCampus, string> = {
  uni: '/assets/cella-uni/campus-exterior.webp',
  premium: '/assets/cella-premium/pool.webp',
};

/** Courses a student usually weighs against each other, for the comparison's “同类课程” shortcut. */
export const CELLA_COMPARE_COURSE_GROUPS: Record<CellaCampus, ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>> = {
  uni: [
    { id: 'speaking', label: '口语强化', courseIds: ['uni-power-speaking-1', 'uni-power-speaking-2'] },
    { id: 'ielts', label: '雅思', courseIds: ['uni-ielts-pre', 'uni-ielts-intensive', 'uni-ielts-guarantee'] },
    { id: 'toeic', label: '托业', courseIds: ['uni-toeic-pre', 'uni-toeic-intensive'] },
  ],
  premium: [
    { id: 'speaking', label: '口语与轻松课程', courseIds: ['premium-light-esl', 'premium-power-speaking-1', 'premium-power-speaking-2'] },
    { id: 'business', label: '商务英语', courseIds: ['premium-business-preparation', 'premium-business-intensive'] },
    { id: 'career', label: '职业方向', courseIds: ['premium-ace', 'premium-working-holiday', 'premium-working-holiday-2'] },
  ],
};

/** Family packages are whole-family prices; ids of 2026 packages left in an older saved document count too. */
export const isCellaFamilyPackage = (courseId: string): boolean =>
  !!CELLA_COURSES.find(course => course.id === courseId)?.familyPackage || courseId.includes('-family-');

/** Multiple of the four-week price for a row of this many weeks (1/2/3 weeks: 40/65/85%). */
export const cellaPriceMultiplier = (weeks: number): number =>
  Math.floor(weeks / 4) + [0, 0.4, 0.65, 0.85][weeks % 4];

const VISA_OPTIONS = [
  { value: 'tourist59', label: '59天旅游签证' },
  { value: 'tourist30', label: '30天旅游签证' },
] as const;

const PROMOTION_OPTIONS: ReadonlyArray<{ value: CellaPromotionMode; label: string }> = [
  { value: 'standard', label: '不参加' },
  { value: 'social-6-plus-2', label: '6+2：读8周，按6周收费' },
  { value: 'social-9-plus-3', label: '9+3：读12周，按9周收费' },
];
const MINOR_OPTIONS = [
  { value: false, label: '不需要' },
  { value: true, label: '需要（25美元／周）' },
] as const;

/** One of CELLA's choices under 学生情况 (template: PhPageStudent.extraChoices). */
interface CellaExtraChoice<T> extends PhExtraChoice {
  readonly label: string;
  readonly options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
}

const round = (value: number) => Math.round(value * 100) / 100;
const date = (value: string) => value.replace(/-/g, '/');

/**
 * The CELLA catalog the student calculator reads, built from the page's (published) course and room prices.
 * Rebuilt only when the page replaces its price lists, so the quote form's option lists stay stable.
 */
class CellaCatalogView implements CellaQuoteCatalog {
  private courseSource?: readonly CiaQuoteCourse[];
  private familySource?: readonly CiaQuoteCourse[];
  private roomSource?: readonly CiaQuoteRoom[];
  private courseCache: CellaCourse[] = [];
  private roomCache: CellaRoom[] = [];

  constructor(private readonly pricing: CellaQuotePricing, private readonly campus: CellaCampus) {}

  get courses(): CellaCourse[] {
    // The page builds its quote before its price lists; until then the compiled catalog gives the first selections.
    if (!this.pricing.courseFees) return CELLA_COURSES.filter(course => course.campus === this.campus);
    const families = this.pricing.familyPackageFees;
    if (this.courseSource !== this.pricing.courseFees || this.familySource !== families) {
      this.courseSource = this.pricing.courseFees;
      this.familySource = families;
      const fallback = CELLA_COURSES.find(course => course.campus === this.campus && !course.familyPackage)!;
      const course = (item: CiaQuoteCourse, base: CellaCourse): CellaCourse => ({
        ...base,
        id: item.id,
        campus: this.campus,
        name: item.name,
        tuition: item.tuition2027 || item.tuition,
        lessons: item.schedule,
        note: item.note,
      });
      // A family package needs its compiled table entry; an obsolete saved one is left out.
      const familyCourses = families
        ? families.flatMap(item => {
          const base = CELLA_COURSES.find(entry => entry.id === item.id && entry.familyPackage);
          return base ? [course(item, base)] : [];
        })
        : CELLA_COURSES.filter(entry => entry.campus === this.campus && entry.familyPackage);
      this.courseCache = [
        ...this.pricing.courseFees.filter(item => !isCellaFamilyPackage(item.id))
          .map(item => course(item, CELLA_COURSES.find(entry => entry.id === item.id) ?? fallback)),
        ...familyCourses,
      ];
    }
    return this.courseCache;
  }

  get rooms(): CellaRoom[] {
    if (!this.pricing.roomFees) return CELLA_ROOMS.filter(room => room.campus === this.campus);
    if (this.roomSource !== this.pricing.roomFees) {
      this.roomSource = this.pricing.roomFees;
      const fallback = CELLA_ROOMS.find(room => room.campus === this.campus)!;
      this.roomCache = this.pricing.roomFees.map(item => ({
        ...(CELLA_ROOMS.find(room => room.id === item.id) ?? fallback),
        id: item.id,
        campus: this.campus,
        name: item.name,
        fee: item.fee,
        note: item.note,
      }));
    }
    return this.roomCache;
  }

  get localFeeRules() { return this.pricing.localFeeRules; }
  get registrationFee() { return this.pricing.registrationFee; }
  get peakSeasonWeeklyFee() { return this.pricing.seasonalFeePerWeek; }
  get peakSeasonRanges() { return this.pricing.peakSeasonRanges.filter(range => range.enabled !== false); }
  get sidaRate() {
    const rule = this.pricing.promotions?.find(item => item.id === CELLA_SIDA_RULE_ID);
    if (!rule) return CELLA_SIDA_RATE;
    return rule.enabled ? Math.max(0, 1 - rule.discountValue / 100) : 1;
  }
}

/** One CELLA student as the template binds it: conditions, CELLA's own choices and every amount. */
export class CellaPageStudent implements PhPageStudent {
  readonly visaOptions = VISA_OPTIONS;
  readonly quote: CellaStudentQuote;
  private returning = false;
  private ageGroup: 'adult' | 'minor' = 'adult';
  /** CELLA's 6+2／9+3 offer and the minor management fee, shown under 学生情况. */
  readonly extraChoices: readonly PhExtraChoice[];

  constructor(private readonly catalog: CellaQuoteCatalog, readonly campus: CellaCampus) {
    this.quote = new CellaStudentQuote(catalog, campus);
    const student = this;
    const promotion: CellaExtraChoice<CellaPromotionMode> = {
      label: '分享活动（四人间新学员）',
      options: PROMOTION_OPTIONS,
      inComparison: false,
      get visible() { return !student.returningStudent && !student.quote.isFamilyPackage; },
      get note() {
        return student.quote.promotionMode === 'standard' ? ''
          : '须在入学第一个月发4篇小红书和抖音内容，先经CELLA中文经理审核；只可与思达启航9折和圣诞优惠同享，未完成学校可追回优惠。';
      },
      get value() { return student.quote.promotionMode; },
      set value(mode: CellaPromotionMode) { student.quote.selectPromotion(mode); },
    };
    const minor: CellaExtraChoice<boolean> = {
      label: '未成年人管理费',
      options: MINOR_OPTIONS,
      get visible() { return student.ageGroup === 'minor' && !student.quote.isFamilyPackage; },
      note: '',
      get value() { return student.quote.minorManagementSelected; },
      set value(selected: boolean) { student.quote.minorManagementSelected = selected; },
    };
    this.extraChoices = [promotion, minor];
  }

  get quotePlan(): SchoolQuotePlan { return this.quote.quotePlan; }

  /** A course change may pick or leave a family package, which brings its own family room (template hook). */
  planOptionChanged(): void { this.quote.syncFamilyRoom(); }
  /** CELLA's course-length rules (IELTS Guarantee 8 or 12 weeks, TESOL 4) come through quoteError. */
  readonly courseLengthError = '';

  // ---- conditions -------------------------------------------------------------------------------

  get visaType(): string { return this.quote.initialVisaDays === 30 ? 'tourist30' : 'tourist59'; }
  set visaType(value: string) { this.quote.initialVisaDays = value === 'tourist30' ? 30 : 59; }
  get visaLabel(): string { return VISA_OPTIONS.find(option => option.value === this.visaType)?.label ?? ''; }

  /** The minor management fee applies only to students under 18; switching back to adult clears it. */
  get selectedAgeGroup(): 'adult' | 'minor' { return this.ageGroup; }
  set selectedAgeGroup(value: 'adult' | 'minor') {
    this.ageGroup = value;
    if (value === 'adult') this.quote.minorManagementSelected = false;
  }

  get minorNote(): string {
    return '未成年学生的入学年龄、课程和监护安排须由顾问向学校确认；不和家长同住的未成年学生可选未成年人管理费（25美元／周）。';
  }

  /** Returning students waive registration; CELLA's 6+2／9+3 offer is for first-time students only. */
  get returningStudent(): boolean { return this.returning; }
  set returningStudent(value: boolean) {
    this.returning = value;
    this.quote.enrollmentStatus = value ? 'extension' : 'new';
    if (value && this.quote.promotionMode !== 'standard') this.quote.selectPromotion('standard');
  }

  // ---- checks -----------------------------------------------------------------------------------

  minimumWeeks(courseId: string): number {
    const allowed = this.catalog.courses.find(course => course.id === courseId)?.allowedWeeks;
    return allowed?.length ? Math.min(...allowed) : 0;
  }

  get quoteError(): string {
    const quote = this.quote;
    if (quote.isSocialPromotion && quote.quotePlan.courseWeeks !== quote.actualWeeks) {
      return `${quote.promotionMode === 'social-6-plus-2' ? '6+2' : '9+3'}活动须就读${quote.actualWeeks}周，请把周数改回${quote.actualWeeks}周或选择不参加活动。`;
    }
    return quote.error;
  }

  // ---- school payment ---------------------------------------------------------------------------

  get registration(): number { return this.returningStudent || this.quote.isFamilyPackage ? 0 : this.catalog.registrationFee; }
  /** The family package price already holds the 500-dollar family registration (school answer 2026-11-21). */
  get registrationNote(): string | undefined {
    return this.quote.isFamilyPackage ? '家庭套餐整包价已含注册费（每户500美元）' : undefined;
  }
  get tuition(): number { return this.quote.coursePriceBeforePromotions; }
  get accommodation(): number { return this.quote.roomPriceBeforePromotions; }
  get peakWeeks(): number { return this.quote.peakSeasonWeeks; }
  get seasonalSurcharge(): number { return this.quote.peakSeasonSurcharge; }

  get quoteUsd(): number {
    if (this.quote.isFamilyPackage) return this.quote.schoolTotal;
    return Math.max(0, round(this.quote.schoolTotal - (this.returningStudent ? this.catalog.registrationFee : 0)));
  }

  private get discounts(): Array<{ label: string; key: string; amount: number; note: string }> {
    const quote = this.quote;
    const weeks = quote.actualWeeks;
    const social = quote.promotionMode === 'social-6-plus-2' ? '6+2' : '9+3';
    return [
      {
        label: `${social}限时活动`, key: `cella-${quote.promotionMode}`, amount: quote.socialPromotionDiscount,
        note: `${quote.paidWeeks}周课程和四人间收费，赠送${quote.giftWeeks}周；到校学杂费按实际${weeks}周收取。须完成社交媒体分享，只可与思达启航9折和圣诞优惠同享。`,
      },
      {
        label: '淡季优惠', key: 'cella-low-season', amount: quote.lowSeasonDiscount,
        note: `${date(CELLA_LOW_SEASON_START)}–${date(CELLA_LOW_SEASON_END)}期间每个完整4周优惠100美元，本次${quote.lowSeasonBlocks}个4周；课程与住宿不重复扣减。`,
      },
      {
        label: 'Premium六人间特价', key: 'cella-premium-six-person', amount: quote.premiumSixPersonDiscount,
        note: `${date(CELLA_LOW_SEASON_START)}–${date(CELLA_LOW_SEASON_END)}期间六人间按499美元／4周计算；不再叠加淡季100美元优惠。`,
      },
      {
        label: '长期报名优惠', key: 'cella-long-stay', amount: quote.longStayDiscount,
        note: `${weeks}周全程在${date(CELLA_LOW_SEASON_END)}前结束；8／12／16周分别优惠50／100／150美元。`,
      },
      {
        label: '2027淡季优惠', key: 'cella-low-season-2027', amount: quote.lowSeason2027Discount,
        note: `双人、三人、四人间每周优惠${CELLA_2027_PROMOTION.lowSeasonPerWeek}美元，本次${quote.lowSeason2027Weeks}周；2027/05/30–08/28暑期周除外。`,
      },
      {
        label: 'Premium六人间七五折', key: 'cella-premium-six-person-2027', amount: quote.premiumSixPerson2027Discount,
        note: `就读${weeks}周，六人间住宿周的课程费和住宿费七五折；暑期周除外，不与2027长期优惠同用。`,
      },
      {
        label: '2027长期优惠', key: 'cella-long-stay-2027', amount: quote.longStay2027Discount,
        note: `2027年入学、就读${weeks}周；12／16／20／24周分别优惠100／150／200／250美元。`,
      },
      {
        label: '思达启航折扣', key: CELLA_SIDA_RULE_ID, amount: quote.sidaDiscount,
        note: quote.isFamilyPackage
          ? `家庭套餐整包价扣除已含的${CELLA_FAMILY_REGISTRATION_FEE}美元注册费后打${Math.round((this.catalog.sidaRate ?? CELLA_SIDA_RATE) * 100) / 10}折。`
          : `课程费和住宿费在学校优惠后再打${Math.round((this.catalog.sidaRate ?? CELLA_SIDA_RATE) * 100) / 10}折；注册费、暑期附加费不打折。`,
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
      ...(quote.peakSeasonSurcharge ? [{
        icon: '旺', label: '暑期附加费', value: quote.peakSeasonSurcharge,
        note: `${quote.peakSeasonNote}；同一周课程与住宿只计一次，不参与优惠。`,
      }] : []),
      ...(quote.minorManagementFee ? [{
        icon: '监', label: '未成年人管理费', value: quote.minorManagementFee,
        note: `25美元／周，本次按${quote.actualWeeks}周计算。`,
      }] : []),
      ...this.discounts.map(item => ({ icon: '惠', label: item.label, value: -item.amount, note: item.note, promotionKey: item.key })),
    ];
  }

  // ---- local fees -------------------------------------------------------------------------------

  get localFees(): SchoolLocalFee[] {
    return this.quote.localFees.map(fee => ({
      item: fee.item,
      unitLabel: fee.unit,
      quantity: Number.parseFloat(fee.quantity) || 0,
      total: fee.total,
      note: fee.note,
    }));
  }
}

/** Laundry, pickup and the refundable room deposit: references outside the local-fee total. */
function cellaOptionalFees(students: readonly CellaPageStudent[], quote: PhSchoolQuote<CellaPageStudent>, phpPerCny: number): PhOptionalFeeItem[] {
  const cny = (php: number) => quoteCurrencyText(Math.round(php / phpPerCny), 'zh-CN');
  const fees = CELLA_LOCAL_FEES_2027;
  const regular = students.filter(student => !student.quote.isFamilyPackage);
  if (!regular.length) {
    return [{
      label: '房间押金（可退参考）',
      amount: '以学校通知为准',
      cnyAmount: '',
      note: '家庭套餐已含接机和洗衣；可退押金是否另收、金额多少，以学校通知为准。',
    }];
  }
  const deposits = [...new Set(regular.map(student => student.quote.depositAmount ?? 0))].sort((a, b) => a - b);
  const charged = deposits.filter(value => value > 0);
  const group = regular.length > 1;
  return [
    {
      label: '洗衣服务（价格参考）',
      amount: '最低100比索（50比索／公斤）',
      cnyAmount: `最低约人民币${cny(100)}元`,
      note: '最少2公斤；自愿使用，按实际重量和学校现场标准结算，不计入学杂费合计。',
    },
    {
      label: '宿务麦克坦机场接机（价格参考）',
      amount: `周末${quote.formatPhp(fees.pickupWeekend)}／工作日${quote.formatPhp(fees.pickupWeekday)}`,
      cnyAmount: `约人民币${cny(fees.pickupWeekend)}／${cny(fees.pickupWeekday)}元`,
      note: group
        ? `家庭最多4人同车：周末${quote.formatPhp(fees.pickupFamilyWeekend)}／工作日${quote.formatPhp(fees.pickupFamilyWeekday)}；多人接机按车辆安排确认，不按人数相加。`
        : '可选，也可自行前往；不计入学杂费合计。',
    },
    {
      label: '房间押金（可退参考）',
      amount: charged.length ? deposits.map(value => value ? quote.formatPhp(value) : '免收').join('／') : '免收',
      cnyAmount: charged.length ? `约人民币 ${charged.map(cny).join('／')} 元` : '',
      note: '1–3周2,000比索，4–8周5,000比索，9–12周8,000比索，13周以上10,000比索；STACIA校外宿舍2027年起免押金。退房检查后退还，共住房间不按人数相加。',
    },
  ];
}

export class CellaQuote extends PhSchoolQuote<CellaPageStudent> {
  constructor(pricing: CellaQuotePricing, campus: CellaCampus) {
    const catalog = new CellaCatalogView(pricing, campus);
    super(pricing, {
      createStudent: () => new CellaPageStudent(catalog, campus),
      headingPrefix: campus === 'uni' ? 'CELLA Uni' : 'CELLA Premium',
      image: {
        schoolCode: 'CELLA',
        schoolName: `菲律宾宿务${CELLA_CAMPUS_NAMES[campus]}`,
        filePrefix: campus === 'uni' ? 'CELLA-Uni-Sparta' : 'CELLA-Premium',
        heroSrc: CELLA_QUOTE_IMAGE_HERO[campus],
      },
      priceMultiplier: cellaPriceMultiplier,
      optionalFeeItems: (students, quote) => cellaOptionalFees(students, quote, pricing.phpPerCny),
      layoutVersion: 2,
    });
  }
}

export class CellaPlanComparison extends PhPlanComparison<CellaPageStudent> {
  constructor(pricing: CellaQuotePricing, campus: CellaCampus, conditions: () => CellaPageStudent) {
    const catalog = new CellaCatalogView(pricing, campus);
    super(pricing, conditions, {
      createStudent: () => new CellaPageStudent(catalog, campus),
      copyConditions: (from, to) => {
        to.visaType = from.visaType;
        to.selectedAgeGroup = from.selectedAgeGroup;
        to.returningStudent = from.returningStudent;
        to.quote.minorManagementSelected = from.quote.minorManagementSelected;
      },
      heading: `${campus === 'uni' ? 'CELLA Uni' : 'CELLA Premium'} 方案对比报价`,
      courseGroups: CELLA_COMPARE_COURSE_GROUPS[campus],
      layoutVersion: 2,
    });
  }
}
