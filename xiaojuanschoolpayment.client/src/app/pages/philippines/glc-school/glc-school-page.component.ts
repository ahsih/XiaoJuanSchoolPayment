// The GLC page: the shared Philippine school page filled with GLC's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { GlcPageStudent, GlcPlanComparison, GlcQuote } from './glc-page-quote';
import { GLC_PAGE_PROFILE } from './glc-page-profile';

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
export class GlcSchoolPageComponent extends PhSchoolPageComponent<GlcPageStudent> {
  protected override getProfile(): PhSchoolProfile { return GLC_PAGE_PROFILE; }
  protected override createQuote(): GlcQuote { return new GlcQuote(this); }
  protected override createComparison(): GlcPlanComparison {
    return new GlcPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return super.findSchool(schools) ?? schools.find(item => item.name.toLowerCase().includes('global language cebu'));
  }

  /**
   * The database still holds the old weekly prices (week 1); GLC's prices, names and rules come only from the content
   * document (2027 price list), so database rows never replace them.
   */
  protected override applyPricingData(): void {}
}
