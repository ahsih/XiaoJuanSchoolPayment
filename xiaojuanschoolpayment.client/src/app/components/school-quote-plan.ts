import { QuoteImageCardData, QuoteImagePaymentItem } from './quote-image-download-button.component';

export type QuotePlanKind = 'course' | 'room';
export interface QuotePlanRow { id: number; optionId: string; weeks: number; startDate: string; textbookId?: string; occupant?: number; }
export interface QuotePlanOption { id: string; name: string; details: string; group?: string; }

export interface EditableQuoteImageCopySettings {
  paymentNotes: { registration: string; course: string; accommodation: string; promotion: string };
  promotionNotes?: Record<string, string>;
  localFeeNotes: Record<string, string>;
  supplementalFeeNotes?: Record<string, string>;
}

export interface QuoteImageCopyPromotion {
  id: string;
  name: string;
  description?: string;
  ruleKind?: string;
  waiveRegistration?: boolean;
}

export interface QuoteImageCopyLocalFee {
  id: string;
  name: string;
  futureName?: string;
  note?: string;
}

const DAY = 86400000;
export const quoteMoney = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

const owns = (record: Record<string, string> | undefined, key: string): boolean =>
  !!record && Object.prototype.hasOwnProperty.call(record, key);

/** Stable key for image-only rows that are not backed by an ordinary local-fee rule. */
export const quoteImageSupplementalKey = (kind: 'payment' | 'optional', label: string): string => {
  const normalized = label
    .replace(/^学生[\d、]+\s*[·：]\s*/, '')
    .replace(/（\d+人(?:合计|适用)?）/g, '')
    .trim();
  return `${kind}:${normalized}`;
};

const plainQuoteImageLabel = (label: string): string => label
  .replace(/^学生[\d、]+\s*[·：]\s*/, '')
  .replace(/（\d+人(?:合计|适用)?）/g, '')
  .trim();

const promotionsForImageItem = (
  item: QuoteImagePaymentItem,
  promotions: readonly QuoteImageCopyPromotion[],
): QuoteImageCopyPromotion[] => {
  const label = quoteImageSupplementalKey('payment', item.label).slice('payment:'.length);
  const note = item.note ?? '';
  if (item.promotionKey) {
    const keyed = promotions.filter(rule => rule.id === item.promotionKey);
    if (keyed.length) return keyed;
  }
  const exact = promotions.filter(rule => label === rule.name || label.includes(rule.name));
  if (exact.length) return exact;
  const described = promotions.filter(rule => note.includes(rule.name) || (!!rule.description && note.includes(rule.description)));
  if (described.length) return described;
  if (label.includes('注册费') && item.amount.trim().startsWith('−')) return promotions.filter(rule => rule.waiveRegistration);
  const aliases: Array<[string, (rule: QuoteImageCopyPromotion) => boolean]> = [
    ['思达', rule => rule.name.includes('思达')],
    ['学校优惠', rule => rule.name.includes('学校') || rule.id.startsWith('glc-school-window-')],
    ['淡季', rule => rule.name.includes('淡季') || (rule.ruleKind ?? '').includes('off-season')],
    ['长期', rule => rule.name.includes('长期') || (rule.ruleKind ?? '').includes('long-stay')],
    ['圣诞', rule => rule.name.includes('圣诞') || (rule.ruleKind ?? '').includes('christmas')],
    ['生日', rule => rule.name.includes('生日') || (rule.ruleKind ?? '').includes('birthday')],
  ];
  const alias = aliases.find(([text]) => label.includes(text));
  return alias ? promotions.filter(alias[1]) : [];
};

const preserveScopePrefix = (original: string | undefined, replacement: string): string => {
  if (!replacement) return '';
  const prefix = original?.match(/^(?:学生[\d、]+(?:适用)?|\d+人适用)[：；]\s*/)?.[0] ?? '';
  return `${prefix}${replacement}`;
};

const mergeEditableFeeNote = (original: string, defaultNote: string | undefined, editedNote: string): string => {
  // An unchanged default must not replace student-specific visa, quantity or date text.
  if (editedNote === (defaultNote ?? '')) return original;
  if (editedNote && original.includes(editedNote)) return original;
  if (defaultNote && original.includes(defaultNote)) {
    return original.replace(defaultNote, editedNote).replace(/^[；;\s]+|[；;\s]+$/g, '').replace(/[；;]{2,}/g, '；');
  }
  if (!editedNote) return original === defaultNote ? '' : original;
  return [editedNote, original].filter(Boolean).join('；');
};

/**
 * Apply employee-edited image copy after a school has finished its calculation.
 * Amounts, dates and eligibility remain owned by the school calculator.
 */
export function applyEditableQuoteImageCopy<T extends QuoteImageCardData>(
  quote: T,
  settings: EditableQuoteImageCopySettings | undefined,
  promotions: readonly QuoteImageCopyPromotion[] = [],
  localFees: readonly QuoteImageCopyLocalFee[] = [],
): T {
  if (!settings) return quote;
  const paymentItems = applyEditableQuotePaymentItems(quote.paymentItems, settings, promotions);
  const localFeeItems = quote.localFeeItems?.map(item => {
    const label = plainQuoteImageLabel(item.label);
    const fee = localFees.find(rule => label === rule.name || label === rule.futureName);
    return fee && owns(settings.localFeeNotes, fee.id)
      ? { ...item, note: mergeEditableFeeNote(item.note, fee.note, settings.localFeeNotes[fee.id]) }
      : item;
  });
  const optionalFeeItems = quote.optionalFeeItems?.map(item => {
    const label = plainQuoteImageLabel(item.label);
    const fee = localFees.find(rule => label === rule.name || label === rule.futureName);
    if (fee && owns(settings.localFeeNotes, fee.id)) {
      return { ...item, note: mergeEditableFeeNote(item.note, fee.note, settings.localFeeNotes[fee.id]) };
    }
    const key = quoteImageSupplementalKey('optional', item.label);
    if (owns(settings.supplementalFeeNotes, key)) return { ...item, note: settings.supplementalFeeNotes![key] };
    if (label.startsWith('教材价格参考') && owns(settings.supplementalFeeNotes, 'optional:教材价格参考')) {
      return { ...item, note: settings.supplementalFeeNotes!['optional:教材价格参考'] };
    }
    if (item.label.includes('额外住宿') && owns(settings.supplementalFeeNotes, 'extra-night-0')) {
      return { ...item, note: settings.supplementalFeeNotes!['extra-night-0'] };
    }
    return item;
  });
  return { ...quote, paymentItems, localFeeItems, optionalFeeItems };
}

/** Apply only employee-owned promotion and supplemental explanations to a visible webpage payment list. */
export function applyEditableQuotePaymentItems<T extends QuoteImagePaymentItem>(
  items: readonly T[],
  settings: EditableQuoteImageCopySettings | undefined,
  promotions: readonly QuoteImageCopyPromotion[] = [],
): T[] {
  if (!settings) return [...items];
  return items.map(item => {
    if (item.icon === '注' || item.icon === '课' || item.icon === '宿') return item;
    const matchedPromotions = promotionsForImageItem(item, promotions);
    const editedPromotionNotes = matchedPromotions
      .filter(promotion => owns(settings.promotionNotes, promotion.id))
      .map(promotion => settings.promotionNotes![promotion.id]);
    if (editedPromotionNotes.length) {
      return { ...item, note: preserveScopePrefix(item.note, editedPromotionNotes.filter(Boolean).join('；')) };
    }
    const key = quoteImageSupplementalKey('payment', item.label);
    return owns(settings.supplementalFeeNotes, key)
      ? { ...item, note: preserveScopePrefix(item.note, settings.supplementalFeeNotes![key]) }
      : item;
  }) as T[];
}

/** Independent selections; school adapters retain ownership of prices and fee rules. */
export class SchoolQuotePlan {
  courses: QuotePlanRow[];
  rooms: QuotePlanRow[];
  protected nextId = 3;
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
        detailTitle: option?.group ? `${option.group}｜${option.name}` : option?.name ?? '请选择类型',
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
