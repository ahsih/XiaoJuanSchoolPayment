import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, HttpClientTestingModule, MatSnackBarModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({
              email: 'student@example.com',
              token: 'reset-token+/=',
            }),
          },
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('submits the emailed token with the new password', () => {
    component.resetForm.setValue({
      newPassword: 'NewPassword1',
      confirmPassword: 'NewPassword1',
    });

    component.onSubmit();

    const request = httpMock.expectOne('auth/reset-password');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      email: 'student@example.com',
      token: 'reset-token+/=',
      newPassword: 'NewPassword1',
    });
    request.flush(null);
    expect(component.completed).toBeTrue();
  });

  it('rejects mismatched passwords before sending a request', () => {
    component.resetForm.setValue({
      newPassword: 'NewPassword1',
      confirmPassword: 'Different1',
    });

    component.onSubmit();

    expect(component.resetForm.hasError('passwordMismatch')).toBeTrue();
    httpMock.expectNone('auth/reset-password');
  });
});
