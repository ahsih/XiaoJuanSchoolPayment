// What the two JIC campus pages share on the shared Philippine school page. Both campuses live in one school
// record and one content document; each page shows and quotes its own campus only, so a subclass only names it.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { JicPageStudent, JicPlanComparison, JicQuote } from './jic-page-quote';
import { JIC_SCHOOL_NAME, jicCampusDefaults, jicPageProfile } from './jic-page-profile';
import type { JicCampus } from './jic-pricing';

const PROFILES: Partial<Record<JicCampus, PhSchoolProfile>> = {};

/** Campus of each media item the content document tags, keyed by its id and its url. */
function mediaCampuses(content: CiaContentConfig): Map<string, string> {
  const campuses = new Map<string, string>();
  for (const item of content.media ?? []) {
    if (!item.campus) continue;
    if (item.id) campuses.set(item.id, item.campus);
    if (item.url) campuses.set(item.url, item.campus);
  }
  return campuses;
}

@Directive()
export abstract class JicSchoolPageComponent extends PhSchoolPageComponent<JicPageStudent> {
  /** No initializer: the base class may read it before subclass fields exist. */
  private mediaCampusMap?: Map<string, string>;

  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract jicCampus(): JicCampus;

  protected override getProfile(): PhSchoolProfile {
    const campus = this.jicCampus();
    return PROFILES[campus] ??= jicPageProfile(campus);
  }
  protected override createQuote(): JicQuote { return new JicQuote(this, this.jicCampus()); }
  protected override createComparison(): JicPlanComparison {
    return new JicPlanComparison(this, this.jicCampus(), () => this.students[0]);
  }

  /** Exact database name only. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.name === JIC_SCHOOL_NAME);
  }

  /** JIC prices come only from its content document (published revision or defaults). */
  protected override applyPricingData(): void {}

  /** Uploaded photos and videos tagged for the other campus stay on that campus's page. */
  protected override acceptUploadedMedia(photo: SchoolPhotoDTO): boolean {
    const campuses = this.mediaCampusMap ??= mediaCampuses(jicCampusDefaults(this.jicCampus()));
    const campus = (photo.id && campuses.get(photo.id)) || (photo.url && campuses.get(photo.url));
    return !campus || campus === this.jicCampus();
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.mediaCampusMap = mediaCampuses(content);
    this.refreshUploadedMedia();
  }
}
