import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, forkJoin, of, Subscription, switchMap } from 'rxjs';
import { SchoolService } from '../../../../services/school.service';
import { SchoolContentService } from '../../../../services/school-content.service';
import { ExchangeRateService } from '../../../../services/exchange-rate.service';
import { CiaContentConfig } from '../cia-school/cia-content-config';
import { CiaPreviewTarget, isCiaPreviewTarget, resolveCiaPreviewTarget, revealCiaPreviewElement, scrollCiaPreviewElement } from '../cia-school/cia-content-preview';
import { ExpandableImageComponent } from '../../../components/expandable-image.component';
import { SchoolQuotePlanComponent } from '../../../components/school-quote-plan.component';
import { QuoteImageDownloadButtonComponent } from '../../../components/quote-image-download-button.component';
import { SidaWhySectionComponent } from '../../../components/sida-why-section.component';
import { cloneLaMerContentConfig, createDefaultLaMerContentConfig, isLaMerSchool, LA_MER_FAMILY_WEEKS, LA_MER_HERO } from './la-mer-content-config';
import { LaMerFamilyQuote, LaMerStudentQuote } from './la-mer-quote';
import { buildLaMerQuoteImage, LA_MER_FALLBACK_RATES, LaMerRates } from './la-mer-quote-image';

@Component({
  selector: 'app-la-mer-school', standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ExpandableImageComponent, SchoolQuotePlanComponent, QuoteImageDownloadButtonComponent, SidaWhySectionComponent],
  templateUrl: './la-mer-school.component.html',
  styleUrls: ['../cia-school/cia-school.component.css', '../school-quote-rollout.css', './la-mer-school.component.css'],
})
export class LaMerSchoolComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly schoolService = inject(SchoolService);
  private readonly contentService = inject(SchoolContentService);
  private readonly exchange = inject(ExchangeRateService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly subscriptions = new Subscription();
  private timer?: ReturnType<typeof setTimeout>;
  private previewReceived = false;
  readonly isEditorPreview = window.parent !== window && new URLSearchParams(window.location.search).get('contentPreview') === '1';
  content = createDefaultLaMerContentConfig();
  rates: LaMerRates = { ...LA_MER_FALLBACK_RATES };
  mode: 'ordinary' | 'family' = 'ordinary';
  count = 1;
  students = [new LaMerStudentQuote(() => this.content)];
  family = new LaMerFamilyQuote(() => this.content);
  readonly counts = Array.from({ length: 20 }, (_, i) => i + 1);
  readonly familyWeeks = LA_MER_FAMILY_WEEKS;
  readonly memberSlots = [0, 1, 2, 3];
  readonly nav = [{ id: 'overview', text: '学校概况' }, { id: 'courses', text: '课程设置' }, { id: 'family', text: '亲子课程' }, { id: 'rooms', text: '住宿与生活' }, { id: 'gallery', text: '校园相册' }, { id: 'fees', text: '费用与优惠' }, { id: 'quote', text: '获取报价' }, { id: 'rules', text: '入学须知' }];
  category = '全部'; galleryIndex = 0;
  get page() { return this.content.laMerPage!; }
  get courses() { return this.content.courses.filter(c => c.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get rooms() { return this.content.rooms.filter(c => c.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get fees() { return this.content.localFees.filter(c => c.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get promotions() { return this.content.quoteSettings.promotions.filter(p => p.enabled).sort((a, b) => a.sortOrder - b.sortOrder); }
  get peakRanges() { return this.content.quoteSettings.peakSeasonRanges.filter(r => r.enabled); }
  get hero() { return this.page.gallery.find(g => g.enabled && g.category === '校园与泳池')?.url || LA_MER_HERO; }
  photo(id: string) { return this.page.gallery.find(g => g.id === id && g.enabled); }
  get gallery() {
    const builtIn = this.page.gallery.filter(g => g.enabled);
    return [...builtIn, ...(this.content.media ?? []).filter(m => m.isActive && !!m.url && !m.contentType?.startsWith('video/') && !builtIn.some(g => g.url === m.url)).sort((a, b) => a.displayOrder - b.displayOrder)
      .map(m => ({ id: m.id, title: m.caption || m.altText || 'La Mer校园实景', category: m.category || '校园', url: m.url!, caption: m.altText || m.caption || '', enabled: true }))];
  }
  get videos() { return [...this.page.videos.filter(v => v.enabled), ...(this.content.media ?? []).filter(m => m.isActive && m.contentType?.startsWith('video/')).sort((a, b) => a.displayOrder - b.displayOrder).map(m => ({ title: m.caption || 'La Mer校园视频', url: m.url!, poster: this.hero, enabled: true }))]; }
  get categories() { return ['全部', ...new Set(this.gallery.map(g => g.category))]; }
  get filteredGallery() { return this.gallery.filter(g => this.category === '全部' || g.category === this.category); }
  get selectedPhoto() { return this.filteredGallery[this.galleryIndex] ?? this.filteredGallery[0]; }
  get galleryUrls() { return this.filteredGallery.map(g => g.url); }
  get galleryTitles() { return this.filteredGallery.map(g => g.title); }
  get galleryCaptions() { return this.filteredGallery.map(g => g.caption); }
  selectCategory(value: string) { this.category = value; this.galleryIndex = 0; }
  get activeStudents() { return this.students.slice(0, this.count); }
  setCount(value: number) { this.count = Math.max(1, Math.min(20, Math.trunc(value))); while (this.students.length < this.count) this.students.push(new LaMerStudentQuote(() => this.content)); }
  get error() { return this.mode === 'family' ? this.family.error : this.activeStudents.map((s, i) => s.result.error ? `${this.count > 1 ? `学生${i + 1}：` : ''}${s.result.error}` : '').filter(Boolean).join(' '); }
  get quoteImage() { return buildLaMerQuoteImage(this.content, this.activeStudents, this.mode === 'family' ? this.family : null, this.rates); }
  money(n: number) { return typeof n === 'number' && Number.isFinite(n) ? n.toLocaleString('zh-CN', { maximumFractionDigits: 2 }) : '待核对'; }
  scroll(id: string, event?: Event) { event?.preventDefault(); const el = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`); if (el) { revealCiaPreviewElement(el); window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 140, behavior: 'smooth' }); } }
  ngOnInit() {
    if (this.isEditorPreview) { try { const value = JSON.parse(sessionStorage.getItem('ev-lamer-content-preview') || 'null'); if (value?.schoolCode === 'EV-LAMER') { this.content = cloneLaMerContentConfig(value); this.previewReceived = true; } } catch {} }
    this.subscriptions.add(this.exchange.getLatestCnyRates().pipe(catchError(() => EMPTY)).subscribe(r => { if (r.usdToCny > 0 && r.phpPerCny > 0) this.rates = { ...r, source: 'Frankfurter参考汇率' }; }));
    this.subscriptions.add(this.schoolService.getSchools({ name: 'La Mer' }).pipe(switchMap(schools => {
      const school = schools.find(s => isLaMerSchool(s.name)); if (!school?.id) return EMPTY;
      return forkJoin({ published: this.contentService.getPublished<CiaContentConfig>(school.id).pipe(catchError(() => of(null))),
        lessons: this.schoolService.getSchoolLessons({ schoolId: school.id, week: 4 }).pipe(catchError(() => of([]))),
        rooms: this.schoolService.getSchoolRooms({ schoolId: school.id, week: 4 }).pipe(catchError(() => of([]))) });
    }), catchError(() => EMPTY)).subscribe(data => {
      if (this.previewReceived) return;
      if (data.published?.content) { this.content = cloneLaMerContentConfig(data.published.content); return; }
      for (const course of this.content.courses) { const match = data.lessons.find(l => l.name === course.name); if (match) course.tuition = match.price; }
      for (const room of this.content.rooms) { const match = data.rooms.find(r => r.name === room.name); if (match) room.fee = match.price; }
    }));
  }
  ngAfterViewInit() { if (this.isEditorPreview) window.parent.postMessage({ type: 'ev-lamer-content-ready' }, window.location.origin); }
  ngOnDestroy() { this.subscriptions.unsubscribe(); clearTimeout(this.timer); }
  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    if (!this.isEditorPreview || event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== 'ev-lamer-content-preview' || event.data.content?.schoolCode !== 'EV-LAMER') return;
    this.previewReceived = true; this.content = cloneLaMerContentConfig(event.data.content);
    if (isCiaPreviewTarget(event.data.target)) this.focusPreview(event.data.target, event.data.scroll === true);
  }
  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (!this.isEditorPreview || !(event.target instanceof Element)) return;
    const e = event.target.closest<HTMLElement>('[data-cia-preview-kind]');
    const target = { kind: e?.dataset['ciaPreviewKind'], id: e?.dataset['ciaPreviewId'] };
    if (isCiaPreviewTarget(target)) { this.focusPreview(target, false); window.parent.postMessage({ type: 'ev-lamer-content-select', ...target }, window.location.origin); }
  }
  private focusPreview(target: CiaPreviewTarget, scroll: boolean) {
    clearTimeout(this.timer); this.timer = setTimeout(() => {
      this.host.nativeElement.querySelectorAll('.preview-highlight').forEach(e => e.classList.remove('preview-highlight'));
      const result = resolveCiaPreviewTarget(this.host.nativeElement, target);
      result.elements.forEach(e => { e.classList.add('preview-highlight'); if (scroll) revealCiaPreviewElement(e); });
      if (scroll && result.elements[0]) scrollCiaPreviewElement(result.elements[0]);
      window.parent.postMessage({ type: 'ev-lamer-content-located', target, status: result.exact ? '已定位并用橙色标出对应内容。' : '此项当前未显示或已停用，已定位到所属区域。' }, window.location.origin);
    }, 80);
  }
}
