// SMEAG Encanto (Mactan seaside campus) on the shared Philippine school page, in CIA's compact layout.
// Text and data: smeag-encanto-page-content.ts; profile: smeag-encanto-page-profile.ts; prices, seasons and the
// quote: smeag-encanto-pricing.ts, smeag-encanto-content-config.ts and smeag-encanto-page-quote.ts.
import { Component } from '@angular/core';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { EncantoPageStudent, EncantoPlanComparison, EncantoQuote, isEncantoFamilyCourse } from './smeag-encanto-page-quote';
import { encantoPageProfile, encantoRoomRateGroups } from './smeag-encanto-page-profile';

let PROFILE: PhSchoolProfile | undefined;

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
export class SmeagEncantoSchoolComponent extends PhSchoolPageComponent<EncantoPageStudent> {
  protected override getProfile(): PhSchoolProfile { return PROFILE ??= encantoPageProfile(); }
  protected override createQuote(): EncantoQuote { return new EncantoQuote(this); }
  protected override createComparison(): EncantoPlanComparison {
    return new EncantoPlanComparison(this, () => this.students[0]);
  }

  /** Encanto has no database record: prices come only from its content document. */
  protected override applyPricingData(): void {}

  /** The family room has no price of its own; the room price list shows the adult rooms only. */
  protected override afterContentApplied(content: CiaContentConfig): void {
    this.roomRateGroups = encantoRoomRateGroups(content.rooms);
  }

  /** Family courses are priced per whole family (the list shows the Family Camp price); adults pay per person. */
  override coursePriceUnit(fee: CourseFee): string {
    return isEncantoFamilyCourse(fee.id) ? '/4周·整家' : this.copy.courses.priceUnit;
  }

  /** Family courses that run all year show their off-season whole-family price inside the opened course. */
  override oldListPrice(fee: CourseFee): number | null {
    return isEncantoFamilyCourse(fee.id) && fee.tuition !== fee.tuition2027 ? fee.tuition : null;
  }
}
