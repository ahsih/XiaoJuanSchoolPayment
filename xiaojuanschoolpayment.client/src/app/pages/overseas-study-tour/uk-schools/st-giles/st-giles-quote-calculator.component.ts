import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ExchangeRateService, isUsableExchangeRates } from '../../../../../services/exchange-rate.service';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from '../../../../components/quote-image-download-button.component';
import { UkQuoteSheetComponent } from '../../../../components/uk-quote-v2/uk-quote-sheet.component';
import { UK_QUOTE_PLAN_TAGS, UkQuoteSheet, ukAddDays, ukDateText, ukShortDateText } from '../../../../components/uk-quote-v2/uk-quote-sheet';
import { ST_GILES_CONSULTANTS } from './st-giles-page-content';
import {
  ST_GILES_CAMPUSES,
  ST_GILES_FAMILY_COMMON,
  ST_GILES_FEES,
  ST_GILES_JUNIOR,
  StGilesAirport,
  StGilesAgeBand,
  StGilesCampusId,
  StGilesCampusPricing,
  StGilesHomestayBoard,
  StGilesHomestayTier,
  StGilesJuniorCentre,
} from './st-giles-pricing';
import {
  ST_GILES_AGE_BANDS,
  ST_GILES_HOMESTAY_BOARDS,
  ST_GILES_LAST_ARRIVAL,
  ST_GILES_MAX_PLANS,
  StGilesPlanInput,
  StGilesProgramme,
  StGilesQuoteInput,
  buildStGilesSheet,
  defaultStGilesPlan,
  defaultStGilesQuote,
  juniorCentresFor,
  nextStGilesPlan,
  stGilesCoursesFor,
  stGilesJuniorCentre,
  stGilesNextSunday,
  stGilesProgrammes,
  stGilesResidencesFor,
} from './st-giles-quote';

function localToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function sundays(from: string, lastArrival: string): string[] {
  const list: string[] = [];
  for (let date = from; date <= lastArrival; date = ukAddDays(date, 7)) list.push(date);
  return list;
}

const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);
const weeksIn = (start: string, end: string) => Math.round((Date.parse(end) - Date.parse(start)) / (7 * 86400000));

type ExtraFlag = 'specialDiet' | 'breakfast';

@Component({
  selector: 'app-st-giles-quote-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, UkQuoteSheetComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './st-giles-quote-calculator.component.html',
  styleUrl: './st-giles-quote-calculator.component.css',
})
export class StGilesQuoteCalculatorComponent {
  readonly today = localToday();
  readonly maxPlans = ST_GILES_MAX_PLANS;
  readonly planTags = UK_QUOTE_PLAN_TAGS;
  readonly dateText = ukShortDateText;
  readonly fullDateText = ukDateText;
  /** Plans store the arrival Sunday; plans without accommodation show the Monday the course starts. */
  readonly addDays = ukAddDays;
  readonly boards = ST_GILES_HOMESTAY_BOARDS;
  readonly junior = ST_GILES_JUNIOR;
  readonly familyCommon = ST_GILES_FAMILY_COMMON;
  readonly stayWeeks = range(1, ST_GILES_FEES.maxCourseWeeks);
  readonly adultArrivals = sundays(stGilesNextSunday(this.today), ST_GILES_LAST_ARRIVAL);
  readonly childCounts = [1, 2, 3];
  readonly adultCounts = [1, 2];

  campusId: StGilesCampusId | null = null;
  input: StGilesQuoteInput = defaultStGilesQuote(null, this.today);

  /** The year-round campus, or null on the St Giles overview page (junior summer centres only). */
  @Input() set campus(value: StGilesCampusId | null) {
    this.campusId = value;
    this.input = defaultStGilesQuote(value, this.today);
  }

  private gbpToCny: number | null = null;
  private rateDate = '';
  private readonly rates = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(snapshot => {
    const rate = snapshot.rates?.['GBP']?.rate;
    const usable = isUsableExchangeRates(snapshot) && typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
    this.gbpToCny = usable ? 1 / rate : null;
    this.rateDate = usable ? snapshot.date : '';
  });

  get pricing(): StGilesCampusPricing {
    return ST_GILES_CAMPUSES[this.campusId ?? 'london-central'];
  }

  get programmes() {
    return stGilesProgrammes(this.campusId);
  }

  get centres(): StGilesJuniorCentre[] {
    return juniorCentresFor(this.campusId);
  }

  get ageBands() {
    return ST_GILES_AGE_BANDS.filter(band => band.min >= this.pricing.minAge);
  }

  get juniorAges(): number[] {
    const centres = this.centres;
    return range(Math.min(...centres.map(item => item.minAge)), Math.max(...centres.map(item => item.maxAge)));
  }

  get courses() {
    return stGilesCoursesFor(this.pricing, this.input.ageBand);
  }

  get residences() {
    return stGilesResidencesFor(this.pricing, this.input.ageBand);
  }

  get sheet(): UkQuoteSheet {
    return buildStGilesSheet(this.input, this.quoteDateText, { gbpToCny: this.gbpToCny, date: this.rateDate },
      ST_GILES_CONSULTANTS.map(item => ({ name: item.name, title: item.title, phone: item.phone, qrSrc: item.qrSrc })));
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
    const first = ST_GILES_CONSULTANTS[0];
    return {
      layout: 'uk-package',
      ukSheetV2: sheet,
      fileName: sheet.fileName,
      logoSrc: '/assets/sida-qihang-navbar-logo.jpg',
      heroSrc: '/assets/sida-qihang-navbar-logo.jpg',
      schoolCode: 'ST-GILES',
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

  /** Airports the transfer applies to; junior centres differ, so their lists are merged by airport. */
  get airports(): StGilesAirport[] {
    if (this.input.programme === 'adult') return this.pricing.transfers;
    if (this.input.programme === 'family') return this.pricing.family.transfers;
    const lists = this.input.plans.map(plan => stGilesJuniorCentre(plan.juniorCentre).transfers);
    const merged: StGilesAirport[] = [];
    lists.flat().forEach(item => { if (!merged.some(other => other.id === item.id)) merged.push(item); });
    return merged;
  }

  /** One price per airport when every plan has the same centre. */
  get airportPriceShown(): boolean {
    return this.input.programme !== 'junior' || new Set(this.input.plans.map(plan => plan.juniorCentre)).size === 1;
  }

  get transferChosen(): boolean {
    return this.input.extras.arrivalTransfer || this.input.extras.departureTransfer;
  }

  get transferUnit(): string {
    if (this.input.programme === 'junior') return '单程每人';
    if (this.input.programme === 'family') return '单程每个家庭';
    return this.pricing.transferPerPassenger ? '单程每人' : '单程每车';
  }

  get unaccompanied(): boolean {
    return this.input.programme === 'junior' && this.input.juniorAge < this.junior.unaccompaniedMinorAge;
  }

  get extraOptions(): Array<{ key: ExtraFlag; label: string; price: string }> {
    const { programme, plans } = this.input;
    const options: Array<{ key: ExtraFlag; label: string; price: string }> = [];
    if (programme === 'adult' && plans.some(plan => plan.accommodation === 'homestay')) {
      options.push({ key: 'specialDiet', label: '寄宿家庭特殊饮食', price: `${ST_GILES_FEES.specialDiet}英镑/周` });
    }
    if (programme === 'adult') {
      const breakfast = plans.map(plan => this.pricing.residences.find(item => plan.accommodation === 'residence' && item.id === plan.residence))
        .find(item => item?.breakfastPerWeek)?.breakfastPerWeek;
      if (breakfast) options.push({ key: 'breakfast', label: '学校咖啡厅早餐', price: `${breakfast}英镑/周` });
    }
    if (programme === 'family') {
      options.push({ key: 'specialDiet', label: '特殊饮食', price: `${ST_GILES_FAMILY_COMMON.specialDiet}英镑/人/周` });
    }
    return options;
  }

  selectProgramme(programme: StGilesProgramme): void {
    if (programme === this.input.programme) return;
    // Keep the number of compared plans; the extra plans differ from the first one again.
    let next: StGilesQuoteInput = { ...this.input, programme, plans: [defaultStGilesPlan(this.campusId, programme, this.today)] };
    while (next.plans.length < this.input.plans.length) next = { ...next, plans: [...next.plans, nextStGilesPlan(next)] };
    this.input = next;
    this.syncAirport();
  }

  addPlan(): void {
    if (this.input.plans.length >= this.maxPlans) return;
    this.input.plans = [...this.input.plans, nextStGilesPlan(this.input)];
    this.syncAirport();
  }

  removePlan(index: number): void {
    this.input.plans = this.input.plans.filter((_, position) => position !== index);
    this.syncAirport();
  }

  // Adult plans -------------------------------------------------------------------------------

  /** A new age band may rule out the chosen course or residence; move to the first allowed one. */
  changeAgeBand(band: StGilesAgeBand): void {
    this.input.ageBand = band;
    const courses = this.courses.map(item => item.id);
    const residences = this.residences.filter(item => !item.window).map(item => item.id);
    this.input.plans.forEach(plan => {
      if (!courses.includes(plan.course)) plan.course = courses[0];
      if (plan.accommodation === 'residence' && !this.residences.some(item => item.id === plan.residence)) {
        plan.accommodation = residences.length ? 'residence' : 'homestay';
        plan.residence = residences[0] ?? '';
      }
      this.fixHomestay(plan);
    });
  }

  groupCourse(plan: StGilesPlanInput) {
    return this.pricing.courses.find(course => course.id === plan.course);
  }

  courseWeeks(plan: StGilesPlanInput): number[] {
    return range(1, this.groupCourse(plan)?.maxWeeks ?? ST_GILES_FEES.maxCourseWeeks);
  }

  changeCourse(plan: StGilesPlanInput): void {
    const group = this.groupCourse(plan);
    if (!group) plan.addOneToOne = false;
    if (group?.maxWeeks && plan.weeks > group.maxWeeks) this.changeAdultWeeks(plan, group.maxWeeks);
  }

  changeAdultWeeks(plan: StGilesPlanInput, weeks: number): void {
    if (plan.accommodationWeeks === plan.weeks) plan.accommodationWeeks = weeks;
    plan.weeks = weeks;
  }

  changeAccommodation(plan: StGilesPlanInput): void {
    if (plan.accommodation === 'residence' && !this.residences.some(item => item.id === plan.residence)) {
      plan.residence = (this.residences.find(item => !item.window) ?? this.residences[0])?.id ?? '';
    }
    if (plan.accommodation === 'homestay') this.fixHomestay(plan);
  }

  residenceLabel(id: string): string {
    const item = this.pricing.residences.find(residence => residence.id === id);
    if (!item) return '';
    const price = item.offPeak ?? item.peak;
    return `${item.name}·${item.room}${price !== null ? ` · ${price}英镑/周起` : ''}`;
  }

  homestayTiers(): Array<{ id: StGilesHomestayTier; name: string }> {
    const minor = this.input.ageBand !== 'adult';
    const tiers = [...new Set(this.pricing.homestay.filter(item => (item.age === 'minor') === minor).map(item => item.tier))];
    return tiers.map(id => ({ id, name: id === 'superior' ? '精选寄宿家庭（独立卫浴）' : '标准寄宿家庭（共用卫浴）' }));
  }

  homestayBoards(plan: StGilesPlanInput) {
    const minor = this.input.ageBand !== 'adult';
    const boards = this.pricing.homestay.filter(item => item.tier === plan.homestayTier && (item.age === 'minor') === minor)
      .map(item => item.board);
    return this.boards.filter(board => boards.includes(board.id));
  }

  homestayTwin(plan: StGilesPlanInput): boolean {
    const minor = this.input.ageBand !== 'adult';
    return this.pricing.homestay.some(item => item.tier === plan.homestayTier && item.board === plan.homestayBoard
      && (item.age === 'minor') === minor && item.twin !== null);
  }

  fixHomestay(plan: StGilesPlanInput): void {
    const tiers = this.homestayTiers();
    if (!tiers.some(tier => tier.id === plan.homestayTier)) plan.homestayTier = tiers[0]?.id ?? 'standard';
    const boards = this.homestayBoards(plan);
    if (!boards.some(board => board.id === plan.homestayBoard)) plan.homestayBoard = (boards[0]?.id ?? 'hb') as StGilesHomestayBoard;
    if (!this.homestayTwin(plan)) plan.homestayRoom = 'single';
  }

  // Junior and family plans -----------------------------------------------------------------

  centreOf(plan: StGilesPlanInput): StGilesJuniorCentre {
    return stGilesJuniorCentre(plan.juniorCentre);
  }

  juniorWeeks(plan: StGilesPlanInput): number[] {
    const centre = this.centreOf(plan);
    return centre.fixedWeeks ? [centre.fixedWeeks] : range(1, weeksIn(centre.start, centre.end));
  }

  juniorArrivals(plan: StGilesPlanInput): string[] {
    const centre = this.centreOf(plan);
    return sundays(centre.start, ukAddDays(centre.end, -7 * plan.weeks));
  }

  changeCentre(plan: StGilesPlanInput): void {
    const centre = this.centreOf(plan);
    plan.weeks = centre.fixedWeeks ?? Math.min(plan.weeks, weeksIn(centre.start, centre.end));
    plan.juniorSport = '';
    this.clampArrival(plan, centre.start, centre.end);
    if (!this.juniorAges.includes(this.input.juniorAge)) this.input.juniorAge = this.juniorAges[0];
    this.syncAirport();
  }

  changeJuniorWeeks(plan: StGilesPlanInput, weeks: number): void {
    plan.weeks = weeks;
    const centre = this.centreOf(plan);
    this.clampArrival(plan, centre.start, centre.end);
  }

  get familyWeeks(): number[] {
    const family = this.pricing.family;
    return range(1, weeksIn(family.start, family.end));
  }

  familyArrivals(plan: StGilesPlanInput): string[] {
    const family = this.pricing.family;
    return sundays(family.start, ukAddDays(family.end, -7 * plan.weeks));
  }

  changeFamilyWeeks(plan: StGilesPlanInput, weeks: number): void {
    plan.weeks = weeks;
    this.clampArrival(plan, this.pricing.family.start, this.pricing.family.end);
  }

  private clampArrival(plan: StGilesPlanInput, start: string, end: string): void {
    const latest = ukAddDays(end, -7 * plan.weeks);
    if (plan.arrival < start) plan.arrival = start;
    if (plan.arrival > latest) plan.arrival = latest < start ? start : latest;
  }

  private syncAirport(): void {
    const airports = this.airports;
    if (airports.length && !airports.some(item => item.id === this.input.extras.airport)) this.input.extras.airport = airports[0].id;
  }

  trackIndex(index: number): number {
    return index;
  }

  /** The option list is rebuilt on every check; keep each checkbox (and its ngModel) alive by key. */
  trackExtra(_index: number, option: { key: ExtraFlag }): string {
    return option.key;
  }
}
