// CG Banilad's quote and plan comparison: the shared CG calculation (cg-page-quote.ts) with Banilad's rules.
// Keep it free of Angular, DOM and storage access, so the WeChat mini program can bundle it later.
import { CgCampusRules, CgPageStudent, CgPlanComparison, CgQuote, CgQuotePricing } from '../cg-page-quote';
import { CG_BANILAD_QUOTE_IMAGE_HERO } from './cg-banilad-page-content';

export const CG_BANILAD_RULES: CgCampusRules = {
  code: 'CG-BANILAD',
  rulePrefix: 'cg-banilad',
  defaultCourseId: 'general-esl',
  defaultRoomId: 'quad',
  maxWeeks: 24,
  longStayPerPeriod: false,
  standaloneWeeks: { booster: [1, 2] },
};

/** Course groups of the course list and the comparison's “比同类课程” shortcut. */
export const CG_BANILAD_COURSE_GROUPS = [
  { id: 'esl', label: 'ESL', courseIds: ['light-esl', 'general-esl', 'intensive-esl', 'power-esl'] },
  { id: 'semi-sparta', label: '半斯巴达', courseIds: ['semi-sparta', 'premier-semi-sparta'] },
  { id: 'exam', label: '雅思和托业', courseIds: ['ielts-basic', 'toeic'] },
] as const;

export class CgBaniladQuote extends CgQuote {
  constructor(pricing: CgQuotePricing) {
    super(pricing, CG_BANILAD_RULES, {
      headingPrefix: 'CG Banilad',
      schoolCode: 'CG BANILAD',
      schoolName: '菲律宾宿务CG Academy Banilad校区',
      filePrefix: 'CG-Banilad',
      heroSrc: CG_BANILAD_QUOTE_IMAGE_HERO,
    });
  }
}

export class CgBaniladPlanComparison extends CgPlanComparison {
  constructor(pricing: CgQuotePricing, conditions: () => CgPageStudent) {
    super(pricing, CG_BANILAD_RULES, conditions, 'CG Banilad 方案对比', CG_BANILAD_COURSE_GROUPS);
  }
}
