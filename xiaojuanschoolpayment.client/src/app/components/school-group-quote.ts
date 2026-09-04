import { QuoteImagePaymentItem } from './quote-image-download-button.component';
import { quoteMoney } from './school-quote-plan';

export const SCHOOL_VISA_OPTIONS = [
  { value: 'tourist30', label: '30天旅游签证' }, { value: 'tourist59', label: '59天旅游签证' },
  { value: 'student', label: '学生签证' }, { value: 'work', label: '工作签证' },
  { value: 'srrv', label: 'SRRV绿卡' }, { value: 'sirv', label: 'SIRV卡' },
] as const;
export type SchoolVisaType = typeof SCHOOL_VISA_OPTIONS[number]['value'];
export interface SchoolLocalFee { item: string; unitLabel: string; quantity: number; total: number; note: string; }
export interface SchoolPaymentLine { icon: string; label: string; value: number; note: string; promotionKey?: string; }
export const moneyLine = (line: SchoolPaymentLine): QuoteImagePaymentItem => ({
  icon: line.icon, label: line.label,
  amount: `${line.value < 0 ? '− ' : ''}${quoteMoney(Math.abs(line.value))} 美元`, note: line.note,
  accent: line.value < 0,
});

/** Aggregate presentation only. Each school computes its own per-person amounts first. */
export function groupLocalFees(students: readonly { localFees: SchoolLocalFee[] }[]): SchoolLocalFee[] {
  if (students.length === 1) return students[0].localFees;
  const groups = new Map<string, { fee: SchoolLocalFee; students: number[]; order: number }>();
  students.forEach((student, index) => student.localFees.forEach((fee, order) => {
    const key = JSON.stringify([fee.item, fee.unitLabel, fee.note]);
    const existing = groups.get(key);
    if (existing) { existing.fee.quantity += fee.quantity; existing.fee.total += fee.total; existing.students.push(index + 1); }
    else groups.set(key, { fee: { ...fee }, students: [index + 1], order });
  }));
  return [...groups.values()].sort((a, b) => a.order - b.order).map(({ fee, students: people }) => ({
    ...fee, item: people.length === students.length ? fee.item : `学生${people.join('、')} · ${fee.item}`,
  }));
}

export function groupPaymentLines(students: readonly { paymentLines: SchoolPaymentLine[] }[], mergePromotions: boolean): QuoteImagePaymentItem[] {
  if (students.length === 1) return students[0].paymentLines.map(moneyLine);
  const result: QuoteImagePaymentItem[] = [];
  const groups = new Map<string, { line: SchoolPaymentLine; target: QuoteImagePaymentItem; notes: Map<string, number[]>; people: number[] }>();
  students.forEach((student, index) => student.paymentLines.forEach(line => {
    if (!mergePromotions || !line.promotionKey) {
      result.push(moneyLine({ ...line, label: `学生${index + 1} · ${line.label}` }));
      return;
    }
    let group = groups.get(line.promotionKey);
    if (!group) {
      group = { line: { ...line, value: 0 }, target: moneyLine(line), notes: new Map(), people: [] };
      groups.set(line.promotionKey, group); result.push(group.target);
    }
    group.line.value += line.value; group.people.push(index + 1);
    group.notes.set(line.note, [...(group.notes.get(line.note) ?? []), index + 1]);
  }));
  groups.forEach(group => {
    Object.assign(group.target, moneyLine(group.line));
    if (group.people.length === 1) group.target.label = `学生${group.people[0]} · ${group.line.label}`;
    else if (group.notes.size === 1) group.target.note = `${group.people.length === students.length ? `${students.length}人适用` : `学生${group.people.join('、')}适用`}；${group.line.note}`;
    else group.target.note = [...group.notes].map(([note, people]) => `学生${people.join('、')}：${note}`).join('\n');
  });
  return result;
}
