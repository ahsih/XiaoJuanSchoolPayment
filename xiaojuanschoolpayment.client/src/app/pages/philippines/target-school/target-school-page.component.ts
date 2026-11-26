// The TARGET page: the shared Philippine school page filled with TARGET's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { TargetPageStudent, TargetPlanComparison, TargetQuote } from './target-page-quote';
import { TARGET_PAGE_PROFILE } from './target-page-profile';

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
export class TargetSchoolPageComponent extends PhSchoolPageComponent<TargetPageStudent> {
  protected override getProfile(): PhSchoolProfile { return TARGET_PAGE_PROFILE; }
  protected override createQuote(): TargetQuote { return new TargetQuote(this); }
  protected override createComparison(): TargetPlanComparison {
    return new TargetPlanComparison(this, () => this.students[0]);
  }

  /** The employee tools find TARGET by these two words (admin isTargetSelected). */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => /target/i.test(item.name) && /english/i.test(item.name));
  }

  /** Prices come only from the content document (the school's 2026-07-10 price list); the database has no TARGET prices. */
  protected override applyPricingData(): void {}
}
