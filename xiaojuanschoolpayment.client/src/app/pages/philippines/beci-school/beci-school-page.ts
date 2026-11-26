// What the three BECI campus pages share on the shared Philippine school page. All campuses live in one school
// record and one content document (BECI); each page shows and quotes its own campus only, so a subclass only names it.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import type { BeciCampus, BeciCourseContent, BeciRoomContent } from './beci-content-config';
import { BeciPageStudent, BeciPlanComparison, BeciQuote, type BeciQuotePricing } from './beci-page-quote';
import { BECI_SCHOOL_NAMES, beciCampusDefaults, beciPageProfile } from './beci-page-profile';

const PROFILES: Partial<Record<BeciCampus, PhSchoolProfile>> = {};
const enabledInOrder = <T extends { enabled: boolean; sortOrder: number }>(items: T[]): T[] =>
  items.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);

/** Campus of each media item the content document tags, keyed by its id and its url. */
function mediaCampuses(content: CiaContentConfig): Map<string, string> {
  const campuses = new Map<string, string>();
  for (const item of content.media ?? []) {
    const campus = item.campus || 'eop';
    if (item.id) campuses.set(item.id, campus);
    if (item.url) campuses.set(item.url, campus);
  }
  return campuses;
}

@Directive()
export abstract class BeciSchoolPageComponent extends PhSchoolPageComponent<BeciPageStudent> implements BeciQuotePricing {
  /** No initializers: the base class reads these before subclass fields exist. */
  private mediaCampusMap?: Map<string, string>;
  private appliedCourses?: BeciCourseContent[];
  private appliedRooms?: BeciRoomContent[];

  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract beciCampus(): BeciCampus;

  get beciCourses(): BeciCourseContent[] { return this.appliedCourses ?? enabledInOrder(beciCampusDefaults(this.beciCampus()).courses); }
  get beciRooms(): BeciRoomContent[] { return this.appliedRooms ?? enabledInOrder(beciCampusDefaults(this.beciCampus()).rooms); }

  protected override getProfile(): PhSchoolProfile {
    const campus = this.beciCampus();
    return PROFILES[campus] ??= beciPageProfile(campus);
  }
  protected override createQuote(): BeciQuote { return new BeciQuote(this, this.beciCampus()); }
  protected override createComparison(): BeciPlanComparison {
    return new BeciPlanComparison(this, this.beciCampus(), () => this.students[0]);
  }

  /** The BECI record (never BECI B'Cebu in Cebu). */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return BECI_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean);
  }

  /** BECI prices come only from its content document (published revision or the 2027 defaults). */
  protected override applyPricingData(): void {}

  /** Uploads tagged for another campus stay on that campus's page; untagged ones belong to the EOP page. */
  protected override acceptUploadedMedia(photo: SchoolPhotoDTO): boolean {
    const campuses = this.mediaCampusMap ??= new Map();
    const campus = (photo.id && campuses.get(photo.id)) || (photo.url && campuses.get(photo.url)) || 'eop';
    return campus === this.beciCampus();
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedCourses = enabledInOrder(content.courses as BeciCourseContent[]);
    this.appliedRooms = enabledInOrder(content.rooms as BeciRoomContent[]);
    this.mediaCampusMap = mediaCampuses(content);
    this.refreshUploadedMedia();
  }
}
