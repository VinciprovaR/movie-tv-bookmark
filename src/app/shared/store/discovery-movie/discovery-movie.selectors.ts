import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as DiscoveryMovieReducer from './discovery-movie.reducer';
import { DiscoveryMovieState } from './discovery-movie.reducer';

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

export const selectQuery = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getPayload
);

export const selectMovieResult = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResult
);

export const selectMovieDetail = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieDetail
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
