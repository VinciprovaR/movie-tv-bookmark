import { createAction, props } from '@ngrx/store';
import { TVDetail, TVResult } from '../../models';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';
import { TV_Life_Cycle } from '../../models/supabase/entities/tv_life_cycle.entity';

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
export const createUpdateDeleteTVLifecycle = createAction(
  '[TV-Lifecycle/API] Create or Update or Delete TV Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Create or Update or Delete TV Lifecycle Success',
  props<{
    entityTVLifeCycle: TV_Life_Cycle;
    index: number;
  }>()
);
export const deleteTVLifecycle = createAction(
  '[TV-Lifecycle/API] Delete TV Lifecycle',
  props<{ tvId: number }>()
);
export const deleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Delete TV Lifecycle Success'
);

export const searchTVFailure = createAction(
  '[Search-TV/API] Search TV Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-tv/Error Handling] Clean Error'
);
