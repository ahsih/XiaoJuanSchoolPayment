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
  StudentApplicationDTO,
  StudentApplicationDocumentDTO,
} from '../../../interfaces/student-application.dto';
import { AuthService } from '../../../services/auth.service';
import { StudentApplicationService } from '../../../services/student-application.service';

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
  readonly statuses = STUDENT_APPLICATION_STATUSES.filter((status) => status !== '已取消');
  applications: StudentApplicationDTO[] = [];
  loading = true;
  changingPassword = false;

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

  logout(): void {
    this.authService.logout();
  }

  download(application: StudentApplicationDTO, document: StudentApplicationDocumentDTO): void {
    this.applicationService.downloadDocument(application.id, document);
  }

  statusIndex(application: StudentApplicationDTO): number {
    return Math.max(0, this.statuses.indexOf(application.status as typeof this.statuses[number]));
  }

  progress(application: StudentApplicationDTO): number {
    if (application.status === '已取消') return 0;
    return Math.round(((this.statusIndex(application) + 1) / this.statuses.length) * 100);
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
