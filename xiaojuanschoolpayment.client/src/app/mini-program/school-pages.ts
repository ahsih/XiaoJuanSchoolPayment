// School pages exported to /content/schools/<id>.json for the WeChat mini program.
// Add a school by writing its builder next to the page component (see cia-mini-program.ts),
// registering it here, and adding `"detail": "/content/schools/<id>.json"` to its entry in
// public/content/content.json so the mini program opens the native page instead of the website.
import { buildCiaMiniProgramPage } from '../pages/philippines/cia-school/cia-mini-program';
import { buildCellaPremiumMiniProgramPage, buildCellaUniMiniProgramPage } from '../pages/philippines/cella-quote/cella-mini-program';
import { buildCpiMiniProgramPage } from '../pages/philippines/cpi-school/cpi-mini-program';
import { buildCpilsMiniProgramPage } from '../pages/philippines/cpils-school/cpils-mini-program';
import { buildEvMiniProgramPage } from '../pages/philippines/ev-school/ev-mini-program';
import { buildBurlingtonMiniProgramPage } from '../pages/overseas-study-tour/uk-schools/burlington-school/burlington-mini-program';
import { SchoolMiniPage } from './school-mini-page';

export const MINI_PROGRAM_SCHOOL_PAGES: Record<string, () => SchoolMiniPage> = {
  cia: buildCiaMiniProgramPage,
  cpi: buildCpiMiniProgramPage,
  // Schools on the shared Philippine page template (template-school-page.ts).
  ev: buildEvMiniProgramPage,
  cpils: buildCpilsMiniProgramPage,
  'cella-uni': buildCellaUniMiniProgramPage,
  'cella-premium': buildCellaPremiumMiniProgramPage,
  // UK: text and price tables only; the mini program has no UK calculator yet.
  burlington: buildBurlingtonMiniProgramPage,
};
