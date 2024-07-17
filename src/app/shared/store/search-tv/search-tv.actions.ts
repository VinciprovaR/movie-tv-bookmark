import { createAction, props } from '@ngrx/store';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const searchTV = createAction(
  '[Search-tv/API] Search TV',
  props<{ query: string }>()
);
export const searchTVSuccess = createAction(
  '[Search-tv/API] Search TV Success',
  props<{ tvResult: TVResult }>()
);
export const searchAdditionalTV = createAction(
  '[Search-tv/API] Search Additional TV'
);
export const searchAdditionalTVSuccess = createAction(
  '[Search-tv/API] Search TV Additional Success',
  props<{ tvResult: TVResult }>()
);
export const noAdditionalTV = createAction('[Search-tv/API] No Additional TV');

//error
export const searchTVFailure = createAction(
  '[Search-TV/API] Search TV Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const cleanError = createAction(
  '[Search-tv/Error Handling] Clean Error'
);
