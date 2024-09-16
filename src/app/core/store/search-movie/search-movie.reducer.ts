import { createReducer, on } from '@ngrx/store';
import * as SearchMovieActions from './search-movie.actions';
import { SearchMovieState } from '../../../shared/interfaces/store/search-movie-state.interface';

export const searchMovieFeatureKey = 'search-movie';

export const initialState: SearchMovieState = {
  isLoading: false,
  query: '',
  error: null,
  movieResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  noAdditional: false,
};

export const searchMovieReducer = createReducer(
  initialState,
  on(SearchMovieActions.cleanState, (state): SearchMovieState => {
    return {
      ...initialState,
    };
  }),
  on(SearchMovieActions.searchAdditionalMovie, (state): SearchMovieState => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),

  on(SearchMovieActions.searchMovie, (state, { query }): SearchMovieState => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(
    SearchMovieActions.searchMovieSuccess,
    (state, { movieResult }): SearchMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult,
        noAdditional: false,
      };
    }
  ),
  on(
    SearchMovieActions.searchAdditionalMovieSuccess,
    (state, { movieResult }): SearchMovieState => {
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
        noAdditional: false,
      };
    }
  ),
  on(SearchMovieActions.noAdditionalMovie, (state): SearchMovieState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      noAdditional: true,
    };
  }),

  on(
    SearchMovieActions.searchMovieFailure,
    SearchMovieActions.searchAdditionalMovieFailure,
    (state, { httpErrorResponse }): SearchMovieState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getSearchMovieState = (state: SearchMovieState) => state;
export const getIsLoading = (state: SearchMovieState) => state.isLoading;
export const getQuery = (state: SearchMovieState) => state.query;
export const getSearchMovieError = (state: SearchMovieState) => state.error;
export const getMovieResult = (state: SearchMovieState) => state.movieResult;
export const getMovieList = (state: SearchMovieState) =>
  state.movieResult.results;
export const getMovieResultPage = (state: SearchMovieState) =>
  state.movieResult.page;

export const getMovieResultTotalPages = (state: SearchMovieState) =>
  state.movieResult.total_pages;
export const getNoAdditional = (state: SearchMovieState) => state.noAdditional;
