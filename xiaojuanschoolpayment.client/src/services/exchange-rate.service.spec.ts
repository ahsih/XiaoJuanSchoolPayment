import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { chinaToday, CnyExchangeRateSnapshot, EXCHANGE_CACHE_KEY, EXCHANGE_CACHE_MAX_AGE_MS, ExchangeRateService,
  FRANKFURTER_CNY_URL, FrankfurterLatestResponse, isUsableExchangeRates, parseFrankfurterRates } from './exchange-rate.service';
import { connectQuoteRates, quoteCurrencyText } from './quote-exchange-rates';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../app/components/quote-image-download-button.component';

const daysAgo = (days: number) => new Date(Date.parse(chinaToday() + 'T00:00:00Z') - days * 86400000).toISOString().slice(0, 10);
const response = (date = daysAgo(1)): FrankfurterLatestResponse => ({ base: 'CNY', date, rates: { USD: 1 / 6.7, PHP: 9.37, EUR: 1 / 7.8 } });
describe('Existing free quote exchange rates', () => {
  beforeEach(() => {
    localStorage.removeItem(EXCHANGE_CACHE_KEY);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  });
  afterEach(() => { TestBed.inject(HttpTestingController).verify(); localStorage.removeItem(EXCHANGE_CACHE_KEY); });
  it('uses the received USD, PHP and other currencies without fixed values', () => {
    const rates = parseFrankfurterRates(response());
    expect(rates.usdToCny).toBeCloseTo(6.7);
    expect(rates.phpPerCny).toBe(9.37);
    expect(Math.round(24300 / rates.phpPerCny)).toBe(2593);
    expect(rates.rates!['EUR'].rate).toBeCloseTo(1 / 7.8);
    expect(rates.date).toBe(daysAgo(1));
  });
  it('allows a recent business-day rate and rejects stale, future or impossible dates', () => {
    expect(isUsableExchangeRates(parseFrankfurterRates(response(daysAgo(3))))).toBeTrue();
    for (const date of [daysAgo(8), daysAgo(-1), '2026-02-30', 'bad date']) expect(() => parseFrankfurterRates(response(date))).toThrow();
  });
  it('rejects missing or invalid USD/PHP, wrong bases and non-unit amounts', () => {
    for (const code of ['USD', 'PHP']) for (const rate of [0, -1, Number.NaN, Infinity]) {
      const value = response(); value.rates[code] = rate; expect(() => parseFrankfurterRates(value)).toThrow();
    }
    const value = response(); delete value.rates['PHP']; expect(() => parseFrankfurterRates(value)).toThrow();
    expect(() => parseFrankfurterRates({ ...response(), base: 'USD' })).toThrow();
    expect(() => parseFrankfurterRates({ ...response(), amount: 100 })).toThrow();
  });
  it('sets both page rates, all validity flags and actual date, then clears them on failure', () => {
    const page = { usdToCny: 7.2, phpPerCny: 8, usingLiveExchangeRate: false, usingLiveExchangeRates: false, exchangeRateDate: '' };
    TestBed.runInInjectionContext(() => connectQuoteRates(page, { getLatestCnyRates: () => of(parseFrankfurterRates(response())) } as ExchangeRateService));
    expect(page.phpPerCny).toBe(9.37); expect(page.usdToCny).toBeCloseTo(6.7);
    expect(page.usingLiveExchangeRates).toBeTrue(); expect(page.exchangeRateDate).toBe(daysAgo(1));
    TestBed.runInInjectionContext(() => connectQuoteRates(page, { getLatestCnyRates: () => of({ date: '', usdToCny: Number.NaN, phpPerCny: Number.NaN }) } as ExchangeRateService));
    expect(Number.isNaN(page.phpPerCny)).toBeTrue(); expect(page.usingLiveExchangeRate).toBeFalse();
    expect(quoteCurrencyText(page.phpPerCny)).toBe('汇率待更新');
  });
  it('shares one free request and refreshes hourly', fakeAsync(() => {
    const service = TestBed.inject(ExchangeRateService), http = TestBed.inject(HttpTestingController);
    const values: CnyExchangeRateSnapshot[] = [];
    const a = service.getLatestCnyRates().subscribe(v => values.push(v));
    const b = service.getLatestCnyRates().subscribe();
    tick(0); http.expectOne(FRANKFURTER_CNY_URL).flush(response()); expect(values[0].phpPerCny).toBe(9.37);
    tick(3600000); http.expectOne(FRANKFURTER_CNY_URL).flush({ ...response(), rates: { USD: 0.15, PHP: 9.4 } });
    expect(values.at(-1)!.phpPerCny).toBe(9.4); a.unsubscribe(); b.unsubscribe();
  }));
  it('uses only a validated short-lived received cache during network failure', fakeAsync(() => {
    localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify({ ...parseFrankfurterRates(response()), cachedAt: Date.now() }));
    const values: CnyExchangeRateSnapshot[] = [], http = TestBed.inject(HttpTestingController);
    const sub = TestBed.inject(ExchangeRateService).getLatestCnyRates().subscribe(v => values.push(v));
    tick(0); expect(values[0].phpPerCny).toBe(9.37);
    http.expectOne(FRANKFURTER_CNY_URL).flush({}, { status: 503, statusText: 'Unavailable' });
    expect(values.at(-1)!.phpPerCny).toBe(9.37); expect(values.at(-1)!.date).toBe(daysAgo(1)); sub.unsubscribe();
  }));
  it('does not fall back to old cache or fixed 8/9/7.2 values', fakeAsync(() => {
    localStorage.setItem(EXCHANGE_CACHE_KEY, JSON.stringify({ ...parseFrankfurterRates(response()), cachedAt: Date.now() - EXCHANGE_CACHE_MAX_AGE_MS - 1 }));
    let value!: CnyExchangeRateSnapshot;
    const sub = TestBed.inject(ExchangeRateService).getLatestCnyRates().subscribe(v => value = v);
    tick(0); TestBed.inject(HttpTestingController).expectOne(FRANKFURTER_CNY_URL).flush({}, { status: 503, statusText: 'Unavailable' });
    expect(Number.isNaN(value.phpPerCny)).toBeTrue(); expect(Number.isNaN(value.usdToCny)).toBeTrue(); sub.unsubscribe();
  }));
  it('keeps recent business-day quotes exportable instead of requiring today', () => {
    TestBed.overrideProvider(ExchangeRateService, { useValue: { getLatestCnyRates: () => of(parseFrankfurterRates(response(daysAgo(3)))) } });
    const fixture = TestBed.createComponent(QuoteImageDownloadButtonComponent);
    fixture.componentInstance.quote = { title: '汇率测试', paymentItems: [], studentItems: [], totalUsd: '100美元', totalCny: '670元' } as unknown as QuoteImageCardData;
    fixture.detectChanges(); expect(fixture.nativeElement.querySelector('button').disabled).toBeFalse();
    expect(fixture.nativeElement.textContent).not.toContain('百度');
  });
  it('keeps currency inputs disabled when no usable received rates exist', () => {
    TestBed.overrideProvider(ExchangeRateService, { useValue: { getLatestCnyRates: () => of({ date: '', usdToCny: Number.NaN, phpPerCny: Number.NaN }) } });
    const fixture = TestBed.createComponent(QuoteImageDownloadButtonComponent);
    fixture.componentInstance.quote = { title: '测试', paymentItems: [], studentItems: [] } as unknown as QuoteImageCardData;
    fixture.detectChanges(); expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('参考汇率');
  });
});
