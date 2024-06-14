import { createAction, props } from '@ngrx/store';
import { MovieResult } from '../../models';

export const searchMovie = createAction(
  '[Search-multi/API] Search Movie',
  props<{ query: string }>()
);
export const searchMovieSuccess = createAction(
  '[Search-multi/API] Search Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const searchAdditionalMovie = createAction(
  '[Search-multi/API] Search Additional Movie'
);
export const searchAdditionalMovieSuccess = createAction(
  '[Search-multi/API] Search Movie Additional Success',
  props<{ movieResult: MovieResult | null }>()
);
export const noAdditionalMovie = createAction(
  '[Search-multi/API] No Additional Movie'
);
export const searchMovieFailure = createAction(
  '[Search-multi/API] Search Movie Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-multi/Error Handling] Clean Error'
);
