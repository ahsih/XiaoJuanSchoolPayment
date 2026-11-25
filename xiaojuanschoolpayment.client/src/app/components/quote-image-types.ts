// Quote image data shared by the website renderer (QuoteImageDownloadButtonComponent and
// quote-image-detailed-renderer.ts) and the WeChat mini program, which bundles the renderer.
// Keep this file free of Angular and DOM types.
import type { PlanCompareSheet } from './plan-compare/plan-compare-sheet';
import type { UkQuoteSheet } from './uk-quote/uk-quote-sheet';
import type { UkQuoteSheet as UkQuoteSheetV2 } from './uk-quote-v2/uk-quote-sheet';

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
  /** One student's own total in a group quote (layoutVersion 2), drawn as a highlighted row. */
  subtotal?: boolean;
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

/**
 * The consultant chosen in a layoutVersion 2 quote (user request 2026-11-21): named with their phone under the heading,
 * with their WeChat QR code in the top right corner of the title card.
 */
export interface QuoteImageContactCard {
  /** `phone` is empty for consultants who take enquiries by WeChat only (Iris and Lisa). */
  consultant: QuoteImageContact;
}

export interface QuoteImageCardData {
  /** `plan-compare` draws `planCompare` with plan-compare/plan-compare-image-renderer.ts; it reuses only the header fields. `uk-package` draws `ukSheet` with uk-quote/uk-quote-image-renderer.ts; other fields are then unused. */
  layout?: 'standard' | 'cia-detailed' | 'plan-compare' | 'uk-package';
  planCompare?: PlanCompareSheet;
  ukSheet?: UkQuoteSheet;
  /** St Giles: the newer sheet (uk-quote-v2: up to three plans, several consultants), also drawn for `uk-package`. */
  ukSheetV2?: UkQuoteSheetV2;
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
  /** With expandTotalNote: the note is money paid outside the total (CIA's IAU fee), drawn bold dark orange. */
  emphasizeTotalNote?: boolean;
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
  /**
   * The quote image template under the user's review (2026-11-21), so far set only by CIA; other schools keep the
   * current images until it is approved. It adds the consultant line under the heading, `quoteConditions`,
   * `contactCard` and student subtotal rows, writes dates as 2026/11/20 and drops the currency from the amount
   * column heading (every amount already names its currency).
   */
  layoutVersion?: 2;
  /** The conditions the price depends on, one line per group of students with the same conditions. */
  quoteConditions?: string[];
  contactCard?: QuoteImageContactCard;
}
