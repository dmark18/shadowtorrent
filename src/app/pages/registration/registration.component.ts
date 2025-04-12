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

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule, // <<< ERRE SZÜKSÉG VAN!
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === this.registerForm.value.email)) {
        this.snackBar.open('Ez az e-mail már regisztrálva van!', 'Bezár', { duration: 2000 });
        return;
      }
      const newUser: User = {
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        banned: false,
        role: 'user',
        rejectedTorrents: [], // Alapértelmezett szerepkör
        torrents: []
        
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      this.snackBar.open('Sikeres regisztráció!', 'Bezár', { duration: 2000 });
      this.router.navigate(['/login']);
    }
  }
}
