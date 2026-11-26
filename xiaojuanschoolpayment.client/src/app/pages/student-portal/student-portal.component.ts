import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import {
  STUDENT_APPLICATION_STATUSES,
  STUDENT_SUBMISSION_TYPES,
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
  StudentPaymentDTO,
  StudentSubmissionDTO,
  studentCurrencyName,
  studentMoney,
} from '../../../interfaces/student-application.dto';
import { AuthService } from '../../../services/auth.service';
import { StudentApplicationService } from '../../../services/student-application.service';
import { SIDA_PHILIPPINES_CONSULTANTS, SidaConsultant } from '../../components/sida-consultants';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const UPLOAD_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.docx'];

interface UploadDraft {
  documentType: string;
  note: string;
  file: File | null;
  busy: boolean;
}

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './student-portal.component.html',
  styleUrl: './student-portal.component.css',
})
export class StudentPortalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly statuses = STUDENT_APPLICATION_STATUSES.filter((status) => !['已取消', '保留/延期'].includes(status));
  readonly submissionTypes = STUDENT_SUBMISSION_TYPES;
  readonly uploadAccept = UPLOAD_EXTENSIONS.join(',');
  readonly currencyName = studentCurrencyName;
  readonly money = studentMoney;
  applications: StudentApplicationDTO[] = [];
  loading = true;
  changingPassword = false;
  deletingSubmissionId: string | null = null;
  private readonly uploads = new Map<string, UploadDraft>();

  readonly passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: (group) => (group.value.newPassword === group.value.confirmPassword ? null : { passwordMismatch: true }) },
  );

  constructor(
    private authService: AuthService,
    private applicationService: StudentApplicationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.applicationService.getMine().subscribe({
      next: (applications) => {
        this.applications = applications ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('报名信息加载失败，请重新登录后再试', '关闭', { duration: 4000 });
      },
    });
  }

  consultant(application: StudentApplicationDTO): SidaConsultant | undefined {
    const name = application.consultantName?.trim().toLowerCase();
    return name ? SIDA_PHILIPPINES_CONSULTANTS.find((item) => item.name.toLowerCase() === name) : undefined;
  }

  hasFees(application: StudentApplicationDTO): boolean {
    return !!application.feeItems?.length || !!application.payments.length;
  }

  upload(application: StudentApplicationDTO): UploadDraft {
    let draft = this.uploads.get(application.id);
    if (!draft) {
      const waiting = application.requestedDocuments?.find((request) => request.uploadStatus !== '已收到' && request.uploadStatus !== '待确认');
      draft = { documentType: waiting?.documentType ?? STUDENT_SUBMISSION_TYPES[0], note: '', file: null, busy: false };
      this.uploads.set(application.id, draft);
    }
    return draft;
  }

  chooseUploadType(application: StudentApplicationDTO, documentType: string): void {
    this.upload(application).documentType = documentType;
  }

  onUploadFile(application: StudentApplicationDTO, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    const draft = this.upload(application);
    if (!file) {
      draft.file = null;
      return;
    }
    const lowerName = file.name.toLowerCase();
    if (!UPLOAD_EXTENSIONS.some((extension) => lowerName.endsWith(extension))) {
      this.snackBar.open('只能上传 PDF、图片（JPG／PNG／WebP）或 Word（DOCX）文件', '关闭', { duration: 4000 });
      input.value = '';
      draft.file = null;
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      this.snackBar.open('文件不能超过 15MB，请压缩后再上传', '关闭', { duration: 4000 });
      input.value = '';
      draft.file = null;
      return;
    }
    draft.file = file;
  }

  submitUpload(application: StudentApplicationDTO, input: HTMLInputElement): void {
    const draft = this.upload(application);
    if (draft.busy) return;
    if (!draft.file) {
      this.snackBar.open('请先选择要上传的文件', '关闭', { duration: 3000 });
      return;
    }
    draft.busy = true;
    this.applicationService.uploadSubmission(application.id, draft.file, draft.documentType, draft.note.trim()).subscribe({
      next: () => {
        this.uploads.delete(application.id);
        input.value = '';
        this.snackBar.open('已上传，顾问确认后会显示“已收到”', '关闭', { duration: 4000 });
        this.load();
      },
      error: (error) => {
        draft.busy = false;
        this.snackBar.open(this.errorText(error, '上传失败，请稍后再试'), '关闭', { duration: 5000 });
      },
    });
  }

  deleteSubmission(application: StudentApplicationDTO, submission: StudentSubmissionDTO): void {
    if (this.deletingSubmissionId || !window.confirm(`删除“${submission.originalFileName}”？`)) return;
    this.deletingSubmissionId = submission.id;
    this.applicationService.deleteSubmission(application.id, submission.id).subscribe({
      next: () => {
        this.deletingSubmissionId = null;
        this.load();
      },
      error: (error) => {
        this.deletingSubmissionId = null;
        this.snackBar.open(this.errorText(error, '删除失败，请稍后再试'), '关闭', { duration: 4000 });
      },
    });
  }

  downloadSubmission(application: StudentApplicationDTO, submission: StudentSubmissionDTO): void {
    this.applicationService.downloadSubmission(application.id, submission);
  }

  submissionStatus(submission: StudentSubmissionDTO): string {
    if (submission.reviewStatus === 'Accepted') return '已收到';
    if (submission.reviewStatus === 'Returned') return '需重新上传';
    return '待顾问确认';
  }

  private errorText(error: unknown, fallback: string): string {
    const body = (error as { error?: unknown; status?: number })?.error;
    if ((error as { status?: number })?.status === 429) return '操作太频繁，请过几分钟再试';
    if (typeof body === 'string' && body.trim()) return body;
    const message = (body as { message?: string } | null)?.message;
    return message?.trim() || fallback;
  }

  logout(): void {
    this.authService.logout();
  }

  download(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    this.applicationService.downloadDocument(application.id, document);
  }

  downloadPaymentReceipt(application: StudentApplicationDTO, payment: StudentPaymentDTO): void {
    this.applicationService.downloadPaymentReceipt(application.id, payment);
  }

  statusIndex(application: StudentApplicationDTO): number {
    return Math.max(0, this.statuses.indexOf(application.status as typeof this.statuses[number]));
  }

  progress(application: StudentApplicationDTO): number {
    if (['已取消', '保留/延期'].includes(application.status)) return 0;
    return Math.round(((this.statusIndex(application) + 1) / this.statuses.length) * 100);
  }

  participantName(application: StudentApplicationDTO, participantKey: string): string {
    if (participantKey === 'primary') return application.studentName;
    return application.members.find((member) => member.key === participantKey)?.name ?? '同行成员';
  }

  documentBadge(document: StudentApplicationDocumentDTO): string {
    if (document.documentType === '入学通知书') return '录';
    if (['学生报价单', '报价单'].includes(document.documentType)) return '价';
    if (['学校账单/学生发票', '账单', '付款凭证'].includes(document.documentType)) return '款';
    if (document.documentType.includes('签证')) return '签';
    if (document.documentType === '机票行程单') return '行';
    if (document.documentType === '护照首页') return '护';
    return '文';
  }

  fileSize(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  changePassword(): void {
    if (this.passwordForm.invalid || this.changingPassword) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changingPassword = true;
    const value = this.passwordForm.getRawValue();
    this.authService.changePassword(value.currentPassword!, value.newPassword!).subscribe({
      next: () => {
        this.changingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open('密码已修改', '关闭', { duration: 3000 });
      },
      error: () => {
        this.changingPassword = false;
        this.snackBar.open('密码修改失败，请检查原密码和新密码强度', '关闭', { duration: 4000 });
      },
    });
  }
}
