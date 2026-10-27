export const ASSOCIATION_PEAK_SURCHARGE_2026 = 40;
export const ASSOCIATION_PEAK_SURCHARGE_FROM_2027 = 60;
/** One-time Published-content migration introduced by the 2026-10-26 joint notice. */
export const ASSOCIATION_PEAK_POLICY_VERSION = 20271026;

export const ASSOCIATION_PEAK_SCHOOL_CODES = [
  'ANJ',
  'BECI',
  'MONOL',
  'MONOL-SPARTA',
  'PINES',
  'JIC',
  'WALES',
  'BLUE-OCEAN',
  'BTES',
  'CELLA-UNI',
  'CELLA-PREMIUM',
  'CG-BANILAD',
  'CG-SPARTA',
  'EV',
  'PHILINTER',
] as const;

export type AssociationPeakSchoolCode = (typeof ASSOCIATION_PEAK_SCHOOL_CODES)[number];

export interface AssociationPeakRange {
  start: string;
  end: string;
  enabled?: boolean;
}

export interface AssociationPeakRateBreakdown {
  rate: number;
  weeks: number;
}

export interface AssociationPeakCalculation {
  weeks: number;
  total: number;
  breakdown: AssociationPeakRateBreakdown[];
}

const DAY = 86_400_000;
const associationCodes = new Set<string>(ASSOCIATION_PEAK_SCHOOL_CODES);

export const isAssociationPeakSchool = (schoolCode: string): schoolCode is AssociationPeakSchoolCode =>
  associationCodes.has(schoolCode);

/**
 * The joint BESA/CALA notice fixes the rate independently of employee-published
 * copy: USD 40 through 2026, then USD 60 from 2027 onward. Non-member schools
 * keep their own configured rate.
 */
export function associationPeakRateForWeek(
  schoolCode: string,
  weekStart: number | string,
  configuredRate: number,
): number {
  if (!isAssociationPeakSchool(schoolCode)) return configuredRate;
  const value = typeof weekStart === 'number' ? weekStart : Date.parse(`${weekStart}T00:00:00Z`);
  if (!Number.isFinite(value)) return configuredRate;
  return new Date(value).getUTCFullYear() >= 2027
    ? ASSOCIATION_PEAK_SURCHARGE_FROM_2027
    : ASSOCIATION_PEAK_SURCHARGE_2026;
}

/** Charge each unique study/accommodation week once, even when both overlap. */
export function calculateAssociationPeakSurcharge(
  schoolCode: string,
  weekStarts: readonly number[],
  ranges: readonly AssociationPeakRange[],
  configuredRate: number,
): AssociationPeakCalculation {
  const activeRanges = ranges
    .filter(range => range.enabled !== false)
    .map(range => ({
      start: Date.parse(`${range.start}T00:00:00Z`),
      end: Date.parse(`${range.end}T00:00:00Z`),
    }))
    .filter(range => Number.isFinite(range.start) && Number.isFinite(range.end));
  const uniqueWeeks = [...new Set(weekStarts)]
    .filter(week => activeRanges.some(range => week <= range.end && week + 6 * DAY >= range.start))
    .sort((a, b) => a - b);
  const grouped = new Map<number, number>();
  for (const week of uniqueWeeks) {
    const rate = associationPeakRateForWeek(schoolCode, week, configuredRate);
    grouped.set(rate, (grouped.get(rate) ?? 0) + 1);
  }
  const breakdown = [...grouped.entries()].map(([rate, weeks]) => ({ rate, weeks }));
  return {
    weeks: uniqueWeeks.length,
    total: breakdown.reduce((sum, item) => sum + item.rate * item.weeks, 0),
    breakdown,
  };
}

export function associationPeakBreakdownText(calculation: AssociationPeakCalculation): string {
  return calculation.breakdown.map(item => `${item.rate}美元／周 × ${item.weeks}周`).join('；');
}
