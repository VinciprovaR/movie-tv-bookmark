import { BookmarkOption } from '../supabase/media-bookmark.DTO.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface BookmarkTypeIdMap {
  [key: string]: BookmarkOption;
}

export interface BookmarkMetadataState extends StateMediaBookmark {
  bookmarkOptions: BookmarkOption[];
  bookmarkTypeIdMap: BookmarkTypeIdMap;
}
