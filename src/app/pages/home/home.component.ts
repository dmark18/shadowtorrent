import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { TorrentService } from '../../services/torrent.service';
import { Torrent } from '../../models/torrent.model';
import { AuthService } from '../../services/user.service'; // AuthService-ként működik most

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
  currentUser: any = null;
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
    private authService: AuthService,
    private torrentService: TorrentService,
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
  // Betöltjük a felhasználói profilt
  this.authService.getUserProfile().subscribe(profile => {
    if (profile) {
      this.currentUser = profile;
      console.log('Felhasználói profil:', profile);
    }
  });

  // Betöltjük az összes torrentet
  this.torrentService.getTorrents().subscribe(torrents => {
    this.allTorrents = torrents;

    // Alapértelmezett kép beállítása, ha nincs
    this.allTorrents.forEach(torrent => {
      if (!torrent.imageUrl) {
        torrent.imageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
      }
    });

    // Top 5 legtöbb seeder alapján
    this.topTorrents = [...this.allTorrents]
      .sort((a, b) => b.seeders - a.seeders)
      .slice(0, 5);

    // Legfrissebb 5 torrent ID alapján
    this.recentTorrents = [...this.allTorrents]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);

    // Kategóriák számlálása
    const categoryCount: { [key: string]: number } = {};
    this.allTorrents.forEach(t => {
      if (t.category) {
        categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
      }
    });

    // Leggyakoribb kategória kiválasztása, ha van
    const categories = Object.keys(categoryCount);
    if (categories.length > 0) {
      this.mostCommonCategory = categories.reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );
    } else {
      this.mostCommonCategory = 'Nincs adat';
    }

    // Legjobb arányú (seeders/leechers) torrentek a leggyakoribb kategóriában
    this.bestRatioTorrents = this.allTorrents
      .filter(t =>
        t.category === this.mostCommonCategory &&
        t.leechers > 0
      )
      .map(t => ({
        ...t,
        ratio: t.seeders / t.leechers
      }))
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 5)
      .map(({ ratio, ...rest }) => rest); // Ratio eltávolítása, ha nem kell

    // Alapértelmezett lista szűréshez
    this.filteredTorrents = this.allTorrents;
  });
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

  private startAutoScroll(
    ref: ElementRef,
    intervalKey: 'topScrollInterval' | 'recentScrollInterval' | 'bestRatioScrollInterval'
  ) {
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