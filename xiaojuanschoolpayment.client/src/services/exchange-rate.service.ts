import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, concat, map, of, shareReplay, switchMap, tap, timeout, timer } from 'rxjs';

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
  const snapshot: CnyExchangeRateSnapshot = { date: response.date, source: 'Frankfurter（ECB每日参考汇率）',
    usdToCny: 1 / (rates['USD']?.rate ?? Number.NaN), phpPerCny: rates['PHP']?.rate ?? Number.NaN, rates };
  if (!isUsableExchangeRates(snapshot)) throw new Error('最新参考汇率暂不可用');
  return snapshot;
}
export const unavailableRates = (): CnyExchangeRateSnapshot => ({ date: '', usdToCny: Number.NaN, phpPerCny: Number.NaN });
@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  private readonly request = timer(0, 60 * 60 * 1000).pipe(
    switchMap(() => {
      const cached = this.readCache();
      const latest = this.http.get<FrankfurterLatestResponse>(FRANKFURTER_CNY_URL).pipe(
        timeout(8000), map(parseFrankfurterRates), tap(snapshot => this.writeCache(snapshot)),
        catchError(() => of(this.readCache() ?? unavailableRates())));
      return cached ? concat(of(cached), latest) : latest;
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  getLatestCnyRates(): Observable<CnyExchangeRateSnapshot> { return this.request; }
  getCurrencyToCny(code: string): Observable<number> {
    const currency = code.toUpperCase();
    if (currency === 'CNY') return of(1);
    return this.request.pipe(map(snapshot => {
      const item = snapshot.rates?.[currency];
      return isUsableExchangeRates(snapshot) && item && Number.isFinite(item.rate) && item.rate > 0 ? 1 / item.rate : Number.NaN;
    }));
  }
  private readCache(): CnyExchangeRateSnapshot | null {
    try {
      const raw = localStorage.getItem(EXCHANGE_CACHE_KEY);
      if (!raw) return null;
      const value = JSON.parse(raw) as CnyExchangeRateSnapshot & { cachedAt: number };
      const age = Date.now() - value.cachedAt;
      return Number.isFinite(age) && age >= 0 && age <= EXCHANGE_CACHE_MAX_AGE_MS && value.source === 'Frankfurter（ECB每日参考汇率）'
        && isUsableExchangeRates(value) ? value : null;
    } catch { return null; }
  }
  private writeCache(snapshot: CnyExchangeRateSnapshot): void {
    try { localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify({ ...snapshot, cachedAt: Date.now() })); }
    catch { /* Private browsing may disallow storage; the received rates still work. */ }
  }
}
