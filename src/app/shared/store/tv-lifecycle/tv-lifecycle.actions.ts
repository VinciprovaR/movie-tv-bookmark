import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  lifeCycleId,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';
import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const initTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Init TV Lifecycle Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);

export const createUpdateDeleteTVLifecycle = createAction(
  '[TV-Lifecycle/API] Create or Update or Delete TV Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO<TV> }>()
);
export const updateTVLifecycle = createAction(
  '[TV-Lifecycle/API] Update TV Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const updateTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Update TV Lifecycle Success',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const deleteTVLifecycle = createAction(
  '[TV-Lifecycle/API] Delete TV Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const deleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Delete TV Lifecycle Success',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const createTVLifecycle = createAction(
  '[TV-Lifecycle/API] Create TV Lifecycle ',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const createTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Create TV Lifecycle Success',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);
export const unchangedTVLifecycle = createAction(
  '[TV-Lifecycle/API] Unchanged TV Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<TV>;
    operation: crud_operations;
  }>()
);
export const unchangedTVLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Unchanged TV Lifecycle Success',
  props<{
    tvLifecycleMap: TVLifecycleMap;
    operation: crud_operations;
  }>()
);

export const searchTVByLifecycleLanding = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Landing',
  props<{ payload: null; lifecycleId: lifeCycleId }>()
);
export const searchTVByLifecycleSubmit = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Submit',
  props<{ lifecycleId: lifeCycleId; payload: PayloadMediaLifecycle }>()
);

export const searchTVByLifecycleSuccess = createAction(
  '[TV-Lifecycle/API] Search TV By Lifecycle Success',
  props<{ tvList: TV_Life_Cycle[] & TV_Data[] }>()
);
export const updateSearchTVByLifecycle = createAction(
  '[TV-Lifecycle/API] Update Search TV By Lifecycle '
);

//error
export const lifecycleFailure = createAction(
  '[TV-Lifecycle/API] TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const updateTVLifecycleFailure = createAction(
  '[TV-Lifecycle/API] Update TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const deleteTVLifecycleFailure = createAction(
  '[TV-Lifecycle/API] Delete TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const createTVLifecycleFailure = createAction(
  '[TV-Lifecycle/API] Create TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const unchangedTVLifecycleFailure = createAction(
  '[TV-Lifecycle/API] Unchanged TV Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const cleanError = createAction(
  '[TV-Lifecycle-C/Error Handling] Clean Error'
);

export const crudOperationsInit: any = {
  update: updateTVLifecycle,
  createUpdate: updateTVLifecycle,
  delete: deleteTVLifecycle,
  create: createTVLifecycle,
  unchanged: unchangedTVLifecycle,
};
