// What the two Winning campus pages share on the shared Philippine school page. Both campuses live in one school
// record and one content document; each page shows and quotes its own campus only, so a subclass only names it.
import { Directive } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { WinningPageStudent, WinningPlanComparison, WinningQuote } from './winning-page-quote';
import { WINNING_SCHOOL_NAME, winningCampusDefaults, winningPageProfile } from './winning-page-profile';
import type { WinningCampus } from './winning-pricing';

const PROFILES: Partial<Record<WinningCampus, PhSchoolProfile>> = {};

/** Campus of each media item the content document tags, keyed by its id and its url. */
function mediaCampuses(content: CiaContentConfig): Map<string, string> {
  const campuses = new Map<string, string>();
  for (const item of content.media ?? []) {
    if (!item.campus || item.campus === 'both') continue;
    if (item.id) campuses.set(item.id, item.campus);
    if (item.url) campuses.set(item.url, item.campus);
  }
  return campuses;
}

@Directive()
export abstract class WinningSchoolPageComponent extends PhSchoolPageComponent<WinningPageStudent> {
  /** No initializer: the base class may read it before subclass fields exist. */
  private mediaCampusMap?: Map<string, string>;

  /** A method, not a field: the base class reads the profile and builds the quote before subclass fields exist. */
  protected abstract winningCampus(): WinningCampus;

  protected override getProfile(): PhSchoolProfile {
    const campus = this.winningCampus();
    return PROFILES[campus] ??= winningPageProfile(campus);
  }
  protected override createQuote(): WinningQuote { return new WinningQuote(this, this.winningCampus()); }
  protected override createComparison(): WinningPlanComparison {
    return new WinningPlanComparison(this, this.winningCampus(), () => this.students[0]);
  }

  /** Exact database name only. */
  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.name === WINNING_SCHOOL_NAME);
  }

  /** Winning prices come only from its content document (published revision or defaults). */
  protected override applyPricingData(): void {}

  /** Uploaded photos and videos tagged for the other campus stay on that campus's page. */
  protected override acceptUploadedMedia(photo: SchoolPhotoDTO): boolean {
    const campuses = this.mediaCampusMap ??= mediaCampuses(winningCampusDefaults(this.winningCampus()));
    const campus = (photo.id && campuses.get(photo.id)) || (photo.url && campuses.get(photo.url));
    return !campus || campus === this.winningCampus();
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.mediaCampusMap = mediaCampuses(content);
    this.refreshUploadedMedia();
  }
}
