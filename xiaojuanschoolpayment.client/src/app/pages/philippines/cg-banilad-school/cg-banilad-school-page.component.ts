// The CG Banilad page: the shared Philippine school page filled with CG Banilad's profile and quote.
// CG Sparta has its own page and component; the two never share content.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CourseFee } from '../cia-school/cia-page-content';
import type { CiaQuoteCourse } from '../cia-school/cia-quote-engine';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { CgPageStudent } from '../cg-page-quote';
import { CgBaniladPlanComparison, CgBaniladQuote } from './cg-banilad-page-quote';
import { CG_BANILAD_PAGE_PROFILE } from './cg-banilad-page-profile';

/** Database names of the Banilad record; the lookup “CG Academy” also returns the Sparta campus. */
export const CG_BANILAD_SCHOOL_NAMES = ['菲律宾宿务CG Academy（Banilad Campus）', 'CG Academy Banilad Campus', 'CG Banilad'];

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
export class CgBaniladSchoolPageComponent extends PhSchoolPageComponent<CgPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CG_BANILAD_PAGE_PROFILE; }
  protected override createQuote(): CgBaniladQuote { return new CgBaniladQuote(this); }
  protected override createComparison(): CgBaniladPlanComparison {
    return new CgBaniladPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return CG_BANILAD_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toLowerCase().includes('banilad'));
  }

  /** Prices come only from the content document (2026 price list); the database supplies the record and its media. */
  protected override applyPricingData(): void {}

  /** Short-term Booster is sold by the week, so the list shows its one-week price. */
  override listPrice(fee: CourseFee): number {
    return (fee as CiaQuoteCourse).feeByWeeks?.['1'] ?? super.listPrice(fee);
  }

  override coursePriceUnit(fee: CourseFee): string {
    return (fee as CiaQuoteCourse).feeByWeeks?.['1'] !== undefined ? '/1周' : super.coursePriceUnit(fee);
  }
}
