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

  it('supports phone or email and code or password login', () => {
    component.setAccountType('email');
    component.setLoginMethod('Password');
    component.loginForm.patchValue({ account: 'student@example.com', password: 'Password1' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('posts a password login request to auth/login', () => {
    component.setAccountType('email');
    component.setLoginMethod('Password');
    component.loginForm.patchValue({
      account: 'admin@example.com',
      password: 'Password1',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.account).toBe('admin@example.com');
    expect(request.request.body.method).toBe('Password');
    expect(request.request.body.password).toBe('Password1');
    expect(request.request.body.verificationCode).toBeUndefined();
    request.flush({
      token: 'password-token',
      expiryDate: new Date(Date.now() + 60_000).toISOString(),
      roles: ['Admin'],
      name: '管理员',
      account: 'admin@example.com',
      email: 'admin@example.com',
    });
  });

  it('posts a verification-code login request to auth/login', () => {
    component.loginForm.patchValue({
      account: '13800138000',
      verificationCode: '123456',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.account).toBe('13800138000');
    expect(request.request.body.method).toBe('Code');
    expect(request.request.body.password).toBeUndefined();
    expect(request.request.body.verificationCode).toBe('123456');
    request.flush({
      token: 'code-token',
      expiryDate: new Date(Date.now() + 60_000).toISOString(),
      roles: ['Student'],
      name: '测试学生',
      account: '+8613800138000',
      phoneNumber: '+8613800138000',
    });
  });
});
