import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { SchoolUserDTO } from '../../../interfaces/SchoolUser.dto';

@Component({
  selector: 'register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
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
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [this.optionalPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d).+$/)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.loading) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();
    const registrationCode = value.invitationCode.trim();
    const user: SchoolUserDTO = {
      email: value.email.trim(),
      phoneNumber: value.phoneNumber.trim() || undefined,
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

  private optionalPhoneValidator(control: { value: unknown }): { phone: true } | null {
    let value = String(control.value ?? '').replace(/[\s()-]/g, '');
    if (!value) return null;
    if (value.startsWith('00')) value = `+${value.slice(2)}`;
    if (/^(?:\+?86)?1[3-9]\d{9}$/.test(value)) return null;
    return /^\+[1-9]\d{7,14}$/.test(value) ? null : { phone: true };
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
