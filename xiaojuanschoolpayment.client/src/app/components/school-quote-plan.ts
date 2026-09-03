import { QuoteImageCardData, QuoteImagePaymentItem } from './quote-image-download-button.component';

export type QuotePlanKind = 'course' | 'room';
export interface QuotePlanRow { id: number; optionId: string; weeks: number; startDate: string; textbookId?: string; }
export interface QuotePlanOption { id: string; name: string; details: string; }
const DAY = 86400000;
export const quoteMoney = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** Independent selections; school adapters retain ownership of prices and fee rules. */
export class SchoolQuotePlan {
  courses: QuotePlanRow[];
  rooms: QuotePlanRow[];
  private nextId = 3;
  constructor(
    courseId: string, roomId: string, startDate: string,
    readonly allowedWeeks: readonly number[],
    readonly options: (kind: QuotePlanKind) => QuotePlanOption[],
    readonly price: (kind: QuotePlanKind, row: QuotePlanRow) => number,
    readonly maxWeeks = 24,
  ) {
    this.courses = [{ id: 1, optionId: courseId, weeks: 4, startDate }];
    this.rooms = [{ id: 2, optionId: roomId, weeks: 4, startDate }];
  }
  rows(kind: QuotePlanKind) { return kind === 'course' ? this.courses : this.rooms; }
  get courseWeeks() { return this.courses.reduce((sum, row) => sum + row.weeks, 0); }
  get roomWeeks() { return this.rooms.reduce((sum, row) => sum + row.weeks, 0); }
  date(value: string): number | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === value ? date : null;
  }
  end(row: QuotePlanRow) {
    const start = this.date(row.startDate);
    return start === null ? '' : new Date(start + (row.weeks * 7 - 1) * DAY).toISOString().slice(0, 10);
  }
  get startDate() { return [...this.courses, ...this.rooms].map(row => row.startDate).filter(value => this.date(value) !== null).sort()[0] ?? ''; }
  get endDate() { return [...this.courses, ...this.rooms].map(row => this.end(row)).filter(Boolean).sort().at(-1) ?? ''; }
  get stayWeeks() {
    const start = this.date(this.startDate), end = this.date(this.endDate);
    return start === null || end === null ? 0 : Math.ceil((end - start + DAY) / (7 * DAY));
  }
  days(rows: QuotePlanRow[]): Set<number> {
    const days = new Set<number>();
    for (const row of rows) {
      const start = this.date(row.startDate);
      if (start === null || !this.allowedWeeks.includes(row.weeks)) continue;
      for (let day = 0; day < row.weeks * 7; day++) days.add(start + day * DAY);
    }
    return days;
  }
  weekStarts(rows = this.courses): number[] {
    const starts = new Set<number>();
    for (const row of rows) {
      const start = this.date(row.startDate);
      if (start === null || !this.allowedWeeks.includes(row.weeks)) continue;
      for (let week = 0; week < row.weeks; week++) starts.add(start + week * 7 * DAY);
    }
    return [...starts].sort((a, b) => a - b);
  }
  overlapWeeks(start: string, end: string, rows = this.courses) {
    const from = this.date(start), to = this.date(end);
    if (from === null || to === null) return 0;
    return this.weekStarts(rows).filter(week => week <= to && week + 6 * DAY >= from).length;
  }
  covers(start: string, end: string, rows = this.courses) {
    const from = this.date(start), to = this.date(end), days = this.days(rows);
    if (from === null || to === null) return false;
    for (let date = from; date <= to; date += DAY) if (!days.has(date)) return false;
    return true;
  }
  get mismatch() {
    const courses = this.days(this.courses), rooms = this.days(this.rooms);
    return courses.size !== rooms.size || [...courses].some(day => !rooms.has(day));
  }
  get error(): string {
    for (const kind of ['course', 'room'] as const) {
      const rows = this.rows(kind), label = kind === 'course' ? '课程' : '住宿';
      if (!rows.length) return `请至少选择一项${label}。`;
      if (rows.some(row => !this.options(kind).some(option => option.id === row.optionId))) return `请重新选择有效的${label}类型。`;
      if (rows.some(row => !this.allowedWeeks.includes(row.weeks))) return `请在${label}周数选项中选择。`;
      if (rows.reduce((sum, row) => sum + row.weeks, 0) > this.maxWeeks) return `${label}累计不能超过${this.maxWeeks}周。`;
      if (rows.some(row => this.date(row.startDate) === null || new Date(this.date(row.startDate)!).getUTCDay() !== 0)) return `${label}开始日期请选择周日。`;
      if (this.days(rows).size !== rows.reduce((sum, row) => sum + row.weeks * 7, 0)) return `${label}日期有重叠，请调整后再保存报价。`;
    }
    return this.stayWeeks > this.maxWeeks ? `所选日期超出${this.maxWeeks}周报价范围，请缩短日期间隔。` : '';
  }
  get warning() { return !this.error && this.mismatch ? '课程与住宿日期不一致，请确认未安排的住宿或课程。' : ''; }
  canAdd(kind: QuotePlanKind) { return this.maxWeeks - this.rows(kind).reduce((sum, row) => sum + row.weeks, 0) >= Math.min(...this.allowedWeeks); }
  add(kind: QuotePlanKind) {
    if (!this.canAdd(kind)) return;
    const rows = this.rows(kind), last = rows[rows.length - 1];
    const remaining = this.maxWeeks - rows.reduce((sum, row) => sum + row.weeks, 0);
    const weeks = this.allowedWeeks.filter(week => week <= Math.min(4, remaining)).at(-1)!;
    const latest = rows.map(row => this.end(row)).sort().at(-1)!;
    const next = this.date(latest);
    rows.push({ id: this.nextId++, optionId: last.optionId, weeks, startDate: next === null ? last.startDate : new Date(next + DAY).toISOString().slice(0, 10) });
  }
  remove(kind: QuotePlanKind, id: number) {
    const rows = this.rows(kind);
    const index = rows.findIndex(row => row.id === id);
    if (rows.length > 1 && index >= 0) rows.splice(index, 1);
  }
  total(kind: QuotePlanKind) { return this.rows(kind).reduce((sum, row) => sum + this.price(kind, row), 0); }
  shortStayNotes(multiplier: (weeks: number) => number): string[] {
    const weeks = [...new Set([...this.courses, ...this.rooms].map(row => row.weeks).filter(week => week < 4))].sort((a, b) => a - b);
    return weeks.map(week => `${week}周课程或住宿按对应4周价格的${quoteMoney(multiplier(week) * 100)}%计费。`);
  }
  paymentItems(): QuoteImagePaymentItem[] {
    return (['course', 'room'] as const).flatMap(kind => [...this.rows(kind)].sort((a, b) => a.startDate.localeCompare(b.startDate)).map((row, index) => {
      const option = this.options(kind).find(option => option.id === row.optionId);
      return {
        icon: kind === 'course' ? '课' : '宿',
        label: `${kind === 'course' ? '课程费' : '住宿费'}${this.rows(kind).length > 1 ? index + 1 : ''}`,
        amount: `${quoteMoney(this.price(kind, row))} 美元`,
        detailTitle: option?.name ?? '请选择类型',
        detailSubtitle: `${row.startDate.replace(/-/g, '/')}–${this.end(row).replace(/-/g, '/')} · ${row.weeks}周`,
        note: option?.details ?? '',
      };
    }));
  }
}

/** Share only presentation, never school-specific calculation or discount logic. */
export function presentSchoolQuote(quote: QuoteImageCardData, plan: SchoolQuotePlan, school: string, usd: number, rate: number): QuoteImageCardData {
  const items = quote.paymentItems.filter(item => item.label !== '课程费' && item.label !== '住宿费');
  items.splice(1, 0, ...plan.paymentItems());
  return applySchoolQuoteImageLayout({
    ...quote, paymentItems: items,
    importantNotes: [...(plan.warning ? [plan.warning] : []), ...(quote.importantNotes ?? [])],
  }, school, plan.courseWeeks, plan.startDate, usd, rate);
}

/** Shared presentation for schools with either the shared plan or their own calculator. */
export function applySchoolQuoteImageLayout(quote: QuoteImageCardData, school: string, weeks: number, startDate: string, usd: number, rate: number): QuoteImageCardData {
  return {
    // All participating schools use one approved image template, even for a single period.
    ...quote, layout: 'cia-detailed', fullFeeDetails: true, localFeeTableLayout: 'web',
    headingText: `${school}${weeks}周报价`, title: `${weeks}周`, subtitle: '',
    fileName: `${school}${weeks}周报价-${startDate.replace(/-/g, '')}.png`,
    paymentSectionTitle: '学校费用明细', localFeeTitle: '到校后学杂费明细',
    totalUsd: `${quoteMoney(usd)} 美元`, totalCny: `人民币预计金额：约 ${Math.round(usd * rate).toLocaleString('zh-CN')} 元`,
  };
}
