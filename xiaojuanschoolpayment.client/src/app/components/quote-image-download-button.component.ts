import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuoteImagePreviewComponent } from './quote-image-preview.component';
import { downloadQuoteBlob, encodeQuoteCanvas, loadQuoteImage, quoteBlobDataUrl,
  quoteCanvasScale, quoteImageEnvironment, validateQuoteBlob } from './quote-image-export';

export type QuoteImageActionMode = 'download' | 'email';

export interface QuoteImageInfoItem {
  icon: string;
  label: string;
  value: string;
}

export interface QuoteImagePaymentItem {
  icon: string;
  label: string;
  amount: string;
  note?: string;
  /** Optional title and date/week line, displayed above the concise fee note. */
  detailTitle?: string;
  detailSubtitle?: string;
  accent?: boolean;
}

export interface QuoteImageLocalFeeItem {
  label: string;
  unit: string;
  quantity: string;
  amount: string;
  note: string;
}

export interface QuoteImageOptionalFeeItem {
  label: string;
  amount: string;
  cnyAmount?: string;
  note: string;
}

export interface QuoteImageBenefitItem {
  title: string;
  text: string;
}

export interface QuoteImageAlumniBenefitItem {
  title: string;
  subtitle: string;
  text: string;
}

export interface QuoteImageContact {
  name: string;
  phone: string;
  avatarSrc: string;
  qrSrc: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  wechatLabel?: string;
  footerText?: string;
  placeholder?: boolean;
}

export interface QuoteImageCardData {
  layout?: 'standard' | 'cia-detailed';
  /** Preserve every payment/local/optional fee and size the detailed image to its contents. */
  fullFeeDetails?: boolean;
  /** Show fee reference, quantity, subtotal and verbatim webpage notes in separate columns. */
  localFeeTableLayout?: 'web';
  fileName: string;
  logoSrc: string;
  heroSrc: string;
  schoolCode: string;
  title: string;
  /** Optional exact heading for the detailed quote, without an appended suffix. */
  headingText?: string;
  subtitle: string;
  quoteDateText: string;
  updatedAtText: string;
  quoteNumber?: string;
  validUntilText?: string;
  studentSectionTitle?: string;
  studentItems: QuoteImageInfoItem[];
  paymentSectionTitle?: string;
  paymentItems: QuoteImagePaymentItem[];
  totalLabel: string;
  totalUsd: string;
  totalCny: string;
  totalIncludedLabel?: string;
  totalNote?: string;
  /** Opt-in for school-specific additional-payment warnings; preserve legacy layouts. */
  expandTotalNote?: boolean;
  localFeeTitle?: string;
  localFeeAmount: string;
  localFeeDescription: string;
  localFeeNote: string;
  localFeeItems?: QuoteImageLocalFeeItem[];
  localFeeCny?: string;
  exchangeRateText?: string;
  /** Exact rates used by the calculator, not inferred from rounded totals. */
  conversionRates?: { usdToCny: number; phpPerCny: number; date?: string };
  optionalFeeItems?: QuoteImageOptionalFeeItem[];
  benefitItems?: QuoteImageBenefitItem[];
  serviceLocations?: string[];
  alumniBenefitItems?: QuoteImageAlumniBenefitItem[];
  /** School-specific opt-out when no alumni price benefit may be advertised. */
  hideAlumniBenefit?: boolean;
  finalConfirmationText?: string;
  importantNotes?: string[];
  noteTitle?: string;
  note: string;
  contact: QuoteImageContact;
  consultants?: QuoteImageContact[];
}

@Component({
  selector: 'app-quote-image-download-button',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, QuoteImagePreviewComponent],
  template: `
    <button type="button" [class]="buttonClass" [disabled]="disabled || isSaving" (click)="handleButtonClick()">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>{{ isSaving ? savingLabel : label }}
    </button>

    <p *ngIf="saveError && !isPreviewOpen" class="quote-email-message error" role="alert">{{ saveError }}</p>
    <app-quote-image-preview *ngIf="isPreviewOpen"
      [src]="previewSrc" [busy]="isSaving" [error]="saveError" [wechat]="isWeChat"
      [canShare]="canSharePreview" [sharing]="isSharing"
      (closed)="closeImagePreview()" (retry)="saveQuoteImage()"
      (share)="shareImagePreview()" (download)="downloadImagePreview()"
      (imageFailed)="previewImageFailed()" />

    <div
      *ngIf="isEmailDialogOpen"
      class="quote-email-backdrop"
      role="presentation"
      (click)="closeEmailDialog()"
    >
      <form
        class="quote-email-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-email-title"
        (submit)="sendQuoteEmail($event)"
        (click)="$event.stopPropagation()"
      >
        <button
          type="button"
          class="quote-email-close"
          aria-label="关闭"
          [disabled]="isSaving"
          (click)="closeEmailDialog()"
        >
          <mat-icon>close</mat-icon>
        </button>

        <h3 id="quote-email-title">发送报价单到邮箱</h3>
        <p>请输入接收邮箱，我们会把当前报价单图片作为附件发送给你。</p>

        <label class="quote-email-field">
          邮箱地址
          <input
            type="email"
            name="quoteRecipientEmail"
            autocomplete="email"
            required
            [(ngModel)]="recipientEmail"
            [disabled]="isSaving"
            placeholder="name@example.com"
          />
        </label>

        <p *ngIf="emailError" class="quote-email-message error">{{ emailError }}</p>
        <p *ngIf="emailSuccess" class="quote-email-message success">{{ emailSuccess }}</p>

        <div class="quote-email-actions">
          <button type="button" class="quote-email-secondary" [disabled]="isSaving" (click)="closeEmailDialog()">
            取消
          </button>
          <button type="submit" class="quote-email-primary" [disabled]="isSaving">
            <mat-icon>mail</mat-icon>{{ isSaving ? '发送中...' : '发送报价单' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .quote-email-backdrop {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(15, 23, 42, 0.58);
        backdrop-filter: blur(6px);
      }

      .quote-email-dialog {
        position: relative;
        width: min(440px, 100%);
        border: 1px solid rgba(0, 66, 45, 0.12);
        border-radius: 8px;
        padding: 26px;
        background: #fffdf8;
        box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
        color: #15243d;
      }

      .quote-email-dialog h3 {
        margin: 0 44px 8px 0;
        color: #00422d;
        font-size: 24px;
        font-weight: 900;
        line-height: 1.25;
      }

      .quote-email-dialog p {
        margin: 0 0 18px;
        color: #4b5870;
        font-size: 15px;
        line-height: 1.65;
      }

      .quote-email-close {
        position: absolute;
        top: 16px;
        right: 16px;
        display: inline-grid;
        width: 38px;
        height: 38px;
        place-items: center;
        border: 1px solid #dfe6df;
        border-radius: 999px;
        background: #ffffff;
        color: #15243d;
        cursor: pointer;
      }

      .quote-email-close mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .quote-email-field {
        display: grid;
        gap: 8px;
        color: #00422d;
        font-size: 14px;
        font-weight: 800;
      }

      .quote-email-field input {
        width: 100%;
        min-height: 46px;
        border: 1px solid #d8e0d9;
        border-radius: 8px;
        padding: 0 14px;
        background: #ffffff;
        color: #111827;
        font: inherit;
        outline: none;
      }

      .quote-email-field input:focus {
        border-color: #00643e;
        box-shadow: 0 0 0 3px rgba(0, 100, 62, 0.13);
      }

      .quote-email-message {
        margin: 12px 0 0;
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 14px;
        font-weight: 700;
      }

      .quote-email-message.error {
        background: #fff1ed;
        color: #c2410c;
      }

      .quote-email-message.success {
        background: #edf7f0;
        color: #00643e;
      }

      .quote-email-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 22px;
      }

      .quote-email-actions button {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        justify-content: center;
        gap: 6px;
        border-radius: 8px;
        padding: 0 16px;
        font-weight: 900;
        cursor: pointer;
      }

      .quote-email-actions button:disabled {
        cursor: not-allowed;
        opacity: 0.72;
      }

      .quote-email-secondary {
        border: 1px solid #d8e0d9;
        background: #ffffff;
        color: #34445a;
      }

      .quote-email-primary {
        border: 1px solid #00643e;
        background: #00643e;
        color: #ffffff;
      }

      .quote-email-primary mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    `,
  ],
})
export class QuoteImageDownloadButtonComponent implements OnDestroy {
  @Input({ required: true }) quote!: QuoteImageCardData;
  @Input() label = '保存报价单图片';
  @Input() savingLabel = '生成中...';
  @Input() buttonClass = 'secondary-action';
  @Input() icon = 'image';
  @Input() disabled = false;
  @Input() mode: QuoteImageActionMode = 'download';
  @Input() emailEndpoint = '/quote-email/send';

  protected isSaving = false;
  protected isEmailDialogOpen = false;
  protected recipientEmail = '';
  protected emailError = '';
  protected emailSuccess = '';
  protected isPreviewOpen = false;
  protected previewSrc = '';
  protected saveError = '';
  protected isWeChat = false;
  protected canSharePreview = false;
  protected isSharing = false;
  private previewFile?: File;
  private saveSequence = 0;
  private destroyed = false;

  ngOnDestroy(): void {
    this.destroyed = true;
    this.closeImagePreview();
  }

  protected closeImagePreview(): void {
    this.saveSequence++;
    this.isPreviewOpen = false;
    this.previewSrc = '';
    this.previewFile = undefined;
    this.canSharePreview = false;
    this.saveError = '';
  }

  protected previewImageFailed(): void {
    this.previewSrc = '';
    this.previewFile = undefined;
    this.canSharePreview = false;
    this.saveError = '图片预览加载失败，请重新生成。';
  }

  protected async shareImagePreview(): Promise<void> {
    if (!this.previewFile || !this.canSharePreview || this.isSharing) return;
    this.isSharing = true;
    this.saveError = '';
    try {
      // Invoked directly from a fresh tap, not after the asynchronous canvas render.
      await navigator.share({ files: [this.previewFile] });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        this.saveError = '当前浏览器未能分享图片，请长按图片保存，或使用下载图片按钮。';
      }
    } finally {
      this.isSharing = false;
    }
  }

  protected downloadImagePreview(): void {
    if (!this.previewFile || this.isWeChat) return;
    try {
      downloadQuoteBlob(this.previewFile, this.previewFile.name);
    } catch {
      this.saveError = '下载未能启动，请长按图片保存。';
    }
  }

  protected handleButtonClick(): void {
    if (this.mode === 'email') {
      this.openEmailDialog();
      return;
    }

    void this.saveQuoteImage();
  }

  protected openEmailDialog(): void {
    if (this.disabled || this.isSaving) {
      return;
    }

    this.emailError = '';
    this.emailSuccess = '';
    this.isEmailDialogOpen = true;
  }

  protected closeEmailDialog(): void {
    if (this.isSaving) {
      return;
    }

    this.isEmailDialogOpen = false;
    this.emailError = '';
    this.emailSuccess = '';
  }

  protected async sendQuoteEmail(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (this.isSaving || !this.quote) {
      return;
    }

    const email = this.recipientEmail.trim();

    if (!this.isValidEmail(email)) {
      this.emailError = '请输入有效的邮箱地址。';
      this.emailSuccess = '';
      return;
    }

    this.isSaving = true;
    this.emailError = '';
    this.emailSuccess = '';

    try {
      const blob = await this.createQuoteImageBlob(2);
      const formData = new FormData();
      formData.append('email', email);
      formData.append('fileName', this.quote.fileName || 'quote-image.png');
      formData.append('schoolName', `${this.quote.schoolCode} ${this.quote.title}`);
      formData.append('summary', `${this.quote.subtitle} | ${this.quote.totalUsd}`);
      formData.append('image', blob, this.quote.fileName || 'quote-image.png');

      const response = await fetch(this.emailEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await this.getResponseMessage(response));
      }

      this.emailSuccess = '报价单图片已发送，请查看邮箱。';
    } catch (error) {
      console.error('Failed to email quote image', error);
      this.emailError =
        error instanceof TypeError
          ? '邮件服务暂时无法连接，请确认后端服务正在运行后再试。'
          : error instanceof Error && error.message
            ? error.message
            : '报价单邮件发送失败，请稍后重试。';
    } finally {
      this.isSaving = false;
    }
  }

  async saveQuoteImage(): Promise<void> {
    if (this.disabled || this.destroyed || this.isSaving || !this.quote) {
      return;
    }

    this.isSaving = true;
    this.saveError = '';
    this.previewSrc = '';
    this.previewFile = undefined;
    this.canSharePreview = false;
    const sequence = ++this.saveSequence;
    const environment = quoteImageEnvironment();
    this.isWeChat = environment.wechat;
    this.isPreviewOpen = environment.mobile;
    const fileName = this.quote.fileName || 'quote-image.png';

    try {
      const blob = await this.createQuoteImageBlob();
      if (sequence !== this.saveSequence || this.destroyed) return;
      if (environment.mobile) {
        const src = await quoteBlobDataUrl(blob);
        if (sequence !== this.saveSequence || this.destroyed) return;
        this.previewFile = new File([blob], fileName, { type: 'image/png' });
        this.previewSrc = src;
        try {
          this.canSharePreview = !environment.wechat && typeof navigator.share === 'function'
            && typeof navigator.canShare === 'function' && navigator.canShare({ files: [this.previewFile] });
        } catch { this.canSharePreview = false; }
      } else {
        downloadQuoteBlob(blob, fileName);
      }
    } catch (error) {
      console.error('Failed to create quote image', error);
      if (sequence === this.saveSequence && !this.destroyed) {
        this.saveError = '报价单图片未能完整生成，请检查网络后重新生成；也可关闭其他页面后再试。';
      }
    } finally {
      this.isSaving = false;
    }
  }

  private async createQuoteImageBlob(scaleOverride?: number): Promise<Blob> {
    const consultants = this.quote.consultants?.length ? this.quote.consultants : [this.quote.contact];
    const [logo, hero, consultantAssets] = await Promise.all([
      this.loadCanvasImage(this.useHighResolutionBrandHeader ? '/assets/sida-qihang-navbar-logo.jpg' : this.quote.logoSrc),
      this.loadCanvasImage(this.quote.heroSrc),
      Promise.all(
        (this.quote.layout === 'cia-detailed' ? [] : consultants.slice(0, 3)).map(async (consultant) => ({
          consultant,
          avatar: await this.loadCanvasImage(consultant.avatarSrc),
          qr: await this.loadCanvasImage(consultant.qrSrc),
        })),
      ),
    ]);
    const width = 1032;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available');
    }

    const fullLayout = this.quote.layout === 'cia-detailed' && this.quote.fullFeeDetails
      ? this.measureFullFeeLayout(context) : undefined;
    const height = this.quote.layout === 'cia-detailed'
      ? 1764 + (fullLayout?.paymentExtra ?? 0) + (fullLayout?.localExtra ?? 0) + (fullLayout?.notesExtra ?? 0)
      : 1848;

    const initialScale = quoteCanvasScale(width, height,
      scaleOverride ?? Math.max(2, window.devicePixelRatio || 2), quoteImageEnvironment().mobile);
    let failure: unknown;
    try {
      // Retry once at a smaller resolution; preserve every row and the approved layout.
      for (const scale of [initialScale, initialScale * 0.75]) {
        try {
          canvas.width = Math.max(1, Math.floor(width * scale));
          canvas.height = Math.max(1, Math.floor(height * scale));
          context.scale(canvas.width / width, canvas.height / height);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          if (this.quote.layout === 'cia-detailed') {
            this.drawDetailedQuoteImage(context, {
              logo, hero, consultants: consultants.slice(0, 5).map(consultant => ({ consultant })),
            }, width, height);
          } else {
            this.drawQuoteImage(context, { logo, hero, consultants: consultantAssets }, width, height);
          }
          const blob = await encodeQuoteCanvas(canvas);
          // Release the backing bitmap before decoding the PNG, especially on iOS.
          canvas.width = 1;
          canvas.height = 1;
          await validateQuoteBlob(blob);
          return blob;
        } catch (error) {
          failure = error;
        } finally {
          canvas.width = 1;
          canvas.height = 1;
        }
      }
      throw failure;
    } finally {
      for (const image of [logo, hero, ...consultantAssets.flatMap(item => [item.avatar, item.qr])]) image.src = '';
    }
  }

  private async getResponseMessage(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as { message?: string };
      return body.message || '报价单邮件发送失败，请稍后重试。';
    } catch {
      return '报价单邮件发送失败，请稍后重试。';
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private get detailedGrid() {
    const aligned = this.quote.fullFeeDetails && this.quote.localFeeTableLayout === 'web';
    return { noteBoundary: aligned ? 556 : 420, amountRight: aligned ? 546 : 400,
      amountWidth: aligned ? 290 : 150, noteLeft: aligned ? 566 : 438,
      noteWidth: aligned ? 416 : 532 };
  }

  private isMonetaryDiscount(row: QuoteImagePaymentItem): boolean {
    return /^[-−]\s*\d/.test(row.amount.trim()) || /^\d+(?:\.\d+)?折$/.test(row.amount.trim());
  }

  private measureFullFeeLayout(context: CanvasRenderingContext2D) {
    const lineCount = (text: string, width: number, font: string): number => {
      context.font = font;
      return Math.max(1, this.wrapCanvasText(context, text, width, 1000).length);
    };
    const font = (size: number, weight: number) => `${weight} ${size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    const payments = this.quote.paymentItems;
    const hasItemDetails = payments.some(row => row.detailTitle);
    const paymentDetails = payments.map(row => this.paymentDetailLines(context, row));
    const paymentProjects = payments.map(row => this.paymentProjectLines(context, row));
    const paymentHeights = payments.map((row, index) => Math.max(
      hasItemDetails ? 54 : Math.floor(358 / Math.max(1, payments.length)),
      paymentDetails[index].reduce((height, line) => height + line.lineHeight, 0) + 18,
      paymentProjects[index].reduce((height, line) => height + line.lineHeight, 0) + 18,
    ));
    const locals = this.quote.localFeeItems ?? [];
    const webTable = this.quote.localFeeTableLayout === 'web';
    const localNoteHeight = webTable
      ? lineCount(this.quote.localFeeNote, 932, font(13, 400)) * 18 + 20 : 0;
    const localHeights = locals.map(row => webTable ? Math.max(54,
      lineCount(row.label, 170, font(14, 700)) * 18 + 20,
      lineCount(row.unit, 120, font(13, 400)) * 18 + 20,
      lineCount(row.quantity, 36, font(14, 700)) * 18 + 20,
      lineCount(row.amount, 104, font(15, 850)) * 18 + 20,
      lineCount(row.note, 416, font(13, 400)) * 18 + 20,
    ) : Math.max(54,
      lineCount(this.detailedLocalNote(row), 532, font(15, 400)) * 18 + 20,
      lineCount(row.label, 174, font(16, 700)) * 19 + 18,
    ));
    const optionalHeights = (this.quote.optionalFeeItems ?? []).map(row => Math.max(48,
      lineCount(row.note, this.detailedGrid.noteWidth, font(12, 400)) * 15 + 18,
      lineCount(row.label, 186, font(14, 850)) * 17 + 18,
      lineCount(row.amount, row.cnyAmount ? this.detailedGrid.amountWidth : 160, font(14, 900)) * 17 + 18
        + (row.cnyAmount ? lineCount(row.cnyAmount, this.detailedGrid.amountWidth, font(12, 400)) * 16 : 0),
    ));
    const importantNotes = this.quoteFooterNotes();
    const noteHeights = importantNotes.map(note =>
      Math.max(27, lineCount(`✓ ${note}`, 820, font(13, this.isDateMismatchNote(note) ? 700 : 400)) * 18 + 9));
    const benefitsHeight = Math.max(56, ...(this.quote.benefitItems?.slice(0, 4) ?? []).map(item =>
      44 + (lineCount(item.text, 206, font(12, 400)) - 1) * 15 + 8));
    const alumniHeight = this.quote.hideAlumniBenefit
      ? 0
      : Math.max(36, lineCount(this.quote.alumniBenefitItems?.[0]?.text ?? '', 770, font(16, 400)) * 20 + 16);
    const serviceHeight = 47 + benefitsHeight + (this.quote.hideAlumniBenefit ? 12 : 8 + alumniHeight + 12);
    const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
    const footerHeight = Math.max(56, sum(noteHeights) + 24);
    const totalNoteLines = this.quote.expandTotalNote ? this.expandedTotalNoteLines(context) : [];
    const totalHeight = 64 + Math.max(0, totalNoteLines.length - 1) * 16;
    return {
      totalNoteLines, totalHeight,
      paymentHeights, paymentDetails, paymentProjects, localHeights, optionalHeights, noteHeights, localNoteHeight,
      importantNotes, footerHeight, benefitsHeight, alumniHeight, serviceHeight,
      paymentExtra: (hasItemDetails ? sum(paymentHeights) - 358 : Math.max(0, sum(paymentHeights) - 358)) + totalHeight - 64,
      localExtra: Math.max(0, localNoteHeight + sum(localHeights) + 64 + 6 + sum(optionalHeights) + 14 - 622),
      notesExtra: footerHeight - 106 + serviceHeight - 174,
    };
  }

  private detailedLocalNote(row: QuoteImageLocalFeeItem): string {
    if (this.quote.localFeeTableLayout === 'web') return row.note;
    return this.quote.fullFeeDetails ? `计费：${row.unit} × ${row.quantity}；${row.note}` : row.note;
  }

  private expandedTotalNoteLines(context: CanvasRenderingContext2D): string[] {
    const rate = this.quote.conversionRates
      ? `参考汇率：1美元 ≈ ${this.quote.conversionRates.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币` : '';
    context.font = '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    return [rate, ...this.withoutExchangeNote(this.quote.totalNote ?? '').split('\n')].filter(Boolean)
      .flatMap(text => this.wrapCanvasText(context, text, this.detailedGrid.noteWidth, 1000));
  }

  private isDateMismatchNote(note: string): boolean {
    return /课程.*住宿.*日期.*不(?:完全)?一致/.test(note);
  }

  private isGeneralConfirmation(note: string): boolean {
    return /^(?:本报价)?最终以.*(?:价格|空房).*为准[。.]?$/.test(note.trim());
  }

  private withoutExchangeNote(text: string): string {
    return text.split(/(?<=。)/).filter(sentence =>
      !(/汇率/.test(sentence) && /^(?:人民币|按实时汇率|参考汇率|汇率日期|暂按备用汇率|最终以支付当日汇率)/.test(sentence.trim())),
    ).join('').trim();
  }

  private quoteFooterNotes(): string[] {
    const source = this.quote.importantNotes?.length ? this.quote.importantNotes : [this.quote.note];
    const notes = [...new Set(source.map(note => this.withoutExchangeNote(note)).filter(note => note && !this.isGeneralConfirmation(note)))];
    return [
      ...notes.filter(note => this.isDateMismatchNote(note)),
      ...notes.filter(note => !this.isDateMismatchNote(note)),
      `${this.quote.conversionRates ? (this.quote.conversionRates.date ? `汇率日期：${this.quote.conversionRates.date}；` : '本次采用备用汇率；') : ''}人民币金额按参考汇率估算，最终以实际兑换或支付汇率为准。`,
      this.quote.finalConfirmationText ?? '最终以学校价格、空房及优惠确认为准。',
    ];
  }

  private paymentDetailLines(context: CanvasRenderingContext2D, row: QuoteImagePaymentItem) {
    const sections = row.detailTitle ? [
      { text: row.detailSubtitle, size: 13, weight: 400, lineHeight: 20, color: '#64748b' },
      { text: row.note, size: 14, weight: 400, lineHeight: 20, color: '#334155' },
    ] : [{ text: row.note ?? '—', size: 17, weight: 400, lineHeight: 20, color: '#475569' }];
    return sections.flatMap(section => {
      if (!section.text) return [];
      const font = `${section.weight} ${section.size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
      context.font = font;
      return this.wrapCanvasText(context, section.text, this.detailedGrid.noteWidth, 1000)
        .map(text => ({ text, font, lineHeight: section.lineHeight, color: section.color }));
    });
  }

  private paymentProjectLines(context: CanvasRenderingContext2D, row: QuoteImagePaymentItem) {
    const sections = row.detailTitle ? [
      { text: row.label, size: 12, weight: 600, lineHeight: 16, color: '#64748b' },
      { text: row.detailTitle, size: 15, weight: 750, lineHeight: 20, color: '#14233e' },
    ] : [{ text: row.label, size: 18, weight: 700, lineHeight: 21, color: '#14233e' }];
    return sections.flatMap(section => {
      const font = `${section.weight} ${section.size}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
      context.font = font;
      return this.wrapCanvasText(context, section.text, 170, 1000)
        .map(text => ({ text, font, lineHeight: section.lineHeight, color: section.color }));
    });
  }

  private drawDetailedQuoteImage(
    context: CanvasRenderingContext2D,
    assets: {
      logo: HTMLImageElement;
      hero: HTMLImageElement;
      consultants: Array<{
        consultant: QuoteImageContact;
      }>;
    },
    width: number,
    height: number,
  ): void {
    const green = '#06422e';
    const orange = '#f25518';
    const navy = '#14233e';
    const border = '#dce4e7';
    const padding = 18;
    const contentWidth = width - padding * 2;
    const fullLayout = this.quote.fullFeeDetails ? this.measureFullFeeLayout(context) : undefined;
    const grid = this.detailedGrid;

    const drawSectionNumber = (number: string, title: string, y: number): void => {
      this.drawRoundedRect(context, 36, y - 23, 32, 28, 5, green);
      context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = '#ffffff';
      context.textAlign = 'center';
      context.fillText(number, 52, y - 4);
      context.textAlign = 'left';
      context.font = '900 23px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.fillText(title, 78, y - 3);
    };

    const drawTableText = (
      text: string,
      x: number,
      y: number,
      maxWidth: number,
      color = navy,
      font = '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      lines = 1,
      lineHeight = 20,
    ): void => {
      this.drawWrappedText(context, text, x, y, maxWidth, lineHeight, font, color, lines);
    };

    const drawCenteredTableText = (
      text: string,
      x: number,
      top: number,
      rowHeight: number,
      maxWidth: number,
      color = navy,
      font = '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      maxLines = 1,
      lineHeight = 20,
    ): void => {
      context.font = font;
      context.fillStyle = color;
      const wrappedLines = this.wrapCanvasText(context, text, maxWidth, maxLines);
      if (wrappedLines.length === 0) {
        return;
      }

      const metrics = wrappedLines.map((line) => context.measureText(line));
      const ascent = Math.max(...metrics.map((metric) => metric.actualBoundingBoxAscent || 0));
      const descent = Math.max(...metrics.map((metric) => metric.actualBoundingBoxDescent || 0));
      const textHeight = ascent + descent + (wrappedLines.length - 1) * lineHeight;
      const firstBaseline = top + (rowHeight - textHeight) / 2 + ascent;

      wrappedLines.forEach((line, index) => {
        context.fillText(line, x, firstBaseline + index * lineHeight);
      });
    };

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    this.drawQuoteBrandHeader(context, assets.logo, 252, 4);

    this.drawRoundedRect(context, padding, 80, contentWidth, 122, 10, '#ffffff', border, 1);
    context.font = '950 31px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(this.quote.headingText ?? `${this.quote.schoolCode}${this.quote.title}报价单`, 54, 140);
    if (!this.quote.subtitle) {
      context.fillStyle = orange;
      context.fillRect(54, 151, 42, 3);
    }
    if (this.quote.subtitle) {
      this.drawWrappedText(
        context,
        this.quote.subtitle,
        54,
        160,
        510,
        20,
        '650 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
        navy,
        1,
      );
    }
    const admissionDate = this.quote.studentItems[0];
    const headerContact = assets.consultants[0]?.consultant;
    context.font = '700 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    if (admissionDate) {
      context.fillText(`${admissionDate.label}：${admissionDate.value}`, 54, 180);
    }
    if (headerContact) {
      context.fillText(`·  电话/微信：${headerContact.phone.replace(/\s/g, '')}`, 258, 180);
    }
    this.drawRoundedImageCover(context, assets.hero, 590, 86, 422, 106, 10);

    context.save();

    this.drawRoundedRect(context, padding, 212, contentWidth, 510 + (fullLayout?.paymentExtra ?? 0), 9, '#ffffff', border, 1);
    drawSectionNumber('01', (this.quote.paymentSectionTitle ?? '学校费用明细').replace('（到校前支付给学校的费用）', ''), 246);
    const paymentColumns = [36, 236, grid.noteBoundary, 992];
    context.fillStyle = '#f3f6f4';
    context.fillRect(36, 262, 956, 36);
    ['项目', '金额（美元）', '说明'].forEach((label, index) => {
      const centers = [136, (236 + grid.noteBoundary) / 2, (grid.noteBoundary + 992) / 2];
      context.font = '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'center';
      context.fillText(label, centers[index], 286);
    });
    context.textAlign = 'left';
    const paymentRows = fullLayout ? this.quote.paymentItems : this.quote.paymentItems.slice(0, 7);
    const paymentRowHeights = [52, 74, 52, 60, 58, 62];
    const compactPaymentRowHeight = paymentRows.length > 0 && paymentRows.length !== 6
      ? Math.min(150, Math.floor(358 / paymentRows.length))
      : 0;
    let paymentRowTop = 298;
    paymentRows.forEach((row, index) => {
      const rowHeight = fullLayout?.paymentHeights[index] ?? (compactPaymentRowHeight || paymentRowHeights[index] || 46);
      const top = paymentRowTop;
      if (index % 2 === 1) {
        context.fillStyle = '#fbfcfc';
        context.fillRect(36, top, 956, rowHeight);
      }
      this.drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
      context.textAlign = 'center';
      if (fullLayout && row.detailTitle) {
        const lines = fullLayout.paymentProjects[index];
        let lineTop = top + (rowHeight - lines.reduce((sum, line) => sum + line.lineHeight, 0)) / 2;
        for (const line of lines) {
          context.font = line.font;
          context.fillStyle = line.color;
          const metrics = context.measureText(line.text);
          context.fillText(line.text, 136, lineTop + (line.lineHeight - metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2 + metrics.actualBoundingBoxAscent);
          lineTop += line.lineHeight;
        }
      } else {
        drawCenteredTableText(row.label, 136, top, rowHeight, 170, fullLayout ? navy : row.accent ? orange : navy, '700 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 21);
      }
      context.textAlign = 'right';
      drawCenteredTableText(row.amount, grid.amountRight, top, rowHeight, grid.amountWidth, (fullLayout ? this.isMonetaryDiscount(row) : row.accent) ? orange : navy, '850 19px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
      context.textAlign = 'left';
      if (fullLayout && row.detailTitle) {
        const lines = fullLayout.paymentDetails[index];
        const textHeight = lines.reduce((sum, line) => sum + line.lineHeight, 0);
        let lineTop = top + (rowHeight - textHeight) / 2;
        for (const line of lines) {
          context.font = line.font;
          context.fillStyle = line.color;
          const metrics = context.measureText(line.text);
          const ascent = metrics.actualBoundingBoxAscent;
          const descent = metrics.actualBoundingBoxDescent;
          context.fillText(line.text, grid.noteLeft, lineTop + (line.lineHeight - ascent - descent) / 2 + ascent);
          lineTop += line.lineHeight;
        }
      } else {
        drawCenteredTableText(row.note ?? '—', grid.noteLeft, top, rowHeight, grid.noteWidth, fullLayout ? '#475569' : row.accent ? orange : '#334155', '400 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 3, 20);
      }
      paymentRowTop += rowHeight;
    });
    paymentColumns
      .slice(1, -1)
      .forEach((x) =>
        this.drawSolidLine(context, x, 262, x, paymentRowTop, '#e1e6e8'),
      );
    this.drawSolidLine(context, 36, paymentRowTop, 992, paymentRowTop, '#e1e6e8');
    context.fillStyle = '#fffaf5';
    const schoolTotalHeight = fullLayout?.totalHeight ?? 64;
    context.fillRect(36, paymentRowTop, 956, schoolTotalHeight);
    context.fillStyle = orange;
    context.fillRect(36, paymentRowTop, 5, schoolTotalHeight);
    this.drawSolidLine(context, 236, paymentRowTop, 236, paymentRowTop + schoolTotalHeight, '#eadfd6');
    this.drawSolidLine(context, grid.noteBoundary, paymentRowTop, grid.noteBoundary, paymentRowTop + schoolTotalHeight, '#eadfd6');
    context.textAlign = 'center';
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(this.quote.totalLabel, 136, paymentRowTop + 27);
    context.font = '700 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.fillText(this.quote.totalIncludedLabel ?? '优惠已计入', 136, paymentRowTop + 48);
    let totalFontSize = 27;
    context.font = `950 ${totalFontSize}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    while (context.measureText(this.quote.totalUsd).width > grid.amountWidth && totalFontSize > 16) {
      totalFontSize -= 1;
      context.font = `950 ${totalFontSize}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    }
    context.fillStyle = orange;
    context.textAlign = 'right';
    context.fillText(this.quote.totalUsd, grid.amountRight, paymentRowTop + 39);
    context.textAlign = 'left';
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    const schoolRate = fullLayout && this.quote.conversionRates
      ? `参考汇率：1美元 ≈ ${this.quote.conversionRates.usdToCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}元人民币`
      : '';
    const totalNote = [schoolRate, fullLayout ? this.withoutExchangeNote(this.quote.totalNote ?? '') : this.quote.totalNote ?? ''].filter(Boolean).join('；');
    context.fillText(this.quote.totalCny, grid.noteLeft, paymentRowTop + (totalNote ? 27 : 38));
    if (this.quote.expandTotalNote && fullLayout) {
      fullLayout.totalNoteLines.forEach((line, index) => drawTableText(line, grid.noteLeft, paymentRowTop + 49 + index * 16, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16));
    } else {
      drawTableText(totalNote, grid.noteLeft, paymentRowTop + 49, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);
    }

    context.save();
    context.translate(0, fullLayout?.paymentExtra ?? 0);
    this.drawRoundedRect(context, padding, 734, contentWidth, 708 + (fullLayout?.localExtra ?? 0), 9, '#ffffff', border, 1);
    drawSectionNumber('02', this.quote.localFeeTitle ?? '到校后学杂费明细参考（学校及相关部门收取）', 768);
    const webTable = !!fullLayout && this.quote.localFeeTableLayout === 'web';
    const localColumns = webTable ? [36, 236, 376, 432, 556, 992] : [36, 236, 420, 992];
    const localHeaderTop = 784 + (fullLayout?.localNoteHeight ?? 0);
    if (webTable) {
      context.fillStyle = '#fffaf5';
      context.fillRect(36, 780, 956, fullLayout!.localNoteHeight - 8);
      drawTableText(this.quote.localFeeNote, 48, 799, 932, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
    }
    context.fillStyle = '#f3f6f4';
    context.fillRect(36, localHeaderTop, 956, 36);
    const localHeaders = webTable
      ? ['费用明细', '计费参考', '数量', '预估小计', '备注']
      : ['项目', '本次预计金额（比索）', '简要说明'];
    localHeaders.forEach((label, index) => {
      context.font = '850 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'center';
      context.fillText(label, (localColumns[index] + localColumns[index + 1]) / 2, localHeaderTop + 24);
    });
    context.textAlign = 'left';
    const localRows = (fullLayout ? this.quote.localFeeItems : this.quote.localFeeItems?.slice(0, 10)) ?? [];
    const localRowHeights = [54, 50, 62, 48, 50, 50, 62, 52, 46];
    const compactLocalRowHeight = localRows.length > 0 && localRows.length < 9
      ? Math.min(118, Math.floor(474 / localRows.length))
      : 0;
    let localRowTop = localHeaderTop + 36;
    localRows.forEach((row, index) => {
      const top = localRowTop;
      const rowHeight = fullLayout?.localHeights[index] ?? (compactLocalRowHeight || localRowHeights[index] || 56);
      if (index % 2 === 1) {
        context.fillStyle = '#fbfcfc';
        context.fillRect(36, top, 956, rowHeight);
      }
      this.drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
      if (webTable) {
        context.textAlign = 'left';
        drawCenteredTableText(row.label, 46, top, rowHeight, 170, navy, '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
        drawCenteredTableText(row.unit, 246, top, rowHeight, 120, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
        context.textAlign = 'center';
        drawCenteredTableText(row.quantity, 404, top, rowHeight, 36, navy, '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
        context.textAlign = 'right';
        drawCenteredTableText(row.amount, 546, top, rowHeight, 104, navy, '850 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
        context.textAlign = 'left';
        drawCenteredTableText(row.note, 566, top, rowHeight, 416, '#475569', '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 18);
        localRowTop += rowHeight;
        return;
      }
      context.textAlign = 'center';
      drawCenteredTableText(row.label, 136, top, rowHeight, 174, navy, '700 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 19);
      context.textAlign = 'right';
      drawCenteredTableText(row.amount, 400, top, rowHeight, 150, navy, '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
      context.textAlign = 'left';
      drawCenteredTableText(this.detailedLocalNote(row), 438, top, rowHeight, 532, '#475569', '400 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 2, 18);
      localRowTop += rowHeight;
    });
    localColumns.slice(1, -1).forEach((x) => this.drawSolidLine(context, x, localHeaderTop, x, localRowTop, '#e1e6e8'));
    this.drawSolidLine(context, 36, localRowTop, 992, localRowTop, '#e1e6e8');
    context.fillStyle = '#fffaf5';
    context.fillRect(36, localRowTop, 956, 64);
    context.fillStyle = orange;
    context.fillRect(36, localRowTop, 5, 64);
    this.drawSolidLine(context, 236, localRowTop, 236, localRowTop + 64, '#eadfd6');
    this.drawSolidLine(context, grid.noteBoundary, localRowTop, grid.noteBoundary, localRowTop + 64, '#eadfd6');
    context.textAlign = 'center';
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText('预计到校学杂费合计', 136, localRowTop + 36);
    context.font = '950 22px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = orange;
    context.textAlign = 'right';
    context.fillText(this.quote.localFeeAmount, grid.amountRight, localRowTop + 38);
    context.textAlign = 'left';
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    const localRate = fullLayout && this.quote.conversionRates
      ? `参考汇率：1元人民币 ≈ ${this.quote.conversionRates.phpPerCny.toLocaleString('zh-CN', { maximumFractionDigits: 6 })}比索`
      : '';
    context.fillText(this.quote.localFeeCny ?? '', grid.noteLeft, localRowTop + (fullLayout && !localRate ? 38 : 27));
    if (localRate) drawTableText(localRate, grid.noteLeft, localRowTop + 49, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);
    if (!fullLayout) drawTableText('按实时汇率预估，实际以到校缴费为准', 438, localRowTop + 49, 530, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);

    const optionalFees = (fullLayout ? this.quote.optionalFeeItems : this.quote.optionalFeeItems?.slice(0, 2)) ?? [];
    const optionalTop = localRowTop + 70;
    const optionalHeight = fullLayout ? fullLayout.optionalHeights.reduce((sum, value) => sum + value, 0) : 64;
    this.drawRoundedRect(context, 36, optionalTop, 956, optionalHeight, 7, '#f8fbf9', '#d7e6dc', 1);
    this.drawSolidLine(context, 236, optionalTop, 236, optionalTop + optionalHeight, '#dfe8e2');
    this.drawSolidLine(context, grid.noteBoundary, optionalTop, grid.noteBoundary, optionalTop + optionalHeight, '#dfe8e2');
    let nextOptionalTop = optionalTop;
    optionalFees.forEach((item, index) => {
      const rowTop = nextOptionalTop;
      const rowHeight = fullLayout?.optionalHeights[index] ?? 32;
      nextOptionalTop += rowHeight;
      if (index > 0) {
        this.drawSolidLine(context, 36, rowTop, 992, rowTop, '#dfe8e2');
      }
      if (fullLayout) {
        context.textAlign = 'center';
        drawCenteredTableText(item.label, 136, rowTop, rowHeight, 186, green, '850 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 17);
        context.textAlign = 'right';
        context.font = '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
        const secondaryHeight = item.cnyAmount ? this.wrapCanvasText(context, item.cnyAmount, grid.amountWidth, 1000).length * 16 : 0;
        drawCenteredTableText(item.amount, grid.amountRight, rowTop, rowHeight - secondaryHeight, grid.amountWidth, navy, '900 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 17);
        if (item.cnyAmount) drawCenteredTableText(item.cnyAmount, grid.amountRight, rowTop + rowHeight - secondaryHeight - 6, secondaryHeight, grid.amountWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 16);
        context.textAlign = 'left';
        drawCenteredTableText(item.note, grid.noteLeft, rowTop, rowHeight, grid.noteWidth, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1000, 15);
        return;
      }
      context.textAlign = 'center';
      context.font = '850 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.fillText(item.label, 136, rowTop + 21);
      context.font = '900 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = navy;
      context.textAlign = 'right';
      context.fillText(item.amount, 400, rowTop + 21);
      context.textAlign = 'left';
      drawTableText(item.note, 438, rowTop + 21, 530, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 15);
    });

    context.translate(0, fullLayout?.localExtra ?? 0);
    const serviceHeight = fullLayout?.serviceHeight ?? 174;
    this.drawRoundedRect(context, padding, 1454, contentWidth, serviceHeight, 9, '#ffffff', border, 1);
    drawSectionNumber('03', '为什么选择思达启航？', 1490);

    const benefits = this.quote.benefitItems?.slice(0, 4) ?? [];
    const benefitsTop = fullLayout ? 1501 : 1505;
    const benefitsHeight = fullLayout?.benefitsHeight ?? 68;
    this.drawRoundedRect(context, 36, benefitsTop, 956, benefitsHeight, 8, '#f7faf8', '#dce7e1', 1);
    benefits.forEach((item, index) => {
      const x = 36 + index * 238;
      const y = benefitsTop;
      if (index > 0) {
        this.drawSolidLine(context, x, y + 10, x, y + benefitsHeight - 10, '#dce7e1');
      }
      this.drawRoundedRect(context, x + 16, y + 16, 10, 10, 5, index === 1 ? orange : green);
      context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'left';
      context.fillText(item.title, x + 34, y + 27);
      drawTableText(item.text, x + 16, y + 44, 206, '#64748b', '400 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 2, 15);
    });

    const serviceLocations = this.quote.serviceLocations?.slice(0, 3) ?? [
      '深圳总部',
      '菲律宾驻点',
      '欧洲驻点',
    ];
    context.font = '400 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.textAlign = 'right';
    context.fillText(serviceLocations.join(' · '), 984, 1487);
    context.textAlign = 'left';

    if (!this.quote.hideAlumniBenefit) {
      const alumniText = this.quote.alumniBenefitItems?.[0]?.text ?? '';
      const alumniTop = fullLayout ? benefitsTop + benefitsHeight + 8 : 1581;
      const alumniHeight = fullLayout?.alumniHeight ?? 36;
      this.drawRoundedRect(context, 36, alumniTop, 956, alumniHeight, 6, '#fff8f1', '#f2b38c', 1);
      context.fillStyle = orange;
      context.fillRect(36, alumniTop, 5, alumniHeight);
      context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = orange;
      context.textAlign = 'left';
      context.fillText('老学员专属优惠', 54, alumniTop + 24);
      drawTableText(alumniText, 206, alumniTop + 24, 770, navy, '400 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', fullLayout ? 1000 : 1, 20);
    }

    const footerTop = fullLayout ? 1454 + serviceHeight + 12 : 1640;
    this.drawRoundedRect(context, padding, footerTop, contentWidth, fullLayout?.footerHeight ?? 106, 8, '#f7faf8', '#dce7e1', 1);
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText('04  报价说明', 38, footerTop + 32);
    const importantNotes = fullLayout?.importantNotes ?? (this.quote.importantNotes?.length
      ? this.quote.importantNotes
      : [this.quote.note]);
    let nextNoteTop = footerTop + 31;
    (fullLayout ? importantNotes : importantNotes.slice(0, 3)).forEach((note, index) => {
      if (fullLayout) {
        const mismatch = this.isDateMismatchNote(note);
        drawTableText(`✓ ${note}`, 174, nextNoteTop, 820, mismatch ? '#9a3412' : '#475569', `${mismatch ? 700 : 400} 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`, 1000, 18);
        nextNoteTop += fullLayout.noteHeights[index];
        return;
      }
      context.font = '650 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = '#475569';
      context.fillText(`✓ ${note}`, 174, 1671 + index * 27);
    });
    context.restore();
    context.restore();
  }

  private drawQuoteImage(
    context: CanvasRenderingContext2D,
    assets: {
      logo: HTMLImageElement;
      hero: HTMLImageElement;
      consultants: Array<{
        consultant: QuoteImageContact;
        avatar: HTMLImageElement;
        qr: HTMLImageElement;
      }>;
    },
    width: number,
    height: number,
  ): void {
    const padding = 26;
    const contentWidth = width - padding * 2;

    const background = context.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, '#fffaf1');
    background.addColorStop(0.5, '#ffffff');
    background.addColorStop(1, '#fff8ed');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    this.drawQuoteBrandHeader(context, assets.logo, 36, 24);
    this.drawHeaderLine(context, '报价日期：', this.quote.quoteDateText, 755, 47, '日');
    this.drawHeaderLine(context, '资料更新时间：', this.quote.updatedAtText, 755, 82, '时');

    this.drawHeroSection(context, assets.hero, padding, contentWidth);
    this.drawStudentSection(context, padding, contentWidth);
    this.drawPaymentSection(context, padding, contentWidth);
    this.drawLocalFeeSection(context, padding, contentWidth);
    this.drawNoteSection(context, padding, contentWidth);
    this.drawContactSection(context, assets.consultants, padding, contentWidth);
  }

  private drawHeroSection(context: CanvasRenderingContext2D, hero: HTMLImageElement, padding: number, contentWidth: number): void {
    this.drawRoundedRect(context, padding, 112, contentWidth, 292, 16, 'rgba(255, 255, 255, 0.9)', '#deded9', 1.2);
    this.drawRoundedImageCover(context, hero, 675, 137, 300, 242, 12);
    context.font = '900 62px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ff5a1f';
    context.fillText(this.quote.schoolCode, 62, 215);
    const codeWidth = context.measureText(this.quote.schoolCode).width;
    context.fillStyle = '#00422d';
    context.fillText(` ${this.quote.title}`, 62 + codeWidth, 215);
    context.font = '900 62px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillText('参考报价单', 62, 292);
    context.fillStyle = '#ff5a1f';
    context.fillRect(62, 326, 56, 3);
    this.drawWrappedText(
      context,
      this.quote.subtitle,
      62,
      368,
      590,
      24,
      '500 20px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      '#111827',
      1,
    );
  }

  private drawStudentSection(context: CanvasRenderingContext2D, padding: number, contentWidth: number): void {
    this.drawRoundedRect(context, padding, 420, contentWidth, 315, 14, 'rgba(255, 255, 255, 0.9)', '#deded9', 1.2);
    this.drawSectionTitle(context, 58, 452, this.quote.studentSectionTitle ?? '学生选择', '人');

    const positions = [
      [54, 486],
      [525, 486],
      [54, 575],
      [525, 575],
      [54, 664],
      [525, 664],
    ];

    this.quote.studentItems.slice(0, 6).forEach((item, index) => {
      const [x, y] = positions[index];
      const isScheduleItem = item.label === '课程安排';
      const cardY = isScheduleItem ? y - 4 : y;
      const cardHeight = isScheduleItem ? 86 : 76;

      this.drawRoundedRect(context, x, cardY, 450, cardHeight, 8, 'rgba(255, 255, 255, 0.86)', '#e1ded8', 1);
      this.drawInfoItem(context, item.icon, item.label, item.value, x + 20, cardY + 17, 400);
    });
  }

  private drawPaymentSection(context: CanvasRenderingContext2D, padding: number, contentWidth: number): void {
    this.drawRoundedRect(context, padding, 750, contentWidth, 395, 14, 'rgba(255, 255, 255, 0.9)', '#deded9', 1.2);
    this.drawSectionTitle(context, 58, 786, this.quote.paymentSectionTitle ?? '前期支付参考', '¥');

    this.quote.paymentItems.slice(0, 5).forEach((row, index) => {
      const y = 830 + index * 48;
      this.drawPaymentRow(context, row, 70, y, 850);
      if (index < Math.min(this.quote.paymentItems.length, 5) - 1) {
        const dividerY = row.note ? y + 36 : y + 25;
        this.drawSolidLine(context, 70, dividerY, 920, dividerY, '#e7e3dc');
      }
    });

    this.drawRoundedRect(context, 54, 1068, 924, 78, 10, '#f2f6ef');
    context.font = '900 24px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    context.fillText(this.quote.totalLabel, 78, 1115);
    context.textAlign = 'right';
    context.font = '900 35px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillText(this.quote.totalUsd, 940, 1099);
    context.font = '900 21px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#e9560c';
    context.fillText(this.quote.totalCny, 740, 1129);
    context.fillStyle = '#00422d';
    context.fillText(this.quote.totalNote ?? '（按参考汇率估算）', 940, 1129);
    context.textAlign = 'left';
  }

  private drawLocalFeeSection(context: CanvasRenderingContext2D, padding: number, contentWidth: number): void {
    this.drawRoundedRect(context, padding, 1165, contentWidth, 145, 14, '#fffaf4', '#f36a0b', 1.2);
    context.font = '900 27px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#e9560c';
    context.fillText('到校学杂费提醒', 100, 1208);
    context.fillText('!', 62, 1208);
    context.font = '800 20px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#15243d';
    context.fillText('预计准备', 76, 1249);
    context.font = '900 35px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#e9560c';
    context.fillText(this.quote.localFeeAmount, 76, 1288);
    this.drawSolidLine(context, 352, 1225, 352, 1286, '#f1bc9d');
    this.drawWrappedText(
      context,
      this.quote.localFeeDescription,
      405,
      1227,
      500,
      28,
      '700 22px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      '#15243d',
      2,
    );
    this.drawWrappedText(
      context,
      this.quote.localFeeNote,
      405,
      1290,
      500,
      24,
      '800 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      '#e9560c',
      1,
    );
  }

  private drawNoteSection(context: CanvasRenderingContext2D, padding: number, contentWidth: number): void {
    this.drawRoundedRect(context, padding, 1325, contentWidth, 82, 12, '#f7fbf8', '#0d7b5b', 1);
    context.font = '900 19px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    context.fillText(this.quote.noteTitle ?? '说明', 70, 1357);
    this.drawWrappedText(
      context,
      this.quote.note,
      88,
      1385,
      840,
      24,
      '600 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      '#15243d',
      1,
    );
  }

  private drawContactSection(
    context: CanvasRenderingContext2D,
    consultants: Array<{
      consultant: QuoteImageContact;
      avatar: HTMLImageElement;
      qr: HTMLImageElement;
    }>,
    padding: number,
    contentWidth: number,
  ): void {
    this.drawRoundedRect(context, padding, 1420, contentWidth, 398, 14, '#00422d');
    context.textAlign = 'center';
    context.font = '900 27px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText('选择咨询方向', 516, 1460);
    this.drawSolidLine(context, 345, 1450, 430, 1450, 'rgba(255,255,255,0.25)');
    this.drawSolidLine(context, 602, 1450, 687, 1450, 'rgba(255,255,255,0.25)');
    context.textAlign = 'left';

    const cardWidth = 300;
    const cardHeight = 300;
    const cardY = 1478;
    const cardGap = 25;
    const startX = padding + 18;
    consultants.forEach((item, index) => {
      const x = startX + index * (cardWidth + cardGap);
      this.drawConsultantCard(context, item.consultant, item.avatar, item.qr, x, cardY, cardWidth, cardHeight);
    });

    context.font = '600 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText('✓ 正规签约保障   |   全程陪伴服务   |   7x24小时在线支持', 516, 1800);
    context.textAlign = 'left';
  }

  private drawConsultantCard(
    context: CanvasRenderingContext2D,
    consultant: QuoteImageContact,
    avatar: HTMLImageElement,
    qr: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    this.drawRoundedRect(context, x, y, width, height, 10, '#ffffff', '#dfe5df', 1);
    this.drawCircularImage(context, avatar, x + 57, y + 58, 43);
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    const consultantTitle = consultant.title ?? '咨询顾问';
    context.fillText(consultantTitle, x + 108, y + 42);
    const titleWidth = context.measureText(consultantTitle).width;
    context.fillStyle = '#ff5a1f';
    context.fillText(consultant.name, Math.min(x + 108 + titleWidth + 8, x + 236), y + 42);
    this.drawWrappedText(
      context,
      consultant.description ?? '',
      x + 108,
      y + 72,
      160,
      22,
      '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif',
      '#34445a',
      2,
    );
    context.font = '900 25px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00643e';
    context.fillText(`☎ ${consultant.phone}`, x + 55, y + 126);
    this.drawRoundedRect(context, x + 98, y + 142, 104, 104, 6, '#ffffff', '#e8e8e4', 1);
    this.drawImageContain(context, qr, x + 105, y + 149, 90, 90);
    this.drawRoundedRect(context, x + 22, y + 257, width - 44, 34, 8, '#ff5a1f');
    context.font = '800 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(`${consultant.buttonLabel ?? '咨询方案'}  >`, x + width / 2, y + 280);
    context.textAlign = 'left';
  }

  private drawHeaderLine(context: CanvasRenderingContext2D, label: string, value: string, x: number, y: number, icon = ''): void {
    if (icon) {
      this.drawRoundedRect(context, x - 28, y - 19, 18, 18, 9, '#eaf4ee');
      context.font = '900 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = '#00643e';
      context.textAlign = 'center';
      context.fillText(icon, x - 19, y - 5);
      context.textAlign = 'left';
    }

    context.font = '800 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    context.fillText(label, x, y);
    context.font = '500 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#15243d';
    context.fillText(value, x + 132, y);
  }

  private drawSectionTitle(context: CanvasRenderingContext2D, x: number, y: number, title: string, icon: string): void {
    this.drawRoundedRect(context, x, y - 25, 34, 34, 17, '#00643e');
    context.font = '900 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(icon, x + 17, y - 2);
    context.textAlign = 'left';
    context.font = '900 27px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    context.fillText(title, x + 46, y);
  }

  private drawSectionPill(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    text: string,
    icon: string,
    color = '#00643e',
  ): void {
    this.drawRoundedRect(context, x, y, width, 44, 8, color);
    context.font = '900 24px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText(icon, x + 30, y + 29);
    context.fillText(text, x + 70, y + 29);
  }

  private drawInfoItem(
    context: CanvasRenderingContext2D,
    icon: string,
    label: string,
    value: string,
    x: number,
    y: number,
    maxWidth: number,
  ): void {
    this.drawRoundedRect(context, x, y - 4, 52, 52, 26, '#eaf4ee');
    context.font = '900 22px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00643e';
    context.textAlign = 'center';
    context.fillText(icon, x + 26, y + 31);
    context.textAlign = 'left';
    context.font = '900 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#00422d';
    context.fillText(label, x + 72, y + 18);
    const isLongInfoValue = label === '课程安排' || value.length > 22;

    this.drawWrappedText(
      context,
      value,
      x + 72,
      isLongInfoValue ? y + 39 : y + 43,
      maxWidth - 72,
      isLongInfoValue ? 18 : 20,
      `${isLongInfoValue ? '500 14px' : '500 16px'} "Microsoft YaHei", "PingFang SC", Arial, sans-serif`,
      '#15243d',
      2,
    );
  }

  private drawPaymentRow(
    context: CanvasRenderingContext2D,
    row: QuoteImagePaymentItem,
    x: number,
    y: number,
    width: number,
  ): void {
    const labelX = row.accent ? x + 70 : x + 52;
    const textY = row.accent ? y + 6 : y;

    context.font = '900 21px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = row.accent ? '#f05a12' : '#00422d';
    context.fillText(row.icon, x, textY);
    context.fillStyle = row.accent ? '#f05a12' : '#111827';
    context.fillText(row.label, labelX, textY);

    if (row.note) {
      context.font = '500 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = row.accent ? '#f05a12' : '#34445a';
      context.fillText(row.note, labelX, textY + 25);
    }

    context.textAlign = 'right';
    context.font = `900 ${row.accent ? 21 : 22}px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`;
    context.fillStyle = row.accent ? '#f05a12' : '#111827';
    context.fillText(row.amount, x + width, textY + 5);
    context.textAlign = 'left';
  }

  private drawRoundedRect(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: string,
    stroke?: string,
    lineWidth = 1,
  ): void {
    this.roundedRectPath(context, x, y, width, height, radius);
    context.fillStyle = fill;
    context.fill();

    if (stroke) {
      context.lineWidth = lineWidth;
      context.strokeStyle = stroke;
      context.stroke();
    }
  }

  private drawRoundedImageCover(
    context: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    overlay?: string,
  ): void {
    context.save();
    this.roundedRectPath(context, x, y, width, height, radius);
    context.clip();
    this.drawImageCover(context, image, x, y, width, height);

    if (overlay) {
      context.fillStyle = overlay;
      context.fillRect(x, y, width, height);
    }

    context.restore();
  }

  private drawImageCover(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const boxRatio = width / height;
    const sourceWidth = imageRatio > boxRatio ? image.naturalHeight * boxRatio : image.naturalWidth;
    const sourceHeight = imageRatio > boxRatio ? image.naturalHeight : image.naturalWidth / boxRatio;
    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
  }

  private get useHighResolutionBrandHeader(): boolean {
    return /\/sida-qihang-quote-header-logo(?:-transparent)?\.png$/.test(this.quote.logoSrc);
  }

  private drawQuoteBrandHeader(context: CanvasRenderingContext2D, logo: HTMLImageElement, x: number, y: number): void {
    if (!this.useHighResolutionBrandHeader) {
      this.drawImageContain(context, logo, x, y, 520, 70);
      return;
    }
    context.save();
    // Sample the original brand artwork directly; never enlarge the old 427×54 header.
    // This crop excludes the white margins of the existing 1672×941 master asset.
    context.drawImage(logo, 247, 295, 1215, 312, x + 12, y + 9, 194, 194 * 312 / 1215);
    this.drawSolidLine(context, x + 251, y + 16, x + 251, y + 54, '#ead5c3');
    context.textAlign = 'left';
    context.fillStyle = '#bc9d87';
    context.font = '700 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillText('留学规划 · 语言提升', x + 267, y + 31);
    context.fillText('从思达启航，走向更美好的未来', x + 267, y + 50);
    context.restore();
  }

  private drawImageContain(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    const imageRatio = image.naturalWidth / image.naturalHeight;
    const boxRatio = width / height;
    const drawWidth = imageRatio > boxRatio ? width : height * imageRatio;
    const drawHeight = imageRatio > boxRatio ? width / imageRatio : height;
    const drawX = x + (width - drawWidth) / 2;
    const drawY = y + (height - drawHeight) / 2;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  }

  private drawCircularImage(context: CanvasRenderingContext2D, image: HTMLImageElement, centerX: number, centerY: number, radius: number): void {
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.clip();
    this.drawImageCover(context, image, centerX - radius, centerY - radius, radius * 2, radius * 2);
    context.restore();
  }

  private drawDashedLine(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number): void {
    context.save();
    context.setLineDash([4, 4]);
    context.strokeStyle = '#d6dce0';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.restore();
  }

  private drawSolidLine(
    context: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
  ): void {
    context.save();
    context.setLineDash([]);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.restore();
  }

  private drawWrappedText(
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    font: string,
    color: string,
    maxLines = 3,
  ): number {
    context.font = font;
    context.fillStyle = color;
    const lines = this.wrapCanvasText(context, text, maxWidth, maxLines);
    lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));

    return y + lines.length * lineHeight;
  }

  private wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
    // Keep opening/closing punctuation with its word so a cell never strands a bracket.
    const tokens = text.match(/[（(【「“]*[A-Za-z0-9]+(?:[./:+-][A-Za-z0-9]+)*[）)】」”，。；：！？、]*|\s+|[（(【「“]*.[）)】」”，。；：！？、]*/g) ?? [text];
    const lines: string[] = [];
    let currentLine = '';

    for (const token of tokens) {
      const candidate = currentLine + token;
      if (context.measureText(candidate).width <= maxWidth || currentLine.length === 0) {
        currentLine = candidate;
        continue;
      }

      lines.push(currentLine.trim());
      currentLine = token.trimStart();

      if (lines.length === maxLines) {
        break;
      }
    }

    if (lines.length < maxLines && currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    if (lines.length === maxLines && tokens.join('').length > lines.join('').length) {
      const lastLine = lines[maxLines - 1];
      lines[maxLines - 1] = lastLine.length > 2 ? `${lastLine.slice(0, -1)}...` : lastLine;
    }

    return lines;
  }

  private roundedRectPath(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    const safeRadius = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + safeRadius, y);
    context.lineTo(x + width - safeRadius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    context.lineTo(x + width, y + height - safeRadius);
    context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    context.lineTo(x + safeRadius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    context.lineTo(x, y + safeRadius);
    context.quadraticCurveTo(x, y, x + safeRadius, y);
    context.closePath();
  }

  private loadCanvasImage(source: string): Promise<HTMLImageElement> {
    return loadQuoteImage(source).catch(() => loadQuoteImage(source));
  }
}
