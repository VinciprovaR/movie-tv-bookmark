import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  lifecycleEnum,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PayloadTVLifecycle } from '../../interfaces/store/tv-lifecycle-state.interface';

//populate lifecycle map
export const populateTVLifecycleMapSuccess = createAction(
  '[TV-Lifecycle/API] Populate TV Lifecycle Map Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);
export const populateTVLifecycleMapFailure = createAction(
  '[TV-Lifecycle] Populate TV Lifecycle Map Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

//CRUD lifecycle
export const createUpdateDeleteTVLifecycle = createAction(
  '[TV-Lifecycle] Create or Update or Delete TV Lifecycle Init',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO<TV> }>()
);
export const createUpdateDeleteTVLifecycleFailure = createAction(
  '[TV-Lifecycle] Create or Update or Delete TV Lifecycle Failure & Notify',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const updateTVLifecycle = createAction(
  '[TV-Lifecycle] Update TV Lifecycle Init & Notify',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const updateTVLifecycleSuccess = createAction(
  '[TV-Lifecycle] Update TV Lifecycle Success & Notify',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const updateTVLifecycleFailure = createAction(
  '[TV-Lifecycle] Update TV Lifecycle Failure & Notify',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const deleteTVLifecycle = createAction(
  '[TV-Lifecycle] Delete TV Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const deleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle] Delete TV Lifecycle Success & Notify',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const deleteTVLifecycleFailure = createAction(
  '[TV-Lifecycle] Delete TV Lifecycle Failure & Notify',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const createTVLifecycle = createAction(
  '[TV-Lifecycle] Create TV Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const createTVLifecycleSuccess = createAction(
  '[TV-Lifecycle] Create TV Lifecycle Success & Notify',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const createTVLifecycleFailure = createAction(
  '[TV-Lifecycle] Create TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const unchangedTVLifecycle = createAction(
  '[TV-Lifecycle] Unchanged TV Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const unchangedTVLifecycleSuccess = createAction(
  '[TV-Lifecycle] Unchanged TV Lifecycle Success & Notify',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const unchangedTVLifecycleFailure = createAction(
  '[TV-Lifecycle] Unchanged TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

//search tv by lifecycle
export const notifySearchTVByLifecycle = createAction(
  '[TV-Lifecycle/API] Notify Search TV By Lifecycle'
);

//search tv by lifecycle
export const searchTVByLifecycleLanding = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Landing Init',
  props<{ lifecycleEnum: lifecycleEnum }>()
);
export const searchTVByLifecycleLandingSuccess = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Landing Success',
  props<{ tvList: TV_Life_Cycle[] & TV_Data[] }>()
);
export const searchTVByLifecycleLandingeFailure = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Landing Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const searchTVByLifecycleSubmit = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Submit Init',
  props<{ lifecycleEnum: lifecycleEnum; payload: PayloadTVLifecycle }>()
);
export const searchTVByLifecycleSubmitSuccess = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Submit Success',
  props<{ tvList: TV_Life_Cycle[] & TV_Data[] }>()
);
export const searchTVByLifecycleSubmitFailure = createAction(
  '[TV-Lifecycle] Search TV By Lifecycle Submit Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const crudOperationsInit: any = {
  update: updateTVLifecycle,
  createUpdate: updateTVLifecycle,
  delete: deleteTVLifecycle,
  create: createTVLifecycle,
  unchanged: unchangedTVLifecycle,
};
