import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, switchMap } from 'rxjs';
import { SchoolPhotoDTO } from '../../../../interfaces/school-photo.dto';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { SchoolService } from '../../../../services/school.service';
import { buildPhilippinesDetailedQuote } from '../../../components/philippines-quote-image-data';
import { QuoteImageDownloadButtonComponent, QuoteImagePaymentItem } from '../../../components/quote-image-download-button.component';
import { groupLocalFees, groupPaymentLines } from '../../../components/school-group-quote';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { applySchoolQuoteImageLayout, quoteMoney } from '../../../components/school-quote-plan';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { CiaContentConfig, CiaLocalFeeRule, CiaQuoteImageSettings } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { cloneImsContentConfig, createDefaultImsContentConfig } from './ims-content-config';
import {
  IMS_ADDITIONAL_CLASSES, IMS_COURSES, IMS_LONG_STAY_DISCOUNTS, IMS_OFF_SEASON_CLASS_EXCHANGE_PERIODS,
  IMS_OFF_SEASON_SOCIAL_REQUIREMENTS, IMS_PHP_PER_CNY, IMS_REGISTRATION_FEE, IMS_ROOMS, IMS_SIDA_RATE,
  IMS_WEEK_OPTIONS, ImsCourse, ImsRoom,
} from './ims-pricing';
import { ImsBlockPromotion, ImsStudentQuote, validateImsFamily } from './ims-student-quote';

type GalleryCategory = '全部' | '校园' | '教室' | '住宿' | '活动';
interface GalleryItem { category: Exclude<GalleryCategory, '全部'>; title: string; description: string; src: string; contentType?: string; }
interface InfoCard { icon?: string; title: string; text: string; }

@Component({
  selector: 'app-ims-school', standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule, SidaWhySectionComponent, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], templateUrl: './ims-school.component.html',
  styleUrls: ['../cebu-school-detail-layout.css', '../cebu-school-detail-content.css', '../cebu-school-detail-responsive.css', '../ev-school/ev-school-detail.component.css', '../school-quote-rollout.css', '../philippines-local-fee-table.css', '../../../components/school-group-quote.css', './ims-school.component.css'],
})
export class ImsSchoolComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly schoolContentService = inject(SchoolContentService);
  private readonly exchangeRateService = inject(ExchangeRateService);
  private readonly route = inject(ActivatedRoute);
  private readonly previewHost = inject(ElementRef<HTMLElement>);
  private readonly initialContent = createDefaultImsContentConfig();
  private currentContentConfig = cloneImsContentConfig(this.initialContent);
  private previewContent?: CiaContentConfig;
  private previewTarget?: CiaPreviewTarget;
  private previewHighlightTarget?: CiaPreviewTarget;
  private previewFocusTimer?: ReturnType<typeof setTimeout>;

  readonly isEditorPreview = typeof window !== 'undefined' && window.parent !== window && this.route.snapshot.queryParamMap.get('contentPreview') === '1';
  readonly contentConfig = () => this.currentContentConfig;
  readonly weekOptions = IMS_WEEK_OPTIONS;
  additionalClassOptions: Array<{ id: string; name: string; price4w: number }> = IMS_ADDITIONAL_CLASSES.map((item) => ({ ...item }));
  readonly socialRequirements = IMS_OFF_SEASON_SOCIAL_REQUIREMENTS;
  readonly classExchangePeriods = IMS_OFF_SEASON_CLASS_EXCHANGE_PERIODS;
  readonly galleryCategories: GalleryCategory[] = ['全部', '校园', '教室', '住宿', '活动'];
  selectedGalleryCategory: GalleryCategory = '全部';
  courses: ImsCourse[] = IMS_COURSES.map((item) => ({ ...item, prices: { ...item.prices }, allowedWeeks: [...item.allowedWeeks] }));
  rooms: ImsRoom[] = IMS_ROOMS.map((item) => ({ ...item, prices: { ...item.prices } }));
  registrationFee = IMS_REGISTRATION_FEE;
  sidaRate = IMS_SIDA_RATE;
  lowSeasonPerBlock = 300;
  longStayDiscounts: Array<{ min: number; max: number; amount: number }> = IMS_LONG_STAY_DISCOUNTS.map((item) => ({ ...item }));
  localFeeRules: CiaLocalFeeRule[] = structuredClone(this.currentContentConfig.localFees);
  guardianServiceRate = 450;
  schoolManagementRate = 2100;
  quoteImageSettings: CiaQuoteImageSettings = structuredClone(this.currentContentConfig.quoteImageSettings);
  readonly students: ImsStudentQuote[] = [new ImsStudentQuote(this)];
  quoteMode: 'single' | 'group' = 'single';
  private requestedStudentCount = 2;
  quoteCalculated = false;
  usdToCny = 7.2;
  readonly phpPerCny = IMS_PHP_PER_CNY;
  exchangeRateDate = '';
  usingLiveExchangeRate = false;

  readonly quickInfo: InfoCard[] = [
    { icon: 'location_city', title: 'Banilad城市校区', text: '位于宿务市Banilad / Maria Luisa生活圈，上课、住宿和学生服务集中。' },
    { icon: 'groups', title: '约153人住宿容量', text: '资料列课堂容量约180人，适合成人、考试、青少年及亲子共同安排。' },
    { icon: 'schedule', title: '45分钟课堂', text: '一对一与团体课每节45分钟，课间10分钟；按课程选择每天课量。' },
    { icon: 'home_work', title: '校内1–4人房', text: '住宿费与课程费分开报价，并使用1、2、3、4、8、12、16、20、24周明确价格。' },
  ];
  readonly highlights: InfoCard[] = [
    { title: '完整课程路线', text: '从Essential、Premium、Intensive ESL，到Business、Working Holiday、IELTS、TOEIC、TOEFL、SAT、Senior与亲子课程。' },
    { title: '亲子关系按人核算', text: '家长和孩子分别注册、分别购买课程；Parents ESL的一对一转课不改变任何一方的学费或注册费。' },
    { title: '优惠逐段看得懂', text: '报价器把每个连续4周段的2+2、淡季立减资格、长期优惠和思达95折分开列出。' },
  ];
  readonly fitCards: InfoCard[] = [
    { title: '适合：课程目标不同的同行家庭', text: '成人、家长与孩子可以独立选课程、房型和日期，并明确亲子转课关系。' },
    { title: '适合：需要较多一对一的学生', text: 'Essential 4–6、Junior 6–9、SAT等课程可按目标选择不同一对一强度。' },
    { title: '先比较：想要海边度假校园', text: 'IMS是Banilad城市型校区，不是Mactan海边度假村型学校。' },
  ];
  readonly schedule = [
    { time: '07:00–08:00', title: '早餐与早间准备', text: '具体早课和测试安排以入学后的课程表为准。' },
    { time: '08:00–12:00', title: '上午课程', text: '一对一与团体课按课程组合交错安排，每节45分钟、课间10分钟。' },
    { time: '12:00–13:00', title: '午餐', text: '校内学生按学校餐厅安排；走读午餐为独立可选项目。' },
    { time: '13:00–17:50', title: '下午课程', text: '继续完成课程组合；保证班、考试课程和亲子课程按各自课表执行。' },
    { time: '晚间', title: '自习、活动与免费晚间托管', text: '免费晚间托管、Guardian Service和国际学生学校管理服务是不同项目，资格与内容须学校确认。' },
  ];
  readonly faqs = [
    { title: '注册费能用优惠免掉吗？', text: '不能。每名注册学生一次性100美元，包括家长和孩子；学校活动、思达95折、返校状态和其他促销都不能减少注册费。' },
    { title: '2+2是不是四周价格除以二？', text: '不是。必须分别使用所选课程明确2周课程价和所选房型明确2周住宿价；同一次连续学习最多参加一次。' },
    { title: '第一段2+2，第二段减300美元可以吗？', text: '可以，只要两个4周段分别符合资格。同一个4周段不能同时选择两项活动。' },
    { title: '家长可以只陪读不上课吗？', text: '不能。亲子报名家长必须注册并购买Parents ESL；不想上3节一对一时，可按规则转给选择Junior ESL 6的孩子。' },
    { title: '当地费用合计包含什么？', text: '官方TOTAL AMOUNT包含SSP、E-Card、教材、学生证、可退押金、水电空调、适用的签证延长、9周起ACR I-Card和一次接机；送机、走读午餐、超额用电与额外课程另列。' },
  ];
  private readonly builtInGallery: GalleryItem[] = [
    { category: '校园', title: 'IMS Banilad校园', description: '学校资料封面中的IMS城市校区与泳池景观。', src: '/assets/ims/campus-hero.webp' },
    { category: '校园', title: 'IMS师生与校园团队', description: '多国籍学生与校园团队实景。', src: '/assets/ims/campus-team.webp' },
    { category: '教室', title: '一对一与学习空间', description: '课程以一对一教学为核心，并配合团体互动与自习。', src: '/assets/ims/facility-classroom.webp' },
    { category: '校园', title: '泳池与公共设施', description: '校内公共活动空间，具体开放安排以学校管理为准。', src: '/assets/ims/facility-pool.webp' },
    { category: '校园', title: '运动设施', description: '校园运动与休闲设施参考。', src: '/assets/ims/facility-gym.webp' },
    { category: '住宿', title: '校内宿舍', description: '1–4人房按价目表独立计价，空房按日期与性别确认。', src: '/assets/ims/dorm-room.webp' },
    { category: '活动', title: '学生课外活动', description: '学校活动、城市体验与同学交流。', src: '/assets/ims/student-activities.webp' },
    { category: '活动', title: 'IMS学生社区', description: '毕业、活动与多国籍学生共同学习生活。', src: '/assets/ims/student-community.webp' },
  ];
  galleryItems: GalleryItem[] = this.builtInGallery.map((item) => ({ ...item }));

  ngOnInit(): void {
    this.applyContentConfig(this.readSessionPreview() ?? this.initialContent);
    this.loadPublishedContent();
    this.exchangeRateService.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe((rates) => {
      if (rates.usdToCny > 0) { this.usdToCny = rates.usdToCny; this.exchangeRateDate = rates.date; this.usingLiveExchangeRate = true; }
    });
  }
  ngAfterViewInit(): void { if (this.isEditorPreview) { this.previewHost.nativeElement.classList.add('ims-editor-preview'); window.parent.postMessage({ type: 'ims-content-ready' }, window.location.origin); } }
  ngOnDestroy(): void { clearTimeout(this.previewFocusTimer); }

  @HostListener('window:message', ['$event'])
  applyEditorPreview(event: MessageEvent): void {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data as { type?: string; content?: CiaContentConfig; target?: CiaPreviewTarget; scroll?: boolean };
    if (message?.type !== 'ims-content-preview' || !message.content) return;
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
    this.previewTarget = target; this.queuePreviewFocus(false);
    window.parent.postMessage({ type: 'ims-content-select', ...target }, window.location.origin);
  }
  isPreviewHighlighted(kind: string, id: string): boolean { return this.isEditorPreview && this.previewHighlightTarget?.kind === kind && this.previewHighlightTarget?.id === id; }
  private queuePreviewFocus(scroll: boolean): void {
    if (!this.isEditorPreview || !this.previewTarget) return;
    clearTimeout(this.previewFocusTimer);
    this.previewFocusTimer = setTimeout(() => {
      const target = this.previewTarget!; const result = resolveCiaPreviewTarget(this.previewHost.nativeElement, target); const fallback = result.elements[0]?.dataset;
      this.previewHighlightTarget = result.exact ? target : fallback ? { kind: 'section', id: fallback['ciaPreviewId'] ?? '' } : undefined;
      for (const element of result.elements) if (scroll) revealCiaPreviewElement(element);
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      const item = target.kind === 'course' ? this.previewContent?.courses.find((entry) => entry.id === target.id) : target.kind === 'room' ? this.previewContent?.rooms.find((entry) => entry.id === target.id) : target.kind === 'fee' ? this.previewContent?.localFees.find((entry) => entry.id === target.id) : target.kind === 'promotion' ? this.previewContent?.quoteSettings.promotions.find((entry) => entry.id === target.id) : undefined;
      const status = item?.enabled === false ? '此项已停用，公开页面不会显示；已定位到所属板块。' : result.exact ? '橙色框内就是对应的公开页面内容。' : '当前试算未显示此项，已定位到所属板块。';
      window.parent.postMessage({ type: 'ims-content-located', target, status }, window.location.origin);
    }, 80);
  }
  private readSessionPreview(): CiaContentConfig | null {
    if (typeof sessionStorage === 'undefined' || !this.isEditorPreview) return null;
    try { const raw = sessionStorage.getItem('ims-content-preview'); if (!raw) return null; const value = JSON.parse(raw) as CiaContentConfig; return value?.schemaVersion === 1 && value.schoolCode === 'IMS' ? value : null; } catch { return null; }
  }
  private loadPublishedContent(): void {
    this.schoolService.getSchools({ name: 'IMS' }).pipe(switchMap((schools) => {
      const school = schools.find((item) => item.name === '菲律宾宿务IMS Academy') ?? schools.find((item) => item.name.toLowerCase().includes('ims')) ?? schools[0];
      if (!school?.id) return EMPTY;
      return forkJoin({ published: this.schoolContentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))), photos: this.schoolService.getSchoolPhotos({ schoolId: school.id, isActive: true }).pipe(catchError(() => of([]))) });
    }), catchError(() => EMPTY)).subscribe(({ published, photos }) => {
      const preview = this.readSessionPreview(); if (preview) this.applyContentConfig(preview); else if (published?.content) this.applyContentConfig(published.content); this.applyGalleryPhotos(photos);
    });
  }
  private applyContentConfig(value: CiaContentConfig): void {
    if (value?.schemaVersion !== 1 || value.schoolCode !== 'IMS') return;
    const content = cloneImsContentConfig(value); this.currentContentConfig = content; this.previewContent = content;
    this.courses = content.courses.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map((item) => ({ id: item.id, name: item.name, category: (item.courseType || 'ESL') as ImsCourse['category'], schedule: item.schedule, suitable: item.suitable || item.note, prices: Object.fromEntries(Object.entries(item.feeByWeeks ?? { 4: item.tuition }).map(([weeks, amount]) => [Number(weeks), amount])) as ImsCourse['prices'], allowedWeeks: (item.allowedWeeks ?? Object.keys(item.feeByWeeks ?? { 4: item.tuition }).map(Number)) as ImsCourse['allowedWeeks'] }));
    this.rooms = content.rooms.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map((item) => ({ id: item.id, name: item.label || item.name, note: item.note, prices: Object.fromEntries(Object.entries(item.feeByWeeks ?? { 4: item.fee }).map(([weeks, amount]) => [Number(weeks), amount])) as ImsRoom['prices'] }));
    this.registrationFee = content.quoteSettings.registrationFee;
    const sida = content.quoteSettings.promotions.find((item) => item.enabled && item.ruleKind === 'ims-sida-95'); this.sidaRate = sida?.discountType === 'percentage' ? Math.max(0, 1 - sida.discountValue / 100) : 1;
    const low = content.quoteSettings.promotions.find((item) => item.enabled && item.ruleKind === 'ims-low-season-300'); this.lowSeasonPerBlock = low?.discountValue || 300;
    const long = content.quoteSettings.promotions.find((item) => item.enabled && item.ruleKind === 'ims-long-stay'); if (long?.discountTiers) this.longStayDiscounts = Object.entries(long.discountTiers).map(([min, amount], index, entries) => ({ min: Number(min), max: (Number(entries[index + 1]?.[0]) || 28) - 1, amount }));
    this.localFeeRules = content.localFees.filter((item) => item.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
    this.additionalClassOptions = IMS_ADDITIONAL_CLASSES.map((fallback) => {
      const rule = this.localFeeRules.find((item) => item.id === `additional-${fallback.id}`);
      return { ...fallback, price4w: rule?.amount ?? fallback.price4w };
    });
    this.guardianServiceRate = this.localFeeRules.find((item) => item.id === 'guardian-service')?.amount ?? 450;
    this.schoolManagementRate = this.localFeeRules.find((item) => item.id === 'school-management')?.amount ?? 2100;
    this.quoteImageSettings = structuredClone(content.quoteImageSettings);
    this.galleryItems = [...this.builtInGallery.map((item) => ({ ...item })), ...(content.media ?? []).filter((item) => item.isActive && !!item.url).sort((a, b) => a.displayOrder - b.displayOrder).map((item) => ({ category: this.resolveMediaCategory(item.category), title: item.caption || item.originalFileName || 'IMS校园媒体', description: item.altText || item.caption || 'IMS Academy实景内容', src: item.url, contentType: item.contentType }))];
    for (const student of this.students) { for (const row of student.quotePlan.courses) if (!this.courses.some((item) => item.id === row.optionId)) row.optionId = this.courses[0]?.id ?? ''; for (const row of student.quotePlan.rooms) if (!this.rooms.some((item) => item.id === row.optionId)) row.optionId = this.rooms[0]?.id ?? ''; }
  }
  private applyGalleryPhotos(photos: SchoolPhotoDTO[]): void {
    const urls = new Set(this.galleryItems.map((item) => item.src)); const uploaded = (photos ?? []).filter((item) => !!item.url && !urls.has(item.url)).map((item) => ({ category: this.resolveMediaCategory(item.category), title: item.caption || item.originalFileName || 'IMS校园媒体', description: item.altText || item.caption || 'IMS Academy实景内容', src: item.url ?? '', contentType: item.contentType })); if (uploaded.length) this.galleryItems = [...this.galleryItems, ...uploaded];
  }
  private resolveMediaCategory(category?: string): Exclude<GalleryCategory, '全部'> { const value = (category ?? '').toLowerCase(); if (value.includes('class') || value.includes('教室')) return '教室'; if (value.includes('room') || value.includes('dorm') || value.includes('住宿')) return '住宿'; if (value.includes('activity') || value.includes('活动')) return '活动'; return '校园'; }

  get filteredGalleryItems() { return this.selectedGalleryCategory === '全部' ? this.galleryItems : this.galleryItems.filter((item) => item.category === this.selectedGalleryCategory); }
  setGalleryCategory(category: GalleryCategory): void { this.selectedGalleryCategory = category; }
  get roomOptions() { return this.rooms; }
  get additionalClasses() { return this.additionalClassOptions; }
  get studentCount() { return this.requestedStudentCount; }
  set studentCount(value: number) { this.requestedStudentCount = Number(value); if (Number.isInteger(value) && value >= 2 && value <= 20) while (this.students.length < value) this.students.push(new ImsStudentQuote(this)); }
  setQuoteMode(mode: 'single' | 'group'): void { this.quoteMode = mode; if (mode === 'group') this.studentCount = this.requestedStudentCount; }
  get activeStudents() { return this.quoteMode === 'single' ? this.students.slice(0, 1) : this.students.slice(0, Math.max(2, Math.min(20, Math.floor(this.studentCount) || 2))); }
  trackStudent(_: number, student: ImsStudentQuote) { return student; }
  trackPromotionBlock(_: number, block: { key: string }) { return block.key; }
  get selectedWeeks() { return this.activeStudents[0]?.quotePlan.courseWeeks ?? 4; }
  get quoteStartDate() { return this.activeStudents.map((student) => student.firstCourseStart).filter(Boolean).sort()[0] ?? ''; }
  get quoteError(): string { if (this.quoteMode === 'group' && (!Number.isInteger(this.studentCount) || this.studentCount < 2 || this.studentCount > 20)) return '多人报价人数请选择2–20人的整数。'; const index = this.activeStudents.findIndex((student) => !!student.quoteError); if (index >= 0) return `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${this.activeStudents[index].quoteError}`; return validateImsFamily(this.activeStudents); }
  get quoteBeforeDiscounts() { return this.activeStudents.reduce((sum, item) => sum + item.registration + item.originalStudyStay + item.additionalClassTotal + item.optionalServiceTotal, 0); }
  get schoolDiscountAmount() { return this.activeStudents.reduce((sum, item) => sum + item.schoolDiscountAmount, 0); }
  get sidaDiscountAmount() { return this.activeStudents.reduce((sum, item) => sum + item.sidaDiscountAmount, 0); }
  get quoteUsd() { return this.activeStudents.reduce((sum, item) => sum + item.quoteUsd, 0); }
  get estimatedLocalFees() { return groupLocalFees(this.activeStudents); }
  get estimatedLocalFeeTotal() { return this.estimatedLocalFees.reduce((sum, item) => sum + item.total, 0); }
  get estimatedLocalFeeCny() { return Math.round(this.estimatedLocalFeeTotal / this.phpPerCny); }
  get quoteHeading() { return this.quoteMode === 'single' ? `IMS ${this.selectedWeeks}周报价` : `IMS ${this.activeStudents.length}人报价`; }
  get fourWeekStartingText() { return `${quoteMoney(100 + (700 + 650) * this.sidaRate)} 美元`; }
  get courseTableTitle() { return this.currentContentConfig.quoteSettings.courseTableTitle; }
  get courseTableNote() { return this.currentContentConfig.quoteSettings.courseTableNote; }
  get roomTableTitle() { return this.currentContentConfig.quoteSettings.roomTableTitle; }
  get roomTableNote() { return this.currentContentConfig.quoteSettings.roomTableNote; }
  get localFeeIntro() { return this.currentContentConfig.quoteSettings.localFeeIntro; }
  get groupClassNote() { return this.currentContentConfig.quoteSettings.groupClassNote; }
  promotionDescription(id: string) { return this.currentContentConfig.quoteSettings.promotions.find((item) => item.id === id)?.description ?? ''; }
  promotionChange(student: ImsStudentQuote, rowId: number, index: number, value: string): void { student.setPromotion(rowId, index, value as ImsBlockPromotion); this.quoteCalculated = false; }
  familyTargetOptions(parentIndex: number) { return this.activeStudents.map((student, index) => ({ student, index })).filter(({ student, index }) => index !== parentIndex && student.travelerRole === 'child'); }
  calculateQuote(): void { this.quoteCalculated = !this.quoteError; }
  scrollToSection(id: string, event?: Event): void { event?.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  formatUsd(value: number) { return `${quoteMoney(value)} 美元`; }
  formatPhp(value: number) { return `${value.toLocaleString('en-US', { maximumFractionDigits: 0 })} 比索`; }
  formatFeeQuantity(value: number) { return Number.isInteger(value) ? String(value) : value.toLocaleString('en-US', { maximumFractionDigits: 2 }); }
  get planPaymentItems(): QuoteImagePaymentItem[] { return this.activeStudents.flatMap((student, studentIndex) => student.quotePlan.paymentItems().map((item) => ({ ...item, label: `${this.quoteMode === 'group' ? `学生${studentIndex + 1} · ` : ''}${item.label}` }))); }
  get schoolPaymentItems(): QuoteImagePaymentItem[] { return [...this.planPaymentItems, ...groupPaymentLines(this.activeStudents, true), { icon: '注', label: '不可减免注册费', amount: this.formatUsd(this.activeStudents.length * this.registrationFee), note: `每人一次性${this.registrationFee}美元；任何活动、95折或返校状态均不能减少。` }]; }
  get optionalFeeItems() { return [
    { label: '超额空调用电', amount: '30 比索／kW', cnyAmount: '按实际用量结算', note: '基础空调费包含100kW／4周，超额部分才另收。' },
    { label: '免费晚间托管', amount: '资格待学校确认', cnyAmount: '不自动计入', note: '与Guardian Service、国际学生学校管理服务为三个独立项目。' },
    { label: 'Guardian Service', amount: `${quoteMoney(this.guardianServiceRate)} 美元／4周`, cnyAmount: '按选择计入美元总额', note: '独立可选服务，仅公布4周倍数价格。' },
    { label: '国际学生学校管理服务', amount: `${quoteMoney(this.schoolManagementRate)} 美元／4周`, cnyAmount: '按选择计入美元总额', note: '独立可选服务，仅公布4周倍数价格。' },
  ]; }
  get familyTransferNotes(): string[] { return this.activeStudents.flatMap((parent, index) => !parent.transferParentOneToOne ? [] : [`${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}家长仍注册并购买Parents ESL；3节一对一转给学生${parent.linkedStudentIndex + 1}的Junior ESL 6；家长1节团体课${parent.attendParentGroupClass ? '参加' : '自行放弃'}。`]); }
  get selectedPromotionNotes(): string[] {
    const blocks = this.activeStudents.flatMap((student, index) => student.promotionBlocks.filter((block) => block.promotion !== 'none').map((block) => `${this.quoteMode === 'group' ? `学生${index + 1}：` : ''}${block.startDate.replace(/-/g, '/')}–${block.endDate.replace(/-/g, '/')}使用${block.promotion === 'two-plus-two' ? '2+2达人活动（按明确2周课程价与2周房价）' : '淡季立减300美元'}。`));
    return this.activeStudents.some((student) => student.promotionBlocks.some((block) => block.promotion === 'two-plus-two'))
      ? [...blocks, ...this.socialRequirements.map((item) => `2+2要求：${item}`)] : blocks;
  }
  get quoteImageData() {
    const settings = this.quoteImageSettings;
    const quote = buildPhilippinesDetailedQuote({ schoolCode: 'IMS', schoolName: '菲律宾宿务IMS Academy', filePrefix: 'IMS', heroSrc: '/assets/ims/campus-hero.webp', weeks: this.selectedWeeks, startDate: this.quoteStartDate, usdToCny: this.usdToCny, totalUsd: this.quoteUsd, fullFeeDetails: true, localFeeTableLayout: 'web', paymentItems: this.schoolPaymentItems, localFeeItems: this.estimatedLocalFees.map((item) => ({ label: item.item, unit: item.unitLabel, quantity: this.formatFeeQuantity(item.quantity), amount: this.formatPhp(item.total), note: item.note })), localFeeTotal: this.estimatedLocalFeeTotal, localCurrencyName: '比索', localFeeCny: this.estimatedLocalFeeCny, localFeeNote: settings.localFeeIntro, optionalFeeItems: this.optionalFeeItems, ruleNotes: [...this.familyTransferNotes, ...this.selectedPromotionNotes] });
    const result = applySchoolQuoteImageLayout({ ...quote, importantNotes: [...this.familyTransferNotes, ...this.selectedPromotionNotes, ...settings.footerNotes] }, 'IMS', this.selectedWeeks, this.quoteStartDate, this.quoteUsd, this.usdToCny);
    return { ...result, headingText: this.quoteHeading, fileName: `${this.quoteHeading}-${this.quoteStartDate.replace(/-/g, '')}.png`, paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle, serviceSectionTitle: settings.serviceSectionTitle, benefitItems: settings.benefits, serviceLocations: settings.serviceLocations, alumniBenefitTitle: settings.alumniBenefitTitle, alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }], noteTitle: settings.noteSectionTitle, conversionRates: { usdToCny: this.usdToCny, phpPerCny: this.phpPerCny, date: this.usingLiveExchangeRate ? this.exchangeRateDate : undefined } };
  }
}
