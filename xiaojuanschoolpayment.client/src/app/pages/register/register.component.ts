import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { SchoolUserDTO } from '../../../interfaces/SchoolUser.dto';

@Component({
  selector: 'register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  hidePassword = true;
  loading = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      accessCode: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.registerForm.valid) {
      const user: SchoolUserDTO = this.registerForm.value;

      this.authService.register(user).subscribe({
        next: () => {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.registerForm.reset();
          this.loading = false;
        },
        error: (err) => {
          const msg = typeof err.error === 'string' ? err.error : 'Registration failed';
          this.snackBar.open(msg, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }
}
