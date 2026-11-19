// Side-by-side comparison of two or three quote plans for one student (for example different
// rooms, courses or durations at the same school). A school's calculator fills the sheet; the
// web table (PlanCompareTableComponent) and the quote image (plan-compare-image-renderer.ts)
// both draw this same data, so the page and the image always agree.
// Keep this file free of Angular and DOM types: the WeChat mini program can bundle it.

/** How a row is emphasised: plain text, a small grey detail, money, a subtotal, the grand total or a difference. */
export type PlanCompareRowStyle = 'text' | 'detail' | 'money' | 'subtotal' | 'total' | 'diff';

export interface PlanCompareRow {
  label: string;
  /** One value per plan, in plan order. */
  values: string[];
  /** Optional second line per plan (for example the renminbi estimate or discount names). */
  subValues?: string[];
  style: PlanCompareRowStyle;
}

export interface PlanCompareColumn {
  /** Short tag such as “方案A”. */
  tag: string;
  /** What makes this plan different, for example the room or course name. */
  title: string;
  /** Why this plan cannot be quoted yet; its values are then shown as “—”. */
  error?: string;
}

export interface PlanCompareSheet {
  /** Image heading, for example “CIA 方案对比报价”. */
  heading: string;
  /** What every plan has in common, for example “Regular ESL · 4周 · 2027/03/07入学”. */
  conditions: string;
  plans: PlanCompareColumn[];
  rows: PlanCompareRow[];
  /** Short footer notes (exchange rate, exclusions, final confirmation). */
  notes: string[];
}

/** True when every plan can be quoted, so the image may be exported. */
export function planCompareReady(sheet: PlanCompareSheet): boolean {
  return sheet.plans.length >= 2 && sheet.plans.every(plan => !plan.error);
}
