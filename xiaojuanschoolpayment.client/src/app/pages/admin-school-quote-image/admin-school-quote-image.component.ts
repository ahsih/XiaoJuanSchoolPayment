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
  private previewTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly schoolService: SchoolService,
    private readonly contentService: SchoolContentService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void { this.loadSchools(); }
  ngOnDestroy(): void { clearTimeout(this.previewTimer); }

  get canPublish(): boolean {
    return this.authService.getRoles().some(role => role.toLowerCase() === 'admin');
  }
  get settings(): CiaQuoteImageSettings { return this.content.quoteImageSettings; }
  get isCiaSelected(): boolean { return this.selectedSchool?.name === this.ciaSchoolName || !!this.selectedSchool?.name.toLowerCase().includes('cia'); }
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
    if (this.isCiaSelected) this.loadEditor(school.id);
    else { this.isLoading = false; this.statusKind = 'warning'; this.statusMessage = '目前先完成 CIA 报价图片样板，确认后再复制给其他学校。'; }
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

  saveDraft(): void {
    if (!this.selectedSchool?.id || !this.isCiaSelected || this.isSaving) return;
    this.isSaving = true; this.statusMessage = '';
    const summary = this.changeSummary.trim() || '更新 CIA 报价图片说明';
    const request = this.canPublish
      ? this.contentService.saveDraft(this.selectedSchool.id, this.content, summary)
      : this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary);
    request
      .pipe(finalize(() => this.isSaving = false)).subscribe({
        next: draft => { this.statusKind = 'success'; this.statusMessage = `图片说明草稿已保存（版本 ${draft.version}），官网尚未发布。`; this.changeSummary = ''; this.loadEditor(this.selectedSchool!.id, false); },
        error: error => { this.statusKind = 'error'; this.statusMessage = error?.status === 403 ? '你没有这所学校的报价图片编辑权限。' : '草稿保存失败，请稍后重试。'; },
      });
  }

  submitForReview(): void {
    if (!this.selectedSchool?.id || !this.isCiaSelected || this.isSubmitting) return;
    this.isSubmitting = true;
    this.statusMessage = '';
    const summary = this.changeSummary.trim() || '提交 CIA 报价图片说明审核';
    this.contentService.saveQuoteImageDraft<CiaContentConfig, CiaQuoteImageSettings>(this.selectedSchool.id, this.settings, summary)
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
    if (!window.confirm('发布后，新生成的 CIA 报价图片会立即使用这些说明。确定发布吗？')) return;
    this.isPublishing = true; this.statusMessage = '';
    const request = this.editor?.pendingReview
      ? this.contentService.publish<CiaContentConfig>(this.selectedSchool.id)
      : this.contentService.saveDraft(this.selectedSchool.id, this.content, this.changeSummary.trim() || '管理员发布 CIA 报价图片说明')
          .pipe(switchMap(() => this.contentService.publish<CiaContentConfig>(this.selectedSchool!.id)));
    request.pipe(finalize(() => this.isPublishing = false))
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
      this.content = cloneCiaContentConfig(stored ?? createDefaultCiaContentConfig());
      this.previewQuote = this.buildPreviewQuote();
      this.isLoading = false;
    });
  }

  private buildPreviewQuote(): QuoteImageCardData {
    const settings = this.content.quoteImageSettings;
    const course = this.content.courses.find(item => item.id === 'regular-esl') ?? this.content.courses[0];
    const includedFees = this.imageFeeRows.filter(fee => fee.includeInTotal);
    const optionalFees = this.imageFeeRows.filter(fee => !fee.includeInTotal);
    const localFeeItems = includedFees.map(fee => this.previewLocalFee(fee));
    const localFeeTotal = includedFees.reduce((sum, fee) => sum + this.previewLocalFeeAmount(fee), 0);
    const base = buildPhilippinesDetailedQuote({
      schoolCode: 'CIA', schoolName: 'CIA', filePrefix: 'CIA', heroSrc: '/assets/cia/campus-building.png', weeks: 4,
      startDate: '2026-09-06', usdToCny: 6.71, totalUsd: 1667.5, fullFeeDetails: true, localFeeTableLayout: 'web',
      paymentItems: [
        { icon: '注', label: '注册费', amount: '100 美元', note: settings.paymentNotes.registration },
        { icon: '课', label: '课程名称', detailTitle: course?.name ?? 'Regular ESL', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: '900 美元', note: this.joinNotes(course?.schedule ?? '', settings.paymentNotes.course) },
        { icon: '宿', label: '住宿名称', detailTitle: '四人间 D-4', detailSubtitle: '2026/09/06–2026/10/03 · 4周', amount: '750 美元', note: settings.paymentNotes.accommodation },
        { icon: '惠', label: '思达折扣', amount: '− 82.5 美元', note: this.joinNotes('课程费和住宿费享95折', settings.paymentNotes.promotion), accent: true },
      ],
      localFeeItems,
      localFeeTotal, localCurrencyName: '比索', localFeeCny: Math.round(localFeeTotal / 9.33566), localFeeNote: settings.localFeeIntro,
      optionalFeeItems: optionalFees.map(fee => ({
        label: fee.name,
        amount: fee.secondaryAmount
          ? `${this.previewMoney(fee.amount)} 比索／${fee.secondaryLabel ?? '另一时段'} ${this.previewMoney(fee.secondaryAmount)} 比索`
          : `${this.previewMoney(fee.amount)} 比索`,
        cnyAmount: fee.secondaryAmount
          ? `约人民币 ${Math.round(fee.amount / 9.33566)}／${Math.round(fee.secondaryAmount / 9.33566)} 元`
          : `约人民币 ${Math.round(fee.amount / 9.33566)} 元`,
        note: settings.localFeeNotes[fee.id] ?? fee.note,
      })), ruleNotes: [],
    });
    return {
      ...applySchoolQuoteImageLayout(base, 'CIA', 4, '2026-09-06', 1667.5, 6.71),
      headingText: 'CIA4周报价', paymentSectionTitle: settings.paymentSectionTitle, localFeeTitle: settings.localFeeSectionTitle,
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
}
