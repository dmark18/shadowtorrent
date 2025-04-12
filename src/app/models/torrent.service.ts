import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {

  private apiUrl = 'http://localhost:3000/api/torrents';

  constructor(private http: HttpClient) {}

  // Torrent feltöltése
  uploadTorrent(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  // Felhasználó torrentjeinek lekérése
  getUserTorrents(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
