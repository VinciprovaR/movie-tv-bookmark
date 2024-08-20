import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookmarkMetadataState } from '../../interfaces/store/bookmark-metadata-state.interface';
import { BookmarkMetadataReducers } from '.';

const BookmarkMetadataFeatureSelector =
  createFeatureSelector<BookmarkMetadataState>(
    BookmarkMetadataReducers.bookmarkMetadataStateFeatureKey
  );

export const selectBookmarkOptions = createSelector(
  BookmarkMetadataFeatureSelector,
  BookmarkMetadataReducers.getBookmarkOptions
);

export const selectIsLoading = createSelector(
  BookmarkMetadataFeatureSelector,
  BookmarkMetadataReducers.getIsLoading
);

export const selectBookmarkTypeIdMap = createSelector(
  BookmarkMetadataFeatureSelector,
  BookmarkMetadataReducers.getBookmarkTypeIdMap
);

export const selectBookmarkMetadataError = createSelector(
  BookmarkMetadataFeatureSelector,
  BookmarkMetadataReducers.getBookmarkMetadataError
);
