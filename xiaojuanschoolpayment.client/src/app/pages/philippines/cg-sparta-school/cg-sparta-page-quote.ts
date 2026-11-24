// CG Sparta's quote and plan comparison: the shared CG calculation (cg-page-quote.ts) with the Sparta campus's
// rules (1–52 weeks, long-stay offer per continuous course period, IELTS Guarantee only 12 weeks on set dates).
// Keep it free of Angular, DOM and storage access, so the WeChat mini program can bundle it later.
import { CgCampusRules, CgPageStudent, CgPlanComparison, CgQuote, CgQuotePricing } from '../cg-page-quote';
import { CG_SPARTA_IELTS_GUARANTEE_STARTS, CG_SPARTA_QUOTE_IMAGE_HERO } from './cg-sparta-page-content';

export const CG_SPARTA_RULES: CgCampusRules = {
  code: 'CG-SPARTA',
  rulePrefix: 'cg-sparta',
  defaultCourseId: 'sparta',
  defaultRoomId: 'quad',
  maxWeeks: 52,
  longStayPerPeriod: true,
  standaloneWeeks: { booster: [1, 2] },
  exactWeeks: { 'ielts-guarantee': [12] },
  startSundays: { 'ielts-guarantee': CG_SPARTA_IELTS_GUARANTEE_STARTS.map(item => item.arrival) },
};

/** Course groups of the comparison's “比同类课程” shortcut. */
export const CG_SPARTA_COURSE_GROUPS = [
  { id: 'sparta', label: '斯巴达', courseIds: ['sparta', 'premier-sparta'] },
  { id: 'toeic', label: '托业', courseIds: ['toeic-sparta', 'toeic-premier'] },
  { id: 'ielts', label: '雅思', courseIds: ['ielts-basic', 'ielts-intensive'] },
] as const;

export class CgSpartaQuote extends CgQuote {
  constructor(pricing: CgQuotePricing) {
    super(pricing, CG_SPARTA_RULES, {
      headingPrefix: 'CG斯巴达校区',
      schoolCode: 'CG斯巴达校区',
      schoolName: '菲律宾宿务CG Academy斯巴达校区',
      filePrefix: 'CG斯巴达校区',
      heroSrc: CG_SPARTA_QUOTE_IMAGE_HERO,
    });
  }
}

export class CgSpartaPlanComparison extends CgPlanComparison {
  constructor(pricing: CgQuotePricing, conditions: () => CgPageStudent) {
    super(pricing, CG_SPARTA_RULES, conditions, 'CG斯巴达校区 方案对比', CG_SPARTA_COURSE_GROUPS);
  }
}
