import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TVBookmarkState } from '../../../shared/interfaces/store/tv-bookmark-state.interface';
import * as TVBookmarkReducer from './tv-bookmark.reducer';

const TVBookmarkFeatureSelector = createFeatureSelector<TVBookmarkState>(
  TVBookmarkReducer.tvBookmarkStateFeatureKey
);

export const selectTVBookmark = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getTVBookmarkState
);

export const selectIsLoading = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getIsLoading
);

export const selectPayload = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getPayload
);

export const selectTVBookmarkMap = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getTVBookmarkMap
);

export const selectTVList = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getTVList
);

export const selectUpdateSearch = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getUpdateSearch
);

export const selectTVBookmarkError = createSelector(
  TVBookmarkFeatureSelector,
  TVBookmarkReducer.getSearchTVBookmarkError
);
