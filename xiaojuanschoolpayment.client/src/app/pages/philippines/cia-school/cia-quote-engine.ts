// CIA quote calculator without a host page: students, group mode, payment lines, local fees,
// totals, and the full-detail quote image data. CiaSchoolComponent delegates to it, and the WeChat
// mini program bundles it (SiDaQiHangWeChat scripts/sync-quote-engine.mjs), so both produce the
// same quote from the same published content. Prices and rules come only from a CiaContentConfig
// (the published employee revision or its defaults); this file adds none of its own.
// Keep it free of Angular, DOM and storage access.
import { PhSchoolQuote, type PhOptionalFeeItem, type PhSchoolPaymentItem } from '../school-page/ph-school-quote';
import { CiaQuotePrices, CiaStudentQuote, ciaPriceMultiplier } from './cia-student-quote';
import type { CiaContentConfig, CiaPeakSeasonRange, CiaQuoteImageSettings } from './cia-content-config';

/** Campus photo at the top right of the CIA quote image. */
export const CIA_QUOTE_IMAGE_HERO = '/assets/cia/campus-building.webp';

export interface CiaQuoteCourse {
  id: string;
  name: string;
  tuition: number;
  tuition2027: number;
  suitable: string;
  schedule: string;
  note: string;
  /** Only for courses run as a fixed block (guarantee courses); see CIA_COURSE_MINIMUM_WEEKS. */
  minimumWeeks?: number;
  /** Whole-course tuition for exact short lengths, keyed by total weeks (EV's IELTS Guarantee). */
  feeByWeeks?: Record<string, number>;
}

export interface CiaQuoteRoom {
  id: string;
  name: string;
  fee: number;
  note: string;
}

/** Everything the calculator reads. The website component is one; the mini program builds one. */
export interface CiaQuotePricing extends CiaQuotePrices {
  courseFees: CiaQuoteCourse[];
  roomFees: CiaQuoteRoom[];
  peakSeasonRanges: CiaPeakSeasonRange[];
  quoteImageSettings: CiaQuoteImageSettings;
  /** Exchange rates from the Frankfurter rules; NaN while unavailable (export stays blocked). */
  usdToCny: number;
  phpPerCny: number;
  exchangeRateDate: string;
  usingLiveExchangeRates: boolean;
}

export type CiaSchoolPaymentItem = PhSchoolPaymentItem;
export type CiaOptionalFeeItem = PhOptionalFeeItem;

/** A published revision or its defaults must carry these before the calculator uses them. */
export function isCiaContentConfig(value: unknown): value is CiaContentConfig {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === 'CIA'
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
}

/**
 * Copy the calculator's prices and rules from a (cloned) content document, exactly as the CIA
 * page does when a revision is published. Courses and rooms are replaced only when the document
 * enables at least one.
 */
export function applyCiaQuoteContent(target: CiaQuotePricing, content: CiaContentConfig): void {
  const courses = content.courses
    .filter(item => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const rooms = content.rooms
    .filter(item => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (courses.length > 0) {
    target.courseFees = courses.map(item => ({
      id: item.id,
      name: item.name,
      tuition: item.tuition,
      tuition2027: item.tuition2027,
      suitable: item.suitable,
      schedule: item.schedule,
      note: item.note,
      ...(item.minimumWeeks ? { minimumWeeks: item.minimumWeeks } : {}),
      ...(item.feeByWeeks ? { feeByWeeks: { ...item.feeByWeeks } } : {}),
    }));
  }
  if (rooms.length > 0) {
    target.roomFees = rooms.map(item => ({
      id: item.id,
      name: item.name,
      fee: item.fee,
      note: item.note,
    }));
  }
  target.localFeeRules = content.localFees;
  const settings = content.quoteSettings;
  target.registrationFee = settings.registrationFee;
  target.futurePriceRegistrationStart = settings.futurePriceRegistrationStart;
  target.futurePriceArrivalStart = settings.futurePriceArrivalStart;
  target.shortTermPriceRatios = { ...settings.shortStayRatios };
  target.seasonalFeePerWeek = settings.peakSeasonFeePerWeek;
  target.peakSeasonRanges = settings.peakSeasonRanges;
  target.promotions = settings.promotions;
  target.quoteImageSettings = content.quoteImageSettings;
}

/** Pricing built only from one (cloned) content document, for hosts without other price sources. */
export function createCiaQuotePricing(content: CiaContentConfig): CiaQuotePricing {
  const pricing: CiaQuotePricing = {
    courseFees: [],
    roomFees: [],
    registrationFee: 0,
    futurePriceRegistrationStart: '',
    futurePriceArrivalStart: '',
    shortTermPriceRatios: {},
    seasonalFeePerWeek: 0,
    peakSeasonRanges: [],
    promotions: [],
    localFeeRules: [],
    quoteImageSettings: content.quoteImageSettings,
    usdToCny: Number.NaN,
    phpPerCny: Number.NaN,
    exchangeRateDate: '',
    usingLiveExchangeRates: false,
  };
  applyCiaQuoteContent(pricing, content);
  return pricing;
}
/** CIA on the shared Philippine school quote; only CIA's discount totals are added here. */
export class CiaQuote extends PhSchoolQuote<CiaStudentQuote> {
  constructor(pricing: CiaQuotePricing) {
    super(pricing, {
      createStudent: () => new CiaStudentQuote(pricing),
      headingPrefix: 'CIA',
      image: { schoolCode: 'CIA', schoolName: 'CIA', filePrefix: 'CIA', heroSrc: CIA_QUOTE_IMAGE_HERO },
      priceMultiplier: weeks => ciaPriceMultiplier(weeks, pricing.shortTermPriceRatios),
      expandTotalNote: true,
      // The quote image template under the user's review (2026-11-21); other schools adopt it once approved.
      layoutVersion: 2,
    });
  }

  get iauRegistrationFeeNote(): string { return this.extraPaymentNote; }
  get isChristmasPromotionEligible(): boolean { return this.activeStudents.some(student=>student.christmasEligible); }
  get sidaDiscountAmount(): number { return this.activeStudents.reduce((sum,student)=>sum+student.sidaDiscount,0); }
  get christmasDiscountAmount(): number { return this.activeStudents.reduce((sum,student)=>sum+student.christmasDiscount,0); }
  get totalDiscountAmount(): number {
    return this.activeStudents.reduce((sum, student) => sum + student.promotionDiscountTotal, 0)
      + this.activeStudents.length * this.pricing.registrationFee - this.payableRegistrationFee;
  }
}
