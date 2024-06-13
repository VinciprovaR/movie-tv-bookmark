import { createReducer, on } from '@ngrx/store';
import * as SearchMultiActions from './search-multi.actions';
import { SearchMultiState } from '../../models/search-multi-state';

export const searchMultiFeatureKey = 'search-multi';

export const initialState: SearchMultiState = {
  isLoading: false,
  error: null,
  movies: null,
  tvShow: null,
};

export const searchMultiReducer = createReducer(
  initialState,
  on(SearchMultiActions.searchMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchMultiActions.searchMovieSuccess, (state, { movies }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movies,
    };
  }),
  on(SearchMultiActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);
export const getSearchMultiState = (state: SearchMultiState) => state;
export const getIsLoading = (state: SearchMultiState) => state.isLoading;
export const getMovies = (state: SearchMultiState) => state.movies;
export const getTvShow = (state: SearchMultiState) => state.tvShow;
export const getSearchMultiError = (state: SearchMultiState) => state.error;
