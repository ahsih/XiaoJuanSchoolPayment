import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateService, isUsableExchangeRates } from '../../../../../services/exchange-rate.service';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../../../../components/quote-image-download-button.component';
import { SIDA_CALLABLE_CONSULTANTS } from '../../../../components/sida-consultants';
import { UkQuoteSheetComponent } from '../../../../components/uk-quote/uk-quote-sheet.component';
import { UkQuoteSheet, ukAddDays, ukDateText, ukShortDateText } from '../../../../components/uk-quote/uk-quote-sheet';
import {
  BURLINGTON_ADULT_COURSES,
  BURLINGTON_AIRPORTS,
  BURLINGTON_APARTMENT_ROOMS,
  BURLINGTON_COURSE_FOCUS,
  BURLINGTON_HOMESTAY_BOARDS,
  BURLINGTON_HOMESTAY_TIERS,
  BURLINGTON_JUNIOR_PACKAGES,
  BURLINGTON_JUNIOR_SEASONS,
  BURLINGTON_MAX_COURSE_WEEKS,
  BURLINGTON_ONSITE_ROOMS,
  BURLINGTON_SUMMER_RESIDENCE,
} from './burlington-pricing';
import {
  BURLINGTON_PROGRAMMES,
  BurlingtonPlanInput,
  BurlingtonProgramme,
  BurlingtonQuoteInput,
  buildBurlingtonSheet,
  burlingtonNextSunday,
  defaultBurlingtonPlan,
  defaultBurlingtonQuote,
} from './burlington-quote';

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function sundays(from: string, lastArrival: string): string[] {
  const list: string[] = [];
  for (let date = from; date <= lastArrival; date = ukAddDays(date, 7)) list.push(date);
  return list;
}

@Component({
  selector: 'app-burlington-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UkQuoteSheetComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './burlington-quote-calculator.component.html',
  styleUrl: './burlington-quote-calculator.component.css',
})
export class BurlingtonQuoteCalculatorComponent {
  readonly today = localToday();
  readonly programmes = BURLINGTON_PROGRAMMES;
  readonly seasons = BURLINGTON_JUNIOR_SEASONS;
  readonly juniorPackages = BURLINGTON_JUNIOR_PACKAGES;
  readonly courses = BURLINGTON_ADULT_COURSES;
  readonly focuses = BURLINGTON_COURSE_FOCUS;
  readonly onsiteRooms = BURLINGTON_ONSITE_ROOMS;
  readonly apartmentRooms = BURLINGTON_APARTMENT_ROOMS;
  readonly homestayTiers = BURLINGTON_HOMESTAY_TIERS;
  readonly homestayBoards = BURLINGTON_HOMESTAY_BOARDS;
  readonly airports = BURLINGTON_AIRPORTS;
  readonly consultants = SIDA_CALLABLE_CONSULTANTS;
  readonly juniorAges = [11, 12, 13, 14, 15, 16, 17];
  readonly adultWeeks = Array.from({ length: BURLINGTON_MAX_COURSE_WEEKS }, (_, index) => index + 1);
  readonly adultArrivals = sundays(burlingtonNextSunday(this.today), ukAddDays(burlingtonNextSunday(this.today), 7 * 78));
  readonly residenceArrivals = sundays(BURLINGTON_SUMMER_RESIDENCE.start, ukAddDays(BURLINGTON_SUMMER_RESIDENCE.end, -14));
  readonly residenceWeeks = [2, 3, 4, 5, 6, 7, 8];
  readonly planTags = ['方案一', '方案二'];
  readonly dateText = ukShortDateText;
  readonly fullDateText = ukDateText;

  input: BurlingtonQuoteInput = defaultBurlingtonQuote(this.today, 'junior');
  consultantName = this.consultants[0].name;

  private gbpToCny: number | null = null;
  private rateDate = '';
  private readonly rates = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(snapshot => {
    const rate = snapshot.rates?.['GBP']?.rate;
    const usable = isUsableExchangeRates(snapshot) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
    this.gbpToCny = usable ? 1 / rate : null;
    this.rateDate = usable ? snapshot.date : '';
  });

  get contact() {
    return this.consultants.find(item => item.name === this.consultantName) ?? this.consultants[0];
  }

  get sheet(): UkQuoteSheet {
    const contact = this.contact;
    return buildBurlingtonSheet(this.input, this.quoteDateText, { gbpToCny: this.gbpToCny, date: this.rateDate },
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
      schoolCode: 'BURLINGTON',
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

  selectProgramme(programme: BurlingtonProgramme): void {
    if (programme === this.input.programme) return;
    this.input = {
      ...this.input,
      programme,
      plans: this.input.plans.map(() => defaultBurlingtonPlan(programme, this.today)),
    };
  }

  addPlan(): void {
    if (this.input.plans.length >= 2) return;
    const first = this.input.plans[0];
    const second: BurlingtonPlanInput = { ...first };
    if (this.input.programme === 'junior') second.juniorPackage = first.juniorPackage === 'residence' ? 'homestay' : 'residence';
    if (this.input.programme === 'adult-course') second.accommodation = first.accommodation === 'onsite' ? 'homestay' : 'onsite';
    if (this.input.programme === 'summer-residence') second.intensiveUpgrade = !first.intensiveUpgrade;
    this.input.plans = [first, second];
  }

  removePlan(index: number): void {
    this.input.plans = this.input.plans.filter((_, position) => position !== index);
  }

  seasonOf(plan: BurlingtonPlanInput) {
    return this.seasons.find(season => season.id === plan.juniorSeason) ?? this.seasons[1];
  }

  juniorArrivals(plan: BurlingtonPlanInput): string[] {
    const season = this.seasonOf(plan);
    return sundays(season.start, ukAddDays(season.end, -7));
  }

  juniorWeeks(plan: BurlingtonPlanInput): number[] {
    return Array.from({ length: this.seasonOf(plan).maxWeeks }, (_, index) => index + 1);
  }

  changeSeason(plan: BurlingtonPlanInput): void {
    const season = this.seasonOf(plan);
    plan.arrival = season.start;
    plan.weeks = Math.min(plan.weeks, season.maxWeeks);
  }

  changeAdultWeeks(plan: BurlingtonPlanInput, weeks: number): void {
    if (plan.accommodationWeeks === plan.weeks) plan.accommodationWeeks = weeks;
    plan.weeks = weeks;
  }

  trackIndex(index: number): number {
    return index;
  }
}
