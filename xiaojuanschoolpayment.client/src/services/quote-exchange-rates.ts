import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ExchangeRateService, isUsableExchangeRates, unavailableRates } from './exchange-rate.service';

/** One source for every quote; failures clear previous values instead of using fixed rates. */
export function connectQuoteRates(target: object, service: ExchangeRateService): void {
  service.getLatestCnyRates().pipe(takeUntilDestroyed(), catchError(() => of(unavailableRates()))).subscribe(rates => {
    const page = target as Record<string, unknown>;
    const valid = isUsableExchangeRates(rates);
    page['usdToCny'] = valid ? rates.usdToCny : Number.NaN;
    page['phpPerCny'] = valid ? rates.phpPerCny : Number.NaN;
    for (const field of ['exchangeRateLive', 'usingLiveExchangeRate', 'usingLiveExchangeRates']) if (field in page) page[field] = valid;
    if ('exchangeRateDate' in page) page['exchangeRateDate'] = valid ? rates.date : '';
  });
}
export { quoteCurrencyText } from './quote-currency-text';
