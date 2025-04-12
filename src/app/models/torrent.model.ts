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
  rejectReason?: string;
  imageUrl?: string | 'https://cdn-icons-png.flaticon.com/512/28/28969.png';
}