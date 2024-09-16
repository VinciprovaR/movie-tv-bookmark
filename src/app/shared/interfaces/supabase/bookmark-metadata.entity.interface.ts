import { bookmarkEnum } from '../../../shared/interfaces/supabase/supabase-bookmark.interface';

export interface BookmarkMetadata {
  id: number;
  created_at?: string;
  enum: bookmarkEnum;
  description: string;
  label: string;
}
