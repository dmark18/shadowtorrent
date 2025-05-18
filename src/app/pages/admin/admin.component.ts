import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Torrent } from '../../models/torrent.model';
import { AuthService } from '../../services/user.service';
import { TorrentService } from '../../services/torrent.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminComponent implements OnInit {
  currentUser: any = null;
  torrentsPending$!: Observable<Torrent[]>;
  torrentsApproved$!: Observable<Torrent[]>;
  torrentsRejected$!: Observable<Torrent[]>;
  rejectReason: string = '';
  users: any[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private torrentService: TorrentService
  ) {}

ngOnInit() {
  // Felhasználói adatokat itt így kérjük le, hasonlóan a navbarhoz:
  this.authService.getUserProfile().subscribe(profile => {
    this.currentUser = profile;
  });

  this.loadTorrents();
  this.loadUsers();
}

  loadTorrents() {
    const allTorrents$ = this.torrentService.getTorrents();

    this.torrentsPending$ = allTorrents$.pipe(
      map(torrents => torrents.filter(t => t.status === 'pending'))
    );

    this.torrentsApproved$ = allTorrents$.pipe(
      map(torrents => torrents.filter(t => t.status === 'approved'))
    );

    this.torrentsRejected$ = allTorrents$.pipe(
      map(torrents => torrents.filter(t => t.status === 'rejected'))
    );
  }

  approveTorrent(torrentId: string) {
    this.torrentService.updateTorrentStatus(torrentId, 'approved').then(() => {
      this.snackBar.open('Torrent jóváhagyva!', 'Bezár', { duration: 2000 });
      this.loadTorrents();
    });
  }

  rejectTorrent(torrentId: string) {
    this.torrentService.updateTorrentStatus(torrentId, 'rejected', this.rejectReason).then(() => {
      this.snackBar.open('Torrent elutasítva!', 'Bezár', { duration: 2000 });
      this.loadTorrents();
    });
  }

  deleteTorrent(torrentId: string) {
    this.torrentService.deleteTorrent(torrentId).then(() => {
      this.snackBar.open('Torrent törölve!', 'Bezár', { duration: 2000 });
      this.loadTorrents();
    });
  }

  loadUsers() {
    // TODO: később lecserélni Firestore-ra
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = users;
  }

  toggleBanUser(index: number) {
    this.users[index].banned = !this.users[index].banned;
    localStorage.setItem('users', JSON.stringify(this.users));

    const currentUserId = this.currentUser?.uid;
    if (currentUserId && this.users[index].id === currentUserId) {
      this.snackBar.open('A saját fiók státusza megváltozott.', 'Ok', { duration: 2000 });
    }
  }
}
