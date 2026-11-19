// The EV main-campus page: the shared Philippine school page filled with EV's profile and quote.
import { Component } from '@angular/core';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { EvPageStudent, EvPlanComparison, EvQuote } from './ev-page-quote';
import { EV_PAGE_PROFILE } from './ev-page-profile';

/** Database course names (Chinese or English, old or new) to the content document's course ids. */
export function evCourseId(name: string): string {
  const lower = name.toLowerCase();
  const speaking = (level: '6' | '8') => name.includes(`强化口说${level}`) || name.includes(`口语强化${level}`) || name.includes(`Power Speaking ${level}`);
  const toeic = name.includes('多益') || name.includes('托业') || lower.includes('toeic');
  if (name.includes('半斯巴达')) {
    if (speaking('6')) return 'semi-sparta-power-speaking-6';
    if (speaking('8')) return 'semi-sparta-power-speaking-8';
    if (toeic) return 'semi-sparta-toeic';
    if (name.includes('商务') || lower.includes('business')) return 'semi-sparta-business';
    if (name.includes('社交媒体')) return 'semi-sparta-social-media-english';
    if (name.includes('综合英语') || lower.includes('esl')) return 'semi-sparta-esl';
  }
  if (name.includes('斯巴达') || lower.includes('sparta')) {
    if (name.includes('Intensive ESL') || name.includes('强化英语') || name.includes('密集ESL')) return 'sparta-intensive-esl';
    if (speaking('6')) return 'sparta-power-speaking-6';
    if (speaking('8')) return 'sparta-power-speaking-8';
    if (name.includes('雅思保证') || name.includes('雅思保分')) return 'sparta-ielts-guarantee';
    if (name.includes('雅思') || lower.includes('ielts')) return 'sparta-ielts-regular';
    if (toeic) return 'sparta-toeic';
    if (name.includes('社交媒体')) return 'sparta-social-media-english';
    if (name.includes('商务') || lower.includes('business')) return 'sparta-business';
  }
  return slugifyPriceKey(name);
}

/** Database room names to the content document's room ids. */
export function evRoomId(name: string): string {
  if (name.includes('四人间（上下铺）')) return 'quad-bunk';
  if (name.includes('校外公寓单')) return 'off-campus-single';
  if (name.includes('校外公寓双')) return 'off-campus-double';
  if (name.includes('单人') || name.includes('单间')) return 'single';
  if (name.includes('双人')) return 'double';
  if (name.includes('三人')) return 'triple';
  if (name.includes('四人')) return 'quad-bunk';
  return slugifyPriceKey(name);
}

function slugifyPriceKey(value: string): string {
  return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
  ],
})
export class EvSchoolPageComponent extends PhSchoolPageComponent<EvPageStudent> {
  protected override getProfile(): PhSchoolProfile { return EV_PAGE_PROFILE; }
  protected override createQuote(): EvQuote { return new EvQuote(this); }
  protected override createComparison(): EvPlanComparison {
    return new EvPlanComparison(this, () => this.students[0]);
  }

  /** Under-18 management fee per started 4 course weeks (published setting, else the database fee). */
  minorManagementFeePerPeriod = this.profile.defaultContent().quoteSettings.minorManagementFeePerPeriod ?? 100;

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.minorManagementFeePerPeriod = content.quoteSettings.minorManagementFeePerPeriod ?? 100;
  }

  /** The database still supplies 4-week prices; names, schedules and notes come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === evCourseId(lesson.name));
      if (course && lesson.price > 0) {
        course.tuition = lesson.price;
        course.tuition2027 = lesson.price;
      }
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === evRoomId(room.name));
      if (option && room.price > 0) option.fee = room.price;
    }
    const fee = (name: string) => fees.find(item => item.name === name)?.fee;
    const registration = fee('注册费');
    if (registration !== undefined) this.registrationFee = registration;
    const peak = fee('旺季附加费');
    if (peak && peak > 0) this.seasonalFeePerWeek = peak;
    const minor = fee('未成年管理费');
    if (minor && minor > 0) this.minorManagementFeePerPeriod = minor;
  }
}
