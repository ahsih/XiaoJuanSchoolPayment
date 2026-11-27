// The CampusTop Beach Front campus page: the shared Philippine school page filled with this campus's profile and quote.
import { Component } from '@angular/core';
import { PH_SCHOOL_PAGE_IMPORTS } from '../school-page/ph-school-page.component';
import { QqSchoolPageComponent } from './qq-school-page';
import type { QqCampus } from './qq-pricing';

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
export class QqBeachfrontSchoolComponent extends QqSchoolPageComponent {
  protected override qqCampus(): QqCampus { return 'bfc'; }
}
