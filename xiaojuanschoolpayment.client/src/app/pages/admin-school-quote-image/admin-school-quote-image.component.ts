import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { QuoteImageInlinePreviewComponent } from '../../components/quote-image-inline-preview.component';
import { buildPhilippinesDetailedQuote } from '../../components/philippines-quote-image-data';
import { applyEditableQuoteImageCopy, applySchoolQuoteImageLayout, quoteImageSupplementalKey } from '../../components/school-quote-plan';
import { QuoteImageCardData } from '../../components/quote-image-download-button.component';
import { SchoolDTO } from '../../../interfaces/school.dto';
import { SchoolContentEditorDTO } from '../../../interfaces/school-content.dto';
import { AuthService } from '../../../services/auth.service';
import { SchoolContentService } from '../../../services/school-content.service';
import { SchoolService } from '../../../services/school.service';
import {
  CiaContentConfig,
  CiaLocalFeeRule,
  CiaPromotionRule,
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
  cloneImsContentConfig,
  createDefaultImsContentConfig,
} from '../philippines/ims-school/ims-content-config';
import {
  cloneBeciContentConfig,
  createDefaultBeciContentConfig,
} from '../philippines/beci-school/beci-content-config';
import {
  cloneJicContentConfig,
  createDefaultJicContentConfig,
} from '../philippines/jic-school/jic-content-config';
import {
  cloneIclContentConfig,
  cloneIuContentConfig,
  createDefaultIclContentConfig,
  createDefaultIuContentConfig,
} from '../philippines/iu-school/iu-icl-content-config';
import { IuIclQuote } from '../philippines/iu-school/iu-icl-quote';
import { BeciCampus } from '../philippines/beci-quote/beci-pricing';
import { cloneCellaContentConfig, createDefaultCellaContentConfig } from '../philippines/cella-quote/cella-content-config';
import { cloneFellaContentConfig, createDefaultFellaContentConfig, fellaQuoteImageSettings } from '../philippines/fella-school/fella-content-config';
import { cloneBtesContentConfig, cloneBlueOceanContentConfig, cloneTargetContentConfig, cloneWalesContentConfig, createDefaultBtesContentConfig, createDefaultBlueOceanContentConfig, createDefaultTargetContentConfig, createDefaultWalesContentConfig } from '../philippines/remaining-content-config';

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
  hasUnsavedChanges = false;
  beciCampus: BeciCampus = 'eop';
  fellaCampus: 'campus1' | 'campus2' = 'campus1';
  supplementalNoteRows: Array<{ id: string; label: string; fallback: string; section: '学校费用' | '参考费用' }> = [];
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
    const fellaCampus = this.route.snapshot.queryParamMap.get('fellaCampus');
    if (fellaCampus === 'campus1' || fellaCampus === 'campus2') this.fellaCampus = fellaCampus;
    this.loadSchools();
  }
  ngOnDestroy(): void { clearTimeout(this.previewTimer); }

  get canPublish(): boolean {
    return this.authService.getRoles().some(role => ['admin', 'manager'].includes(role.toLowerCase()));
  }
  get settings(): CiaQuoteImageSettings { return this.isFellaSelected ? fellaQuoteImageSettings(this.content, this.fellaCampus) : this.content.quoteImageSettings; }
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
  get isImsSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('ims academy')||name.includes('宿务ims'); }
  get isBeciSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return !this.isBCebuSelected&&(name.includes('beci')||name.includes('api beci')); }
  get isJicSelected(): boolean { return !!this.selectedSchool?.name.toLowerCase().includes('jic'); }
  get isIuSelected(): boolean { return (this.selectedSchool?.name.toLowerCase() ?? '').includes('iu english academy'); }
  get isIclSelected(): boolean { return (this.selectedSchool?.name.toLowerCase() ?? '').includes('icl english academy'); }
  get isCellaUniSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('cella')&&(name.includes('uni')||name.includes('sparta')); }
  get isCellaPremiumSelected(): boolean { const name=this.selectedSchool?.name.toLowerCase()??''; return name.includes('cella')&&name.includes('premium'); }
  get isFellaSelected(): boolean { return (this.selectedSchool?.name.toLowerCase()??'').includes('english fella'); }
  get isBtesSelected(): boolean { const n=this.selectedSchool?.name.toLowerCase()??''; return n.includes('btes')||n.includes('brainy tutelage'); }
  get isBlueOceanSelected(): boolean { return (this.selectedSchool?.name.toLowerCase()??'').includes('cebu blue ocean'); }
  get isTargetSelected(): boolean { const n=this.selectedSchool?.name.toLowerCase()??''; return n.includes('target')&&n.includes('english'); }
  get isWalesSelected(): boolean { return (this.selectedSchool?.name.toLowerCase()??'').includes('wales'); }
  get isSupportedSchool(): boolean { return this.isCiaSelected || this.isPinesSelected || this.isMonolSelected || this.isEvSelected || this.isSmeagSelected || this.isPhilinterSelected || this.isCgBaniladSelected || this.isCgSpartaSelected || this.isCpiSelected || this.isBCebuSelected || this.isCpilsSelected || this.isGlcSelected || this.isIbreezeSelected || this.isAnjSelected || this.isImsSelected || this.isBeciSelected || this.isJicSelected || this.isIuSelected || this.isIclSelected || this.isCellaUniSelected || this.isCellaPremiumSelected || this.isFellaSelected || this.isBtesSelected || this.isBlueOceanSelected || this.isTargetSelected || this.isWalesSelected; }
  get schoolShortName(): string { return this.isWalesSelected ? 'WALES' : this.isTargetSelected ? 'TARGET' : this.isBlueOceanSelected ? 'Cebu Blue Ocean' : this.isBtesSelected ? 'BTES' : this.isFellaSelected ? `English Fella ${this.fellaCampus === 'campus1' ? '第一校区' : '第二校区'}` : this.isCellaPremiumSelected ? 'CELLA Premium' : this.isCellaUniSelected ? 'CELLA Uni Sparta' : this.isIclSelected ? 'ICL' : this.isIuSelected ? 'IU' : this.isJicSelected ? 'JIC' : this.isBeciSelected ? `BECI ${this.beciCampus === 'eop' ? 'EOP' : this.beciCampus === 'sparta' ? 'Sparta' : 'City'}` : this.isImsSelected ? 'IMS' : this.isAnjSelected ? 'A&J' : this.isIbreezeSelected ? 'I.BREEZE' : this.isGlcSelected ? 'GLC' : this.isCpilsSelected ? 'CPILS' : this.isBCebuSelected ? "B'Cebu" : this.isCpiSelected ? 'CPI' : this.isCgSpartaSelected ? 'CG斯巴达' : this.isCgBaniladSelected ? 'CG Banilad' : this.isPhilinterSelected ? 'PHILINTER' : this.isSmeagSelected ? 'SMEAG' : this.isEvSelected ? 'EV' : this.isMonolSelected ? 'MONOL' : this.isPinesSelected ? 'PINES' : 'CIA'; }
  get imageFeeRows(): CiaLocalFeeRule[] {
    return this.content.localFees.filter(fee => fee.enabled).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  get imagePromotionRows(): CiaPromotionRule[] {
    return this.content.quoteSettings.promotions
      .filter(item => item.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  get imageSupplementalFeeRows() {
    return this.content.quoteSettings.extraNightRates ?? [];
  }
  promotionImageNote(item: CiaPromotionRule): string {
    return this.settings.promotionNotes?.[item.id] ?? item.description ?? this.settings.paymentNotes.promotion;
  }
  setPromotionImageNote(id: string, value: string): void {
    (this.settings.promotionNotes ??= {})[id] = value;
  }
  localFeeImageNote(fee: CiaLocalFeeRule): string {
    return this.settings.localFeeNotes[fee.id] ?? fee.note;
  }
  setLocalFeeImageNote(id: string, value: string): void {
    this.settings.localFeeNotes[id] = value;
  }
  supplementalFeeImageNote(id: string, fallback = ''): string {
    return this.settings.supplementalFeeNotes?.[id] ?? fallback;
  }
  setSupplementalFeeImageNote(id: string, value: string): void {
    (this.settings.supplementalFeeNotes ??= {})[id] = value;
  }
  get serviceLocationsText(): string { return this.settings.serviceLocations.join('、'); }
  set serviceLocationsText(value: string) { this.settings.serviceLocations = value.split(/[,，、]/).map(item => item.trim()).filter(Boolean).slice(0, 3); }

  selectSchoolId(id: string): void {
    const school = this.schools.find(item => item.id === id);
    if (!school) return;
    this.selectedSchool = school;
    if (this.isBeciSelected) {
      const requestedCampus = this.route.snapshot.queryParamMap.get('campus');
      if (school.name.toLowerCase().includes('city')) this.beciCampus = 'city';
      else if (requestedCampus !== 'sparta' && requestedCampus !== 'city') this.beciCampus = 'eop';
    }
    void this.router.navigate([], { relativeTo: this.route, queryParams: { schoolId: school.id, campus: this.isBeciSelected ? this.beciCampus : null }, queryParamsHandling: 'merge', replaceUrl: true });
    if (this.isSupportedSchool) this.loadEditor(school.id);
    else { this.isLoading = false; this.statusKind = 'warning'; this.statusMessage = "目前统一报价图片后台已接通 CIA、PINES、MONOL、EV、SMEAG Capital、Philinter、CG、CPI、B'Cebu、CPILS、GLC、I.BREEZE、A&J、IMS、BECI、JIC、IU、ICL、CELLA、English Fella、BTES、Cebu Blue Ocean、TARGET 与 WALES；这所学校尚未接入。"; }
  }

  selectBeciCampus(campus: BeciCampus): void {
    this.beciCampus = campus;
    void this.router.navigate([], { relativeTo: this.route, queryParams: { campus }, queryParamsHandling: 'merge', replaceUrl: true });
    this.refreshPreview();
  }

  contentChanged(): void {
    this.hasUnsavedChanges = true;
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.refreshPreview(), 260);
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
      : this.isFellaSelected
        ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
        : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary);
    request
      .pipe(finalize(() => this.isSaving = false)).subscribe({
        next: draft => { this.hasUnsavedChanges = false; this.statusKind = 'success'; this.statusMessage = `图片说明草稿已保存（版本 ${draft.version}），官网尚未发布。`; this.loadEditor(this.selectedSchool!.id, false); },
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
      : this.isFellaSelected
        ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
        : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary);
    saveRequest
      .pipe(
        switchMap(() => this.contentService.submitForReview<CiaContentConfig>(this.selectedSchool!.id, 'QuoteImage')),
        finalize(() => this.isSubmitting = false),
      ).subscribe({
        next: revision => {
          this.hasUnsavedChanges = false;
          this.statusKind = 'success';
          this.statusMessage = `版本 ${revision.version} 已提交管理审核，新生成的图片尚未改变。`;
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
    const publishExistingReview = !!this.editor?.pendingReview && !this.editor?.draft && !this.hasUnsavedChanges;
    const summary = this.changeSummary.trim();
    if (!publishExistingReview && !summary) {
      this.statusKind = 'error';
      this.statusMessage = '管理直接发布前，请填写“本次修改说明”，写清楚改了哪些图片备注。';
      return;
    }
    const actionText = publishExistingReview ? '审核通过后' : '直接发布后';
    if (!window.confirm(`${actionText}，新生成的 ${this.schoolShortName} 报价图片会立即使用这些说明。确定继续吗？`)) return;
    this.isPublishing = true; this.statusMessage = '';
    const hasInitialVersion = !!(this.editor?.draft || this.editor?.pendingReview || this.editor?.published);
    const publishRequest = publishExistingReview
      ? this.contentService.publish<CiaContentConfig>(this.selectedSchool.id)
      : (!hasInitialVersion
          ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
          : this.isFellaSelected
            ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
            : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary)
        ).pipe(switchMap(() => this.contentService.publish<CiaContentConfig>(this.selectedSchool!.id, summary)));
    publishRequest.pipe(finalize(() => this.isPublishing = false))
      .subscribe({
        next: revision => { this.hasUnsavedChanges = false; this.statusKind = 'success'; this.statusMessage = `版本 ${revision.version} 已发布，之后生成的报价图片已同步。`; this.changeSummary = ''; this.loadEditor(this.selectedSchool!.id, false); },
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
      this.hasUnsavedChanges = false;
      this.refreshPreview();
      this.isLoading = false;
    });
  }

  private buildPreviewQuote(): QuoteImageCardData {
    if (this.isIuSelected || this.isIclSelected) {
      const campus = this.isIuSelected ? 'IU' : 'ICL';
      const quote = new IuIclQuote(campus, 'power-speaking-4', campus === 'IU' ? 'campus-triple' : 'campus-quad', campus === 'IU' ? '2026-09-13' : '2026-10-04');
      quote.applyContentConfig(this.content);
      return quote.imageData(6.71, 9.33566, '2026-09-14', campus === 'IU' ? '/assets/philippines/iu-campus-hero.webp' : '/assets/philippines/icl-campus-hero.webp');
    }
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
    const isIms = schoolCode === 'IMS';
    const isBeci = schoolCode === 'BECI';
    const isJic = schoolCode === 'JIC';
    const isCellaUni = schoolCode === 'CELLA-UNI';
    const isCellaPremium = schoolCode === 'CELLA-PREMIUM';
    const isFella = schoolCode === 'FELLA';
    const isBtes = schoolCode === 'BTES';
    const isBlueOcean = schoolCode === 'BLUE-OCEAN';
    const isTarget = schoolCode === 'TARGET';
    const isWales = schoolCode === 'WALES';
    const beciName = this.beciCampus === 'eop' ? '菲律宾碧瑶BECI EOP校区' : this.beciCampus === 'sparta' ? '菲律宾碧瑶BECI斯巴达校区' : '菲律宾碧瑶API BECI City校区';
    const schoolName = isWales ? '菲律宾碧瑶WALES语言学校' : isTarget ? '菲律宾宿务TARGET Global English Academy' : isBlueOcean ? '菲律宾宿务Cebu Blue Ocean Academy' : isBtes ? '菲律宾宿务BTES语言学校' : isFella ? `菲律宾宿务English Fella${this.fellaCampus === 'campus1' ? '第一校区' : '第二校区'}` : isCellaPremium ? '菲律宾宿务CELLA Premium Campus' : isCellaUni ? '菲律宾宿务CELLA Uni Sparta Campus' : isJic ? '菲律宾碧瑶JIC语言学校' : isBeci ? beciName : isIms ? '菲律宾宿务IMS Academy' : isAnj ? '菲律宾碧瑶A&J语言学校' : isIbreeze ? '菲律宾宿务I.BREEZE语言学校' : isGlc ? '菲律宾宿务Global Language Cebu' : isCpils ? '菲律宾宿务CPILS语言学校' : isBCebu ? "菲律宾宿务B'Cebu语言学校" : isCpi ? '菲律宾宿务CPI语言学校' : isCgSparta ? '菲律宾宿务CG Academy斯巴达校区' : isCgBanilad ? '菲律宾宿务CG Academy Banilad校区' : isPhilinter ? '菲律宾宿务Philinter语言学校' : isSmeag ? '菲律宾宿务SMEAG Capital语言学校' : isEv ? '菲律宾宿务EV Academy' : isMonol ? '菲律宾碧瑶MONOL语言学校' : isPines ? '菲律宾碧瑶PINES语言学校' : 'CIA';
    const heroSrc = isWales ? '/assets/philippines/wales-school-building.webp' : isTarget ? '/assets/philippines/target-campus-hero.webp' : isBlueOcean ? '/assets/philippines/cebu-study-hero.webp' : isBtes ? '/assets/philippines/btes/campus-gate.webp' : isFella ? '/assets/fella/campus-main.webp' : (isCellaUni || isCellaPremium) ? '/assets/philippines/cebu-study-hero.webp' : isJic ? '/assets/philippines/jic-main-campus-overview.webp' : isBeci ? (this.beciCampus === 'eop' ? '/assets/philippines/beci-eop-campus.webp' : this.beciCampus === 'sparta' ? '/assets/philippines/beci-campus-blue-roof.webp' : '/assets/philippines/beci-city-study-lounge.webp') : isIms ? '/assets/ims/campus-hero.webp' : isAnj ? '/assets/philippines/anj-campus-hero.jpg' : isIbreeze ? '/assets/ibreeze/campus-main.webp' : isGlc ? '/assets/glc/campus-main.webp' : isCpils ? '/assets/cpils/campus-main.webp' : isBCebu ? '/assets/philippines/bcebu-campus-hero.webp' : isCpi ? '/assets/cpi/campus-exterior.webp' : isCgSparta ? '/assets/philippines/cg-sparta-campus-hero.webp' : isCgBanilad ? '/assets/philippines/cg-banilad-campus-hero.webp' : isPhilinter ? '/assets/philinter/campus-main.webp' : isSmeag ? '/assets/philippines/smeag-capital-building.webp' : isEv ? '/assets/ev/campus-exterior.webp' : isMonol ? '/assets/philippines/monol-campus-building.webp' : isPines ? '/assets/philippines/pines-campus-hero.webp' : '/assets/cia/campus-building.webp';
    const courseId = isJic ? 'challenger-esl-lite' : isBeci ? (this.beciCampus === 'eop' ? 'eop-lite-esl' : this.beciCampus === 'sparta' ? 'sparta-24-esl' : 'city-lite-esl') : isIms ? 'essential-esl-4' : isAnj ? 'eco-relax-lite' : isIbreeze ? 'intensive-speaking' : isGlc ? 'power-speaking' : isCpils ? 'general-esl' : isBCebu ? 'speed-esl' : isCpi ? 'esl-general-15' : isCgSparta ? 'sparta' : isCgBanilad ? 'general-esl' : isPhilinter ? 'light-esl' : isSmeag ? 'esl-regular-ket-pet-fce' : isEv ? 'semi-sparta-esl' : isMonol ? 'esl-4' : isPines ? 'light-esl-4' : 'regular-esl';
    const roomId = isJic ? 'challenger-quad-bunk' : isBeci ? (this.beciCampus === 'eop' ? 'eop-quad-female' : this.beciCampus === 'sparta' ? 'sparta-quad' : 'city-studio-quad') : isIms ? 'quadruple' : isAnj ? 'deluxe-triple' : isIbreeze ? 'quad-main' : isGlc ? 'annex-double' : isCpils ? 'regular-quad' : isBCebu ? 'triple-bunk' : isCpi ? 'building-a-quad' : isCgSparta ? 'quad' : isCgBanilad ? 'quad' : isPhilinter ? 'in-campus-triple' : isSmeag ? 'campus-quad' : isEv ? 'quad-bunk' : isMonol ? 'quad-room' : isPines ? 'main-sextuple' : 'd4';
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
          : isPhilinter
            ? this.content.quoteSettings.promotions.filter(item => item.enabled && item.id === 'philinter-low-season')
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
    const corePaymentItems = isTarget ? [
      { icon: '注', label: '注册费', amount: `${this.previewMoney(registration)} 美元`, note: settings.paymentNotes.registration },
      { icon: '套', label: '课程住宿套餐', detailTitle: `${course?.name ?? '课程'}｜${room?.name ?? '住宿'}`, detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: `${this.previewMoney(courseAmount)} 美元`, note: this.joinNotes(settings.paymentNotes.course, settings.paymentNotes.accommodation) },
    ] : [
      { icon: '注', label: '注册费', amount: `${this.previewMoney(registration)} 美元`, note: settings.paymentNotes.registration },
      { icon: '课', label: '课程名称', detailTitle: course?.name ?? '课程', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: `${this.previewMoney(courseAmount)} 美元`, note: this.joinNotes(course?.schedule ?? '', settings.paymentNotes.course) },
      { icon: '宿', label: '住宿名称', detailTitle: room?.name ?? '住宿', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: `${this.previewMoney(roomAmount)} 美元`, note: settings.paymentNotes.accommodation },
    ];
    const base = buildPhilippinesDetailedQuote({
      schoolCode, schoolName, filePrefix: schoolCode, heroSrc, weeks: 4,
      startDate: '2026-09-06', usdToCny: 6.71, totalUsd, fullFeeDetails: true, localFeeTableLayout: 'web',
      paymentItems: [
        ...corePaymentItems,
        ...(registrationWaiver ? [{ icon: '免', label: '免注册费', amount: `− ${this.previewMoney(registrationWaiver)} 美元`, note: settings.paymentNotes.registration, accent: true }] : []),
        ...(promotionAmount && percentage ? [{ icon: '惠', label: percentage.name ?? '优惠', amount: `− ${this.previewMoney(promotionAmount)} 美元`, note: this.promotionImageNote(percentage), accent: true }] : []),
        ...fixedPromotions
          .filter(item => previewFixedAmount(item) > 0)
          .map(item => ({ icon: '惠', label: item.name, amount: `− ${this.previewMoney(previewFixedAmount(item))} 美元`, note: this.promotionImageNote(item), accent: true })),
      ],
      localFeeItems,
      localFeeTotal, localCurrencyName: '比索', localFeeCny: Math.round(localFeeTotal / 9.33566), localFeeNote: settings.localFeeIntro,
      optionalFeeItems: [...optionalFees.map(fee => ({
        label: fee.name,
        amount: fee.currency === 'USD'
          ? `${this.previewMoney(fee.amount)} 美元${fee.periodWeeks ? `／${fee.periodWeeks}周` : ''}`
          : fee.secondaryAmount
          ? `${this.previewMoney(fee.amount)} 比索／${fee.secondaryLabel ?? '另一时段'} ${this.previewMoney(fee.secondaryAmount)} 比索`
          : `${this.previewMoney(fee.amount)} 比索`,
        cnyAmount: fee.currency === 'USD'
          ? '按实际选择计入学校美元应付'
          : fee.secondaryAmount
          ? `约人民币 ${Math.round(fee.amount / 9.33566)}／${Math.round(fee.secondaryAmount / 9.33566)} 元`
          : `约人民币 ${Math.round(fee.amount / 9.33566)} 元`,
        note: this.localFeeImageNote(fee),
      })), ...(isPhilinter ? this.imageSupplementalFeeRows.map((item, index) => ({
        label: item.label,
        amount: `${this.previewMoney(item.amount)} 比索`,
        cnyAmount: `约人民币 ${Math.round(item.amount / 9.33566)} 元`,
        note: this.supplementalFeeImageNote(`extra-night-${index}`, `${this.previewMoney(item.amount)}比索／晚参考；按实际额外入住晚数另付，须确认空房及入住安排，不自动乘人数。`),
      })) : []), ...(isIbreeze ? [
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
    return applyEditableQuoteImageCopy({
      ...applySchoolQuoteImageLayout(base, schoolCode, 4, '2026-09-06', totalUsd, 6.71),
      headingText: isWales ? 'WALES 4周报价' : isTarget ? 'TARGET 4周报价' : isBlueOcean ? 'Cebu Blue Ocean 4周报价' : isBtes ? 'BTES 4周报价' : isFella ? `English Fella ${this.fellaCampus === 'campus1' ? '第一校区' : '第二校区'}4周报价` : isCellaPremium ? 'CELLA Premium 4周报价' : isCellaUni ? 'CELLA Uni Sparta 4周报价' : isJic ? 'JIC 挑战校区4周报价' : isBeci ? `BECI ${this.beciCampus === 'eop' ? 'EOP' : this.beciCampus === 'sparta' ? 'Sparta' : 'City'} 4周报价` : isIms ? 'IMS 4周报价' : isAnj ? 'A&J 4周报价' : isIbreeze ? 'I.BREEZE4周报价' : isBCebu ? "B'Cebu4周报价" : isCgSparta ? 'CG斯巴达校区4周报价' : isCgBanilad ? 'CG Banilad4周报价' : isEv ? 'EV主校区4周报价' : isSmeag ? 'SMEAG Capital4周报价' : `${schoolCode}${isMonol ? ' ' : ''}4周报价`, paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle,
      serviceSectionTitle: settings.serviceSectionTitle, benefitItems: settings.benefits, serviceLocations: settings.serviceLocations,
      alumniBenefitTitle: settings.alumniBenefitTitle, alumniBenefitItems: [{ title: settings.alumniBenefitTitle, subtitle: '', text: settings.alumniBenefitText }],
      noteTitle: settings.noteSectionTitle, importantNotes: settings.footerNotes,
    }, settings, this.content.quoteSettings.promotions, this.content.localFees);
  }

  selectFellaCampus(campus: 'campus1' | 'campus2'): void {
    this.fellaCampus = campus;
    void this.router.navigate([], { relativeTo: this.route, queryParams: { fellaCampus: campus }, queryParamsHandling: 'merge', replaceUrl: true });
    this.refreshPreview();
  }

  private refreshPreview(): void {
    this.previewQuote = this.buildPreviewQuote();
    const rows = new Map<string, { id: string; label: string; fallback: string; section: '学校费用' | '参考费用' }>();
    const add = (id: string, label: string, fallback: string, section: '学校费用' | '参考费用') => {
      if (!rows.has(id)) rows.set(id, { id, label, fallback, section });
    };
    this.previewQuote.paymentItems
      .filter(item => !['注', '课', '宿'].includes(item.icon) && !this.previewPromotionFor(item.label, item.note))
      .forEach(item => add(quoteImageSupplementalKey('payment', item.label), item.label, item.note ?? '', '学校费用'));
    (this.previewQuote.optionalFeeItems ?? [])
      .filter(item => !this.content.localFees.some(fee => fee.name === item.label || fee.futureName === item.label))
      .forEach(item => add(quoteImageSupplementalKey('optional', item.label), item.label, item.note, '参考费用'));
    this.knownSupplementalNoteRows().forEach(item => add(item.id, item.label, item.fallback, item.section));
    this.imageSupplementalFeeRows.forEach((item, index) =>
      add(`extra-night-${index}`, item.label, `${this.previewMoney(item.amount)}比索／晚参考；按实际额外入住晚数另付，须确认空房及入住安排，不自动乘人数。`, '参考费用'));
    Object.entries(this.settings.supplementalFeeNotes ?? {}).forEach(([id, fallback]) => {
      if (id.startsWith('payment:')) add(id, id.slice('payment:'.length), fallback, '学校费用');
      else if (id.startsWith('optional:')) add(id, id.slice('optional:'.length), fallback, '参考费用');
    });
    this.supplementalNoteRows = [...rows.values()];
  }

  /**
   * Some calculated rows only appear for a particular age, date or optional service.
   * Keep those fields available even when the fixed preview scenario does not trigger them.
   */
  private knownSupplementalNoteRows(): Array<{ id: string; label: string; fallback: string; section: '学校费用' | '参考费用' }> {
    const fallback = '金额、日期与适用条件由报价计算器自动生成，最终以学校确认为准。';
    const paymentLabels: Record<string, string[]> = {
      CIA: ['旺季附加费'],
      EV: ['旺季附加费', '未成年管理费'],
      BCEBU: ['旺季附加费', '未成年单独在校管理费'],
      'CG-BANILAD': ['暑假附加费'],
      'CG-SPARTA': ['暑假附加费'],
      CPILS: ['暑假附加费'],
      PINES: ['旺季附加费'],
      ANJ: ['旺季附加费'],
      JIC: ['旺季附加费'],
      BECI: ['碧瑶旺季附加费'],
      IBREEZE: ['未成年管理费'],
      PHILINTER: ['暑期附加费'],
      'CELLA-UNI': ['暑期附加费', '未成年人管理费'],
      'CELLA-PREMIUM': ['暑期附加费', '未成年人管理费'],
      FELLA: ['未成年学生单独到校服务费'],
      BTES: ['未成年人管理费'],
      'BLUE-OCEAN': ['旺季附加费'],
    };
    const rows: Array<{ id: string; label: string; fallback: string; section: '学校费用' | '参考费用' }> = (paymentLabels[this.content.schoolCode] ?? []).map(label => ({
      id: quoteImageSupplementalKey('payment', label), label, fallback, section: '学校费用' as const,
    }));
    if (this.content.schoolCode === 'IMS') {
      rows.push(...['超额空调用电', '免费晚间托管', 'Guardian Service', '国际学生学校管理服务'].map(label => ({
        id: quoteImageSupplementalKey('optional', label), label, fallback, section: '参考费用' as const,
      })));
    }
    if (this.content.schoolCode === 'SMEAG') {
      rows.push({ id: 'optional:教材价格参考', label: '教材价格参考', fallback: '价格参考，不重复计入上方学杂费合计。', section: '参考费用' });
    }
    if (this.content.schoolCode === 'CELLA-UNI' || this.content.schoolCode === 'CELLA-PREMIUM') {
      rows.push(...['洗衣服务（价格参考）', '宿务麦克坦机场周日接机（价格参考）', '房间押金（可退参考）', '房间押金（需确认）'].map(label => ({
        id: quoteImageSupplementalKey('optional', label), label, fallback, section: '参考费用' as const,
      })));
    }
    if (this.content.schoolCode === 'FELLA') {
      rows.push(...['房间押金（可退）', '挂锁押金（可退）', '周日宿务机场接机', '其他时间宿务机场接机'].map(label => ({
        id: quoteImageSupplementalKey('optional', label), label, fallback, section: '参考费用' as const,
      })));
    }
    return rows;
  }

  private previewPromotionFor(label: string, note?: string): CiaPromotionRule | undefined {
    const clean = label.replace(/^学生[\d、]+\s*[·：]\s*/, '').replace(/（\d+人(?:合计|适用)?）/g, '');
    return this.imagePromotionRows.find(rule => clean === rule.name || clean.includes(rule.name) || (!!rule.description && (note ?? '').includes(rule.description)))
      ?? (clean.includes('思达') ? this.imagePromotionRows.find(rule => rule.name.includes('思达')) : undefined)
      ?? (clean.includes('淡季') ? this.imagePromotionRows.find(rule => rule.name.includes('淡季') || rule.ruleKind?.includes('off-season')) : undefined)
      ?? (clean.includes('长期') ? this.imagePromotionRows.find(rule => rule.name.includes('长期') || rule.ruleKind?.includes('long-stay')) : undefined)
      ?? (clean.includes('圣诞') ? this.imagePromotionRows.find(rule => rule.name.includes('圣诞') || rule.ruleKind?.includes('christmas')) : undefined)
      ?? (clean.includes('注册费') ? this.imagePromotionRows.find(rule => rule.waiveRegistration) : undefined);
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
      note: this.localFeeImageNote(fee),
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
    if (this.isWalesSelected) return createDefaultWalesContentConfig();
    if (this.isTargetSelected) return createDefaultTargetContentConfig();
    if (this.isBlueOceanSelected) return createDefaultBlueOceanContentConfig();
    if (this.isBtesSelected) return createDefaultBtesContentConfig();
    if (this.isFellaSelected) return createDefaultFellaContentConfig();
    if (this.isCellaPremiumSelected) return createDefaultCellaContentConfig('premium');
    if (this.isCellaUniSelected) return createDefaultCellaContentConfig('uni');
    if (this.isIclSelected) return createDefaultIclContentConfig();
    if (this.isIuSelected) return createDefaultIuContentConfig();
    if (this.isJicSelected) return createDefaultJicContentConfig();
    if (this.isBeciSelected) return createDefaultBeciContentConfig();
    if (this.isAnjSelected) return createDefaultAnjContentConfig();
    if (this.isImsSelected) return createDefaultImsContentConfig();
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
    if (this.isWalesSelected) return cloneWalesContentConfig(value);
    if (this.isTargetSelected) return cloneTargetContentConfig(value);
    if (this.isBlueOceanSelected) return cloneBlueOceanContentConfig(value);
    if (this.isBtesSelected) return cloneBtesContentConfig(value);
    if (this.isFellaSelected) return cloneFellaContentConfig(value);
    if (this.isCellaPremiumSelected) return cloneCellaContentConfig(value, 'premium');
    if (this.isCellaUniSelected) return cloneCellaContentConfig(value, 'uni');
    if (this.isIclSelected) return cloneIclContentConfig(value);
    if (this.isIuSelected) return cloneIuContentConfig(value);
    if (this.isJicSelected) return cloneJicContentConfig(value);
    if (this.isBeciSelected) return cloneBeciContentConfig(value);
    if (this.isAnjSelected) return cloneAnjContentConfig(value);
    if (this.isImsSelected) return cloneImsContentConfig(value);
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
