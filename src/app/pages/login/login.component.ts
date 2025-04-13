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
import { UserService } from '../../models/user.service';

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
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const users = this.userService.getAllUsersFromFile(); // már nem Promise!
      console.log('Beolvasott felhasználók:', users);
  
      const user = users.find(u =>
        u.email === this.loginForm.value.email &&
        u.password === this.loginForm.value.password
      );
  
      if (user) {
        
        this.userService.login(user);
        this.snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
  
        this.router.navigate(['/profile']).then(() => {
          window.location.reload();
        });
      } else {
        this.snackBar.open('Hibás email vagy jelszó!', 'Bezár', {
          duration: 2000,
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.snackBar.open('Kérjük töltsd ki az összes mezőt helyesen!', 'Bezár', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    }
  }
  
}
