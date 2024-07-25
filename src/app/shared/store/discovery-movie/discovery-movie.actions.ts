import { createAction, props } from '@ngrx/store';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import {
  Certification,
  Genre,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const discoveryMovieLanding = createAction(
  '[Discovery-movie] Discovery Movie Landing Init'
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
  '[Discovery-Movie/API] Discovery Movie Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const discoveryAdditionalMovie = createAction(
  '[Discovery-movie] Discovery Additional Movie Init'
);
export const discoveryAdditionalMovieSuccess = createAction(
  '[Discovery-movie] Discovery Movie Additional Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryAdditionaMovieFailure = createAction(
  '[Discovery-Movie/API] Discovery Additional Movie Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const noAdditionalMovie = createAction(
  '[Discovery-movie] No Additional Movie Success'
);
