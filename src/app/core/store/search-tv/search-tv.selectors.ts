import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchTVState } from '../../../shared/interfaces/store/search-tv-state.interface';
import * as SearchTVReducer from './search-tv.reducer';

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

export const selectTVList = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getTVList
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

export const selectNoAdditional = createSelector(
  searchTVFeatureSelector,
  SearchTVReducer.getNoAdditional
);
