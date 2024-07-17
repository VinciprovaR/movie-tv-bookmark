import { createAction, props } from '@ngrx/store';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
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
  props<{ movieResult: MovieResult }>()
);
export const noAdditionalMovie = createAction(
  '[Search-movie/API] No Additional Movie'
);

//error
export const searchMovieFailure = createAction(
  '[Search-Movie/API] Search Movie Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);
export const cleanError = createAction(
  '[Search-movie/Error Handling] Clean Error'
);
