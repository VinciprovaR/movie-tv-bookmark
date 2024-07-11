import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { TVLifecycleMap } from '../../interfaces/lifecycle.interface';

export const initTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Init TV Lifecycle Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);
export const createUpdateDeleteTVLifecycle = createAction(
  '[TV-Lifecycle-C/API] Create or Update or Delete TV Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Create or Update or Delete TV Lifecycle Success',
  props<{ tvLifecycleMap: TVLifecycleMap }>()
);
export const deleteTVLifecycle = createAction(
  '[TV-Lifecycle-C/API] Delete TV Lifecycle',
  props<{ tvId: number }>()
);
export const deleteTVLifecycleSuccess = createAction(
  '[TV-Lifecycle-C/API] Delete TV Lifecycle Success'
);

//error
export const lifecycleFailure = createAction(
  '[TV-Lifecycle-C/API] Search TV Failure',
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[TV-Lifecycle-C/Error Handling] Clean Error'
);
