// The CPI page: the shared Philippine school page filled with CPI's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { CpiPageStudent, CpiPlanComparison, CpiQuote } from './cpi-page-quote';
import { CPI_PAGE_PROFILE } from './cpi-page-profile';

/** Database school names, newest first. */
const CPI_SCHOOL_NAMES = ['菲律宾宿务CPI语言学校', 'CPI Cebu Pelis Institute'];

/** Database room names (Chinese, old or new) to the content document's room ids. */
export function cpiRoomId(name: string): string {
  if (name.includes('A栋单人')) return 'building-a-single';
  if (name.includes('A栋双人')) return 'building-a-double';
  if (name.includes('A栋三人')) return 'building-a-triple';
  if (name.includes('A栋四人')) return 'building-a-quad';
  if (name.includes('B栋单人')) return 'building-b-single';
  if (name.includes('B栋双人间A')) return 'building-b-double-a';
  if (name.includes('B栋双人间B')) return 'building-b-double-b';
  if (name.includes('B栋三人')) return 'building-b-triple';
  if (name.includes('B栋四人') || name.includes('B栋家庭')) return 'building-b-quad';
  if (name.includes('B栋六人')) return 'building-b-six';
  if (name.includes('Premium单人')) return 'premium-single';
  if (name.includes('Premium双人')) return 'premium-double';
  return cpiCourseId(name);
}

/** Database course names (e.g. “ESL GENERAL（15岁以上）”, “JUNIOR（6-15岁）”) to course ids. */
export function cpiCourseId(name: string): string {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
export class CpiSchoolPageComponent extends PhSchoolPageComponent<CpiPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CPI_PAGE_PROFILE; }
  protected override createQuote(): CpiQuote { return new CpiQuote(this); }
  protected override createComparison(): CpiPlanComparison {
    return new CpiPlanComparison(this, () => this.students[0]);
  }

  /** The search “CPI” also finds CPILS, so prefer CPI's own names. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return CPI_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('CPI') && !item.name.toUpperCase().includes('CPILS'));
  }

  /** The database still supplies 4-week prices; names, schedules and notes come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === cpiCourseId(lesson.name));
      if (course && lesson.price > 0) {
        course.tuition = lesson.price;
        course.tuition2027 = lesson.price;
      }
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === cpiRoomId(room.name));
      if (option && room.price > 0) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined) this.registrationFee = registration;
  }
}
