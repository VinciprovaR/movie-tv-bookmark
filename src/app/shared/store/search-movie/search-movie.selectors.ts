import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as SearchMovieReducer from './search-movie.reducer';
import { SearchMovieState } from '../../models/store/search-movie-state.models';

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

export const selectMovieResult = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResult
);

export const selectMovieDetail = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieDetail
);

export const selectMoviePage = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResultPage
);

export const selectMovieTotalPages = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieResultTotalPages
);

export const selectError = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getSearchMovieError
);
