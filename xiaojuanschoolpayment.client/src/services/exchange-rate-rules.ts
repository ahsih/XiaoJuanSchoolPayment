// Pure exchange-rate rules shared by ExchangeRateService and the WeChat mini program quote
// calculator (bundled by the mini program's scripts/sync-quote-engine.mjs). Keep this file free of
// Angular, RxJS, DOM and storage access.

export interface FrankfurterLatestResponse {
  amount?: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}
export interface CnyExchangeRateSnapshot {
  date: string;
  phpPerCny: number;
  usdToCny: number;
  source?: string;
  rates?: Record<string, { rate: number; updatedAt: string }>;
}
export const FRANKFURTER_CNY_URL = 'https://api.frankfurter.dev/v1/latest?base=CNY&providers=ECB';
export const EXCHANGE_RATE_SOURCE = 'Frankfurter（ECB每日参考汇率）';
export const EXCHANGE_CACHE_KEY = 'sida-frankfurter-cny-rates-v2';
export const EXCHANGE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;
export const chinaToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

/** Accept recent published daily observations, including the last business day on weekends. */
export function isUsableExchangeRates(snapshot: CnyExchangeRateSnapshot): boolean {
  if (!Number.isFinite(snapshot.usdToCny) || snapshot.usdToCny <= 0 || !Number.isFinite(snapshot.phpPerCny) || snapshot.phpPerCny <= 0
    || !/^\d{4}-\d{2}-\d{2}$/.test(snapshot.date)) return false;
  const date = Date.parse(snapshot.date + 'T00:00:00Z');
  const today = Date.parse(chinaToday() + 'T00:00:00Z');
  return Number.isFinite(date) && new Date(date).toISOString().slice(0, 10) === snapshot.date && date <= today && today - date <= 7 * 86400000;
}
export function parseFrankfurterRates(response: FrankfurterLatestResponse): CnyExchangeRateSnapshot {
  if (response.base !== 'CNY' || (response.amount !== undefined && response.amount !== 1)) throw new Error('汇率基准不正确');
  const rates = Object.fromEntries(Object.entries(response.rates ?? {}).filter(([, rate]) => Number.isFinite(rate) && rate > 0)
    .map(([code, rate]) => [code, { rate, updatedAt: response.date }]));
  const snapshot: CnyExchangeRateSnapshot = { date: response.date, source: EXCHANGE_RATE_SOURCE,
    usdToCny: 1 / (rates['USD']?.rate ?? Number.NaN), phpPerCny: rates['PHP']?.rate ?? Number.NaN, rates };
  if (!isUsableExchangeRates(snapshot)) throw new Error('最新参考汇率暂不可用');
  return snapshot;
}
export const unavailableRates = (): CnyExchangeRateSnapshot => ({ date: '', usdToCny: Number.NaN, phpPerCny: Number.NaN });

/** A cached snapshot is reused only when it is a recent, validated Frankfurter response. */
export function isFreshCachedRates(value: (CnyExchangeRateSnapshot & { cachedAt?: number }) | null | undefined, now = Date.now()): boolean {
  if (!value) return false;
  const age = now - Number(value.cachedAt);
  return Number.isFinite(age) && age >= 0 && age <= EXCHANGE_CACHE_MAX_AGE_MS && value.source === EXCHANGE_RATE_SOURCE
    && isUsableExchangeRates(value);
}
