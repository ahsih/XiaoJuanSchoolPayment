/**
 * The brand is always written in full as 思达启航. Saved school content revisions may still carry the
 * short name 思达 or the former name 思达游学, so public pages pass published content through here.
 * Pure code: no Angular, DOM or regex lookbehind.
 */
export function fullBrandName(text: string): string {
  return text.replace(/思达游学/g, '思达启航').replace(/思达(?!启航)/g, '思达启航');
}

/** Returns a copy of a JSON value with every string passed through fullBrandName. */
export function withFullBrandName<T>(value: T): T {
  if (typeof value === 'string') return fullBrandName(value) as T;
  if (Array.isArray(value)) return value.map(item => withFullBrandName(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withFullBrandName(item)])) as T;
  }
  return value;
}
