import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { Torrent } from '../../models/torrent.model';
import { UserService } from '../../models/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TorrentService } from '../../models/torrent.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserService]
})
export class AdminComponent implements OnInit {
  currentUser: any;
  torrents: Torrent[] = [];  
  approvedTorrents: Torrent[] = []; 
  rejectedTorrents: Torrent[] = [];  
  rejectReason: string = '';
  users: User[] = [];

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar, private torrentService: TorrentService) {}

  ngOnInit() {
    this.loadTorrents();
    this.loadUsers();
    this.currentUser = this.userService.currentUserValue;
  }

  // Torrentek betöltése localStorage-ból
  loadTorrents() {
    const allTorrents = this.torrentService.getTorrents();
    this.torrents = allTorrents.filter(t => t.status === 'pending');
    this.approvedTorrents = allTorrents.filter(t => t.status === 'approved');
    this.rejectedTorrents = allTorrents.filter(t => t.status === 'rejected');
  }

  // Felhasználók betöltése localStorage-ból (nem módosítva)
  loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    this.users = users;
  }

  // Torrent jóváhagyása
  approveTorrent(torrentId: number) {
    let torrents = JSON.parse(localStorage.getItem('torrents') || '[]');
    const index = torrents.findIndex((t: Torrent) => t.id === torrentId);
    if (index !== -1) {
      torrents[index].status = 'approved';
      localStorage.setItem('torrents', JSON.stringify(torrents));
      this.loadTorrents();
      this.snackBar.open('Torrent jóváhagyva!', 'Bezár', { duration: 2000 });
    }
  }

  // Torrent elutasítása
  rejectTorrent(torrentId: number) {
    let torrents = JSON.parse(localStorage.getItem('torrents') || '[]');
    const index = torrents.findIndex((t: Torrent) => t.id === torrentId);
    if (index !== -1) {
      torrents[index].status = 'rejected';
      torrents[index].rejectReason = this.rejectReason;
      localStorage.setItem('torrents', JSON.stringify(torrents));
      this.loadTorrents();
      this.snackBar.open('Torrent elutasítva!', 'Bezár', { duration: 2000 });
    }
  }

  // Torrent törlése
  deleteTorrent(torrentId: number) {
    let torrents = JSON.parse(localStorage.getItem('torrents') || '[]');
    torrents = torrents.filter((t: Torrent) => t.id !== torrentId);
    localStorage.setItem('torrents', JSON.stringify(torrents));
    this.loadTorrents();
    this.snackBar.open('Torrent törölve!', 'Bezár', { duration: 2000 });
  }

  // Felhasználó tiltásának kezelése
  toggleBanUser(index: number) {
    this.users[index].banned = !this.users[index].banned;
    localStorage.setItem('users', JSON.stringify(this.users));

    const currentUser = this.userService.currentUserValue;
    if (currentUser && currentUser.id === this.users[index].id) {
      this.userService.login(this.users[index]); 
    }
  }
}
