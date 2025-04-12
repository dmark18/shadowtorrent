import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Torrent } from '../../models/torrent.model';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../models/user.service';
import { Category } from '../../models/category.model';

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
export class UploadComponent implements OnInit {

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
  torrentImageUrl: string = ''; // Kép URL

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {}

  isBanned = false;
  currentUser: any;

  ngOnInit() {
    this.currentUser = this.userService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isBanned = this.currentUser.banned ?? false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadTorrent() {
    if (!this.selectedFile) {
      this.snackBar.open('Kérlek válassz egy fájlt!', 'Bezár', { duration: 2000 });
      return;
    }

    if(!this.torrentImageUrl){
      this.torrentImageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
    }

    const currentUser = this.userService.currentUserValue;
    if (!currentUser) {
      this.snackBar.open('Be kell jelentkezned!', 'Bezár', { duration: 2000 });
      this.router.navigate(['/login']);
      return;
    }

    // Initialize torrents array if missing
    if (!currentUser.torrents) {
      currentUser.torrents = [];
    }

    const newTorrent: Torrent = {
      id: Date.now(),
      name: this.torrentName,
      category: this.selectedCategory,
      size: (Math.random() * 5).toFixed(2) + ' GB',
      status: 'pending',
      uploader: currentUser.username,
      uploadDate: new Date().toLocaleDateString(),
      seeders: Math.floor(Math.random() * 100),
      leechers: Math.floor(Math.random() * 50),
      imageUrl: this.torrentImageUrl,  // Kép URL hozzáadása
      file: this.selectedFile
    };

    // Add torrent to user's list
    currentUser.torrents.push(newTorrent);

    // Update user through UserService to notify all components
    this.userService.login(currentUser);

    // Save new torrent in localStorage under 'uploadedTorrents'
    let torrents = JSON.parse(localStorage.getItem('torrents') || '[]');
    torrents.push(newTorrent);
    localStorage.setItem('torrents', JSON.stringify(torrents));

    this.snackBar.open('Torrent sikeresen feltöltve!', 'Bezár', { 
      duration: 2000,
      panelClass: ['success-snackbar']
    });
  }
}
