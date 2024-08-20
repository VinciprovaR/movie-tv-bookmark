import { bookmarkEnum } from '../supabase-bookmark.interface';

export interface MediaBookmarkDTO<T> {
  bookmarkEnum: bookmarkEnum;
  // index: number;
  mediaDataDTO: T;
}

export interface BookmarkOption {
  label: string;
  value: bookmarkEnum;
}
