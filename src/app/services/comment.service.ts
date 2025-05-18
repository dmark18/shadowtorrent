import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where } from '@angular/fire/firestore';
import { Comment } from '../models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private firestore: Firestore) {}

  // Kommentek lekérése adott torrenthez
  getCommentsForTorrent(torrentId: number): Observable<Comment[]> {
    const commentsRef = collection(this.firestore, 'comments');
    const q = query(commentsRef, where('torrentId', '==', torrentId));
    return collectionData(q, { idField: 'id' }) as Observable<Comment[]>;
  }

  // Új komment hozzáadása
  addComment(comment: Comment): Promise<void> {
    const commentsRef = collection(this.firestore, 'comments');
    return addDoc(commentsRef, comment).then(() => {});
  }
}
