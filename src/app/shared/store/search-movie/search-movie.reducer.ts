import { createReducer, on } from '@ngrx/store';
import * as SearchMovieActions from './search-movie.actions';
import {
  ErrorResponse,
  TVResult,
  TVDetail,
  MovieDetail,
  MovieResult,
} from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';

export interface SearchMovieState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}

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
  on(SearchMovieActions.searchAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
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
  on(SearchMovieActions.createUpdateDeleteMovieLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    SearchMovieActions.createUpdateDeleteMovieLifecycleSuccess,
    (state, { entityMovieLifeCycle, index }) => {
      let movieResultCl = JSON.parse(JSON.stringify({ ...state.movieResult }));
      if (entityMovieLifeCycle) {
        if (movieResultCl.results[index].id === entityMovieLifeCycle.movie_id) {
          movieResultCl.results[index].lifecycleId =
            entityMovieLifeCycle.lifecycle_id
              ? entityMovieLifeCycle.lifecycle_id
              : 0;
        } else {
          /*to-do problem, index not in synch with the actual object,
        do a binary search to find the movie id in all the objs of the state. If not found again, throw error
        */
        }
      }
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult: movieResultCl,
      };
    }
  ),
  on(SearchMovieActions.searchMovieFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
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

//movie
export const getMovieResult = (state: SearchMovieState) => state.movieResult;
export const getMovieDetail = (state: SearchMovieState) => state.movieDetail;
export const getMovieResultPage = (state: SearchMovieState) =>
  state.movieResult?.page ? state.movieResult.page : 0;
export const getMovieResultTotalPages = (state: SearchMovieState) =>
  state.movieResult?.total_pages ? state.movieResult.total_pages : 0;
