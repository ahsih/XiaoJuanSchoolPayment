// The CELLA Uni Sparta page: the shared Philippine school page filled with this campus's profile and quote.
import { Component } from '@angular/core';
import { CellaSchoolPageComponent } from '../cella-quote/cella-school-page';
import { PH_SCHOOL_PAGE_IMPORTS } from '../school-page/ph-school-page.component';
import type { CellaCampus } from '../cella-quote/cella-pricing';

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
export class CellaUniSpartaSchoolComponent extends CellaSchoolPageComponent {
  protected override cellaCampus(): CellaCampus { return 'uni'; }
}
