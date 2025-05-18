// src/app/pages/torrent-detail/torrent-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from '../../comment-section/comment-section.component';
import { FormatBytesPipe } from '../../pipes/format-bytes.pipe';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/user.service';
import { TorrentService } from '../../services/torrent.service'; // TorrentService importálása
import { Torrent } from '../../models/torrent.model';  // Torrent model importálása

@Component({
  selector: 'app-torrent-detail',
  standalone: true,
  imports: [CommonModule, CommentSectionComponent, FormatBytesPipe],
  templateUrl: './torrent-detail.component.html',
  styleUrls: ['./torrent-detail.component.scss']
})
export class TorrentDetailComponent implements OnInit {
  user: User | null = null;
  currentUser: User | null = null;
  isBanned: boolean = false;
  torrentId!: number;
  torrent?: Torrent;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private torrentService: TorrentService // TorrentService injektálása
  ) {}

  ngOnInit(): void {
  this.authService.isLoggedIn().subscribe(user => {
    if (user) {
      this.user = {
        id: 1, // vagy valós adat ha van külön tárolva
        username: user.displayName || '',
        email: user.email || '',
        password: '', // firebase nem adja vissza
        banned: false,
        role: 'user',
        rejectedTorrents: [],
        torrents: []
      };

      if (this.user.banned) {
        this.isBanned = true;
        // akár átirányítás vagy figyelmeztetés itt
      }

      const idParam = this.route.snapshot.paramMap.get('id');
      this.torrentId = idParam ? Number(idParam) : NaN;

      if (isNaN(this.torrentId)) {
        console.error('Érvénytelen torrent ID');
        return;
      }

      // Itt iratkozz fel az Observable-re:
      this.torrentService.getTorrents().subscribe(torrents => {
        const found = torrents.find(t => t.id.toString() === this.torrentId.toString());
        if (!found) {
          console.error('A torrent nem található!');
          return;
        }
        this.torrent = found;

        if (!this.torrent.imageUrl) {
          this.torrent.imageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  });
}
}
