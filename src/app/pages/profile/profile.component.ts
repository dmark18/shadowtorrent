import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';
import { CommonModule } from '@angular/common';
import { Torrent } from '../../models/torrent.model'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isBanned: boolean = false;
  rejectedTorrents: any[] = [];  // Deklaráljuk a rejectedTorrents változót
  uploadedTorrents: any[] = [];  // Feltöltött torrentek (pending, approved)
  dataLoaded = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    
    this.currentUser = this.userService.currentUserValue;
  
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  
    // Frissítsük a tiltás állapotát
    this.isBanned = this.currentUser.banned ?? false;
  
    // Feltöltött torrentek (pending és approved)
    let allTorrents = JSON.parse(localStorage.getItem('torrents') || '[]');
    this.uploadedTorrents = allTorrents.filter((torrent: Torrent) =>
      torrent.uploader === this.currentUser?.username &&
      (torrent.status === 'pending' || torrent.status === 'approved')
    );
  
    // Elutasított torrentek
    this.rejectedTorrents = allTorrents.filter((torrent: Torrent) =>
      torrent.uploader === this.currentUser?.username && torrent.status === 'rejected'
    );

    this.dataLoaded = true;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  addTorrent(newTorrent: any) {
    if (this.currentUser) {
      if (!this.currentUser.torrents) {
        this.currentUser.torrents = [];
      }
      this.currentUser.torrents.push(newTorrent);
      this.userService.login(this.currentUser);
    }
  }

  deleteRejectedTorrent(torrentId: number) {
  if (!this.currentUser) return;

  let torrents = JSON.parse(localStorage.getItem('torrents') || '[]');

  const beforeCount = torrents.length;

  torrents = torrents.filter((t: Torrent) => 
    !(t.id === torrentId && t.status === 'rejected' && t.uploader === this.currentUser?.username)
  );

  const afterCount = torrents.length;

  localStorage.setItem('torrents', JSON.stringify(torrents));

  // Frissítjük a nézetet
  this.ngOnInit();

  // SnackBar: csak akkor jelezzen, ha valóban történt törlés
  if (afterCount < beforeCount) {
    this.snackBar.open('A torrent sikeresen törölve lett.', 'Bezár', {
      duration: 3000,
    });
  } else {
    this.snackBar.open('Nem sikerült törölni a torrentet.', 'Bezár', {
      duration: 3000,
    });
  }
}


}
