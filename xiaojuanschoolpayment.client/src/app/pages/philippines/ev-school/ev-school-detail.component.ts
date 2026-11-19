import { connectQuoteRates, quoteCurrencyText } from '../../../../services/quote-exchange-rates';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { SchoolFeeDTO } from '../../../../interfaces/school-fees.dto';
import { SchoolLessonDTO } from '../../../../interfaces/school-lessons.dto';
import { SchoolRoomDTO } from '../../../../interfaces/school-rooms.dto';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { applyEditableQuoteImageCopy, applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SCHOOL_VISA_OPTIONS, groupLocalFees } from '../../../components/school-group-quote';
import { EvCoursePrice, EvRoomPrice, EvStudentCalculator } from './ev-quote';
import { CiaContentConfig, CiaCourseContent, CiaLocalFeeRule, CiaPeakSeasonRange, CiaPromotionRule, CiaQuoteImageSettings, CiaRoomContent } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneEvContentConfig, createDefaultEvContentConfig } from './ev-content-config';
import {
  EV_BASIC_INFO, EV_CAMPUS_ACTIVITIES, EV_COURSES, EV_ELECTIVE_GROUPS, EV_FAQS, EV_FINAL_CTA_BADGES, EV_GALLERY_FEATURED_COUNT,
  EV_GALLERY_IMAGES, EV_IELTS_GUARANTEE_NOTE, EV_IELTS_GUARANTEE_TARGETS, EV_MOBILE_ANCHORS, EV_NOTES, EV_NOT_SUITABLE_FOR, EV_PAGE_COPY,
  EV_QUICK_INFO, EV_REFERENCE_NOTE, EV_SCHEDULE, EV_SCHOOL_SERVICES, EV_SIDE_NAV, EV_STUDY_PLANS, EV_SUITABLE_FOR, EV_VIDEOS,
  EV_WEEKEND_ACTIVITIES, EvGalleryCategory, EvGalleryImage,
} from './ev-page-content';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { SIDA_PHILIPPINES_CONSULTANTS, SidaConsultant } from '../../../components/sida-consultants';

type GalleryCategory = EvGalleryCategory;
type GalleryImage = EvGalleryImage;
type CourseFee = EvCoursePrice;
type RoomFee = EvRoomPrice;
interface LocalFee { item: string; amount: string; note: string; quantity: number; total: number; excluded?: boolean; }
type QuoteListKind = 'course' | 'room';
interface QuoteSelection { id: number; weeks: number; optionId: string; startDate: string; }
interface EvStudentQuote { calculator: EvStudentCalculator; }

const toCourseFee = (item: CiaCourseContent): CourseFee => ({
  id: item.id, name: item.name, tuition: item.tuition, suitable: item.schedule,
  feeByWeeks: item.feeByWeeks ? { ...item.feeByWeeks } : undefined, minimumWeeks: item.minimumWeeks,
});
const toRoomFee = (item: CiaRoomContent): RoomFee => ({ id: item.id, name: item.name, fee: item.fee, note: item.note });

@Component({
  selector: 'app-ev-school-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, QuoteImageDownloadButtonComponent, SchoolQuotePlanComponent, SidaWhySectionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ev-school-detail.component.html',
  styleUrls: [
    '../cebu-school-detail-layout.css',
    '../cebu-school-detail-content.css',
    '../cebu-school-detail-responsive.css',
    './ev-school-detail.component.css',
    './ev-quote-plan.css',
    '../../../components/school-group-quote.css',
  ],
})
export class EvSchoolDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly pricingSchoolName = 'EV Academy';
  private readonly initialContent = createDefaultEvContentConfig();
  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window
    && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;
  private previewContent?: CiaContentConfig;
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '餐厅', '设施'];
  selectedGalleryCategory: GalleryCategory = '全部';
  registrationFee = this.initialContent.quoteSettings.registrationFee;
  shortStayRatios = { ...this.initialContent.quoteSettings.shortStayRatios };
  peakSeasonRanges: CiaPeakSeasonRange[] = this.initialContent.quoteSettings.peakSeasonRanges.map(item => ({ ...item }));
  promotionRules: CiaPromotionRule[] = this.initialContent.quoteSettings.promotions.map(item => ({ ...item }));
  localFeeRules: CiaLocalFeeRule[] = this.initialContent.localFees.map(item => ({ ...item }));
  quoteImageSettings: CiaQuoteImageSettings = this.initialContent.quoteImageSettings;
  seasonalFeePerWeek = this.initialContent.quoteSettings.peakSeasonFeePerWeek;
  minorManagementFeePerPeriod = this.initialContent.quoteSettings.minorManagementFeePerPeriod ?? 100;
  courseTableTitle = this.initialContent.quoteSettings.courseTableTitle;
  courseTableNote = this.initialContent.quoteSettings.courseTableNote;
  groupClassNote = this.initialContent.quoteSettings.groupClassNote;
  roomTableTitle = this.initialContent.quoteSettings.roomTableTitle;
  roomTableNote = this.initialContent.quoteSettings.roomTableNote;
  stayPolicyTitle = this.initialContent.quoteSettings.stayPolicyTitle;
  stayPolicies = this.initialContent.quoteSettings.stayPolicies.map(item => ({ ...item }));
  localFeeIntro = this.initialContent.quoteSettings.localFeeIntro;
  usdToCny = Number.NaN;
  phpPerCny = Number.NaN;
  exchangeRateDate = '';
  exchangeRateLive = false;
  readonly maxQuoteWeeks = 24;
  readonly weekOptions = Array.from({ length: this.maxQuoteWeeks }, (_, index) => index + 1);
  readonly visaOptions = SCHOOL_VISA_OPTIONS;
  readonly students: EvStudentQuote[] = [this.createStudent()];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  quoteCalculated = false;

  private createStudent(): EvStudentQuote {
    const calculator = new EvStudentCalculator(
      () => this.courseFees, () => this.roomFees, () => this.registrationFee,
      () => this.seasonalFeePerWeek, () => this.minorManagementFeePerPeriod,
      () => this.shortStayRatios,
      () => this.peakSeasonRanges.filter(item => item.enabled),
      () => this.discountPercent,
      () => this.localFeeRules,
      () => this.returningRegistrationWaiverEnabled);
    return { calculator };
  }
  get discountPercent(): number {
    return this.promotionRules.find(item => item.id === 'ev-sida-95' && item.enabled)?.discountValue ?? 0;
  }
  get discount(): number { return 1 - this.discountPercent / 100; }
  get returningRegistrationWaiverEnabled(): boolean {
    return this.promotionRules.some(item => item.id === 'ev-returning-registration' && item.enabled && item.waiveRegistration);
  }
  get peakSeasonDateRange(): string {
    return this.peakSeasonRanges.filter(item => item.enabled)
      .map(item => item.start.replace(/-/g, '/') + '–' + item.end.replace(/-/g, '/')).join('；');
  }
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) {
    this.requestedStudentCount = value;
    if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(this.createStudent());
  }
  setQuoteMode(value: 'single' | 'group') { this.quoteMode = value; if (value === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  get calculator() { return this.students[0].calculator; }
  get quotePlan() { return this.calculator.plan; }
  get courseSelections() { return this.quotePlan.courses; }
  set courseSelections(value: QuoteSelection[]) { this.quotePlan.courses = value; }
  get roomSelections() { return this.quotePlan.rooms; }
  set roomSelections(value: QuoteSelection[]) { this.quotePlan.rooms = value; }
  get isMinorStudent() { return this.calculator.isMinorStudent; }
  set isMinorStudent(value: boolean) { this.calculator.isMinorStudent = value; }

  readonly copy = EV_PAGE_COPY;
  readonly referenceNote = EV_REFERENCE_NOTE;
  readonly quickInfo = EV_QUICK_INFO;
  galleryImages: GalleryImage[] = [...EV_GALLERY_IMAGES];
  readonly landscapeVideos = EV_VIDEOS.filter(item => item.orientation === 'landscape');
  readonly portraitVideos = EV_VIDEOS.filter(item => item.orientation === 'portrait');
  readonly basicInfo = EV_BASIC_INFO;
  readonly suitableFor = EV_SUITABLE_FOR;
  readonly notSuitableFor = EV_NOT_SUITABLE_FOR;
  readonly courses = EV_COURSES;
  readonly guaranteeTargets = EV_IELTS_GUARANTEE_TARGETS;
  readonly guaranteeNote = EV_IELTS_GUARANTEE_NOTE;
  courseFees: CourseFee[] = this.initialContent.courses.filter(item => item.enabled).map(toCourseFee);
  readonly studyPlans = EV_STUDY_PLANS;
  readonly schedule = EV_SCHEDULE;
  readonly electiveCourseGroups = EV_ELECTIVE_GROUPS;
  roomFees: RoomFee[] = this.initialContent.rooms.filter(item => item.enabled).map(toRoomFee);
  readonly finalCtaBadges = EV_FINAL_CTA_BADGES;
  /** Contact cards in the order the user asked for: Lemon, Penin, Jenny. */
  readonly ctaConsultants: SidaConsultant[] = ['Lemon', 'Penin', 'Jenny']
    .map(name => SIDA_PHILIPPINES_CONSULTANTS.find(item => item.name === name))
    .filter((item): item is SidaConsultant => !!item);
  showAllPhotos = false;
  readonly schoolServices = EV_SCHOOL_SERVICES;
  readonly campusActivities = EV_CAMPUS_ACTIVITIES;
  readonly weekendActivities = EV_WEEKEND_ACTIVITIES;
  readonly notes = EV_NOTES;
  readonly faqs = EV_FAQS;
  readonly sideNav = EV_SIDE_NAV;
  readonly mobileAnchors = EV_MOBILE_ANCHORS;

  ngOnInit(): void {
    this.applyContentConfig(this.readSessionPreview() ?? this.initialContent);
    this.loadPricingFromDatabase();
    this.loadExchangeRates();
  }

  ngAfterViewInit(): void {
    if (!this.isEditorPreview) return;
    this.previewHost.nativeElement.classList.add('ev-editor-preview');
    window.parent.postMessage({ type: 'ev-content-ready' }, window.location.origin);
  }

  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'ev-content-preview' || !message.content) return;
    this.applyContentConfig(message.content);
    if (isCiaPreviewTarget(message.target)) this.previewTarget = message.target;
    this.queuePreviewFocus(message.scroll === true);
  }

  @HostListener('click', ['$event'])
  selectPreviewEditorItem(event: MouseEvent): void {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: element?.dataset['ciaPreviewKind'], id: element?.dataset['ciaPreviewId'] };
    if (!isCiaPreviewTarget(target)) return;
    this.previewTarget = target;
    this.queuePreviewFocus(false);
    window.parent.postMessage({ type: 'ev-content-select', ...target }, window.location.origin);
  }

  isPreviewHighlighted(kind: string | undefined, id: string | undefined): boolean {
    return this.isEditorPreview && !!kind && !!id
      && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id;
  }

  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!;
      const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target);
      const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback
        ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find(entry => entry.id === target.id)
        : target.kind === 'room' ? this.previewContent?.rooms.find(entry => entry.id === target.id)
          : target.kind === 'fee' ? this.previewContent?.localFees.find(entry => entry.id === target.id)
            : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find(entry => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已隐藏或停用，官网不会显示；已定位到所属板块。'
        : !result.exact && target.kind === 'promotion' ? '当前试算未产生此优惠；已定位到优惠显示区域。'
          : result.exact ? '橙色框内就是对应的官网内容，修改会在这里即时显示。'
            : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'ev-content-located', target, status }, window.location.origin);
    }, 80);
  }

  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try {
      const raw = sessionStorage.getItem('ev-content-preview');
      if (!raw) return null;
      const value = JSON.parse(raw) as CiaContentConfig;
      return value?.schemaVersion === 1 && value.schoolCode === 'EV' ? value : null;
    } catch {
      return null;
    }
  }

  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'EV') return;
    const content = cloneEvContentConfig(value);
    this.previewContent = content;
    const courses = content.courses.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    const rooms = content.rooms.filter(item => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    if (courses.length) this.courseFees = courses.map(toCourseFee);
    if (rooms.length) this.roomFees = rooms.map(toRoomFee);
    const settings = content.quoteSettings;
    this.registrationFee = settings.registrationFee;
    this.shortStayRatios = { ...settings.shortStayRatios };
    this.peakSeasonRanges = settings.peakSeasonRanges.map(item => ({ ...item }));
    this.promotionRules = settings.promotions.map(item => ({ ...item }));
    this.localFeeRules = content.localFees.map(item => ({
      ...item,
      rates: item.rates ? [...item.rates] : undefined,
      tourist59Rates: item.tourist59Rates ? [...item.tourist59Rates] : undefined,
    }));
    this.seasonalFeePerWeek = settings.peakSeasonFeePerWeek;
    this.minorManagementFeePerPeriod = settings.minorManagementFeePerPeriod ?? 100;
    this.courseTableTitle = settings.courseTableTitle;
    this.courseTableNote = settings.courseTableNote;
    this.groupClassNote = settings.groupClassNote;
    this.roomTableTitle = settings.roomTableTitle;
    this.roomTableNote = settings.roomTableNote;
    this.stayPolicyTitle = settings.stayPolicyTitle;
    this.stayPolicies = settings.stayPolicies.map(item => ({ ...item }));
    this.localFeeIntro = settings.localFeeIntro;
    this.quoteImageSettings = content.quoteImageSettings;
    for (const student of this.students) {
      for (const row of student.calculator.plan.courses) {
        if (!this.courseFees.some(item => item.id === row.optionId)) row.optionId = this.courseFees[0]?.id ?? row.optionId;
      }
      for (const row of student.calculator.plan.rooms) {
        if (!this.roomFees.some(item => item.id === row.optionId)) row.optionId = this.roomFees[0]?.id ?? row.optionId;
      }
    }
    this.queuePreviewFocus(false);
  }

  private loadExchangeRates(): void {

  }

  private loadPricingFromDatabase(): void {
    this.schoolService.getSchools({ name: this.pricingSchoolName }).pipe(
      switchMap((schools) => {
        const school = schools.find((item) => item.name === this.pricingSchoolName);
        if (!school?.id) return EMPTY;
        return forkJoin({
          lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }),
          rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }),
          fees: this.schoolService.getSchoolFees({ schoolId: school.id }),
          published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
          photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))),
        });
      }),
      catchError(() => EMPTY),
    ).subscribe(({ lessons, rooms, fees, published, photos }) => {
      this.applyPricingData(lessons, rooms, fees);
      const preview = this.readSessionPreview();
      if (preview) this.applyContentConfig(preview);
      else if (published?.content) this.applyContentConfig(published.content);
      this.applyGalleryPhotos(photos);
    });
  }

  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const existingSources = new Set(this.galleryImages.map(item => item.src));
    const uploaded = (photos ?? [])
      .filter(photo => !!photo.url && !existingSources.has(photo.url))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(photo => ({
        category: this.resolveMediaCategory(photo.category),
        title: photo.caption || photo.altText || photo.originalFileName || 'EV 学校媒体',
        description: photo.altText || photo.caption || 'EV 学校实景内容',
        src: photo.url ?? '',
        contentType: photo.contentType,
      }));
    if (uploaded.length) this.galleryImages = [...this.galleryImages, ...uploaded];
  }

  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> {
    const value = (category ?? '').toLowerCase();
    if (value.includes('class') || value.includes('教室')) return '教室';
    if (value.includes('room') || value.includes('dorm') || value.includes('住宿')) return '住宿';
    if (value.includes('food') || value.includes('dining') || value.includes('餐')) return '餐厅';
    if (value.includes('campus') || value.includes('校园') || value.includes('校区')) return '校园';
    return '设施';
  }

  private applyPricingData(lessons: SchoolLessonDTO[], rooms: SchoolRoomDTO[], fees: SchoolFeeDTO[]): void {
    // The database still supplies 4-week prices; names, schedules and notes come from the content document.
    for (const lesson of lessons.filter(item => item.week === 4)) {
      const course = this.courseFees.find(item => item.id === this.createCourseId(lesson.name));
      if (course && lesson.price > 0) course.tuition = lesson.price;
    }
    for (const room of rooms.filter(item => item.week === 4)) {
      const option = this.roomFees.find(item => item.id === this.createRoomId(room.name));
      if (option && room.price > 0) option.fee = room.price;
    }
    const registrationFee = fees.find((fee) => fee.name === '注册费'); if (registrationFee) this.registrationFee = registrationFee.fee;
    const peakSeasonFee = fees.find((fee) => fee.name === '旺季附加费'); if (peakSeasonFee && peakSeasonFee.fee > 0) this.seasonalFeePerWeek = peakSeasonFee.fee;
    const minorManagementFee = fees.find((fee) => fee.name === '未成年管理费'); if (minorManagementFee && minorManagementFee.fee > 0) this.minorManagementFeePerPeriod = minorManagementFee.fee;
  }

  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; this.showAllPhotos = false; }
  calculateQuote(): void { this.quoteCalculated = true; }
  openDatePicker(event: Event): void {
    const input = event.currentTarget as HTMLInputElement | null;
    if (!input || typeof input.showPicker !== 'function') return;
    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }
  scrollToSection(target: string, event?: Event): void { event?.preventDefault(); const targetElement = document.getElementById(target); if (!targetElement) return; const headerOffset = window.innerWidth <= 680 ? 132 : 92; const targetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset; window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' }); window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${target}`); }
  get filteredGalleryImages(): GalleryImage[] {
    if (this.selectedGalleryCategory !== '全部') return this.galleryImages.filter(image => image.category === this.selectedGalleryCategory);
    if (this.showAllPhotos) return this.galleryImages;
    const featured = this.galleryImages.filter(image => image.featured);
    return (featured.length ? featured : this.galleryImages).slice(0, EV_GALLERY_FEATURED_COUNT);
  }
  get hiddenPhotoCount(): number {
    return this.selectedGalleryCategory === '全部' && !this.showAllPhotos ? this.galleryImages.length - this.filteredGalleryImages.length : 0;
  }
  /** Fee tables already group courses by mode, so drop the repeated mode suffix there. */
  shortCourseName(name: string): string { return name.replace(/（半?斯巴达）$/, ''); }
  get spartaCourseFees(): CourseFee[] { return this.courseFees.filter((course) => course.id.startsWith('sparta-')); }
  get semiSpartaCourseFees(): CourseFee[] { return this.courseFees.filter((course) => course.id.startsWith('semi-sparta-')); }
  get selectedCourseId(): string { return this.courseSelections[0].optionId; }
  set selectedCourseId(value: string) { this.updateSelection('course', this.courseSelections[0].id, { optionId: value }); }
  get selectedRoomId(): string { return this.roomSelections[0].optionId; }
  set selectedRoomId(value: string) { this.updateSelection('room', this.roomSelections[0].id, { optionId: value }); }
  get selectedWeeks(): number { return this.totalWeeks; }
  set selectedWeeks(value: number) {
    this.updateSelection('course', this.courseSelections[0].id, { weeks: value });
  }
  get selectedStartDate(): string { return this.courseSelections[0].startDate; }
  set selectedStartDate(value: string) {
    this.quotePlan.updateStartDate('course', this.courseSelections[0].id, value);
  }
  get selectedCourse(): CourseFee { return this.courseFees.find((course) => course.id === this.selectedCourseId) ?? this.courseFees[0]; }
  get selectedRoom(): RoomFee { return this.roomFees.find((room) => room.id === this.selectedRoomId) ?? this.roomFees[this.roomFees.length - 1]; }
  get totalWeeks(): number { return this.courseSelections.reduce((sum, row) => sum + row.weeks, 0); }
  get roomTotalWeeks(): number { return this.roomSelections.reduce((sum, row) => sum + row.weeks, 0); }
  get isCombinedPlan(): boolean { return this.courseSelections.length > 1 || this.roomSelections.length > 1 || this.dateCoverageMismatch; }
  get quoteScope(): string {
    if (this.quoteMode === 'single') return `${this.totalWeeks}周`;
    const students = this.activeStudents;
    const courseWeeks = [...new Set(students.map(student => student.calculator.plan.courseWeeks))];
    return courseWeeks.length === 1
      ? `${students.length}人·每人${courseWeeks[0]}周`
      : `${students.length}人·不同周数`;
  }
  get quoteHeading(): string { return `EV主校区${this.quoteMode === 'group' ? ' ' : ''}${this.quoteScope}报价`; }
  get durationMismatch(): boolean { return this.totalWeeks !== this.roomTotalWeeks; }

  private validDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const timestamp = Date.parse(`${value}T00:00:00Z`);
    return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value;
  }
  private dateAt(value: string, days: number): string {
    return this.validDate(value) ? new Date(Date.parse(`${value}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10) : '';
  }
  private weekDates(rows: QuoteSelection[]): Set<string> {
    return new Set(rows.filter(row => this.validDate(row.startDate)).flatMap(row =>
      Array.from({ length: row.weeks }, (_, week) =>
        Array.from({ length: 7 }, (_day, day) => this.dateAt(row.startDate, week * 7 + day))).flat()));
  }
  get validSundayStart(): boolean {
    return [...this.courseSelections, ...this.roomSelections].every(row =>
      this.validDate(row.startDate) && new Date(`${row.startDate}T00:00:00Z`).getUTCDay() === 0);
  }
  get dateCoverageMismatch(): boolean {
    const courses = this.weekDates(this.courseSelections);
    const rooms = this.weekDates(this.roomSelections);
    return courses.size !== rooms.size || [...courses].some(date => !rooms.has(date));
  }
  get hasOverlappingRows(): boolean {
    return this.weekDates(this.courseSelections).size < this.totalWeeks * 7 || this.weekDates(this.roomSelections).size < this.roomTotalWeeks * 7;
  }
  get stayWeeks(): number {
    const dates = [...this.weekDates([...this.courseSelections, ...this.roomSelections])].sort();
    return dates.length ? Math.ceil((Date.parse(dates[dates.length - 1]) - Date.parse(dates[0]) + 86400000) / 604800000) : 0;
  }
  get planStartDate(): string {
    return [...this.courseSelections, ...this.roomSelections].map(row => row.startDate).filter(date => this.validDate(date)).sort()[0] ?? '';
  }
  get firstPlanError(): string {
    if (![...this.courseSelections, ...this.roomSelections].every(row => Number.isInteger(row.weeks) && row.weeks >= 1 && row.weeks <= this.maxQuoteWeeks)) return '每条课程和住宿都需要选择1至24周。';
    if (this.totalWeeks > this.maxQuoteWeeks || this.roomTotalWeeks > this.maxQuoteWeeks) return '课程和住宿分别最多安排24周，请调整周数。';
    if (!this.validSundayStart) return '每条课程和住宿都需要选择有效的周日开始日期。';
    if (this.hasOverlappingRows) return '课程清单或住宿清单中有日期重叠，请调整后再保存报价单，避免重复计费。';
    if (this.stayWeeks > this.maxQuoteWeeks) return '从最早开始至最晚结束不能超过24周，请调整日期或周数。';
    return '';
  }
  get planError(): string {
    if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。';
    const index = this.activeStudents.findIndex(student => !!student.calculator.error);
    return index < 0 ? '' : `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].calculator.error}`;
  }
  get canExportQuote(): boolean { return !this.planError; }
  private selections(kind: QuoteListKind): QuoteSelection[] { return kind === 'course' ? this.courseSelections : this.roomSelections; }
  canAddSelection(kind: QuoteListKind): boolean { return this.quotePlan.canAdd(kind); }
  addSelection(kind: QuoteListKind): void {
    this.quotePlan.add(kind);
  }
  removeSelection(kind: QuoteListKind, id: number): void {
    this.quotePlan.remove(kind, id);
  }
  updateSelection(kind: QuoteListKind, id: number, changes: Partial<Pick<QuoteSelection, 'weeks' | 'optionId' | 'startDate'>>): void {
    const row = this.selections(kind).find(item => item.id === id);
    if (!row) return;
    const validOptions = kind === 'course' ? this.courseFees : this.roomFees;
    if (changes.optionId !== undefined && validOptions.some(option => option.id === changes.optionId)) row.optionId = changes.optionId;
    if (changes.weeks !== undefined) this.quotePlan.updateWeeks(kind, id, changes.weeks);
    if (changes.startDate !== undefined) this.quotePlan.updateStartDate(kind, id, changes.startDate);
  }
  selectionWeekOptions(kind: QuoteListKind, row: QuoteSelection): number[] {
    const total = this.selections(kind).reduce((sum, item) => sum + item.weeks, 0);
    return this.weekOptions.filter(weeks => total - row.weeks + weeks <= this.maxQuoteWeeks);
  }
  trackSelection(_index: number, row: QuoteSelection): number { return row.id; }
  private quoteRows(kind: QuoteListKind) {
    return this.selections(kind).map((row, index) => {
      const course = kind === 'course' ? this.courseFees.find(option => option.id === row.optionId)! : null;
      const room = kind === 'room' ? this.roomFees.find(option => option.id === row.optionId)! : null;
      const startDateText = this.validDate(row.startDate) ? row.startDate.replace(/-/g, '/') : '待确认';
      const endDate = this.dateAt(row.startDate, row.weeks * 7 - 1).replace(/-/g, '/') || '待确认';
      return { ...row, index: index + 1, name: course?.name ?? room!.name, details: course?.suitable ?? room!.note,
        startDateText, endDate, dateRange: `${startDateText}–${endDate}`,
        amount: this.quotePlan.price(kind, row) };
    });
  }
  get courseQuoteRows() { return this.quoteRows('course'); }
  get roomQuoteRows() { return this.quoteRows('room'); }
  get quoteLists() {
    return [
      { kind: 'course' as const, title: '课程', rows: this.courseQuoteRows, options: this.courseFees as Array<{ id: string; name: string }>, weeks: this.totalWeeks },
      { kind: 'room' as const, title: '住宿', rows: this.roomQuoteRows, options: this.roomFees as Array<{ id: string; name: string }>, weeks: this.roomTotalWeeks },
    ];
  }
  trackQuoteList(_index: number, list: { kind: QuoteListKind }): string { return list.kind; }
  get tuitionForSelectedWeeks(): number { return this.courseQuoteRows.reduce((sum, row) => sum + row.amount, 0); }
  get roomFeeForSelectedWeeks(): number { return this.roomQuoteRows.reduce((sum, row) => sum + row.amount, 0); }
  get discountBase(): number { return this.tuitionForSelectedWeeks + this.roomFeeForSelectedWeeks; }
  get discountAmount(): number { return this.discountBase * (1 - this.discount); }
  get discountedCourseAndRoom(): number { return this.discountBase * this.discount; }
  get peakSeasonWeeks(): number { return this.calculator.peakWeeks; }
  get isPeakSeason(): boolean { return this.peakSeasonWeeks > 0; }
  get seasonalSurcharge(): number { return this.calculator.peakSurcharge; }
  get seasonalFeePerFourWeeks(): number { return (this.calculator.peakCalculation.breakdown[0]?.rate ?? this.seasonalFeePerWeek) * 4; }
  get minorManagementPeriods(): number { return this.isMinorStudent ? Math.ceil(this.totalWeeks / 4) : 0; }
  get minorManagementFee(): number { return this.minorManagementPeriods * this.minorManagementFeePerPeriod; }
  get quoteUsd(): number { return this.activeStudents.reduce((sum, student) => sum + student.calculator.totalUsd, 0); }
  get quoteUsdText(): string { return `${this.formatUsd(this.quoteUsd)} 美元`; }
  get quoteCnyText(): string { const rounded = Math.round(this.quoteUsd * this.usdToCny); return `约 ${rounded.toLocaleString('zh-CN')} 元人民币`; }
  get exchangeRateText(): string { return this.exchangeRateLive && this.exchangeRateDate ? `参考汇率日期 ${this.exchangeRateDate}` : '最新参考汇率待更新'; }
  get discountText(): string {
    return this.discountPercent > 0 ? `课程费和住宿费按${100 - this.discountPercent}%计费；旺季附加费不参与折扣` : '当前没有百分比折扣';
  }
  get visaExtensionCount(): number { return this.calculator.visaExtensionCount; }
  get visaExtensionFeeTotal(): number { return this.calculator.visaExtensionTotal; }
  get onCampusRoomWeeks(): number { return this.roomSelections.filter(row => !row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get offCampusRoomWeeks(): number { return this.roomSelections.filter(row => row.optionId.startsWith('off-campus')).reduce((sum, row) => sum + row.weeks, 0); }
  get roomDeposit(): number { return this.calculator.roomDeposit; }
  get localFees(): LocalFee[] {
    return groupLocalFees(this.activeStudents.map(student => ({ localFees: student.calculator.localFees })))
      .map(fee => ({ item: fee.item, amount: fee.unitLabel, quantity: fee.quantity, total: fee.total, note: fee.note }));
  }
  get includedLocalFees(): LocalFee[] { return this.localFees; }
  get excludedLocalFees(): LocalFee[] {
    const pickupRule = this.localFeeRules.find(item => item.id === 'cebu-pickup' && item.enabled);
    const depositRule = this.localFeeRules.find(item => item.id === 'room-deposit' && item.enabled);
    const pickupCount = this.activeStudents.filter(student => student.calculator.pickup !== 'none').length;
    const pickup = this.activeStudents.reduce((sum, student) => sum + student.calculator.pickupAmount, 0);
    const deposit = this.activeStudents.reduce((sum, student) => sum + student.calculator.roomDeposit, 0);
    return [
      ...(pickupRule ? [{ item: pickupRule.name, amount: `${pickupRule.amount.toLocaleString()} 比索／人`, quantity: pickupCount, total: pickup, note: `${pickupCount ? `本次${pickupCount}人选择接机` : '本次无人选择接机'}；${pickupRule.note}`, excluded: true }] : []),
      ...(depositRule ? [{ item: depositRule.name, amount: '按个人停留周数', quantity: this.activeStudents.length, total: deposit, note: depositRule.note, excluded: true }] : []),
    ];
  }
  get localFeesTotal(): number { return this.localFees.filter((fee) => !fee.excluded).reduce((sum, fee) => sum + fee.total, 0); }
  get localFeesCnyText(): string { return `约 ${quoteCurrencyText(Math.round(this.localFeesTotal / this.phpPerCny), 'zh-CN')} 元`; }
  get localFeeEstimateNote(): string {
    return this.localFeeIntro;
  }
  readonly paymentDeadlineNote = '1、学费部分需在到校前2周交齐，可交由思达游学代收，或自行直接向学校转付美元；本报价单所列学校费用即为最终价格，人民币支付时按照支付宝最新参考汇率将美元换算为人民币结算。';
  get registrationTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.registration, 0); }
  get tuitionTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.tuition, 0); }
  get accommodationTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.accommodation, 0); }
  get discountTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.discountAmount, 0); }
  get peakTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.peakSurcharge, 0); }
  get minorTotal() { return this.activeStudents.reduce((sum, student) => sum + student.calculator.minorFee, 0); }
  studentSubtotal(student: EvStudentQuote) { return student.calculator.totalUsd; }
  get schoolPaymentItems() {
    const chargedRegistrations = this.activeStudents.filter(student => student.calculator.registration > 0).length;
    const minors = this.activeStudents.filter(student => student.calculator.isMinorStudent).length;
    const discountRule = this.promotionRules.find(item => item.id === 'ev-sida-95' && item.enabled);
    const returningRule = this.promotionRules.find(item => item.id === 'ev-returning-registration');
    const peakNote = this.peakTotal
      ? `${this.peakSeasonDateRange}，按各学生实际覆盖周数计收；2027年60美元／周，同一周课程与住宿只计一次，不参与折扣。`
      : `当前方案未覆盖旺季；2027年旺季为${this.peakSeasonDateRange}，适用时每周60美元。`;
    const minorNote = this.minorTotal
      ? `${minors}名未成年学生适用；每4周${this.minorManagementFeePerPeriod}美元，不足4周按一期。`
      : `当前方案无未成年学生；未满18岁时每4周${this.minorManagementFeePerPeriod}美元，不足4周按一期。`;
    return [
      { label: '注册费', amount: `${this.formatUsd(this.registrationTotal)} 美元`, note: `${this.quoteImageSettings.paymentNotes.registration}；本次计收${chargedRegistrations}人${chargedRegistrations < this.activeStudents.length ? `，${this.activeStudents.length - chargedRegistrations}人按“${returningRule?.name ?? '老学员规则'}”免收` : ''}` },
      { label: '课程费合计', amount: `${this.formatUsd(this.tuitionTotal)} 美元`, note: '按每位学生实际选择的课程和日期计算。' },
      { label: '住宿费合计', amount: `${this.formatUsd(this.accommodationTotal)} 美元`, note: '按每位学生实际选择的房型和日期计算。' },
      ...(this.peakSeasonRanges.some(item => item.enabled)
        ? [{ label: '旺季附加费', amount: `${this.formatUsd(this.peakTotal)} 美元`, note: peakNote }]
        : []),
      ...(discountRule
        ? [{ label: discountRule.name, amount: `− ${this.formatUsd(this.discountTotal)} 美元`, note: discountRule.description }]
        : []),
      { label: '未成年管理费', amount: `${this.formatUsd(this.minorTotal)} 美元`, note: minorNote },
    ];
  }
  get quoteRuleNotes(): string[] { return []; }
  get quoteImageData() {
    const layoutWeeks = this.activeStudents[0]?.calculator.plan.courseWeeks ?? 0;
    const includedFees = this.includedLocalFees;
    const optionalFees = this.excludedLocalFees;
    const courseItems: QuoteImagePaymentItem[] = [], roomItems: QuoteImagePaymentItem[] = [];
    this.activeStudents.forEach((student, index) => {
      const prefix = this.quoteMode === 'group' ? `学生${index + 1} · ` : '';
      student.calculator.paymentRows.filter(row => row.icon === '课').forEach(row => courseItems.push({ ...row, label: `${prefix}${row.label}`, note: [row.note, this.quoteImageSettings.paymentNotes.course].filter(Boolean).join('；') }));
      student.calculator.paymentRows.filter(row => row.icon === '宿').forEach(row => roomItems.push({ ...row, label: `${prefix}${row.label}`, note: [row.note, this.quoteImageSettings.paymentNotes.accommodation].filter(Boolean).join('；') }));
    });
    const discountRule = this.promotionRules.find(item => item.id === 'ev-sida-95' && item.enabled);
    const paymentItems: QuoteImagePaymentItem[] = [
      { icon: '注', label: '注册费', amount: `${this.formatUsd(this.registrationTotal)} 美元`, note: this.schoolPaymentItems[0].note },
      ...courseItems, ...roomItems,
      ...(this.peakTotal ? [{ icon: '旺', label: '旺季附加费', amount: `${this.formatUsd(this.peakTotal)} 美元`, note: this.schoolPaymentItems.find(item => item.label === '旺季附加费')!.note }] : []),
      ...(this.discountTotal ? [{ icon: '折', label: discountRule?.name ?? '思达折扣', amount: `− ${this.formatUsd(this.discountTotal)} 美元`, note: [discountRule?.description, this.quoteImageSettings.paymentNotes.promotion].filter(Boolean).join('；'), accent: true }] : []),
      ...(this.minorTotal ? [{ icon: '未', label: '未成年管理费', amount: `${this.formatUsd(this.minorTotal)} 美元`, note: this.schoolPaymentItems.find(item => item.label === '未成年管理费')!.note }] : []),
    ];
    const startDate = this.activeStudents.map(student => student.calculator.plan.startDate).filter(Boolean).sort()[0] ?? '';

    const quote = buildPhilippinesDetailedQuote({
      schoolCode: 'EV主校区',
      schoolName: '菲律宾宿务EV Academy',
      filePrefix: 'EV',
      heroSrc: '/assets/ev/campus-exterior.webp',
      weeks: layoutWeeks,
      startDate,
      usdToCny: this.usdToCny,
      totalUsd: this.quoteUsd,
      fullFeeDetails: true,
      localCurrencyName: '比索',
      paymentItems,
      localFeeItems: includedFees.map((fee) => {
        const id = this.localFeeRules.find(rule => rule.name === fee.item)?.id ?? '';
        return { label: fee.item, unit: fee.amount, quantity: String(fee.quantity), amount: this.formatPhp(fee.total), note: this.quoteImageSettings.localFeeNotes[id] || fee.note };
      }),
      localFeeTotal: this.localFeesTotal,
      localFeeCny: Math.round(this.localFeesTotal / this.phpPerCny),
      localFeeTableLayout: 'web',
      localFeeNote: this.quoteImageSettings.localFeeIntro,
      optionalFeeItems: optionalFees.map((fee) => {
        const id = this.localFeeRules.find(rule => rule.name === fee.item)?.id ?? '';
        return { label: fee.item, amount: this.formatPhp(fee.total), cnyAmount: `人民币预计约 ${quoteCurrencyText(Math.round(fee.total / this.phpPerCny), 'zh-CN')} 元`, note: this.quoteImageSettings.localFeeNotes[id] || fee.note };
      }),
      ruleNotes: [...this.quoteRuleNotes, ...this.quoteImageSettings.footerNotes],
    });
    const importantNotes = [...this.quoteRuleNotes, ...this.quoteImageSettings.footerNotes];
    const editedQuote = applyEditableQuoteImageCopy(quote, this.quoteImageSettings, this.promotionRules, this.localFeeRules);
    const result = applySchoolQuoteImageLayout({ ...editedQuote, importantNotes }, 'EV主校区', layoutWeeks, startDate, this.quoteUsd, this.usdToCny);
    return {
      ...result,
      title: this.quoteScope,
      headingText: this.quoteHeading,
      fileName: `${this.quoteHeading}-${startDate.replace(/-/g, '')}.png`,
      paymentSectionTitle: this.quoteImageSettings.paymentSectionTitle,
      localFeeTitle: this.quoteImageSettings.localFeeSectionTitle,
      serviceSectionTitle: this.quoteImageSettings.serviceSectionTitle,
      benefitItems: this.quoteImageSettings.benefits,
      serviceLocations: this.quoteImageSettings.serviceLocations,
      alumniBenefitTitle: this.quoteImageSettings.alumniBenefitTitle,
      alumniBenefitItems: [{ title: this.quoteImageSettings.alumniBenefitTitle, subtitle: '', text: this.quoteImageSettings.alumniBenefitText }],
      noteTitle: this.quoteImageSettings.noteSectionTitle,
      importantNotes,
      conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.exchangeRateLive ? this.exchangeRateDate : undefined },
    };
  }
  previewFeeId(name: string): string {
    return this.localFeeRules.find(item => item.name === name)?.id ?? 'local-fees';
  }
  previewPaymentTarget(item: { label: string; amount: string; note: string }): CiaPreviewTarget {
    if (item.label === '课程费合计') return { kind: 'course', id: this.selectedCourseId };
    if (item.label === '住宿费合计') return { kind: 'room', id: this.selectedRoomId };
    if (item.label === '注册费') return { kind: 'section', id: 'quote-registration' };
    if (item.label === '旺季附加费') return { kind: 'section', id: 'quote-season' };
    if (item.label === '未成年管理费') return { kind: 'section', id: 'quote-breakdown' };
    const promotion = this.promotionRules.find(rule => item.label.includes(rule.name) || item.note.includes(rule.description));
    return promotion ? { kind: 'promotion', id: promotion.id } : { kind: 'section', id: 'quote-breakdown' };
  }
  formatUsd(value: number): string { if (!Number.isFinite(value)) return '汇率待更新'; const roundedValue = Math.round((value + Number.EPSILON) * 100) / 100; return roundedValue.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(roundedValue) ? 0 : 1, maximumFractionDigits: 2 }); }
  formatPhp(value: number): string { if (!Number.isFinite(value)) return '汇率待更新'; return `${value.toLocaleString('en-US')} 比索`; }
  formatFeeQuantity(value: number): string { return value.toLocaleString('zh-CN', { maximumFractionDigits: 2 }); }
  private parseLocalDate(value: string): Date | null { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null; }
  private createCourseId(name: string): string {
    const lower = name.toLowerCase();
    const speaking = (level: '6' | '8') => name.includes(`强化口说${level}`) || name.includes(`口语强化${level}`) || name.includes(`Power Speaking ${level}`);
    const toeic = name.includes('多益') || name.includes('托业') || lower.includes('toeic');
    if (name.includes('半斯巴达')) {
      if (speaking('6')) return 'semi-sparta-power-speaking-6';
      if (speaking('8')) return 'semi-sparta-power-speaking-8';
      if (toeic) return 'semi-sparta-toeic';
      if (name.includes('商务') || lower.includes('business')) return 'semi-sparta-business';
      if (name.includes('社交媒体')) return 'semi-sparta-social-media-english';
      if (name.includes('综合英语') || lower.includes('esl')) return 'semi-sparta-esl';
    }
    if (name.includes('斯巴达') || lower.includes('sparta')) {
      if (name.includes('Intensive ESL') || name.includes('强化英语') || name.includes('密集ESL')) return 'sparta-intensive-esl';
      if (speaking('6')) return 'sparta-power-speaking-6';
      if (speaking('8')) return 'sparta-power-speaking-8';
      if (name.includes('雅思保证') || name.includes('雅思保分')) return 'sparta-ielts-guarantee';
      if (name.includes('雅思') || lower.includes('ielts')) return 'sparta-ielts-regular';
      if (toeic) return 'sparta-toeic';
      if (name.includes('社交媒体')) return 'sparta-social-media-english';
      if (name.includes('商务') || name.toLowerCase().includes('business')) return 'sparta-business';
    }
    return this.slugifyPriceKey(name);
  }
  private slugifyPriceKey(value: string): string { return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  private createRoomId(name: string): string { if (name.includes('四人间（上下铺）')) return 'quad-bunk'; if (name.includes('校外公寓单')) return 'off-campus-single'; if (name.includes('校外公寓双')) return 'off-campus-double'; if (name.includes('单人') || name.includes('单间')) return 'single'; if (name.includes('双人')) return 'double'; if (name.includes('三人')) return 'triple'; if (name.includes('四人')) return 'quad-bunk'; return this.slugifyPriceKey(name); }

  private readonly quoteRateSync = connectQuoteRates(this, inject(ExchangeRateService));
  readonly quoteCurrencyText = quoteCurrencyText;
}
