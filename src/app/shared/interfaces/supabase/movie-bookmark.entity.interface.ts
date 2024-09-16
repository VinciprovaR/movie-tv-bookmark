import { bookmarkEnum } from '../../../shared/interfaces/supabase/supabase-bookmark.interface';

export interface MovieBookmark {
  id?: number;
  created_at?: string;
  user_id: string;
  movie_id: number;
  bookmark_enum: bookmarkEnum;
  label?: string;
}
