export interface Comment {
  id: number;
  torrentId: number;
  username: string;
  content: string;
  createdAt: Date;
  role?: string;
}
