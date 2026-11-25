// The ELSA page: the shared Philippine school page filled with ELSA's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { ElsaPageStudent, ElsaPlanComparison, ElsaQuote } from './elsa-page-quote';
import { ELSA_PAGE_PROFILE } from './elsa-page-profile';

/** The database record holds only a regional starting price; it is still the one the page's photos and revisions use. */
const ELSA_DATABASE_NAME = '菲律宾宿务ELSA International Language School';

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
export class ElsaSchoolPageComponent extends PhSchoolPageComponent<ElsaPageStudent> {
  protected override getProfile(): PhSchoolProfile { return ELSA_PAGE_PROFILE; }
  protected override createQuote(): ElsaQuote { return new ElsaQuote(this); }
  protected override createComparison(): ElsaPlanComparison {
    return new ElsaPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.name === ELSA_DATABASE_NAME)
      ?? schools.find(item => item.name.toUpperCase().includes('ELSA'));
  }

  /** Prices come only from the content document (思达启航's 2026 ELSA price list); the database row is a regional starting price. */
  protected override applyPricingData(): void {}
}
