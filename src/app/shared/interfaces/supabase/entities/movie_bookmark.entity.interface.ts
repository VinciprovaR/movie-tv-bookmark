import { bookmarkEnum } from '../supabase-bookmark.interface';

export interface Movie_Bookmark {
  id?: number;
  created_at?: string;
  user_id: string;
  movie_id: number;
  bookmark_enum: bookmarkEnum;
  label?: string;
}
