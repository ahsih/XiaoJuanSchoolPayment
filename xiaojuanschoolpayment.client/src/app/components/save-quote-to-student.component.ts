import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentApplicationDTO } from '../../interfaces/student-application.dto';
import { StudentApplicationService } from '../../services/student-application.service';

/**
 * Employee-only: saves the current quote image into a student's application file as a 学生报价单 document.
 * Like every employee change it is a draft; the student sees it only after the application is published.
 * Shown by QuoteImageDownloadButtonComponent for signed-in Admin, Manager and Staff accounts.
 */
@Component({
  selector: 'app-save-quote-to-student',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  template: `
    <button type="button" class="save-to-student" [disabled]="disabled" (click)="open()">
      <mat-icon>folder_shared</mat-icon>存到学员档案
    </button>

    <div *ngIf="isOpen" class="sts-backdrop" role="presentation" (click)="close()" (keydown.escape)="close()">
      <form class="sts-dialog" role="dialog" aria-modal="true" aria-labelledby="sts-title"
        (submit)="$event.preventDefault(); save()" (click)="$event.stopPropagation()">
        <button type="button" class="sts-close" aria-label="关闭" [disabled]="saving" (click)="close()"><mat-icon>close</mat-icon></button>
        <h3 id="sts-title">存到学员档案</h3>

        <ng-container *ngIf="!savedTo; else done">
          <p>选择学员，当前报价单图片会作为“学生报价单”存进档案。和其他修改一样，发布后学员才能看到。</p>
          <label class="sts-field">
            搜索学员
            <input name="stsSearch" [(ngModel)]="search" (ngModelChange)="selected = null" placeholder="姓名、邮箱、手机或学校" autocomplete="off" />
          </label>

          <p *ngIf="loading" class="sts-hint">正在加载学员…</p>
          <div *ngIf="!loading" class="sts-list" role="listbox" aria-label="学员">
            <button type="button" *ngFor="let application of matches; trackBy: trackById" role="option"
              [attr.aria-selected]="selected?.id === application.id" [class.selected]="selected?.id === application.id"
              (click)="selected = application">
              <strong>{{ application.studentName || '未填姓名' }}</strong>
              <span>{{ application.schoolName }} · {{ application.status }}<ng-container *ngIf="application.studentEmail"> · {{ application.studentEmail }}</ng-container></span>
            </button>
            <p *ngIf="!matches.length" class="sts-hint">{{ applications.length ? '没有找到这位学员' : '还没有学员档案，请先在员工后台新建' }}</p>
          </div>

          <label class="sts-field">
            文件名称
            <input name="stsName" [(ngModel)]="displayName" maxlength="120" />
          </label>
          <label class="sts-check">
            <input type="checkbox" name="stsVisible" [(ngModel)]="visibleToStudent" />发布后学员可以查看和下载
          </label>

          <p *ngIf="error" class="sts-error" role="alert">{{ error }}</p>
          <div class="sts-actions">
            <button type="button" class="sts-secondary" [disabled]="saving" (click)="close()">取消</button>
            <button type="submit" class="sts-primary" [disabled]="saving || !selected">
              <mat-icon>save</mat-icon>{{ saving ? '正在保存…' : '保存到档案' }}
            </button>
          </div>
        </ng-container>

        <ng-template #done>
          <p class="sts-done"><mat-icon>check_circle</mat-icon>已存到 {{ savedTo?.studentName }} 的档案。</p>
          <p>现在是草稿，到员工后台提交或发布后，学员中心才会显示。</p>
          <div class="sts-actions">
            <button type="button" class="sts-secondary" (click)="close()">关闭</button>
            <a class="sts-primary" [routerLink]="'/admin/student-applications'" [queryParams]="{ applicationId: savedTo?.id }" (click)="close()">
              <mat-icon>open_in_new</mat-icon>打开档案
            </a>
          </div>
        </ng-template>
      </form>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .save-to-student {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      min-height: 40px; padding: 8px 14px; border: 1px dashed #16836a; border-radius: 10px;
      background: #f3faf7; color: #145c3d; font: inherit; font-weight: 700; cursor: pointer;
    }
    .save-to-student:disabled { opacity: .55; cursor: not-allowed; }
    .save-to-student mat-icon, .sts-primary mat-icon, .sts-done mat-icon { width: 20px; height: 20px; font-size: 20px; }
    .sts-backdrop {
      position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; padding: 20px;
      background: rgba(15, 30, 25, .45);
    }
    .sts-dialog {
      position: relative; display: grid; gap: 12px; width: min(520px, 100%); max-height: calc(100vh - 40px);
      overflow: auto; padding: 22px; border-radius: 16px; background: #fff; color: #20384c; text-align: left;
      box-shadow: 0 18px 50px rgba(0, 0, 0, .2);
    }
    .sts-dialog h3 { margin: 0; padding-right: 36px; font-size: 20px; }
    .sts-dialog p { margin: 0; line-height: 1.6; color: #52645e; }
    .sts-close {
      position: absolute; top: 12px; right: 12px; display: grid; place-items: center; width: 36px; height: 36px;
      border: 0; border-radius: 50%; background: #f1f5f4; color: #52645e; cursor: pointer;
    }
    .sts-field { display: grid; gap: 6px; font-weight: 700; }
    .sts-field input {
      min-height: 42px; padding: 8px 12px; border: 1px solid #cfdcd8; border-radius: 10px; font: inherit; font-weight: 400;
    }
    .sts-list { display: grid; gap: 6px; max-height: 240px; overflow: auto; }
    .sts-list button {
      display: grid; gap: 2px; padding: 9px 12px; border: 1px solid #e1e9e6; border-radius: 10px;
      background: #fff; color: #20384c; font: inherit; text-align: left; cursor: pointer;
    }
    .sts-list button span { color: #6b7c76; font-size: 13px; }
    .sts-list button.selected { border-color: #16836a; background: #eef8f4; box-shadow: inset 3px 0 #16836a; }
    .sts-hint { font-size: 14px; }
    .sts-check { display: flex; align-items: center; gap: 8px; }
    .sts-check input { width: 18px; height: 18px; }
    .sts-error { color: #b42318 !important; font-weight: 700; }
    .sts-done { display: flex; align-items: center; gap: 6px; color: #145c3d !important; font-weight: 800; }
    .sts-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px; }
    .sts-secondary, .sts-primary {
      display: inline-flex; align-items: center; gap: 6px; min-height: 42px; padding: 8px 16px; border-radius: 10px;
      font: inherit; font-weight: 700; text-decoration: none; cursor: pointer;
    }
    .sts-secondary { border: 1px solid #cfdcd8; background: #fff; color: #20384c; }
    .sts-primary { border: 0; background: #16836a; color: #fff; }
    .sts-primary:disabled { opacity: .55; cursor: not-allowed; }
    @media (max-width: 560px) {
      .sts-backdrop { align-items: end; padding: 0; }
      .sts-dialog { width: 100%; max-height: 92vh; border-radius: 16px 16px 0 0; }
      .sts-actions > * { flex: 1 1 0; justify-content: center; }
    }
  `],
})
export class SaveQuoteToStudentComponent {
  private readonly applicationService = inject(StudentApplicationService);

  /** Renders the quote image; the parent reuses the same renderer as its own save button. */
  @Input({ required: true }) createBlob!: () => Promise<Blob>;
  @Input() fileName = '报价单.png';
  @Input() disabled = false;

  isOpen = false;
  loading = false;
  saving = false;
  error = '';
  search = '';
  displayName = '';
  visibleToStudent = true;
  applications: StudentApplicationDTO[] = [];
  selected: StudentApplicationDTO | null = null;
  savedTo: StudentApplicationDTO | null = null;

  readonly trackById = (_: number, application: StudentApplicationDTO) => application.id;

  get matches(): StudentApplicationDTO[] {
    const query = this.search.trim().toLowerCase();
    const list = query
      ? this.applications.filter((application) =>
        [application.studentName, application.studentEmail, application.studentPhone, application.schoolName]
          .some((value) => (value ?? '').toLowerCase().includes(query)))
      : this.applications;
    return list.slice(0, 50);
  }

  async open(): Promise<void> {
    this.isOpen = true;
    this.error = '';
    this.savedTo = null;
    this.selected = null;
    this.displayName = this.fileName.replace(/\.png$/i, '').trim() || '报价单';
    this.loading = true;
    try {
      const applications = await firstValueFrom(this.applicationService.getAll());
      // Most recently edited first: the student an employee is quoting for is usually one they just worked on.
      this.applications = (applications ?? [])
        .filter((application) => application.status !== '已取消')
        .sort((left, right) => (right.lastUpdated ?? '').localeCompare(left.lastUpdated ?? ''));
    } catch (error) {
      this.applications = [];
      this.error = this.errorText(error, '学员列表加载失败，请确认已用员工账号登录。');
    } finally {
      this.loading = false;
    }
  }

  close(): void {
    if (this.saving) return;
    this.isOpen = false;
  }

  async save(): Promise<void> {
    const target = this.selected;
    if (!target || this.saving) return;
    this.saving = true;
    this.error = '';
    try {
      const blob = await this.createBlob();
      const name = (this.displayName.trim() || '报价单').slice(0, 120);
      const file = new File([blob], `${name.replace(/[\\/:*?"<>|]/g, '-')}.png`, { type: 'image/png' });
      await firstValueFrom(this.applicationService.uploadDocument(target.id, file, '学生报价单', name, this.visibleToStudent));
      this.savedTo = target;
    } catch (error) {
      this.error = this.errorText(error, '保存失败，请稍后再试。');
    } finally {
      this.saving = false;
    }
  }

  private errorText(error: unknown, fallback: string): string {
    const response = error as { status?: number; error?: unknown };
    if (response?.status === 401 || response?.status === 403) return '登录已过期或没有权限，请重新登录员工账号。';
    if (typeof response?.error === 'string' && response.error.trim() && response.error.length < 200) return response.error;
    const message = (response?.error as { message?: unknown })?.message;
    if (typeof message === 'string' && message.trim()) return message;
    return error instanceof Error && /[一-龥]/.test(error.message) ? error.message : fallback;
  }
}
