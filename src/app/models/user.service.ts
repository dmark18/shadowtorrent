import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import * as usersData from '../assets/users.json';  // JSON importálása

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  public currentUser$ = this.currentUserSubject.asObservable();

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem('currentUser');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  // A felhasználók listájának lekérése közvetlenül a JSON fájlból
  getAllUsersFromFile(): User[] {
    return (usersData as any).default ?? [];  // JSON adat visszaadása
  }

  login(user: User): void {
    console.log('Storing user:', user); 
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.forceUpdate(); 
  }

  logout(): void {
    console.log('Clearing user'); 
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.forceUpdate(); 
  }

  private forceUpdate(): void {
    setTimeout(() => {
      this.currentUserSubject.next(this.getUserFromStorage());
    }, 100);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  updateUserTorrents(userId: number, torrents: any[], rejectedTorrents: any[]) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
  
    let userIndex = users.findIndex((user: any) => user.id === userId);
    if (userIndex !== -1) {
      users[userIndex].torrents = torrents;
      users[userIndex].rejectedTorrents = rejectedTorrents;
      localStorage.setItem('users', JSON.stringify(users));
  
      if (this.currentUserValue?.id === userId) {
        this.currentUserSubject.next(users[userIndex]);
      }
    }
  }
}
