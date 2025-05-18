import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/user.service';
import { Subscription } from 'rxjs';

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
  currentUser: any = null;
  isAdmin = false;
  private userSub!: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('Received user profile:', profile);
        this.updateUserState(profile);
      },
      error: (err) => {
        console.error('User profile subscription error:', err);
      }
    });
  }

  private updateUserState(profile: any): void {
    this.currentUser = profile;
    this.isAdmin = profile?.role === 'admin';

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  openNav(): void {
    this.isSidenavOpen = true;
  }

  closeNav(): void {
    this.isSidenavOpen = false;
  }

  logout(): void {
    this.authService.signOut();
  }
}
