// Quote image data shared by the website renderer (QuoteImageDownloadButtonComponent and
// quote-image-detailed-renderer.ts) and the WeChat mini program, which bundles the renderer.
// Keep this file free of Angular and DOM types.
import type { PlanCompareSheet } from './plan-compare/plan-compare-sheet';

export interface QuoteImageInfoItem {
  icon: string;
  label: string;
  value: string;
}

export interface QuoteImagePaymentItem {
  icon: string;
  label: string;
  amount: string;
  note?: string;
  /** Stable calculator-owned promotion id used only to select its editable image copy. */
  promotionKey?: string;
  /** Optional title and date/week line, displayed above the concise fee note. */
  detailTitle?: string;
  detailSubtitle?: string;
  accent?: boolean;
}

export interface QuoteImageLocalFeeItem {
  label: string;
  unit: string;
  quantity: string;
  amount: string;
  note: string;
}

export interface QuoteImageOptionalFeeItem {
  label: string;
  amount: string;
  cnyAmount?: string;
  note: string;
}

export interface QuoteImageBenefitItem {
  title: string;
  text: string;
}

export interface QuoteImageAlumniBenefitItem {
  title: string;
  subtitle: string;
  text: string;
}

export interface QuoteImageContact {
  name: string;
  phone: string;
  avatarSrc: string;
  qrSrc: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  wechatLabel?: string;
  footerText?: string;
  placeholder?: boolean;
}

export interface QuoteImageCardData {
  /** `plan-compare` draws `planCompare` with plan-compare/plan-compare-image-renderer.ts; it reuses only the header fields. */
  layout?: 'standard' | 'cia-detailed' | 'plan-compare';
  planCompare?: PlanCompareSheet;
  /** Preserve every payment/local/optional fee and size the detailed image to its contents. */
  fullFeeDetails?: boolean;
  /** Size shorter package fee sections to their content without changing other schools. */
  compactDetailedSections?: boolean;
  /** Show fee reference, quantity, subtotal and verbatim webpage notes in separate columns. */
  localFeeTableLayout?: 'web';
  fileName: string;
  logoSrc: string;
  heroSrc: string;
  schoolCode: string;
  title: string;
  /** Optional exact heading for the detailed quote, without an appended suffix. */
  headingText?: string;
  subtitle: string;
  quoteDateText: string;
  updatedAtText: string;
  quoteNumber?: string;
  validUntilText?: string;
  studentSectionTitle?: string;
  studentItems: QuoteImageInfoItem[];
  paymentSectionTitle?: string;
  /** School-native currency for the detailed payment column; other schools retain dollars. */
  paymentCurrencyLabel?: string;
  paymentItems: QuoteImagePaymentItem[];
  totalLabel: string;
  totalUsd: string;
  totalCny: string;
  totalIncludedLabel?: string;
  totalNote?: string;
  /** Opt-in for school-specific additional-payment warnings; preserve legacy layouts. */
  expandTotalNote?: boolean;
  localFeeTitle?: string;
  localFeeAmount: string;
  localFeeDescription: string;
  localFeeNote: string;
  localFeeItems?: QuoteImageLocalFeeItem[];
  localFeeCny?: string;
  exchangeRateText?: string;
  /** Exact rates used by the calculator, not inferred from rounded totals. */
  conversionRates?: { usdToCny: number; phpPerCny: number; date?: string };
  optionalFeeItems?: QuoteImageOptionalFeeItem[];
  benefitItems?: QuoteImageBenefitItem[];
  serviceSectionTitle?: string;
  serviceLocations?: string[];
  alumniBenefitItems?: QuoteImageAlumniBenefitItem[];
  alumniBenefitTitle?: string;
  /** School-specific opt-out when no alumni price benefit may be advertised. */
  hideAlumniBenefit?: boolean;
  finalConfirmationText?: string;
  importantNotes?: string[];
  noteTitle?: string;
  /** Render supplied detailed-footer notes exactly, without a generated checkmark prefix. */
  footerNotesVerbatim?: boolean;
  /** Detailed layout defaults to adding the calculator exchange-rate explanation. */
  appendExchangeRateNote?: boolean;
  /** Detailed layout defaults to adding the final school-confirmation sentence. */
  appendFinalConfirmationNote?: boolean;
  note: string;
  contact: QuoteImageContact;
  consultants?: QuoteImageContact[];
}
