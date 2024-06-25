import { createAction, props } from '@ngrx/store';
import { MovieDetail, MovieResult, TVDetail, TVResult } from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';

//movie
export const discoveryMovie = createAction(
  '[Discovery-movie/API] Discovery Movie',
  props<{ payload: any }>()
);
export const discoveryMovieSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryAdditionalMovie = createAction(
  '[Discovery-movie/API] Discovery Additional Movie'
);
export const discoveryAdditionalMovieSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Additional Success',
  props<{ movieResult: MovieResult | null }>()
);
export const noAdditionalMovie = createAction(
  '[Discovery-movie/API] No Additional Movie'
);
export const discoveryMovieDetail = createAction(
  '[Discovery-movie/API] Discovery Movie Detail',
  props<{ movieId: number }>()
);
export const cleanMovieDetail = createAction(
  '[Discovery-movie/API] Clean Movie Detail'
);

export const discoveryMovieDetailSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);
export const createUpdateDeleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle',
  props<{ mediaLifecycleDTO: MediaLifecycleDTO }>()
);
export const createUpdateDeleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Create or Update or Delete Movie Lifecycle Success',
  props<{ movieResult: MovieResult }>()
);
export const deleteMovieLifecycle = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle',
  props<{ movieId: number }>()
);
export const deleteMovieLifecycleSuccess = createAction(
  '[Movie-Lifecycle/API] Delete Movie Lifecycle Success'
);

export const discoveryMovieFailure = createAction(
  '[Discovery-Movie/API] Discovery Movie Failure',
  props<{ httpErrorResponse: any }>()
);

export const cleanError = createAction(
  '[Discovery-movie/Error Handling] Clean Error'
);
