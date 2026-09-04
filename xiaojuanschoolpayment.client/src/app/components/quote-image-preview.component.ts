import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-quote-image-preview',
  standalone: true,
  imports: [CommonModule, A11yModule],
  template: `
    <div class="preview-backdrop">
      <section class="preview-dialog" role="dialog" aria-modal="true" aria-label="报价单图片预览"
        cdkTrapFocus [cdkTrapFocusAutoCapture]="true" [attr.aria-busy]="busy">
        <header>
          <h2>报价单图片</h2>
          <button type="button" class="close" aria-label="关闭图片预览" cdkFocusInitial (click)="closed.emit()">关闭</button>
        </header>
        <div class="instructions" aria-live="polite">
          <p *ngIf="busy">正在生成报价单，请稍候…</p>
          <ng-container *ngIf="src && !busy">
            <strong>长按下方图片，选择“保存图片”</strong>
            <p>{{ wechat ? '在微信内即可尝试保存到相册，无需下载文件。' : '也可使用下方按钮保存或分享。' }}</p>
          </ng-container>
          <p *ngIf="error" class="error" role="alert">{{ error }}</p>
        </div>
        <div class="image-scroll">
          <img *ngIf="src" [src]="src" alt="完整报价单，长按可保存图片" (error)="imageFailed.emit()" />
          <div *ngIf="busy" class="loading" role="status">图片生成中…</div>
        </div>
        <footer>
          <button *ngIf="error && !busy && !src" type="button" class="primary" (click)="retry.emit()">重新生成</button>
          <button *ngIf="src && canShare && !wechat" type="button" class="primary" [disabled]="sharing" (click)="share.emit()">保存 / 分享图片</button>
          <button *ngIf="src && !wechat" type="button" (click)="download.emit()">下载图片</button>
          <p *ngIf="src && wechat">若长按未出现保存选项，可点微信右上角“…”在浏览器打开后保存。</p>
          <p *ngIf="src && !wechat">长按保存或系统分享菜单是否可用，以当前浏览器为准。</p>
        </footer>
      </section>
    </div>
  `,
  styleUrl: './quote-image-preview.component.css',
})
export class QuoteImagePreviewComponent implements OnInit, OnDestroy {
  @Input() src = '';
  @Input() busy = false;
  @Input() error = '';
  @Input() wechat = false;
  @Input() canShare = false;
  @Input() sharing = false;
  @Output() closed = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();
  @Output() share = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() imageFailed = new EventEmitter<void>();
  private previousOverflow = '';

  ngOnInit(): void {
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.documentElement.style.overflow = this.previousOverflow;
  }

  @HostListener('document:keydown.escape') onEscape(): void { this.closed.emit(); }
}
