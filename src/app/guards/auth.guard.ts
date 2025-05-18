// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
  return this.authService.getUserProfile().pipe(
    take(1),
    map(profile => {
      if (profile && profile.role === 'admin') {
        return true;
      }
      return this.router.createUrlTree(['/home']);
    })
  );
}
}
