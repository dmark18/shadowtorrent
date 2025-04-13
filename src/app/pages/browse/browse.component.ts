// src/app/pages/browse/browse.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { Category } from '../../models/category.model';
import { TorrentService } from '../../models/torrent.service';  // TorrentService importálása
import { Torrent } from '../../models/torrent.model';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {
  torrents: Torrent[] = [];
  filteredTorrents: Torrent[] = [];
  searchForm: FormGroup;
  categories: Category[] = [
      { id: 1, name: 'Minden' },
      { id: 2, name: 'Film' },
      { id: 3, name: 'Sorozat' },
      { id: 4, name: 'Zene' },
      { id: 5, name: 'Szoftver' },
      { id: 6, name: 'Játék' },
      { id: 7, name: 'Egyéb' },
    ];
  currentUser: any;
  isBanned: boolean = false;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private torrentService: TorrentService) {
    this.searchForm = this.fb.group({
      search: [''],
      category: ['Minden']
    });
  }

  ngOnInit(): void {
    this.loadTorrents();
    this.applyFilter();
  }

  loadTorrents(): void {
    this.torrents = this.torrentService.getTorrents();
    this.torrents = this.torrents.filter(torrent => torrent.status === 'approved');
    this.torrents.forEach(torrent => {
      if (!torrent.imageUrl) {
        torrent.imageUrl = 'https://cdn-icons-png.flaticon.com/512/28/28969.png';  // Alapértelmezett kép
      }
    });
    this.filteredTorrents = [...this.torrents];
  }

  applyFilter(): void {
    const searchText = this.searchForm.value.search.toLowerCase();
    const selectedCategory = this.searchForm.value.category;

    this.filteredTorrents = this.torrents.filter(torrent => {
      const matchesSearch = torrent.name.toLowerCase().includes(searchText);
      const matchesCategory = selectedCategory === 'Minden' || torrent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  downloadFile(torrent: Torrent): void {
    this.snackBar.open(`A(z) "${torrent.name}" letöltése elindult!`, 'OK', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  checkUserStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.isBanned = this.currentUser?.banned || false;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
