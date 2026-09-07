import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MatIconModule,
        MatSnackBarModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('accepts a long access code for email registration', () => {
    component.setAccountType('email');
    component.registerForm.setValue({
      name: '测试学生',
      invitationCode: 'XiaoJuanLove',
      account: 'student@example.com',
      password: 'Password1',
    });
    expect(component.registerForm.valid).toBeTrue();
  });

  it('sends email and access-code compatibility fields for email registration', () => {
    component.setAccountType('email');
    component.registerForm.setValue({
      name: '测试学生',
      invitationCode: 'ADMIN-CODE',
      account: 'student@example.com',
      password: 'Password1',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/register');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      account: 'student@example.com',
      email: 'student@example.com',
      password: 'Password1',
      name: '测试学生',
      invitationCode: 'ADMIN-CODE',
      accessCode: 'ADMIN-CODE',
    });
    request.flush(null);
  });

  it('sends an empty email compatibility field for phone registration', () => {
    component.registerForm.setValue({
      name: '测试学生',
      invitationCode: 'YG-STU-TEST',
      account: '13800138000',
      password: 'Password1',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/register');
    expect(request.request.body.email).toBe('');
    expect(request.request.body.accessCode).toBe('YG-STU-TEST');
    request.flush(null);
  });
});
