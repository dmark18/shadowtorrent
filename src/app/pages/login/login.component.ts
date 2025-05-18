import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authServ: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
  if (this.loginForm.invalid) {
    this.snackBar.open('Kérjük töltsd ki az összes mezőt helyesen!', 'Bezár', {
      duration: 2000,
      panelClass: ['error-snackbar']
    });
    return;
  }

  const { email, password } = this.loginForm.value;

  this.authServ.signIn(email, password)
    .then(() => {
      this.authServ.updateLogInStatus(true);
      this.snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });

      this.router.navigate(['/profile']).then(() => {
        window.location.reload();
      });
    })
    .catch((error) => {
      console.error('Bejelentkezési hiba:', error);
      this.snackBar.open('Hibás email vagy jelszó!', 'Bezár', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    });
  }

  get email() {
  return this.loginForm.get('email');
}

get password() {
  return this.loginForm.get('password');
}
}
  

