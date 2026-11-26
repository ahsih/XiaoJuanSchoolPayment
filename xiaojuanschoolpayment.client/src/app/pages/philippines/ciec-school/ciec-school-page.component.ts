// The CIEC page: the shared Philippine school page filled with CIEC's profile and quote.
import { Component } from '@angular/core';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { CiecPageStudent, CiecPlanComparison, CiecQuote } from './ciec-page-quote';
import { CIEC_PAGE_PROFILE } from './ciec-page-profile';

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
export class CiecSchoolPageComponent extends PhSchoolPageComponent<CiecPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CIEC_PAGE_PROFILE; }
  protected override createQuote(): CiecQuote { return new CiecQuote(this); }
  protected override createComparison(): CiecPlanComparison {
    return new CiecPlanComparison(this, () => this.students[0]);
  }

  /** Prices come only from the content document (2027 school price list); the database has no CIEC price rows. */
  protected override applyPricingData(): void {}
}
