// Quote calculators of the schools on the shared Philippine page template (EV, CPILS and the two CELLA
// campuses) for the WeChat mini program, which bundles them through quote-engine.ts. Each entry builds the
// same pricing object the school's page component holds after a content document is applied
// (PhSchoolPageComponent.applyContentConfig: applyCiaQuoteContent, then the page's afterContentApplied), so the
// mini program quotes exactly like the website. Keep it pure: no Angular, DOM or storage.
import { associationPeakRateForWeek } from '../pages/philippines/association-peak-surcharge';
import type { CiaContentConfig } from '../pages/philippines/cia-school/cia-content-config';
import { applyCiaQuoteContent, createCiaQuotePricing, type CiaQuotePricing } from '../pages/philippines/cia-school/cia-quote-engine';
import { cloneCellaContentConfig } from '../pages/philippines/cella-quote/cella-content-config';
import { CellaQuote, isCellaFamilyPackage, type CellaQuotePricing } from '../pages/philippines/cella-quote/cella-page-quote';
import type { CellaCampus } from '../pages/philippines/cella-quote/cella-pricing';
import { cloneCpilsContentConfig } from '../pages/philippines/cpils-school/cpils-content-config';
import { CpilsQuote, type CpilsQuotePricing } from '../pages/philippines/cpils-school/cpils-page-quote';
import { cpilsRooms2027, cpilsShortStayRatios, cpilsVisibleCourses } from '../pages/philippines/cpils-school/cpils-pricing';
import { cloneEvContentConfig } from '../pages/philippines/ev-school/ev-content-config';
import { EvQuote, type EvQuotePricing } from '../pages/philippines/ev-school/ev-page-quote';
import type { PhSchoolQuote } from '../pages/philippines/school-page/ph-school-quote';
import type { PhPageStudent } from '../pages/philippines/school-page/ph-school-profile';

/** `pricing.quoteEngine` values of these schools in /content/schools/<id>.json. */
export type MiniTemplateQuoteEngine = 'ev' | 'cpils' | 'cella-uni' | 'cella-premium';

export interface MiniQuoteSchool {
  /** Short name in the quote heading and the share title, e.g. 'EV'. */
  readonly school: string;
  /** schoolCode of the school's content document. */
  readonly schoolCode: string;
  isContent(value: unknown): value is CiaContentConfig;
  /** Fills a saved document up to the current schema and policy versions (the page's profile.cloneContent). */
  clone(value: CiaContentConfig): CiaContentConfig;
  /** The pricing object for a cloned document. */
  createPricing(content: CiaContentConfig): CiaQuotePricing;
  /** Applies a newer cloned document to an existing pricing object (rates and filled plans stay). */
  applyContent(pricing: CiaQuotePricing, content: CiaContentConfig): void;
  createQuote(pricing: CiaQuotePricing): PhSchoolQuote<PhPageStudent>;
  /**
   * The cloned document as the school page's price lists show it: courses the quote does not offer are
   * switched off, prices are the ones the page lists, and the peak rate is the 2027 one the page shows.
   */
  priceList(content: CiaContentConfig): CiaContentConfig;
}

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Same check as isCpiContentConfig, for any school code. */
const isContentFor = (code: string) => (value: unknown): value is CiaContentConfig => {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === code
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions)
    && !!content.quoteImageSettings;
};

/** The 2027 peak rate the page shows (PhSchoolPageComponent.peakRate2027): BESA/CALA members charge 60 dollars. */
const with2027PeakRate = (code: string, content: CiaContentConfig): CiaContentConfig => {
  content.quoteSettings.peakSeasonFeePerWeek = associationPeakRateForWeek(code, '2027-01-03', content.quoteSettings.peakSeasonFeePerWeek);
  return content;
};

// ---------- EV ----------

type EvPricing = CiaQuotePricing & EvQuotePricing;

const evMinorFee = (content: CiaContentConfig) => content.quoteSettings.minorManagementFeePerPeriod ?? 100;

const EV: MiniQuoteSchool = {
  school: 'EV',
  schoolCode: 'EV',
  isContent: isContentFor('EV'),
  clone: cloneEvContentConfig,
  createPricing: content => ({ ...createCiaQuotePricing(content), minorManagementFeePerPeriod: evMinorFee(content) }) as EvPricing,
  applyContent(pricing, content) {
    applyCiaQuoteContent(pricing, content);
    (pricing as EvPricing).minorManagementFeePerPeriod = evMinorFee(content);
  },
  createQuote: pricing => new EvQuote(pricing as EvPricing),
  priceList: content => with2027PeakRate('EV', copy(content)),
};

// ---------- CPILS ----------

/** The page component holds the applied document in a field the quote only reads. */
type CpilsPricing = CiaQuotePricing & Omit<CpilsQuotePricing, 'cpilsContent'> & { cpilsContent: CiaContentConfig };

/** CpilsSchoolPageComponent.afterContentApplied. */
function applyCpilsFilters(pricing: CpilsPricing, content: CiaContentConfig): void {
  pricing.cpilsContent = content;
  pricing.courseFees = cpilsVisibleCourses(content, pricing.courseFees);
  pricing.roomFees = cpilsRooms2027(content, pricing.roomFees);
  pricing.shortTermPriceRatios = cpilsShortStayRatios(content);
}

/** CpilsSchoolPageComponent's room group titles. */
const CPILS_ROOM_GROUP_TITLES: Record<string, string> = { Regular: '普通房', Premium: '高级房', 无对外窗: '无对外窗房' };

const CPILS: MiniQuoteSchool = {
  school: 'CPILS',
  schoolCode: 'CPILS',
  isContent: isContentFor('CPILS'),
  clone: cloneCpilsContentConfig,
  createPricing(content) {
    const pricing = { ...createCiaQuotePricing(content), cpilsContent: content } as CpilsPricing;
    applyCpilsFilters(pricing, content);
    return pricing;
  },
  applyContent(pricing, content) {
    applyCiaQuoteContent(pricing, content);
    applyCpilsFilters(pricing as CpilsPricing, content);
  },
  createQuote: pricing => new CpilsQuote(pricing as CpilsPricing),
  // The page lists 2027 prices; a guarantee course without a 4-week price shows its whole package price.
  priceList(content) {
    const list = copy(content);
    const visible = new Set(cpilsVisibleCourses(list, list.courses).map(course => course.id));
    for (const course of list.courses) {
      if (!visible.has(course.id)) course.enabled = false;
      const packageWeeks = !course.tuition2027 ? course.allowedWeeks2027?.[0] : undefined;
      const packagePrice = packageWeeks ? course.feeByWeeks2027?.[String(packageWeeks)] ?? 0 : 0;
      if (packageWeeks && packagePrice > 0) {
        course.tuition = packagePrice;
        course.name = `${course.name.replace(/（\d+周）$/, '')}（${packageWeeks}周套餐总价）`;
      } else {
        course.tuition = course.tuition2027 || course.tuition;
      }
    }
    for (const room of list.rooms) {
      if (room.fee2027) room.fee = room.fee2027;
      room.group = CPILS_ROOM_GROUP_TITLES[room.group] ?? room.group;
    }
    list.quoteSettings.shortStayRatios = cpilsShortStayRatios(content);
    return with2027PeakRate('CPILS', list);
  },
};

// ---------- CELLA ----------

/**
 * CellaSchoolPageComponent.afterContentApplied: Premium's family packages are quoted but kept out of the course
 * list and 方案对比.
 */
function applyCellaFamilyPackages(pricing: CellaQuotePricing): void {
  pricing.familyPackageFees = pricing.courseFees.filter(item => isCellaFamilyPackage(item.id));
  pricing.courseFees = pricing.courseFees.filter(item => !isCellaFamilyPackage(item.id));
}

function cellaSchool(campus: CellaCampus): MiniQuoteSchool {
  const code = campus === 'uni' ? 'CELLA-UNI' : 'CELLA-PREMIUM';
  return {
    school: campus === 'uni' ? 'CELLA Uni' : 'CELLA Premium',
    schoolCode: code,
    isContent: isContentFor(code),
    clone: value => cloneCellaContentConfig(value, campus),
    createPricing(content) {
      const pricing = createCiaQuotePricing(content);
      applyCellaFamilyPackages(pricing as CiaQuotePricing & CellaQuotePricing);
      return pricing;
    },
    applyContent(pricing, content) {
      applyCiaQuoteContent(pricing, content);
      applyCellaFamilyPackages(pricing as CiaQuotePricing & CellaQuotePricing);
    },
    createQuote: pricing => new CellaQuote(pricing as CiaQuotePricing & CellaQuotePricing, campus),
    priceList(content) {
      const list = copy(content);
      for (const course of list.courses) {
        if (isCellaFamilyPackage(course.id)) course.enabled = false;
      }
      return with2027PeakRate(code, list);
    },
  };
}

export const MINI_TEMPLATE_QUOTE_SCHOOLS: Record<MiniTemplateQuoteEngine, MiniQuoteSchool> = {
  ev: EV,
  cpils: CPILS,
  'cella-uni': cellaSchool('uni'),
  'cella-premium': cellaSchool('premium'),
};
