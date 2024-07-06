import { createAction, props } from '@ngrx/store';
import { TV, TVDetail, TVResult } from '../../interfaces/media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';

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
  props<{ tvResult: TVResult | null }>()
);
export const noAdditionalTV = createAction('[Search-tv/API] No Additional TV');
export const searchTVDetail = createAction(
  '[Search-tv/API] Search TV Detail',
  props<{ tvId: number }>()
);
export const searchTVDetailSuccess = createAction(
  '[Search-tv/API] Search TV Detail Success',
  props<{ tvDetail: TVDetail }>()
);
export const cleanTVDetail = createAction('[Search-tv/API] Clean TV Detail');

//error
export const searchTVFailure = createAction(
  '[Search-TV/API] Search TV Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-tv/Error Handling] Clean Error'
);
