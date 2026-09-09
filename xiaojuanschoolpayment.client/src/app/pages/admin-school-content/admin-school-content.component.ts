import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of, switchMap } from 'rxjs';
import { SchoolContentEditorDTO } from '../../../interfaces/school-content.dto';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { AuthService } from '../../../services/auth.service';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import {
  CiaContentConfig,
  CiaCourseContent,
  CiaLocalFeeRule,
  CiaMediaContent,
  CiaPeakSeasonRange,
  CiaPromotionRule,
  CiaRoomContent,
  cloneCiaContentConfig,
  createDefaultCiaContentConfig,
} from '../philippines/cia-school/cia-content-config';
import { CIA_PREVIEW_SECTIONS, CiaPreviewKind, CiaPreviewTarget, isCiaPreviewTarget } from '../philippines/cia-school/cia-content-preview';
import {
  clonePinesContentConfig,
  createDefaultPinesContentConfig,
} from '../philippines/pines-school/pines-content-config';
import {
  cloneMonolContentConfig,
  createDefaultMonolContentConfig,
} from '../philippines/monol-school/monol-content-config';
import {
  cloneEvContentConfig,
  createDefaultEvContentConfig,
} from '../philippines/ev-school/ev-content-config';
import {
  cloneSmeagContentConfig,
  createDefaultSmeagContentConfig,
} from '../philippines/smeag-capital-school/smeag-content-config';
import {
  clonePhilinterContentConfig,
  createDefaultPhilinterContentConfig,
} from '../philippines/philinter-school/philinter-content-config';
import {
  cloneCgBaniladContentConfig,
  createDefaultCgBaniladContentConfig,
} from '../philippines/cg-banilad-school/cg-banilad-content-config';
import {
  cloneCgSpartaContentConfig,
  createDefaultCgSpartaContentConfig,
} from '../philippines/cg-sparta-school/cg-sparta-content-config';
import {
  cloneCpiContentConfig,
  createDefaultCpiContentConfig,
} from '../philippines/cpi-school/cpi-content-config';
import {
  cloneBCebuContentConfig,
  createDefaultBCebuContentConfig,
} from '../philippines/bcebu-school/bcebu-content-config';
import {
  cloneCpilsContentConfig,
  createDefaultCpilsContentConfig,
} from '../philippines/cpils-school/cpils-content-config';
import {
  cloneGlcContentConfig,
  createDefaultGlcContentConfig,
} from '../philippines/glc-school/glc-content-config';
import {
  cloneIbreezeContentConfig,
  createDefaultIbreezeContentConfig,
} from '../philippines/ibreeze-school/ibreeze-content-config';
import {
  cloneAnjContentConfig,
  createDefaultAnjContentConfig,
} from '../philippines/anj-school/anj-content-config';
import {
  cloneBeciContentConfig,
  createDefaultBeciContentConfig,
} from '../philippines/beci-school/beci-content-config';
import {
  cloneJicContentConfig,
  createDefaultJicContentConfig,
} from '../philippines/jic-school/jic-content-config';
import { BeciCampus } from '../philippines/beci-quote/beci-pricing';
import { AdminSchoolPhotosComponent } from '../admin-school-photos/admin-school-photos.component';

type EditorTab = 'courses' | 'rooms' | 'fees' | 'rules' | 'media';

@Component({
  selector: 'app-admin-school-content',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, AdminSchoolPhotosComponent],
  templateUrl: './admin-school-content.component.html',
  styleUrl: './admin-school-content.component.css',
})
export class AdminSchoolContentComponent implements OnInit {
  @ViewChild('previewFrame') previewFrame?: ElementRef<HTMLIFrameElement>;

  private readonly ciaSchoolName = 'CIA Cebu International Academy';
  private readonly publicCiaPath = '/philippines-study/cebu/cia-cebu-international-academy';
  private readonly publicPinesPath = '/philippines-study/baguio/pines-international-academy';
  private readonly publicMonolPath = '/philippines-study/baguio/monol';
  private readonly publicEvPath = '/philippines-study/cebu/ev-academy';
  private readonly publicSmeagPath = '/philippines-study/cebu/smeag-capital';
  private readonly publicPhilinterPath = '/philippines-study/cebu/philinter-academy';
  private readonly publicCgBaniladPath = '/philippines-study/cebu/cg-academy-banilad-campus';
  private readonly publicCgSpartaPath = '/philippines-study/cebu/cg-academy-sparta-campus';
  private readonly publicCpiPath = '/philippines-study/cebu/cpi-cebu-pelis-institute';
  private readonly publicBCebuPath = '/philippines-study/cebu/bcebu';
  private readonly publicCpilsPath = '/philippines-study/cebu/cpils';
  private readonly publicGlcPath = '/philippines-study/cebu/global-language-cebu';
  private readonly publicIbreezePath = '/philippines-study/cebu/ibreeze';
  private readonly publicAnjPath = '/philippines-study/baguio/anj-e-edu-english-academy';
  private readonly publicBeciEopPath = '/philippines-study/baguio/beci-eop-campus';
  private readonly publicBeciSpartaPath = '/philippines-study/baguio/beci-sparta-campus';
  private readonly publicBeciCityPath = '/philippines-study/baguio/api-beci-city-campus';
  private readonly publicJicPath = '/philippines-study/baguio/baguio-jic';

  schools: SchoolDTO[] = [];
  schoolSearch = '';
  showSchoolResults = false;
  selectedSchool?: SchoolDTO;
  content: CiaContentConfig = createDefaultCiaContentConfig();
  editor?: SchoolContentEditorDTO<CiaContentConfig>;
  activeTab: EditorTab = 'courses';
  selectedCourseId = this.content.courses[0].id;
  selectedRoomId = this.content.rooms[0].id;
  selectedFeeId = this.content.localFees[0].id;
  selectedPromotionId = this.content.quoteSettings.promotions[0].id;
  beciCampus: BeciCampus = 'eop';
  changeSummary = '';
  statusMessage = '';
  statusKind: 'success' | 'warning' | 'error' | '' = '';
  isLoading = true;
  isSaving = false;
  isPublishing = false;
  isSubmitting = false;
  previewUrl: SafeResourceUrl;
  previewTarget: CiaPreviewTarget = { kind: 'course', id: this.selectedCourseId };
  previewStatus = '正在加载对应位置…';
  private editorLoadFailed = false;
  private editorLoadStatus = 0;

  readonly tabs: Array<{ id: EditorTab; label: string; icon: string; anchor: string }> = [
    { id: 'courses', label: '课程与学费', icon: 'menu_book', anchor: 'course-fees' },
    { id: 'rooms', label: '住宿与规则', icon: 'bed', anchor: 'room-fees' },
    { id: 'fees', label: '当地杂费', icon: 'receipt_long', anchor: 'local-fees' },
    { id: 'rules', label: '报价规则与优惠', icon: 'percent', anchor: 'quote' },
    { id: 'media', label: '照片与视频', icon: 'perm_media', anchor: 'gallery' },
  ];

  readonly feeBillingOptions = [
    { value: 'once', label: '一次性收费' },
    { value: 'per-accommodation-period', label: '按住宿周期收费' },
    { value: 'per-course-period', label: '按课程周期收费' },
    { value: 'first-visa-extension', label: '首次续签时收费' },
    { value: 'long-term-or-first-extension', label: '长期签证或首次续签' },
    { value: 'visa-extension-schedule', label: '按续签次数阶梯收费' },
    { value: 'selected-manila-pickup', label: '选择马尼拉接机时收费' },
    { value: 'selected-clark-pickup', label: '选择克拉克接机时收费' },
    { value: 'optional', label: '参考费用，不计入合计' },
  ];

  constructor(
    private readonly schoolService: SchoolService,
    private readonly schoolContentService: SchoolContentService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
  ) {
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `${this.publicCiaPath}?contentPreview=1`,
    );
  }

  ngOnInit(): void {
    const requestedTab = this.route.snapshot.queryParamMap.get('tab') as EditorTab | null;
    if (requestedTab && this.tabs.some(tab => tab.id === requestedTab)) {
      this.activeTab = requestedTab;
    }
    const requestedCampus = this.route.snapshot.queryParamMap.get('campus');
    if (requestedCampus === 'eop' || requestedCampus === 'sparta' || requestedCampus === 'city') this.beciCampus = requestedCampus;
    this.loadSchools();
  }

  get canPublish(): boolean {
    return this.authService.getRoles().some(role => role.toLowerCase() === 'admin');
  }

  get filteredSchools(): SchoolDTO[] {
    const query = this.schoolSearch.trim().toLowerCase();
    return this.schools
      .filter(school => !query || school.name.toLowerCase().includes(query))
      .slice(0, 12);
  }

  isUnifiedSchoolOption(school: SchoolDTO): boolean {
    const name = school.name.toLowerCase().replace(/[.\s'&-]/g, '');
    return [
      'cia', 'pines', 'monol', 'evacademy', '宿务ev', 'smeagcapital', 'philinter',
      'cgacademybanilad', 'cgacademysparta', 'cpi', 'bcebu', 'cpils',
      'globallanguagecebu', '宿务glc', 'ibreeze', 'anjeedu', 'beci', 'jic',
    ].some(token => name.includes(token));
  }

  get isCiaSelected(): boolean {
    return !!this.selectedSchool && (
      this.selectedSchool.name === this.ciaSchoolName ||
      this.selectedSchool.name.toLowerCase().includes('cia')
    );
  }

  get isPinesSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('pines') || name.includes('碧瑶pines');
  }

  get isMonolSelected(): boolean {
    return !!this.selectedSchool?.name.toLowerCase().includes('monol');
  }

  get isEvSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name === 'ev academy' || name.includes('宿务ev') || name.includes('ev academy');
  }

  get isSmeagSelected(): boolean {
    return !!this.selectedSchool?.name.toLowerCase().includes('smeag capital');
  }

  get isPhilinterSelected(): boolean {
    return !!this.selectedSchool?.name.toLowerCase().includes('philinter');
  }

  get isCgBaniladSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('cg academy') && name.includes('banilad');
  }

  get isCgSpartaSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('cg academy') && name.includes('sparta');
  }

  get isCpiSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('cpi') && !name.includes('cpils');
  }

  get isBCebuSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes("b'cebu") || name.includes('bcebu') || name.includes("beci b'cebu");
  }

  get isCpilsSelected(): boolean {
    return !!this.selectedSchool?.name.toLowerCase().includes('cpils');
  }

  get isGlcSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('global language cebu') || name === 'glc' || name.includes('宿务glc');
  }

  get isIbreezeSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('i.breeze') || name.includes('ibreeze') || name.includes('i-breeze');
  }

  get isAnjSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('a&j') || name.includes('anj e-edu');
  }

  get isBeciSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return !this.isBCebuSelected && (name.includes('beci') || name.includes('api beci'));
  }

  get isJicSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name.includes('jic') || name.includes('菲律宾碧瑶jic');
  }

  get visibleCourses(): CiaCourseContent[] {
    return this.isBeciSelected ? this.content.courses.filter(item => (item.campus ?? 'eop') === this.beciCampus) : this.content.courses;
  }

  get visibleRooms(): CiaRoomContent[] {
    return this.isBeciSelected ? this.content.rooms.filter(item => (item.campus ?? 'eop') === this.beciCampus) : this.content.rooms;
  }

  get isSupportedSchool(): boolean { return this.isCiaSelected || this.isPinesSelected || this.isMonolSelected || this.isEvSelected || this.isSmeagSelected || this.isPhilinterSelected || this.isCgBaniladSelected || this.isCgSpartaSelected || this.isCpiSelected || this.isBCebuSelected || this.isCpilsSelected || this.isGlcSelected || this.isIbreezeSelected || this.isAnjSelected || this.isBeciSelected || this.isJicSelected; }
  get schoolCode(): CiaContentConfig['schoolCode'] {
    return this.isJicSelected ? 'JIC' : this.isBeciSelected ? 'BECI' : this.isAnjSelected ? 'ANJ' : this.isIbreezeSelected ? 'IBREEZE' : this.isGlcSelected ? 'GLC' : this.isCpilsSelected ? 'CPILS' : this.isBCebuSelected ? 'BCEBU' : this.isCpiSelected ? 'CPI' : this.isCgSpartaSelected ? 'CG-SPARTA' : this.isCgBaniladSelected ? 'CG-BANILAD' : this.isPhilinterSelected ? 'PHILINTER' : this.isSmeagSelected ? 'SMEAG' : this.isEvSelected ? 'EV' : this.isMonolSelected ? 'MONOL' : this.isPinesSelected ? 'PINES' : 'CIA';
  }
  get schoolShortName(): string { return this.schoolCode; }
  get usesFutureCoursePrices(): boolean { return this.isCiaSelected; }
  get supportsOneWeekShortStay(): boolean { return this.isCiaSelected || this.isBCebuSelected; }
  get usesWeeklyPricing(): boolean { return this.isGlcSelected; }
  get coursePriceLabel(): string { return this.usesWeeklyPricing ? '每周价格（美元）' : `${this.usesFutureCoursePrices ? '2026 原价' : '当前价格'}（美元/4周）`; }
  get roomPriceLabel(): string { return this.usesWeeklyPricing ? '每周价格（美元）' : '4周价格（美元）'; }
  get supportsShortStay(): boolean { return !this.isCpilsSelected && !this.isGlcSelected && !this.isIbreezeSelected && !this.isAnjSelected && !this.isJicSelected; }
  get supportsPeakSeason(): boolean { return !this.isMonolSelected && !this.isGlcSelected; }
  get currentPublicPath(): string {
    if (this.isJicSelected) return this.publicJicPath;
    if (this.isBeciSelected) return this.beciCampus === 'sparta' ? this.publicBeciSpartaPath : this.beciCampus === 'city' ? this.publicBeciCityPath : this.publicBeciEopPath;
    return this.isAnjSelected ? this.publicAnjPath : this.isIbreezeSelected ? this.publicIbreezePath : this.isGlcSelected ? this.publicGlcPath : this.isCpilsSelected ? this.publicCpilsPath : this.isBCebuSelected ? this.publicBCebuPath : this.isCpiSelected ? this.publicCpiPath : this.isCgSpartaSelected ? this.publicCgSpartaPath : this.isCgBaniladSelected ? this.publicCgBaniladPath : this.isPhilinterSelected ? this.publicPhilinterPath : this.isSmeagSelected ? this.publicSmeagPath : this.isEvSelected ? this.publicEvPath : this.isMonolSelected ? this.publicMonolPath : this.isPinesSelected ? this.publicPinesPath : this.publicCiaPath;
  }

  get activeTabLabel(): string {
    return this.tabs.find(tab => tab.id === this.activeTab)?.label ?? '学校内容';
  }

  get activeTabHelp(): string {
    if (this.activeTab === 'courses') return '修改课程名称、课程安排和学费；发布后官网课程表、报价计算器和报价图片共同使用。';
    if (this.activeTab === 'rooms') return '修改房型、住宿价格和入住规则；右侧会定位到官网住宿板块。';
    if (this.activeTab === 'fees') return '修改到校学杂费、计费方式和每一项备注；网页与报价图片保持一致。';
    if (this.activeTab === 'media') return '为当前学校直接上传照片或视频并设置展示位置；审核发布后才会同步到官网。';
    return '新增或调整学校优惠、旺季日期和计算规则；金额变化发布前需由管理员确认。';
  }

  get selectedCourse(): CiaCourseContent | undefined {
    return this.content.courses.find(item => item.id === this.selectedCourseId);
  }

  get selectedRoom(): CiaRoomContent | undefined {
    return this.content.rooms.find(item => item.id === this.selectedRoomId);
  }

  get selectedFee(): CiaLocalFeeRule | undefined {
    return this.content.localFees.find(item => item.id === this.selectedFeeId);
  }

  get selectedPromotion(): CiaPromotionRule | undefined {
    return this.content.quoteSettings.promotions.find(item => item.id === this.selectedPromotionId);
  }

  selectSchool(school: SchoolDTO): void {
    this.selectedSchool = school;
    this.schoolSearch = school.name;
    this.showSchoolResults = false;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { schoolId: school.id },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    if (this.isBeciSelected) {
      const requestedCampus = this.route.snapshot.queryParamMap.get('campus');
      if (requestedCampus !== 'eop' && requestedCampus !== 'sparta' && requestedCampus !== 'city') {
        this.beciCampus = school.name.toLowerCase().includes('city') ? 'city' : 'eop';
      }
    }
    if (this.isSupportedSchool) {
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `${this.currentPublicPath}?contentPreview=1`,
      );
      this.loadEditor(school.id);
    } else {
      this.editor = undefined;
      this.statusKind = 'warning';
      this.statusMessage = "目前已接通 CIA、PINES、MONOL、EV、SMEAG Capital、Philinter、CG Banilad、CG斯巴达、CPI、B'Cebu、CPILS、GLC、I.BREEZE、A&J、BECI 三校区与 JIC。这所学校会在价格和报价计算器核对完成后再接入。";
      this.isLoading = false;
    }
  }

  selectBeciCampus(campus: BeciCampus): void {
    if (!this.isBeciSelected || this.beciCampus === campus) return;
    this.beciCampus = campus;
    this.selectedCourseId = this.visibleCourses[0]?.id ?? '';
    this.selectedRoomId = this.visibleRooms[0]?.id ?? '';
    this.previewTarget = this.activeTab === 'rooms'
      ? { kind: 'room', id: this.selectedRoomId }
      : { kind: 'course', id: this.selectedCourseId };
    this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.currentPublicPath}?contentPreview=1`);
    void this.router.navigate([], { relativeTo: this.route, queryParams: { campus }, queryParamsHandling: 'merge', replaceUrl: true });
    this.persistPreview();
  }

  selectTab(tab: EditorTab): void {
    this.activeTab = tab;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    if (tab === 'media') return;
    const kind = { courses: 'course', rooms: 'room', fees: 'fee', rules: 'promotion' } as const;
    const id = { courses: this.selectedCourseId, rooms: this.selectedRoomId, fees: this.selectedFeeId, rules: this.selectedPromotionId }[tab];
    this.selectItem(id ? kind[tab] : 'section', id || this.tabs.find(item => item.id === tab)!.anchor);
  }

  selectEditorItem(kind: 'course' | 'room' | 'fee' | 'promotion', id: string): void {
    this.selectItem(kind, id);
    setTimeout(() => document.querySelector<HTMLElement>('[data-selected-editor]')
      ?.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  }

  get previewLocation(): string {
    const { kind, id } = this.previewTarget;
    if (kind === 'course') return `完整课程费表 → ${this.content.courses.find(item => item.id === id)?.name ?? '课程'}`;
    if (kind === 'room') return `住宿费表 → ${this.content.rooms.find(item => item.id === id)?.label ?? '房型'}`;
    if (kind === 'fee') return `到校后学杂费 → ${this.content.localFees.find(item => item.id === id)?.name ?? '费用'}`;
    if (kind === 'promotion') return `报价优惠明细 → ${this.content.quoteSettings.promotions.find(item => item.id === id)?.name ?? '优惠'}`;
    return CIA_PREVIEW_SECTIONS[id]?.label ?? '报价计算器';
  }

  selectItem(kind: CiaPreviewKind, id: string, scroll = true): void {
    if (!isCiaPreviewTarget({ kind, id })) return;
    if (kind === 'course') { this.activeTab = 'courses'; this.selectedCourseId = id; }
    if (kind === 'room') { this.activeTab = 'rooms'; this.selectedRoomId = id; }
    if (kind === 'fee') { this.activeTab = 'fees'; this.selectedFeeId = id; }
    if (kind === 'promotion') { this.activeTab = 'rules'; this.selectedPromotionId = id; }
    this.previewTarget = { kind, id };
    if (scroll) this.previewStatus = '正在定位…';
    this.sendPreview(scroll);
  }

  focusEditorItem(kind: CiaPreviewKind, id: string): void {
    if (this.previewTarget.kind !== kind || this.previewTarget.id !== id) this.selectItem(kind, id);
  }

  locatePreview(): void {
    this.sendPreview(true);
  }

  contentChanged(): void {
    this.normalizeSortOrders();
    this.persistPreview();
    this.sendPreview();
  }

  updateMedia(items: CiaMediaContent[]): void {
    const wasInitialized = this.content.media !== undefined;
    this.content.media = items.map(item => ({ ...item }));
    if (wasInitialized) {
      this.statusKind = 'warning';
      this.statusMessage = '媒体修改已加入当前草稿，请填写修改说明后保存或提交审核。';
    }
  }

  previewLoaded(): void {
    this.sendPreview(true);
  }

  @HostListener('window:message', ['$event'])
  selectFromPreview(event: MessageEvent): void {
    if (event.origin !== window.location.origin || event.source !== this.previewFrame?.nativeElement.contentWindow) return;
    const message = event.data;
    const prefix = this.schoolCode.toLowerCase();
    if (message?.type === `${prefix}-content-ready`) { this.sendPreview(true); return; }
    if (message?.type === `${prefix}-content-located` && isCiaPreviewTarget(message.target)) {
      if (message.target.kind === this.previewTarget.kind && message.target.id === this.previewTarget.id) {
        this.previewStatus = typeof message.status === 'string' ? message.status : '';
      }
      return;
    }
    if (message?.type !== `${prefix}-content-select` || !isCiaPreviewTarget(message)) return;
    if (message.kind === 'section') this.activeTab = CIA_PREVIEW_SECTIONS[message.id].tab;
    this.selectItem(message.kind, message.id, false);
    setTimeout(() => {
      const selector = message.kind === 'section' ? `[data-editor-section="${message.id}"]` : '[data-selected-editor]';
      document.querySelector<HTMLElement>(selector)?.scrollIntoView({ block: 'center', behavior: 'instant' });
    });
  }

  updateFeeRates(item: CiaLocalFeeRule, value: string): void {
    item.rates = value
      .split(',')
      .map(part => Number(part.trim()))
      .filter(rate => Number.isFinite(rate) && rate >= 0);
    this.contentChanged();
  }

  formatNumberMap(value?: Record<string, number>): string {
    return Object.entries(value ?? {}).sort((a, b) => Number(a[0]) - Number(b[0])).map(([key, amount]) => `${key}:${amount}`).join(', ');
  }

  updateCourseWeekPrices(item: CiaCourseContent, value: string): void {
    item.feeByWeeks = this.parseNumberMap(value);
    this.contentChanged();
  }

  updateCourseAllowedWeeks(item: CiaCourseContent, value: string): void {
    item.allowedWeeks = value.split(/[,，、]/).map(part => Number(part.trim())).filter(week => Number.isInteger(week) && week > 0);
    this.contentChanged();
  }

  updatePromotionTiers(item: CiaPromotionRule, value: string): void {
    item.discountTiers = this.parseNumberMap(value);
    this.contentChanged();
  }

  private parseNumberMap(value: string): Record<string, number> {
    const result: Record<string, number> = {};
    for (const part of value.split(/[,，、]/)) {
      const [rawKey, rawAmount] = part.trim().split(/[:：]/);
      const key = Number(rawKey);
      const amount = Number(rawAmount);
      if (Number.isFinite(key) && key > 0 && Number.isFinite(amount) && amount >= 0) result[String(key)] = amount;
    }
    return result;
  }

  addCourse(): void {
    const item: CiaCourseContent = {
      id: this.uniqueId('course'),
      name: '新课程',
      tuition: 0,
      tuition2027: 0,
      suitable: '',
      schedule: '',
      note: '',
      enabled: true,
      sortOrder: this.content.courses.length,
    };
    if (this.isGlcSelected) {
      item.englishName = 'New course';
      item.chineseName = '新课程';
      item.group = '其他课程';
      item.offSeasonEligible = false;
      item.annexOnly = false;
      item.family = false;
      item.textbook = 'esl';
    }
    if (this.isAnjSelected) item.courseType = '英语课程';
    if (this.isJicSelected) { item.campus = 'challenger'; item.courseType = 'Challenger 挑战校区'; item.minimumWeeks = 4; item.allowedWeeks = [4, 6, 8, 12, 16, 20, 24]; }
    if (this.isBeciSelected) { item.campus = this.beciCampus; item.courseType = `${this.beciCampus.toUpperCase()}课程`; }
    this.content.courses.push(item);
    this.selectedCourseId = item.id;
    this.contentChanged();
    this.selectItem('course', item.id);
  }

  addRoom(): void {
    const item: CiaRoomContent = {
      id: this.uniqueId('room'),
      name: '新房型',
      label: '新房型',
      code: 'NEW',
      location: '校内',
      group: '普通多人间',
      fee: 0,
      note: '',
      enabled: true,
      sortOrder: this.content.rooms.length,
    };
    if (this.isAnjSelected) {
      item.priceMode = 'per-person';
      item.minOccupancy = 1;
      item.maxOccupancy = 1;
      item.waterFee4w = 0;
      item.waterGroup = 'Premium / Villa';
      item.deposit = 0;
    }
    if (this.isJicSelected) { item.campus = 'challenger'; item.code = 'quad'; item.group = 'Challenger 挑战校区'; item.single = false; }
    if (this.isBeciSelected) { item.campus = this.beciCampus; item.single = false; item.coupleRate = undefined; item.code = this.beciCampus.toUpperCase(); }
    this.content.rooms.push(item);
    this.selectedRoomId = item.id;
    this.contentChanged();
    this.selectItem('room', item.id);
  }

  setJicRoomCategory(item: CiaRoomContent, category: 'single' | 'twin' | 'quad'): void {
    item.code = category;
    item.single = category === 'single';
    this.contentChanged();
  }

  addFee(): void {
    const item: CiaLocalFeeRule = {
      id: this.uniqueId('fee'),
      name: '新费用',
      currency: 'PHP',
      amount: 0,
      billingRule: 'once',
      includeInTotal: true,
      note: '',
      enabled: true,
      sortOrder: this.content.localFees.length,
    };
    this.content.localFees.push(item);
    this.selectedFeeId = item.id;
    this.contentChanged();
    this.selectItem('fee', item.id);
  }

  addPromotion(): void {
    const item: CiaPromotionRule = {
      id: this.uniqueId('promotion'),
      name: '新优惠',
      description: '',
      enabled: true,
      sortOrder: this.content.quoteSettings.promotions.length,
      priority: 10,
      stackable: true,
      newStudentsOnly: false,
      discountType: 'fixed',
      discountValue: 0,
      appliesTo: 'school-total',
      waiveRegistration: false,
      minimumCourseWeeks: 0,
      minimumAccommodationWeeks: 0,
      coverageTarget: 'none',
    };
    this.content.quoteSettings.promotions.push(item);
    this.selectedPromotionId = item.id;
    this.contentChanged();
    this.selectItem('promotion', item.id);
  }

  addPeakRange(): void {
    const item: CiaPeakSeasonRange = {
      id: this.uniqueId('peak'),
      label: '新旺季',
      start: '',
      end: '',
      enabled: true,
    };
    this.content.quoteSettings.peakSeasonRanges.push(item);
    this.contentChanged();
  }

  removeItem(kind: 'course' | 'room' | 'fee' | 'promotion' | 'peak', id: string): void {
    const highRisk = kind === 'promotion' || kind === 'peak';
    const confirmed = window.confirm(
      highRisk
        ? '删除后可能改变报价计算结果。确定从当前草稿中删除吗？'
        : '确定从当前草稿中删除这一项吗？发布前仍可通过历史版本恢复。',
    );
    if (!confirmed) return;
    if (kind === 'course') {
      this.content.courses = this.content.courses.filter(item => item.id !== id);
      this.selectedCourseId = this.visibleCourses[0]?.id ?? '';
    } else if (kind === 'room') {
      this.content.rooms = this.content.rooms.filter(item => item.id !== id);
      this.selectedRoomId = this.visibleRooms[0]?.id ?? '';
    } else if (kind === 'fee') {
      this.content.localFees = this.content.localFees.filter(item => item.id !== id);
      this.selectedFeeId = this.content.localFees[0]?.id ?? '';
    } else if (kind === 'promotion') {
      this.content.quoteSettings.promotions = this.content.quoteSettings.promotions.filter(item => item.id !== id);
      this.selectedPromotionId = this.content.quoteSettings.promotions[0]?.id ?? '';
    } else {
      this.content.quoteSettings.peakSeasonRanges = this.content.quoteSettings.peakSeasonRanges.filter(item => item.id !== id);
    }
    this.contentChanged();
    this.selectTab(this.activeTab);
  }

  move(kind: 'course' | 'room' | 'fee' | 'promotion', id: string, direction: -1 | 1): void {
    const list = kind === 'course' ? this.content.courses
      : kind === 'room' ? this.content.rooms
        : kind === 'fee' ? this.content.localFees
          : this.content.quoteSettings.promotions;
    const index = list.findIndex(item => item.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    this.contentChanged();
  }

  saveDraft(): void {
    if (!this.selectedSchool?.id || !this.isSupportedSchool || this.isSaving) return;
    const hasInitialVersion = !!(this.editor?.draft || this.editor?.pendingReview || this.editor?.published);
    if (!hasInitialVersion && !this.canPublish) {
      this.statusKind = 'warning';
      this.statusMessage = `这所学校尚未建立初始版本，请管理员先打开 ${this.schoolShortName} 工作台并保存一次。`;
      return;
    }
    this.isSaving = true;
    this.statusMessage = '';
    const summary = this.changeSummary.trim() || `更新 ${this.schoolShortName} ${this.activeTabLabel}`;
    const request = !hasInitialVersion && this.canPublish
      ? this.schoolContentService.saveDraft(this.selectedSchool.id, this.content, summary)
      : this.activeTab === 'media'
      ? this.schoolContentService.saveMediaDraft<CiaContentConfig, CiaMediaContent[]>(
          this.selectedSchool.id,
          this.content.media ?? [],
          summary,
        )
      : this.schoolContentService.savePricingDraft(this.selectedSchool.id, this.content, summary);
    request.pipe(finalize(() => this.isSaving = false)).subscribe({
      next: draft => {
        this.statusKind = 'success';
        this.statusMessage = `草稿已保存（版本 ${draft.version}），官网尚未发布。`;
        this.loadEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '草稿保存失败，请检查后台服务后重试。';
      },
    });
  }

  submitForReview(): void {
    if (!this.selectedSchool?.id || !this.isSupportedSchool || this.isSubmitting) return;
    const hasInitialVersion = !!(this.editor?.draft || this.editor?.pendingReview || this.editor?.published);
    if (!hasInitialVersion && !this.canPublish) {
      this.statusKind = 'warning';
      this.statusMessage = `这所学校尚未建立初始版本，请管理员先打开 ${this.schoolShortName} 工作台并保存一次。`;
      return;
    }
    const summary = this.changeSummary.trim();
    if (!summary) {
      this.statusKind = 'error';
      this.statusMessage = '提交审核前，请先填写“本次修改说明”，写清楚改了哪些地方。';
      return;
    }
    this.isSubmitting = true;
    this.statusMessage = '';
    const saveRequest = !hasInitialVersion && this.canPublish
      ? this.schoolContentService.saveDraft(this.selectedSchool.id, this.content, summary)
      : this.activeTab === 'media'
      ? this.schoolContentService.saveMediaDraft<CiaContentConfig, CiaMediaContent[]>(
          this.selectedSchool.id,
          this.content.media ?? [],
          summary,
        )
      : this.schoolContentService.savePricingDraft(this.selectedSchool.id, this.content, summary);
    const scope = this.activeTab === 'media' ? 'Media' as const : 'Pricing' as const;
    saveRequest.pipe(
      switchMap(() => this.schoolContentService.submitForReview<CiaContentConfig>(this.selectedSchool!.id, scope)),
      finalize(() => this.isSubmitting = false),
    ).subscribe({
      next: revision => {
        this.statusKind = 'success';
        this.statusMessage = `版本 ${revision.version} 已提交管理员审核，官网尚未改变。`;
        this.changeSummary = '';
        this.loadEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '提交审核失败，请先确认草稿能够正常保存。';
      },
    });
  }

  publish(): void {
    if (!this.selectedSchool?.id || !this.canPublish || this.isPublishing) return;
    if (!this.editor?.pendingReview) {
      this.statusKind = 'warning';
      this.statusMessage = '没有待审核版本。请先填写修改说明并提交审核，再由管理员发布。';
      return;
    }
    if (!window.confirm('发布后官网、报价计算器和报价图片会立即使用这份内容。确定发布吗？')) return;
    this.isPublishing = true;
    this.statusMessage = '';
    this.schoolContentService.publish<CiaContentConfig>(this.selectedSchool.id).pipe(
      finalize(() => this.isPublishing = false),
    ).subscribe({
      next: revision => {
        this.statusKind = 'success';
        this.statusMessage = `版本 ${revision.version} 已发布，官网已同步更新。`;
        this.changeSummary = '';
        this.loadEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '发布失败，当前官网内容未改变。';
      },
    });
  }

  returnForChanges(): void {
    if (!this.selectedSchool?.id || !this.canPublish || !this.editor?.pendingReview) return;
    const reason = window.prompt('请填写需要员工修改的内容：');
    if (reason === null) return;
    this.schoolContentService.returnToDraft<CiaContentConfig>(this.selectedSchool.id, reason.trim()).subscribe({
      next: revision => {
        this.statusKind = 'success';
        this.statusMessage = `版本 ${revision.version} 已退回草稿，员工可以继续修改后重新提交。`;
        this.loadEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '退回失败，请稍后再试。';
      },
    });
  }

  restore(revisionId: string, version: number): void {
    if (!this.selectedSchool?.id || !this.canPublish) return;
    if (!window.confirm(`把版本 ${version} 恢复为新的草稿吗？恢复后仍需再次点击“发布更新”。`)) return;
    this.schoolContentService.restore<CiaContentConfig>(this.selectedSchool.id, revisionId).subscribe({
      next: draft => {
        this.content = this.cloneSelectedContent(draft.content);
        this.statusKind = 'success';
        this.statusMessage = `版本 ${version} 已恢复为草稿，尚未发布。`;
        this.persistPreview();
        this.loadEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '恢复失败，请稍后再试。';
      },
    });
  }

  openPublicPage(): void {
    window.open(this.currentPublicPath, '_blank', 'noopener');
  }

  openQuoteImageEditor(): void {
    void this.router.navigate(['/admin/school-quote-image'], {
      queryParams: { schoolId: this.selectedSchool?.id, campus: this.isBeciSelected ? this.beciCampus : undefined },
    });
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  private loadSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: schools => {
        this.schools = schools ?? [];
        const queryId = this.route.snapshot.queryParamMap.get('schoolId');
        const school = this.schools.find(item => item.id === queryId)
          ?? this.schools.find(item => item.name === this.ciaSchoolName)
          ?? this.schools.find(item => item.name.toLowerCase().includes('cia'))
          ?? this.schools[0];
        if (school) this.selectSchool(school);
        else this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.statusKind = 'error';
        this.statusMessage = '学校列表加载失败，请确认已经登录并检查后台服务。';
      },
    });
  }

  private loadEditor(schoolId: string, showLoading = true): void {
    if (showLoading) this.isLoading = true;
    this.editorLoadFailed = false;
    this.editorLoadStatus = 0;
    const defaults = this.createSelectedDefaults();
    forkJoin({
      editor: this.schoolContentService.getEditor<CiaContentConfig>(schoolId).pipe(catchError(error => {
        this.editorLoadFailed = true;
        this.editorLoadStatus = Number(error?.status) || 0;
        return of(null);
      })),
      lessons: this.schoolService.getSchoolLessons({ schoolId, week: this.isGlcSelected ? 1 : 4 }).pipe(catchError(() => of([]))),
      rooms: this.schoolService.getSchoolRooms({ schoolId, week: this.isGlcSelected ? 1 : 4 }).pipe(catchError(() => of([]))),
      fees: this.schoolService.getSchoolFees({ schoolId }).pipe(catchError(() => of([]))),
    }).subscribe(({ editor, lessons, rooms, fees }) => {
      this.editor = editor ?? undefined;
      const stored = editor?.draft?.content ?? editor?.pendingReview?.content ?? editor?.published?.content;
      this.content = stored ? this.cloneSelectedContent(stored) : defaults;
      if (!stored) {
        for (const course of this.content.courses) {
          const row = lessons.find(item =>
            this.slug(item.name) === course.id ||
            item.name === course.name ||
            item.name === course.englishName,
          );
          if (row) course.tuition = row.price;
        }
        for (const room of this.content.rooms) {
          const row = rooms.find(item => this.roomId(item.name) === room.id || item.name === room.name);
          if (row) room.fee = row.price;
        }
        const registration = fees.find(item => item.name === '注册费');
        const peak = fees.find(item => item.name === '旺季附加费' || item.name === '暑期附加费');
        if (registration) this.content.quoteSettings.registrationFee = registration.fee;
        if (peak) this.content.quoteSettings.peakSeasonFeePerWeek = peak.fee;
      }
      this.selectedCourseId = this.visibleCourses[0]?.id ?? '';
      this.selectedRoomId = this.visibleRooms[0]?.id ?? '';
      this.selectedFeeId = this.content.localFees[0]?.id ?? '';
      this.selectedPromotionId = this.content.quoteSettings.promotions[0]?.id ?? '';
      this.persistPreview();
      this.selectTab(this.activeTab);
      this.isLoading = false;
      if (this.editorLoadFailed) {
        this.statusKind = 'error';
        if (this.editorLoadStatus === 401) {
          this.statusMessage = '版本记录读取失败：当前登录已失效，请重新登录后再编辑。';
        } else if (this.editorLoadStatus === 403) {
          this.statusMessage = '版本记录读取失败：当前账号没有编辑权限，请联系管理员。';
        } else if (this.editorLoadStatus === 404) {
          this.statusKind = 'warning';
          this.statusMessage = this.canPublish
            ? `这是 ${this.schoolShortName} 的首次设置；请核对当前样板，保存草稿后会建立初始版本。`
            : `这所学校尚未建立初始版本，请管理员先打开 ${this.schoolShortName} 工作台并保存一次。`;
        } else if (this.editorLoadStatus === 0) {
          this.statusMessage = '暂时无法连接版本服务，请检查后台是否正在运行。当前页面仍可用于预览。';
        } else {
          this.statusMessage = '版本服务暂时异常，请稍后重试。当前页面仍可用于预览。';
        }
      } else if (!editor?.draft && !editor?.published) {
        this.statusKind = 'warning';
        this.statusMessage = `正在使用 ${this.schoolShortName} 当前官网数据作为初始样板；首次保存后会建立版本记录。`;
      }
    });
  }

  private persistPreview(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(`${this.schoolCode.toLowerCase()}-content-preview`, JSON.stringify(this.content));
    }
  }

  private sendPreview(scroll = false): void {
    this.persistPreview();
    setTimeout(() => this.previewFrame?.nativeElement.contentWindow?.postMessage(
      {
        type: `${this.schoolCode.toLowerCase()}-content-preview`,
        content: this.cloneSelectedContent(this.content),
        target: this.previewTarget,
        scroll,
      },
      window.location.origin,
    ));
  }

  private normalizeSortOrders(): void {
    this.content.courses.forEach((item, index) => item.sortOrder = index);
    this.content.rooms.forEach((item, index) => item.sortOrder = index);
    this.content.localFees.forEach((item, index) => item.sortOrder = index);
    this.content.quoteSettings.promotions.forEach((item, index) => item.sortOrder = index);
  }

  private createSelectedDefaults(): CiaContentConfig {
    if (this.isJicSelected) return createDefaultJicContentConfig();
    if (this.isBeciSelected) return createDefaultBeciContentConfig();
    if (this.isAnjSelected) return createDefaultAnjContentConfig();
    if (this.isIbreezeSelected) return createDefaultIbreezeContentConfig();
    if (this.isGlcSelected) return createDefaultGlcContentConfig();
    if (this.isCpilsSelected) return createDefaultCpilsContentConfig();
    if (this.isBCebuSelected) return createDefaultBCebuContentConfig();
    if (this.isCpiSelected) return createDefaultCpiContentConfig();
    if (this.isCgSpartaSelected) return createDefaultCgSpartaContentConfig();
    if (this.isCgBaniladSelected) return createDefaultCgBaniladContentConfig();
    if (this.isPhilinterSelected) return createDefaultPhilinterContentConfig();
    if (this.isSmeagSelected) return createDefaultSmeagContentConfig();
    if (this.isEvSelected) return createDefaultEvContentConfig();
    if (this.isMonolSelected) return createDefaultMonolContentConfig();
    if (this.isPinesSelected) return createDefaultPinesContentConfig();
    return createDefaultCiaContentConfig();
  }

  private cloneSelectedContent(value: CiaContentConfig): CiaContentConfig {
    if (this.isJicSelected) return cloneJicContentConfig(value);
    if (this.isBeciSelected) return cloneBeciContentConfig(value);
    if (this.isAnjSelected) return cloneAnjContentConfig(value);
    if (this.isIbreezeSelected) return cloneIbreezeContentConfig(value);
    if (this.isGlcSelected) return cloneGlcContentConfig(value);
    if (this.isCpilsSelected) return cloneCpilsContentConfig(value);
    if (this.isBCebuSelected) return cloneBCebuContentConfig(value);
    if (this.isCpiSelected) return cloneCpiContentConfig(value);
    if (this.isCgSpartaSelected) return cloneCgSpartaContentConfig(value);
    if (this.isCgBaniladSelected) return cloneCgBaniladContentConfig(value);
    if (this.isPhilinterSelected) return clonePhilinterContentConfig(value);
    if (this.isSmeagSelected) return cloneSmeagContentConfig(value);
    if (this.isEvSelected) return cloneEvContentConfig(value);
    if (this.isMonolSelected) return cloneMonolContentConfig(value);
    if (this.isPinesSelected) return clonePinesContentConfig(value);
    return cloneCiaContentConfig(value);
  }

  private uniqueId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  private slug(value: string): string {
    return value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private roomId(value: string): string {
    const match = value.toLowerCase().match(/(?:^|\s)(p1|pn1|s1|d2|d3|d4|sr1|sr2|sr3|sr4)(?:\s|$)/);
    return match?.[1] ?? this.slug(value);
  }
}
