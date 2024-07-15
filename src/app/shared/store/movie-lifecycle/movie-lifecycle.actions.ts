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

export const initMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Init Movie Lifecycle Map Success',
  props<{ movieLifecycleMap: MovieLifecycleMap }>()
);
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO<Movie> }>()
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

export const searchMovieByLifecycle = createAction(
  '[Movie-Lifecycle/API] Search Movie By Lifecycle ',
  props<{ lifecycleId: lifeCycleId }>()
);
export const searchMovieByLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Search Movie By Lifecycle Success',
  props<{ movieList: Movie_Life_Cycle[] & Movie_Data[] }>()
);
export const updateSearchMovieByLifecycle = createAction(
  '[Movie-Lifecycle/API] Update Search Movie By Lifecycle '
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
