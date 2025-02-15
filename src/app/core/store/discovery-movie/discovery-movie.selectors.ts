import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DiscoveryMovieState } from '../../../shared/interfaces/store/discovery-movie-state.interface';
import * as DiscoveryMovieReducer from './discovery-movie.reducer';
import { Observable, Subject } from 'rxjs';

const discoveryMovieFeatureSelector =
  createFeatureSelector<DiscoveryMovieState>(
    DiscoveryMovieReducer.discoveryMovieFeatureKey
  );

export const selectDiscoveryMovie = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getDiscoveryMovieState
);

export const selectIsLoading = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getIsLoading
);

export const selectPayload = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getPayload
);

export const selectMovieResult = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResult
);

export const selectMovieList = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieList
);

export const selectMoviePage = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResultPage
);

export const selectMovieTotalPages = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResultTotalPages
);

export const selectError = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getDiscoveryMovieError
);

export const selectNoAdditional = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getNoAdditional
);

export const selectIsFirstLanding = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getIsFirstLanding
);

export const selectInfiniteScrollDisabled = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getInfiniteScrollDisabled
);

export const scrollTo$ = new Subject<null>();
export const scrollToObs$: Observable<null> = scrollTo$.asObservable();
