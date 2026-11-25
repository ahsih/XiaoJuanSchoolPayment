// The shared Philippine school page. Every school page uses this layout and design (user decision
// 2026-11-20); a school subclass only supplies its profile (text and data), its quote and its
// database price merge. A design change here changes every school page at once, so ask the user
// first whether a change is for one school or for all of them. A school with extra content of its
// own gets an optional, data-driven section here that stays hidden for the other schools.
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { connectQuoteRates, quoteCurrencyText } from '../../../../services/quote-exchange-rates';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolDTO } from '../../../../interfaces/school.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolService } from '../../../../services/school.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { PlanCompareTableComponent } from '../../../components/plan-compare/plan-compare-table.component';
import type { PlanCompareSheet } from '../../../components/plan-compare/plan-compare-sheet';
import type { QuoteImageCardData } from '../../../components/quote-image-types';
import type { CtaConsultant } from '../cia-school/cia-page-content';
import { consultantsInTodaysOrder, quoteContactCard } from '../../../components/sida-consultants';
import {
  CiaContentConfig,
  CiaExtraNightRate,
  CiaLocalFeeRule,
  CiaPeakSeasonRange,
  CiaPromotionRule,
  CiaQuoteImageSettings,
  CiaStayPolicyCard,
} from '../cia-school/cia-content-config';
import {
  CiaPreviewTarget,
  isCiaPreviewTarget,
  resolveCiaPreviewTarget,
  revealCiaPreviewElement,
  scrollCiaPreviewElement,
} from '../cia-school/cia-content-preview';
import { applyCiaQuoteContent } from '../cia-school/cia-quote-engine';
import { associationPeakRateForWeek } from '../association-peak-surcharge';
import type {
  CiaVideoCard,
  CourseDetailGuide,
  CourseFee,
  GalleryCategory,
  GalleryImage,
  LocalFeeEstimate,
  RoomFee,
  RoomRateGroup,
  RoomRateOption,
} from '../cia-school/cia-page-content';
import type { PhCompareFocus, PhPlanComparison } from './ph-plan-compare';
import type { PhSchoolQuote } from './ph-school-quote';
import type {
  PhAlbumCategory,
  PhOfferCard,
  PhPageStudent,
  PhRoomProfile,
  PhSchoolProfile,
  PhVideoItem,
  PhVideoTab,
} from './ph-school-profile';

/**
 * Schools whose vertical videos still fill (crop) the frame. Every other school shows them whole over a blurred
 * poster (user decision 2026-11-24); CIA stays as it was because its page is locked (user answer the same day).
 */
const TALL_VIDEO_CROPPED_SCHOOLS: ReadonlySet<string> = new Set(['CIA']);

/** Imports of every school page component that renders ph-school-page.component.html. */
export const PH_SCHOOL_PAGE_IMPORTS = [
  SchoolQuotePlanComponent,
  CommonModule,
  FormsModule,
  RouterModule,
  MatIconModule,
  ExpandableImageComponent,
  QuoteImageDownloadButtonComponent,
  PlanCompareTableComponent,
];

interface CourseGroupView {
  icon: string;
  title: string;
  text: string;
  courses: CourseFee[];
}

/** One colour-coded block of the course list per study mode (EV: 半斯巴达 / 斯巴达). */
interface CourseModeZone {
  title: string;
  hint: string;
  strict: boolean;
  count: number;
  /** Every course group, so both zones list the goals in the same order; missingNote fills an empty one. */
  groups: Array<CourseGroupView & { missingNote: string }>;
}

/** Compact layout: one entry of the hero album (the videos by topic, then the photos by area). */
interface HeroAlbumItem {
  kind: 'video' | 'photo';
  category: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  duration?: string;
  shape?: PhVideoItem['shape'];
}

/** Compact layout: one month of the calendar table. */
interface CalendarMonthRow {
  month: number;
  holidays: ReadonlyArray<{ day: string; name: string; provisional?: boolean }>;
  exams: readonly number[];
  peak: boolean;
}

/**
 * School subclasses keep the selector `app-cia-school`: the global styles (src/styles.css and
 * assets/cia/cia-page-extended.css) target that element, so every school shares them.
 */
/** The daily consultant rotation lives with the consultant list; re-exported for the EV page test. */
export { rotateForDay } from '../../../components/sida-consultants';

@Directive()
export abstract class PhSchoolPageComponent<S extends PhPageStudent = PhPageStudent>
  implements OnInit, AfterViewInit, OnDestroy
{
  /** The school's text and data; read once, before every other field (a subclass method is ready then). */
  protected abstract getProfile(): PhSchoolProfile;
  protected abstract createQuote(): PhSchoolQuote<S>;
  protected abstract createComparison(): PhPlanComparison<S>;
  /** Merges the database's 4-week prices and fees into the page's defaults. */
  protected abstract applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void;

  protected readonly profile: PhSchoolProfile = this.getProfile();
  private readonly previewHost: ElementRef<HTMLElement> = inject(ElementRef);
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private previewContent?: CiaContentConfig;
  protected readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly defaultContentConfig = this.profile.defaultContent();
  quoteImageSettings: CiaQuoteImageSettings = this.defaultContentConfig.quoteImageSettings;

  get isEditorPreview(): boolean {
    return typeof window !== 'undefined' && window.parent !== window
      && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  }

  /** Page text; a missing optional block hides its section. */
  readonly copy = this.profile.copy;
  get schoolName(): string { return this.profile.name; }
  private readonly uploadedPhotoCategoryIndexes: Record<string, number> = {
    campus: 1,
    classroom: 2,
    accommodation: 3,
    dining: 4,
    facility: 5,
  };

  readonly galleryCategories: GalleryCategory[] = this.profile.gallery.categories;
  readonly galleryAlbumCategories: PhAlbumCategory[] = this.profile.gallery.albumCategories;
  selectedGalleryCategory: GalleryCategory = '全部';
  selectedGalleryImageIndex = 0;
  selectedHeroImageIndex = 0;
  usingUploadedGallery = false;
  uploadedVideoCards: CiaVideoCard[] = [];

  registrationFee = this.defaultContentConfig.quoteSettings.registrationFee;
  futurePriceRegistrationStart = this.defaultContentConfig.quoteSettings.futurePriceRegistrationStart;
  futurePriceArrivalStart = this.defaultContentConfig.quoteSettings.futurePriceArrivalStart;
  shortTermPriceRatios: Record<string, number> = {
    ...this.defaultContentConfig.quoteSettings.shortStayRatios,
  };
  seasonalFeePerWeek = this.defaultContentConfig.quoteSettings.peakSeasonFeePerWeek;
  peakSeasonRanges = this.profile.cloneContent(this.defaultContentConfig).quoteSettings.peakSeasonRanges;
  promotions: CiaPromotionRule[] = this.profile.cloneContent(this.defaultContentConfig).quoteSettings.promotions;
  localFeeRules: CiaLocalFeeRule[] = this.profile.cloneContent(this.defaultContentConfig).localFees;
  localFeeIntro = this.defaultContentConfig.quoteSettings.localFeeIntro;
  courseTableTitle = this.defaultContentConfig.quoteSettings.courseTableTitle;
  courseTableNote = this.defaultContentConfig.quoteSettings.courseTableNote;
  groupClassNote = this.defaultContentConfig.quoteSettings.groupClassNote;
  roomTableTitle = this.defaultContentConfig.quoteSettings.roomTableTitle;
  roomTableNote = this.defaultContentConfig.quoteSettings.roomTableNote;
  stayPolicyTitle = this.defaultContentConfig.quoteSettings.stayPolicyTitle;
  stayPolicies: CiaStayPolicyCard[] = this.profile.cloneContent(this.defaultContentConfig).quoteSettings.stayPolicies;
  extraNightRates: CiaExtraNightRate[] = this.profile.cloneContent(this.defaultContentConfig).quoteSettings.extraNightRates;
  usdToCny = Number.NaN;
  phpPerCny = Number.NaN;
  exchangeRateDate = '';
  usingLiveExchangeRates = false;
  readonly weekOptions = [1, 2, 3, 4, 6, 8, 12, 16, 20, 24];

  /** The calculator itself is a pure module per school, shared with the WeChat mini program. */
  readonly quote: PhSchoolQuote<S> = this.createQuote();
  get students() { return this.quote.students; }
  get quoteMode() { return this.quote.quoteMode; }
  set quoteMode(value: 'single' | 'group') { this.quote.quoteMode = value; }
  get studentCount() { return this.quote.studentCount; }
  set studentCount(value: number) { this.quote.studentCount = value; }
  setQuoteMode(value: 'single' | 'group') { this.quote.setQuoteMode(value); }
  /** A school may react to a course or room choice (CELLA's family packages); others ignore it. */
  planOptionChanged(student: S): void { student.planOptionChanged?.(); }
  get activeStudents() { return this.quote.activeStudents; }
  get quotePlan() { return this.quote.quotePlan; }
  get quoteHeading() { return this.quote.quoteHeading; }
  get quoteError() { return this.quote.quoteError; }
  get registrationNote() { return this.quote.registrationNote; }
  get schoolPaymentItems() { return this.quote.schoolPaymentItems; }
  get optionalFeeItems() { return this.quote.optionalFeeItems; }
  get selectedCourseId() { return this.quotePlan.courses[0].optionId; }
  set selectedCourseId(value: string) { this.quotePlan.courses[0].optionId = value; }
  get selectedRoomId() { return this.quotePlan.rooms[0].optionId; }
  set selectedRoomId(value: string) { this.quotePlan.rooms[0].optionId = value; }
  get selectedWeeks() { return this.quotePlan.courseWeeks; }
  set selectedWeeks(value: number) { this.quotePlan.updateWeeks('course', this.quotePlan.courses[0].id, value); }
  get selectedStartDate() { return this.quotePlan.startDate; }
  set selectedStartDate(value: string) { this.quotePlan.updateStartDate('course', this.quotePlan.courses[0].id, value); }
  selectedRoomProfileId = this.profile.roomProfiles[0]?.id ?? '';
  selectedRoomPhotoIndex = 0;
  private photoSwipeOrigin: { x: number; y: number; arrowStep: number } | null = null;
  quoteCalculated = false;

  /** Same-student plan comparison; it reuses the normal quote's prices and the first student's conditions. */
  readonly comparison: PhPlanComparison<S> = this.createComparison();
  readonly compareTags = ['方案A', '方案B', '方案C'];
  private compareView = false;
  get quoteView(): 'single' | 'compare' | 'group' { return this.compareView ? 'compare' : this.quoteMode; }
  setQuoteView(view: 'single' | 'compare' | 'group'): void {
    this.compareView = view === 'compare';
    if (view === 'compare') {
      this.setQuoteMode('single');
      if (!this.comparison.started) this.comparison.start();
      return;
    }
    this.setQuoteMode(view);
  }
  applyCompareFocus(focus: string): void {
    this.comparison.applyFocus(focus as PhCompareFocus);
  }
  get compareSheet(): PlanCompareSheet { return this.comparison.sheet; }
  get compareImageData(): QuoteImageCardData {
    const sheet = this.compareSheet;
    const start = this.comparison.plans[0] ? this.comparison.startDate(this.comparison.plans[0]) : '';
    return {
      ...this.quoteImageData,
      layout: 'plan-compare',
      planCompare: sheet,
      headingText: sheet.heading,
      fileName: `${this.profile.name}方案对比报价-${start.replace(/-/g, '')}.png`,
    };
  }
  /** Query for /price-compare with the shown plan (single quote: student 1; 方案对比: plan A); null hides the link. */
  get schoolCompareQuery(): Record<string, string> | null {
    const id = this.profile.schoolCompareId;
    if (!id) return null;
    const plan = (this.quoteView === 'compare' ? this.comparison.plans[0] : this.students[0])?.quotePlan;
    const course = plan?.courses[0];
    const room = plan?.rooms[0];
    return {
      from: id,
      ...(course ? { course: course.optionId, weeks: String(plan.courseWeeks), start: course.startDate } : {}),
      ...(room ? { room: room.optionId } : {}),
    };
  }
  setComparePlanDate(plan: S, value: string, input: HTMLInputElement): void {
    if (!this.comparison.setStartDate(plan, value)) input.value = this.comparison.startDate(plan);
  }
  /** One line under “更多条件” so students see the assumptions without opening it. */
  conditionsSummary(student: S): string {
    return [
      student.visaLabel,
      student.selectedAgeGroup === 'minor' ? '未满18岁' : '18岁及以上',
      student.returningStudent ? '老学员' : '新学员',
      student.selectedRegistrationDate ? `报名日${student.selectedRegistrationDate.replace(/-/g, '/')}` : '',
    ].filter(Boolean).join(' · ');
  }

  galleryImages: GalleryImage[] = [...this.profile.gallery.images];
  readonly basicInfo = this.profile.basicInfo;
  readonly suitableFor = this.profile.suitableFor;
  readonly notSuitableFor = this.profile.notSuitableFor;
  readonly campusBuildings = this.profile.campusBuildings;
  readonly scheduleColumns = this.profile.scheduleColumns;
  /** Compact layout on phones: the timetable shows one day column at a time. */
  scheduleDayIndex = 0;
  readonly studyModes = this.profile.studyModes;
  readonly holidayCalendars = this.profile.holidayCalendars;
  private readonly offerCards = this.profile.offers ?? [];
  /** Offers above the quote that have not ended and whose promotion rules the applied content still enables. */
  get visibleOffers(): readonly PhOfferCard[] {
    if (!this.offerCards.length) return this.offerCards;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return this.offerCards.filter(card => (!card.until || today < card.until)
      && (!card.promotionIds?.length || card.promotionIds.some(id => this.promotions.some(rule => rule.id === id && rule.enabled))));
  }
  readonly ieltsComputerExamDates2027 = this.profile.ieltsComputerExamDates2027;
  readonly courseDetailGuides = this.profile.courseDetailGuides;
  courseFees: CourseFee[] = this.profile.initialCourseFees.map(course => ({ ...course }));
  roomFees: RoomFee[] = this.profile.initialRoomFees.map(room => ({ ...room }));
  readonly faqs = this.profile.faqs();
  readonly show2026Prices = this.profile.shows2026Prices();
  readonly mobileAnchors = this.profile.mobileAnchors;
  readonly snapshotCards = this.profile.snapshotCards;
  readonly videoCards = this.profile.videoCards;
  readonly campusLifeVideos = this.profile.campusLifeVideos;
  readonly interviewVideos = this.profile.interviewVideos;
  readonly dormRules = this.profile.dormRules;
  readonly ieltsResults = this.profile.ieltsResults;
  readonly ieltsResultImages = this.profile.ieltsResults.map(item => item.image);
  readonly ieltsResultTitles = this.profile.ieltsResults.map(item =>
    item.title + ' · ' + (item.summary ?? '入学 ' + item.entrance + ' → 官方雅思 ' + item.overall));
  readonly showRoomCodes = this.profile.showRoomCodes;
  readonly reviewPath = this.profile.reviewPath;

  // ---- Compact layout (profile.compactLayout; the fixed layout for every school, CIA, EV, CPI and CPILS so far) ----
  readonly compactLayout = !!this.profile.compactLayout;
  /** Vertical videos shown whole over a blurred poster (profile.tallVideoBackdrop, on unless the school is cropped). */
  readonly tallVideoBackdrop = this.profile.tallVideoBackdrop ?? !TALL_VIDEO_CROPPED_SCHOOLS.has(this.profile.code);
  readonly overviewFacts = this.profile.overviewFacts ?? [];
  readonly overviewReferenceNote = this.profile.overviewReferenceNote ?? false;
  readonly courseHighlights = this.profile.courseHighlights ?? {};
  readonly roomVideos = this.profile.roomVideos ?? {};
  /**
   * The open room's own video (same file as in the hero album), if the school has one of exactly that room type.
   * It is the first item of the room's photo album; the arrows, a swipe or a thumbnail move on to the photos.
   */
  get selectedRoomVideo(): PhVideoItem | undefined {
    return this.compactLayout ? this.roomVideos[this.selectedRoomProfile?.id ?? ''] : undefined;
  }
  /** False once a photo of the room is open; a newly chosen room starts on its video again. */
  private roomVideoOpen = true;
  get roomVideoActive(): boolean {
    return this.roomVideoOpen && !!this.selectedRoomVideo;
  }
  /** Album length and 1-based position, counting the room's video as the first item. */
  get roomAlbumLength(): number {
    return this.selectedRoomPhotos.length + (this.selectedRoomVideo ? 1 : 0);
  }
  get roomAlbumPosition(): number {
    if (!this.selectedRoomVideo) return this.selectedRoomPhotoIndex + 1;
    return this.roomVideoActive ? 1 : this.selectedRoomPhotoIndex + 2;
  }
  showRoomVideo(): void {
    this.roomVideoOpen = true;
  }

  /** Hero album: every video by topic (the campus tour first), then every photo by album category. */
  heroAlbumIndex = 0;
  private heroAlbumCache?: { photos: GalleryImage[]; videos: CiaVideoCard[]; items: HeroAlbumItem[] };
  get heroAlbumItems(): HeroAlbumItem[] {
    if (this.heroAlbumCache?.photos !== this.galleryImages || this.heroAlbumCache.videos !== this.uploadedVideoCards) {
      const items: HeroAlbumItem[] = [];
      for (const tab of this.videoTabs) {
        for (const video of tab.items) {
          items.push({ kind: 'video', category: tab.label, title: video.title, description: video.text, src: video.src,
            poster: video.poster, duration: video.duration, shape: video.shape });
        }
      }
      for (const category of this.galleryAlbumCategories) {
        for (const image of this.galleryImagesForCategory(category)) {
          items.push({ kind: 'photo', category, title: image.title, description: image.description, src: image.src });
        }
      }
      this.heroAlbumCache = { photos: this.galleryImages, videos: this.uploadedVideoCards, items };
    }
    return this.heroAlbumCache.items;
  }
  get heroAlbumItem(): HeroAlbumItem {
    const items = this.heroAlbumItems;
    return items[Math.min(this.heroAlbumIndex, items.length - 1)];
  }
  get heroAlbumChips(): Array<{ category: string; count: number; video: boolean }> {
    const categories = [...this.videoTabs.map(tab => tab.label), ...this.galleryAlbumCategories];
    return categories
      .map(category => {
        const items = this.heroAlbumItems.filter(item => item.category === category);
        return { category, count: items.length, video: items[0]?.kind === 'video' };
      })
      .filter(chip => chip.count > 0);
  }
  /** The album tabs as two rows, 视频 and 照片. A video topic drops its 视频 suffix because the row label says it. */
  get heroAlbumChipGroups(): Array<{ label: string; chips: Array<{ category: string; label: string; count: number }> }> {
    const chips = this.heroAlbumChips;
    return [
      { label: '视频', chips: chips.filter(chip => chip.video).map(chip => ({ ...chip, label: chip.category.replace(/视频$/, '') || chip.category })) },
      { label: '照片', chips: chips.filter(chip => !chip.video).map(chip => ({ ...chip, label: chip.category })) },
    ].filter(group => group.chips.length);
  }
  /** Thumbnails of the current item's category, with their index in the whole album. */
  get heroAlbumThumbs(): Array<{ item: HeroAlbumItem; index: number }> {
    const category = this.heroAlbumItem?.category;
    return this.heroAlbumItems
      .map((item, index) => ({ item, index }))
      .filter(entry => entry.item.category === category);
  }
  get heroAlbumPhotos(): HeroAlbumItem[] { return this.heroAlbumItems.filter(item => item.kind === 'photo'); }
  get heroAlbumPhotoSources(): string[] { return this.heroAlbumPhotos.map(item => item.src); }
  get heroAlbumPhotoTitles(): string[] { return this.heroAlbumPhotos.map(item => item.title); }
  get heroAlbumPhotoCaptions(): string[] { return this.heroAlbumPhotos.map(item => item.description); }
  get heroAlbumPhotoAlts(): string[] { return this.heroAlbumPhotos.map(item => `${item.category}实景：${item.title}`); }
  selectHeroAlbumChip(category: string): void {
    const index = this.heroAlbumItems.findIndex(item => item.category === category);
    if (index >= 0) this.heroAlbumIndex = index;
  }
  stepHeroAlbum(step: number): void {
    const length = this.heroAlbumItems.length;
    if (length > 0) this.heroAlbumIndex = (this.heroAlbumIndex + step + length) % length;
  }
  /** Video groups of the album; uploaded videos without a topic go last as 更多视频. */
  get videoTabs(): PhVideoTab[] {
    const tabs = [...(this.profile.videoTabs ?? [])];
    if (this.uploadedVideoCards.length) {
      tabs.push({
        label: '更多视频',
        icon: 'videocam',
        items: this.uploadedVideoCards.map(card => ({ title: card.title, text: card.text, src: card.videoSrc, shape: 'wide' as const })),
      });
    }
    return tabs;
  }
  /** Course notes (Light ESL, guarantee rules …) shown inside the courses they belong to. */
  guidesForCourse(courseId: string): CourseDetailGuide[] {
    return this.courseDetailGuides.filter(guide => guide.courseIds?.includes(courseId));
  }
  /** Notes for every course (study rules, the free evening class), listed once under the course list. */
  readonly generalCourseGuides = this.courseDetailGuides.filter(guide => !guide.courseIds?.length);

  /** The 2027 calendar as one row per month: holidays, IELTS dates and whether the month has peak weeks. */
  get calendarMonths(): CalendarMonthRow[] {
    const calendar = this.holidayCalendars.find(item => item.year === 2027) ?? this.holidayCalendars[0];
    if (!calendar) return [];
    const year = calendar.year;
    const ranges = [...this.peakSeasonCalendarRanges.filter(range => range.enabled !== false), ...this.calendarFreePeakRanges];
    return Array.from({ length: 12 }, (_, offset) => {
      const month = offset + 1;
      const first = `${year}-${String(month).padStart(2, '0')}-01`;
      const last = `${year}-${String(month).padStart(2, '0')}-31`;
      return {
        month,
        holidays: calendar.months.find(item => item.month === month)?.holidays ?? [],
        exams: year === 2027 ? this.ieltsComputerExamDates2027.find(item => item.month === month)?.days ?? [] : [],
        peak: ranges.some(range => range.start <= last && range.end >= first),
      };
    });
  }
  /** Peak ranges that touch the calendar year, for the line above the calendar table. */
  get calendarPeakRanges(): CiaPeakSeasonRange[] {
    const year = this.calendarYear;
    return this.peakSeasonCalendarRanges.filter(range =>
      range.enabled !== false && range.end >= `${year}-01-01` && range.start <= `${year}-12-31`);
  }
  /** School-only peak ranges without a surcharge (HANA) that touch the calendar year; CIA has none. */
  get calendarFreePeakRanges(): CiaPeakSeasonRange[] {
    const year = this.calendarYear;
    return (this.profile.peakSeasonsWithoutSurcharge?.ranges ?? [])
      .filter(range => range.end >= `${year}-01-01` && range.start <= `${year}-12-31`)
      .map(range => ({ id: range.start, label: range.label, start: range.start, end: range.end, enabled: true }));
  }
  readonly freePeakTitle = this.profile.peakSeasonsWithoutSurcharge?.title ?? '';
  get calendarYear(): number {
    return (this.holidayCalendars.find(item => item.year === 2027) ?? this.holidayCalendars[0])?.year ?? 2027;
  }

  /** Rooms: a price card opens that room's photos and details below its group. */
  selectedRateRoomId = '';
  isNarrowViewport = typeof window !== 'undefined' && window.innerWidth <= 760;
  @HostListener('window:resize')
  updateViewportWidth(): void {
    this.isNarrowViewport = typeof window !== 'undefined' && window.innerWidth <= 760;
  }
  roomProfileForRate(room: RoomRateOption): PhRoomProfile | undefined {
    // An empty room code never matches: rooms without codes (PINES, HANA) link only through `rateIds`, and only
    // HANA's double room has photos.
    return this.roomComparisonProfiles.find(profile =>
      profile.rateIds?.includes(room.id)
      || (!!room.code && (profile.bookingCode ?? '').split('/').map(code => code.trim()).includes(room.code)));
  }
  /** False when some room cards have no photos (HANA), so the hint points at the 看照片 buttons instead. */
  get everyRateRoomHasPhotos(): boolean {
    return this.roomRateGroups.every(group => group.rooms.every(room => !!this.roomProfileForRate(room)));
  }
  get activeRateRoomId(): string {
    if (this.selectedRateRoomId) return this.selectedRateRoomId;
    for (const group of this.roomRateGroups) {
      const room = group.rooms.find(item => this.roomProfileForRate(item)?.id === this.selectedRoomProfile?.id);
      if (room) return room.id;
    }
    return '';
  }
  selectRateRoom(room: RoomRateOption, event?: Event): void {
    const profile = this.roomProfileForRate(room);
    if (!profile) return;
    // Phones: the open panel moves under the tapped card, so keep that card where the finger left it.
    const card = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    const cardTop = this.isNarrowViewport && card ? card.getBoundingClientRect().top : null;
    // Phones: tapping the open room again closes its details.
    if (this.isNarrowViewport && this.selectedRateRoomId === room.id) {
      this.selectedRateRoomId = '';
    } else {
      this.selectedRateRoomId = room.id;
      this.setRoomProfile(profile.id);
    }
    if (cardTop !== null && typeof window !== 'undefined') {
      setTimeout(() => {
        const moved = document.querySelector(`#rooms .room-price-matrix [data-cia-preview-id="${room.id}"]`);
        if (moved) window.scrollBy(0, moved.getBoundingClientRect().top - cardTop);
      });
    }
  }
  /** The price card the room panel belongs to; a profile priced per occupancy shows that card's own name. */
  get roomVariant(): { code: string; label: string; suitable: string } | undefined {
    const id = this.activeRateRoomId;
    const room = this.roomRateGroups.flatMap(group => group.rooms).find(item => item.id === id);
    const variant = room ? this.selectedRoomProfile.variants?.[room.code] : undefined;
    return room && variant ? { code: room.code, label: variant.label, suitable: variant.suitable } : undefined;
  }
  /**
   * Phones show a room's details right under the tapped card, only after a tap, so the page stays short
   * and the photos clearly belong to that room; wider screens always show the selected room under the
   * whole price list. Returns the tapped card's position in the group, or -1 when the panel is elsewhere.
   */
  roomPanelSplit(group: RoomRateGroup): number {
    if (!this.compactLayout || !this.isNarrowViewport || !this.selectedRateRoomId) return -1;
    return group.rooms.findIndex(room => room.id === this.selectedRateRoomId);
  }
  roomsBeforePanel(group: RoomRateGroup): RoomRateOption[] {
    const split = this.roomPanelSplit(group);
    return split < 0 ? group.rooms : group.rooms.slice(0, split + 1);
  }
  roomsAfterPanel(group: RoomRateGroup): RoomRateOption[] {
    const split = this.roomPanelSplit(group);
    return split < 0 ? [] : group.rooms.slice(split + 1);
  }
  trackRateRoom(_index: number, room: RoomRateOption): string {
    return room.id;
  }

  get displayedVideoCards(): CiaVideoCard[] {
    return [...this.videoCards, ...this.uploadedVideoCards];
  }

  /**
   * Plays a short clip fullscreen. Narrow players hide the browser's own fullscreen control in the "⋮" menu,
   * so each short-clip card has this button; iPhone Safari and WeChat only offer the video's webkit fullscreen.
   */
  playFullscreen(video: HTMLVideoElement): void {
    const clip = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    // Start playing inside the tap, so the clip still plays where fullscreen is refused.
    video.play().catch(() => undefined);
    const webkitFullscreen = () => {
      try { clip.webkitEnterFullscreen?.(); } catch { /* stays inline and keeps playing */ }
    };
    if (typeof video.requestFullscreen === 'function' && document.fullscreenEnabled) {
      video.requestFullscreen().catch(webkitFullscreen);
    } else {
      webkitFullscreen();
    }
  }

  private courseGroupCache?: { source: CourseFee[]; groups: CourseGroupView[] };
  /** Courses sorted into the website groups; a published course outside every group lands in “其他课程”. */
  get courseGroups(): CourseGroupView[] {
    if (this.courseGroupCache?.source !== this.courseFees) {
      const used = new Set<string>();
      const groups = this.profile.courseGroups.map(group => {
        const courses = group.courseIds
          .map(id => this.courseFees.find(course => course.id === id))
          .filter((course): course is CourseFee => !!course);
        courses.forEach(course => used.add(course.id));
        return { icon: group.icon, title: group.title, text: group.text, courses };
      }).filter(group => group.courses.length > 0);
      const rest = this.courseFees.filter(course => !used.has(course.id));
      if (rest.length) groups.push({ icon: 'more_horiz', title: '其他课程', text: '', courses: rest });
      this.courseGroupCache = { source: this.courseFees, groups };
    }
    return this.courseGroupCache.groups;
  }
  trackCourseGroup(_index: number, group: CourseGroupView): string { return group.title; }
  private courseGroupColumnCache?: { source: CourseGroupView[]; columns: Array<Array<{ group: CourseGroupView; index: number }>> };
  /** Compact layout: groups 1, 3 … on the left and 2, 4 … on the right; index keeps the phone order. */
  get courseGroupColumns(): Array<Array<{ group: CourseGroupView; index: number }>> {
    const groups = this.courseGroups;
    if (this.courseGroupColumnCache?.source !== groups) {
      const columns: Array<Array<{ group: CourseGroupView; index: number }>> = [[], []];
      groups.forEach((group, index) => columns[index % 2].push({ group, index }));
      this.courseGroupColumnCache = { source: groups, columns };
    }
    return this.courseGroupColumnCache.columns;
  }
  trackCourseGroupEntry(_index: number, entry: { group: CourseGroupView }): string { return entry.group.title; }
  private courseModeZoneCache?: { source: CourseGroupView[]; zones?: CourseModeZone[] };
  /** Profiles with courseModes list courses by study mode first; undefined keeps the normal goal groups. */
  get courseModeZones(): CourseModeZone[] | undefined {
    const groups = this.courseGroups;
    if (this.courseModeZoneCache?.source !== groups) {
      this.courseModeZoneCache = { source: groups, zones: this.buildCourseModeZones(groups) };
    }
    return this.courseModeZoneCache.zones;
  }
  private buildCourseModeZones(groups: CourseGroupView[]): CourseModeZone[] | undefined {
    const modes = this.profile.courseModes;
    if (!modes?.length) return undefined;
    const modeOf = (course: CourseFee) => modes.find(mode => course.id.startsWith(mode.idPrefix));
    // A course outside every mode would vanish from the zones, so keep the normal list instead.
    if (!groups.every(group => group.courses.every(course => !!modeOf(course)))) return undefined;
    return modes.map(mode => {
      const zoneGroups = groups.map(group => {
        const courses = group.courses.filter(course => modeOf(course) === mode);
        const offered = [...new Set(group.courses.map(course => modeOf(course)!.title))];
        return { ...group, courses, missingNote: courses.length ? '' : `本类课程仅开设${offered.join('、')}` };
      });
      const count = zoneGroups.reduce((sum, group) => sum + group.courses.length, 0);
      return { title: mode.title, hint: mode.hint, strict: !!mode.strict, count, groups: zoneGroups };
    });
  }
  /** Inside a mode zone the row drops the name's “（mode）” suffix, which the zone heading already says. */
  courseLineName(name: string, mode?: string): string {
    const suffix = mode ? `（${mode}）` : '';
    return suffix && name.endsWith(suffix) ? name.slice(0, -suffix.length) : name;
  }
  private readonly schedulePartCache = new Map<string, string[]>();
  /** A course's daily schedule split at “+” and “；” so the row can show it as short parts. */
  scheduleParts(schedule: string): string[] {
    let parts = this.schedulePartCache.get(schedule);
    if (!parts) {
      parts = schedule.split(/\s*[+＋;；]\s*/).map(part => part.trim()).filter(Boolean);
      this.schedulePartCache.set(schedule, parts);
    }
    return parts;
  }

  readonly studentCareServices = this.profile.studentCareServices;

  readonly campusPracticalGuides = this.profile.campusPracticalGuides;

  roomRateGroups: RoomRateGroup[] = this.profile.initialRoomRateGroups;
  readonly roomGroupNotes: Readonly<Record<string, string>> = this.profile.roomGroupNotes ?? {};

  readonly roomComparisonProfiles: readonly PhRoomProfile[] = this.profile.roomProfiles;
  /** The room comparison table needs measured facts; schools without them leave it out. */
  readonly hasRoomFacts = this.profile.roomProfiles.some(profile => !!profile.size);

  readonly studentTracks = this.profile.studentTracks;

  readonly officialStudentReviews = this.profile.studentReviews;
  /** School-only short written reviews (HANA); CIA has none. */
  readonly textReviews = this.profile.textReviews ?? [];
  /** Short-stay lines replacing the price ratios (profile.shortStayRows; GLC). */
  readonly shortStayRows = this.profile.shortStayRows ?? [];

  readonly sidaCiaReasons = this.profile.sidaReasons;

  readonly sidaCiaTrustBadges = this.profile.sidaTrustBadges;

  readonly ctaBadges = this.profile.ctaBadges;

  /**
   * Every consultant in today's order, for the consultant cards and the floating 免费咨询 button alike. It starts
   * from SIDA_CONSULTANT_DAILY_ORDER and turns by one place each day (China time), so each consultant leads in turn,
   * and the first one's QR code is shown when the panel opens (user decisions 2026-11-21).
   */
  readonly ctaConsultants = consultantsInTodaysOrder(this.profile.ctaConsultants, consultant => consultant.name);
  readonly floatConsultants = this.ctaConsultants;
  floatConsultantIndex = 0;
  floatConsultOpen = false;

  /** Opens the floating panel on one consultant's QR code (the button on a WeChat-only consultant card). */
  openFloatConsult(consultant: CtaConsultant, event: Event): void {
    event.stopPropagation();
    const index = this.floatConsultants.findIndex(item => item.name === consultant.name);
    if (index >= 0) this.floatConsultantIndex = index;
    this.floatConsultOpen = true;
  }

  get floatConsultant(): CtaConsultant | undefined {
    return this.floatConsultants[this.floatConsultantIndex];
  }

  /**
   * 咨询顾问 chosen in the quote (user request 2026-11-21; layoutVersion 2 images, CIA so far): the quote image shows
   * this consultant's phone and WeChat QR code. ngOnInit picks
   * today's first consultant.
   */
  get usesQuoteConsultant(): boolean { return this.quote.usesContactCard; }
  get quoteConsultantName(): string { return this.quote.contactCard?.consultant.name ?? ''; }
  set quoteConsultantName(name: string) {
    const consultant = this.ctaConsultants.find(item => item.name === name);
    if (consultant) this.quote.contactCard = quoteContactCard(consultant);
  }

  @HostListener('document:click', ['$event'])
  closeFloatConsult(event: Event): void {
    if (this.floatConsultOpen && event.target instanceof Element && !event.target.closest('.float-consult')) {
      this.floatConsultOpen = false;
    }
  }

  ngOnInit(): void {
    if (this.usesQuoteConsultant) this.quoteConsultantName = this.ctaConsultants[0]?.name ?? '';
    this.loadExtendedPageStyles();
    this.applySessionPreview();
    this.loadPricingFromDatabase();
    this.loadGalleryFromDatabase();
  }

  ngAfterViewInit(): void {
    if (this.isEditorPreview) {
      this.previewHost.nativeElement.classList.add('cia-editor-preview');
      window.parent.postMessage({ type: `${this.profile.previewPrefix}-content-ready` }, window.location.origin);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.previewFocusTimer);
  }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) {
      return;
    }
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type === `${this.profile.previewPrefix}-content-preview` && message.content) {
      this.applyContentConfig(message.content);
      if (isCiaPreviewTarget(message.target)) this.previewTarget = message.target;
      this.queuePreviewFocus(message.scroll === true);
    }
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    // Wait for Angular to render the edited rows before measuring their position.
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const root = this.previewHost.nativeElement;
      const result = resolveCiaPreviewTarget(root, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback
        ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) {
        if (scroll) revealCiaPreviewElement(element);
      }
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(item => item.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(item => item.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(item => item.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(item => item.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠明细（请核对日期、方案及叠加条件）；已定位到优惠显示区域。'
          : !result.exact && target.id === 'quote-season' ? '当前试算未产生旺季附加费；已定位到费用明细区域。'
            : result.exact ? '橙色框内就是对应的官网内容。修改会在这里即时显示。'
              : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: `${this.profile.previewPrefix}-content-located`, target, status }, window.location.origin);
    });
  }

  isPreviewHighlighted(kind: string, id: string): boolean {
    return this.isEditorPreview && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  trackPreviewRow(index: number): number {
    // Calculated getters return new objects; retain row DOM through focus/click/change detection.
    return index;
  }

  @HostListener('click', ['$event'])
  selectPreviewEditorItem(event: MouseEvent): void {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: element?.dataset['ciaPreviewKind'], id: element?.dataset['ciaPreviewId'] };
    if (!isCiaPreviewTarget(target)) return;
    this.previewTarget = target;
    this.queuePreviewFocus(false);
    window.parent.postMessage({ type: `${this.profile.previewPrefix}-content-select`, ...target }, window.location.origin);
  }

  private loadExtendedPageStyles(): void {
    if (typeof document === 'undefined' || document.getElementById('cia-page-extended-styles')) {
      return;
    }

    const stylesheet = document.createElement('link');
    stylesheet.id = 'cia-page-extended-styles';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/cia/cia-page-extended.css';
    document.head.appendChild(stylesheet);
  }

  /** The school record among the name lookup's results; CIA keeps an older, looser fallback. */
  protected findSchool(schools: SchoolDTO[]): SchoolDTO | undefined {
    return schools.find(school => school.name === this.profile.pricingSchoolName);
  }

  private loadPricingFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.profile.pricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const school = this.findSchool(schools);
          if (!school?.id) {
            return EMPTY;
          }

          return forkJoin({
            lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
            rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
            fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
            published: this.schoolContentService
              .getPublished<CiaContentConfig>(school.id)
              .pipe(catchError(() => of(null))),
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe(({ lessons, rooms, fees, published }) => {
        this.applyPricingData(lessons, rooms, fees);
        const preview = this.readSessionPreview();
        if (preview) {
          this.applyContentConfig(preview);
        } else if (published?.content) {
          this.applyContentConfig(published.content);
        }
      });
  }

  private applySessionPreview(): void {
    const preview = this.readSessionPreview();
    if (preview) {
      this.applyContentConfig(preview);
    }
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (
      typeof sessionStorage === 'undefined' ||
      this.route.snapshot.queryParamMap.get('contentPreview') !== '1'
    ) {
      return null;
    }
    try {
      const raw = sessionStorage.getItem(`${this.profile.previewPrefix}-content-preview`);
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === this.profile.code ? value : null;
    } catch {
      return null;
    }
  }

  protected applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== this.profile.code) {
      return;
    }
    const content = this.profile.cloneContent(value);
    this.previewContent = content;
    // Prices and rules for the calculator; the mini program applies the same function.
    applyCiaQuoteContent(this, content);
    const rooms = content.rooms
      .filter(item => item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    if (rooms.length > 0) {
      const groupNames = [...new Set(rooms.map(item => item.group))];
      this.roomRateGroups = groupNames.map(title => ({
        title,
        rooms: rooms
          .filter(item => item.group === title)
          .map(item => ({
            id: item.id,
            label: item.label,
            code: item.code,
            location: item.location,
          })),
      }));
    }

    const settings = content.quoteSettings;
    this.localFeeIntro = settings.localFeeIntro;
    this.courseTableTitle = settings.courseTableTitle;
    this.courseTableNote = settings.courseTableNote;
    this.groupClassNote = settings.groupClassNote;
    this.roomTableTitle = settings.roomTableTitle;
    this.roomTableNote = settings.roomTableNote;
    this.stayPolicyTitle = settings.stayPolicyTitle;
    this.stayPolicies = settings.stayPolicies;
    this.extraNightRates = settings.extraNightRates;
    this.afterContentApplied(content);

    this.quote.retainValidSelections();
    this.queuePreviewFocus(false);
  }

  /** For school-only settings the shared content mapping does not carry. */
  protected afterContentApplied(_content: CiaContentConfig): void {}

  private loadGalleryFromDatabase(): void {
    this.schoolService
      .getSchools({ name: this.profile.pricingSchoolName })
      .pipe(
        switchMap((schools) => {
          const school = this.findSchool(schools);
          if (!school?.id) {
            return EMPTY;
          }

          return this.schoolService.getSchoolPhotos({
            schoolId: school.id,
            isActive: true,
          });
        }),
        catchError(() => EMPTY),
      )
      .subscribe((photos) => this.applyGalleryPhotos(photos));
  }

  /**
   * Whether an uploaded school photo or video belongs on this page. Every upload by default; a school whose
   * campus pages share one school record (JIC) keeps only its own campus.
   */
  protected acceptUploadedMedia(_photo: SchoolPhotoDTO): boolean {
    return true;
  }

  private uploadedMediaSource: SchoolPhotoDTO[] | null = null;
  private galleryBeforeUploads: GalleryImage[] | null = null;

  /** Applies the loaded uploads again after acceptUploadedMedia changed its answer (JIC: content with campus tags arrived). */
  protected refreshUploadedMedia(): void {
    if (!this.uploadedMediaSource) return;
    if (this.galleryBeforeUploads) this.galleryImages = this.galleryBeforeUploads;
    this.uploadedVideoCards = [];
    this.applyGalleryPhotos(this.uploadedMediaSource);
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    this.uploadedMediaSource = photos ?? [];
    this.galleryBeforeUploads ??= this.galleryImages;
    const uploadedMedia = (photos ?? [])
      .filter((photo) => Boolean(photo.url) && this.acceptUploadedMedia(photo))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    if (uploadedMedia.length === 0) {
      return;
    }

    const uploadedPhotos = uploadedMedia.filter(photo =>
      !photo.contentType || photo.contentType.toLowerCase().startsWith('image/'));
    const uploadedVideos = uploadedMedia.filter(photo =>
      photo.contentType?.toLowerCase().startsWith('video/'));

    const existingSources = new Set(
      this.galleryImages.map((image) => image.src),
    );
    const labels = this.profile.gallery;
    const uploadedGalleryImages = uploadedPhotos
      .map((photo) => ({
        category: this.resolveUploadedPhotoCategory(photo.category),
        title:
          photo.caption ||
          photo.altText ||
          photo.originalFileName ||
          labels.uploadedPhotoTitle,
        description: photo.altText || photo.caption || labels.uploadedPhotoDescription,
        src: photo.url ?? '',
      }))
      .filter((image) => !existingSources.has(image.src));

    if (uploadedGalleryImages.length > 0) {
      this.usingUploadedGallery = true;
      this.galleryImages = [...this.galleryImages, ...uploadedGalleryImages];
    }

    const existingVideos = new Set(this.videoCards.map(item => item.videoSrc));
    this.uploadedVideoCards = uploadedVideos
      .filter(photo => !!photo.url && !existingVideos.has(photo.url))
      .map(photo => ({
        code: 'SCHOOL',
        title: photo.caption || photo.originalFileName || labels.uploadedVideoTitle,
        text: photo.altText || `${this.resolveUploadedPhotoCategory(photo.category)}实景视频`,
        videoSrc: photo.url ?? '',
        contentType: photo.contentType ?? 'video/mp4',
        details: [`官网分类：${this.resolveUploadedPhotoCategory(photo.category)}`],
      }));
  }

  setGalleryCategory(category: GalleryCategory): void {
    this.selectedGalleryCategory = category;
    this.selectedGalleryImageIndex = 0;
  }

  selectGalleryImage(index: number): void {
    const lastIndex = Math.max(this.displayedGalleryImages.length - 1, 0);
    this.selectedGalleryImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  previousGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex - 1 + length) % length;
    }
  }

  nextGalleryImage(): void {
    const length = this.displayedGalleryImages.length;
    if (length > 0) {
      this.selectedGalleryImageIndex =
        (this.selectedGalleryImageIndex + 1) % length;
    }
  }

  openGalleryFromPreview(event?: Event): void {
    this.setGalleryCategory(this.galleryCategories[0]);
    this.scrollToSection('gallery', event);
  }

  calculateQuote(): void {
    this.quoteCalculated = true;
  }

  scrollToSection(target: string, event?: Event): void {
    event?.preventDefault();

    const targetElement = document.getElementById(target);

    if (!targetElement) {
      return;
    }

    const headerOffset =
      window.innerWidth <= 760 ? 136 : window.innerWidth <= 1099 ? 208 : 136;
    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: 'smooth',
    });

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}#${target}`,
    );
  }

  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory === this.galleryCategories[0]) {
      return this.galleryImages;
    }

    return this.galleryImages.filter(
      (image) => image.category === this.selectedGalleryCategory,
    );
  }

  selectHeroGalleryImage(index: number): void {
    const lastIndex = Math.max(this.heroGalleryPreviewImages.length - 1, 0);
    this.selectedHeroImageIndex = Math.min(Math.max(index, 0), lastIndex);
  }

  get displayedGalleryImages(): GalleryImage[] {
    return this.filteredGalleryImages;
  }

  get selectedGalleryImage(): GalleryImage {
    return (
      this.displayedGalleryImages[this.selectedGalleryImageIndex] ??
      this.displayedGalleryImages[0] ??
      this.galleryImages[0]
    );
  }

  get displayedGalleryImageSources(): string[] {
    return this.displayedGalleryImages.map((image) => image.src);
  }

  get displayedGalleryImageTitles(): string[] {
    return this.displayedGalleryImages.map((image) => image.title);
  }

  get displayedGalleryImageCaptions(): string[] {
    return this.displayedGalleryImages.map((image) => image.description);
  }

  get displayedGalleryImageAlts(): string[] {
    return this.displayedGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedRoomGalleryTitles(): string[] {
    return this.selectedRoomProfile.gallery.map(
      (_, index) =>
        `${this.selectedRoomProfile.label} · ${index === 0 ? '主要空间' : `细节实景 ${index + 1}`}`,
    );
  }

  get selectedRoomGalleryCaptions(): string[] {
    const profile = this.selectedRoomProfile;
    const code = profile.bookingCode ? `${profile.bookingCode} ` : '';
    // A room without a location (PINES) is named instead of saying 校内房型.
    const name = profile.location ? `${profile.location}房型` : profile.label;
    return profile.gallery.map(
      (_, index) => `${code}${name} · 第${index + 1}张实景`,
    );
  }

  get selectedRoomGalleryAlts(): string[] {
    return this.selectedRoomGalleryTitles.map((title) => `${title}照片`);
  }

  galleryImagesForCategory(category: PhAlbumCategory): GalleryImage[] {
    return this.galleryImages.filter((image) => image.category === category);
  }

  galleryAlbumDescription(category: PhAlbumCategory): string {
    return this.profile.gallery.albumDescriptions[category];
  }

  get heroGalleryPreviewImages(): GalleryImage[] {
    if (this.usingUploadedGallery) {
      return this.galleryImages.slice(0, 4);
    }

    return this.galleryImages
      .filter((image) =>
        this.profile.gallery.heroCategories.includes(image.category),
      )
      .slice(0, 4);
  }

  get selectedHeroGalleryImage(): GalleryImage {
    return (
      this.heroGalleryPreviewImages[this.selectedHeroImageIndex] ??
      this.heroGalleryPreviewImages[0] ??
      this.galleryImages[0]
    );
  }

  get selectedHeroGalleryImages(): GalleryImage[] {
    const images = this.heroGalleryPreviewImages;
    const selected = images[this.selectedHeroImageIndex] ?? images[0];

    if (!selected) {
      return [];
    }

    return [selected, ...images.filter((image) => image !== selected)];
  }

  get selectedHeroGallerySources(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.src);
  }

  get selectedHeroGalleryTitles(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.title);
  }

  get selectedHeroGalleryCaptions(): string[] {
    return this.selectedHeroGalleryImages.map((image) => image.description);
  }

  get selectedHeroGalleryAlts(): string[] {
    return this.selectedHeroGalleryImages.map(
      (image) => `${image.category}实景：${image.title}`,
    );
  }

  get selectedCourse(): CourseFee {
    return (
      this.courseFees.find((course) => course.id === this.selectedCourseId) ??
      this.courseFees[0]
    );
  }

  get selectedRoom(): RoomFee {
    return (
      this.roomFees.find((room) => room.id === this.selectedRoomId) ??
      this.roomFees[this.roomFees.length - 1]
    );
  }

  /** Money the student pays outside the school total (CIA's IAU fee), shown beside the total. */
  get extraPaymentNote(): string { return this.quote.extraPaymentNote; }
  get tuitionForSelectedWeeks(): number { return this.quote.tuitionForSelectedWeeks; }
  get roomFeeForSelectedWeeks(): number { return this.quote.roomFeeForSelectedWeeks; }

  get peakSeasonWeeks(): number { return this.quote.peakSeasonWeeks; }
  get isPeakSeason(): boolean { return this.quote.isPeakSeason; }
  get seasonalSurcharge(): number { return this.quote.seasonalSurcharge; }
  get coveredPeakSeasonLabels(): string { return this.quote.coveredPeakSeasonLabels; }
  get peakSeasonStatusText(): string { return this.quote.peakSeasonStatusText; }
  /** BESA/CALA members pay the associations' 2027 rate; other schools keep their published one. */
  get peakRate2027(): number { return associationPeakRateForWeek(this.profile.code, '2027-01-03', this.seasonalFeePerWeek); }

  get peakSeasonRangeText(): string {
    return this.peakSeasonRanges
      .filter(({ enabled }) => enabled)
      .map(({ label, start, end }) =>
        `${label} ${start.replace(/-/g, '/')}–${end.replace(/-/g, '/')}`,
      )
      .join('；');
  }

  get peakSeasonCalendarRanges(): CiaPeakSeasonRange[] { return this.quote.peakSeasonCalendarRanges; }
  get peakSeason2027RangeText(): string { return this.quote.peakSeason2027RangeText; }

  peakSeasonWeekCount(range: CiaPeakSeasonRange): number {
    const start = this.parseDate(range.start).getTime();
    const end = this.parseDate(range.end).getTime();
    return Math.max(0, Math.round((end - start + 86400000) / (7 * 86400000)));
  }

  formatPeakSeasonRange(range: CiaPeakSeasonRange): string { return this.quote.formatPeakSeasonRange(range); }

  get payableRegistrationFee(): number { return this.quote.payableRegistrationFee; }
  get quoteUsd(): number { return this.quote.quoteUsd; }
  get quoteUsdText(): string { return this.quote.quoteUsdText; }
  get quoteCnyText(): string { return this.quote.quoteCnyText; }
  get exchangeRateDateText(): string { return this.quote.exchangeRateDateText; }
  get exchangeRateSummary(): string { return this.quote.exchangeRateSummary; }
  get estimatedLocalFees(): LocalFeeEstimate[] { return this.quote.estimatedLocalFees; }
  get estimatedLocalFeeTotal(): number { return this.quote.estimatedLocalFeeTotal; }
  /** A chosen group pickup counted in the total (BESA schools) must not be called excluded; CIA lists pickup apart. */
  get localFeeTotalNote(): string {
    return this.estimatedLocalFees.some(fee => fee.item.includes('接机') && fee.total > 0) ? '不含房间押金' : '不含接机及房间押金';
  }
  get estimatedLocalFeeCny(): number { return this.quote.estimatedLocalFeeCny; }
  formatPhp(value: number): string { return this.quote.formatPhp(value); }

  formatPesoText(value: string): string {
    return value.replace(/₱\s*([0-9][0-9,]*)/g, '$1比索');
  }

  formatFeeQuantity(value: number): string { return this.quote.formatFeeQuantity(value); }

  shortStayPercent(weeks: number): string {
    return `${Math.round((this.shortTermPriceRatios[String(weeks)] ?? weeks / 4) * 100)}%`;
  }

  previewFeeId(name: string): string {
    return this.localFeeRules.find(rule => rule.name === name.replace(/^学生[\d、]+ · /, ''))?.id ?? '';
  }

  get discountText(): string {
    const rule = this.promotions.find(item =>
      item.enabled && item.discountType === 'percentage' &&
      item.appliesTo === 'tuition-and-accommodation');
    return rule ? `${100 - rule.discountValue}折` : '无固定折扣';
  }

  formatUsd(value: number): string { return this.quote.formatUsd(value); }
  /** Four-week price in the course list: the 2027 price (equal to the 2026 one where prices did not change). */
  listPrice(fee: CourseFee): number { return fee.tuition2027; }
  /** Unit after a course-list price; a school with fixed-length packages (CPILS guarantee courses) overrides it. */
  coursePriceUnit(_fee: CourseFee): string { return this.copy.courses.priceUnit; }
  /** The 2026 price inside an opened course, or null to leave that row out. */
  oldListPrice(fee: CourseFee): number | null {
    return this.show2026Prices && this.copy.courses.oldPriceLabel ? fee.tuition : null;
  }

  get quoteImageData() { return this.quote.quoteImageData; }

  private resolveUploadedPhotoCategory(category?: string): PhAlbumCategory {
    const normalizedCategory = (category ?? '').trim().toLowerCase();
    const categoryIndex =
      this.uploadedPhotoCategoryIndexes[normalizedCategory] ?? 1;

    return this.galleryCategories[categoryIndex] as PhAlbumCategory;
  }

  roomFeeFor(id: string): number {
    return this.roomFees.find((room) => room.id === id)?.fee ?? 0;
  }

  /** Desktop room price table: each group is as wide as its number of rooms (CIA 3/3/4, EV 4/2). */
  get roomMatrixColumns(): string {
    return this.roomRateGroups.map(group => `${Math.max(1, group.rooms.length)}fr`).join(' ');
  }

  setRoomProfile(profileId: string): void {
    this.selectedRoomProfileId = profileId;
    this.selectedRoomPhotoIndex = 0;
    this.roomVideoOpen = true;
  }

  get selectedRoomPhotos(): readonly string[] {
    const profile = this.selectedRoomProfile;
    return profile.gallery.length ? profile.gallery : [profile.image];
  }

  get selectedRoomPhoto(): string {
    const photos = this.selectedRoomPhotos;
    return photos[Math.min(this.selectedRoomPhotoIndex, photos.length - 1)];
  }

  selectRoomPhoto(index: number): void {
    this.selectedRoomPhotoIndex = Math.min(Math.max(index, 0), this.selectedRoomPhotos.length - 1);
    this.roomVideoOpen = false;
  }

  stepRoomPhoto(step: number): void {
    const length = this.roomAlbumLength;
    const next = (this.roomAlbumPosition - 1 + step + length) % length;
    if (!this.selectedRoomVideo) {
      this.selectedRoomPhotoIndex = next;
      return;
    }
    this.roomVideoOpen = next === 0;
    if (next > 0) this.selectedRoomPhotoIndex = next - 1;
  }

  photoSwipeStart(event: TouchEvent): void {
    const touch = event.changedTouches[0];
    // A drag on a playing video, or on a video's control bar, seeks the video; it must not flip the album.
    // A swipe across a paused video still moves on to the next photo.
    if (event.target instanceof HTMLVideoElement) {
      const box = event.target.getBoundingClientRect();
      if (!event.target.paused || !touch || touch.clientY > box.bottom - 64) {
        this.photoSwipeOrigin = null;
        return;
      }
    }
    const arrow = event.target instanceof Element ? event.target.closest('.photo-step') : null;
    const arrowStep = arrow ? (arrow.classList.contains('photo-step--next') ? 1 : -1) : 0;
    this.photoSwipeOrigin = touch ? { x: touch.clientX, y: touch.clientY, arrowStep } : null;
  }

  photoSwipeEnd(event: TouchEvent, album: 'gallery' | 'room' | 'hero'): void {
    const origin = this.photoSwipeOrigin;
    const touch = event.changedTouches[0];
    this.photoSwipeOrigin = null;
    if (!origin || !touch) return;
    const dx = touch.clientX - origin.x;
    const dy = touch.clientY - origin.y;
    // A tap on an arrow steps here: in iPhone WeChat the arrow's own click sometimes never arrives.
    // Cancelling the touch stops that click (and a double-tap zoom), so the album moves once.
    if (origin.arrowStep && Math.abs(dx) < 12 && Math.abs(dy) < 12 && event.cancelable) {
      event.preventDefault();
      this.stepPhotoAlbum(album, origin.arrowStep);
      return;
    }
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    this.stepPhotoAlbum(album, dx < 0 ? 1 : -1);
  }

  private stepPhotoAlbum(album: 'gallery' | 'room' | 'hero', step: number): void {
    if (album === 'hero') {
      this.stepHeroAlbum(step);
    } else if (album === 'room') {
      this.stepRoomPhoto(step);
    } else if (step > 0) {
      this.nextGalleryImage();
    } else {
      this.previousGalleryImage();
    }
  }

  get selectedRoomProfile(): PhRoomProfile {
    return (
      this.roomComparisonProfiles.find((profile) => profile.id === this.selectedRoomProfileId) ??
      this.roomComparisonProfiles[0]
    );
  }

  protected parseDate(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  private readonly quoteRateSync = connectQuoteRates(this, inject(ExchangeRateService));
  readonly quoteCurrencyText = quoteCurrencyText;
}
