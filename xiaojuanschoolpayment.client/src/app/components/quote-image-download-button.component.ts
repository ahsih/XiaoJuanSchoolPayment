import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExchangeRateService, CnyExchangeRateSnapshot, isUsableExchangeRates, unavailableRates } from '../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuoteImagePreviewComponent } from './quote-image-preview.component';
import { downloadQuoteBlob, encodeQuoteCanvas, loadQuoteImage, quoteBlobDataUrl,
  quoteCanvasScale, quoteImageEnvironment, validateQuoteBlob } from './quote-image-export';
import {
  QUOTE_IMAGE_WIDTH,
  detailedGrid,
  detailedLocalNote,
  detailedQuoteImageHeight,
  drawCircularImage,
  drawDetailedQuoteImage,
  drawImageContain,
  drawQuoteBrandHeader,
  drawRoundedImageCover,
  drawRoundedRect,
  drawSolidLine,
  drawWrappedText,
  measureDetailedQuoteLayout,
  quoteBrandLogoSource,
  quoteFooterNotes,
  withoutExchangeNote,
  wrapCanvasText,
} from './quote-image-detailed-renderer';
import { drawPlanCompareImage, planCompareImageHeight } from './plan-compare/plan-compare-image-renderer';
import { planCompareReady } from './plan-compare/plan-compare-sheet';

export type QuoteImageActionMode = 'download' | 'email';

import type {
  QuoteImageInfoItem,
  QuoteImagePaymentItem,
  QuoteImageLocalFeeItem,
  QuoteImageOptionalFeeItem,
  QuoteImageBenefitItem,
  QuoteImageAlumniBenefitItem,
  QuoteImageContact,
  QuoteImageCardData,
} from './quote-image-types';
export type {
  QuoteImageInfoItem,
  QuoteImagePaymentItem,
  QuoteImageLocalFeeItem,
  QuoteImageOptionalFeeItem,
  QuoteImageBenefitItem,
  QuoteImageAlumniBenefitItem,
  QuoteImageContact,
  QuoteImageCardData,
} from './quote-image-types';

@Component({
  selector: 'app-quote-image-download-button',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, QuoteImagePreviewComponent],
  template: `
    <p *ngIf="!ratesReady" role="status">最新参考汇率暂不可用，人民币金额待更新；汇率更新后可保存报价图片。</p>
    <button type="button" [class]="buttonClass" [disabled]="disabled || isSaving || !ratesReady" (click)="handleButtonClick()">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>{{ !ratesReady ? '最新参考汇率待更新' : isSaving ? savingLabel : label }}
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
  private ratesSnapshot: CnyExchangeRateSnapshot = unavailableRates();
  protected get ratesReady(): boolean { return isUsableExchangeRates(this.ratesSnapshot); }
  private readonly rateSubscription = inject(ExchangeRateService).getLatestCnyRates().pipe(takeUntilDestroyed()).subscribe(r => {
    this.ratesSnapshot = r;
  });
  @Input({ required: true }) quote!: QuoteImageCardData;
  @Input() label = '保存报价单图片';
  @Input() savingLabel = '生成中...';
  @Input() buttonClass = 'secondary-action';
  @Input() icon = 'image';
  @Input() disabled = false;
  /** Optional desktop preview using the existing mobile image-save dialog. */
  @Input() previewBeforeDownload = false;
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
    if (this.disabled || this.isSaving || !this.ratesReady) {
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
    if (this.disabled || this.destroyed || this.isSaving || !this.quote || !this.ratesReady) {
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
    this.isPreviewOpen = environment.mobile || this.previewBeforeDownload;
    const fileName = this.quote.fileName || 'quote-image.png';

    try {
      const blob = await this.createQuoteImageBlob();
      if (sequence !== this.saveSequence || this.destroyed) return;
      if (environment.mobile || this.previewBeforeDownload) {
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
    if (!this.ratesReady || /NaN|Infinity/.test(JSON.stringify(this.quote))) throw new Error('最新参考汇率暂不可用，请稍后重试。');
    const consultants = this.quote.consultants?.length ? this.quote.consultants : [this.quote.contact];
    const compareSheet = this.quote.layout === 'plan-compare' ? this.quote.planCompare : undefined;
    if (this.quote.layout === 'plan-compare' && (!compareSheet || !planCompareReady(compareSheet))) throw new Error('对比方案还有需要修改的地方。');
    const [logo, hero, consultantAssets] = await Promise.all([
      this.loadCanvasImage(quoteBrandLogoSource(this.quote)),
      this.loadCanvasImage(this.quote.heroSrc),
      Promise.all(
        (this.quote.layout === 'cia-detailed' || compareSheet ? [] : consultants.slice(0, 3)).map(async (consultant) => ({
          consultant,
          avatar: await this.loadCanvasImage(consultant.avatarSrc),
          qr: await this.loadCanvasImage(consultant.qrSrc),
        })),
      ),
    ]);
    const width = QUOTE_IMAGE_WIDTH;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available');
    }

    const height = compareSheet
      ? planCompareImageHeight(context, compareSheet)
      : this.quote.layout === 'cia-detailed'
        ? detailedQuoteImageHeight(context, this.quote)
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
          if (compareSheet) {
            drawPlanCompareImage<HTMLImageElement>(context, this.quote, compareSheet, { logo, hero }, width, height);
          } else if (this.quote.layout === 'cia-detailed') {
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

  /** Reuse the production canvas renderer for embedded employee previews without downloading a file. */
  async createPreviewDataUrl(scaleOverride = 1): Promise<string> {
    return quoteBlobDataUrl(await this.createQuoteImageBlob(scaleOverride));
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

    drawQuoteBrandHeader(context, this.quote, assets.logo, 36, 24);
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
    drawRoundedImageCover(context, hero, 675, 137, 300, 242, 12);
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

  // The detailed layout and shared drawing helpers live in quote-image-detailed-renderer.ts (also used by
  // the mini program). These members keep the component's former entry points for specs and callers.
  private get detailedGrid() {
    return detailedGrid(this.quote);
  }

  private measureFullFeeLayout(context: CanvasRenderingContext2D) {
    return measureDetailedQuoteLayout(context, this.quote);
  }

  private detailedLocalNote(row: QuoteImageLocalFeeItem): string {
    return detailedLocalNote(this.quote, row);
  }

  private withoutExchangeNote(text: string): string {
    return withoutExchangeNote(text);
  }

  private quoteFooterNotes(): string[] {
    return quoteFooterNotes(this.quote);
  }

  private drawDetailedQuoteImage(
    context: CanvasRenderingContext2D,
    assets: { logo: HTMLImageElement; hero: HTMLImageElement; consultants: Array<{ consultant: QuoteImageContact }> },
    width: number,
    height: number,
  ): void {
    drawDetailedQuoteImage(context, this.quote, assets, width, height);
  }

  private drawRoundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number,
    radius: number, fill: string, stroke?: string, lineWidth = 1): void {
    drawRoundedRect(context, x, y, width, height, radius, fill, stroke, lineWidth);
  }

  private drawImageContain(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number): void {
    drawImageContain(context, image, x, y, width, height);
  }

  private drawCircularImage(context: CanvasRenderingContext2D, image: HTMLImageElement, centerX: number, centerY: number, radius: number): void {
    drawCircularImage(context, image, centerX, centerY, radius);
  }

  private drawSolidLine(context: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string): void {
    drawSolidLine(context, fromX, fromY, toX, toY, color);
  }

  private drawWrappedText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number,
    lineHeight: number, font: string, color: string, maxLines = 3): number {
    return drawWrappedText(context, text, x, y, maxWidth, lineHeight, font, color, maxLines);
  }

  private wrapCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
    return wrapCanvasText(context, text, maxWidth, maxLines);
  }

  private loadCanvasImage(source: string): Promise<HTMLImageElement> {
    return loadQuoteImage(source).catch(() => loadQuoteImage(source));
  }
}
