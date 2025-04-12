import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../models/user.service';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isSidenavOpen = false;
  currentUser: User | null = null;
  isAdmin = false;
  private userSub!: Subscription;

  constructor(
    public userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Initial state
    this.updateUserState(this.userService.currentUserValue);
    
    // Subscribe to changes
    this.userSub = this.userService.currentUser$.subscribe({
      next: (user) => {
        console.log('Received user update:', user); // Debug log
        this.updateUserState(user);
      },
      error: (err) => {
        console.error('User subscription error:', err);
      }
    });
  }

  private updateUserState(user: User | null): void {
    console.log('Updating UI with:', user); // Debug log
    this.currentUser = user;
    this.isAdmin = user?.role === 'admin';
    
    // Triple change detection
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  openNav(): void {
    this.isSidenavOpen = true;
  }

  closeNav(): void {
    this.isSidenavOpen = false;
  }

  logout(): void {
    console.log('Logout initiated'); // Debug log
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}