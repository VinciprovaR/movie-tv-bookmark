import { createAction, props } from '@ngrx/store';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { PayloadDiscoveryMovie } from '../../../shared/interfaces/store/discovery-movie-state.interface';
import { MovieResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

export const cleanState = createAction('[Discovery-movie] Clean State');
export const resetFilters = createAction('[Discovery-movie] Reset Filters');
//search
export const discoveryMovieLanding = createAction(
  '[Discovery-movie] Discovery Movie Landing Init'
);
export const discoveryMovieLandingSuccess = createAction(
  '[Discovery-Movie] Discovery Movie Landing Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryMovieLandingFailure = createAction(
  '[Discovery-Movie] Discovery Movie Landing Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const discoveryMovie = createAction(
  '[Discovery-movie] Discovery Movie Init',
  props<{ payload: PayloadDiscoveryMovie }>()
);
export const discoveryMovieSuccess = createAction(
  '[Discovery-movie] Discovery Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryMovieFailure = createAction(
  '[Discovery-Movie] Discovery Movie Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const discoveryAdditionalMovie = createAction(
  '[Discovery-movie] Discovery Additional Movie Init'
);
export const discoveryAdditionalMovieSuccess = createAction(
  '[Discovery-movie] Discovery Movie Additional Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryAdditionaMovieFailure = createAction(
  '[Discovery-Movie] Discovery Additional Movie Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const noAdditionalMovie = createAction(
  '[Discovery-movie] No Additional Movie Success'
);
