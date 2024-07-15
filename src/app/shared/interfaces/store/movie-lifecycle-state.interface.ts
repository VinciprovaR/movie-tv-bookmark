import { Movie_Data } from '../supabase/entities';
import { MovieLifecycleMap } from '../supabase/supabase-lifecycle.interface';
import { Genre } from '../TMDB/tmdb-filters.interface';
import { StateMediaBookmark } from './state-media-bookmark.interface';

export interface PayloadMovieLifecycle {
  genreIdList: number[];
  sortBy: string;
}

export interface MovieLifecycleState extends StateMediaBookmark {
  movieLifecycleMap: MovieLifecycleMap;
  movieList: Movie_Data[];
  updateSearch: boolean;
  payload: PayloadMovieLifecycle;
  genreList: Genre[];
}
