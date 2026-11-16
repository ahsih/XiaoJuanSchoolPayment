// School pages exported to /content/schools/<id>.json for the WeChat mini program.
// Add a school by writing its builder next to the page component (see cia-mini-program.ts),
// registering it here, and adding `"detail": "/content/schools/<id>.json"` to its entry in
// public/content/content.json so the mini program opens the native page instead of the website.
import { buildCiaMiniProgramPage } from '../pages/philippines/cia-school/cia-mini-program';
import { SchoolMiniPage } from './school-mini-page';

export const MINI_PROGRAM_SCHOOL_PAGES: Record<string, () => SchoolMiniPage> = {
  cia: buildCiaMiniProgramPage,
};
