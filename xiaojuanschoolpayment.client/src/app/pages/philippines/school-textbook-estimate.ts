import { QuotePlanRow } from '../../components/school-quote-plan';

/** Group one student's material requirements; never share quantities across students. */
export function textbookType(id: string): string {
  const key = id.toLowerCase();
  for (const type of ['ielts', 'toeic', 'toefl', 'business', 'tesol', 'pte', 'junior', 'kids', 'guardian', 'family', 'kindergarten']) {
    if (key.includes(type)) return type;
  }
  if (/esl|speaking|sparta|eep|infinity|general|intensive|light/.test(key)) return 'esl';
  return key;
}
export function textbookGroups(rows: QuotePlanRow[], key: (id: string) => string = textbookType): { type: string; weeks: number }[] {
  const groups = new Map<string, number>();
  for (const row of rows) {
    if (!Number.isFinite(row.weeks) || row.weeks <= 0) continue;
    const type = key(row.optionId);
    groups.set(type, (groups.get(type) ?? 0) + row.weeks);
  }
  return [...groups].map(([type, weeks]) => ({ type, weeks }));
}
export function textbookPeriods(rows: QuotePlanRow[], period: number, rounding: 'ceil' | 'proportional' = 'ceil', key: (id: string) => string = textbookType): number {
  return textbookGroups(rows, key).reduce((sum, group) => sum + (rounding === 'ceil' ? Math.ceil(group.weeks / Math.max(1, period)) : group.weeks / Math.max(1, period)), 0);
}

/** A published one-time estimate is per material type; do not impose another school's cycle. */
export function textbookRuleQuantity(rows: QuotePlanRow[], rule: {billingRule: string; periodWeeks?: number; rounding?: string} | undefined, fallbackPeriod: number): number {
  if (rule?.billingRule === 'once') return textbookGroups(rows).length;
  return textbookPeriods(rows, rule?.periodWeeks ?? fallbackPeriod, rule?.rounding === 'proportional' ? 'proportional' : 'ceil');
}
