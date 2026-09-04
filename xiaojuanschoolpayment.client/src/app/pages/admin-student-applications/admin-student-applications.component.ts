import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SchoolDTO } from '../../../interfaces/school.dto';
import {
  CreateStudentApplicationDTO,
  STUDENT_APPLICATION_STATUSES,
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
  UpdateStudentApplicationDTO,
} from '../../../interfaces/student-application.dto';
import { SchoolService } from '../../../services/school.service';
import { StudentApplicationService } from '../../../services/student-application.service';

@Component({
  selector: 'app-admin-student-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-student-applications.component.html',
  styleUrl: './admin-student-applications.component.css',
})
export class AdminStudentApplicationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly statuses = STUDENT_APPLICATION_STATUSES;
  readonly documentTypes = ['报价单', '入学通知书', '账单', '付款凭证', '签证文件', '其他'];

  schools: SchoolDTO[] = [];
  applications: StudentApplicationDTO[] = [];
  editingId: string | null = null;
  selectedApplication: StudentApplicationDTO | null = null;
  selectedFile: File | null = null;
  loading = false;
  saving = false;
  search = '';

  readonly applicationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    temporaryPassword: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    schoolId: ['', Validators.required],
    courseName: [''],
    accommodationName: [''],
    startDate: [''],
    endDate: [''],
    status: ['资料准备', Validators.required],
    studentVisibleNotes: [''],
    internalNotes: [''],
  });

  readonly documentForm = this.fb.group({
    documentType: ['报价单', Validators.required],
    displayName: [''],
    isVisibleToStudent: [true],
  });

  constructor(
    private schoolService: SchoolService,
    private applicationService: StudentApplicationService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.schoolService.getSchools().subscribe({
      next: (schools) => (this.schools = [...(schools ?? [])].sort((a, b) => a.name.localeCompare(b.name))),
      error: () => this.notify('学校列表加载失败'),
    });
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getAll(this.search.trim()).subscribe({
      next: (applications) => {
        this.applications = applications ?? [];
        if (this.selectedApplication) {
          this.selectedApplication = this.applications.find((x) => x.id === this.selectedApplication?.id) ?? null;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify('学生报名加载失败');
      },
    });
  }

  submitApplication(): void {
    if (this.applicationForm.invalid || this.saving) {
      this.applicationForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const value = this.applicationForm.getRawValue();
    const common = {
      schoolId: value.schoolId!,
      courseName: value.courseName || undefined,
      accommodationName: value.accommodationName || undefined,
      startDate: value.startDate || undefined,
      endDate: value.endDate || undefined,
      status: value.status!,
      studentVisibleNotes: value.studentVisibleNotes || undefined,
      internalNotes: value.internalNotes || undefined,
    };

    const request = this.editingId
      ? this.applicationService.update(this.editingId, common as UpdateStudentApplicationDTO)
      : this.applicationService.create({
          ...common,
          email: value.email!,
          temporaryPassword: value.temporaryPassword || undefined,
          firstName: value.firstName!,
          lastName: value.lastName!,
        } as CreateStudentApplicationDTO);

    request.subscribe({
      next: () => {
        this.notify(this.editingId ? '报名信息已更新' : '学生账号和报名已创建');
        this.resetForm();
        this.loadApplications();
      },
      error: (error) => {
        this.saving = false;
        this.notify(this.errorMessage(error));
      },
    });
  }

  edit(application: StudentApplicationDTO): void {
    this.editingId = application.id;
    this.selectedApplication = application;
    this.applicationForm.patchValue({
      email: application.studentEmail,
      temporaryPassword: '',
      firstName: application.studentFirstName,
      lastName: application.studentLastName,
      schoolId: application.schoolId,
      courseName: application.courseName ?? '',
      accommodationName: application.accommodationName ?? '',
      startDate: this.dateInput(application.startDate),
      endDate: this.dateInput(application.endDate),
      status: application.status,
      studentVisibleNotes: application.studentVisibleNotes ?? '',
      internalNotes: application.internalNotes ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm(): void {
    this.editingId = null;
    this.saving = false;
    this.applicationForm.reset({ status: '资料准备' });
  }

  selectApplication(application: StudentApplicationDTO): void {
    this.selectedApplication = application;
    this.selectedFile = null;
    this.documentForm.reset({ documentType: '报价单', displayName: '', isVisibleToStudent: true });
  }

  onFileSelected(event: Event): void {
    this.selectedFile = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  uploadDocument(): void {
    if (!this.selectedApplication || !this.selectedFile || this.documentForm.invalid) {
      this.notify('请选择报名记录和文件');
      return;
    }

    const value = this.documentForm.getRawValue();
    this.applicationService
      .uploadDocument(
        this.selectedApplication.id,
        this.selectedFile,
        value.documentType!,
        value.displayName ?? '',
        value.isVisibleToStudent ?? true,
      )
      .subscribe({
        next: () => {
          this.notify('文件已上传');
          this.selectedFile = null;
          this.loadApplications();
        },
        error: (error) => this.notify(this.errorMessage(error)),
      });
  }

  download(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    this.applicationService.downloadDocument(application.id, document);
  }

  deleteDocument(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    if (!window.confirm(`删除“${document.displayName}”？`)) return;
    this.applicationService.deleteDocument(application.id, document.id).subscribe({
      next: () => {
        this.notify('文件已删除');
        this.loadApplications();
      },
      error: () => this.notify('文件删除失败'),
    });
  }

  fileSize(bytes: number): string {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  private dateInput(value?: string): string {
    return value ? value.slice(0, 10) : '';
  }

  private notify(message: string): void {
    this.snackBar.open(message, '关闭', { duration: 3500 });
  }

  private errorMessage(error: any): string {
    if (typeof error?.error === 'string') return error.error;
    if (Array.isArray(error?.error)) return error.error.join('；');
    return '操作失败，请检查填写内容';
  }
}
