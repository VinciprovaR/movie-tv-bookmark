import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SearchMovieState } from '../../../shared/interfaces/store/search-movie-state.interface';
import * as SearchMovieReducer from './search-movie.reducer';

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

export const selectMovieList = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getMovieList
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

export const selectNoAdditional = createSelector(
  searchMovieFeatureSelector,
  SearchMovieReducer.getNoAdditional
);
