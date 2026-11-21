// Builds /content/schools/ev.json for the WeChat mini program from the EV page's own profile
// (ev-page-profile.ts) with the shared template builder; the mini program quotes with the 'ev' engine
// (mini-program/template-quote-schools.ts), the same calculation as the website.
import { buildTemplateSchoolMiniPage } from '../../../mini-program/template-school-page';
import type { SchoolMiniPage } from '../../../mini-program/school-mini-page';
import { EV_PAGE_PROFILE } from './ev-page-profile';

export const buildEvMiniProgramPage = (): SchoolMiniPage => buildTemplateSchoolMiniPage(EV_PAGE_PROFILE, {
  id: 'ev',
  sitePath: '/philippines-study/cebu/ev-academy',
  navigationTitle: 'EV 语言学校',
  schoolName: EV_PAGE_PROFILE.pricingSchoolName,
  quoteEngine: 'ev',
  tuitionLabel: '4周学费',
});
