/**
 * Template schools whose page takes every price from its content document and ignores the database rows (their
 * `applyPricingData` does nothing). The employee editor must not copy database prices into their first save either,
 * or a school with no saved revision yet would publish older database prices. Keep this list equal to the pages:
 * `course-price-years.spec.ts` checks every template page against it. Pure data, no Angular.
 */
export const CONTENT_ONLY_PRICE_SCHOOL_CODES: readonly string[] = [
  'ANJ',
  'BLUE-OCEAN',
  'CELLA-UNI',
  'CELLA-PREMIUM',
  'CG-BANILAD',
  'CG-SPARTA',
  'CIEC',
  'CPILS',
  'ELSA',
  'FELLA',
  'GENIUS',
  'GLC',
  'HANA',
  'HELP-CLARK',
  'IU',
  'ICL',
  'IMS',
  'JIC',
  'MONOL',
  'PINES',
  'SMEAG-ENCANTO',
];

/** Whether the school's page and editor fill missing prices from the database (every school not listed above). */
export const usesDatabasePrices = (schoolCode: string | undefined): boolean =>
  !schoolCode || !CONTENT_ONLY_PRICE_SCHOOL_CODES.includes(schoolCode);
