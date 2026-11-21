// Entry point the WeChat mini program bundles as miniprogram/vendor/quote-engine.js
// (SiDaQiHangWeChat: `npm run quote:sync`, checked with `npm run quote:check`). Everything exported
// here is the same code the website runs: the CIA and CPI calculators, the exchange-rate rules and the
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
// CPI (2026-11-21): the same pricing object as CIA (createCiaQuotePricing / applyCiaQuoteContent on a CPI document).
export { CPI_COMPARE_COURSE_GROUPS, CPI_QUOTE_IMAGE_HERO, CpiPlanComparison, CpiQuote } from '../pages/philippines/cpi-school/cpi-page-quote';
export type { CpiPageStudent, CpiQuotePricing } from '../pages/philippines/cpi-school/cpi-page-quote';
export { cloneCpiContentConfig, isCpiContentConfig } from '../pages/philippines/cpi-school/cpi-content-config';
export type { CiaContentConfig } from '../pages/philippines/cia-school/cia-content-config';
// Schools on the shared Philippine page template (2026-11-22): EV, CPILS, CELLA Uni and CELLA Premium, each
// building its pricing object like its page component (template-quote-schools.ts).
export { MINI_TEMPLATE_QUOTE_SCHOOLS } from './template-quote-schools';
export type { MiniQuoteSchool, MiniTemplateQuoteEngine } from './template-quote-schools';
export type { PhSchoolQuote } from '../pages/philippines/school-page/ph-school-quote';
export type { PhExtraChoice, PhPageStudent } from '../pages/philippines/school-page/ph-school-profile';
// The 2027 peak rate the website shows (60 dollars for BESA/CALA members; other schools keep their own rate).
export { associationPeakRateForWeek } from '../pages/philippines/association-peak-surcharge';
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
export type { QuoteImageCardData, QuoteImageContactCard } from '../components/quote-image-types';
// The consultant chosen in a quote (layoutVersion 2 title card: name, phone, WeChat QR), in today's order like the website.
export { SIDA_PHILIPPINES_CONSULTANTS, consultantsInTodaysOrder, quoteContactCard } from '../components/sida-consultants';
export type { SidaConsultant } from '../components/sida-consultants';
