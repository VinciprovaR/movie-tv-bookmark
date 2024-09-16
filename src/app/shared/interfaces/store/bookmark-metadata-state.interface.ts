import { BookmarkOption } from '../supabase/media-bookmark.DTO.interface';
import { bookmarkEnum } from '../supabase/supabase-bookmark.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface BookmarkTypeIdMap {
  [key: string]: bookmarkEnum;
}

export interface BookmarkMetadataState extends StateMediaBookmark {
  bookmarkOptions: BookmarkOption[];
  bookmarkTypeIdMap: BookmarkTypeIdMap;
}
