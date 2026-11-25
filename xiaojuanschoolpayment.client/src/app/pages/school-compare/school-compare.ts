// Price comparison across schools: one plan per school, each priced by that school's own quote
// calculator, laid out as a PlanCompareSheet that the web table and the comparison image both
// draw. This file only matches courses and rooms and lays out the results; it never prices
// anything itself, so a school's numbers here always equal its own page and quote image.
// Schools join through a CompareSchool adapter (see ph-compare-school.ts); another country only
// needs a new adapter and, if its currency is new, a rate in CompareRates.
// Keep this file free of Angular, DOM and storage access so the WeChat mini program can bundle it.
import type { PlanCompareRow, PlanCompareSheet } from '../../components/plan-compare/plan-compare-sheet';
import { nextQuoteSunday } from '../../components/school-quote-plan';
import { quoteCurrencyText } from '../../../services/quote-currency-text';

/** What a student wants to study; each school lists its matching courses, best match first. */
export type CompareGoal = 'general' | 'speaking' | 'ielts' | 'ielts-guarantee' | 'toeic' | 'business';

export const COMPARE_GOALS: ReadonlyArray<{ id: CompareGoal; label: string }> = [
  { id: 'general', label: '综合英语' },
  { id: 'speaking', label: '口语强化' },
  { id: 'ielts', label: '雅思' },
  { id: 'ielts-guarantee', label: '雅思保分' },
  { id: 'toeic', label: '托业' },
  { id: 'business', label: '商务英语' },
];

export const COMPARE_ROOM_SIZES: ReadonlyArray<{ beds: number; label: string }> = [
  { beds: 1, label: '单人间' },
  { beds: 2, label: '双人间' },
  { beds: 3, label: '三人间' },
  { beds: 4, label: '四人间' },
];

export type CompareCurrency = 'USD' | 'PHP';

export const COMPARE_CURRENCY_NAMES: Readonly<Record<CompareCurrency, string>> = { USD: '美元', PHP: '比索' };

/** Frankfurter rates; NaN while unavailable (renminbi amounts and the image stay blocked). */
export interface CompareRates {
  usdToCny: number;
  phpPerCny: number;
  date: string;
  live: boolean;
}

/** Conditions every school is priced with. */
export interface CompareConditions {
  weeks: number;
  /** Sunday arrival (yyyy-mm-dd). */
  startDate: string;
  ageGroup: 'adult' | 'minor';
  visaType: 'tourist30' | 'tourist59';
  /** Some schools' offers and price years depend on the registration date. */
  registrationDate: string;
}

export interface CompareCourseOption {
  id: string;
  name: string;
  schedule: string;
}

export interface CompareRoomOption {
  id: string;
  name: string;
  /** People per room; 0 when the name does not say. */
  beds: number;
  offCampus: boolean;
  suite: boolean;
  /** Four-week price, used to pick the cheaper of two matching rooms. */
  fee: number;
}

/** One school's priced plan, in the school's own currencies. */
export interface CompareSchoolResult {
  courseName: string;
  courseSchedule: string;
  roomName: string;
  /** Why the school's calculator cannot quote this plan; empty when it can. */
  error: string;
  tuition: number;
  accommodation: number;
  registration: number;
  discount: number;
  discountNames: string;
  surcharge: number;
  /** Everything paid to the school, after discounts. */
  schoolTotal: number;
  /** Fees paid at the school on arrival (local currency); never added to schoolTotal. */
  localTotal: number;
  /** School-specific notes for the sheet footer. */
  notes: string[];
}

export interface CompareSchoolPlan {
  courseId: string;
  roomId: string;
  /** Prices the plan with the school's own calculator. */
  result(conditions: CompareConditions): CompareSchoolResult;
}

/** One school in the comparison. */
export interface CompareSchool {
  readonly id: string;
  /** Short name on the column tag, for example “CIA”. */
  readonly tag: string;
  readonly name: string;
  /** Country in Chinese, for example “菲律宾”; the page lists schools by country. */
  readonly country: string;
  /** City, for example “宿务”; the sheet heading names it when every school shares it. */
  readonly city: string;
  /** City and area, for example “宿务市区 Talamban”. */
  readonly location: string;
  readonly pagePath: string;
  readonly schoolCurrency: CompareCurrency;
  readonly localCurrency: CompareCurrency;
  readonly courses: readonly CompareCourseOption[];
  readonly rooms: readonly CompareRoomOption[];
  /** Course ids for a goal, best match first; `closest` when the school has no real course of that kind. */
  goalCourses(goal: CompareGoal): { ids: string[]; closest?: boolean };
  /** Shortest quotable length of a course (guarantee courses), 0 when free. */
  minimumWeeks(courseId: string): number;
  createPlan(courseId: string, roomId: string): CompareSchoolPlan;
}

/** A school as the comparison page loads it: the school plus how to find and apply its published revision. */
export interface CompareSchoolSource {
  readonly school: CompareSchool;
  /** Database name of the school, used to find its published revision. */
  readonly pricingSchoolName: string;
  /** Applies a published revision; anything that is not this school's document is ignored. */
  applyPublished(content: unknown): void;
}

export interface CompareSelection {
  readonly school: CompareSchool;
  readonly plan: CompareSchoolPlan;
  /** Why the course differs from the chosen goal; cleared when the course is picked by hand. */
  courseNote: string;
  /** Why the room differs from the chosen room size; cleared when the room is picked by hand. */
  roomNote: string;
}

const WEEK_LIMIT = 24;

const slash = (value: string) => value.replace(/-/g, '/');

/** Reads people per room, campus and suite from a room name such as “校外公寓双人间” or “单人套房 SR-1”. */
export function compareRoomFacts(name: string): { beds: number; offCampus: boolean; suite: boolean } {
  const beds = /单人|单间/.test(name) ? 1 : /双人/.test(name) ? 2 : /三人/.test(name) ? 3 : /四人/.test(name) ? 4 : 0;
  return { beds, offCampus: name.includes('校外'), suite: name.includes('套房') };
}

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return isoDate(date) === value ? date : null;
}

export class SchoolPriceComparison {
  readonly maxSchools = 3;
  readonly minSchools = 2;
  readonly weekOptions = Array.from({ length: WEEK_LIMIT }, (_, index) => index + 1);
  readonly selections: CompareSelection[] = [];
  goal: CompareGoal = 'general';
  beds = 2;
  readonly conditions: CompareConditions = {
    weeks: 4,
    startDate: nextQuoteSunday(),
    ageGroup: 'adult',
    visaType: 'tourist59',
    registrationDate: isoDate(new Date()),
  };

  constructor(
    private readonly catalog: () => readonly CompareSchool[],
    private readonly rates: () => CompareRates,
  ) {}

  get schools(): readonly CompareSchool[] { return this.catalog(); }

  /** Countries with at least one school, in catalogue order. */
  get countries(): string[] {
    return [...new Set(this.catalog().map(school => school.country))];
  }

  /** A country's schools grouped by city, in catalogue order. */
  schoolsByCity(country: string): Array<{ city: string; schools: CompareSchool[] }> {
    const groups: Array<{ city: string; schools: CompareSchool[] }> = [];
    for (const school of this.catalog().filter(item => item.country === country)) {
      const group = groups.find(item => item.city === school.city);
      if (group) group.schools.push(school);
      else groups.push({ city: school.city, schools: [school] });
    }
    return groups;
  }

  /** Selects exactly the given schools (the student picks the rest) and matches their courses and rooms. */
  start(schoolIds: readonly string[] = []): void {
    const catalog = this.catalog();
    const picked = schoolIds
      .map(id => catalog.find(school => school.id === id))
      .filter((school, index, list): school is CompareSchool => !!school && list.indexOf(school) === index);
    this.selections.splice(0, this.selections.length,
      ...picked.slice(0, this.maxSchools).map(school => this.select(school)));
    this.respectMinimumWeeks();
  }

  isSelected(schoolId: string): boolean {
    return this.selections.some(selection => selection.school.id === schoolId);
  }

  /** A selected school can always be removed; another can be added while fewer than the maximum are chosen. */
  canToggle(schoolId: string): boolean {
    return this.isSelected(schoolId) || this.selections.length < this.maxSchools;
  }

  toggleSchool(schoolId: string): void {
    if (!this.canToggle(schoolId)) return;
    const index = this.selections.findIndex(selection => selection.school.id === schoolId);
    if (index >= 0) {
      this.selections.splice(index, 1);
      return;
    }
    const school = this.catalog().find(item => item.id === schoolId);
    if (!school) return;
    this.selections.push(this.select(school));
    this.respectMinimumWeeks();
  }

  setGoal(goal: CompareGoal): void {
    this.goal = goal;
    for (const selection of this.selections) this.matchCourse(selection);
    this.respectMinimumWeeks();
  }

  setBeds(beds: number): void {
    this.beds = beds;
    for (const selection of this.selections) this.matchRoom(selection);
  }

  setCourse(selection: CompareSelection, courseId: string): void {
    selection.plan.courseId = courseId;
    selection.courseNote = '';
    this.respectMinimumWeeks();
  }

  setRoom(selection: CompareSelection, roomId: string): void {
    selection.plan.roomId = roomId;
    selection.roomNote = '';
  }

  setWeeks(weeks: number): void {
    this.conditions.weeks = Math.min(WEEK_LIMIT, Math.max(1, Math.round(Number(weeks)) || 1));
  }

  /** Accepts Sundays only, like every school quote; returns false when the date was rejected. */
  setStartDate(value: string): boolean {
    const date = parseDate(value);
    if (!date || date.getDay() !== 0) return false;
    this.conditions.startDate = value;
    return true;
  }

  /** After a school's prices change (a published revision arrived): keep valid choices, re-match the rest. */
  retainValidSelections(): void {
    for (const selection of this.selections) {
      if (!selection.school.courses.some(course => course.id === selection.plan.courseId)) this.matchCourse(selection);
      if (!selection.school.rooms.some(room => room.id === selection.plan.roomId)) this.matchRoom(selection);
    }
  }

  /** Reads a shared link such as ?schools=ev,cia&from=ev&course=…&room=…&weeks=8&start=2027-03-07. */
  applyLink(params: { schools?: string; from?: string; course?: string; room?: string; weeks?: string; start?: string }): void {
    const ids = (params.schools ?? '').split(',').map(id => id.trim()).filter(Boolean);
    const from = this.catalog().find(school => school.id === params.from);
    this.start(from && !ids.includes(from.id) ? [from.id, ...ids] : ids);
    if (params.weeks) this.setWeeks(Number(params.weeks));
    if (params.start) this.setStartDate(params.start);
    const origin = this.selections.find(selection => selection.school.id === from?.id);
    if (!origin) return;
    const course = origin.school.courses.find(item => item.id === params.course);
    const goal = course ? COMPARE_GOALS.find(item => origin.school.goalCourses(item.id).ids.includes(course.id) && !origin.school.goalCourses(item.id).closest) : undefined;
    const room = origin.school.rooms.find(item => item.id === params.room);
    if (goal) this.setGoal(goal.id);
    if (room?.beds) this.setBeds(room.beds);
    if (course) this.setCourse(origin, course.id);
    if (room) this.setRoom(origin, room.id);
  }

  get results(): CompareSchoolResult[] {
    return this.selections.map(selection => selection.plan.result(this.conditions));
  }

  get ratesUsable(): boolean {
    const rates = this.rates();
    return Number.isFinite(rates.usdToCny) && rates.usdToCny > 0 && Number.isFinite(rates.phpPerCny) && rates.phpPerCny > 0;
  }

  get ready(): boolean {
    const results = this.results;
    return results.length >= this.minSchools && results.every(result => !result.error) && this.ratesUsable;
  }

  get endDate(): string {
    const start = parseDate(this.conditions.startDate);
    if (!start) return '';
    start.setDate(start.getDate() + this.conditions.weeks * 7 - 1);
    return isoDate(start);
  }

  /** Converts a school amount to renminbi; NaN while the rate is unavailable. */
  toCny(amount: number, currency: CompareCurrency): number {
    const rates = this.rates();
    const value = currency === 'USD' ? amount * rates.usdToCny : amount / rates.phpPerCny;
    return Number.isFinite(value) && this.ratesUsable ? Math.round(value) : Number.NaN;
  }

  /** The table and image data. Values of a school that cannot be quoted are ignored by both. */
  get sheet(): PlanCompareSheet {
    const results = this.results;
    const schools = this.selections.map(selection => selection.school);
    const money = (value: number, currency: CompareCurrency) => `${this.format(value)} ${COMPARE_CURRENCY_NAMES[currency]}`;
    const cny = (value: number) => Number.isFinite(value) ? `约 ${quoteCurrencyText(value, 'zh-CN')} 元人民币` : '人民币待更新';
    const goalLabel = COMPARE_GOALS.find(item => item.id === this.goal)?.label ?? '';
    const bedsLabel = COMPARE_ROOM_SIZES.find(item => item.beds === this.beds)?.label ?? '';
    const sameCurrency = schools.every(school => school.schoolCurrency === schools[0]?.schoolCurrency);

    const rows: PlanCompareRow[] = [
      { label: '课程', style: 'text', values: results.map(result => result.courseName) },
      { label: '每日课程', style: 'detail', values: results.map(result => result.courseSchedule) },
      { label: '住宿', style: 'text', values: results.map(result => result.roomName) },
      { label: '课程费', style: 'money', values: results.map((result, index) => money(result.tuition, schools[index].schoolCurrency)) },
      { label: '住宿费', style: 'money', values: results.map((result, index) => money(result.accommodation, schools[index].schoolCurrency)) },
      {
        label: '注册费', style: 'money',
        values: results.map((result, index) => result.registration > 0 ? money(result.registration, schools[index].schoolCurrency) : '免收'),
      },
      {
        label: '优惠', style: 'money',
        values: results.map((result, index) => result.discount > 0 ? `− ${money(result.discount, schools[index].schoolCurrency)}` : '—'),
        subValues: results.map(result => result.discountNames),
      },
      ...(results.some(result => result.surcharge > 0) ? [{
        label: '旺季附加费', style: 'money' as const,
        values: results.map((result, index) => result.surcharge > 0 ? money(result.surcharge, schools[index].schoolCurrency) : '—'),
      }] : []),
      {
        label: '学校费用合计', style: 'total',
        values: results.map((result, index) => money(result.schoolTotal, schools[index].schoolCurrency)),
        subValues: results.map((result, index) => cny(this.toCny(result.schoolTotal, schools[index].schoolCurrency))),
      },
      { label: '学校费用差价', style: 'diff', values: this.differences(results, schools, sameCurrency) },
      {
        label: '到校学杂费', style: 'subtotal',
        values: results.map((result, index) => money(Math.round(result.localTotal), schools[index].localCurrency)),
        subValues: results.map((result, index) => cny(this.toCny(result.localTotal, schools[index].localCurrency))),
      },
    ];

    const cities = [...new Set(schools.map(school => school.city))];
    const countries = [...new Set(schools.map(school => school.country))];
    const region = cities.length === 1 ? cities[0] : countries.length === 1 ? countries[0] : '';
    const notes = [
      '学校费用与到校学杂费分开支付；到校学杂费在到校后当地缴纳，不含接机和可退押金。',
      '各校课程、优惠和学杂费按各自学校的最新规则计算；每日课程节数和班型不同，请结合课程内容比较。',
      ...(results.some(result => result.surcharge > 0) ? ['旺季附加费按各校规定按周计收，课程与住宿重叠周只计一次，不参与折扣。'] : []),
      ...[...new Set(results.flatMap(result => result.notes))],
      this.rateNote,
      '以上为预估对比，最终以各校最新价格、空房、优惠及思达启航顾问确认为准。',
    ];

    return {
      heading: `${region}学校对比报价`,
      conditions: `相同条件：${[goalLabel, bedsLabel, `${this.conditions.weeks}周`, `${slash(this.conditions.startDate)}入学`].filter(Boolean).join(' · ')}`,
      plans: results.map((result, index) => ({
        tag: schools[index].tag,
        title: schools[index].location,
        ...(result.error ? { error: result.error } : {}),
      })),
      rows,
      notes,
    };
  }

  private get rateNote(): string {
    if (!this.ratesUsable) return '最新参考汇率待更新，人民币金额暂不可用。';
    const rates = this.rates();
    const dateText = rates.live && rates.date ? `（${slash(rates.date)}）` : '';
    return `参考汇率${dateText}：1美元≈${quoteCurrencyText(rates.usdToCny, 'zh-CN', { maximumFractionDigits: 4 })}元人民币，1元人民币≈${quoteCurrencyText(rates.phpPerCny, 'zh-CN', { maximumFractionDigits: 4 })}比索；最终以实际支付汇率为准。`;
  }

  /** Difference to the cheapest school, in the shared school currency or else in renminbi. */
  private differences(results: CompareSchoolResult[], schools: CompareSchool[], sameCurrency: boolean): string[] {
    const totals = results.map((result, index) => result.error ? Number.NaN
      : sameCurrency ? result.schoolTotal : this.toCny(result.schoolTotal, schools[index].schoolCurrency));
    const valid = totals.filter(Number.isFinite);
    if (valid.length < 2) return totals.map(() => '—');
    const lowest = Math.min(...valid);
    const unit = sameCurrency ? COMPARE_CURRENCY_NAMES[schools[0].schoolCurrency] : '元人民币';
    return totals.map(total => !Number.isFinite(total) ? '—'
      : total === lowest ? '最低' : `多 ${this.format(total - lowest)} ${unit}`);
  }

  private select(school: CompareSchool): CompareSelection {
    const plan = school.createPlan(school.courses[0]?.id ?? '', school.rooms[0]?.id ?? '');
    const selection: CompareSelection = { school, plan, courseNote: '', roomNote: '' };
    this.matchCourse(selection);
    this.matchRoom(selection);
    return selection;
  }

  private matchCourse(selection: CompareSelection): void {
    const { school, plan } = selection;
    const available = (ids: string[]) => ids.filter(id => school.courses.some(course => course.id === id));
    const goal = school.goalCourses(this.goal);
    const label = COMPARE_GOALS.find(item => item.id === this.goal)?.label ?? '';
    let ids = available(goal.ids);
    let note = '';
    if (!ids.length) {
      ids = available(school.goalCourses('general').ids);
      note = `${school.tag}暂无${label}课程，已选`;
    } else if (goal.closest) {
      note = `${school.tag}没有单独的${label}课程，已选最接近的`;
    }
    const courseId = ids[0] ?? school.courses[0]?.id ?? '';
    plan.courseId = courseId;
    const name = school.courses.find(course => course.id === courseId)?.name ?? '';
    selection.courseNote = note ? `${note}${name}` : '';
  }

  private matchRoom(selection: CompareSelection): void {
    const { school, plan } = selection;
    const byPrice = (a: CompareRoomOption, b: CompareRoomOption) => a.fee - b.fee;
    const same = school.rooms.filter(room => room.beds === this.beds);
    const standard = same.filter(room => !room.offCampus && !room.suite).sort(byPrice);
    const nearest = [...school.rooms].filter(room => room.beds > 0)
      .sort((a, b) => Math.abs(a.beds - this.beds) - Math.abs(b.beds - this.beds) || Number(a.offCampus || a.suite) - Number(b.offCampus || b.suite) || byPrice(a, b));
    const room = standard[0] ?? same.sort(byPrice)[0] ?? nearest[0] ?? school.rooms[0];
    plan.roomId = room?.id ?? '';
    const label = COMPARE_ROOM_SIZES.find(item => item.beds === this.beds)?.label ?? '';
    selection.roomNote = room && room.beds !== this.beds ? `${school.tag}没有${label}，已选${room.name}` : '';
  }

  /** Guarantee courses need a fixed block; lengthen the shared weeks instead of showing an error. */
  private respectMinimumWeeks(): void {
    const minimum = Math.max(0, ...this.selections.map(selection => selection.school.minimumWeeks(selection.plan.courseId)));
    if (minimum > this.conditions.weeks) this.setWeeks(minimum);
  }

  private format(value: number): string {
    if (!Number.isFinite(value)) return '—';
    return value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(value) ? 0 : 1, maximumFractionDigits: 2 });
  }
}
