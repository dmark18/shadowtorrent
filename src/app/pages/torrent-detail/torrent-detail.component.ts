// src/app/pages/torrent-detail/torrent-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from '../../comment-section/comment-section.component';
import { FormatBytesPipe } from '../../pipes/format-bytes.pipe';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';
import { TorrentService } from '../../models/torrent.service'; // TorrentService importálása
import { Torrent } from '../../models/torrent.model';  // Torrent model importálása

@Component({
  selector: 'app-torrent-detail',
  standalone: true,
  imports: [CommonModule, CommentSectionComponent, FormatBytesPipe],
  templateUrl: './torrent-detail.component.html',
  styleUrls: ['./torrent-detail.component.scss']
})
export class TorrentDetailComponent implements OnInit {
  currentUser: User | null = null;
  isBanned: boolean = false;
  torrentId!: number;
  torrent?: Torrent;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private torrentService: TorrentService // TorrentService injektálása
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.isBanned = this.currentUser.banned ?? false;

    const idParam = this.route.snapshot.paramMap.get('id');
    this.torrentId = idParam ? Number(idParam) : NaN;

    if (isNaN(this.torrentId)) {
      console.error('Érvénytelen torrent ID');
      return;
    }

    // A torrentek betöltése a TorrentService-ből
    const torrents: Torrent[] = this.torrentService.getTorrents();
    const found = torrents.find(t => t.id === this.torrentId);

    if (!found) {
      console.error('A torrent nem található!');
      return;
    }
    this.torrent = found;

    if (!this.torrent.imageUrl) {
      this.torrent.imageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
    }
  }
}
