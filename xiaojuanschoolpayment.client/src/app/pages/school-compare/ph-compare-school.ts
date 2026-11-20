// A Philippine school on the shared school template (school-page/) as a cross-school comparison
// entry. The school's own per-student calculator (the one its page, plan comparison and quote image
// use) prices every plan; this adapter only hands it one course row, one room row and the shared
// conditions, and reads the results back. Keep it free of Angular, DOM and storage access.
import type { PhComparePricing, PhCompareStudent } from '../philippines/school-page/ph-plan-compare';
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
} from './school-compare';

export interface PhCompareSchoolOptions<S extends PhCompareStudent> {
  id: string;
  tag: string;
  name: string;
  city: string;
  location: string;
  pagePath: string;
  /** The school's live prices; a published revision updates this object in place. */
  pricing: PhComparePricing;
  createStudent(): S;
  /** Copies the shared conditions onto the school's own student. */
  applyConditions(student: S, conditions: CompareConditions): void;
  /** Course ids per goal, best match first; `closest` when the school has no real course of that kind. */
  goals: Partial<Record<CompareGoal, { ids: readonly string[]; closest?: boolean }>>;
}

export class PhCompareSchool<S extends PhCompareStudent> implements CompareSchool {
  readonly schoolCurrency: CompareCurrency = 'USD';
  readonly localCurrency: CompareCurrency = 'PHP';
  private probe?: S;
  private courseCache?: { source: PhComparePricing['courseFees']; list: CompareCourseOption[] };
  private roomCache?: { source: PhComparePricing['roomFees']; list: CompareRoomOption[] };

  constructor(readonly options: PhCompareSchoolOptions<S>) {}

  get id(): string { return this.options.id; }
  get tag(): string { return this.options.tag; }
  get name(): string { return this.options.name; }
  get city(): string { return this.options.city; }
  get location(): string { return this.options.location; }
  get pagePath(): string { return this.options.pagePath; }

  get courses(): CompareCourseOption[] {
    const source = this.options.pricing.courseFees;
    if (this.courseCache?.source !== source) {
      this.courseCache = { source, list: source.map(course => ({ id: course.id, name: course.name, schedule: course.schedule ?? '' })) };
    }
    return this.courseCache.list;
  }

  get rooms(): CompareRoomOption[] {
    const source = this.options.pricing.roomFees;
    if (this.roomCache?.source !== source) {
      this.roomCache = { source, list: source.map(room => ({ id: room.id, name: room.name, fee: room.fee, ...compareRoomFacts(room.name) })) };
    }
    return this.roomCache.list;
  }

  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean } {
    const entry = this.options.goals[goal];
    return { ids: [...(entry?.ids ?? [])], ...(entry?.closest ? { closest: true } : {}) };
  }

  minimumWeeks(courseId: string): number {
    this.probe ??= this.options.createStudent();
    return this.probe.minimumWeeks(courseId);
  }

  createPlan(courseId: string, roomId: string): CompareSchoolPlan {
    return new PhComparePlan(this.options, courseId, roomId);
  }
}

class PhComparePlan<S extends PhCompareStudent> implements CompareSchoolPlan {
  private readonly student: S;
  private rowsKey = '';

  constructor(private readonly options: PhCompareSchoolOptions<S>, public courseId: string, public roomId: string) {
    this.student = options.createStudent();
  }

  result(conditions: CompareConditions): CompareSchoolResult {
    const { weeks, startDate } = conditions;
    const key = [this.courseId, this.roomId, weeks, startDate].join('|');
    const plan = this.student.quotePlan;
    if (key !== this.rowsKey) {
      plan.courses = [{ id: 1, optionId: this.courseId, weeks, startDate }];
      plan.rooms = [{ id: 2, optionId: this.roomId, weeks, startDate }];
      this.rowsKey = key;
    }
    this.options.applyConditions(this.student, conditions);
    const student = this.student;
    const pricing = this.options.pricing;
    const course = pricing.courseFees.find(item => item.id === this.courseId);
    const room = pricing.roomFees.find(item => item.id === this.roomId);
    const extra = student.extraPaymentNote ?? '';
    return {
      courseName: course?.name ?? '请选择课程',
      courseSchedule: course?.schedule ?? '',
      roomName: room?.name ?? '请选择房型',
      error: student.quoteError,
      tuition: student.tuition,
      accommodation: student.accommodation,
      registration: student.registration,
      discount: student.promotionDiscountTotal,
      discountNames: student.discountNames,
      surcharge: student.seasonalSurcharge,
      schoolTotal: student.quoteUsd,
      localTotal: student.localFees.reduce((sum, fee) => sum + fee.total, 0),
      notes: extra ? [`${this.options.tag}：${extra}`] : [],
    };
  }
}
