import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchMultiReducer from './search-multi.reducer';
import { SearchMultiState } from '../../models/search-multi-state';

const searchMultiFeatureSelector = createFeatureSelector<SearchMultiState>(
  SearchMultiReducer.searchMultiFeatureKey
);

export const selectSearchMulti = createSelector(
  searchMultiFeatureSelector,
  SearchMultiReducer.getSearchMultiState
);

export const selectIsLoading = createSelector(
  searchMultiFeatureSelector,
  SearchMultiReducer.getIsLoading
);

export const selectMovies = createSelector(
  searchMultiFeatureSelector,
  SearchMultiReducer.getMovies
);

export const selectTVShow = createSelector(
  searchMultiFeatureSelector,
  SearchMultiReducer.getTvShow
);

export const selectError = createSelector(
  searchMultiFeatureSelector,
  SearchMultiReducer.getSearchMultiError
);
