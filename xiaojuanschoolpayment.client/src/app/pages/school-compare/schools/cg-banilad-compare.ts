// CG Banilad (宿务市区 Banilad 校区; CG Sparta is a separate campus with its own rules) as a
// cross-school comparison entry. Every amount comes from CgBaniladStudentQuote, the same
// per-student calculator the school page, its group quote and its quote image use; this adapter
// only hands it one course row, one room row and the shared conditions, and reads the results back.
// The pricing object below mirrors the page component's fields the calculator reads, filled the way
// the page fills them (applyContentConfig): compiled defaults first, then a published revision.
// The page never applies database prices, so neither does this adapter.
// Keep this file free of Angular, DOM and storage access.
import type { CiaContentConfig, CiaRoomContent } from '../../philippines/cia-school/cia-content-config';
import { cloneCgBaniladContentConfig, createDefaultCgBaniladContentConfig } from '../../philippines/cg-banilad-school/cg-banilad-content-config';
import { CgBaniladStudentQuote } from '../../philippines/cg-banilad-school/cg-banilad-student-quote';
import type {
  CompareConditions,
  CompareCourseOption,
  CompareGoal,
  CompareRoomOption,
  CompareSchool,
  CompareSchoolPlan,
  CompareSchoolResult,
  CompareSchoolSource,
} from '../school-compare';

type CgBaniladPricing = ConstructorParameters<typeof CgBaniladStudentQuote>[0];

const SCHOOL_CODE = 'CG-BANILAD';
const TAG = 'CG Banilad';

/** Week choices of the page's quote (cg-banilad-school.component.ts); 1–2 weeks are not quotable there. */
const PAGE_WEEK_OPTIONS = [3, 4, 8, 12, 16, 20, 24];

const GOALS: Partial<Record<CompareGoal, { ids: readonly string[]; closest?: boolean }>> = {
  general: { ids: ['general-esl', 'intensive-esl', 'semi-sparta', 'premier-semi-sparta', 'light-esl'] },
  // No speaking-only course; Power ESL has the most one-to-one classes (6 a day).
  speaking: { ids: ['power-esl', 'intensive-esl'], closest: true },
  ielts: { ids: ['ielts-basic'] },
  // No guarantee course; the IELTS basic course is the nearest.
  'ielts-guarantee': { ids: ['ielts-basic'], closest: true },
  toeic: { ids: ['toeic'] },
  business: { ids: ['business'] },
};

const isCgBaniladContent = (value: unknown): value is CiaContentConfig => {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && typeof content === 'object' && content.schemaVersion === 1 && content.schoolCode === SCHOOL_CODE
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions);
};

/** People per room from the CG room names (“Banilad 4人房”, “Alicia校外2人房”, “88th Avenue 1人房”). */
const roomBeds = (name: string): number => {
  const match = /([1-4])人房/.exec(name);
  if (match) return Number(match[1]);
  return /单人/.test(name) ? 1 : /双人/.test(name) ? 2 : /三人/.test(name) ? 3 : /四人/.test(name) ? 4 : 0;
};

class CgBaniladCompareSchool implements CompareSchool {
  readonly id = 'cg-banilad';
  readonly tag = TAG;
  readonly name = '菲律宾宿务 CG Academy Banilad 校区';
  readonly country = '菲律宾';
  readonly city = '宿务';
  readonly location = '宿务市区 Banilad';
  readonly pagePath = '/philippines-study/cebu/cg-academy-banilad-campus';
  readonly schoolCurrency = 'USD' as const;
  readonly localCurrency = 'PHP' as const;
  courses: CompareCourseOption[] = [];
  rooms: CompareRoomOption[] = [];

  /** The fields CgBaniladStudentQuote reads; updated in place so existing plans see a new revision. */
  readonly pricing: CgBaniladPricing = {
    courses: [],
    roomOptions: [],
    weekOptions: PAGE_WEEK_OPTIONS,
    shortTermRatios: {},
    registrationFeeUsd: 0,
    sidaDiscountRate: 1,
    offSeasonDiscountPerFourWeeks: 0,
    summerFeePerWeek: 0,
    promotionRules: [],
    peakSeasonRanges: [],
    localFeeRules: [],
  };

  constructor() {
    this.apply(createDefaultCgBaniladContentConfig());
  }

  /** Same steps as CgBaniladSchoolComponent.applyContentConfig, limited to what the quote uses. */
  apply(value: CiaContentConfig): void {
    if (!isCgBaniladContent(value)) return;
    const content = cloneCgBaniladContentConfig(value);
    const pricing = this.pricing;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) {
      pricing.courses = courses.map(item => ({ id: item.id, name: item.name, lessons: item.schedule, tuitionUsd: item.tuition }));
      this.courses = courses.map(item => ({ id: item.id, name: item.name, schedule: item.schedule }));
    }
    if (rooms.length) {
      pricing.roomOptions = rooms.map(item => ({ id: item.id, name: item.name, feeUsd: item.fee }));
      this.rooms = rooms.map(item => this.roomOption(item));
    }
    const settings = content.quoteSettings;
    pricing.registrationFeeUsd = settings.registrationFee;
    pricing.shortTermRatios = { ...settings.shortStayRatios };
    pricing.summerFeePerWeek = settings.peakSeasonFeePerWeek;
    pricing.peakSeasonRanges = settings.peakSeasonRanges.map(item => ({ ...item }));
    pricing.promotionRules = settings.promotions.map(item => ({ ...item }));
    pricing.localFeeRules = content.localFees.map(item => ({ ...item, rates: item.rates ? [...item.rates] : undefined }));
    // Not read by the calculator; kept equal to the page's getters for completeness.
    const rule = (id: string) => pricing.promotionRules.find(item => item.id === id && item.enabled);
    pricing.sidaDiscountRate = 1 - (rule('cg-banilad-sida-90')?.discountValue ?? 0) / 100;
    pricing.offSeasonDiscountPerFourWeeks = rule('cg-banilad-off-season')?.discountValue ?? 0;
  }

  private roomOption(room: CiaRoomContent): CompareRoomOption {
    return {
      id: room.id,
      name: room.name,
      beds: roomBeds(room.name),
      offCampus: room.location === '校外' || room.name.includes('校外'),
      suite: room.name.includes('套房'),
      fee: room.fee,
    };
  }

  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean } {
    const entry = GOALS[goal];
    return { ids: [...(entry?.ids ?? [])], ...(entry?.closest ? { closest: true } : {}) };
  }

  /** No CG Banilad course has a minimum length; 1–2-week plans are refused by the calculator itself. */
  minimumWeeks(): number {
    return 0;
  }

  createPlan(courseId: string, roomId: string): CompareSchoolPlan {
    return new CgBaniladComparePlan(this, courseId, roomId);
  }
}

class CgBaniladComparePlan implements CompareSchoolPlan {
  private readonly student: CgBaniladStudentQuote;

  constructor(private readonly school: CgBaniladCompareSchool, public courseId: string, public roomId: string) {
    this.student = new CgBaniladStudentQuote(school.pricing);
  }

  result(conditions: CompareConditions): CompareSchoolResult {
    const { weeks, startDate } = conditions;
    const student = this.student;
    student.quotePlan.courses = [{ id: 1, optionId: this.courseId, weeks, startDate }];
    student.quotePlan.rooms = [{ id: 2, optionId: this.roomId, weeks, startDate }];
    student.selectedAgeGroup = conditions.ageGroup;
    student.visaType = conditions.visaType;
    student.selectedRegistrationDate = conditions.registrationDate;
    student.returningStudent = false;
    // Default textbook estimate (per course type, every started 8 weeks) at the page's default unit price.
    student.resetTextbookCount();
    student.textbookUnitPrice = 2000;

    const course = this.school.pricing.courses.find(item => item.id === this.courseId);
    const room = this.school.pricing.roomOptions.find(item => item.id === this.roomId);
    const discounts = student.paymentLines.filter(line => line.value < 0);
    const electricity = this.school.pricing.localFeeRules.some(rule => rule.id === 'electricity' && rule.enabled);
    return {
      courseName: course?.name ?? '请选择课程',
      courseSchedule: course?.lessons ?? '',
      roomName: room?.name ?? '请选择房型',
      error: student.error,
      tuition: student.tuition,
      accommodation: student.accommodation,
      registration: student.registration,
      discount: student.sidaDiscount + student.offSeasonDiscount + student.longStayDiscount,
      discountNames: [...new Set(discounts.map(line => line.label))].join('、'),
      surcharge: student.summerSurcharge,
      schoolTotal: student.quoteUsd,
      localTotal: student.localFees.filter(fee => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0),
      notes: electricity ? [`${TAG}：空调用电按实际用量另收，不含在到校学杂费内。`] : [],
    };
  }
}

export function createCgBaniladCompareSource(): CompareSchoolSource {
  const school = new CgBaniladCompareSchool();
  return {
    school,
    // Canonical seed name; the page also accepts the aliases “CG Academy Banilad Campus” and “CG Banilad”.
    pricingSchoolName: '菲律宾宿务CG Academy（Banilad Campus）',
    applyPublished: content => {
      if (isCgBaniladContent(content)) school.apply(content);
    },
  };
}
