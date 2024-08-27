import { bookmarkEnum } from '../supabase-bookmark.interface';

export interface Bookmark_Metadata {
  id: number;
  created_at?: string;
  enum: bookmarkEnum;
  description: string;
  label: string;
}
