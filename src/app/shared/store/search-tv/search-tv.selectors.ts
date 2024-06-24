import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchTVReducer from './search-tv.reducer';
import { SearchTVState } from './search-tv.reducer';

const searchTVFeatureSelector = createFeatureSelector<SearchTVState>(
  SearchTVReducer.searchTVFeatureKey
);

export const selectSearchTV = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getSearchTVState
);

export const selectIsLoading = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getIsLoading
);

export const selectQuery = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getQuery
);

export const selectTVResult = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getTVResult
);

export const selectTVDetail = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getTVDetail
);

export const selectTVPage = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getTVResultPage
);

export const selectTVTotalPages = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getTVResultTotalPages
);

export const selectError = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getSearchTVError
);
