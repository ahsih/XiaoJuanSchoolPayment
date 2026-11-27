// What the two GITC campus pages share on the shared Philippine school page. Both campuses live in one school record
// and one content document (GITC); each page shows and quotes its own campus only, so a subclass only names it.
// Until the 2027 list starts the course and room lists show 2026 prices, with the 2027 price inside each course and
// under each room group (as on the PINES page).
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { GitcCampus, GitcCourseContent, GitcRoomContent } from './gitc-content-config';
import { GitcPageStudent, GitcPlanComparison, GitcQuote, type GitcQuotePricing } from './gitc-page-quote';
import { GITC_SCHOOL_NAMES, gitcCampusDefaults, gitcListsTwoPriceYears, gitcPageProfile } from './gitc-page-profile';

const PROFILES: Partial<Record<GitcCampus, PhSchoolProfile>> = {};
const enabledInOrder = <T extends { enabled: boolean; sortOrder: number }>(items: T[]): T[] =>
  items.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
const usd = (value: number) => value.toLocaleString('en-US');

/** Campus of each media item the content document tags, keyed by its id and its url. */
function mediaCampuses(content: CiaContentConfig): Map<string, string> {
  const campuses = new Map<string, string>();
  for (const item of content.media ?? []) {
    const campus = item.campus || 'iloilo';
    if (item.id) campuses.set(item.id, campus);
    if (item.url) campuses.set(item.url, campus);
  }
  return campuses;
}

/** Under each room group, the 2027 prices while the list still shows 2026 ones. */
export function gitcRoomGroupNotes(rooms: readonly GitcRoomContent[], campusNotes: Readonly<Record<string, string>>): Record<string, string> {
  const notes: Record<string, string> = { ...campusNotes };
  if (!gitcListsTwoPriceYears()) return notes;
  for (const group of new Set(rooms.filter(room => room.enabled).map(room => room.group))) {
    const priced = rooms
      .filter(room => room.enabled && room.group === group && !room.price2027Pending && (room.fee2027 ?? 0) > 0)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (!priced.length) continue;
    const line = `2027/02/15起开课：${priced.map(room => `${room.label} ${usd(room.fee2027 as number)}`).join('、')} 美元。`;
    notes[group] = notes[group] ? `${line}${notes[group]}` : line;
  }
  return notes;
}

@Directive()
export abstract class GitcSchoolPageComponent extends PhSchoolPageComponent<GitcPageStudent> implements GitcQuotePricing {
  /** No initializers: the base class reads these before subclass fields exist. */
  private mediaCampusMap?: Map<string, string>;
  private appliedCourses?: GitcCourseContent[];
  private appliedRooms?: GitcRoomContent[];

  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract gitcCampus(): GitcCampus;

  get gitcCourses(): GitcCourseContent[] { return this.appliedCourses ?? enabledInOrder(gitcCampusDefaults(this.gitcCampus()).courses); }
  get gitcRooms(): GitcRoomContent[] { return this.appliedRooms ?? enabledInOrder(gitcCampusDefaults(this.gitcCampus()).rooms as GitcRoomContent[]); }

  override roomGroupNotes: Readonly<Record<string, string>> = gitcRoomGroupNotes(this.gitcRooms, this.getProfile().roomGroupNotes ?? {});

  protected override getProfile(): PhSchoolProfile {
    const campus = this.gitcCampus();
    return PROFILES[campus] ??= gitcPageProfile(campus);
  }
  protected override createQuote(): GitcQuote { return new GitcQuote(this, this.gitcCampus()); }
  protected override createComparison(): GitcPlanComparison {
    return new GitcPlanComparison(this, this.gitcCampus(), () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return GITC_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('GITC'));
  }

  /** GITC prices come only from its content document (published revision or the 2026/2027 defaults). */
  protected override applyPricingData(): void {}

  /** Uploads tagged for another campus stay on that campus's page; untagged ones belong to the Iloilo page. */
  protected override acceptUploadedMedia(photo: SchoolPhotoDTO): boolean {
    const campuses = this.mediaCampusMap ??= new Map();
    const campus = (photo.id && campuses.get(photo.id)) || (photo.url && campuses.get(photo.url)) || 'iloilo';
    return campus === this.gitcCampus();
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedCourses = enabledInOrder(content.courses);
    this.appliedRooms = enabledInOrder(content.rooms as GitcRoomContent[]);
    this.roomGroupNotes = gitcRoomGroupNotes(this.appliedRooms, this.getProfile().roomGroupNotes ?? {});
    this.mediaCampusMap = mediaCampuses(content);
    this.refreshUploadedMedia();
  }

  private gitcCourse(id: string): GitcCourseContent | undefined { return this.gitcCourses.find(item => item.id === id); }
  private gitcRoom(id: string): GitcRoomContent | undefined { return this.gitcRooms.find(item => item.id === id); }

  /** Until 2027-02-14 the list shows the 2026 price (a course only on the 2027 list shows that one). */
  override listPrice(fee: CourseFee): number {
    const course = this.gitcCourse(fee.id);
    if (!course) return super.listPrice(fee);
    return gitcListsTwoPriceYears() && course.tuition > 0 ? course.tuition : course.tuition2027 || course.tuition;
  }

  /** The 2027 price inside an opened course, while the list still shows the 2026 one. */
  override oldListPrice(fee: CourseFee): number | null {
    const course = this.gitcCourse(fee.id);
    if (!course || !gitcListsTwoPriceYears() || course.tuition <= 0 || course.tuition2027 <= 0) return null;
    return course.tuition2027;
  }

  override roomFeeFor(id: string): number {
    const room = this.gitcRoom(id);
    if (!room) return super.roomFeeFor(id);
    if (gitcListsTwoPriceYears()) return room.fee;
    return room.price2027Pending ? 0 : room.fee2027 ?? 0;
  }

  override roomPriceText(id: string): string {
    const room = this.gitcRoom(id);
    if (room && !gitcListsTwoPriceYears() && (room.price2027Pending || !(room.fee2027 ?? 0))) {
      return room.price2027Pending ? '待学校确认' : '不再开放';
    }
    return super.roomPriceText(id);
  }
}
