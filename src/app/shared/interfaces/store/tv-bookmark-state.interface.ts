import { TVBookmarkMap } from '../supabase/supabase-bookmark.interface';
import { TVData } from '../supabase/tv-data.entity.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadTVBookmark {
  genreIdList: number[];
  sortBy: string;
}

export interface TVBookmarkState extends StateMediaBookmark {
  tvBookmarkMap: TVBookmarkMap;
  tvList: TVData[];
  updateSearch: boolean;
  payload: PayloadTVBookmark;
}
