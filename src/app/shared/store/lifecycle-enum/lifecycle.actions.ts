import { createAction, props } from '@ngrx/store';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';

export const lifecycleEnum = createAction('[Lifecycle/API] Get Lifecycle Enum');
export const lifecycleEnumSuccess = createAction(
  '[Lifecycle/API] Get Lifecycle Enum Success',
  props<{ lifecycleEnum: Media_Lifecycle_Enum[] }>()
);

export const lifecycleFailure = createAction(
  '[Lifecycle/API] Lifecycle Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Lifecycle/Error Handling] Clean Error'
);
