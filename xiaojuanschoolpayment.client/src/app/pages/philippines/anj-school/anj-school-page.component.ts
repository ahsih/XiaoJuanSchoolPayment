// The A&J ECO Campus page: the shared Philippine school page filled with A&J's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig, CiaCourseContent, CiaRoomContent } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultAnjContentConfig } from './anj-content-config';
import { AnjPageStudent, AnjPlanComparison, AnjQuote, type AnjQuotePricing } from './anj-page-quote';
import { ANJ_PAGE_PROFILE } from './anj-page-profile';

const enabledInOrder = <T extends { enabled: boolean; sortOrder: number }>(items: T[]): T[] =>
  items.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
const DEFAULT_CONTENT = createDefaultAnjContentConfig();
const DEFAULT_COURSES = enabledInOrder(DEFAULT_CONTENT.courses);
const DEFAULT_ROOMS = enabledInOrder(DEFAULT_CONTENT.rooms);

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
    './anj-school-page.component.css',
  ],
})
export class AnjSchoolPageComponent extends PhSchoolPageComponent<AnjPageStudent> implements AnjQuotePricing {
  protected override getProfile(): PhSchoolProfile { return ANJ_PAGE_PROFILE; }
  protected override createQuote(): AnjQuote { return new AnjQuote(this); }
  protected override createComparison(): AnjPlanComparison {
    return new AnjPlanComparison(this, () => this.students[0]);
  }

  private appliedCourses?: CiaCourseContent[];
  private appliedRooms?: CiaRoomContent[];
  /** Content rows with A&J-only fields. Getters, because the quote is built before this class's fields. */
  get anjCourses(): CiaCourseContent[] { return this.appliedCourses ?? DEFAULT_COURSES; }
  get anjRooms(): CiaRoomContent[] { return this.appliedRooms ?? DEFAULT_ROOMS; }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedCourses = enabledInOrder(content.courses);
    this.appliedRooms = enabledInOrder(content.rooms);
  }

  /** Prices come only from the content document (2027 price list); the database rows are an older 2026 copy. */
  protected override applyPricingData(): void {}

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(item => item.name === ANJ_PAGE_PROFILE.pricingSchoolName)
      ?? schools.find(item => item.name.includes('A&J'));
  }

  private packages(fee: CourseFee): Record<string, number> {
    return this.anjCourses.find(item => item.id === fee.id)?.feeByWeeks ?? {};
  }

  /** Guarantee courses are fixed packages (12 weeks and longer), so the list shows the shortest package's price. */
  private packageWeeks(fee: CourseFee): number | undefined {
    const weeks = Object.keys(this.packages(fee)).map(Number).filter(value => value > 0);
    return weeks.length ? Math.min(...weeks) : undefined;
  }

  override listPrice(fee: CourseFee): number {
    const weeks = this.packageWeeks(fee);
    return weeks ? this.packages(fee)[String(weeks)] ?? fee.tuition2027 : fee.tuition2027;
  }

  override coursePriceUnit(fee: CourseFee): string {
    const weeks = this.packageWeeks(fee);
    return weeks ? `/${weeks}周` : super.coursePriceUnit(fee);
  }
}
