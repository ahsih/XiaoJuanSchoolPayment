// What the two CELLA campus pages share on the shared Philippine school page: each campus is its own school
// (own content document, prices, photos and quote), so a subclass only names its campus.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { CiaQuoteCourse } from '../cia-school/cia-quote-engine';
import { CellaPageStudent, CellaPlanComparison, CellaQuote, isCellaFamilyPackage } from './cella-page-quote';
import { CELLA_SCHOOL_NAMES, cellaPageProfile, cellaWithoutFamilyPackages } from './cella-page-profile';
import type { CellaCampus } from './cella-pricing';

const PROFILES: Partial<Record<CellaCampus, PhSchoolProfile>> = {};

@Directive()
export abstract class CellaSchoolPageComponent extends PhSchoolPageComponent<CellaPageStudent> {
  /** Premium's family packages: quoted, but not in the course list or 方案对比 (CellaQuotePricing). No initializer: set with the content. */
  familyPackageFees?: CiaQuoteCourse[];

  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract cellaCampus(): CellaCampus;

  protected override getProfile(): PhSchoolProfile {
    const campus = this.cellaCampus();
    return PROFILES[campus] ??= cellaPageProfile(campus);
  }
  protected override createQuote(): CellaQuote { return new CellaQuote(this, this.cellaCampus()); }
  protected override createComparison(): CellaPlanComparison {
    return new CellaPlanComparison(this, this.cellaCampus(), () => this.students[0]);
  }

  /** Exact database names only: the search “CELLA” finds both campuses. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return CELLA_SCHOOL_NAMES[this.cellaCampus()].map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** CELLA prices come only from its content document (published revision or defaults), as before the template. */
  protected override applyPricingData(): void {}

  /** Family packages are whole-family totals: offered in the quote only, not beside the ordinary courses. */
  protected override afterContentApplied(_content: CiaContentConfig): void {
    this.familyPackageFees = this.courseFees.filter(item => isCellaFamilyPackage(item.id));
    this.courseFees = cellaWithoutFamilyPackages(this.courseFees);
  }
}
