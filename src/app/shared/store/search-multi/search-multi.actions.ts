import { createAction, props } from '@ngrx/store';

export const searchMovie = createAction(
  '[Search-multi/API] Search Movie',
  props<{ query: string }>()
);
export const searchMovieSuccess = createAction(
  '[Search-multi/API] Search Movie Success',
  props<{ movies: any }>()
);

export const searchMovieFailure = createAction(
  '[Search-multi/API] Search Movie Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-multi/Error Handling] Clean Error'
);
