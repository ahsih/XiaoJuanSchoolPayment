// The HANA Academy page: the shared Philippine school page filled with HANA's profile and quote.
import { Component } from '@angular/core';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { HANA_CAMP_IDS } from './hana-content-config';
import { HanaPageStudent, HanaPlanComparison, HanaQuote } from './hana-page-quote';
import { HANA_PAGE_PROFILE } from './hana-page-profile';

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
export class HanaSchoolPageComponent extends PhSchoolPageComponent<HanaPageStudent> {
  protected override getProfile(): PhSchoolProfile { return HANA_PAGE_PROFILE; }
  protected override createQuote(): HanaQuote { return new HanaQuote(this); }
  protected override createComparison(): HanaPlanComparison {
    return new HanaPlanComparison(this, () => this.students[0]);
  }

  /** Prices come only from the content document (2026 price list); the database row has no HANA lessons. */
  protected override applyPricingData(): void {}

  /** The camp price is the low-season all-inclusive price; its course note gives the peak one. */
  override coursePriceUnit(fee: CourseFee): string {
    return HANA_CAMP_IDS.includes(fee.id) ? '/4周 淡季全包' : super.coursePriceUnit(fee);
  }
}
