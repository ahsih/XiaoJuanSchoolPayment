import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

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
    fixture.detectChanges();
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
});
