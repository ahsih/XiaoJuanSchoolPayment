import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { QuoteImageCardData, QuoteImageDownloadButtonComponent } from './quote-image-download-button.component';

@Component({
  selector: 'app-quote-image-inline-preview',
  standalone: true,
  imports: [CommonModule, QuoteImageDownloadButtonComponent],
  template: `
    <app-quote-image-download-button #renderer class="hidden-renderer" [quote]="quote" />
    <div class="preview-state" *ngIf="busy">正在生成真实报价图片预览…</div>
    <div class="preview-state error" *ngIf="error">{{ error }}</div>
    <img *ngIf="src" [src]="src" alt="CIA 报价单图片实时预览" />
  `,
  styles: [`
    :host { display:block; min-height:640px; background:#e8eeec; }
    .hidden-renderer { display:none; }
    img { display:block; width:100%; height:auto; background:white; }
    .preview-state { padding:36px 18px; text-align:center; color:#47645c; font-weight:700; }
    .error { color:#a33b2b; }
  `],
})
export class QuoteImageInlinePreviewComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) quote!: QuoteImageCardData;
  @ViewChild('renderer') renderer?: QuoteImageDownloadButtonComponent;
  src = '';
  busy = true;
  error = '';
  private viewReady = false;
  private sequence = 0;

  ngAfterViewInit(): void {
    this.viewReady = true;
    void this.render();
  }

  ngOnChanges(): void {
    if (this.viewReady) void this.render();
  }

  private async render(): Promise<void> {
    const sequence = ++this.sequence;
    this.busy = true;
    this.error = '';
    try {
      const src = await this.renderer?.createPreviewDataUrl(.8);
      if (sequence === this.sequence && src) this.src = src;
    } catch {
      if (sequence === this.sequence) this.error = '报价图片预览暂时无法生成，请稍后重试。';
    } finally {
      if (sequence === this.sequence) this.busy = false;
    }
  }
}
