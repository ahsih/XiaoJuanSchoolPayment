// The ICL English Academy page: the shared Philippine school page filled with ICL's own profile and quote.
import { Component } from '@angular/core';
import { PH_SCHOOL_PAGE_IMPORTS } from '../school-page/ph-school-page.component';
import type { IuIclCampus } from '../iu-school/iu-icl-content-config';
import { IuIclSchoolPageComponent } from '../iu-school/iu-icl-school-page';

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
export class IclSchoolComponent extends IuIclSchoolPageComponent {
  protected override iuIclCampus(): IuIclCampus { return 'ICL'; }
}
