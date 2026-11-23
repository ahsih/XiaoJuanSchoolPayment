// The B'Cebu page: the shared Philippine school page filled with B'Cebu's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { BCebuPageStudent, BCebuPlanComparison, BCebuQuote } from './bcebu-page-quote';
import { BCEBU_PAGE_PROFILE } from './bcebu-page-profile';
import { createDefaultBCebuContentConfig } from './bcebu-content-config';
import { BCEBU_DATABASE_NAMES } from './bcebu-pricing';

const BCEBU_DEFAULT_SETTINGS = createDefaultBCebuContentConfig().quoteSettings;

/** Database school names, newest first. */
const BCEBU_SCHOOL_NAMES = ["菲律宾宿务B'Cebu语言学校", "BECI B'Cebu", "B'Cebu"];

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
export class BCebuSchoolPageComponent extends PhSchoolPageComponent<BCebuPageStudent> {
  /** Unaccompanied minor management fees in dollars per accommodation week (content quoteSettings). */
  minorFeeHighSchoolPerWeek = BCEBU_DEFAULT_SETTINGS.minorManagementFeeAge15To17PerWeek ?? 50;
  minorFeeJuniorPerWeek = BCEBU_DEFAULT_SETTINGS.minorManagementFeeUnder15PerWeek ?? 100;

  protected override getProfile(): PhSchoolProfile { return BCEBU_PAGE_PROFILE; }
  protected override createQuote(): BCebuQuote { return new BCebuQuote(this); }
  protected override createComparison(): BCebuPlanComparison {
    return new BCebuPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return BCEBU_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** The database still supplies 4-week prices; names, schedules and notes come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === BCEBU_DATABASE_NAMES[lesson.name]);
      if (course && lesson.price > 0) {
        course.tuition = lesson.price;
        course.tuition2027 = lesson.price;
      }
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === BCEBU_DATABASE_NAMES[room.name]);
      if (option && room.price > 0) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined) this.registrationFee = registration;
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    const settings = content.quoteSettings;
    this.minorFeeHighSchoolPerWeek = settings.minorManagementFeeAge15To17PerWeek ?? this.minorFeeHighSchoolPerWeek;
    this.minorFeeJuniorPerWeek = settings.minorManagementFeeUnder15PerWeek ?? this.minorFeeJuniorPerWeek;
  }
}
