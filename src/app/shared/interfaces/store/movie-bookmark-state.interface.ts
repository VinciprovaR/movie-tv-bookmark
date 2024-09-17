import { MovieData } from '../supabase/media-data.entity.interface';
import { MovieBookmarkMap } from '../supabase/supabase-bookmark.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadMovieBookmark {
  genreIdList: number[];
  sortBy: string;
}

export interface MovieBookmarkState extends StateMediaBookmark {
  movieBookmarkMap: MovieBookmarkMap;
  movieList: MovieData[];
  updateSearch: boolean;
  payload: PayloadMovieBookmark;
}
