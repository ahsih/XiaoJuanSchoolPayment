// What the IU and ICL pages share on the shared Philippine school page. Each campus is its own school (own content
// document, prices, photos, videos and quote), so a subclass only names its campus.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultIuIclContentConfig, type IuIclCampus } from './iu-icl-content-config';
import {
  IU_ICL_SCHOOL_NAMES,
  IuIclPackageData,
  iuIclPackageData,
  IuIclPageStudent,
  IuIclPlanComparison,
  IuIclQuote,
} from './iu-icl-page-quote';
import { iuIclPageProfile } from './iu-icl-page-profile';

/** Short names an older database row may still carry. */
const SHORT_NAMES: Record<IuIclCampus, readonly string[]> = {
  IU: ['IU English Academy'],
  ICL: ['ICL English Academy', 'I Crazy Learning Academy'],
};

const DEFAULT_PACKAGES: Partial<Record<IuIclCampus, IuIclPackageData>> = {};
/** The packages of the content each page shows; kept outside the instance so class-field order cannot reset it. */
const PAGE_PACKAGES = new WeakMap<object, IuIclPackageData>();

@Directive()
export abstract class IuIclSchoolPageComponent extends PhSchoolPageComponent<IuIclPageStudent> {
  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract iuIclCampus(): IuIclCampus;

  /** The school packages of the shown content document (published revision, preview or defaults). */
  get iuIclPackages(): IuIclPackageData {
    const campus = this.iuIclCampus();
    return PAGE_PACKAGES.get(this)
      ?? (DEFAULT_PACKAGES[campus] ??= iuIclPackageData(createDefaultIuIclContentConfig(campus)));
  }

  protected override getProfile(): PhSchoolProfile { return iuIclPageProfile(this.iuIclCampus()); }
  protected override createQuote(): IuIclQuote { return new IuIclQuote(this, this.iuIclCampus()); }
  protected override createComparison(): IuIclPlanComparison {
    return new IuIclPlanComparison(this, this.iuIclCampus(), () => this.students[0]);
  }

  /** Exact names only: never the other campus's record. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    const campus = this.iuIclCampus();
    return [IU_ICL_SCHOOL_NAMES[campus], ...SHORT_NAMES[campus]]
      .map(name => schools.find(item => item.name === name))
      .find(Boolean);
  }

  /** IU and ICL prices come only from their content documents (published revision or defaults). */
  protected override applyPricingData(): void {}

  protected override afterContentApplied(content: CiaContentConfig): void {
    PAGE_PACKAGES.set(this, iuIclPackageData(content));
  }
}
