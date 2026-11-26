// Plan comparison for every school page on the Philippine school template: two or three
// single-student plans (course, room, weeks, arrival) priced with the school's own per-student
// quote rules, then laid out as a PlanCompareSheet that both the web table and the comparison
// image draw. The student's conditions come from the normal quote's first student so both modes
// always agree. Keep this file free of Angular, DOM and storage access.
import type { PlanCompareRow, PlanCompareSheet } from '../../../components/plan-compare/plan-compare-sheet';
import { quoteCurrencyText } from '../../../../services/quote-currency-text';
import type { PhQuotePricing, PhQuoteStudent } from './ph-school-quote';

export type PhCompareFocus = 'room' | 'course' | 'weeks';

/** What a comparison plan needs from the school's per-student quote. */
export interface PhCompareStudent extends PhQuoteStudent {
  readonly promotionDiscountTotal: number;
  /** Names of the discounts that apply, joined with 、. */
  readonly discountNames: string;
  minimumWeeks(courseId: string): number;
}

export interface PhComparePricing extends PhQuotePricing {
  courseFees: ReadonlyArray<{ id: string; name: string; schedule?: string; suitable?: string }>;
  roomFees: ReadonlyArray<{ id: string; name: string; fee: number }>;
}

export interface PhPlanComparisonOptions<S extends PhCompareStudent> {
  createStudent(): S;
  /** Copies the normal quote's conditions (age, visa, returning student, …) onto a plan. */
  copyConditions(from: S, to: S): void;
  /** Sheet heading, e.g. 'CIA 方案对比报价'. */
  heading: string;
  /** Courses a student usually weighs against each other; the “同类课程” shortcut picks from one group. */
  courseGroups: ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }>;
  /** Weekly peak surcharge named in the notes; defaults to the published rate. */
  peakRate?(): number;
  /** School-specific notes placed after the surcharge note. */
  extraNotes?(results: readonly PhComparePlanResult[]): string[];
  /**
   * The table under the user's review (2026-11-21, CIA only until approved): 注册费 comes first, the 课程 and 住宿
   * rows carry their price (no separate 课程费 and 住宿费 rows), and a 课程安排 row always shows each plan's daily
   * schedule. Otherwise a 每日课程 row appears only when the courses differ.
   */
  layoutVersion?: 2;
}

/** Courses a student usually weighs against each other; the “同类课程” shortcut picks from one group. */
const WEEK_STEPS = [4, 8, 12, 16, 20, 24];
const TAGS = ['方案A', '方案B', '方案C'];
const DAY = 86400000;

export interface PhComparePlanResult {
  courseId: string;
  courseName: string;
  courseSchedule: string;
  courseSuitable: string;
  roomName: string;
  weeks: number;
  startDate: string;
  endDate: string;
  error: string;
  tuition: number;
  accommodation: number;
  registration: number;
  discount: number;
  discountNames: string;
  surcharge: number;
  schoolUsd: number;
  schoolCny: number;
  localPhp: number;
  localCny: number;
}

export class PhPlanComparison<S extends PhCompareStudent> {
  readonly plans: S[] = [];
  readonly maxPlans = 3;
  readonly weekOptions = Array.from({ length: 24 }, (_, index) => index + 1);
  /** Which shortcut built the current plans; changing a plan by hand keeps it. */
  focus: PhCompareFocus = 'room';

  constructor(
    protected readonly pricing: PhComparePricing,
    private readonly conditions: () => S,
    private readonly options: PhPlanComparisonOptions<S>,
  ) {}

  get started(): boolean { return this.plans.length > 0; }

  /** Courses and rooms a plan can pick; a school may compare fewer than it quotes (SMEAG Encanto: adult courses only). */
  get courseOptions(): PhComparePricing['courseFees'] { return this.pricing.courseFees; }
  get roomOptions(): PhComparePricing['roomFees'] { return this.pricing.roomFees; }

  /** Builds plan A from the normal quote's first course and room, then applies a shortcut. */
  start(focus: PhCompareFocus = this.focus): void {
    const plan = this.conditions().quotePlan;
    const first = this.create(
      plan.courses[0]?.optionId ?? this.pricing.courseFees[0]?.id ?? '',
      plan.rooms[0]?.optionId ?? this.pricing.roomFees[0]?.id ?? '',
      Math.min(24, Math.max(1, plan.courseWeeks || 4)),
      plan.courses[0]?.startDate ?? plan.startDate,
    );
    this.plans.splice(0, this.plans.length, first);
    this.applyFocus(focus);
  }

  /** Keeps plan A and rebuilds the others so they differ only in rooms, courses or weeks. */
  applyFocus(focus: PhCompareFocus): void {
    if (!this.plans.length) {
      this.start(focus);
      return;
    }
    this.focus = focus;
    const base = this.read(this.plans[0]);
    const variants =
      focus === 'room' ? this.otherRooms(base.roomId).map(roomId => ({ ...base, roomId }))
        : focus === 'course' ? this.otherCourses(base.courseId).map(courseId => ({ ...base, courseId }))
          : this.otherWeeks(base.weeks).map(weeks => ({ ...base, weeks }));
    this.plans.splice(1, this.plans.length - 1,
      ...variants.slice(0, this.maxPlans - 1).map(item => this.create(item.courseId, item.roomId, item.weeks, item.startDate)));
    for (const plan of this.plans) this.respectMinimumWeeks(plan);
  }

  canAdd(): boolean { return this.plans.length < this.maxPlans; }
  canRemove(): boolean { return this.plans.length > 2; }

  addPlan(): void {
    if (!this.canAdd() || !this.plans.length) return;
    const last = this.read(this.plans[this.plans.length - 1]);
    this.plans.push(this.create(last.courseId, last.roomId, last.weeks, last.startDate));
  }

  removePlan(index: number): void {
    if (this.canRemove()) this.plans.splice(index, 1);
  }

  courseId(plan: S): string { return plan.quotePlan.courses[0]?.optionId ?? ''; }
  roomId(plan: S): string { return plan.quotePlan.rooms[0]?.optionId ?? ''; }
  weeks(plan: S): number { return plan.quotePlan.courseWeeks; }
  startDate(plan: S): string { return plan.quotePlan.courses[0]?.startDate ?? ''; }

  setCourse(plan: S, courseId: string): void {
    const row = plan.quotePlan.courses[0];
    if (!row) return;
    row.optionId = courseId;
    this.respectMinimumWeeks(plan);
  }

  setRoom(plan: S, roomId: string): void {
    const row = plan.quotePlan.rooms[0];
    if (row) row.optionId = roomId;
  }

  setWeeks(plan: S, weeks: number): void {
    const row = plan.quotePlan.courses[0];
    if (row) plan.quotePlan.updateWeeks('course', row.id, Number(weeks));
  }

  /** Accepts Sundays only, like the normal quote; returns false when the date was rejected. */
  setStartDate(plan: S, value: string): boolean {
    const row = plan.quotePlan.courses[0];
    const timestamp = plan.quotePlan.date(value);
    if (!row || timestamp === null || new Date(timestamp).getUTCDay() !== 0) return false;
    plan.quotePlan.updateStartDate('course', row.id, value);
    return true;
  }

  get results(): PhComparePlanResult[] {
    this.syncConditions();
    return this.plans.map(plan => this.result(plan));
  }

  get ready(): boolean {
    const results = this.results;
    return results.length >= 2 && results.every(result => !result.error) && this.ratesUsable;
  }

  /** The table and image data. Values of a plan that cannot be quoted are ignored by both. */
  get sheet(): PlanCompareSheet {
    const results = this.results;
    const same = <T>(pick: (result: PhComparePlanResult) => T) => results.every(result => pick(result) === pick(results[0]));
    const sameCourse = same(result => result.courseId);
    const sameRoom = same(result => result.roomName);
    const sameWeeks = same(result => result.weeks);
    const sameDate = same(result => result.startDate);
    const date = (value: string) => value.replace(/-/g, '/');

    const title = (result: PhComparePlanResult) => {
      const parts = [
        sameCourse ? '' : result.courseName,
        sameRoom ? '' : result.roomName,
        sameWeeks ? '' : `${result.weeks}周`,
        sameDate ? '' : `${date(result.startDate)}入学`,
      ].filter(Boolean);
      return parts.length ? parts.join(' · ') : result.courseName;
    };
    const conditions = [
      sameCourse && results[0] ? results[0].courseName : '',
      sameRoom && results[0] ? results[0].roomName : '',
      sameWeeks && results[0] ? `${results[0].weeks}周` : '',
      sameDate && results[0] ? `${date(results[0].startDate)}入学` : '',
    ].filter(Boolean).join(' · ');

    const base = results[0];
    const usd = (value: number) => `${this.formatUsd(value)} 美元`;
    const cny = (value: number) => Number.isFinite(value) ? `${quoteCurrencyText(value, 'zh-CN')} 元` : '人民币待更新';
    const v2 = this.options.layoutVersion === 2;
    const registration: PlanCompareRow = {
      label: '注册费', style: 'money', values: results.map(result => result.registration > 0 ? usd(result.registration) : '免收'),
    };
    const rows: PlanCompareRow[] = [
      ...(v2 ? [registration] : []),
      {
        label: '课程', style: 'text',
        values: results.map(result => v2 ? `${result.courseName} · ${usd(result.tuition)}` : result.courseName),
        ...(sameCourse ? {} : { subValues: results.map(result => result.courseSuitable) }),
      },
      ...(v2
        ? [{ label: '课程安排', style: 'detail' as const, values: results.map(result => result.courseSchedule || '—') }]
        : sameCourse ? [] : [{ label: '每日课程', style: 'detail' as const, values: results.map(result => result.courseSchedule) }]),
      { label: '住宿', style: 'text', values: results.map(result => v2 ? `${result.roomName} · ${usd(result.accommodation)}` : result.roomName) },
      {
        label: '周数与日期', style: 'text',
        values: results.map(result => `${result.weeks}周`),
        subValues: results.map(result => `${date(result.startDate)}–${date(result.endDate)}`),
      },
      ...(v2 ? [] : [
        { label: '课程费', style: 'money' as const, values: results.map(result => usd(result.tuition)) },
        { label: '住宿费', style: 'money' as const, values: results.map(result => usd(result.accommodation)) },
        registration,
      ]),
      {
        label: '优惠', style: 'money',
        values: results.map(result => result.discount > 0 ? `− ${usd(result.discount)}` : '—'),
        subValues: results.map(result => result.discountNames),
      },
      ...(results.some(result => result.surcharge > 0)
        ? [{ label: '旺季附加费', style: 'money' as const, values: results.map(result => result.surcharge > 0 ? usd(result.surcharge) : '—') }]
        : []),
      {
        label: '学校费用合计', style: 'total',
        values: results.map(result => usd(result.schoolUsd)),
        subValues: results.map(result => `约 ${cny(result.schoolCny)}人民币`),
      },
      {
        label: '比方案A', style: 'diff',
        values: results.map((result, index) => index === 0 ? '基准' : this.diffText(result.schoolUsd - base.schoolUsd)),
      },
      {
        label: '到校学杂费', style: 'subtotal',
        values: results.map(result => `${quoteCurrencyText(Math.round(result.localPhp), 'en-US')} 比索`),
        subValues: results.map(result => `约 ${cny(result.localCny)}人民币`),
      },
    ];

    const notes = [
      '学校费用与到校学杂费分开支付；到校学杂费在到校后当地缴纳，不含接机和可退押金。',
      ...(results.some(result => result.surcharge > 0) ? [`旺季附加费${this.options.peakRate?.() ?? this.pricing.seasonalFeePerWeek}美元／周，课程与住宿重叠周只计一次，不参与折扣。`] : []),
      ...(this.options.extraNotes?.(results) ?? []),
      this.rateNote,
      '以上为预估对比，最终以学校最新价格、空房、优惠及思达启航顾问确认为准。',
    ];

    return {
      heading: this.options.heading,
      conditions: conditions ? `相同条件：${conditions}` : '各方案条件不同，请看下表',
      plans: results.map((result, index) => ({ tag: TAGS[index] ?? `方案${index + 1}`, title: title(result), ...(result.error ? { error: result.error } : {}) })),
      rows,
      notes,
    };
  }

  private get ratesUsable(): boolean {
    return Number.isFinite(this.pricing.usdToCny) && this.pricing.usdToCny > 0
      && Number.isFinite(this.pricing.phpPerCny) && this.pricing.phpPerCny > 0;
  }

  private get rateNote(): string {
    if (!this.ratesUsable) return '最新参考汇率待更新，人民币金额暂不可用。';
    const dateText = this.pricing.usingLiveExchangeRates && this.pricing.exchangeRateDate
      ? `（${this.pricing.exchangeRateDate.replace(/-/g, '/')}）` : '';
    return `参考汇率${dateText}：1美元≈${quoteCurrencyText(this.pricing.usdToCny, 'zh-CN', { maximumFractionDigits: 4 })}元人民币，1元人民币≈${quoteCurrencyText(this.pricing.phpPerCny, 'zh-CN', { maximumFractionDigits: 4 })}比索；最终以实际支付汇率为准。`;
  }

  private diffText(value: number): string {
    if (!Number.isFinite(value)) return '—';
    if (value === 0) return '相同';
    return `${value > 0 ? '多' : '少'} ${this.formatUsd(Math.abs(value))} 美元`;
  }

  private result(plan: S): PhComparePlanResult {
    const courseId = this.courseId(plan);
    const course = this.pricing.courseFees.find(item => item.id === courseId);
    const room = this.pricing.roomFees.find(item => item.id === this.roomId(plan));
    const error = plan.quoteError;
    const localPhp = plan.localFees.reduce((sum, fee) => sum + fee.total, 0);
    const schoolUsd = plan.quoteUsd;
    const schoolCny = Math.round(schoolUsd * this.pricing.usdToCny);
    const localCny = Math.round(localPhp / this.pricing.phpPerCny);
    const start = plan.quotePlan.date(this.startDate(plan));
    return {
      courseId,
      courseName: course?.name ?? '请选择课程',
      courseSchedule: course?.schedule ?? '',
      courseSuitable: course?.suitable ?? '',
      roomName: room?.name ?? '请选择房型',
      weeks: this.weeks(plan),
      startDate: this.startDate(plan),
      endDate: start === null ? '' : new Date(start + (this.weeks(plan) * 7 - 1) * DAY).toISOString().slice(0, 10),
      error,
      tuition: plan.tuition,
      accommodation: plan.accommodation,
      registration: plan.registration,
      discount: plan.promotionDiscountTotal,
      discountNames: plan.discountNames,
      surcharge: plan.seasonalSurcharge,
      schoolUsd,
      schoolCny,
      localPhp,
      localCny,
    };
  }

  private syncConditions(): void {
    const source = this.conditions();
    for (const plan of this.plans) this.options.copyConditions(source, plan);
  }

  private create(courseId: string, roomId: string, weeks: number, startDate: string): S {
    const plan = this.options.createStudent();
    plan.quotePlan.courses = [{ id: 1, optionId: courseId, weeks, startDate }];
    plan.quotePlan.rooms = [{ id: 2, optionId: roomId, weeks, startDate }];
    return plan;
  }

  private read(plan: S) {
    return { courseId: this.courseId(plan), roomId: this.roomId(plan), weeks: this.weeks(plan), startDate: this.startDate(plan) };
  }

  /** Guarantee courses must run 12 weeks; lengthen the plan instead of showing an error. */
  private respectMinimumWeeks(plan: S): void {
    const minimum = plan.minimumWeeks(this.courseId(plan));
    if (minimum > this.weeks(plan)) this.setWeeks(plan, Math.min(24, minimum));
  }

  /** Rooms with the nearest different prices, so each plan shows a real price step. */
  private otherRooms(roomId: string): string[] {
    const rooms = this.pricing.roomFees;
    const current = rooms.find(room => room.id === roomId);
    if (!current) return rooms.filter(room => room.id !== roomId).slice(0, 2).map(room => room.id);
    const seen = new Set<number>([current.fee]);
    return rooms
      .filter(room => room.id !== roomId)
      .sort((a, b) => Math.abs(a.fee - current.fee) - Math.abs(b.fee - current.fee) || rooms.indexOf(a) - rooms.indexOf(b))
      .filter(room => !seen.has(room.fee) && !!seen.add(room.fee))
      .slice(0, 2)
      .sort((a, b) => a.fee - b.fee)
      .map(room => room.id);
  }

  /** Other courses from the same group as plan A, in catalogue order. */
  private otherCourses(courseId: string): string[] {
    const available = new Set(this.pricing.courseFees.map(course => course.id));
    const group = this.options.courseGroups.find(item => item.courseIds.includes(courseId));
    const candidates = group
      ? group.courseIds.filter(id => id !== courseId && available.has(id))
      : this.pricing.courseFees.map(course => course.id).filter(id => id !== courseId);
    return candidates.slice(0, 2);
  }

  /** The next longer standard durations, or shorter ones when plan A is already long. */
  private otherWeeks(weeks: number): number[] {
    const longer = WEEK_STEPS.filter(step => step > weeks);
    const shorter = WEEK_STEPS.filter(step => step < weeks).reverse();
    return [...longer, ...shorter].slice(0, 2).sort((a, b) => a - b);
  }

  private formatUsd(value: number): string {
    if (!Number.isFinite(value)) return '—';
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
}
