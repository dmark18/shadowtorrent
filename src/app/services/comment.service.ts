import { Injectable } from '@angular/core';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private storageKey = 'comments';

  getCommentsForTorrent(torrentId: number): Comment[] {
    const comments = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return comments.filter((c: Comment) => c.torrentId === torrentId);
  }

  addComment(newComment: Comment): void {
    const comments = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    comments.push(newComment);
    localStorage.setItem(this.storageKey, JSON.stringify(comments));
  }
}