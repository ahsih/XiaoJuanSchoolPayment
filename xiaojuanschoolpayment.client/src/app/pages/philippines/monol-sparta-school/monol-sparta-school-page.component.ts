// The MONOL Sparta page: the shared Philippine school page filled with MONOL Sparta's profile and quote.
// MONOL Sparta is a separate school from the MONOL main campus; never fall back to the main campus here.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { MonolSpartaPageStudent, MonolSpartaPlanComparison, MonolSpartaQuote } from './monol-sparta-page-quote';
import { MONOL_SPARTA_PAGE_PROFILE } from './monol-sparta-page-profile';

/** Database school names, newest first; the seed renames older records to the first one. */
const MONOL_SPARTA_SCHOOL_NAMES = ['菲律宾碧瑶MONOL斯巴达校区', 'MONOL Sparta Campus', 'MONOL Sparta'];

/** Database course and room names (the seed's English lookup names) to the content document's ids. */
const COURSE_IDS: Record<string, string> = { 'booster esl': 'booster-esl', 'master ielts': 'master-ielts' };
const ROOM_IDS: Record<string, string> = {
  'premium single room': 'premium-single-room',
  'standard single room': 'standard-single-room',
  'semi single room': 'semi-single-room',
  'double room': 'double-room',
  'triple room': 'triple-room',
};

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
export class MonolSpartaSchoolPageComponent extends PhSchoolPageComponent<MonolSpartaPageStudent> {
  protected override getProfile(): PhSchoolProfile { return MONOL_SPARTA_PAGE_PROFILE; }
  protected override createQuote(): MonolSpartaQuote { return new MonolSpartaQuote(this); }
  protected override createComparison(): MonolSpartaPlanComparison {
    return new MonolSpartaPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return MONOL_SPARTA_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** The database still supplies 4-week prices; names, schedules and notes come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4 && item.price > 0)) {
      const course = this.courseFees.find(item => item.id === COURSE_IDS[lesson.name.trim().toLowerCase()]);
      if (course) {
        course.tuition = lesson.price;
        course.tuition2027 = lesson.price;
      }
    }
    for (const room of rooms.filter(item => item.week === 4 && item.price > 0)) {
      const option = this.roomFees.find(item => item.id === ROOM_IDS[room.name.trim().toLowerCase()]);
      if (option) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined) this.registrationFee = registration;
  }
}
