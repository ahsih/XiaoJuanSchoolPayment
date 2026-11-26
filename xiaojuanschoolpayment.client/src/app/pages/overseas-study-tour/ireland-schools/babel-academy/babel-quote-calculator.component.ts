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
  BABEL_ACCOMMODATIONS,
  BABEL_DIETS,
  BABEL_EXTRAS,
  BABEL_SHORT_COURSES,
  BABEL_SHORT_MAX_WEEKS,
  BABEL_WORK_STUDY_COURSES,
  BABEL_WORK_STUDY_FEES,
  BABEL_WORK_STUDY_WEEKS,
  babelIsBlackFriday,
} from './babel-pricing';
import {
  BABEL_PROGRAMMES,
  BabelPlanInput,
  BabelProgramme,
  BabelQuoteInput,
  babelHolidayOn,
  babelStartOptions,
  buildBabelSheet,
  defaultBabelPlan,
  defaultBabelQuote,
} from './babel-quote';

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-babel-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UkQuoteSheetComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './babel-quote-calculator.component.html',
  styleUrl: './babel-quote-calculator.component.css',
})
export class BabelQuoteCalculatorComponent {
  readonly today = localToday();
  readonly blackFriday = babelIsBlackFriday(this.today);
  readonly programmes = BABEL_PROGRAMMES;
  readonly shortCourses = BABEL_SHORT_COURSES;
  readonly workStudyCourses = BABEL_WORK_STUDY_COURSES;
  readonly accommodations = BABEL_ACCOMMODATIONS;
  readonly diets = BABEL_DIETS;
  readonly extras = BABEL_EXTRAS;
  readonly workStudyFees = BABEL_WORK_STUDY_FEES;
  readonly consultants = SIDA_CALLABLE_CONSULTANTS;
  readonly shortWeeks = Array.from({ length: BABEL_SHORT_MAX_WEEKS }, (_, index) => index + 1);
  readonly workStudyAccommodationWeeks = Array.from({ length: BABEL_WORK_STUDY_WEEKS }, (_, index) => index + 1);
  readonly transportWeeks = [0, 1, 2, 3, 4];
  readonly startOptions: Record<BabelProgramme, string[]> = {
    short: babelStartOptions('short', this.today),
    'work-study': babelStartOptions('work-study', this.today),
  };
  readonly planTags = ['方案一', '方案二'];

  input: BabelQuoteInput = defaultBabelQuote(this.today, 'short');
  consultantName = this.consultants[0].name;

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

  get sheet(): UkQuoteSheet {
    const contact = this.contact;
    return buildBabelSheet(this.input, this.today, this.quoteDateText, { eurToCny: this.eurToCny, date: this.rateDate },
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

  get quoteImage(): QuoteImageCardData {
    const sheet = this.sheet;
    const contact = this.contact;
    return {
      layout: 'uk-package',
      ukSheet: sheet,
      fileName: sheet.fileName,
      logoSrc: '/assets/sida-qihang-navbar-logo.jpg',
      heroSrc: '/assets/sida-qihang-navbar-logo.jpg',
      schoolCode: 'BABEL',
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

  startLabel(date: string): string {
    const holiday = babelHolidayOn(date);
    return holiday ? `${ukDateText(date)}（${holiday}，周二开课）` : ukDateText(date);
  }

  selectProgramme(programme: BabelProgramme): void {
    if (programme === this.input.programme) return;
    this.input = {
      ...this.input,
      programme,
      plans: this.input.plans.map(() => defaultBabelPlan(programme, this.today)),
    };
  }

  addPlan(): void {
    if (this.input.plans.length >= 2) return;
    const first = this.input.plans[0];
    const second: BabelPlanInput = { ...first };
    second.accommodation = first.accommodation === 'residence' ? 'homestay-single' : 'residence';
    this.input.plans = [first, second];
  }

  removePlan(index: number): void {
    this.input.plans = this.input.plans.filter((_, position) => position !== index);
  }

  changeShortWeeks(plan: BabelPlanInput, weeks: number): void {
    if (plan.accommodationWeeks === plan.weeks) plan.accommodationWeeks = weeks;
    plan.weeks = weeks;
  }

  socialWeekOptions(): number[] {
    const max = this.input.programme === 'work-study' ? BABEL_WORK_STUDY_WEEKS : Math.max(...this.input.plans.map(plan => plan.weeks), 1);
    return Array.from({ length: max + 1 }, (_, index) => index);
  }

  trackIndex(index: number): number {
    return index;
  }
}
