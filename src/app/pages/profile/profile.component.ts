import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';
import { CommonModule } from '@angular/common';
import { Torrent } from '../../models/torrent.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TorrentService } from '../../models/torrent.service'; // Added TorrentService import

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isBanned: boolean = false;
  rejectedTorrents: Torrent[] = [];
  uploadedTorrents: Torrent[] = [];
  dataLoaded = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private torrentService: TorrentService  // Added TorrentService to load torrents
  ) {}

  ngOnInit() {
  this.currentUser = this.userService.currentUserValue;

  if (!this.currentUser) {
    this.router.navigate(['/login']);
    return;
  }

  this.isBanned = this.currentUser.banned ?? false;

  // Load torrents directly from the TorrentService as an array
  const torrents: Torrent[] = this.torrentService.getTorrents();

  // Filter the uploaded torrents (those by the current user) and their status
  this.uploadedTorrents = torrents.filter((torrent: Torrent) =>
    torrent.uploader === this.currentUser?.username &&
    (torrent.status === 'pending' || torrent.status === 'approved')
  );

  // Filter the rejected torrents (those by the current user with rejected status)
  this.rejectedTorrents = torrents.filter((torrent: Torrent) =>
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

  addTorrent(newTorrent: Torrent) {
    if (this.currentUser) {
      if (!this.currentUser.torrents) {
        this.currentUser.torrents = [];
      }
      this.currentUser.torrents.push(newTorrent);
      this.userService.login(this.currentUser);
    }
  }
}
