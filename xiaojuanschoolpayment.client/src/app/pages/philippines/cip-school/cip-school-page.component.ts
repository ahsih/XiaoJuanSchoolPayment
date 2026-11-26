// The CIP (Clark) page: the shared Philippine school page filled with CIP's profile and quote.
import { Component } from '@angular/core';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { CourseFee } from '../cia-school/cia-page-content';
import type { CiaQuoteCourse } from '../cia-school/cia-quote-engine';
import { cipCourseRate, CipPageStudent, CipPlanComparison, CipQuote } from './cip-page-quote';
import { CIP_PAGE_PROFILE } from './cip-page-profile';

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
export class CipSchoolPageComponent extends PhSchoolPageComponent<CipPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CIP_PAGE_PROFILE; }
  protected override createQuote(): CipQuote { return new CipQuote(this); }
  protected override createComparison(): CipPlanComparison {
    return new CipPlanComparison(this, () => this.students[0]);
  }

  /**
   * Prices come only from the content document (CIP's 2027 dollar price list). The database has only CIP's older
   * regional starting-price row in renminbi, which must not replace them.
   */
  protected override applyPricingData(): void {}

  /** A course with a cheaper rate for a longer length (IELTS Guarantee 12 weeks) lists that rate as "from". */
  override listPrice(fee: CourseFee): number {
    const lengths = Object.keys((fee as CiaQuoteCourse).feeByWeeks ?? {}).map(Number);
    return Math.min(fee.tuition2027, ...lengths.map(weeks => cipCourseRate(fee as CiaQuoteCourse, weeks)));
  }

  override coursePriceUnit(fee: CourseFee): string {
    const unit = super.coursePriceUnit(fee);
    return this.listPrice(fee) < fee.tuition2027 ? `${unit}起` : unit;
  }
}
