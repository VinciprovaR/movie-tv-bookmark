import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { MovieLifecycleMap } from '../../interfaces/lifecycle.interface';
import { MovieResult } from '../../interfaces/media.interface';

export const initMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Init Movie Lifecycle Success',
  props<{ movieLifecycleMap: MovieLifecycleMap }>()
);
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle Success',
  props<{ movieLifecycleMap: MovieLifecycleMap }>()
);
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Success'
);

//error
export const lifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Movie Lifecycle Failure',
  props<{
    httpErrorResponse: any;
  }>()
);

export const cleanError = createAction(
  '[Movie-Lifecycle/Error Handling] Clean Error'
);
