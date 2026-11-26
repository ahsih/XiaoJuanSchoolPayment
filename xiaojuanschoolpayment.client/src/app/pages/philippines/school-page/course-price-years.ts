// One course price or two (2026-11-25). A content document stores each course price twice, as `tuition` and
// `tuition2027`. Most schools have one price per course, so the two must stay equal: the employee editor edits
// `tuition`, while the shared template's course list (PhSchoolPageComponent.listPrice) and several school quotes
// read `tuition2027`. Only the schools listed below keep two different prices, and the editor shows a second
// price field for exactly these. Keep this file pure (no Angular, DOM or storage): the mini program bundles it.
import type { CiaContentConfig } from '../cia-school/cia-content-config';

/**
 * Content documents whose `tuition2027` is a price of its own: CIA, CPILS, I.BREEZE, Cebu Blue Ocean and PINES
 * (`tuition` = 2026 price list, `tuition2027` = 2027 price list) and SMEAG Encanto (family courses: `tuition` =
 * off-season, `tuition2027` = peak whole-family price).
 */
export const TWO_COURSE_PRICE_SCHOOL_CODES: readonly string[] = ['CIA', 'CPILS', 'IBREEZE', 'BLUE-OCEAN', 'PINES', 'SMEAG-ENCANTO'];

export const keepsTwoCoursePrices = (schoolCode: string | undefined): boolean =>
  !!schoolCode && TWO_COURSE_PRICE_SCHOOL_CODES.includes(schoolCode);

/**
 * For a one-price school, copies every course's `tuition` into `tuition2027` (in place) and returns the same
 * document, so a price edited in the employee editor reaches the course list, the quote and the quote image.
 * Documents of the schools in TWO_COURSE_PRICE_SCHOOL_CODES are returned unchanged.
 */
export function syncSingleCoursePrices<T extends CiaContentConfig>(content: T): T {
  if (!content || !Array.isArray(content.courses) || keepsTwoCoursePrices(content.schoolCode)) return content;
  for (const course of content.courses) {
    if (course && course.tuition2027 !== course.tuition) course.tuition2027 = course.tuition;
  }
  return content;
}
