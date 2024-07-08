import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as DiscoveryMovieReducer from './discovery-movie.reducer';
import { DiscoveryMovieState } from '../../interfaces/store/discovery-movie-state.interface';

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

export const selectMovieDetail = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieDetail
);

export const selectMoviePage = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResultPage
);

export const selectGenreList = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getGenreList
);

export const selectCertificationList = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getCertificationList
);

export const selectLanguageList = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getLanguageList
);

export const selectMovieTotalPages = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getMovieResultTotalPages
);

export const selectError = createSelector(
  discoveryMovieFeatureSelector,
  DiscoveryMovieReducer.getDiscoveryMovieError
);
