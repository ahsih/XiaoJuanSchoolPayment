// Builds /content/schools/cpils.json for the WeChat mini program from the CPILS page's own profile
// (cpils-page-profile.ts) with the shared template builder; the mini program quotes with the 'cpils' engine
// (mini-program/template-quote-schools.ts), the same calculation as the website.
import { buildTemplateSchoolMiniPage } from '../../../mini-program/template-school-page';
import type { SchoolMiniPage } from '../../../mini-program/school-mini-page';
import { CPILS_PAGE_PROFILE } from './cpils-page-profile';

export const buildCpilsMiniProgramPage = (): SchoolMiniPage => buildTemplateSchoolMiniPage(CPILS_PAGE_PROFILE, {
  id: 'cpils',
  sitePath: '/philippines-study/cebu/cpils',
  navigationTitle: 'CPILS 语言学校',
  // The website finds the school by either name; the database holds the Chinese one.
  schoolName: '菲律宾宿务CPILS语言学校',
  quoteEngine: 'cpils',
  tuitionLabel: '2027年4周学费',
});
