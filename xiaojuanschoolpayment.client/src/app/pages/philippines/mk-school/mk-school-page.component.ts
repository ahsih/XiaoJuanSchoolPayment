// The MK Language Training Center page: the shared Philippine school page filled with MK's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { MkPageStudent, MkPlanComparison, MkQuote } from './mk-page-quote';
import { MK_PAGE_PROFILE, MK_SCHOOL_NAMES } from './mk-page-profile';

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
export class MkSchoolPageComponent extends PhSchoolPageComponent<MkPageStudent> {
  protected override getProfile(): PhSchoolProfile { return MK_PAGE_PROFILE; }
  protected override createQuote(): MkQuote { return new MkQuote(this); }
  protected override createComparison(): MkPlanComparison {
    return new MkPlanComparison(this, () => this.students[0]);
  }

  /** The regional seed's name first, then its aliases. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return MK_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** The database has no MK course or room rows; prices come only from the content document. */
  protected override applyPricingData(): void {}
}
