import { MovieLifecycleMap } from '../lifecycle.interface';
import { Movie_Life_Cycle } from '../supabase/entities';
import { Movie_Data } from '../supabase/entities/movie_data.entity.interface';
import { StateMovieBookmark } from './state-movie-bookmark.interface';

export interface MovieLifecycleState extends StateMovieBookmark {
  movieLifecycleMap: MovieLifecycleMap;
  movieList: Movie_Data[];
}
