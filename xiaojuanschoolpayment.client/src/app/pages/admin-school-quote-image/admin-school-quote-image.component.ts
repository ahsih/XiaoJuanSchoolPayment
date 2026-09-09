import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { QuoteImageInlinePreviewComponent } from '../../components/quote-image-inline-preview.component';
import { buildPhilippinesDetailedQuote } from '../../components/philippines-quote-image-data';
import { applySchoolQuoteImageLayout } from '../../components/school-quote-plan';
import { QuoteImageCardData } from '../../components/quote-image-download-button.component';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolContentEditorDTO } from '../../../interfaces/school-content.dto';
import { AuthService } from '../../../services/auth.service';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import {
  CiaContentConfig,
  CiaLocalFeeRule,
  CiaQuoteImageSettings,
  cloneCiaContentConfig,
  createDefaultCiaContentConfig,
} from '../philippines/cia-school/cia-content-config';
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

@Component({
  selector: 'app-admin-school-quote-image',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, QuoteImageInlinePreviewComponent],
  templateUrl: './admin-school-quote-image.component.html',
  styleUrl: './admin-school-quote-image.component.css',
})
export class AdminSchoolQuoteImageComponent implements OnInit, OnDestroy {
  private readonly ciaSchoolName = 'CIA Cebu International Academy';
  schools: SchoolDTO[] = [];
  selectedSchool?: SchoolDTO;
  content = createDefaultCiaContentConfig();
  editor?: SchoolContentEditorDTO<CiaContentConfig>;
  previewQuote: QuoteImageCardData = this.buildPreviewQuote();
  changeSummary = '';
  statusMessage = '';
  statusKind: 'success' | 'warning' | 'error' | '' = '';
  isLoading = true;
  isSaving = false;
  isPublishing = false;
  isSubmitting = false;
  beciCampus: BeciCampus = 'eop';
  private previewTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly schoolService: SchoolService,
    private readonly contentService: SchoolContentService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const campus = this.route.snapshot.queryParamMap.get('campus');
    if (campus === 'eop' || campus === 'sparta' || campus === 'city') this.beciCampus = campus;
    this.loadSchools();
  }
  ngOnDestroy(): void { clearTimeout(this.previewTimer); }

  get canPublish(): boolean {
    return this.authService.getRoles().some(role => role.toLowerCase() === 'admin');
  }
  get settings(): CiaQuoteImageSettings { return this.content.quoteImageSettings; }
  get isCiaSelected(): boolean { return this.selectedSchool?.name === this.ciaSchoolName || !!this.selectedSchool?.name.toLowerCase().includes('cia'); }
  get isPinesSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('pines'); }
  get isMonolSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('monol'); }
  get isEvSelected(): boolean {
    const name = this.selectedSchool?.name.toLowerCase() ?? '';
    return name === 'ev academy' || name.includes('宿务ev') || name.includes('ev academy');
  }
  get isSmeagSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('smeag capital'); }
  get isPhilinterSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('philinter'); }
  get isCgBaniladSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('cg academy')&&name.includes('banilad'); }
  get isCgSpartaSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('cg academy')&&name.includes('sparta'); }
  get isCpiSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('cpi')&&!name.includes('cpils'); }
  get isBCebuSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes("b'cebu")||name.includes('bcebu')||name.includes("beci b'cebu"); }
  get isCpilsSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('cpils'); }
  get isGlcSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('global language cebu'); }
  get isIbreezeSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('i.breeze')||name.includes('i breeze')||name.includes('ibreeze'); }
  get isAnjSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('a&j')||name.includes('anj e-edu'); }
  get isBeciSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return !this.isBCebuSelected&&(name.includes('beci')||name.includes('api beci')); }
  get isJicSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('jic'); }
  get isSupportedSchool(): boolean { return this.isCiaSelected || this.isPinesSelected || this.isMonolSelected || this.isEvSelected || this.isSmeagSelected || this.isPhilinterSelected || this.isCgBaniladSelected || this.isCgSpartaSelected || this.isCpiSelected || this.isBCebuSelected || this.isCpilsSelected || this.isGlcSelected || this.isIbreezeSelected || this.isAnjSelected || this.isBeciSelected || this.isJicSelected; }
  get schoolShortName(): string { return this.isJicSelected ? 'JIC' : this.isBeciSelected ? `BECI ${this.beciCampus === 'eop' ? 'EOP' : this.beciCampus === 'sparta' ? 'Sparta' : 'City'}` : this.isAnjSelected ? 'A&J' : this.isIbreezeSelected ? 'I.BREEZE' : this.isGlcSelected ? 'GLC' : this.isCpilsSelected ? 'CPILS' : this.isBCebuSelected ? "B'Cebu" : this.isCpiSelected ? 'CPI' : this.isCgSpartaSelected ? 'CG斯巴达' : this.isCgBaniladSelected ? 'CG Banilad' : this.isPhilinterSelected ? 'PHILINTER' : this.isSmeagSelected ? 'SMEAG' : this.isEvSelected ? 'EV' : this.isMonolSelected ? 'MONOL' : this.isPinesSelected ? 'PINES' : 'CIA'; }
  get imageFeeRows(): CiaLocalFeeRule[] {
    return this.content.localFees.filter(fee => fee.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  get serviceLocationsText(): string { return this.settings.serviceLocations.join('、'); }
  set serviceLocationsText(value: string) { this.settings.serviceLocations = value.split(/[,，、]/).map(item => item.trim()).filter(Boolean).slice(0, 3); }

  selectSchoolId(id: string): void {
    const school = this.schools.find(item => item.id === id);
    if (!school) return;
    this.selectedSchool = school;
    void this.router.navigate([], { relativeTo: this.route, queryParams: { schoolId: school.id }, queryParamsHandling: 'merge', replaceUrl: true });
    if (this.isSupportedSchool) this.loadEditor(school.id);
    else { this.isLoading = false; this.statusKind = 'warning'; this.statusMessage = "目前已接通 CIA、PINES、MONOL、EV、SMEAG Capital、Philinter、CG Banilad、CG斯巴达、CPI、B'Cebu、CPILS、GLC、I.BREEZE、A&J、BECI 三校区与 JIC 报价图片；其他学校会在计算器核对完成后再接入。"; }
  }

  selectBeciCampus(campus: BeciCampus): void {
    this.beciCampus = campus;
    void this.router.navigate([], { relativeTo: this.route, queryParams: { campus }, queryParamsHandling: 'merge', replaceUrl: true });
    this.previewQuote = this.buildPreviewQuote();
  }

  contentChanged(): void {
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.previewQuote = this.buildPreviewQuote(), 260);
  }

  addFooterNote(): void {
    this.settings.footerNotes.push('新的报价说明');
    this.contentChanged();
  }

  removeFooterNote(index: number): void {
    if (this.settings.footerNotes.length <= 1) return;
    this.settings.footerNotes.splice(index, 1);
    this.contentChanged();
  }

  feeBillingText(fee: CiaLocalFeeRule): string {
    if (!fee.includeInTotal) return '另列参考 · 不计入学杂费合计';
    if (fee.billingRule === 'per-accommodation-period') return `按住宿每${fee.periodWeeks ?? 4}周计算`;
    if (fee.billingRule === 'per-course-period') return `按课程每${fee.periodWeeks ?? 4}周计算`;
    if (fee.billingRule === 'first-visa-extension') return '首次签证续签时计算';
    if (fee.billingRule === 'long-term-or-first-extension') return '长期签证或首次续签时计算';
    if (fee.billingRule === 'visa-extension-schedule') return '按签证与停留天数计算';
    return '一次性费用';
  }

  scrollToEditorSection(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  openContentTab(tab: 'courses' | 'rooms' | 'fees' | 'rules' | 'media'): void {
    void this.router.navigate(['/admin/school-content'], {
      queryParams: { schoolId: this.selectedSchool?.id, tab, campus: this.isBeciSelected ? this.beciCampus : undefined },
    });
  }

  saveDraft(): void {
    if (!this.selectedSchool?.id || !this.isSupportedSchool || this.isSaving) return;
    const hasInitialVersion = !!(this.editor?.draft || this.editor?.pendingReview || this.editor?.published);
    if (!hasInitialVersion && !this.canPublish) {
      this.statusKind = 'warning';
      this.statusMessage = `这所学校尚未建立初始版本，请管理员先在 ${this.schoolShortName} 统一工作台保存一次。`;
      return;
    }
    this.isSaving = true; this.statusMessage = '';
    const summary = this.changeSummary.trim() || `更新 ${this.schoolShortName} 报价图片说明`;
    const request = !hasInitialVersion && this.canPublish
      ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
      : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary);
    request
      .pipe(finalize(() => this.isSaving = false)).subscribe({
        next: draft => { this.statusKind = 'success'; this.statusMessage = `图片说明草稿已保存（版本 ${draft.version}），官网尚未发布。`; this.loadEditor(this.selectedSchool!.id, false); },
        error: error => { this.statusKind = 'error'; this.statusMessage = error?.status === 403 ? '你没有这所学校的报价图片编辑权限。' : '草稿保存失败，请稍后重试。'; },
      });
  }

  submitForReview(): void {
    if (!this.selectedSchool?.id || !this.isSupportedSchool || this.isSubmitting) return;
    const hasInitialVersion = !!(this.editor?.draft || this.editor?.pendingReview || this.editor?.published);
    if (!hasInitialVersion && !this.canPublish) {
      this.statusKind = 'warning';
      this.statusMessage = `这所学校尚未建立初始版本，请管理员先在 ${this.schoolShortName} 统一工作台保存一次。`;
      return;
    }
    const summary = this.changeSummary.trim();
    if (!summary) {
      this.statusKind = 'error';
      this.statusMessage = '提交审核前，请先填写“本次修改说明”，写清楚改了哪些图片备注。';
      return;
    }
    this.isSubmitting = true;
    this.statusMessage = '';
    const saveRequest = !hasInitialVersion && this.canPublish
      ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
      : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary);
    saveRequest
      .pipe(
        switchMap(() => this.contentService.submitForReview<CiaContentConfig>(this.selectedSchool!.id, 'QuoteImage')),
        finalize(() => this.isSubmitting = false),
      ).subscribe({
        next: revision => {
          this.statusKind = 'success';
          this.statusMessage = `版本 ${revision.version} 已提交管理员审核，新生成的图片尚未改变。`;
          this.changeSummary = '';
          this.loadEditor(this.selectedSchool!.id, false);
        },
        error: () => {
          this.statusKind = 'error';
          this.statusMessage = '提交审核失败，请先确认草稿可以正常保存。';
        },
      });
  }

  publish(): void {
    if (!this.selectedSchool?.id || !this.canPublish || this.isPublishing) return;
    if (!this.editor?.pendingReview) {
      this.statusKind = 'warning';
      this.statusMessage = '没有待审核版本。请先填写修改说明并提交审核。';
      return;
    }
    if (!window.confirm(`发布后，新生成的 ${this.schoolShortName} 报价图片会立即使用这些说明。确定发布吗？`)) return;
    this.isPublishing = true; this.statusMessage = '';
    this.contentService.publish<CiaContentConfig>(this.selectedSchool.id).pipe(finalize(() => this.isPublishing = false))
      .subscribe({
        next: revision => { this.statusKind = 'success'; this.statusMessage = `版本 ${revision.version} 已发布，之后生成的报价图片已同步。`; this.changeSummary = ''; this.loadEditor(this.selectedSchool!.id, false); },
        error: () => { this.statusKind = 'error'; this.statusMessage = '发布失败，当前已发布内容没有改变。'; },
      });
  }

  returnForChanges(): void {
    if (!this.selectedSchool?.id || !this.canPublish || !this.editor?.pendingReview) return;
    const reason = window.prompt('请填写需要员工修改的图片说明：');
    if (reason === null) return;
    this.contentService.returnToDraft<CiaContentConfig>(this.selectedSchool.id, reason.trim()).subscribe({
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

  private loadSchools(): void {
    this.schoolService.getSchools().subscribe({
      next: schools => {
        this.schools = schools ?? [];
        const queryId = this.route.snapshot.queryParamMap.get('schoolId');
        const school = this.schools.find(item => item.id === queryId) ?? this.schools.find(item => item.name === this.ciaSchoolName) ?? this.schools.find(item => item.name.toLowerCase().includes('cia'));
        if (school) this.selectSchoolId(school.id); else this.isLoading = false;
      },
      error: () => { this.isLoading = false; this.statusKind = 'error'; this.statusMessage = '学校列表加载失败。'; },
    });
  }

  private loadEditor(schoolId: string, showLoading = true): void {
    if (showLoading) this.isLoading = true;
    this.contentService.getEditor<CiaContentConfig>(schoolId).pipe(catchError(() => of(null))).subscribe(editor => {
      this.editor = editor ?? undefined;
      const stored = editor?.draft?.content ?? editor?.pendingReview?.content ?? editor?.published?.content;
      const defaults = this.createSelectedDefaults();
      this.content = this.cloneSelectedContent(stored ?? defaults);
      this.previewQuote = this.buildPreviewQuote();
      this.isLoading = false;
    });
  }

  private buildPreviewQuote(): QuoteImageCardData {
    const settings = this.content.quoteImageSettings;
    const schoolCode = this.content.schoolCode;
    const isPines = schoolCode === 'PINES';
    const isMonol = schoolCode === 'MONOL';
    const isEv = schoolCode === 'EV';
    const isSmeag = schoolCode === 'SMEAG';
    const isPhilinter = schoolCode === 'PHILINTER';
    const isCgBanilad = schoolCode === 'CG-BANILAD';
    const isCgSparta = schoolCode === 'CG-SPARTA';
    const isCpi = schoolCode === 'CPI';
    const isBCebu = schoolCode === 'BCEBU';
    const isCpils = schoolCode === 'CPILS';
    const isGlc = schoolCode === 'GLC';
    const isIbreeze = schoolCode === 'IBREEZE';
    const isAnj = schoolCode === 'ANJ';
    const isBeci = schoolCode === 'BECI';
    const isJic = schoolCode === 'JIC';
    const beciName = this.beciCampus === 'eop' ? '菲律宾碧瑶BECI EOP校区' : this.beciCampus === 'sparta' ? '菲律宾碧瑶BECI斯巴达校区' : '菲律宾碧瑶API BECI City校区';
    const schoolName = isJic ? '菲律宾碧瑶JIC语言学校' : isBeci ? beciName : isAnj ? '菲律宾碧瑶A&J语言学校' : isIbreeze ? '菲律宾宿务I.BREEZE语言学校' : isGlc ? '菲律宾宿务Global Language Cebu' : isCpils ? '菲律宾宿务CPILS语言学校' : isBCebu ? "菲律宾宿务B'Cebu语言学校" : isCpi ? '菲律宾宿务CPI语言学校' : isCgSparta ? '菲律宾宿务CG Academy斯巴达校区' : isCgBanilad ? '菲律宾宿务CG Academy Banilad校区' : isPhilinter ? '菲律宾宿务Philinter语言学校' : isSmeag ? '菲律宾宿务SMEAG Capital语言学校' : isEv ? '菲律宾宿务EV Academy' : isMonol ? '菲律宾碧瑶MONOL语言学校' : isPines ? '菲律宾碧瑶PINES语言学校' : 'CIA';
    const heroSrc = isJic ? '/assets/philippines/jic-main-campus-overview.png' : isBeci ? (this.beciCampus === 'eop' ? '/assets/philippines/beci-eop-campus.jpg' : this.beciCampus === 'sparta' ? '/assets/philippines/beci-campus-blue-roof.png' : '/assets/philippines/beci-city-study-lounge.png') : isAnj ? '/assets/philippines/anj-campus-hero.jpg' : isIbreeze ? '/assets/ibreeze/campus-main.jpg' : isGlc ? '/assets/glc/campus-main.jpg' : isCpils ? '/assets/cpils/campus-main.jpg' : isBCebu ? '/assets/philippines/bcebu-campus-hero.webp' : isCpi ? '/assets/cpi/campus-exterior.jpg' : isCgSparta ? '/assets/philippines/cg-sparta-campus-hero.jpg' : isCgBanilad ? '/assets/philippines/cg-banilad-campus-hero.jpg' : isPhilinter ? '/assets/philinter/campus-main.jpeg' : isSmeag ? '/assets/philippines/smeag-capital-building.png' : isEv ? '/assets/ev/campus-exterior.jpg' : isMonol ? '/assets/philippines/monol-campus-building.jpg' : isPines ? '/assets/philippines/pines-campus-hero.jpg' : '/assets/cia/campus-building.png';
    const courseId = isJic ? 'challenger-esl-lite' : isBeci ? (this.beciCampus === 'eop' ? 'eop-lite-esl' : this.beciCampus === 'sparta' ? 'sparta-24-esl' : 'city-lite-esl') : isAnj ? 'eco-relax-lite' : isIbreeze ? 'intensive-speaking' : isGlc ? 'power-speaking' : isCpils ? 'general-esl' : isBCebu ? 'speed-esl' : isCpi ? 'esl-general-15' : isCgSparta ? 'sparta' : isCgBanilad ? 'general-esl' : isPhilinter ? 'light-esl' : isSmeag ? 'esl-regular-ket-pet-fce' : isEv ? 'semi-sparta-esl' : isMonol ? 'esl-4' : isPines ? 'light-esl-4' : 'regular-esl';
    const roomId = isJic ? 'challenger-quad-bunk' : isBeci ? (this.beciCampus === 'eop' ? 'eop-quad-female' : this.beciCampus === 'sparta' ? 'sparta-quad' : 'city-studio-quad') : isAnj ? 'deluxe-triple' : isIbreeze ? 'quad-main' : isGlc ? 'annex-double' : isCpils ? 'regular-quad' : isBCebu ? 'triple-bunk' : isCpi ? 'building-a-quad' : isCgSparta ? 'quad' : isCgBanilad ? 'quad' : isPhilinter ? 'in-campus-triple' : isSmeag ? 'campus-quad' : isEv ? 'quad-bunk' : isMonol ? 'quad-room' : isPines ? 'main-sextuple' : 'd4';
    const course = this.content.courses.find(item => item.id === courseId) ?? this.content.courses[0];
    const room = this.content.rooms.find(item => item.id === roomId) ?? this.content.rooms[0];
    const registration = this.content.quoteSettings.registrationFee;
    const courseAmount = (course?.tuition ?? 0) * (isGlc ? 4 : 1);
    const roomAmount = (room?.fee ?? 0) * (isGlc ? 4 : 1);
    const registrationWaiver = isJic ? 0 : this.content.quoteSettings.promotions.some(item => item.enabled && item.waiveRegistration && !item.id.includes('returning')) ? registration : 0;
    const percentage = isBeci ? undefined : this.content.quoteSettings.promotions.find(item => item.enabled && item.discountType === 'percentage');
    const promotionAmount = Math.round((courseAmount + roomAmount) * ((percentage?.discountValue ?? 0) / 100) * 100) / 100;
    const fixedPromotions = isMonol
      ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.discountType === 'fixed' && item.id.endsWith('-late'))
      : isGlc
        ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.discountType === 'fixed' && ['glc-school-window-1', 'glc-sida'].includes(item.id))
        : isIbreeze
          ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.id === 'september-multi')
          : isAnj
            ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.ruleKind === 'anj-new-period' && '2026-09-06' >= (item.arrivalStart ?? '') && '2026-09-06' <= (item.arrivalEnd ?? '9999-12-31'))
          : isJic
            ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.ruleKind === 'jic-off-season-2026' && '2026-09-06' >= (item.arrivalStart ?? '') && '2026-09-06' <= (item.arrivalEnd ?? '9999-12-31'))
          : isBeci
            ? this.content.quoteSettings.promotions.filter(item => item.enabled && ((item.discountType === 'percentage' && '2026-09-06' >= (item.arrivalStart ?? '') && '2026-09-06' <= (item.arrivalEnd ?? '9999-12-31')) || item.ruleKind === 'beci-long-stay'))
          : [];
    const previewFixedAmount = (item: typeof fixedPromotions[number]) => isAnj
      ? (item.discountTiers?.['4'] ?? 0) + (item.incrementValue ?? 0)
      : isJic ? item.discountValue
      : isBeci && item.discountType === 'percentage'
        ? Math.round((courseAmount + roomAmount) * item.discountValue) / 100
        : isBeci ? (item.discountTiers?.['4'] ?? 0) : item.discountValue;
    const fixedPromotionAmount = fixedPromotions.reduce((sum, item) => sum + previewFixedAmount(item), 0);
    const totalUsd = Math.max(0, registration + courseAmount + roomAmount - registrationWaiver - promotionAmount - fixedPromotionAmount);
    const includedFees = this.imageFeeRows.filter(fee => fee.includeInTotal);
    const optionalFees = this.imageFeeRows.filter(fee => !fee.includeInTotal);
    const localFeeItems = includedFees.map(fee => this.previewLocalFee(fee));
    const localFeeTotal = includedFees.reduce((sum, fee) => sum + this.previewLocalFeeAmount(fee), 0);
    const base = buildPhilippinesDetailedQuote({
      schoolCode, schoolName, filePrefix: schoolCode, heroSrc, weeks: 4,
      startDate: '2026-09-06', usdToCny: 6.71, totalUsd, fullFeeDetails: true, localFeeTableLayout: 'web',
      paymentItems: [
        { icon: '注', label: '注册费', amount: `${this.previewMoney(registration)} 美元`, note: settings.paymentNotes.registration },
        { icon: '课', label: '课程名称', detailTitle: course?.name ?? '课程', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: `${this.previewMoney(courseAmount)} 美元`, note: this.joinNotes(course?.schedule ?? '', settings.paymentNotes.course) },
        { icon: '宿', label: '住宿名称', detailTitle: room?.name ?? '住宿', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: `${this.previewMoney(roomAmount)} 美元`, note: settings.paymentNotes.accommodation },
        ...(registrationWaiver ? [{ icon: '免', label: '免注册费', amount: `− ${this.previewMoney(registrationWaiver)} 美元`, note: settings.paymentNotes.registration, accent: true }] : []),
        ...(promotionAmount ? [{ icon: '惠', label: percentage?.name ?? '优惠', amount: `− ${this.previewMoney(promotionAmount)} 美元`, note: this.joinNotes(percentage?.description, settings.paymentNotes.promotion), accent: true }] : []),
        ...fixedPromotions
          .filter(item => previewFixedAmount(item) > 0)
          .map(item => ({ icon: '惠', label: item.name, amount: `− ${this.previewMoney(previewFixedAmount(item))} 美元`, note: this.joinNotes(item.description, settings.paymentNotes.promotion), accent: true })),
      ],
      localFeeItems,
      localFeeTotal, localCurrencyName: '比索', localFeeCny: Math.round(localFeeTotal / 9.33566), localFeeNote: settings.localFeeIntro,
      optionalFeeItems: [...optionalFees.map(fee => ({
        label: fee.name,
        amount: fee.secondaryAmount
          ? `${this.previewMoney(fee.amount)} 比索／${fee.secondaryLabel ?? '另一时段'} ${this.previewMoney(fee.secondaryAmount)} 比索`
          : `${this.previewMoney(fee.amount)} 比索`,
        cnyAmount: fee.secondaryAmount
          ? `约人民币 ${Math.round(fee.amount / 9.33566)}／${Math.round(fee.secondaryAmount / 9.33566)} 元`
          : `约人民币 ${Math.round(fee.amount / 9.33566)} 元`,
        note: settings.localFeeNotes[fee.id] ?? fee.note,
      })), ...(isIbreeze ? [
        {
          label: '宿务麦克坦机场接机',
          amount: `周日 ${this.previewMoney(this.content.quoteSettings.airportPickupSundayUsd ?? 30)} 美元／其他日期 ${this.previewMoney(this.content.quoteSettings.airportPickupSaturdayUsd ?? 50)} 美元`,
          note: '可选，须由顾问向学校确认航班和接机安排。',
        },
        {
          label: '房间押金（可退）',
          amount: `不足8周 ${this.previewMoney(this.content.quoteSettings.roomDepositUnder8Weeks ?? 3000)} 比索／8周及以上 ${this.previewMoney(this.content.quoteSettings.roomDeposit8WeeksOrMore ?? 5000)} 比索`,
          note: '无损坏及无欠费时按学校规定退还，不计入学杂费合计。',
        },
      ] : [])], ruleNotes: [],
    });
    return {
      ...applySchoolQuoteImageLayout(base, schoolCode, 4, '2026-09-06', totalUsd, 6.71),
      headingText: isJic ? 'JIC 挑战校区4周报价' : isBeci ? `BECI ${this.beciCampus === 'eop' ? 'EOP' : this.beciCampus === 'sparta' ? 'Sparta' : 'City'} 4周报价` : isAnj ? 'A&J 4周报价' : isIbreeze ? 'I.BREEZE4周报价' : isBCebu ? "B'Cebu4周报价" : isCgSparta ? 'CG斯巴达校区4周报价' : isCgBanilad ? 'CG Banilad4周报价' : isEv ? 'EV主校区4周报价' : isSmeag ? 'SMEAG Capital4周报价' : `${schoolCode}${isMonol ? ' ' : ''}4周报价`, paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle,
      serviceSectionTitle: settings.serviceSectionTitle, benefitItems: settings.benefits, serviceLocations: settings.serviceLocations,
      alumniBenefitTitle: settings.alumniBenefitTitle, alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
      noteTitle: settings.noteSectionTitle, importantNotes: settings.footerNotes,
    };
  }

  private previewLocalFee(fee: CiaLocalFeeRule) {
    const quantity = this.previewLocalFeeQuantity(fee);
    const unit = fee.billingRule === 'per-accommodation-period'
      ? `${this.previewMoney(fee.amount)} 比索／${fee.periodWeeks ?? 4}周`
      : fee.billingRule === 'per-course-period'
        ? `${this.previewMoney(fee.amount)} 比索／套`
        : fee.billingRule === 'visa-extension-schedule'
          ? `首续 ${this.previewMoney(fee.amount)} 比索`
          : `${this.previewMoney(fee.amount)} 比索／次`;
    return {
      label: fee.name,
      unit,
      quantity: String(quantity),
      amount: `${this.previewMoney(this.previewLocalFeeAmount(fee))} 比索`,
      note: this.settings.localFeeNotes[fee.id] ?? fee.note,
    };
  }

  private previewLocalFeeQuantity(fee: CiaLocalFeeRule): number {
    if (fee.id === 'manila-pickup' || fee.id === 'clark-pickup' || fee.id === 'cebu-pickup' || fee.id === 'off-campus-management') return 0;
    if (this.isJicSelected && (fee.id === 'challenger-elective' || fee.id === 'ielts-guarantee')) return 0;
    if (['first-visa-extension', 'long-term-or-first-extension', 'visa-extension-schedule'].includes(fee.billingRule)) return 0;
    return 1;
  }

  private previewLocalFeeAmount(fee: CiaLocalFeeRule): number {
    return fee.amount * this.previewLocalFeeQuantity(fee);
  }

  private previewMoney(value: number): string {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  private joinNotes(...parts: Array<string | undefined>): string {
    return parts.map(part => part?.trim()).filter(Boolean).join('；');
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
}
