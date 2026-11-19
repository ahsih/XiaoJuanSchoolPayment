// Entry point the WeChat mini program bundles as miniprogram/vendor/quote-engine.js
// (SiDaQiHangWeChat: `npm run quote:sync`, checked with `npm run quote:check`). Everything exported
// here is the same code the website runs: the CIA calculator, the exchange-rate rules and the
// full-detail quote image renderer. Only export pure modules (no Angular, DOM or storage).
// After changing any of them, run the sync in the mini program repo and release a new version.

/** Bumped when the exported API changes in a way the mini program must adapt to. */
export const QUOTE_ENGINE_API_VERSION = 1;

export {
  CIA_QUOTE_IMAGE_HERO,
  CiaQuote,
  applyCiaQuoteContent,
  createCiaQuotePricing,
  isCiaContentConfig,
} from '../pages/philippines/cia-school/cia-quote-engine';
export type {
  CiaOptionalFeeItem,
  CiaQuoteCourse,
  CiaQuotePricing,
  CiaQuoteRoom,
  CiaSchoolPaymentItem,
} from '../pages/philippines/cia-school/cia-quote-engine';
export type { CiaStudentQuote } from '../pages/philippines/cia-school/cia-student-quote';
export { CIA_COURSE_COMPARE_GROUPS, CiaPlanComparison } from '../pages/philippines/cia-school/cia-plan-compare';
export type { CiaCompareFocus, CiaComparePlanResult } from '../pages/philippines/cia-school/cia-plan-compare';
export { planCompareReady } from '../components/plan-compare/plan-compare-sheet';
export type { PlanCompareColumn, PlanCompareRow, PlanCompareSheet } from '../components/plan-compare/plan-compare-sheet';
export { drawPlanCompareImage, planCompareImageHeight } from '../components/plan-compare/plan-compare-image-renderer';
export { cloneCiaContentConfig } from '../pages/philippines/cia-school/cia-content-config';
export type { CiaContentConfig } from '../pages/philippines/cia-school/cia-content-config';
export { SCHOOL_VISA_OPTIONS } from '../components/school-group-quote';
export type { SchoolLocalFee, SchoolVisaType } from '../components/school-group-quote';
export { quoteMoney } from '../components/school-quote-plan';
export type { QuotePlanKind, QuotePlanOption, QuotePlanRow, SchoolQuotePlan } from '../components/school-quote-plan';
export {
  EXCHANGE_CACHE_MAX_AGE_MS,
  EXCHANGE_RATE_SOURCE,
  FRANKFURTER_CNY_URL,
  chinaToday,
  isFreshCachedRates,
  isUsableExchangeRates,
  parseFrankfurterRates,
  unavailableRates,
} from '../../services/exchange-rate-rules';
export type { CnyExchangeRateSnapshot, FrankfurterLatestResponse } from '../../services/exchange-rate-rules';
export { quoteCurrencyText } from '../../services/quote-currency-text';
export {
  QUOTE_IMAGE_WIDTH,
  detailedQuoteImageHeight,
  drawDetailedQuoteImage,
  quoteBrandLogoSource,
  quoteCanvasScale,
} from '../components/quote-image-detailed-renderer';
export type { QuoteCanvasContext, QuoteCanvasImage, QuoteTextMetrics } from '../components/quote-image-detailed-renderer';
export type { QuoteImageCardData } from '../components/quote-image-types';
