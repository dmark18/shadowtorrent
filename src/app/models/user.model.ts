export interface Torrent {
  id: number;
  name: string;
  category: string;
  size: string;
  status: string;
  uploader: string;
  uploadDate: string;
  seeders: number;
  leechers: number;
  file: File | null;
  imageUrl?: string | 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
}
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  banned: boolean;
  role: string;
  torrents?: Torrent[];
  rejectedTorrents: { torrentName: string; reason: string }[];
}