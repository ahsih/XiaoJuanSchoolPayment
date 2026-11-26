// The EV Academy La Mer page: the shared Philippine school page filled with La Mer's profile and quote.
// La Mer is its own school (code EV-LAMER); never resolve it through a loose “EV” match or fall back to the main campus.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultLaMerContentConfig, LA_MER_SCHOOL_ID, LA_MER_SCHOOL_NAME } from './la-mer-content-config';
import { LaMerPageStudent, LaMerPlanComparison, LaMerQuote } from './la-mer-page-quote';
import { LA_MER_PAGE_PROFILE } from './la-mer-page-profile';
import type { LaMerPolicy } from './la-mer-types';

const DEFAULT_POLICY: LaMerPolicy = createDefaultLaMerContentConfig().quoteSettings.laMer!;

/** Database course names (the seed's lookup names, or Chinese ones) to the content document's course ids. */
export function laMerCourseId(name: string): string | undefined {
  const lower = name.toLowerCase();
  if (lower.includes('power speaking 8') || name.includes('口语强化8') || name.includes('密集口语')) return 'power-speaking-8';
  if (lower.includes('power speaking 6') || name.includes('口语强化6') || name.includes('强化口语')) return 'power-speaking-6';
  if (lower.includes('senior') || name.includes('熟龄')) return 'senior';
  if (lower.includes('esl') || name.includes('综合英语')) return 'esl-classic';
  return undefined;
}

/** Database room names to the content document's room ids. */
export function laMerRoomId(name: string): string | undefined {
  if (name.includes('泳池')) return 'pool-double';
  if (name.includes('单人')) return 'single';
  if (name.includes('双人')) return 'double';
  if (name.includes('三人')) return 'triple';
  if (name.includes('四人')) return 'quad';
  return undefined;
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
export class LaMerSchoolPageComponent extends PhSchoolPageComponent<LaMerPageStudent> {
  /** Published family-package policy; no initializer, because the base class builds the quote first. */
  private publishedLaMerPolicy?: LaMerPolicy;

  /** Family versions, packages and deposits that the quote reads (published, else the defaults). */
  get laMerPolicy(): LaMerPolicy { return this.publishedLaMerPolicy ?? DEFAULT_POLICY; }

  protected override getProfile(): PhSchoolProfile { return LA_MER_PAGE_PROFILE; }
  protected override createQuote(): LaMerQuote { return new LaMerQuote(this); }
  protected override createComparison(): LaMerPlanComparison {
    return new LaMerPlanComparison(this, () => this.students[0]);
  }

  /** The baseline id or the exact database name: a search for “La Mer” must never pick the EV main campus. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.id === LA_MER_SCHOOL_ID) ?? schools.find(item => item.name === LA_MER_SCHOOL_NAME);
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.publishedLaMerPolicy = content.quoteSettings.laMer ?? DEFAULT_POLICY;
  }

  /** The database supplies 4-week prices under the seed's lookup names; text comes from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === laMerCourseId(lesson.name));
      if (course && lesson.price > 0) {
        course.tuition = lesson.price;
        course.tuition2027 = lesson.price;
      }
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === laMerRoomId(room.name));
      if (option && room.price > 0) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined && registration > 0) this.registrationFee = registration;
  }
}
