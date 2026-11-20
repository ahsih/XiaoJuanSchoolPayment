// The CPILS page: the shared Philippine school page filled with CPILS's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultCpilsContentConfig } from './cpils-content-config';
import { CpilsPageStudent, CpilsPlanComparison, CpilsQuote } from './cpils-page-quote';
import { CPILS_PAGE_PROFILE, cpilsRooms2027, cpilsShortStayRatios, cpilsVisibleCourses } from './cpils-page-profile';

const DEFAULT_CONTENT = createDefaultCpilsContentConfig();
const SCHOOL_NAMES = ['菲律宾宿务CPILS语言学校', 'CPILS'];
const ROOM_GROUP_TITLES: Record<string, string> = { Regular: '普通房', Premium: '高级房', 无对外窗: '无对外窗房' };

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
export class CpilsSchoolPageComponent extends PhSchoolPageComponent<CpilsPageStudent> {
  protected override getProfile(): PhSchoolProfile { return CPILS_PAGE_PROFILE; }
  protected override createQuote(): CpilsQuote { return new CpilsQuote(this); }
  protected override createComparison(): CpilsPlanComparison {
    return new CpilsPlanComparison(this, () => this.students[0]);
  }

  private appliedContent?: CiaContentConfig;
  /** The applied content document; the quote prices every row from it. A getter, because the quote is built before this class's fields. */
  get cpilsContent(): CiaContentConfig { return this.appliedContent ?? DEFAULT_CONTENT; }

  override shortTermPriceRatios: Record<string, number> = cpilsShortStayRatios(DEFAULT_CONTENT);

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedContent = content;
    this.courseFees = cpilsVisibleCourses(content, this.courseFees);
    this.roomFees = cpilsRooms2027(content, this.roomFees);
    this.shortTermPriceRatios = cpilsShortStayRatios(content);
    this.roomRateGroups = this.roomRateGroups.map(group => ({ ...group, title: ROOM_GROUP_TITLES[group.title] ?? group.title }));
  }

  /** CPILS prices come from its dated content document, not from the database's 4-week rows. */
  protected override applyPricingData(): void {}

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toLowerCase().includes('cpils'));
  }

  private source(fee: CourseFee) { return this.cpilsContent.courses.find(item => item.id === fee.id); }
  /** Guarantee courses are one fixed package (8 or 12 weeks), so the list shows the package price. */
  private packageWeeks(fee: CourseFee): number | undefined {
    const source = this.source(fee);
    return source && !source.tuition2027 ? source.allowedWeeks2027?.[0] : undefined;
  }

  override listPrice(fee: CourseFee): number {
    const weeks = this.packageWeeks(fee);
    return weeks ? this.source(fee)?.feeByWeeks2027?.[String(weeks)] ?? 0 : fee.tuition2027;
  }

  override coursePriceUnit(fee: CourseFee): string {
    const weeks = this.packageWeeks(fee);
    return weeks ? `/${weeks}周` : super.coursePriceUnit(fee);
  }

  /** 2026 price inside an opened course; courses that only have 2027 prices (亲子课程) leave it out. */
  override oldListPrice(fee: CourseFee): number | null {
    if (!this.show2026Prices) return null;
    const weeks = this.packageWeeks(fee);
    const price = weeks ? this.source(fee)?.feeByWeeks?.[String(weeks)] ?? 0 : fee.tuition;
    return price > 0 ? price : null;
  }
}
