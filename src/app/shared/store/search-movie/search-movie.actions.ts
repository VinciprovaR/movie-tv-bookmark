import { createAction, props } from '@ngrx/store';
import { MovieDetail, MovieResult, TVDetail, TVResult } from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';

//movie
export const searchMovie = createAction(
  '[Search-movie/API] Search Movie',
  props<{ query: string }>()
);
export const searchMovieSuccess = createAction(
  '[Search-movie/API] Search Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const searchAdditionalMovie = createAction(
  '[Search-movie/API] Search Additional Movie'
);
export const searchAdditionalMovieSuccess = createAction(
  '[Search-movie/API] Search Movie Additional Success',
  props<{ movieResult: MovieResult | null }>()
);
export const noAdditionalMovie = createAction(
  '[Search-movie/API] No Additional Movie'
);
export const searchMovieDetail = createAction(
  '[Search-movie/API] Search Movie Detail',
  props<{ movieId: number }>()
);
export const searchMovieDetailSuccess = createAction(
  '[Search-movie/API] Search Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle Success',
  props<{
    entityMovieLifeCycle: Movie_Life_Cycle;
    index: number;
  }>()
);
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Success'
);

export const searchMovieFailure = createAction(
  '[Search-Movie/API] Search Movie Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Search-movie/Error Handling] Clean Error'
);
