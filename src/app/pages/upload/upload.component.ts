import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Torrent } from '../../models/torrent.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/user.service';
import { Category } from '../../models/category.model';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Firestore, collection, doc, docData, collectionData, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class UploadComponent implements OnInit, OnDestroy {

  categories: Category[] = [
    { id: 1, name: 'Minden' },
    { id: 2, name: 'Film' },
    { id: 3, name: 'Sorozat' },
    { id: 4, name: 'Zene' },
    { id: 5, name: 'Szoftver' },
    { id: 6, name: 'Játék' },
    { id: 7, name: 'Egyéb' },
  ];

  torrentName: string = '';
  selectedCategory: string = 'Minden';
  selectedFile: File | null = null;
  torrentImageUrl: string = '';
  torrentFileUrl: string = '';

  currentUser: any = null;
  isBanned: boolean = false;

  private userSubscription?: Subscription;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

ngOnInit() {
  this.userSubscription = this.authService.currentUser.pipe(
    switchMap(user => {
      if (!user) {
        this.snackBar.open('Be kell jelentkezned a feltöltéshez!', 'Bezár', { duration: 3000 });
        this.router.navigate(['/login']);
        return of(null);
      }

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      return docData(userDocRef);
    })
  ).subscribe(userData => {
    if (!userData) return;

    this.currentUser = userData;
    this.isBanned = (userData as any).banned;
  });
}

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadTorrent() {
  if (!this.torrentFileUrl.trim()) {
    this.snackBar.open('Kérlek add meg a torrent fájl URL-jét!', 'Bezár', { duration: 2000 });
    return;
  }

  if (!this.torrentName.trim()) {
    this.snackBar.open('A torrent neve kötelező!', 'Bezár', { duration: 2000 });
    return;
  }

  if (!this.torrentImageUrl) {
    this.torrentImageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
  }

  if (!this.currentUser) {
    this.snackBar.open('Be kell jelentkezned!', 'Bezár', { duration: 2000 });
    this.router.navigate(['/login']);
    return;
  }

  const newTorrent: Torrent = {
    id: Date.now(),
    name: this.torrentName,
    category: this.selectedCategory,
    size: (Math.random() * 5).toFixed(2) + ' GB',
    status: 'pending',
    uploader: this.currentUser.username,
    uploadDate: new Date().toISOString(),
    seeders: Math.floor(Math.random() * 100),
    leechers: Math.floor(Math.random() * 50),
    imageUrl: this.torrentImageUrl,
    fileUrl: this.torrentFileUrl
  };

  const torrentsCollection = collection(this.firestore, 'torrents');

  addDoc(torrentsCollection, newTorrent)
    .then(() => {
      this.snackBar.open('Torrent sikeresen feltöltve!', 'Bezár', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/profile']);
    })
    .catch(error => {
      console.error('Hiba torrent mentésekor:', error);
      this.snackBar.open('Hiba történt a torrent feltöltésekor!', 'Bezár', { duration: 3000 });
    });
}
}
