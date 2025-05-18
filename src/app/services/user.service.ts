import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, authState, User, UserCredential, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.currentUser = authState(this.auth);
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }

  updateLogInStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }

  signUp(email: string, password: string, username: string): Promise<void> {
    return createUserWithEmailAndPassword(this.auth, email, password).then(async (cred) => {
      const userDocRef = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userDocRef, {
        uid: cred.user.uid,
        email: email,
        username: username,
        role: 'user',
        banned: false,
        createdAt: new Date()
      });
    });
  }

  // ⬇️ ÚJ: bejelentkezett felhasználó profiljának lekérése Firestore-ból
  getUserProfile(): Observable<any> {
    return this.currentUser.pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`);
          return docData(userDocRef);
        } else {
          return of(null);
        }
      })
    );
  }
}
