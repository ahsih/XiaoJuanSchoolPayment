// The CG Sparta page (CG斯巴达校区): the shared Philippine school page filled with the Sparta campus's profile and
// quote. CG Banilad has its own page and component; the two never share content.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CourseFee } from '../cia-school/cia-page-content';
import type { CiaQuoteCourse } from '../cia-school/cia-quote-engine';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { CgPageStudent } from '../cg-page-quote';
import { CG_SPARTA_RULES, CgSpartaPlanComparison, CgSpartaQuote } from './cg-sparta-page-quote';
import { CG_SPARTA_PAGE_PROFILE } from './cg-sparta-page-profile';

/** Database names of the Sparta record; the lookup “CG Academy” also returns the Banilad campus. */
export const CG_SPARTA_SCHOOL_NAMES = ['菲律宾宿务CG Academy（Sparta Campus）', 'CG Academy Sparta Campus', 'CG Sparta'];

@Component({
  selector: 'app-cia-school',
  standalone: true,
  imports: PH_SCHOOL_PAGE_IMPORTS,
  templateUrl: '../school-page/ph-school-page.component.html',
  styleUrls: [
    '../school-page/ph-school-page.component.css',
    '../school-quote-rollout.css',
    '../../../components/school-group-quote.css',
    '../school-page/ph-school-page-redesign.css',
    '../school-page/ph-school-page-options.css',
    '../school-page/ph-school-page-compact.css',
    '../school-page/ph-school-page-compact-tools.css',
  ],
})
export class CgSpartaSchoolPageComponent extends PhSchoolPageComponent<CgPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CG_SPARTA_PAGE_PROFILE; }
  protected override createQuote(): CgSpartaQuote { return new CgSpartaQuote(this); }
  protected override createComparison(): CgSpartaPlanComparison {
    return new CgSpartaPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return CG_SPARTA_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toLowerCase().includes('sparta'));
  }

  /** Prices come only from the content document (2026 price list); the database supplies the record and its media. */
  protected override applyPricingData(): void {}

  /** Booster is sold by the week and IELTS Guarantee only as a 12-week course, so the list shows those prices. */
  override listPrice(fee: CourseFee): number {
    const weekly = (fee as CiaQuoteCourse).feeByWeeks?.['1'];
    if (weekly !== undefined) return weekly;
    const exact = CG_SPARTA_RULES.exactWeeks?.[fee.id]?.[0];
    return exact ? super.listPrice(fee) * exact / 4 : super.listPrice(fee);
  }

  override coursePriceUnit(fee: CourseFee): string {
    if ((fee as CiaQuoteCourse).feeByWeeks?.['1'] !== undefined) return '/1周';
    const exact = CG_SPARTA_RULES.exactWeeks?.[fee.id]?.[0];
    return exact ? `/${exact}周` : super.coursePriceUnit(fee);
  }
}
