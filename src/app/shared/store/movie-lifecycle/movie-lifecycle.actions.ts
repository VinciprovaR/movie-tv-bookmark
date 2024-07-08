import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { MediaLifecycleMap } from '../../interfaces/lifecycle.interface';

export const initMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle-C/API] Init Movie Lifecycle Success',
  props<{ movieLifecycleMap: MediaLifecycleMap }>()
);
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle-C/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle-C/API] Create or Update or Delete Movie Lifecycle Success',
  props<{ movieLifecycleMap: MediaLifecycleMap }>()
);
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle-C/API] Delete Movie Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle-C/API] Delete Movie Lifecycle Success'
);

//error
export const lifecycleFailure = createAction(
  '[Movie-Lifecycle-C/API] Search Movie Failure',
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[Movie-Lifecycle-C/Error Handling] Clean Error'
);
