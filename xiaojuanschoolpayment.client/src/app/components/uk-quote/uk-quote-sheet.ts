// Shared quote sheet for UK schools. A UK quote is built from weekly package or tiered course
// prices plus accommodation and one-time fees; unlike the Philippine quotes there are no
// peso local fees. The school's own module computes the plans; the web table
// (UkQuoteSheetComponent) and the quote image (uk-quote-image-renderer.ts) both render this
// sheet, so the page and the image always show the same rows.
// Keep this file free of Angular, DOM, storage and regex lookbehind (mini program compatible).

/** One compared plan. `tag` is 方案一/方案二, empty for a single-plan quote. */
export interface UkQuotePlanHeader {
  tag: string;
  title: string;
}

/** `included` shows 已含, `null` shows 不适用. */
export type UkQuoteAmount = number | 'included' | null;

export interface UkQuoteMoneyRow {
  label: string;
  note?: string;
  amounts: UkQuoteAmount[];
}

/** Text with `{{emphasis}}` markers, which both renderers draw in orange. */
export interface UkQuoteTextRow {
  label: string;
  /** One value per plan; a single value spans every plan column. */
  values: string[];
}

export interface UkQuoteOptionalRow {
  label: string;
  note?: string;
  price: string;
  /** Short tag such as 不在套餐内. */
  tag?: string;
}

export interface UkQuoteInfoItem {
  label: string;
  value: string;
  wide?: boolean;
}

export interface UkQuoteContact {
  name: string;
  title: string;
  phone: string;
  qrSrc: string;
  website: string;
}

export interface UkQuoteSheet {
  fileName: string;
  schoolName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  quoteDate: string;
  currencyLabel: string;
  info: UkQuoteInfoItem[];
  plans: UkQuotePlanHeader[];
  requiredRows: UkQuoteMoneyRow[];
  /** Null when a plan cannot be priced. */
  requiredTotals: Array<number | null>;
  /** Renminbi estimates of the totals, null while the rate is unavailable. */
  requiredTotalsCny: Array<number | null>;
  rateNote: string;
  includeRows: UkQuoteTextRow[];
  examples: Array<{ label: string; text: string }>;
  examplesTitle: string;
  optionalRows: UkQuoteOptionalRow[];
  optionalNote: string;
  notes: string[];
  contact: UkQuoteContact;
  /** Blocking problems; a sheet with issues must not be exported. */
  issues: string[];
  /** Non-blocking reminders shown on the page and, as notes, in the image. */
  warnings: string[];
}

export const UK_QUOTE_WEBSITE = 'sidaqihang.com';
export const UK_QUOTE_PLAN_TAGS = ['方案一', '方案二'];

export function ukMoney(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

export function ukAmountText(amount: UkQuoteAmount): string {
  if (amount === 'included') return '已含';
  if (amount === null) return '不适用';
  return ukMoney(amount);
}

/** Splits `{{emphasis}}` markup into plain and emphasised runs. */
export function ukEmphasisRuns(text: string): Array<{ text: string; emphasis: boolean }> {
  const runs: Array<{ text: string; emphasis: boolean }> = [];
  let rest = text;
  while (rest.length) {
    const start = rest.indexOf('{{');
    const end = start < 0 ? -1 : rest.indexOf('}}', start + 2);
    if (start < 0 || end < 0) {
      runs.push({ text: rest, emphasis: false });
      break;
    }
    if (start > 0) runs.push({ text: rest.slice(0, start), emphasis: false });
    runs.push({ text: rest.slice(start + 2, end), emphasis: true });
    rest = rest.slice(end + 2);
  }
  return runs.filter(run => run.text.length > 0);
}

/** The text without emphasis markers, for plain renderings. */
export function ukPlainText(text: string): string {
  return ukEmphasisRuns(text).map(run => run.text).join('');
}

/** Sunday-based helpers shared by UK school calculators (dates are YYYY-MM-DD, UTC). */
export function ukParseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value ? null : date;
}

export function ukAddDays(value: string, days: number): string {
  const date = ukParseDate(value);
  if (!date) return value;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function ukIsSunday(value: string): boolean {
  return ukParseDate(value)?.getUTCDay() === 0;
}

export function ukDateText(value: string): string {
  const date = ukParseDate(value);
  if (!date) return value;
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getUTCDay()];
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日（${weekday}）`;
}

export function ukShortDateText(value: string): string {
  const date = ukParseDate(value);
  if (!date) return value;
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getUTCDay()];
  return `${date.getUTCMonth() + 1}月${date.getUTCDate()}日（${weekday}）`;
}

/** Number of Sunday-to-Saturday weeks starting at `start` that touch the inclusive range. */
export function ukOverlapWeeks(start: string, weeks: number, rangeStart: string, rangeEnd: string): number {
  let count = 0;
  for (let index = 0; index < weeks; index += 1) {
    const weekStart = ukAddDays(start, index * 7);
    const weekEnd = ukAddDays(weekStart, 6);
    if (weekStart <= rangeEnd && weekEnd >= rangeStart) count += 1;
  }
  return count;
}

/** Renminbi estimate; null while no usable rate exists. */
export function ukCny(amount: number | null, gbpToCny: number | null): number | null {
  if (amount === null || gbpToCny === null || !Number.isFinite(gbpToCny) || gbpToCny <= 0) return null;
  return Math.round(amount * gbpToCny);
}
