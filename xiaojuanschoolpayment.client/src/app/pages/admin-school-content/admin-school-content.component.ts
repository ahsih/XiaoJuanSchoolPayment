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
  CiaPeakSeasonRange,
  CiaPromotionRule,
  CiaRoomContent,
  cloneCiaContentConfig,
  createDefaultCiaContentConfig,
} from '../philippines/cia-school/cia-content-config';
import { CIA_PREVIEW_SECTIONS, CiaPreviewKind, CiaPreviewTarget, isCiaPreviewTarget } from '../philippines/cia-school/cia-content-preview';

type EditorTab = 'courses' | 'rooms' | 'fees' | 'rules';

@Component({
  selector: 'app-admin-school-content',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-school-content.component.html',
  styleUrl: './admin-school-content.component.css',
})
export class AdminSchoolContentComponent implements OnInit {
  @ViewChild('previewFrame') previewFrame?: ElementRef<HTMLIFrameElement>;

  private readonly ciaSchoolName = 'CIA Cebu International Academy';
  private readonly publicCiaPath = '/philippines-study/cebu/cia-cebu-international-academy';

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
  ];

  readonly feeBillingOptions = [
    { value: 'once', label: '一次性收费' },
    { value: 'per-accommodation-period', label: '按住宿周期收费' },
    { value: 'per-course-period', label: '按课程周期收费' },
    { value: 'first-visa-extension', label: '首次续签时收费' },
    { value: 'long-term-or-first-extension', label: '长期签证或首次续签' },
    { value: 'visa-extension-schedule', label: '按续签次数阶梯收费' },
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

  get isCiaSelected(): boolean {
    return !!this.selectedSchool && (
      this.selectedSchool.name === this.ciaSchoolName ||
      this.selectedSchool.name.toLowerCase().includes('cia')
    );
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
    if (this.isCiaSelected) {
      this.loadCiaEditor(school.id);
    } else {
      this.editor = undefined;
      this.statusKind = 'warning';
      this.statusMessage = '目前先完成 CIA 样板。这所学校将在 CIA 确认后复制同一套编辑方式。';
      this.isLoading = false;
    }
  }

  selectTab(tab: EditorTab): void {
    this.activeTab = tab;
    const kind = { courses: 'course', rooms: 'room', fees: 'fee', rules: 'promotion' } as const;
    const id = { courses: this.selectedCourseId, rooms: this.selectedRoomId, fees: this.selectedFeeId, rules: this.selectedPromotionId }[tab];
    this.selectItem(id ? kind[tab] : 'section', id || this.tabs.find(item => item.id === tab)!.anchor);
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

  previewLoaded(): void {
    this.sendPreview(true);
  }

  @HostListener('window:message', ['$event'])
  selectFromPreview(event: MessageEvent): void {
    if (event.origin !== window.location.origin || event.source !== this.previewFrame?.nativeElement.contentWindow) return;
    const message = event.data;
    if (message?.type === 'cia-content-ready') { this.sendPreview(true); return; }
    if (message?.type === 'cia-content-located' && isCiaPreviewTarget(message.target)) {
      if (message.target.kind === this.previewTarget.kind && message.target.id === this.previewTarget.id) {
        this.previewStatus = typeof message.status === 'string' ? message.status : '';
      }
      return;
    }
    if (message?.type !== 'cia-content-select' || !isCiaPreviewTarget(message)) return;
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
    this.content.rooms.push(item);
    this.selectedRoomId = item.id;
    this.contentChanged();
    this.selectItem('room', item.id);
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
      this.selectedCourseId = this.content.courses[0]?.id ?? '';
    } else if (kind === 'room') {
      this.content.rooms = this.content.rooms.filter(item => item.id !== id);
      this.selectedRoomId = this.content.rooms[0]?.id ?? '';
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
    if (!this.selectedSchool?.id || !this.isCiaSelected || this.isSaving) return;
    this.isSaving = true;
    this.statusMessage = '';
    this.schoolContentService.saveDraft(
      this.selectedSchool.id,
      this.content,
      this.changeSummary.trim() || '更新 CIA 学校页面内容',
    ).pipe(finalize(() => this.isSaving = false)).subscribe({
      next: draft => {
        this.statusKind = 'success';
        this.statusMessage = `草稿已保存（版本 ${draft.version}），官网尚未发布。`;
        this.changeSummary = '';
        this.loadCiaEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '草稿保存失败，请检查后台服务后重试。';
      },
    });
  }

  submitForReview(): void {
    if (!this.selectedSchool?.id || !this.isCiaSelected || this.isSubmitting) return;
    this.isSubmitting = true;
    this.statusMessage = '';
    this.schoolContentService.saveDraft(
      this.selectedSchool.id,
      this.content,
      this.changeSummary.trim() || '提交 CIA 学校页面更新审核',
    ).pipe(
      switchMap(() => this.schoolContentService.submitForReview<CiaContentConfig>(this.selectedSchool!.id, 'SchoolContent')),
      finalize(() => this.isSubmitting = false),
    ).subscribe({
      next: revision => {
        this.statusKind = 'success';
        this.statusMessage = `版本 ${revision.version} 已提交管理员审核，官网尚未改变。`;
        this.changeSummary = '';
        this.loadCiaEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '提交审核失败，请先确认草稿能够正常保存。';
      },
    });
  }

  publish(): void {
    if (!this.selectedSchool?.id || !this.canPublish || this.isPublishing) return;
    if (!window.confirm('发布后官网、报价计算器和报价图片会立即使用这份内容。确定发布吗？')) return;
    this.isPublishing = true;
    this.statusMessage = '';
    const request = this.editor?.pendingReview
      ? this.schoolContentService.publish<CiaContentConfig>(this.selectedSchool.id)
      : this.schoolContentService.saveDraft(
          this.selectedSchool.id,
          this.content,
          this.changeSummary.trim() || '管理员发布 CIA 学校页面更新',
        ).pipe(switchMap(() => this.schoolContentService.publish<CiaContentConfig>(this.selectedSchool!.id)));
    request.pipe(
      finalize(() => this.isPublishing = false),
    ).subscribe({
      next: revision => {
        this.statusKind = 'success';
        this.statusMessage = `版本 ${revision.version} 已发布，官网已同步更新。`;
        this.changeSummary = '';
        this.loadCiaEditor(this.selectedSchool!.id, false);
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
        this.loadCiaEditor(this.selectedSchool!.id, false);
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
        this.content = cloneCiaContentConfig(draft.content);
        this.statusKind = 'success';
        this.statusMessage = `版本 ${version} 已恢复为草稿，尚未发布。`;
        this.persistPreview();
        this.loadCiaEditor(this.selectedSchool!.id, false);
      },
      error: () => {
        this.statusKind = 'error';
        this.statusMessage = '恢复失败，请稍后再试。';
      },
    });
  }

  openPublicPage(): void {
    window.open(this.publicCiaPath, '_blank', 'noopener');
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

  private loadCiaEditor(schoolId: string, showLoading = true): void {
    if (showLoading) this.isLoading = true;
    this.editorLoadFailed = false;
    this.editorLoadStatus = 0;
    const defaults = createDefaultCiaContentConfig();
    forkJoin({
      editor: this.schoolContentService.getEditor<CiaContentConfig>(schoolId).pipe(catchError(error => {
        this.editorLoadFailed = true;
        this.editorLoadStatus = Number(error?.status) || 0;
        return of(null);
      })),
      lessons: this.schoolService.getSchoolLessons({ schoolId, week: 4 }).pipe(catchError(() => of([]))),
      rooms: this.schoolService.getSchoolRooms({ schoolId, week: 4 }).pipe(catchError(() => of([]))),
      fees: this.schoolService.getSchoolFees({ schoolId }).pipe(catchError(() => of([]))),
    }).subscribe(({ editor, lessons, rooms, fees }) => {
      this.editor = editor ?? undefined;
      const stored = editor?.draft?.content ?? editor?.pendingReview?.content ?? editor?.published?.content;
      this.content = stored ? cloneCiaContentConfig(stored) : defaults;
      if (!stored) {
        for (const course of this.content.courses) {
          const row = lessons.find(item => this.slug(item.name) === course.id);
          if (row) course.tuition = row.price;
        }
        for (const room of this.content.rooms) {
          const row = rooms.find(item => this.roomId(item.name) === room.id);
          if (row) room.fee = row.price;
        }
        const registration = fees.find(item => item.name === '注册费');
        const peak = fees.find(item => item.name === '旺季附加费');
        if (registration) this.content.quoteSettings.registrationFee = registration.fee;
        if (peak) this.content.quoteSettings.peakSeasonFeePerWeek = peak.fee;
      }
      this.selectedCourseId = this.content.courses[0]?.id ?? '';
      this.selectedRoomId = this.content.rooms[0]?.id ?? '';
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
          this.statusMessage = '版本服务尚未加载，请重启后台服务后再保存。当前页面仍可用于预览。';
        } else if (this.editorLoadStatus === 0) {
          this.statusMessage = '暂时无法连接版本服务，请检查后台是否正在运行。当前页面仍可用于预览。';
        } else {
          this.statusMessage = '版本服务暂时异常，请稍后重试。当前页面仍可用于预览。';
        }
      } else if (!editor?.draft && !editor?.published) {
        this.statusKind = 'warning';
        this.statusMessage = '正在使用 CIA 当前官网数据作为初始样板；首次保存后会建立版本记录。';
      }
    });
  }

  private persistPreview(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('cia-content-preview', JSON.stringify(this.content));
    }
  }

  private sendPreview(scroll = false): void {
    this.persistPreview();
    setTimeout(() => this.previewFrame?.nativeElement.contentWindow?.postMessage(
      { type: 'cia-content-preview', content: cloneCiaContentConfig(this.content), target: this.previewTarget, scroll },
      window.location.origin,
    ));
  }

  private normalizeSortOrders(): void {
    this.content.courses.forEach((item, index) => item.sortOrder = index);
    this.content.rooms.forEach((item, index) => item.sortOrder = index);
    this.content.localFees.forEach((item, index) => item.sortOrder = index);
    this.content.quoteSettings.promotions.forEach((item, index) => item.sortOrder = index);
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
