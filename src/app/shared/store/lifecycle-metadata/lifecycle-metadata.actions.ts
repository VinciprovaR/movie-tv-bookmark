import { createAction, props } from '@ngrx/store';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const retriveLifecycleMetadata = createAction(
  '[Lifecycle-Metadata] Retrive Lifecycle Options '
);
export const retriveLifecycleMetadataSuccess = createAction(
  '[Lifecycle-Metadata] Retrive Lifecycle Options Success',
  props<{
    lifecycleOptions: LifecycleOption[];
    lifecycleTypeIdMap: LifecycleTypeIdMap;
  }>()
);
export const lifecycleMetadataFailure = createAction(
  '[Lifecycle-Metadata] Lifecycle Metadata Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
