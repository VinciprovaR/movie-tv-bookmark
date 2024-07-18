import { createAction, props } from '@ngrx/store';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const searchMovie = createAction(
  '[Search-movie] Search Movie Init',
  props<{ query: string }>()
);
export const searchMovieSuccess = createAction(
  '[Search-movie] Search Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const searchMovieFailure = createAction(
  '[Search-Movie] Search Movie Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

//search additional
export const searchAdditionalMovie = createAction(
  '[Search-movie] Search Additional Movie'
);
export const searchAdditionalMovieSuccess = createAction(
  '[Search-movie] Search Movie Additional Success',
  props<{ movieResult: MovieResult }>()
);
export const searchAdditionalMovieFailure = createAction(
  '[Search-Movie] Search Movie Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);
export const noAdditionalMovie = createAction(
  '[Search-movie] No Additional Movie'
);
