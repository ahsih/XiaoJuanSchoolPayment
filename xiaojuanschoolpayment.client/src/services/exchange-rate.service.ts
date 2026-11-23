import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, catchError, concat, map, of, shareReplay, switchMap, tap, timeout, timer } from 'rxjs';
import {
  CnyExchangeRateSnapshot,
  EXCHANGE_CACHE_KEY,
  FRANKFURTER_CNY_URL,
  FrankfurterLatestResponse,
  isFreshCachedRates,
  isUsableExchangeRates,
  parseFrankfurterRates,
  unavailableRates,
} from './exchange-rate-rules';

// The rules live in exchange-rate-rules.ts so the WeChat mini program can reuse them.
export {
  EXCHANGE_CACHE_KEY,
  EXCHANGE_CACHE_MAX_AGE_MS,
  FRANKFURTER_CNY_URL,
  chinaToday,
  isUsableExchangeRates,
  parseFrankfurterRates,
  unavailableRates,
} from './exchange-rate-rules';
export type { CnyExchangeRateSnapshot, FrankfurterLatestResponse } from './exchange-rate-rules';

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  // Hourly in the browser; once while the build prerenders a page, which must finish rendering.
  private readonly refresh = isPlatformBrowser(inject(PLATFORM_ID)) ? timer(0, 60 * 60 * 1000) : of(0);
  private readonly request = this.refresh.pipe(
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
      return isFreshCachedRates(value) ? value : null;
    } catch { return null; }
  }
  private writeCache(snapshot: CnyExchangeRateSnapshot): void {
    try { localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify({ ...snapshot, cachedAt: Date.now() })); }
    catch { /* Private browsing may disallow storage; the received rates still work. */ }
  }
}
