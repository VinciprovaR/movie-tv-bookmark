import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchMediaReducer from './search-media.reducer';
import { SearchMediaState } from './search-media.reducer';

const searchMediaFeatureSelector = createFeatureSelector<SearchMediaState>(
  SearchMediaReducer.searchMediaFeatureKey
);

export const selectSearchMedia = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getSearchMediaState
);

export const selectIsLoading = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getIsLoading
);

export const selectQuery = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getQuery
);

export const selectMediaResult = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getMediaResult
);

export const selectMediaDetail = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getMediaDetail
);

export const selectMediaPage = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getMediaResultPage
);

export const selectMediaTotalPages = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getMediaResultTotalPages
);

export const selectMediaLifecycleEnum = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getLifecycleEnum
);

export const selectError = createSelector(
  searchMediaFeatureSelector,
  SearchMediaReducer.getSearchMediaError
);
