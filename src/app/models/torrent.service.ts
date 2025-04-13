// src/app/models/torrent.service.ts
import { Injectable } from '@angular/core';
import { Torrent } from './torrent.model';
import * as torrentsData from '../assets/torrents.json';  // JSON importálása

@Injectable({
  providedIn: 'root'
})
export class TorrentService {

  constructor() {}

  getTorrents(): Torrent[] {
    return (torrentsData as any).default;  // JSON adatok visszaadása
  }
}
