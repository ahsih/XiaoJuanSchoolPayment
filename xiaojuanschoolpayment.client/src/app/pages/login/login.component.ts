import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hidePassword = true;
  loading = false;
  recoveryMode = false;
  resetRequested = false;

  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      account: ['', [Validators.required, this.accountValidator]],
      password: ['', [Validators.required]],
    });
    this.forgotPasswordForm = this.fb.group({
      account: ['', [Validators.required, this.accountValidator]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.getRawValue();
    this.loading = true;
    this.authService.login({
      account: value.account.trim(),
      password: value.password,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        const roles = response.roles.map((role) => role.toLowerCase());
        this.router.navigate([roles.some((role) => role === 'admin' || role === 'manager' || role === 'staff') ? '/admin' : '/student']);
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, '登录失败，请检查邮箱、手机号码或密码');
      },
    });
  }

  openPasswordRecovery(): void {
    this.recoveryMode = true;
    this.resetRequested = false;
    this.forgotPasswordForm.patchValue({
      account: this.loginForm.get('account')?.value ?? '',
    });
  }

  closePasswordRecovery(): void {
    this.recoveryMode = false;
    this.resetRequested = false;
  }

  requestPasswordReset(): void {
    if (this.forgotPasswordForm.invalid || this.loading) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    const account = this.forgotPasswordForm.getRawValue().account.trim();
    this.loading = true;
    this.authService.requestPasswordReset(account).subscribe({
      next: () => {
        this.loading = false;
        this.resetRequested = true;
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, '密码重置邮件暂时无法发送，请稍后重试');
      },
    });
  }

  private accountValidator(control: AbstractControl): ValidationErrors | null {
    const rawValue = String(control.value ?? '').trim();
    if (!rawValue) return null;

    if (rawValue.includes('@')) {
      return Validators.email(control) ? { account: true } : null;
    }

    let phone = rawValue.replace(/[\s()-]/g, '');
    if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
    if (/^1[3-9]\d{9}$/.test(phone)) return null;
    return /^\+[1-9]\d{7,14}$/.test(phone) ? null : { account: true };
  }

  private showError(error: any, fallback: string): void {
    const body = error?.error;
    const message = typeof body === 'string'
      ? body
      : Array.isArray(body)
        ? body.join('；')
        : body?.message || fallback;
    this.snackBar.open(message, '关闭', { duration: 5000 });
  }
}
