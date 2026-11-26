// What the two CampusTop campus pages share on the shared Philippine school page. Both campuses live in one school
// record and one content document; each page shows and quotes its own campus only, so a subclass only names it.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { QqPageStudent, QqPlanComparison, QqQuote } from './qq-page-quote';
import { QQ_SCHOOL_NAME, qqPageProfile } from './qq-page-profile';
import type { QqCampus } from './qq-pricing';

const PROFILES: Partial<Record<QqCampus, PhSchoolProfile>> = {};

@Directive()
export abstract class QqSchoolPageComponent extends PhSchoolPageComponent<QqPageStudent> {
  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract qqCampus(): QqCampus;

  protected override getProfile(): PhSchoolProfile {
    const campus = this.qqCampus();
    return PROFILES[campus] ??= qqPageProfile(campus);
  }
  protected override createQuote(): QqQuote { return new QqQuote(this, this.qqCampus()); }
  protected override createComparison(): QqPlanComparison {
    return new QqPlanComparison(this, this.qqCampus(), () => this.students[0]);
  }

  /** Exact database name only. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.name === QQ_SCHOOL_NAME);
  }

  /** CampusTop prices come only from its content document and the school's day and night rates. */
  protected override applyPricingData(): void {}
}
