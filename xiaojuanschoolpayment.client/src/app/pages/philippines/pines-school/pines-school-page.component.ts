// The PINES page: the shared Philippine school page filled with PINES's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig, CiaCourseContent, CiaRoomContent } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultPinesContentConfig, PINES_FIXED_WEEK_COURSES } from './pines-content-config';
import { PinesPageStudent, PinesPlanComparison, PinesQuote } from './pines-page-quote';
import { PINES_PAGE_PROFILE, pinesListsTwoPriceYears } from './pines-page-profile';

/** Database school names, newest first. */
const PINES_SCHOOL_NAMES = ['菲律宾碧瑶PINES语言学校', 'PINES International Academy'];
const DEFAULT_CONTENT = createDefaultPinesContentConfig();

/** Price of a course on the list: a fixed-length course shows its whole package price. */
function pinesCoursePrice(course: CiaCourseContent, year: 2026 | 2027): number {
  const weeks = PINES_FIXED_WEEK_COURSES[course.id];
  const packagePrice = weeks ? (year === 2026 ? course.feeByWeeks : course.feeByWeeks2027)?.[String(weeks)] : undefined;
  if (packagePrice) return packagePrice;
  return year === 2026 ? course.tuition : course.tuition2027;
}

/** Under each room price group, the 2027 prices of rooms that change, while the list still shows 2026 prices. */
export function pinesRoomGroupNotes(rooms: readonly CiaRoomContent[]): Record<string, string> {
  if (!pinesListsTwoPriceYears()) return {};
  const notes: Record<string, string> = {};
  for (const group of new Set(rooms.filter(room => room.enabled).map(room => room.group))) {
    const changed = rooms
      .filter(room => room.enabled && room.group === group && room.fee2027 !== undefined && room.fee2027 !== room.fee)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (changed.length) {
      notes[group] = `2027/02/01起报名：${changed.map(room => `${room.label} ${(room.fee2027 as number).toLocaleString('en-US')}`).join('、')} 美元`;
    }
  }
  return notes;
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
export class PinesSchoolPageComponent extends PhSchoolPageComponent<PinesPageStudent> {
  /** The applied content document's catalogue, with the 2027 prices and package prices the shared mapping leaves out. */
  pinesCourses: readonly CiaCourseContent[] = DEFAULT_CONTENT.courses;
  pinesRooms: readonly CiaRoomContent[] = DEFAULT_CONTENT.rooms;
  override roomGroupNotes: Readonly<Record<string, string>> = pinesRoomGroupNotes(DEFAULT_CONTENT.rooms);

  protected override getProfile(): PhSchoolProfile { return PINES_PAGE_PROFILE; }
  protected override createQuote(): PinesQuote { return new PinesQuote(this); }
  protected override createComparison(): PinesPlanComparison {
    return new PinesPlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return PINES_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('PINES'));
  }

  /** Prices come only from the content document, which holds both the 2026 and the 2027 price lists. */
  protected override applyPricingData(): void {}

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.pinesCourses = content.courses;
    this.pinesRooms = content.rooms;
    this.roomGroupNotes = pinesRoomGroupNotes(content.rooms);
  }

  private pinesCourse(id: string): CiaCourseContent | undefined {
    return this.pinesCourses.find(item => item.id === id);
  }

  /** Until 2027-02-01 the list shows the 2026 price (a course new in 2027 shows its 2027 price). */
  override listPrice(fee: CourseFee): number {
    const course = this.pinesCourse(fee.id);
    if (!course) return super.listPrice(fee);
    return pinesCoursePrice(course, pinesListsTwoPriceYears() && pinesCoursePrice(course, 2026) > 0 ? 2026 : 2027);
  }

  override coursePriceUnit(fee: CourseFee): string {
    const weeks = PINES_FIXED_WEEK_COURSES[fee.id];
    return weeks ? `/${weeks}周` : super.coursePriceUnit(fee);
  }

  /** The 2027 price inside an opened course, while the list still shows the 2026 one. */
  override oldListPrice(fee: CourseFee): number | null {
    const course = this.pinesCourse(fee.id);
    if (!course || !this.show2026Prices || !this.copy.courses.oldPriceLabel || pinesCoursePrice(course, 2026) <= 0) return null;
    return pinesCoursePrice(course, 2027);
  }

  override roomFeeFor(id: string): number {
    const room = this.pinesRooms.find(item => item.id === id);
    if (!room) return super.roomFeeFor(id);
    return pinesListsTwoPriceYears() ? room.fee : room.fee2027 ?? room.fee;
  }
}
