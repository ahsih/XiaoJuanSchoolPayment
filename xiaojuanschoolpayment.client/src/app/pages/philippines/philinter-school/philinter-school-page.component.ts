// The Philinter page: the shared Philippine school page filled with Philinter's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import type { CourseFee } from '../cia-school/cia-page-content';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import {
  createDefaultPhilinterContentConfig,
  PHILINTER_PRICE_SWITCH_ARRIVAL,
  type PhilinterQuoteSettings,
} from './philinter-content-config';
import { PhilinterPageStudent, PhilinterPlanComparison, PhilinterQuote } from './philinter-page-quote';
import { PHILINTER_PAGE_PROFILE } from './philinter-page-profile';

const DEFAULT_CONTENT = createDefaultPhilinterContentConfig();
/** Database school names, newest first. */
const PHILINTER_SCHOOL_NAMES = ['菲律宾宿务Philinter语言学校', 'Philinter Academy'];
/** Courses sold as one fixed package; the course list shows the package price. */
const PACKAGE_WEEKS: Readonly<Record<string, number>> = {
  'ielts-guarantee-8-weeks': 8,
  'ielts-guarantee-12-weeks': 12,
  'ielts-16-weeks-6-5': 16,
  'ielts-16-weeks-5-5': 16,
  speaking: 8,
};

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
export class PhilinterSchoolPageComponent extends PhSchoolPageComponent<PhilinterPageStudent> {
  protected override getProfile(): PhSchoolProfile { return PHILINTER_PAGE_PROFILE; }
  protected override createQuote(): PhilinterQuote { return new PhilinterQuote(this); }
  protected override createComparison(): PhilinterPlanComparison {
    return new PhilinterPlanComparison(this, () => this.students[0]);
  }

  private appliedContent?: CiaContentConfig;
  /** The applied content document, or the defaults before any is applied. A getter, because the quote is built before this class's fields. */
  private get content(): CiaContentConfig { return this.appliedContent ?? DEFAULT_CONTENT; }
  private get settings(): PhilinterQuoteSettings { return this.content.quoteSettings as PhilinterQuoteSettings; }

  /** Four-week room prices for first arrivals from priceSwitchArrival (2027-01-03). */
  get roomFees2027(): Record<string, number> {
    return Object.fromEntries(this.content.rooms
      .filter(room => room.enabled && typeof room.fee2027 === 'number' && room.fee2027 > 0)
      .map(room => [room.id, room.fee2027 as number]));
  }
  get registrationFee2027(): number { return this.settings.registrationFee2027 ?? this.registrationFee; }
  get priceSwitchArrival(): string { return this.settings.priceSwitchArrival || PHILINTER_PRICE_SWITCH_ARRIVAL; }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedContent = content;
  }

  /** Philinter prices come only from its content document; the database's older 4-week rows are not used. */
  protected override applyPricingData(): void {}

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return PHILINTER_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toLowerCase().includes('philinter'));
  }

  /** The room price list shows the 2027 price, which every new quote from 2027-01-03 uses. */
  override roomFeeFor(id: string): number {
    return this.roomFees2027[id] ?? super.roomFeeFor(id);
  }

  /** Fixed-length courses (IELTS Guarantee, the 16-week IELTS courses, Premium Speaking): the list shows the whole tuition. */
  override listPrice(fee: CourseFee): number {
    const weeks = PACKAGE_WEEKS[fee.id];
    return weeks ? Math.round(fee.tuition2027 * weeks / 4) : fee.tuition2027;
  }

  override coursePriceUnit(fee: CourseFee): string {
    const weeks = PACKAGE_WEEKS[fee.id];
    return weeks ? `/${weeks}周` : super.coursePriceUnit(fee);
  }
}
