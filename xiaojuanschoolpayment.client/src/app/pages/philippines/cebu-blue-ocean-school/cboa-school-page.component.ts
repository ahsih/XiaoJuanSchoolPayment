// The Cebu Blue Ocean Academy (蓝海CBOA) page: the shared Philippine school page filled with CBOA's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultBlueOceanContentConfig } from './cboa-content-config';
import { CboaPageStudent, CboaPlanComparison, CboaQuote } from './cboa-page-quote';
import { CBOA_PAGE_PROFILE, CBOA_SCHOOL_NAMES } from './cboa-page-profile';

const DEFAULT_CONTENT = createDefaultBlueOceanContentConfig();

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
export class CboaSchoolPageComponent extends PhSchoolPageComponent<CboaPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CBOA_PAGE_PROFILE; }
  protected override createQuote(): CboaQuote { return new CboaQuote(this); }
  protected override createComparison(): CboaPlanComparison {
    return new CboaPlanComparison(this, () => this.students[0]);
  }

  private appliedContent?: CiaContentConfig;
  /** The applied content document; the quote prices every row from its two price years. A getter, because the quote is built before this class's fields. */
  get cboaContent(): CiaContentConfig { return this.appliedContent ?? DEFAULT_CONTENT; }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedContent = content;
  }

  /** CBOA prices come from its dated content document, not from the database's 4-week rows. */
  protected override applyPricingData(): void {}

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return CBOA_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => /cebu blue ocean|cboa|宿务蓝海/i.test(item.name));
  }

  private course(fee: CourseFee) { return this.cboaContent.courses.find(item => item.id === fee.id); }

  /** Until 2027/02/01 the list shows the 2026 price (what a student registering now pays); a 2027-only course shows its 2027 price. */
  override listPrice(fee: CourseFee): number {
    const source = this.course(fee);
    const price2026 = source?.tuition ?? fee.tuition;
    return this.show2026Prices && price2026 > 0 ? price2026 : source?.tuition2027 ?? fee.tuition2027;
  }

  /** Inside an opened course before the switch: the 2027 price, labelled 2027/02/01起报名. */
  override oldListPrice(fee: CourseFee): number | null {
    if (!this.show2026Prices) return null;
    const source = this.course(fee);
    if (!(source?.tuition ?? fee.tuition)) return null;
    const price2027 = source?.tuition2027 ?? fee.tuition2027;
    return price2027 > 0 ? price2027 : null;
  }

  /** Room cards follow the same year as the course list; a 2027-only room (情侣房) shows its 2027 price. */
  override roomFeeFor(id: string): number {
    const room = this.cboaContent.rooms.find(item => item.id === id);
    if (!room) return super.roomFeeFor(id);
    return this.show2026Prices && room.fee > 0 ? room.fee : room.fee2027 ?? room.fee;
  }
}
