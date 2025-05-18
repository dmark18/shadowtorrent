import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Torrent } from '../models/torrent.model';
import { CollectionReference, DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private torrentsRef: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore) {
    this.torrentsRef = collection(this.firestore, 'torrents');
  }

  getTorrents(): Observable<Torrent[]> {
    return collectionData(this.torrentsRef, { idField: 'id' }) as Observable<Torrent[]>;
  }

  getTorrentById(id: string): Observable<Torrent> {
    const torrentDoc = doc(this.firestore, `torrents/${id}`);
    return docData(torrentDoc, { idField: 'id' }) as Observable<Torrent>;
  }

  addTorrent(torrent: Torrent): Promise<void> {
    return addDoc(this.torrentsRef, {
      ...torrent,
      uploadDate: new Date(),
      status: 'pending'
    }).then(() => {});
  }

  updateTorrent(id: string, data: Partial<Torrent>): Promise<void> {
    const torrentDoc = doc(this.firestore, `torrents/${id}`);
    return updateDoc(torrentDoc, data);
  }

  deleteTorrent(id: string): Promise<void> {
    const torrentDoc = doc(this.firestore, `torrents/${id}`);
    return deleteDoc(torrentDoc);
  }


  updateTorrentStatus(id: string, status: string, rejectReason: string = ''): Promise<void> {
    const torrentRef = doc(this.firestore, `torrents/${id}`);
    return updateDoc(torrentRef, { status, rejectReason });
  }


}

