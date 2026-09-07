import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { SchoolUserDTO } from '../../../interfaces/SchoolUser.dto';
import { AccountType } from '../../../interfaces/Auth.dto';

@Component({
  selector: 'register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  accountType: AccountType = 'phone';
  hidePassword = true;
  loading = false;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      invitationCode: ['', [Validators.required]],
      account: ['', [Validators.required, this.phoneValidator]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d).+$/)]],
    });
  }

  setAccountType(type: AccountType): void {
    if (this.accountType === type) return;
    this.accountType = type;
    const account = this.registerForm.get('account');
    account?.setValue('');
    account?.setValidators(
      type === 'phone'
        ? [Validators.required, this.phoneValidator]
        : [Validators.required, Validators.email],
    );
    account?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();
    const account = value.account.trim();
    const registrationCode = value.invitationCode.trim();
    const user: SchoolUserDTO = {
      account,
      email: this.accountType === 'email' ? account : '',
      password: value.password,
      name: value.name.trim(),
      invitationCode: registrationCode,
      accessCode: registrationCode,
    };

    this.loading = true;
    this.authService.register(user).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('注册成功，现在可以登录了', '关闭', { duration: 3500 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.showError(error, '注册失败，请检查验证码和注册信息');
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

  private showError(error: any, fallback: string): void {
    const message = typeof error?.error === 'string'
      ? error.error
      : error?.error?.message || fallback;
    this.snackBar.open(message, '关闭', { duration: 5000 });
  }
}
