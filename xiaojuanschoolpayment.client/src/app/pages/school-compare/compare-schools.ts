// The schools a student can compare. Each entry wraps the school's own calculator and starts from
// the same defaults its page uses; a published employee revision replaces them, exactly as on the
// school page (the website applies it after the database lookup, the mini program the same way).
// To add a school: give it an adapter here (for a school on the shared Philippine template, a
// PhCompareSchool with its goal map) and append it to createCompareSchools().
// Keep this file free of Angular, DOM and storage access.
import { cloneCiaContentConfig, createDefaultCiaContentConfig, type CiaContentConfig } from '../philippines/cia-school/cia-content-config';
import { applyCiaQuoteContent, createCiaQuotePricing, isCiaContentConfig, type CiaQuotePricing } from '../philippines/cia-school/cia-quote-engine';
import { CiaStudentQuote } from '../philippines/cia-school/cia-student-quote';
import { cloneEvContentConfig, createDefaultEvContentConfig, EV_IELTS_GUARANTEE_ID } from '../philippines/ev-school/ev-content-config';
import { EvPageStudent, type EvQuotePricing } from '../philippines/ev-school/ev-page-quote';
import { PhCompareSchool } from './ph-compare-school';
import { createCgBaniladCompareSource } from './schools/cg-banilad-compare';
import { createIbreezeCompareSource } from './schools/ibreeze-compare';
import { createMonolCompareSource } from './schools/monol-compare';
import { createPinesCompareSource } from './schools/pines-compare';
import type { CompareSchoolSource } from './school-compare';

export type { CompareSchoolSource } from './school-compare';

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

/** Every school that can be compared, in the order the page lists them (grouped by country, then city). */
export function createCompareSchools(): CompareSchoolSource[] {
  return [
    createCiaCompareSource(),
    createEvCompareSource(),
    createCgBaniladCompareSource(),
    createIbreezeCompareSource(),
    createPinesCompareSource(),
    createMonolCompareSource(),
  ];
}
