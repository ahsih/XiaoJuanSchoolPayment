// The HELP Clark page: the shared Philippine school page filled with HELP Clark's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { HelpPageStudent, HelpPlanComparison, HelpQuote } from './help-page-quote';
import { HELP_PAGE_PROFILE } from './help-page-profile';

/** Database school names, newest first; the search “HELP” also finds HELP's Baguio campuses. */
const HELP_SCHOOL_NAMES = ['菲律宾克拉克HELP English语言学校', 'HELP English Clark', 'HELP Clark Campus', 'HELP Clark'];

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
export class HelpSchoolPageComponent extends PhSchoolPageComponent<HelpPageStudent> {
  protected override getProfile(): PhSchoolProfile { return HELP_PAGE_PROFILE; }
  protected override createQuote(): HelpQuote { return new HelpQuote(this); }
  protected override createComparison(): HelpPlanComparison {
    return new HelpPlanComparison(this, () => this.students[0]);
  }

  /** The Clark record; never a Baguio campus. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return HELP_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('HELP') && item.name.toUpperCase().includes('CLARK'));
  }

  /** Prices come only from the content document (the school's 2026 price list); the database rows are older copies. */
  protected override applyPricingData(): void {}
}
