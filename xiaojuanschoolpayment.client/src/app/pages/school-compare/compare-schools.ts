// The schools a student can compare. Each entry wraps the school's own calculator and starts from
// the same defaults its page uses; a published employee revision replaces them, exactly as on the
// school page (the website applies it after the database lookup, the mini program the same way).
// To add a school: give it an adapter here (for a school on the shared Philippine template, a
// PhCompareSchool with its goal map) and append it to createCompareSchools().
// Keep this file free of Angular, DOM and storage access.
import { cloneCiaContentConfig, createDefaultCiaContentConfig, type CiaContentConfig } from '../philippines/cia-school/cia-content-config';
import { applyCiaQuoteContent, createCiaQuotePricing, isCiaContentConfig, type CiaQuotePricing } from '../philippines/cia-school/cia-quote-engine';
import { CiaStudentQuote } from '../philippines/cia-school/cia-student-quote';
import { cloneCpiContentConfig, createDefaultCpiContentConfig, CPI_IELTS_GUARANTEE_ID } from '../philippines/cpi-school/cpi-content-config';
import { CpiPageStudent } from '../philippines/cpi-school/cpi-page-quote';
import { cloneCpilsContentConfig, createDefaultCpilsContentConfig } from '../philippines/cpils-school/cpils-content-config';
import { CpilsPageStudent, type CpilsQuotePricing } from '../philippines/cpils-school/cpils-page-quote';
import { cpilsRooms2027, cpilsVisibleCourses } from '../philippines/cpils-school/cpils-pricing';
import { cloneEvContentConfig, createDefaultEvContentConfig, EV_IELTS_GUARANTEE_ID } from '../philippines/ev-school/ev-content-config';
import { EvPageStudent, type EvQuotePricing } from '../philippines/ev-school/ev-page-quote';
import { PhCompareSchool } from './ph-compare-school';
import type { CompareSchool } from './school-compare';

export interface CompareSchoolSource {
  readonly school: CompareSchool;
  /** Database name of the school, used to find its published revision. */
  readonly pricingSchoolName: string;
  /** Applies a published revision; anything that is not this school's document is ignored. */
  applyPublished(content: unknown): void;
}

const isContentFor = (code: string, value: unknown): value is CiaContentConfig => {
  const content = value as Partial<CiaContentConfig> | null;
  return !!content && content.schemaVersion === 1 && content.schoolCode === code
    && Array.isArray(content.courses) && Array.isArray(content.rooms) && Array.isArray(content.localFees)
    && !!content.quoteSettings && Array.isArray(content.quoteSettings.promotions) && !!content.quoteImageSettings;
};

export function createCiaCompareSource(): CompareSchoolSource {
  const pricing = createCiaQuotePricing(cloneCiaContentConfig(createDefaultCiaContentConfig()));
  const school = new PhCompareSchool<CiaStudentQuote>({
    id: 'cia',
    tag: 'CIA',
    name: '菲律宾宿务 CIA 语言学校',
    city: '宿务',
    location: '宿务麦克坦（拉普拉普市）',
    pagePath: '/philippines-study/cebu/cia-cebu-international-academy',
    pricing,
    createStudent: () => new CiaStudentQuote(pricing),
    applyConditions: (student, conditions) => {
      student.selectedAgeGroup = conditions.ageGroup;
      student.visaType = conditions.visaType;
      student.selectedRegistrationDate = conditions.registrationDate;
      student.returningStudent = false;
    },
    goals: {
      general: { ids: ['regular-esl', 'intensive-esl', 'power-intensive', 'callan-esl'] },
      // CIA has no speaking-only course; Power Intensive has the most one-to-one classes.
      speaking: { ids: ['power-intensive'], closest: true },
      ielts: { ids: ['ielts-regular', 'pre-ielts'] },
      'ielts-guarantee': { ids: ['ielts-guarantee'] },
      toeic: { ids: ['toeic-regular', 'pre-toeic'] },
      business: { ids: ['business'] },
    },
  });
  return {
    school,
    pricingSchoolName: 'CIA Cebu International Academy',
    applyPublished: content => {
      if (isCiaContentConfig(content)) applyCiaQuoteContent(pricing, cloneCiaContentConfig(content));
    },
  };
}

export function createEvCompareSource(): CompareSchoolSource {
  const defaults = cloneEvContentConfig(createDefaultEvContentConfig());
  const pricing: CiaQuotePricing & EvQuotePricing = {
    ...createCiaQuotePricing(defaults),
    minorManagementFeePerPeriod: defaults.quoteSettings.minorManagementFeePerPeriod ?? 100,
  };
  const school = new PhCompareSchool<EvPageStudent>({
    id: 'ev',
    tag: 'EV主校区',
    name: '菲律宾宿务 EV 语言学校',
    city: '宿务',
    location: '宿务市区 Talamban',
    pagePath: '/philippines-study/cebu/ev-academy',
    pricing,
    createStudent: () => new EvPageStudent(pricing),
    applyConditions: (student, conditions) => {
      student.selectedAgeGroup = conditions.ageGroup;
      student.visaType = conditions.visaType;
      student.returningStudent = false;
    },
    goals: {
      general: { ids: ['semi-sparta-esl', 'sparta-intensive-esl'] },
      speaking: { ids: ['semi-sparta-power-speaking-6', 'semi-sparta-power-speaking-8', 'sparta-power-speaking-6', 'sparta-power-speaking-8'] },
      ielts: { ids: ['sparta-ielts-regular'] },
      'ielts-guarantee': { ids: [EV_IELTS_GUARANTEE_ID] },
      toeic: { ids: ['semi-sparta-toeic', 'sparta-toeic'] },
      business: { ids: ['semi-sparta-business', 'sparta-business'] },
    },
  });
  return {
    school,
    pricingSchoolName: 'EV Academy',
    applyPublished: value => {
      if (!isContentFor('EV', value)) return;
      const content = cloneEvContentConfig(value);
      applyCiaQuoteContent(pricing, content);
      pricing.minorManagementFeePerPeriod = content.quoteSettings.minorManagementFeePerPeriod ?? 100;
    },
  };
}

export function createCpilsCompareSource(): CompareSchoolSource {
  const pricing: CiaQuotePricing & { cpilsContent: CiaContentConfig } = {
    ...createCiaQuotePricing(createDefaultCpilsContentConfig()),
    cpilsContent: createDefaultCpilsContentConfig(),
  };
  // Same course and room lists as the CPILS page: priced 2027 courses (no add-ons) and 2027 room prices.
  const applyContent = (content: CiaContentConfig) => {
    applyCiaQuoteContent(pricing, content);
    pricing.cpilsContent = content;
    pricing.courseFees = cpilsVisibleCourses(content, pricing.courseFees);
    pricing.roomFees = cpilsRooms2027(content, pricing.roomFees);
  };
  applyContent(pricing.cpilsContent);
  const cpilsPricing: CpilsQuotePricing = pricing;
  const school = new PhCompareSchool<CpilsPageStudent>({
    id: 'cpils',
    tag: 'CPILS',
    name: '菲律宾宿务 CPILS 语言学校',
    city: '宿务',
    location: '宿务市区老城区',
    pagePath: '/philippines-study/cebu/cpils',
    pricing,
    createStudent: () => new CpilsPageStudent(cpilsPricing),
    applyConditions: (student, conditions) => {
      student.selectedAgeGroup = conditions.ageGroup;
      student.visaType = conditions.visaType;
      student.selectedRegistrationDate = conditions.registrationDate;
      student.returningStudent = false;
    },
    goals: {
      general: { ids: ['general-esl', 'general-esl-plus', 'esl-premium', 'premier-sparta'] },
      // CPILS has no speaking-only course; ESL Premium has the most one-to-one classes.
      speaking: { ids: ['esl-premium'], closest: true },
      ielts: { ids: ['ielts-course', 'pre-ielts-course'] },
      'ielts-guarantee': { ids: ['ielts-guarantee-12-weeks', 'ielts-guarantee-8-weeks'] },
      toeic: { ids: ['toeic-course'] },
      business: { ids: ['business-english'] },
    },
  });
  return {
    school,
    pricingSchoolName: 'CPILS',
    applyPublished: value => {
      if (isContentFor('CPILS', value)) applyContent(cloneCpilsContentConfig(value));
    },
  };
}

export function createCpiCompareSource(): CompareSchoolSource {
  const pricing = createCiaQuotePricing(cloneCpiContentConfig(createDefaultCpiContentConfig()));
  const school = new PhCompareSchool<CpiPageStudent>({
    id: 'cpi',
    tag: 'CPI',
    name: '菲律宾宿务 CPI 语言学校',
    city: '宿务',
    location: '宿务市区 Lahug',
    pagePath: '/philippines-study/cebu/cpi-cebu-pelis-institute',
    pricing,
    createStudent: () => new CpiPageStudent(pricing),
    applyConditions: (student, conditions) => {
      student.selectedAgeGroup = conditions.ageGroup;
      student.visaType = conditions.visaType;
      student.returningStudent = false;
    },
    goals: {
      general: { ids: ['esl-general-15', 'esl-intensive'] },
      // CPI has no speaking-only course; ESL Intensive has the most one-to-one classes.
      speaking: { ids: ['esl-intensive'], closest: true },
      ielts: { ids: ['ielts-general', 'ielts-intensive', 'ielts-preparatory'] },
      'ielts-guarantee': { ids: [CPI_IELTS_GUARANTEE_ID] },
      toeic: { ids: ['toeic-general', 'toeic-intensive', 'toeic-preparatory'] },
      business: { ids: ['esp-general', 'esp-bridge'] },
    },
  });
  return {
    school,
    pricingSchoolName: '菲律宾宿务CPI语言学校',
    applyPublished: value => {
      if (isContentFor('CPI', value)) applyCiaQuoteContent(pricing, cloneCpiContentConfig(value));
    },
  };
}

/** Every school that can be compared, in the order the page lists them. */
export function createCompareSchools(): CompareSchoolSource[] {
  return [createCiaCompareSource(), createEvCompareSource(), createCpilsCompareSource(), createCpiCompareSource()];
}
