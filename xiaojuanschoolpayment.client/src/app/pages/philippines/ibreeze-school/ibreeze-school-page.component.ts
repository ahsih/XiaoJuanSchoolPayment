// The I.BREEZE page: the shared Philippine school page filled with I.BREEZE's profile and quote.
import { Component } from '@angular/core';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import type { CiaContentConfig } from '../cia-school/cia-content-config';
import { PH_SCHOOL_PAGE_IMPORTS, PhSchoolPageComponent } from '../school-page/ph-school-page.component';
import type { PhSchoolProfile } from '../school-page/ph-school-profile';
import { createDefaultIbreezeContentConfig } from './ibreeze-content-config';
import { IbreezePageStudent, IbreezePlanComparison, IbreezeQuote } from './ibreeze-page-quote';
import { IBREEZE_PAGE_PROFILE, ibreezeShows2026Prices } from './ibreeze-page-profile';

/** Database school names, newest first. */
const IBREEZE_SCHOOL_NAMES = ['菲律宾宿务I.BREEZE语言学校', 'I.BREEZE International Language Center', 'IBREEZE'];

const DEFAULT_CONTENT = createDefaultIbreezeContentConfig();

/** Database course names (e.g. “Power ESL”) to course ids. */
export function ibreezeCourseId(name: string): string {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Database room names (Chinese) to the content document's room ids. */
export function ibreezeRoomId(name: string): string {
  if (name.includes('IB1四人')) return 'quad-main';
  if (name.includes('IB1三人')) return 'triple-main';
  if (name.includes('IB1双人')) return 'twin-main';
  if (name.includes('IB1单人')) return 'single-main';
  if (name.includes('IB2四人')) return 'quad-ib2';
  if (name.includes('IB2双人')) return 'twin-ib2';
  if (name.includes('IB2单人')) return 'single-ib2';
  if (name.includes('超级单人')) return 'off-campus-superior-single';
  if (name.includes('标准单人')) return 'off-campus-standard-single';
  if (name.includes('标准双人')) return 'off-campus-standard-twin';
  if (name.includes('超级双人')) return 'off-campus-superior-twin';
  if (name.includes('家庭')) return 'off-campus-family';
  return ibreezeCourseId(name);
}

/**
 * Short-stay shares of the four-week price for the page's 短期就读费率 block, taken from the Power ESL table of the
 * price year in force (prices follow the registration date). The quote itself uses each course's and room's exact table.
 */
export function ibreezeShortStayRatios(content: CiaContentConfig, use2026 = ibreezeShows2026Prices()): Record<string, number> {
  const course = content.courses.find(item => item.id === 'power-esl');
  const four = (use2026 ? course?.tuition : course?.tuition2027) ?? 0;
  const rows = (use2026 ? course?.feeByWeeks : course?.feeByWeeks2027) ?? {};
  if (!four) return { ...content.quoteSettings.shortStayRatios };
  return Object.fromEntries(['1', '2', '3'].filter(week => rows[week]).map(week => [week, rows[week] / four]));
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
export class IbreezeSchoolPageComponent extends PhSchoolPageComponent<IbreezePageStudent> {
  /** The applied content document; no initializer, because the base class builds the quote before subclass fields exist. */
  private appliedContent?: CiaContentConfig;

  /** I.BREEZE quote pricing: the published content document, or the defaults until it arrives. */
  get ibreezeContent(): CiaContentConfig { return this.appliedContent ?? DEFAULT_CONTENT; }

  override shortTermPriceRatios: Record<string, number> = ibreezeShortStayRatios(DEFAULT_CONTENT);

  protected override getProfile(): PhSchoolProfile { return IBREEZE_PAGE_PROFILE; }
  protected override createQuote(): IbreezeQuote { return new IbreezeQuote(this); }
  protected override createComparison(): IbreezePlanComparison {
    return new IbreezePlanComparison(this, () => this.students[0]);
  }

  protected override findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return IBREEZE_SCHOOL_NAMES.map(name => schools.find(item => item.name === name)).find(Boolean)
      ?? schools.find(item => item.name.toUpperCase().includes('I.BREEZE'));
  }

  /** The database still supplies 2026 four-week prices; 2027 prices and short-stay tables come from the content document. */
  protected override applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === ibreezeCourseId(lesson.name));
      if (course && lesson.price > 0) course.tuition = lesson.price;
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === ibreezeRoomId(room.name));
      if (option && room.price > 0) option.fee = room.price;
    }
    const registration = fees.find(item => item.name === '注册费')?.fee;
    if (registration !== undefined) this.registrationFee = registration;
    const seasonal = fees.find(item => item.name === '暑期附加费')?.fee;
    if (seasonal !== undefined) this.seasonalFeePerWeek = seasonal;
  }

  protected override afterContentApplied(content: CiaContentConfig): void {
    this.appliedContent = content;
    this.shortTermPriceRatios = ibreezeShortStayRatios(content);
  }

  /** Prices follow the registration date: the 2026 list until 2026/12/31, then the 2027 list. */
  override listPrice(fee: { tuition: number; tuition2027: number }): number {
    return this.show2026Prices ? fee.tuition : fee.tuition2027;
  }

  /** Inside an opened course: the 2027 price while 2026 prices still apply. */
  override oldListPrice(fee: { tuition: number; tuition2027: number }): number | null {
    return this.show2026Prices ? fee.tuition2027 : null;
  }

  override roomFeeFor(id: string): number {
    if (this.show2026Prices) return super.roomFeeFor(id);
    return this.ibreezeContent.rooms.find(room => room.id === id)?.fee2027 ?? super.roomFeeFor(id);
  }
}
