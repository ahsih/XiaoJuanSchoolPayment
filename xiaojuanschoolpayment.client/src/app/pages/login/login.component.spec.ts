import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatSnackBarModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accepts either email or phone with a password', () => {
    component.loginForm.setValue({ account: 'student@example.com', password: 'Password1' });
    expect(component.loginForm.valid).toBeTrue();

    component.loginForm.setValue({ account: '13800138000', password: 'Password1' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('posts a password login request to auth/login', () => {
    component.loginForm.setValue({
      account: 'admin@example.com',
      password: 'Password1',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      account: 'admin@example.com',
      password: 'Password1',
    });
    request.flush({
      token: 'password-token',
      expiryDate: new Date(Date.now() + 60_000).toISOString(),
      roles: ['Admin'],
      name: '管理员',
      account: 'admin@example.com',
      email: 'admin@example.com',
    });
  });

  it('requests password recovery by phone and sends it to the registered email', () => {
    component.openPasswordRecovery();
    component.forgotPasswordForm.setValue({ account: '13800138000' });
    component.requestPasswordReset();

    const request = httpMock.expectOne('auth/forgot-password');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ account: '13800138000' });
    request.flush({});
    expect(component.resetRequested).toBeTrue();
  });
});
