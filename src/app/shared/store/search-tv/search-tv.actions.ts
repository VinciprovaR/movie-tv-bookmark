import { createAction, props } from '@ngrx/store';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

export const cleanState = createAction('[Search-tv] Clean State');

//search
export const searchTV = createAction(
  '[Search-tv] Search TV Init',
  props<{ query: string }>()
);
export const searchTVSuccess = createAction(
  '[Search-tv] Search TV Success',
  props<{ tvResult: TVResult }>()
);
export const searchTVFailure = createAction(
  '[Search-TV] Search TV Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//search additional
export const searchAdditionalTV = createAction(
  '[Search-tv] Search Additional TV'
);
export const searchAdditionalTVSuccess = createAction(
  '[Search-tv] Search TV Additional Success',
  props<{ tvResult: TVResult }>()
);
export const searchAdditionalTVFailure = createAction(
  '[Search-TV] Search TV Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const noAdditionalTV = createAction('[Search-tv] No Additional TV');
