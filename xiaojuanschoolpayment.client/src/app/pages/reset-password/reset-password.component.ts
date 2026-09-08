import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatIconModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['../login/login.component.css', './reset-password.component.css'],
})
export class ResetPasswordComponent {
  hidePassword = true;
  hideConfirmation = true;
  loading = false;
  completed = false;
  readonly email: string;
  private readonly token: string;

  readonly resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email')?.trim() ?? '';
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d).+$/)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordsMatch });
  }

  get invalidLink(): boolean {
    return !this.email || !this.token || Validators.email({ value: this.email } as AbstractControl) !== null;
  }

  onSubmit(): void {
    if (this.invalidLink || this.resetForm.invalid || this.loading) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const value = this.resetForm.getRawValue();
    this.loading = true;
    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: value.newPassword ?? '',
    }).subscribe({
      next: () => {
        this.loading = false;
        this.completed = true;
      },
      error: (error) => {
        this.loading = false;
        const body = error?.error;
        const message = typeof body === 'string'
          ? body
          : Array.isArray(body)
            ? body.join('；')
            : body?.message || '密码重置失败，请重新申请重置邮件';
        this.snackBar.open(message, '关闭', { duration: 5000 });
      },
    });
  }

  private passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirmation = group.get('confirmPassword')?.value;
    return password && confirmation && password !== confirmation ? { passwordMismatch: true } : null;
  }
}
