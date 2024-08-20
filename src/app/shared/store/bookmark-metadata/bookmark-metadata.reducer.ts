import { createReducer, on } from '@ngrx/store';

import { BookmarkMetadataState } from '../../interfaces/store/bookmark-metadata-state.interface';
import { BookmarkMetadataActions } from '.';

export const bookmarkMetadataStateFeatureKey = 'bookmark-metadata';

export const initialState: BookmarkMetadataState = {
  isLoading: false,
  error: null,
  bookmarkOptions: [],
  bookmarkTypeIdMap: {},
};

export const BookmarkMetadataReducer = createReducer(
  initialState,
  on(
    BookmarkMetadataActions.retriveBookmarkMetadata,
    (state): BookmarkMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    BookmarkMetadataActions.retriveBookmarkMetadataSuccess,
    (state, { bookmarkOptions, bookmarkTypeIdMap }): BookmarkMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        bookmarkOptions,
        bookmarkTypeIdMap,
      };
    }
  ),
  on(
    BookmarkMetadataActions.bookmarkMetadataFailure,
    (state, { httpErrorResponse }): BookmarkMetadataState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getBookmarkMetadataState = (state: BookmarkMetadataState) => state;
export const getIsLoading = (state: BookmarkMetadataState) => state.isLoading;
export const getBookmarkOptions = (state: BookmarkMetadataState) =>
  state.bookmarkOptions;
export const getBookmarkTypeIdMap = (state: BookmarkMetadataState) =>
  state.bookmarkTypeIdMap;
export const getBookmarkMetadataError = (state: BookmarkMetadataState) =>
  state.error;
