// 学校价格对比 (/price-compare): two or three schools side by side for the same goal, room size,
// weeks and arrival. Every school is priced by its own calculator (compare-schools.ts) from its
// published revision or, without one, the same defaults its page uses; this component only binds
// the form, loads the revisions and the exchange rate, and hands the sheet to the table and image.
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ExchangeRateService } from '../../../services/exchange-rate.service';
import { connectQuoteRates } from '../../../services/quote-exchange-rates';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import { PlanCompareTableComponent } from '../../components/plan-compare/plan-compare-table.component';
import type { PlanCompareSheet } from '../../components/plan-compare/plan-compare-sheet';
import { buildPhilippinesDetailedQuote } from '../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent } from '../../components/quote-image-download-button.component';
import type { QuoteImageCardData } from '../../components/quote-image-types';
import { createCompareSchools } from './compare-schools';
import { COMPARE_GOALS, COMPARE_ROOM_SIZES, SchoolPriceComparison, type CompareSelection } from './school-compare';

/** Title-card photo of the comparison image. */
const COMPARE_IMAGE_HERO = '/assets/philippines/cebu-city-view.webp';

@Component({
  selector: 'app-school-compare-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, PlanCompareTableComponent, QuoteImageDownloadButtonComponent],
  templateUrl: './school-compare-page.component.html',
  styleUrls: ['./school-compare-page.component.css'],
})
export class SchoolComparePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly schoolService = inject(SchoolService);
  private readonly contentService = inject(SchoolContentService);
  private readonly sources = createCompareSchools();

  usdToCny = Number.NaN;
  phpPerCny = Number.NaN;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;

  readonly goals = COMPARE_GOALS;
  readonly roomSizes = COMPARE_ROOM_SIZES;
  readonly visaOptions = [
    { value: 'tourist59', label: '59天旅游签证' },
    { value: 'tourist30', label: '30天旅游签证' },
  ] as const;

  readonly comparison = new SchoolPriceComparison(
    () => this.sources.map(source => source.school),
    () => ({ usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateDate, live: this.usingLiveExchangeRates }),
  );

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const read = (name: string) => params.get(name) ?? undefined;
    this.comparison.applyLink({
      schools: read('schools'),
      from: read('from'),
      course: read('course'),
      room: read('room'),
      weeks: read('weeks'),
      start: read('start'),
    });
    this.loadPublishedContent();
  }

  get sheet(): PlanCompareSheet { return this.comparison.sheet; }

  get conditionsSummary(): string {
    const conditions = this.comparison.conditions;
    return [
      conditions.ageGroup === 'minor' ? '未满18岁' : '18岁及以上',
      this.visaOptions.find(option => option.value === conditions.visaType)?.label ?? '',
      `报名日${conditions.registrationDate.replace(/-/g, '/')}`,
    ].filter(Boolean).join(' · ');
  }

  get endDateText(): string {
    const end = this.comparison.endDate;
    return end ? `${end.replace(/-/g, '/')}（周六）离校` : '';
  }

  setStartDate(value: string, input: HTMLInputElement): void {
    if (!this.comparison.setStartDate(value)) input.value = this.comparison.conditions.startDate;
  }

  trackSelection(_index: number, selection: CompareSelection): string { return selection.school.id; }

  get compareImageData(): QuoteImageCardData {
    const sheet = this.sheet;
    const { weeks, startDate } = this.comparison.conditions;
    const base = buildPhilippinesDetailedQuote({
      schoolCode: '', schoolName: '各校', filePrefix: '学校对比', heroSrc: COMPARE_IMAGE_HERO,
      weeks, startDate, usdToCny: this.usdToCny, totalUsd: 0, paymentItems: [], localFeeItems: [],
      localFeeTotal: 0, localFeeCny: 0, localFeeNote: '', ruleNotes: [],
    });
    return {
      ...base,
      layout: 'plan-compare',
      planCompare: sheet,
      headingText: sheet.heading,
      fileName: `${sheet.heading}-${weeks}周-${startDate.replace(/-/g, '')}.png`,
    };
  }

  /** A published employee revision overrides the defaults, as on each school page. */
  private loadPublishedContent(): void {
    for (const source of this.sources) {
      this.schoolService.getSchools({ name: source.pricingSchoolName }).pipe(
        switchMap(schools => {
          const school = schools.find(item => item.name === source.pricingSchoolName);
          return school?.id
            ? this.contentService.getPublished<unknown>(school.id).pipe(catchError(() => of(null)))
            : of(null);
        }),
        catchError(() => of(null)),
      ).subscribe(revision => {
        if (!revision?.content) return;
        source.applyPublished(revision.content);
        this.comparison.retainValidSelections();
      });
    }
  }

  private readonly quoteRateSync = connectQuoteRates(this, inject(ExchangeRateService));
}
