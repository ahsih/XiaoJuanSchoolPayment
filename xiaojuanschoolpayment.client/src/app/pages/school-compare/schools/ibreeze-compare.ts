// I.BREEZE (Cebu) as a cross-school comparison entry. The school's own per-student calculator
// (IbreezeStudentQuote, the one its page and quote image use) prices every plan; this adapter only
// hands it one course row, one room row and the shared conditions, and reads the results back.
// Prices start from the same content defaults as the page, and a published revision is applied the
// same way the page's applyContentConfig applies it.
// Keep this file free of Angular, DOM and storage access.
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { cloneIbreezeContentConfig, createDefaultIbreezeContentConfig } from '../../philippines/ibreeze-school/ibreeze-content-config';
import { IbreezeStudentQuote, type IbreezeQuotePrices } from '../../philippines/ibreeze-school/ibreeze-student-quote';
import {
  compareRoomFacts,
  type CompareConditions,
  type CompareCourseOption,
  type CompareCurrency,
  type CompareGoal,
  type CompareRoomOption,
  type CompareSchool,
  type CompareSchoolPlan,
  type CompareSchoolResult,
  type CompareSchoolSource,
} from '../school-compare';

const TAG = 'I.BREEZE';
const SCHOOL_CODE = 'IBREEZE';

/** The prices object the calculator reads; the page component plays this role on the website. */
interface IbreezeComparePricing extends IbreezeQuotePrices {
  content: CiaContentConfig;
}

/** Course ids per goal, best match first. I.BREEZE has no guarantee course; IELTS Target is the closest. */
const GOALS: Partial<Record<CompareGoal, { ids: readonly string[]; closest?: boolean }>> = {
  // Light ESL is the school's own “综合英语” course; Power ESL is the heavier ESL option.
  general: { ids: ['light-esl', 'power-esl', 'intensive-beginner'] },
  speaking: { ids: ['intensive-speaking', 'power-esl'] },
  ielts: { ids: ['ielts-target', 'ielts-starter'] },
  'ielts-guarantee': { ids: ['ielts-target'], closest: true },
  toeic: { ids: ['toeic-target'] },
  business: { ids: ['general-business-and-bec'] },
};

const isIbreezeContent = (value: unknown): value is CiaContentConfig => {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && typeof content === 'object' && content.schemaVersion === 1 && content.schoolCode === SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && Array.isArray(content.quoteSettings.peakSeasonRanges) && !!content.quoteImageSettings;
};

/** Same steps as IbreezeSchoolComponent.applyContentConfig: enabled items in sort order, room label first. */
function applyContent(pricing: IbreezeComparePricing, value: CiaContentConfig): void {
  const content = cloneIbreezeContentConfig(value);
  pricing.content = content;
  pricing.courseOptions = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
    id: item.id, name: item.name, tuition: item.tuition, lessons: item.schedule, suitable: item.suitable || item.note,
  }));
  pricing.roomOptions = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map(item => ({
    id: item.id, name: item.label || item.name, fee: item.fee, note: item.note,
  }));
  pricing.registrationFee = content.quoteSettings.registrationFee;
  pricing.seasonalFeePerWeek = content.quoteSettings.peakSeasonFeePerWeek;
}

function createPricing(): IbreezeComparePricing {
  const pricing: IbreezeComparePricing = {
    content: createDefaultIbreezeContentConfig(),
    courseOptions: [],
    roomOptions: [],
    registrationFee: 0,
    seasonalFeePerWeek: 0,
    // Renminbi texts are not read here; the comparison converts with its own rates.
    usdToCny: Number.NaN,
    phpPerCny: Number.NaN,
    exchangeRateDate: '',
    exchangeRateLive: false,
    contentConfig: () => pricing.content,
  };
  applyContent(pricing, createDefaultIbreezeContentConfig());
  return pricing;
}

class IbreezeCompareSchool implements CompareSchool {
  readonly id = 'ibreeze';
  readonly tag = TAG;
  readonly name = '菲律宾宿务 I.BREEZE 语言学校';
  readonly country = '菲律宾';
  readonly city = '宿务';
  readonly location = '宿务市区 Mabolo';
  readonly pagePath = '/philippines-study/cebu/ibreeze';
  readonly schoolCurrency: CompareCurrency = 'USD';
  readonly localCurrency: CompareCurrency = 'PHP';
  private courseCache?: { source: IbreezeQuotePrices['courseOptions']; list: CompareCourseOption[] };
  private roomCache?: { source: IbreezeQuotePrices['roomOptions']; list: CompareRoomOption[] };

  constructor(private readonly pricing: IbreezeComparePricing) {}

  get courses(): CompareCourseOption[] {
    const source = this.pricing.courseOptions;
    if (this.courseCache?.source !== source) {
      this.courseCache = { source, list: source.map(course => ({ id: course.id, name: course.name, schedule: course.lessons })) };
    }
    return this.courseCache.list;
  }

  get rooms(): CompareRoomOption[] {
    const source = this.pricing.roomOptions;
    if (this.roomCache?.source !== source) {
      const content = this.pricing.content;
      this.roomCache = {
        source,
        list: source.map(room => {
          const facts = compareRoomFacts(room.name);
          const offCampus = facts.offCampus || content.rooms.find(item => item.id === room.id)?.location === '校外';
          return { id: room.id, name: room.name, fee: room.fee, ...facts, offCampus };
        }),
      };
    }
    return this.roomCache.list;
  }

  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean } {
    const entry = GOALS[goal];
    return { ids: [...(entry?.ids ?? [])], ...(entry?.closest ? { closest: true } : {}) };
  }

  /** No guarantee course; short stays that the price list does not cover show the calculator's own error. */
  minimumWeeks(): number { return 0; }

  createPlan(courseId: string, roomId: string): CompareSchoolPlan {
    return new IbreezeComparePlan(this.pricing, courseId, roomId);
  }
}

class IbreezeComparePlan implements CompareSchoolPlan {
  private readonly student: IbreezeStudentQuote;
  private rowsKey = '';

  constructor(private readonly pricing: IbreezeComparePricing, public courseId: string, public roomId: string) {
    this.student = new IbreezeStudentQuote(pricing);
  }

  result(conditions: CompareConditions): CompareSchoolResult {
    const { weeks, startDate } = conditions;
    const student = this.student;
    const plan = student.quotePlan;
    const key = [this.courseId, this.roomId, weeks, startDate].join('|');
    if (key !== this.rowsKey) {
      plan.courses = [{ id: 1, optionId: this.courseId, weeks, startDate }];
      plan.rooms = [{ id: 2, optionId: this.roomId, weeks, startDate }];
      this.rowsKey = key;
    }
    // The comparison's minor is the calculator's 16–17 band: any course, Junior tuition.
    student.selectedAgeGroup = conditions.ageGroup === 'minor' ? '16-17' : 'adult';
    student.minorWithoutParent = false;
    student.visaType = conditions.visaType === 'tourist30' ? 30 : 59;
    student.selectedRegistrationDate = conditions.registrationDate;
    student.returningStudent = false;
    student.familyTravel = false;

    const christmasName = this.pricing.content.quoteSettings.promotions.find(rule => rule.id === 'christmas-2026')?.name || '圣诞特别优惠';
    const discounts = [
      { name: '思达启航折扣', amount: student.sidaDiscountAmount },
      { name: '9月住宿优惠', amount: student.septemberPromotionDiscount },
      { name: '11月住宿优惠', amount: student.novemberPromotionDiscount },
      { name: christmasName, amount: student.christmasPromotionDiscount },
    ].filter(item => item.amount > 0);
    const course = this.pricing.courseOptions.find(item => item.id === this.courseId);
    const room = this.pricing.roomOptions.find(item => item.id === this.roomId);
    const managementFee = this.pricing.content.quoteSettings.minorManagementFeePerPeriod ?? 100;
    return {
      courseName: course?.name ?? '请选择课程',
      courseSchedule: course?.lessons ?? '',
      roomName: room?.name ?? '请选择房型',
      error: student.quoteError,
      tuition: student.tuitionForSelectedWeeks,
      accommodation: student.roomFeeForSelectedWeeks,
      registration: student.registrationAmount,
      discount: Math.round(discounts.reduce((sum, item) => sum + item.amount, 0) * 100) / 100,
      discountNames: discounts.map(item => item.name).join('、'),
      surcharge: student.seasonalSurcharge,
      schoolTotal: student.quoteUsd,
      localTotal: student.localFeesTotal,
      notes: student.isMinor
        ? [`${TAG}：未满18岁按16–17岁报价，课程费按青少年英语标准计算（未满16岁须选青少年英语课程）；无父母陪同另收未成年管理费${managementFee}美元／4周，上表未计入。`]
        : [],
    };
  }
}

export function createIbreezeCompareSource(): CompareSchoolSource {
  const pricing = createPricing();
  return {
    school: new IbreezeCompareSchool(pricing),
    pricingSchoolName: '菲律宾宿务I.BREEZE语言学校',
    applyPublished: value => {
      if (isIbreezeContent(value)) applyContent(pricing, value);
    },
  };
}
