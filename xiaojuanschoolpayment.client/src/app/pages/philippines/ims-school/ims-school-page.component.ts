// The IMS Academy page: the shared Philippine school page filled with IMS's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { IMS_GUARANTEE_COURSE_IDS } from './ims-content-config';
import { ImsPageStudent, ImsPlanComparison, ImsQuote } from './ims-page-quote';
import { IMS_PAGE_PROFILE } from './ims-page-profile';

/** Database school names, newest first. */
const IMS_SCHOOL_NAMES = ['菲律宾宿务IMS Academy', 'IMS Academy', 'IMS Academy Cebu'];

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
export class ImsSchoolPageComponent extends PhSchoolPageComponent<ImsPageStudent> {
  protected override getProfile(): PhSchoolProfile { return IMS_PAGE_PROFILE; }
  protected override createQuote(): ImsQuote { return new ImsQuote(this); }
  protected override createComparison(): ImsPlanComparison {
    return new ImsPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return IMS_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => /ims academy|宿务ims/i.test(item.name));
  }

  /** Prices come only from the content document (the school's 2026 price list); the database rows are older copies. */
  protected override applyPricingData(): void {}

  /** Guarantee courses are 12- to 24-week packages; the list shows the 12-week price. */
  override coursePriceUnit(fee: CourseFee): string {
    return IMS_GUARANTEE_COURSE_IDS.includes(fee.id) ? '/12周' : super.coursePriceUnit(fee);
  }
}
