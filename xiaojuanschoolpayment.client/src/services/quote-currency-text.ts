// Pure money formatting shared by quote pages and the WeChat mini program calculator.
/** Formats a converted amount, or says the rate is pending when no usable rate exists. */
export const quoteCurrencyText = (value: number, locales: string | string[] = 'zh-CN', options?: Intl.NumberFormatOptions): string =>
  Number.isFinite(value) ? value.toLocaleString(locales, options) : '汇率待更新';
