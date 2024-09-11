import { bookmarkEnum } from '../supabase-bookmark.interface';

export interface TVBookmark {
  id?: number;
  created_at?: string;
  user_id: string;
  tv_id: number;
  bookmark_enum: bookmarkEnum;
  label?: string;
}
