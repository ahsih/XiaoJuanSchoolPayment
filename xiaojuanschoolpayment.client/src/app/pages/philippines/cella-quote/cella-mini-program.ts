// Builds /content/schools/cella-uni.json and cella-premium.json for the WeChat mini program from each
// campus page's own profile (cella-page-profile.ts) with the shared template builder. Each campus is its own
// school with its own content document; the mini program quotes with the 'cella-uni' or 'cella-premium'
// engine (mini-program/template-quote-schools.ts), the same calculation as the website.
import { buildTemplateSchoolMiniPage } from '../../../mini-program/template-school-page';
import type { SchoolMiniPage } from '../../../mini-program/school-mini-page';
import { CELLA_SCHOOL_NAMES, cellaPageProfile } from './cella-page-profile';

export const buildCellaUniMiniProgramPage = (): SchoolMiniPage => buildTemplateSchoolMiniPage(cellaPageProfile('uni'), {
  id: 'cella-uni',
  sitePath: '/philippines-study/cebu/cella-uni-sparta-campus',
  navigationTitle: 'CELLA Uni 斯巴达校区',
  schoolName: CELLA_SCHOOL_NAMES.uni[0],
  quoteEngine: 'cella-uni',
  tuitionLabel: '2027年4周学费',
});

export const buildCellaPremiumMiniProgramPage = (): SchoolMiniPage => buildTemplateSchoolMiniPage(cellaPageProfile('premium'), {
  id: 'cella-premium',
  sitePath: '/philippines-study/cebu/cella-premium-campus',
  navigationTitle: 'CELLA Premium 校区',
  schoolName: CELLA_SCHOOL_NAMES.premium[0],
  quoteEngine: 'cella-premium',
  tuitionLabel: '2027年4周学费',
});
