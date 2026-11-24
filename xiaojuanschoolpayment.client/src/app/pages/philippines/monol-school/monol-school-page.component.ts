// The MONOL main-campus page: the shared Philippine school page filled with MONOL's profile and quote.
// MONOL Sparta is a separate school; never fall back to the Sparta campus here.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { MonolPageStudent, MonolPlanComparison, MonolQuote } from './monol-page-quote';
import { MONOL_PAGE_PROFILE } from './monol-page-profile';

/** Database school names of the main campus, newest first. */
const MONOL_SCHOOL_NAMES = ['菲律宾碧瑶MONOL主校区', '菲律宾碧瑶MONOL语言学校', 'MONOL', 'Models of Nonpareil and Outstanding Learning'];

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
export class MonolSchoolPageComponent extends PhSchoolPageComponent<MonolPageStudent> {
  protected override getProfile(): PhSchoolProfile { return MONOL_PAGE_PROFILE; }
  protected override createQuote(): MonolQuote { return new MonolQuote(this); }
  protected override createComparison(): MonolPlanComparison {
    return new MonolPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return MONOL_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** Prices come only from the content document; the database's 2026 rows do not know the 2026-11 room list. */
  protected override applyPricingData(): void {}
}
