import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as MovieBookmarkReducer from './movie-bookmark.reducer';
import { MovieBookmarkState } from '../../interfaces/store/movie-bookmark-state.interface';

const MovieBookmarkFeatureSelector = createFeatureSelector<MovieBookmarkState>(
  MovieBookmarkReducer.movieBookmarkStateFeatureKey
);

export const selectMovieBookmark = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getMovieBookmarkState
);

export const selectIsLoading = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getIsLoading
);

export const selectPayload = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getPayload
);

export const selectMovieBookmarkMap = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getMovieBookmarkMap
);

export const selectMovieList = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getMovieList
);

export const selectUpdateSearch = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getUpdateSearch
);

export const selectMovieBookmarkError = createSelector(
  MovieBookmarkFeatureSelector,
  MovieBookmarkReducer.getSearchMovieBookmarkError
);
