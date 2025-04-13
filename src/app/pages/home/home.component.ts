import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../models/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TorrentService } from '../../models/torrent.service'; 
import { Torrent } from '../../models/torrent.model'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentUser: User | null = null;
  topTorrents: Torrent[] = [];
  recentTorrents: Torrent[] = [];
  allTorrents: Torrent[] = [];
  bestRatioTorrents: Torrent[] = [];
  mostCommonCategory: string = '';

  searchControl = new FormControl('');
  filteredTorrents: Torrent[] = [];

  @ViewChild('topCarousel') topCarousel!: ElementRef;
  @ViewChild('recentCarousel') recentCarousel!: ElementRef;
  @ViewChild('bestRatioCarousel') bestRatioCarousel!: ElementRef;

  private topScrollInterval: any;
  private recentScrollInterval: any;
  private bestRatioScrollInterval: any;

  constructor(
    private userService: UserService,
    private torrentService: TorrentService,  // TorrentService injektálása
    private router: Router
  ) {}

  searchTerm: string = '';

  onSearchChange(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTorrents = term
      ? this.allTorrents.filter(t => t.name.toLowerCase().includes(term))
      : [];
  }

  onSelect(torrent: Torrent): void {
    this.router.navigate(['/torrent', torrent.id]);
  }

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;

    // Torrentek lekérése a TorrentService-ből (szinkron módon)
    this.allTorrents = this.torrentService.getTorrents();

    // Képurlapok beállítása, ha nincs beállítva
    this.allTorrents.forEach(torrent => {
      if (!torrent.imageUrl) {
        torrent.imageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
      }
    });

    // Top torrentek (seederek szerint rendezve)
    this.topTorrents = [...this.allTorrents].sort((a, b) => b.seeders - a.seeders).slice(0, 5);

    // Legújabb torrentek
    this.recentTorrents = [...this.allTorrents].sort((a, b) => b.id - a.id).slice(0, 5);

    // Leggyakoribb kategória meghatározása
    const categoryCount: { [key: string]: number } = {};
    this.allTorrents.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });
    this.mostCommonCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // Legjobb seed/leech arányú torrentek
    this.bestRatioTorrents = this.allTorrents
      .filter(t => t.category === this.mostCommonCategory && t.leechers > 0)
      .map(t => ({
        ...t,
        ratio: t.seeders / t.leechers
      }))
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 5)
      .map(({ ratio, ...rest }) => rest);

    // Keresés szűrés
    this.filteredTorrents = this.allTorrents;
  }

  ngAfterViewInit(): void {
    this.startAutoScroll(this.topCarousel, 'topScrollInterval');
    this.startAutoScroll(this.recentCarousel, 'recentScrollInterval');
    this.startAutoScroll(this.bestRatioCarousel, 'bestRatioScrollInterval');
  }

  ngOnDestroy(): void {
    clearInterval(this.topScrollInterval);
    clearInterval(this.recentScrollInterval);
    clearInterval(this.bestRatioScrollInterval);
  }

  navigateToTorrentDetail(torrent: Torrent) {
    this.router.navigate(['/torrent', torrent.id]);
  }

  private startAutoScroll(ref: ElementRef, intervalKey: 'topScrollInterval' | 'recentScrollInterval' | 'bestRatioScrollInterval') {
    const el = ref?.nativeElement;
    const scrollAmount = 250;

    if (el) {
      this[intervalKey] = setInterval(() => {
        if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 3000);
    }
  }
}
