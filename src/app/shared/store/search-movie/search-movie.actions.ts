import { createAction, props } from '@ngrx/store';
import { MovieDetail, MovieResult } from '../../models';

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

//Movie lifecycle

export const changeMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Change Movie Lifecycle',
  props<{ movieId: number; lifecycleId: number; index: number }>()
);
export const changeMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Change Movie Lifecycle Success',
  props<{ lifeCycleId: number }>()
);

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
