// The Genius English Academy page: the shared Philippine school page filled with Genius's profile and quote.
import { Component } from '@angular/core';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { GENIUS_FAMILY_IDS } from './genius-content-config';
import { GeniusPageStudent, GeniusPlanComparison, GeniusQuote } from './genius-page-quote';
import { GENIUS_PAGE_PROFILE } from './genius-page-profile';

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
export class GeniusSchoolPageComponent extends PhSchoolPageComponent<GeniusPageStudent> {
  protected override getProfile(): PhSchoolProfile { return GENIUS_PAGE_PROFILE; }
  protected override createQuote(): GeniusQuote { return new GeniusQuote(this); }
  protected override createComparison(): GeniusPlanComparison {
    return new GeniusPlanComparison(this, () => this.students[0]);
  }

  /** Prices come only from the content document; the database has only a regional starting-price row for Genius. */
  protected override applyPricingData(): void {}

  /** Family-program prices are per person and include the room and meals. */
  override coursePriceUnit(fee: CourseFee): string {
    return GENIUS_FAMILY_IDS.includes(fee.id) ? '/4周 含食宿' : super.coursePriceUnit(fee);
  }
}
