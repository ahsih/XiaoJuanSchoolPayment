import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

interface FrankfurterLatestResponse {
  base: string;
  date: string;
  rates: {
    PHP: number;
    USD: number;
  };
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
    'https://api.frankfurter.dev/v1/latest?base=CNY&symbols=USD%2CPHP';

  getLatestCnyRates(): Observable<CnyExchangeRateSnapshot> {
    return this.http
      .get<FrankfurterLatestResponse>(this.latestCnyRatesUrl)
      .pipe(
        map((response) => ({
          date: response.date,
          phpPerCny: response.rates.PHP,
          usdToCny: 1 / response.rates.USD,
        })),
      );
  }
}
