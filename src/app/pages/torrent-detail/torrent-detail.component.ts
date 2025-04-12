import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommentSectionComponent } from '../../comment-section/comment-section.component';
import { FormatBytesPipe } from '../../pipes/format-bytes.pipe';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';

interface Torrent {
  id: number;
  name: string;
  size: string;
  category: string;
  uploader: string;
  seeders: number;
  leechers: number;
  status: string;
  imageUrl: string;
}

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
    private route: ActivatedRoute
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

    const torrents: Torrent[] = JSON.parse(localStorage.getItem('torrents') || '[]');
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
