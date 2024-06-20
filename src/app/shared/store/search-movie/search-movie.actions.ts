import { createAction, props } from '@ngrx/store';
import {
  MovieDetail,
  MovieLifecycle,
  MovieResult,
  SearchMovieState,
} from '../../models';
import {
  Lifecycle_Enum,
  Movie_Life_Cycle,
} from '../../models/supabase/movie_life_cycle.model';

export const searchMovie = createAction(
  '[Search-movie/API] Search Movie',
  props<{ query: string }>()
);
export const searchMovieSuccess = createAction(
  '[Search-movie/API] Search Movie Success',
  props<{ movieResult: MovieResult }>()
);

export const searchAdditionalMovie = createAction(
  '[Search-movie/API] Search Additional Movie'
);
export const searchAdditionalMovieSuccess = createAction(
  '[Search-movie/API] Search Movie Additional Success',
  props<{ movieResult: MovieResult | null }>()
);

export const searchMovieDetail = createAction(
  '[Search-movie/API] Search Movie Detail',
  props<{ movieId: number }>()
);
export const searchMovieDetailSuccess = createAction(
  '[Search-movie/API] Search Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);

export const noAdditionalMovie = createAction(
  '[Search-movie/API] No Additional Movie'
);

export const searchMovieFailure = createAction(
  '[Search-movie/API] Search Movie Failure',
  props<{ httpErrorResponse: any }>()
);

//Media... lifecycle

export const getMediaLifecycleEnum = createAction(
  '[Search-media/API] Get Media Lifecycle Enum'
);

export const getMediaLifecycleEnumSuccess = createAction(
  '[Search-media/API] Get Media Lifecycle Enum Success',
  props<{ lifecycleEnum: Lifecycle_Enum[] }>()
);

export const createOrUpdateOrDeleteMovieLifecycleLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update Movie Lifecycle',
  props<MovieLifecycle>()
);
export const createOrUpdateOrDeleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Create or Update Movie Lifecycle Success',
  props<{ movieLifeCycleResultDB: Movie_Life_Cycle; index: number }>()
);
//{ movieLifeCycleResultDB: Movie_Life_Cycle; index: number }
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Success'
);

export const movieLifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Movie-Lifecycle Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-movie/Error Handling] Clean Error'
);
