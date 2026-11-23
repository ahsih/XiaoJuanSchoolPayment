import { Component } from '@angular/core';
import { WestSchoolPageComponent } from '../../west-school-page/west-school-page.component';
import { AtcQuoteCalculatorComponent } from './atc-quote-calculator.component';
import { ATC_PROFILE } from './atc-page-content';

/** ATC Language Schools (Bray and Dublin, Ireland) on the shared page template for schools outside the Philippines. */
@Component({
  selector: 'app-atc-school',
  standalone: true,
  imports: [WestSchoolPageComponent, AtcQuoteCalculatorComponent],
  template: `
    <app-west-school-page [profile]="profile">
      <app-atc-quote-calculator quote></app-atc-quote-calculator>
    </app-west-school-page>
  `,
})
export class AtcSchoolComponent {
  readonly profile = ATC_PROFILE;
}
