import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * One-time notice for a student who opened a consultant's personal link: the consultant is told
 * which school pages they look at (BrowseAlertTracker). Created by AppComponent only when needed.
 */
@Component({
  selector: 'app-browse-alert-notice',
  standalone: true,
  template: `
    <aside class="browse-notice" role="status" aria-live="polite">
      <p>
        你正在浏览思达启航顾问 <strong>{{ consultant }}</strong> 发给你的链接。为了及时解答你的问题，{{ consultant }}
        会收到你看过哪些学校页面的提醒。
      </p>
      <div class="actions">
        <button type="button" class="primary" (click)="acknowledged.emit()">知道了</button>
        <button type="button" class="quiet" (click)="optedOut.emit()">不用提醒顾问</button>
      </div>
    </aside>
  `,
  styles: [`
    :host { position: fixed; left: 50%; bottom: 16px; z-index: 1300; width: min(520px, calc(100vw - 24px)); transform: translateX(-50%); }
    .browse-notice { padding: 14px 16px; border: 1px solid #d8e6e0; border-radius: 14px; background: #fff; color: #10233d; box-shadow: 0 12px 36px rgba(16, 35, 61, .18); }
    p { margin: 0; font-size: 14px; line-height: 1.65; }
    .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
    button { min-height: 36px; padding: 0 14px; border-radius: 9px; font-size: 14px; font-weight: 700; cursor: pointer; }
    .primary { border: 0; background: #f06b1d; color: #fff; }
    .quiet { border: 1px solid #d0d7de; background: #fff; color: #4a5a68; }
  `],
})
export class BrowseAlertNoticeComponent {
  @Input() consultant = '';
  @Output() readonly acknowledged = new EventEmitter<void>();
  @Output() readonly optedOut = new EventEmitter<void>();
}
