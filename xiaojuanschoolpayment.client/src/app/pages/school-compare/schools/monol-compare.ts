// MONOL main campus (Baguio) as a cross-school comparison entry. MONOL Sparta is a separate school
// with its own document (schoolCode 'MONOL-SPARTA') and is never used here.
// Every plan is priced by MONOL's own per-student calculator (MonolStudentQuote), from prices built
// exactly the way the MONOL page builds them from its content document (applyContentConfig in
// monol-school-detail.component.ts). This file only hands the calculator one course row, one room row
// and the shared conditions, and reads the results back.
// Keep this file free of Angular, DOM and storage access.
import type { CiaContentConfig } from '../../philippines/cia-school/cia-content-config';
import { cloneMonolContentConfig, createDefaultMonolContentConfig } from '../../philippines/monol-school/monol-content-config';
import { MonolStudentQuote, type MonolQuotePrices } from '../../philippines/monol-school/monol-student-quote';
import {
  compareRoomFacts,
  type CompareConditions,
  type CompareCourseOption,
  type CompareGoal,
  type CompareRoomOption,
  type CompareSchool,
  type CompareSchoolPlan,
  type CompareSchoolResult,
  type CompareSchoolSource,
} from '../school-compare';

const TAG = 'MONOL';

/** People per room for MONOL's own room ids; other (newly published) rooms are read from their names. */
const ROOM_BEDS: Readonly<Record<string, number>> = {
  'premium-single-room': 1,
  'standard-single-room': 1,
  'small-single-room': 1,
  'triple-room': 3,
  'quad-room': 4,
};

/**
 * Course ids per goal, best match first. MONOL has no separate speaking, IELTS guarantee, TOEIC or
 * business course: General ESL has the most one-to-one classes at the base price, IELTS is the nearest
 * to a guarantee course, and LEAP English is the customised course that can be built around TOEIC or
 * Business.
 */
const GOALS: Readonly<Record<CompareGoal, { ids: readonly string[]; closest?: boolean }>> = {
  general: { ids: ['general-esl', 'esl-4'] },
  speaking: { ids: ['general-esl'], closest: true },
  ielts: { ids: ['ielts'] },
  'ielts-guarantee': { ids: ['ielts'], closest: true },
  toeic: { ids: ['leap-english'], closest: true },
  business: { ids: ['leap-english'], closest: true },
};

/** Academic fees the school charges on top of tuition; MONOL's calculator does not add them. */
const ACADEMIC_FEE_NOTES: Readonly<Record<string, string>> = {
  ielts: 'IELTS课程另有100美元学术费，不参与优惠，未计入学校费用合计，收费方式以学校账单为准。',
  'leap-english': 'LEAP English课程另有250美元学术费，不参与优惠，未计入学校费用合计，收费方式以学校账单为准。',
};

/** MONOL main campus's own document; MONOL Sparta ('MONOL-SPARTA') and every other school are rejected. */
function isMonolContent(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && typeof content === 'object' && content.schemaVersion === 1 && content.schoolCode === 'MONOL'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions);
}

/** Copies a MONOL content document onto the calculator prices, as the MONOL page's applyContentConfig does. */
function applyMonolContent(pricing: MonolQuotePrices, value: CiaContentConfig): void {
  const content = cloneMonolContentConfig(value);
  const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  if (courses.length) {
    pricing.courseFees = courses.map(item => ({
      id: item.id,
      name: item.name,
      tuition: item.tuition,
      suitable: item.schedule,
      note: [item.suitable, item.note].filter(Boolean).join('；'),
    }));
  }
  if (rooms.length) pricing.roomFees = rooms.map(item => ({ id: item.id, name: item.name, fee: item.fee, note: item.note }));
  const settings = content.quoteSettings;
  pricing.registrationFee = settings.registrationFee;
  pricing.peakSeasonFeePerWeek = settings.peakSeasonFeePerWeek;
  pricing.peakSeasonRanges = (settings.peakSeasonRanges ?? []).filter(item => item.enabled).map(item => ({ ...item }));
  pricing.shortStayRatios = { ...settings.shortStayRatios };
  pricing.promotionRules = settings.promotions.map(item => ({ ...item, eligibleRoomIds: item.eligibleRoomIds ? [...item.eligibleRoomIds] : undefined }));
  pricing.localFeeRules = content.localFees.map(item => ({ ...item }));
}

function createMonolPricing(): MonolQuotePrices {
  const pricing: MonolQuotePrices = {
    courseFees: [], roomFees: [], registrationFee: 0, shortStayRatios: {}, promotionRules: [], localFeeRules: [],
    peakSeasonFeePerWeek: 0, peakSeasonRanges: [],
  };
  applyMonolContent(pricing, createDefaultMonolContentConfig());
  return pricing;
}

const rounded = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

class MonolCompareSchool implements CompareSchool {
  readonly id = 'monol';
  readonly tag = TAG;
  readonly name = '菲律宾碧瑶 MONOL 语言学校（主校区）';
  readonly country = '菲律宾';
  readonly city = '碧瑶';
  readonly location = '碧瑶 Pinsao Proper';
  readonly pagePath = '/philippines-study/baguio/monol';
  readonly schoolCurrency = 'USD' as const;
  readonly localCurrency = 'PHP' as const;
  private courseCache?: { source: MonolQuotePrices['courseFees']; list: CompareCourseOption[] };
  private roomCache?: { source: MonolQuotePrices['roomFees']; list: CompareRoomOption[] };

  constructor(private readonly pricing: MonolQuotePrices) {}

  get courses(): CompareCourseOption[] {
    const source = this.pricing.courseFees;
    if (this.courseCache?.source !== source) {
      this.courseCache = { source, list: source.map(course => ({ id: course.id, name: course.name, schedule: course.suitable })) };
    }
    return this.courseCache.list;
  }

  get rooms(): CompareRoomOption[] {
    const source = this.pricing.roomFees;
    if (this.roomCache?.source !== source) {
      this.roomCache = {
        source,
        list: source.map(room => {
          const facts = compareRoomFacts(room.name);
          return { id: room.id, name: room.name, fee: room.fee, ...facts, beds: ROOM_BEDS[room.id] ?? facts.beds };
        }),
      };
    }
    return this.roomCache.list;
  }

  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean } {
    const entry = GOALS[goal];
    return { ids: [...(entry?.ids ?? [])], ...(entry?.closest ? { closest: true } : {}) };
  }

  /** MONOL has no fixed-length course; unsupported lengths are reported by the calculator itself. */
  minimumWeeks(): number { return 0; }

  createPlan(courseId: string, roomId: string): CompareSchoolPlan {
    return new MonolComparePlan(this.pricing, courseId, roomId);
  }
}

class MonolComparePlan implements CompareSchoolPlan {
  private readonly student: MonolStudentQuote;

  constructor(private readonly pricing: MonolQuotePrices, public courseId: string, public roomId: string) {
    this.student = new MonolStudentQuote(pricing);
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
    student.pickupAirport = 'none';
    student.applySnsPromotion = false;

    const course = this.pricing.courseFees.find(item => item.id === this.courseId);
    const room = this.pricing.roomFees.find(item => item.id === this.roomId);
    const discount = rounded(student.offSeasonCourseDiscount + student.offSeasonRoomDiscount
      + student.snsDiscount + student.longTermDiscount + student.christmasDiscount);
    const discountNames = student.paymentLines
      .filter(line => line.value < 0 && line.promotionKey !== 'registration')
      .map(line => line.label)
      .join('、');
    return {
      courseName: course?.name ?? '请选择课程',
      courseSchedule: course?.suitable ?? '',
      roomName: room?.name ?? '请选择房型',
      error: student.quoteError,
      tuition: student.tuition,
      accommodation: student.accommodation,
      registration: rounded(student.registration - student.registrationDiscount),
      discount,
      discountNames,
      surcharge: student.seasonalSurcharge,
      schoolTotal: student.quoteUsd,
      localTotal: student.localFees.reduce((sum, fee) => sum + fee.total, 0),
      notes: this.notes(conditions),
    };
  }

  private notes(conditions: CompareConditions): string[] {
    const notes: string[] = [];
    const meals = this.student.mealEstimate;
    if (meals > 0) {
      notes.push(`住宿费不含餐费，本方案餐费参考约${meals.toLocaleString('en-US', { maximumFractionDigits: 0 })}比索，按实际点餐另付，未计入学校费用和到校学杂费。`);
    }
    const academic = ACADEMIC_FEE_NOTES[this.courseId];
    if (academic) notes.push(academic);
    if (conditions.ageGroup === 'minor') notes.push('未满18岁独自在校学习另收100美元／4周管理费，未计入学校费用合计。');
    return notes.map(note => `${TAG}：${note}`);
  }
}

export function createMonolCompareSource(): CompareSchoolSource {
  const pricing = createMonolPricing();
  return {
    school: new MonolCompareSchool(pricing),
    // The seed renames every MONOL main-campus record to this name; the page searches “MONOL” and
    // picks this name first, while MONOL Sparta is 菲律宾碧瑶MONOL斯巴达校区.
    pricingSchoolName: '菲律宾碧瑶MONOL语言学校',
    applyPublished: content => {
      if (isMonolContent(content)) applyMonolContent(pricing, content);
    },
  };
}
