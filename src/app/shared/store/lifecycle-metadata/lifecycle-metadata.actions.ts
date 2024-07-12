import { createAction, props } from '@ngrx/store';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';

export const retriveLifecycleMetadata = createAction(
  '[Lifecycle-Metadata/API] Retrive Lifecycle Options '
);
export const retriveLifecycleMetadataSuccess = createAction(
  '[Lifecycle-Metadata/API] Retrive Lifecycle Options Success',
  props<{
    lifecycleOptions: LifecycleOption[];
    lifecycleTypeIdMap: LifecycleTypeIdMap;
  }>()
);

//error
export const lifecycleMetadataFailure = createAction(
  '[Lifecycle-Metadata/API] Lifecycle Metadata Failure',
  props<{
    httpErrorResponse: any;
  }>()
);

export const cleanError = createAction(
  '[Lifecycle-Metadata/Error Handling] Clean Error'
);
