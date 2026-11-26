import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateService, isUsableExchangeRates } from '../../../../../services/exchange-rate.service';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../../../../components/quote-image-download-button.component';
import { UkQuoteSheetComponent } from '../../../../components/uk-quote/uk-quote-sheet.component';
import { UK_QUOTE_PLAN_TAGS, UkQuoteSheet, ukAddDays, ukDateText, ukShortDateText } from '../../../../components/uk-quote/uk-quote-sheet';
import { BURLINGTON_CONSULTANTS } from './burlington-page-content';
import {
  BURLINGTON_ADULT_COURSES,
  BURLINGTON_AIRPORTS,
  BURLINGTON_APARTMENT_ROOMS,
  BURLINGTON_CASTLE,
  BURLINGTON_COURSE_FOCUS,
  BURLINGTON_FEES,
  BURLINGTON_HOMESTAY_BOARDS,
  BURLINGTON_HOMESTAY_TIERS,
  BURLINGTON_JUNIOR,
  BURLINGTON_JUNIOR_PACKAGES,
  BURLINGTON_JUNIOR_SEASONS,
  BURLINGTON_MAX_COURSE_WEEKS,
  BURLINGTON_ONSITE_ROOMS,
  BURLINGTON_SUMMER_RESIDENCE,
} from './burlington-pricing';
import {
  BURLINGTON_MAX_PLANS,
  BURLINGTON_PROGRAMMES,
  BurlingtonExtras,
  BurlingtonPlanInput,
  BurlingtonProgramme,
  BurlingtonQuoteInput,
  buildBurlingtonSheet,
  burlingtonNextSunday,
  defaultBurlingtonPlan,
  defaultBurlingtonQuote,
  nextBurlingtonPlan,
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

type ExtraFlag = Exclude<keyof BurlingtonExtras, 'airport'>;

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
  readonly juniorAges = [11, 12, 13, 14, 15, 16, 17];
  readonly adultWeeks = Array.from({ length: BURLINGTON_MAX_COURSE_WEEKS }, (_, index) => index + 1);
  readonly adultArrivals = sundays(burlingtonNextSunday(this.today), ukAddDays(burlingtonNextSunday(this.today), 7 * 78));
  readonly residenceArrivals = sundays(BURLINGTON_SUMMER_RESIDENCE.start, ukAddDays(BURLINGTON_SUMMER_RESIDENCE.end, -14));
  readonly residenceWeeks = [2, 3, 4, 5, 6, 7, 8];
  readonly maxPlans = BURLINGTON_MAX_PLANS;
  readonly planTags = UK_QUOTE_PLAN_TAGS;
  readonly dateText = ukShortDateText;
  readonly fullDateText = ukDateText;
  /** Plans store the Sunday; without accommodation the form shows the Monday the course starts. */
  readonly addDays = ukAddDays;
  readonly fees = BURLINGTON_FEES;
  readonly junior = BURLINGTON_JUNIOR;
  readonly castle = BURLINGTON_CASTLE;

  input: BurlingtonQuoteInput = defaultBurlingtonQuote(this.today, 'adult-course');

  private gbpToCny: number | null = null;
  private rateDate = '';
  private readonly rates = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(snapshot => {
    const rate = snapshot.rates?.['GBP']?.rate;
    const usable = isUsableExchangeRates(snapshot) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
    this.gbpToCny = usable ? 1 / rate : null;
    this.rateDate = usable ? snapshot.date : '';
  });

  get sheet(): UkQuoteSheet {
    return buildBurlingtonSheet(this.input, this.quoteDateText, { gbpToCny: this.gbpToCny, date: this.rateDate },
      BURLINGTON_CONSULTANTS.map(item => ({ name: item.name, title: item.title, phone: item.phone, qrSrc: item.qrSrc })));
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
    const first = BURLINGTON_CONSULTANTS[0];
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
      totalLabel: sheet.totalLabel,
      totalUsd: '',
      totalCny: '',
      localFeeAmount: '',
      localFeeDescription: '',
      localFeeNote: '',
      note: '',
      contact: { name: first.name, phone: first.phone, avatarSrc: first.avatarSrc, qrSrc: first.qrSrc },
    };
  }

  /** Optional services that apply to at least one current plan, shown as tick boxes. */
  get extraOptions(): Array<{ key: ExtraFlag; label: string; price: string }> {
    const { programme, plans } = this.input;
    const options: Array<{ key: ExtraFlag; label: string; price: string }> = [];
    if (programme === 'junior') {
      options.push({ key: 'travelCard', label: '伦敦交通卡（1–3区）', price: `${this.junior.travelCardPerWeek}英镑/周` });
      if (plans.some(plan => plan.juniorPackage === 'homestay')) {
        options.push({ key: 'chaperone', label: '寄宿家庭往返学校陪同', price: `${this.junior.chaperonePerWeek}英镑/周` });
      }
      if (plans.some(plan => plan.juniorPackage === 'day')) {
        options.push({ key: 'saturdayTrip', label: '周六全天出游', price: `${this.junior.daySaturdayTrip}英镑/周` });
      }
      const castlePrices = [...new Set(plans.map(plan => this.seasonOf(plan).castleUpgrade))];
      options.push({ key: 'castle', label: '巴斯城堡两晚', price: `${castlePrices.join(' / ')}英镑` });
    } else {
      const freeCastle = (plan: BurlingtonPlanInput) => plan.weeks >= this.castle.adultFreeFromWeeks
        && (programme === 'summer-residence' || plan.course !== 'one-to-one');
      const castlePrices = [...new Set(plans.map(plan => freeCastle(plan) ? this.castle.adultPremiumUpgrade : this.castle.adultShortStay))];
      options.push({
        key: 'castle',
        label: plans.every(freeCastle) ? '巴斯城堡升级高级版' : plans.some(freeCastle) ? '巴斯城堡（满4周升级高级版／不满4周两晚＋高级版）' : '巴斯城堡两晚＋高级版',
        price: `${castlePrices.join(' / ')}英镑`,
      });
      if (plans.some(plan => plan.courseFocus !== 'general')) {
        options.push({ key: 'exam', label: '雅思／剑桥考试报名费', price: `${this.fees.examFee}英镑` });
      }
    }
    options.push({ key: 'bankCharge', label: '国际汇款手续费', price: `${this.fees.bankCharge}英镑` });
    return options;
  }

  get transferPrice(): number {
    return (this.airports.find(item => item.id === this.input.extras.airport) ?? this.airports[0]).price;
  }

  get transferChosen(): boolean {
    return this.input.extras.arrivalTransfer || this.input.extras.departureTransfer;
  }

  get unaccompanied(): boolean {
    return this.input.programme === 'junior' && this.input.juniorAge < this.junior.unaccompaniedMinorAge;
  }

  selectProgramme(programme: BurlingtonProgramme): void {
    if (programme === this.input.programme) return;
    // Keep the number of compared plans; the extra plans differ from the first one again.
    let next: BurlingtonQuoteInput = { ...this.input, programme, plans: [defaultBurlingtonPlan(programme, this.today)] };
    while (next.plans.length < this.input.plans.length) next = { ...next, plans: [...next.plans, nextBurlingtonPlan(next)] };
    this.input = next;
  }

  addPlan(): void {
    if (this.input.plans.length >= this.maxPlans) return;
    this.input.plans = [...this.input.plans, nextBurlingtonPlan(this.input)];
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

  /** The option list is rebuilt on every check; keep each checkbox (and its ngModel) alive by key. */
  trackExtra(_index: number, option: { key: ExtraFlag }): string {
    return option.key;
  }
}
