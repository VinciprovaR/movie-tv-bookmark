import { createReducer, on } from '@ngrx/store';
import * as SearchMovieActions from './search-movie.actions';
import { SearchMovieState } from '../../interfaces/store/search-movie-state.interface';

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
  movieDetail: null,
};

export const searchMovieReducer = createReducer(
  initialState,
  on(SearchMovieActions.searchAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),

  on(SearchMovieActions.searchMovie, (state, { query }) => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchMovieActions.searchMovieSuccess, (state, { movieResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieResult,
    };
  }),
  on(
    SearchMovieActions.searchAdditionalMovieSuccess,
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
  on(SearchMovieActions.noAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
    };
  }),
  on(SearchMovieActions.searchMovieDetail, (state) => {
    return {
      ...state,
      movieDetail: null,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchMovieActions.searchMovieDetailSuccess, (state, { movieDetail }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieDetail,
    };
  }),
  on(SearchMovieActions.cleanMovieDetail, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieDetail: null,
    };
  }),
  on(SearchMovieActions.searchMovieFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
    };
  }),
  on(SearchMovieActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getSearchMovieState = (state: SearchMovieState) => state;
export const getIsLoading = (state: SearchMovieState) => state.isLoading;
export const getQuery = (state: SearchMovieState) => state.query;
export const getSearchMovieError = (state: SearchMovieState) => state.error;
export const getMovieResult = (state: SearchMovieState) => state.movieResult;
export const getMovieList = (state: SearchMovieState) =>
  state.movieResult.results;
export const getMovieDetail = (state: SearchMovieState) => state.movieDetail;
export const getMovieResultPage = (state: SearchMovieState) =>
  state.movieResult.page;

export const getMovieResultTotalPages = (state: SearchMovieState) =>
  state.movieResult.total_pages;
