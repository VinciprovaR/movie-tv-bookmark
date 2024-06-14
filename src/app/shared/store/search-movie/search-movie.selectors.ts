import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchMovieReducer from './search-movie.reducer';
import { SearchMovieState } from '../../models/search-movie-state';

const searchMovieFeatureSelector = createFeatureSelector<SearchMovieState>(
  SearchMovieReducer.searchMovieFeatureKey
);

export const selectSearchMovie = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getSearchMovieState
);

export const selectIsLoading = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getIsLoading
);

export const selectQuery = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getQuery
);

export const selectMoviesResult = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResult
);

export const selectMoviesPage = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResultPage
);

export const selectMoviesTotalPages = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResultTotalPages
);

export const selectError = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getSearchMovieError
);
