import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
  fileName: string;
  logoSrc: string;
  heroSrc: string;
  schoolCode: string;
  title: string;
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
  totalNote?: string;
  localFeeTitle?: string;
  localFeeAmount: string;
  localFeeDescription: string;
  localFeeNote: string;
  localFeeItems?: QuoteImageLocalFeeItem[];
  localFeeCny?: string;
  exchangeRateText?: string;
  optionalFeeItems?: QuoteImageOptionalFeeItem[];
  benefitItems?: QuoteImageBenefitItem[];
  serviceLocations?: string[];
  alumniBenefitItems?: QuoteImageAlumniBenefitItem[];
  importantNotes?: string[];
  noteTitle?: string;
  note: string;
  contact: QuoteImageContact;
  consultants?: QuoteImageContact[];
}

@Component({
  selector: 'app-quote-image-download-button',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <button type="button" [class]="buttonClass" [disabled]="disabled || isSaving" (click)="handleButtonClick()">
      <mat-icon *ngIf="icon">{{ icon }}</mat-icon>{{ isSaving ? savingLabel : label }}
    </button>

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
export class QuoteImageDownloadButtonComponent {
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
    if (this.isSaving || !this.quote) {
      return;
    }

    this.isSaving = true;

    try {
      const blob = await this.createQuoteImageBlob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = this.quote.fileName || 'quote-image.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      console.error('Failed to create quote image', error);
      window.alert('报价单图片生成失败，请稍后重试。');
    } finally {
      this.isSaving = false;
    }
  }

  private async createQuoteImageBlob(scaleOverride?: number): Promise<Blob> {
    const consultants = this.quote.consultants?.length ? this.quote.consultants : [this.quote.contact];
    const [logo, hero, consultantAssets] = await Promise.all([
      this.loadCanvasImage(this.quote.logoSrc),
      this.loadCanvasImage(this.quote.heroSrc),
      Promise.all(
        consultants.map(async (consultant) => ({
          consultant,
          avatar: await this.loadCanvasImage(consultant.avatarSrc),
          qr: await this.loadCanvasImage(consultant.qrSrc),
        })),
      ),
    ]);
    const width = 1032;
    const height = this.quote.layout === 'cia-detailed' ? 1764 : 1848;
    const scale = scaleOverride ?? Math.max(2, Math.min(window.devicePixelRatio || 2, 3));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Canvas is not available');
    }

    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    if (this.quote.layout === 'cia-detailed') {
      this.drawDetailedQuoteImage(
        context,
        { logo, hero, consultants: consultantAssets.slice(0, 5) },
        width,
        height,
      );
    } else {
      this.drawQuoteImage(
        context,
        { logo, hero, consultants: consultantAssets.slice(0, 3) },
        width,
        height,
      );
    }

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.98));

    if (!blob) {
      throw new Error('Quote image could not be created');
    }

    return blob;
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

  private drawDetailedQuoteImage(
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
    const green = '#06422e';
    const orange = '#f25518';
    const navy = '#14233e';
    const border = '#dce4e7';
    const padding = 18;
    const contentWidth = width - padding * 2;

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

    this.drawImageContain(context, assets.logo, 252, 4, 520, 70);

    this.drawRoundedRect(context, padding, 80, contentWidth, 122, 10, '#ffffff', border, 1);
    context.font = '950 31px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(`${this.quote.schoolCode}${this.quote.title}报价单`, 54, 140);
    context.fillStyle = orange;
    context.fillRect(54, 151, 42, 3);
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

    this.drawRoundedRect(context, padding, 212, contentWidth, 510, 9, '#ffffff', border, 1);
    drawSectionNumber('01', this.quote.paymentSectionTitle ?? '学校费用明细（到校前支付给学校的费用）', 246);
    const paymentColumns = [36, 236, 420, 992];
    context.fillStyle = '#f3f6f4';
    context.fillRect(36, 262, 956, 36);
    ['项目', '金额（美元）', '说明'].forEach((label, index) => {
      const centers = [136, 328, 706];
      context.font = '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'center';
      context.fillText(label, centers[index], 286);
    });
    context.textAlign = 'left';
    const paymentRows = this.quote.paymentItems.slice(0, 7);
    const paymentRowHeights = [52, 74, 52, 60, 58, 62];
    const compactPaymentRowHeight = paymentRows.length > 0 && paymentRows.length !== 6
      ? Math.min(150, Math.floor(358 / paymentRows.length))
      : 0;
    let paymentRowTop = 298;
    paymentRows.forEach((row, index) => {
      const rowHeight = compactPaymentRowHeight || paymentRowHeights[index] || 46;
      const top = paymentRowTop;
      if (index % 2 === 1) {
        context.fillStyle = '#fbfcfc';
        context.fillRect(36, top, 956, rowHeight);
      }
      this.drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
      context.textAlign = 'center';
      drawCenteredTableText(row.label, 136, top, rowHeight, 170, row.accent ? orange : navy, `${row.accent ? '850' : '700'} 18px "Microsoft YaHei", "PingFang SC", Arial, sans-serif`, 2, 21);
      drawCenteredTableText(row.amount, 328, top, rowHeight, 150, row.accent ? orange : navy, '850 19px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
      context.textAlign = 'left';
      drawCenteredTableText(row.note ?? '—', 438, top, rowHeight, 532, row.accent ? orange : '#334155', '650 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 3, 20);
      paymentRowTop += rowHeight;
    });
    paymentColumns
      .slice(1, -1)
      .forEach((x) =>
        this.drawSolidLine(context, x, 262, x, paymentRowTop, '#e1e6e8'),
      );
    this.drawSolidLine(context, 36, paymentRowTop, 992, paymentRowTop, '#e1e6e8');
    context.fillStyle = '#fffaf5';
    context.fillRect(36, paymentRowTop, 956, 64);
    context.fillStyle = orange;
    context.fillRect(36, paymentRowTop, 5, 64);
    this.drawSolidLine(context, 236, paymentRowTop, 236, paymentRowTop + 64, '#eadfd6');
    this.drawSolidLine(context, 420, paymentRowTop, 420, paymentRowTop + 64, '#eadfd6');
    context.textAlign = 'center';
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText(this.quote.totalLabel, 136, paymentRowTop + 27);
    context.font = '700 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.fillText('优惠已计入', 136, paymentRowTop + 48);
    context.font = '950 27px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = orange;
    context.fillText(this.quote.totalUsd, 328, paymentRowTop + 39);
    context.textAlign = 'left';
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillText(this.quote.totalCny, 438, paymentRowTop + 27);
    drawTableText(this.quote.totalNote ?? '', 438, paymentRowTop + 49, 530, '#64748b', '650 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);

    this.drawRoundedRect(context, padding, 734, contentWidth, 708, 9, '#ffffff', border, 1);
    drawSectionNumber('02', this.quote.localFeeTitle ?? '到校后学杂费明细参考（学校及相关部门收取）', 768);
    const localColumns = [36, 236, 420, 992];
    context.fillStyle = '#f3f6f4';
    context.fillRect(36, 784, 956, 36);
    const localHeaders = ['项目', '本次预计金额（比索）', '简要说明'];
    localHeaders.forEach((label, index) => {
      context.font = '850 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'center';
      context.fillText(label, (localColumns[index] + localColumns[index + 1]) / 2, 808);
    });
    context.textAlign = 'left';
    const localRows = this.quote.localFeeItems?.slice(0, 10) ?? [];
    const localRowHeights = [54, 50, 62, 48, 50, 50, 62, 52, 46];
    const compactLocalRowHeight = localRows.length > 0 && localRows.length < 9
      ? Math.min(118, Math.floor(474 / localRows.length))
      : 0;
    let localRowTop = 820;
    localRows.forEach((row, index) => {
      const top = localRowTop;
      const rowHeight = compactLocalRowHeight || localRowHeights[index] || 56;
      if (index % 2 === 1) {
        context.fillStyle = '#fbfcfc';
        context.fillRect(36, top, 956, rowHeight);
      }
      this.drawSolidLine(context, 36, top, 992, top, '#e1e6e8');
      context.textAlign = 'center';
      drawCenteredTableText(row.label, 136, top, rowHeight, 174, navy, '700 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 19);
      drawCenteredTableText(row.amount, 328, top, rowHeight, 150, navy, '850 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif');
      context.textAlign = 'left';
      drawCenteredTableText(row.note, 438, top, rowHeight, 532, '#475569', '600 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 18);
      localRowTop += rowHeight;
    });
    localColumns.slice(1, -1).forEach((x) => this.drawSolidLine(context, x, 784, x, localRowTop, '#e1e6e8'));
    this.drawSolidLine(context, 36, localRowTop, 992, localRowTop, '#e1e6e8');
    context.fillStyle = '#fffaf5';
    context.fillRect(36, localRowTop, 956, 64);
    context.fillStyle = orange;
    context.fillRect(36, localRowTop, 5, 64);
    this.drawSolidLine(context, 236, localRowTop, 236, localRowTop + 64, '#eadfd6');
    this.drawSolidLine(context, 420, localRowTop, 420, localRowTop + 64, '#eadfd6');
    context.textAlign = 'center';
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText('预计到校学杂费合计', 136, localRowTop + 36);
    context.font = '950 22px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = orange;
    context.fillText(this.quote.localFeeAmount, 328, localRowTop + 38);
    context.textAlign = 'left';
    context.font = '900 17px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillText(this.quote.localFeeCny ?? '', 438, localRowTop + 27);
    drawTableText('按实时汇率预估，实际以到校缴费为准', 438, localRowTop + 49, 530, '#64748b', '650 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 16);

    const optionalFees = this.quote.optionalFeeItems?.slice(0, 2) ?? [];
    const optionalTop = localRowTop + 70;
    this.drawRoundedRect(context, 36, optionalTop, 956, 64, 7, '#f8fbf9', '#d7e6dc', 1);
    this.drawSolidLine(context, 236, optionalTop, 236, optionalTop + 64, '#dfe8e2');
    this.drawSolidLine(context, 420, optionalTop, 420, optionalTop + 64, '#dfe8e2');
    optionalFees.forEach((item, index) => {
      const rowTop = optionalTop + index * 32;
      if (index > 0) {
        this.drawSolidLine(context, 36, rowTop, 992, rowTop, '#dfe8e2');
      }
      context.textAlign = 'center';
      context.font = '850 14px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.fillText(item.label, 136, rowTop + 21);
      context.font = '900 15px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = orange;
      context.fillText(item.amount, 328, rowTop + 21);
      context.textAlign = 'left';
      drawTableText(item.note, 438, rowTop + 21, 530, '#64748b', '650 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 1, 15);
    });

    this.drawRoundedRect(context, padding, 1454, contentWidth, 174, 9, '#ffffff', border, 1);
    drawSectionNumber('03', '为什么选择思达启航？', 1490);

    const benefits = this.quote.benefitItems?.slice(0, 4) ?? [];
    this.drawRoundedRect(context, 36, 1505, 956, 68, 8, '#f7faf8', '#dce7e1', 1);
    benefits.forEach((item, index) => {
      const x = 36 + index * 238;
      const y = 1505;
      if (index > 0) {
        this.drawSolidLine(context, x, y + 10, x, y + 58, '#dce7e1');
      }
      this.drawRoundedRect(context, x + 16, y + 16, 10, 10, 5, index === 1 ? orange : green);
      context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = green;
      context.textAlign = 'left';
      context.fillText(item.title, x + 34, y + 27);
      drawTableText(item.text, x + 16, y + 49, 206, '#64748b', '650 12px "Microsoft YaHei", "PingFang SC", Arial, sans-serif', 2, 15);
    });

    const serviceLocations = this.quote.serviceLocations?.slice(0, 3) ?? [
      '深圳总部',
      '菲律宾驻点',
      '欧洲驻点',
    ];
    context.font = '750 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = '#64748b';
    context.textAlign = 'right';
    context.fillText(serviceLocations.join(' · '), 984, 1487);
    context.textAlign = 'left';

    const alumniText = this.quote.alumniBenefitItems?.[0]?.text ?? '';
    this.drawRoundedRect(context, 36, 1581, 956, 36, 6, '#fff8f1', '#f2b38c', 1);
    context.fillStyle = orange;
    context.fillRect(36, 1581, 5, 36);
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = orange;
    context.textAlign = 'left';
    context.fillText('老学员专属优惠', 54, 1605);
    context.font = '800 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = navy;
    context.fillText(alumniText, 206, 1605);

    this.drawRoundedRect(context, padding, 1640, contentWidth, 106, 8, '#f7faf8', '#dce7e1', 1);
    context.font = '900 16px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
    context.fillStyle = green;
    context.fillText('04  重要说明', 38, 1672);
    const importantNotes = this.quote.importantNotes?.length
      ? this.quote.importantNotes
      : [this.quote.note];
    importantNotes.slice(0, 3).forEach((note, index) => {
      context.font = '650 13px "Microsoft YaHei", "PingFang SC", Arial, sans-serif';
      context.fillStyle = '#475569';
      context.fillText(`✓ ${note}`, 174, 1671 + index * 27);
    });
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

    this.drawImageContain(context, assets.logo, 36, 24, 520, 70);
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
    const tokens = text.match(/[A-Za-z0-9]+(?:[./:+-][A-Za-z0-9]+)*|\s+|./g) ?? [text];
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
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Image failed to load: ${source}`));
      image.src = source;
    });
  }
}
