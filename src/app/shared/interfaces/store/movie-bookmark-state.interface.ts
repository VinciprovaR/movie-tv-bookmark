import { Movie_Data } from '../supabase/entities';
import { MovieBookmarkMap } from '../supabase/supabase-bookmark.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadMovieBookmark {
  genreIdList: number[];
  sortBy: string;
}

export interface MovieBookmarkState extends StateMediaBookmark {
  movieBookmarkMap: MovieBookmarkMap;
  movieList: Movie_Data[];
  updateSearch: boolean;
  payload: PayloadMovieBookmark;
}
