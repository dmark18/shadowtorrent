import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/user.service';
import { TorrentService } from '../../services/torrent.service';
import { Torrent } from '../../models/torrent.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [CommonModule],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isBanned: boolean = false;
  rejectedTorrents: Torrent[] = [];
  uploadedTorrents: Torrent[] = [];
  dataLoaded = false;

  private userSubscription?: Subscription;
  private torrentSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private torrentService: TorrentService
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.getUserProfile().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }

      this.currentUser = user;
      this.isBanned = user.banned ?? false;

      this.torrentSubscription = this.torrentService.getTorrents().subscribe(torrents => {
        this.uploadedTorrents = torrents.filter(torrent =>
          torrent.uploader === this.currentUser.username &&
          (torrent.status === 'pending' || torrent.status === 'approved')
        );

        this.rejectedTorrents = torrents.filter(torrent =>
          torrent.uploader === this.currentUser.username &&
          torrent.status === 'rejected'
        );

        this.dataLoaded = true;
      });
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
    this.torrentSubscription?.unsubscribe();
  }

  logout() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

  addTorrent(newTorrent: Torrent) {
    if (this.currentUser) {
      if (!this.currentUser.torrents) {
        this.currentUser.torrents = [];
      }
      this.currentUser.torrents.push(newTorrent);
    }
  }

  deleteRejectedTorrent(torrentId: string) {
  this.torrentService.deleteTorrent(torrentId)
    .then(() => {
      this.snackBar.open('Elutasított torrent törölve!', 'Bezár', { duration: 2000 });

      // Újratöltjük a torrenteket a komponensben
      if (this.torrentSubscription) {
        this.torrentSubscription.unsubscribe();
      }

      this.torrentSubscription = this.torrentService.getTorrents().subscribe(torrents => {
        this.uploadedTorrents = torrents.filter(torrent =>
          torrent.uploader === this.currentUser.username &&
          (torrent.status === 'pending' || torrent.status === 'approved')
        );

        this.rejectedTorrents = torrents.filter(torrent =>
          torrent.uploader === this.currentUser.username &&
          torrent.status === 'rejected'
        );

        this.dataLoaded = true;
      });
    })
    .catch(err => {
      this.snackBar.open('Hiba történt a törlés során.', 'Bezár', { duration: 2000 });
      console.error('Torrent törlés hiba:', err);
    });
}

}
