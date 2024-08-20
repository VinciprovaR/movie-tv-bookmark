import { createAction, props } from '@ngrx/store';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  lifecycleEnum,
  MovieLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { Movie, MovieDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PayloadMovieLifecycle } from '../../interfaces/store/movie-lifecycle-state.interface';

//populate lifecycle map
export const populateMovieLifecycleMapSuccess = createAction(
  '[Movie-Lifecycle] Populate Movie Lifecycle Map Success',
  props<{ movieLifecycleMap: MovieLifecycleMap }>()
);
export const populateMovieLifecycleMapFailure = createAction(
  '[Movie-Lifecycle] Populate Movie Lifecycle Map Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

//CRUD lifecycle
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle] Create or Update or Delete Movie Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>;
  }>()
);
export const createUpdateDeleteMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle] Create or Update or Delete Movie Lifecycle Failure & Notify',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const updateMovieLifecycle = createAction(
  '[Movie-Lifecycle] Update Movie Lifecycle Init & Notify',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const updateMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle] Update Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const updateMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle] Update Movie Lifecycle Failure & Notify',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle] Delete Movie Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle] Delete Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const deleteMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle] Delete Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const createMovieLifecycle = createAction(
  '[Movie-Lifecycle] Create Movie Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const createMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle] Create Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const createMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle] Create Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const unchangedMovieLifecycle = createAction(
  '[Movie-Lifecycle] Unchanged Movie Lifecycle Init',
  props<{
    mediaLifecycleDTO: MediaLifecycleDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const unchangedMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle] Unchanged Movie Lifecycle Success',
  props<{
    movieLifecycleMap: MovieLifecycleMap;
    operation: crud_operations;
  }>()
);
export const unchangedMovieLifecycleFailure = createAction(
  '[Movie-Lifecycle] Unchanged Movie Lifecycle Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

//search movie by lifecycle
export const notifySearchMovieByLifecycle = createAction(
  '[Movie-Lifecycle] Notify Search Movie By Lifecycle',
  props<{ notifyMsg: string }>()
);

//search movie by lifecycle
export const searchMovieByLifecycleLanding = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Landing Init',
  props<{ lifecycleEnum: lifecycleEnum }>()
);
export const searchMovieByLifecycleLandingSuccess = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Landing Success',
  props<{ movieList: Movie_Life_Cycle[] & Movie_Data[] }>()
);
export const searchMovieByLifecycleLandingeFailure = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Landing Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const searchMovieByLifecycleSubmit = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Submit Init',
  props<{ lifecycleEnum: lifecycleEnum; payload: PayloadMovieLifecycle }>()
);
export const searchMovieByLifecycleSubmitSuccess = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Submit Success',
  props<{ movieList: Movie_Life_Cycle[] & Movie_Data[] }>()
);
export const searchMovieByLifecycleSubmitFailure = createAction(
  '[Movie-Lifecycle] Search Movie By Lifecycle Submit Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const crudOperationsInit: any = {
  update: updateMovieLifecycle,
  createUpdate: updateMovieLifecycle,
  delete: deleteMovieLifecycle,
  create: createMovieLifecycle,
  unchanged: unchangedMovieLifecycle,
};
