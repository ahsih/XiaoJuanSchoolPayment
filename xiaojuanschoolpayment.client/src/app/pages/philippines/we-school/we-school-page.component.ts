// The Clark WE Academy page: the shared Philippine school page filled with WE's profile and quote.
import { Component } from '@angular/core';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { WE_NO_CLASS_COURSE_ID } from './we-content-config';
import { WE_PAGE_PROFILE } from './we-page-profile';
import { WePageStudent, WePlanComparison, WeQuote } from './we-page-quote';

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
export class WeSchoolPageComponent extends PhSchoolPageComponent<WePageStudent> {
  protected override getProfile(): PhSchoolProfile { return WE_PAGE_PROFILE; }
  protected override createQuote(): WeQuote { return new WeQuote(this); }
  protected override createComparison(): WePlanComparison {
    return new WePlanComparison(this, () => this.students[0]);
  }

  /** The guardian who only accompanies a child pays no tuition. */
  override coursePriceUnit(fee: CourseFee): string {
    return fee.id === WE_NO_CLASS_COURSE_ID ? '（不上课，不收学费）' : super.coursePriceUnit(fee);
  }

  /**
   * The database rows are the older 2026 list; WE's 2027 prices, rooms and rules
   * live only in the content document, so database prices are not applied.
   */
  protected override applyPricingData(_lessons: SchoolLessonDTO[], _rooms: SchoolRoomDTO[], _fees: SchoolFeeDTO[]): void {}
}
