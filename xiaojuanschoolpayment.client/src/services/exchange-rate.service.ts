import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  concat,
  map,
  of,
  shareReplay,
  tap,
  timeout,
} from 'rxjs';

interface FrankfurterLatestResponse {
  base: string;
  date: string;
  rates: {
    PHP: number;
    USD: number;
  };
}

interface CachedCnyExchangeRateSnapshot extends CnyExchangeRateSnapshot {
  cachedAt: number;
}

export interface CnyExchangeRateSnapshot {
  date: string;
  phpPerCny: number;
  usdToCny: number;
}

@Injectable({ providedIn: 'root' })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  private readonly latestCnyRatesUrl =
    'https://api.frankfurter.dev/v1/latest?base=CNY&symbols=USD%2CPHP&providers=ECB';
  private readonly cacheKey = 'sida-latest-cny-rates';
  private readonly cacheMaxAgeMs = 6 * 60 * 60 * 1000;
  private readonly latestRatesRequest = this.http
    .get<FrankfurterLatestResponse>(this.latestCnyRatesUrl)
    .pipe(
      timeout(4000),
      map((response) => ({
        date: response.date,
        phpPerCny: response.rates.PHP,
        usdToCny: 1 / response.rates.USD,
      })),
      tap((snapshot) => this.writeCache(snapshot)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

  getLatestCnyRates(): Observable<CnyExchangeRateSnapshot> {
    const cached = this.readCache();
    if (!cached) {
      return this.latestRatesRequest;
    }

    return concat(
      of(cached),
      this.latestRatesRequest.pipe(catchError(() => EMPTY)),
    );
  }

  private readCache(): CnyExchangeRateSnapshot | null {
    try {
      const value = localStorage.getItem(this.cacheKey);
      if (!value) {
        return null;
      }

      const cached = JSON.parse(value) as CachedCnyExchangeRateSnapshot;
      if (
        Date.now() - cached.cachedAt > this.cacheMaxAgeMs ||
        cached.usdToCny <= 0 ||
        cached.phpPerCny <= 0
      ) {
        return null;
      }

      return {
        date: cached.date,
        phpPerCny: cached.phpPerCny,
        usdToCny: cached.usdToCny,
      };
    } catch {
      return null;
    }
  }

  private writeCache(snapshot: CnyExchangeRateSnapshot): void {
    try {
      localStorage.setItem(
        this.cacheKey,
        JSON.stringify({ ...snapshot, cachedAt: Date.now() }),
      );
    } catch {
      // The live rate still works when storage is unavailable.
    }
  }
}
