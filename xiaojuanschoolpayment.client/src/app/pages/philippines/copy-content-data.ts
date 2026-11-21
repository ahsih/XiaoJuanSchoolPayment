/**
 * Deep copy of plain content data (objects, arrays, strings, numbers, booleans, null), the same as
 * structuredClone gives for it, including keys whose value is undefined. The WeChat mini program bundles the
 * school content configs and its runtime has no structuredClone. Keep it pure.
 */
export function copyContentData<T>(value: T): T {
  if (Array.isArray(value)) return value.map(item => copyContentData(item)) as T;
  if (value && typeof value === 'object') {
    const copy: Record<string, unknown> = {};
    for (const key of Object.keys(value)) copy[key] = copyContentData((value as Record<string, unknown>)[key]);
    return copy as T;
  }
  return value;
}
