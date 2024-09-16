import { bookmarkEnum } from '../../../shared/interfaces/supabase/supabase-bookmark.interface';

export interface MediaBookmarkDTO<T> {
  bookmarkEnum: bookmarkEnum;
  mediaDataDTO: T;
}

export interface BookmarkOption {
  label: string;
  value: bookmarkEnum;
}
