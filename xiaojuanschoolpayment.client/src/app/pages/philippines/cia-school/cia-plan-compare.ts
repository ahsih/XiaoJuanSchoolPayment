// CIA plan comparison on the shared Philippine school template (school-page/ph-plan-compare.ts):
// only CIA's course groups, heading and IAU note are set here. The WeChat mini program bundles it,
// so keep it free of Angular, DOM and storage access.
import { PhPlanComparison, type PhCompareFocus, type PhComparePlanResult } from '../school-page/ph-plan-compare';
import type { CiaQuotePricing } from './cia-quote-engine';
import { CiaStudentQuote } from './cia-student-quote';

export type CiaCompareFocus = PhCompareFocus;
export type CiaComparePlanResult = PhComparePlanResult;

/** Courses a student usually weighs against each other; the “同类课程” shortcut picks from one group. */
export const CIA_COURSE_COMPARE_GROUPS: ReadonlyArray<{ id: string; label: string; courseIds: readonly string[] }> = [
  { id: 'general', label: '通用英语', courseIds: ['regular-esl', 'intensive-esl', 'power-intensive'] },
  { id: 'ielts', label: '雅思', courseIds: ['pre-ielts', 'ielts-regular', 'ielts-guarantee'] },
  { id: 'toeic', label: '托业', courseIds: ['pre-toeic', 'toeic-regular', 'toeic-guarantee'] },
  { id: 'other', label: '其他课程', courseIds: ['business', 'working-holiday', 'callan-esl', 'college-immersion'] },
];

export class CiaPlanComparison extends PhPlanComparison<CiaStudentQuote> {
  constructor(pricing: CiaQuotePricing, conditions: () => CiaStudentQuote) {
    super(pricing, conditions, {
      createStudent: () => new CiaStudentQuote(pricing),
      copyConditions: (source, plan) => {
        plan.selectedAgeGroup = source.selectedAgeGroup;
        plan.returningStudent = source.returningStudent;
        plan.selectedRegistrationDate = source.selectedRegistrationDate;
        plan.visaType = source.visaType;
      },
      heading: 'CIA 方案对比报价',
      courseGroups: CIA_COURSE_COMPARE_GROUPS,
      layoutVersion: 2,
      extraNotes: results => results.some(result => result.courseId === 'college-immersion')
        ? ['College Immersion另需支付IAU一次性注册费50美元（到校后付，未计入上述合计）。'] : [],
    });
  }
}
