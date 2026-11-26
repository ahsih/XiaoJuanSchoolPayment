import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateService, isUsableExchangeRates } from '../../../../../services/exchange-rate.service';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../../../../components/quote-image-download-button.component';
import { SIDA_CALLABLE_CONSULTANTS } from '../../../../components/sida-consultants';
import { UkQuoteSheetComponent } from '../../../../components/uk-quote/uk-quote-sheet.component';
import { UkQuoteSheet, ukDateText } from '../../../../components/uk-quote/uk-quote-sheet';
import {
  ATC_CAMBRIDGE_SESSIONS,
  ATC_CAMPUSES,
  ATC_COURSES,
  ATC_EXAMS,
  ATC_FEES,
  ATC_MAX_COURSE_WEEKS,
  ATC_RENEWAL,
  AtcCourseId,
  AtcStayType,
} from './atc-pricing';
import {
  ATC_PROGRAMMES,
  AtcPlanInput,
  AtcProgramme,
  AtcQuoteInput,
  atcCourseSpanWeeks,
  atcCourseStarts,
  atcRenewalActive,
  atcRenewalStarts,
  atcRoomsFor,
  buildAtcSheet,
  defaultAtcPlan,
  defaultAtcQuote,
} from './atc-quote';

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Ireland is handled by these consultants; the quote image needs one with a phone number. */
const ATC_CONSULTANT_NAMES = ['Jenny', 'Lemon'];

@Component({
  selector: 'app-atc-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UkQuoteSheetComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './atc-quote-calculator.component.html',
  styleUrl: './atc-quote-calculator.component.css',
})
export class AtcQuoteCalculatorComponent {
  readonly today = localToday();
  readonly renewalOpen = atcRenewalActive(this.today);
  readonly programmes = ATC_PROGRAMMES;
  readonly campuses = ATC_CAMPUSES;
  readonly courses = ATC_COURSES;
  readonly exams = ATC_EXAMS;
  readonly fees = ATC_FEES;
  readonly renewalCourses = ATC_RENEWAL.courses;
  readonly returningDiscount = ATC_RENEWAL.returningDiscount;
  readonly consultants = SIDA_CALLABLE_CONSULTANTS.filter(item => ATC_CONSULTANT_NAMES.includes(item.name)).length
    ? SIDA_CALLABLE_CONSULTANTS.filter(item => ATC_CONSULTANT_NAMES.includes(item.name))
    : SIDA_CALLABLE_CONSULTANTS;
  readonly courseStarts = atcCourseStarts();
  readonly renewalStarts = atcRenewalStarts(this.today);
  readonly cambridgeStarts = ATC_CAMBRIDGE_SESSIONS.map(session => session.start);
  readonly stayWeekOptions = Array.from({ length: ATC_MAX_COURSE_WEEKS + 4 }, (_, index) => index + 1);
  readonly planTags = ['方案一', '方案二'];
  readonly dateText = ukDateText;

  input: AtcQuoteInput = defaultAtcQuote(this.today);
  consultantName = this.consultants[0]?.name ?? '';

  private eurToCny: number | null = null;
  private rateDate = '';
  private readonly rates = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(snapshot => {
    const rate = snapshot.rates?.['EUR']?.rate;
    const usable = isUsableExchangeRates(snapshot) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
    this.eurToCny = usable ? 1 / rate : null;
    this.rateDate = usable ? snapshot.date : '';
  });

  get contact() {
    return this.consultants.find(item => item.name === this.consultantName) ?? this.consultants[0];
  }

  get renewal(): boolean {
    return this.input.programme === 'renewal';
  }

  get sheet(): UkQuoteSheet {
    const contact = this.contact;
    return buildAtcSheet(this.input, this.quoteDateText, { eurToCny: this.eurToCny, date: this.rateDate },
      { name: contact.name, title: contact.title, phone: contact.phone, qrSrc: contact.qrSrc });
  }

  get quoteDateText(): string {
    const [year, month, day] = this.today.split('-').map(Number);
    return `${year}年${month}月${day}日`;
  }

  get canExport(): boolean {
    const sheet = this.sheet;
    return !sheet.issues.length && sheet.requiredTotalsCny.every(value => value !== null);
  }

  get hasTransfer(): boolean {
    return this.input.plans.some(plan => plan.transfer !== 'none');
  }

  get quoteImage(): QuoteImageCardData {
    const sheet = this.sheet;
    const contact = this.contact;
    return {
      layout: 'uk-package',
      ukSheet: sheet,
      fileName: sheet.fileName,
      logoSrc: '/assets/sida-qihang-navbar-logo.jpg',
      heroSrc: '/assets/sida-qihang-navbar-logo.jpg',
      schoolCode: 'ATC',
      title: sheet.title,
      subtitle: sheet.subtitle,
      quoteDateText: sheet.quoteDate,
      updatedAtText: sheet.quoteDate,
      studentItems: [],
      paymentItems: [],
      totalLabel: '必付合计',
      totalUsd: '',
      totalCny: '',
      localFeeAmount: '',
      localFeeDescription: '',
      localFeeNote: '',
      note: '',
      contact: { name: contact.name, phone: contact.phone, avatarSrc: contact.avatarSrc, qrSrc: contact.qrSrc },
    };
  }

  selectProgramme(programme: AtcProgramme): void {
    if (programme === this.input.programme) return;
    this.input = {
      ...this.input,
      programme,
      age: programme === 'renewal' ? 'adult' : this.input.age,
      plans: this.input.plans.map(() => defaultAtcPlan(programme, this.today)),
    };
  }

  startsFor(plan: AtcPlanInput): string[] {
    if (this.renewal) return this.renewalStarts;
    return plan.course === 'cambridge' ? this.cambridgeStarts : this.courseStarts;
  }

  weekOptions(plan: AtcPlanInput): number[] {
    const course = this.courses.find(item => item.id === plan.course);
    const min = course?.minWeeks ?? 1;
    return Array.from({ length: ATC_MAX_COURSE_WEEKS - min + 1 }, (_, index) => index + min);
  }

  roomsFor(plan: AtcPlanInput) {
    return atcRoomsFor(plan);
  }

  courseNote(plan: AtcPlanInput): string {
    const course = this.courses.find(item => item.id === plan.course);
    return course ? `${course.timetable}；${course.level}` : '';
  }

  /** Applies a change and keeps the accommodation as long as the course when it was before. */
  private update(plan: AtcPlanInput, change: () => void): void {
    const before = atcCourseSpanWeeks(plan);
    change();
    if (plan.stayWeeks === before) plan.stayWeeks = atcCourseSpanWeeks(plan);
    this.fixRoom(plan);
  }

  private fixRoom(plan: AtcPlanInput): void {
    const rooms = atcRoomsFor(plan);
    const preferred = this.input.age === 'adult' ? 'single' : 'twin';
    if (rooms.length && !rooms.some(room => room.room === plan.room)) {
      plan.room = (rooms.find(room => room.room === preferred) ?? rooms[0]).room;
    }
  }

  /** 16–17-year-olds may only stay in a host family twin room, and must book the arrival transfer. */
  changeAge(age: AtcQuoteInput['age']): void {
    this.input.age = age;
    if (age === 'adult') return;
    for (const plan of this.input.plans) {
      if (plan.stayType === 'none') continue;
      plan.stayType = 'homestay';
      plan.room = 'twin';
      if (plan.transfer === 'none') plan.transfer = 'arrival';
    }
  }

  changeCampus(plan: AtcPlanInput, campus: AtcPlanInput['campus']): void {
    this.update(plan, () => { plan.campus = campus; });
  }

  changeCourse(plan: AtcPlanInput, courseId: AtcCourseId): void {
    this.update(plan, () => {
      const wasCambridge = plan.course === 'cambridge';
      plan.course = courseId;
      const course = this.courses.find(item => item.id === courseId);
      if (courseId === 'cambridge') {
        const session = ATC_CAMBRIDGE_SESSIONS.find(item => item.start >= this.today) ?? ATC_CAMBRIDGE_SESSIONS[0];
        plan.start = session.start;
        plan.weeks = session.weeks;
      } else if (wasCambridge) {
        plan.start = defaultAtcPlan('course', this.today).start;
      }
      if (course && plan.weeks < course.minWeeks) plan.weeks = course.minWeeks;
      if (courseId === 'ge16' && plan.weeks < 12) plan.weeks = 12;
    });
  }

  changeStart(plan: AtcPlanInput, start: string): void {
    this.update(plan, () => {
      plan.start = start;
      const session = plan.course === 'cambridge' ? ATC_CAMBRIDGE_SESSIONS.find(item => item.start === start) : undefined;
      if (session) plan.weeks = session.weeks;
    });
  }

  changeWeeks(plan: AtcPlanInput, weeks: number): void {
    this.update(plan, () => { plan.weeks = weeks; });
  }

  changeStayType(plan: AtcPlanInput, stayType: AtcStayType): void {
    plan.stayType = stayType;
    if (stayType !== 'none' && plan.stayWeeks < 1) plan.stayWeeks = atcCourseSpanWeeks(plan);
    this.fixRoom(plan);
  }

  addPlan(): void {
    if (this.input.plans.length >= 2) return;
    const first = this.input.plans[0];
    const second: AtcPlanInput = { ...first, campus: first.campus === 'dublin' ? 'bray' : 'dublin' };
    this.fixRoom(second);
    this.input.plans = [first, second];
  }

  removePlan(index: number): void {
    this.input.plans = this.input.plans.filter((_, position) => position !== index);
  }

  trackIndex(index: number): number {
    return index;
  }
}
