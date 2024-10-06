import { createAction, props } from '@ngrx/store';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import {
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../../shared/interfaces/TMDB/tmdb-media.interface';

export const cleanState = createAction('[Ask-Ai] Clean State');

//search
export const askAi = createAction(
  '[Ask-Ai] Ask Ai Init',
  props<{ query: string }>()
);
export const askAiSuccess = createAction(
  '[Ask-Ai] Ask Ai Success',
  props<{ mediaResult: Movie[] & TV[] }>()
);
export const askAiFailure = createAction(
  '[Ask-Ai] Ask Ai Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const askAiMovieSuccess = createAction(
  '[Ask-Ai] Ask Ai Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const askAiTVSuccess = createAction(
  '[Ask-Ai] Ask Ai TV Success',
  props<{ tvResult: TVResult }>()
);
