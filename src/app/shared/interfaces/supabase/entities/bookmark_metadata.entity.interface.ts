import { bookmarkEnum } from '../supabase-bookmark.interface';

export interface Bookmark_Metadata {
  id: number;
  enum: bookmarkEnum;
  description: string;
  label: string;
}
