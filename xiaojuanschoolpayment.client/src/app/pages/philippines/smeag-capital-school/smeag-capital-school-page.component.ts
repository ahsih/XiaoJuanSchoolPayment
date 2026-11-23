// The SMEAG Capital page: the shared Philippine school page filled with SMEAG Capital's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { SmeagPageStudent, SmeagPlanComparison, SmeagQuote } from './smeag-page-quote';
import { SMEAG_PAGE_PROFILE } from './smeag-page-profile';

/** Database school names, newest first; the search “SMEAG Capital” must never pick Encanto. */
const SMEAG_SCHOOL_NAMES = ['菲律宾宿务SMEAG Capital语言学校', 'SMEAG Capital Campus', 'SMEAG Capital', 'SMEAG Global Education'];

/**
 * Database course names to the content document's course ids. The database keeps one row for IELTS and TOEFL and
 * one for ESL 2 and Speaking Master (same price), while the 2026 price list lists them separately.
 */
export function smeagCourseIds(name: string): string[] {
  const text = name.replace(/\s/g, '').toUpperCase();
  if (text.includes('TOEFL/IELTS')) return text.includes('预备') ? ['ielts-pre', 'toefl-pre'] : ['ielts-regular', 'toefl-regular'];
  if (text.includes('TOEIC')) return text.includes('预备') ? ['toeic-pre'] : ['toeic-regular'];
  if (text.includes('SPEAKINGMASTER')) return text.includes('CAE') ? ['speaking-master-cae', 'esl-2-cae'] : ['speaking-master-ket-pet-fce', 'esl-2'];
  if (text.includes('ESLJUNIOR2')) return ['esl-junior-2'];
  if (text.includes('ESLJUNIOR')) return ['esl-junior'];
  if (text.includes('ESL')) return text.includes('CAE') ? ['esl-cae'] : ['esl-regular-ket-pet-fce'];
  if (text.includes('BUSINESS')) return ['business'];
  if (text.includes('儿童')) return ['children'];
  if (text.includes('监护人')) return ['guardian'];
  return [];
}

/** Database room names (校内／校外酒店 + 单人间…五人间) to room ids. */
export function smeagRoomId(name: string): string {
  const place = name.includes('酒店') ? 'hotel' : 'campus';
  const size = name.includes('五人') ? 'five' : name.includes('四人') ? 'quad' : name.includes('三人') ? 'triple'
    : name.includes('双人') ? 'twin' : name.includes('单人') ? 'single' : '';
  return size ? `${place}-${size}` : '';
}

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
export class SmeagCapitalSchoolPageComponent extends PhSchoolPageComponent<SmeagPageStudent> {
  protected override getProfile(): PhSchoolProfile { return SMEAG_PAGE_PROFILE; }
  protected override createQuote(): SmeagQuote { return new SmeagQuote(this); }
  protected override createComparison(): SmeagPlanComparison {
    return new SmeagPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return SMEAG_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('CAPITAL'));
  }

  /** The database still supplies 4-week prices; names, schedules and notes come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4 && item.price > 0)) {
      for (const id of smeagCourseIds(lesson.name)) {
        const course = this.courseFees.find(item => item.id === id);
        if (course) {
          course.tuition = lesson.price;
          course.tuition2027 = lesson.price;
        }
      }
    }
    for (const room of rooms.filter(item => item.week === 4 && item.price > 0)) {
      const option = this.roomFees.find(item => item.id === smeagRoomId(room.name));
      if (option) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined) this.registrationFee = registration;
  }
}
