import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { AccountType, LoginMethod } from '../../../interfaces/Auth.dto';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  accountType: AccountType = 'phone';
  loginMethod: LoginMethod = 'Code';
  hidePassword = true;
  loading = false;
  sendingCode = false;
  countdown = 0;
  private countdownTimer?: ReturnType<typeof setInterval>;

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.fb.group({
      account: ['', [Validators.required, this.phoneValidator]],
      password: [''],
      verificationCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  setAccountType(type: AccountType): void {
    if (this.accountType === type) return;
    this.accountType = type;
    this.loginForm.get('account')?.setValue('');
    this.loginForm.get('account')?.setValidators(
      type === 'phone'
        ? [Validators.required, this.phoneValidator]
        : [Validators.required, Validators.email],
    );
    this.loginForm.get('account')?.updateValueAndValidity();
  }

  setLoginMethod(method: LoginMethod): void {
    this.loginMethod = method;
    const password = this.loginForm.get('password');
    const verificationCode = this.loginForm.get('verificationCode');
    password?.setValidators(method === 'Password' ? [Validators.required] : []);
    verificationCode?.setValidators(
      method === 'Code' ? [Validators.required, Validators.pattern(/^\d{6}$/)] : [],
    );
    password?.updateValueAndValidity();
    verificationCode?.updateValueAndValidity();
  }

  sendCode(): void {
    const account = this.loginForm.get('account');
    if (!account || account.invalid || this.sendingCode || this.countdown > 0) {
      account?.markAsTouched();
      return;
    }

    this.sendingCode = true;
    this.authService.sendVerificationCode(account.value.trim(), 'Login').subscribe({
      next: (response) => {
        this.sendingCode = false;
        this.startCountdown(response.retryAfterSeconds || 60);
        const developmentHint = response.developmentCode
          ? `（开发环境验证码：${response.developmentCode}）`
          : '';
        this.snackBar.open(`验证码已发送至 ${response.maskedAccount}${developmentHint}`, '关闭', {
          duration: response.developmentCode ? 10000 : 4000,
        });
      },
      error: (error) => {
        this.sendingCode = false;
        this.showError(error, '验证码发送失败，请稍后重试');
      },
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
      method: this.loginMethod,
      password: this.loginMethod === 'Password' ? value.password : undefined,
      verificationCode: this.loginMethod === 'Code' ? value.verificationCode : undefined,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        const roles = response.roles.map((role) => role.toLowerCase());
        this.router.navigate([roles.some((role) => role === 'admin' || role === 'staff') ? '/admin' : '/student']);
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, '登录失败，请检查账号和登录信息');
      },
    });
  }

  get accountPlaceholder(): string {
    return this.accountType === 'phone' ? '请输入手机号码' : '请输入邮箱地址';
  }

  private phoneValidator(control: { value: unknown }): { phone: true } | null {
    const value = String(control.value ?? '').replace(/[\s-]/g, '');
    return /^(?:\+?86)?1[3-9]\d{9}$/.test(value) ? null : { phone: true };
  }

  private startCountdown(seconds: number): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdown = seconds;
    this.countdownTimer = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0 && this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = undefined;
      }
    }, 1000);
  }

  private showError(error: any, fallback: string): void {
    const message = typeof error?.error === 'string'
      ? error.error
      : error?.error?.message || fallback;
    this.snackBar.open(message, '关闭', { duration: 5000 });
  }
}
