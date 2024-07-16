import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  lifeCycleId,
  MovieLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { Movie } from '../../interfaces/TMDB/tmdb-media.interface';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';
import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const initMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Init Movie Lifecycle Map Success',
  props<{ movieLifecycleMap: MovieLifecycleMap }>()
);

//

export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO<Movie> }>()
);
export const updateMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Update Movie Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const updateMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Update Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
  }>()
);
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
  }>()
);
export const createMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create Movie Lifecycle ',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const createMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Create Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
  }>()
);
export const unchangedMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Unchanged Movie Lifecycle',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const unchangedMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Unchanged Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
  }>()
);

//

export const searchMovieByLifecycleLanding = createAction(
  '[Movie-Lifecycle/API] Search Movie By Lifecycle Landing',
  props<{ payload: null; lifecycleId: lifeCycleId }>()
);
export const searchMovieByLifecycleSubmit = createAction(
  '[Movie-Lifecycle/API] Search Movie By Lifecycle Submit',
  props<{ lifecycleId: lifeCycleId; payload: PayloadMediaLifecycle }>()
);
export const updateSearchMovieByLifecycle = createAction(
  '[Movie-Lifecycle/API] Update Search Movie By Lifecycle '
);
export const searchMovieByLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Search Movie By Lifecycle Success',
  props<{ movieList: Movie_Life_Cycle[] & Movie_Data[] }>()
);

//error
export const lifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const updateMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Update Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const deleteMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const createMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Create Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
export const unchangedMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle/API] Unchanged Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const cleanError = createAction(
  '[Movie-Lifecycle/Error Handling] Clean Error'
);

export const crudOperationsInit: any = {
  update: updateMovieLifecycle,
  createUpdate: updateMovieLifecycle,
  delete: deleteMovieLifecycle,
  create: createMovieLifecycle,
  unchanged: unchangedMovieLifecycle,
};
