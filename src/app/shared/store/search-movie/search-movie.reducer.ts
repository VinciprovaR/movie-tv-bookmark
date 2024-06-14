import { createReducer, on } from '@ngrx/store';
import * as SearchMultiActions from './search-movie.actions';
import { SearchMovieState } from '../../models/search-movie-state';

export const searchMovieFeatureKey = 'search-movie';

export const initialState: SearchMovieState = {
  isLoading: false,
  query: '',
  error: null,
  movieResult: null,
};

export const searchMovieReducer = createReducer(
  initialState,
  on(SearchMultiActions.searchMovie, (state, { query }) => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchMultiActions.searchAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchMultiActions.searchMovieSuccess, (state, { movieResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieResult,
    };
  }),
  on(
    SearchMultiActions.searchAdditionalMovieSuccess,
    (state, { movieResult }) => {
      let currMovies = state.movieResult?.results
        ? state.movieResult.results
        : [];
      let nextMovies = movieResult?.results ? movieResult.results : [];
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult: {
          page: movieResult?.page ? movieResult.page : 0,
          total_pages: movieResult?.total_pages ? movieResult.total_pages : 0,
          total_results: movieResult?.total_results
            ? movieResult.total_results
            : 0,
          results: [...currMovies, ...nextMovies],
        },
      };
    }
  ),
  on(SearchMultiActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);
export const getSearchMovieState = (state: SearchMovieState) => state;
export const getIsLoading = (state: SearchMovieState) => state.isLoading;
export const getMovieResult = (state: SearchMovieState) => state.movieResult;
export const getQuery = (state: SearchMovieState) => state.query;
export const getMovieResultPage = (state: SearchMovieState) =>
  state.movieResult?.page ? state.movieResult.page : 0;
export const getMovieResultTotalPages = (state: SearchMovieState) =>
  state.movieResult?.total_pages ? state.movieResult.total_pages : 0;
export const getSearchMovieError = (state: SearchMovieState) => state.error;
