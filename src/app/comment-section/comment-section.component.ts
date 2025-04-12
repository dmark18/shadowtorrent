import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Comment } from '../models/comment.model';
import { CommentService } from '../services/comment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../models/user.service';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {
  @Input() torrentId!: number;
  @Output() commentAdded = new EventEmitter<void>();

  comments: Comment[] = [];
  newComment: string = '';
  currentUser: any;
  isBanned: boolean = false;

  constructor(private commentService: CommentService, private router: Router,
    private userService: UserService) {}

  ngOnInit(): void {
    this.currentUser = this.userService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
  

    this.isBanned = this.currentUser.banned ?? false;
    this.loadComments();

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) this.currentUser = JSON.parse(storedUser);
  }

  loadComments(): void {
    this.comments = this.commentService.getCommentsForTorrent(this.torrentId);
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      torrentId: this.torrentId,
      username: this.currentUser?.username || 'Ismeretlen',
      content: this.newComment,
      createdAt: new Date()
    };

    this.commentService.addComment(comment);
    this.newComment = '';
    this.loadComments();
    this.commentAdded.emit();
  }
}
