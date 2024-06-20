import { createReducer, on } from '@ngrx/store';
import * as SearchMovieActions from './search-movie.actions';
import { MovieResult, SearchMovieState } from '../../models/movie.models';

export const searchMovieFeatureKey = 'search-movie';

export const initialState: SearchMovieState = {
  isLoading: false,
  query: '',
  error: null,
  movieResult: { page: 1, results: [], total_pages: 1, total_results: 0 },
  movieDetail: null,
  broadcastChannel: false,
  lifecycleEnum: [],
};

export const searchMovieReducer = createReducer(
  initialState,
  on(SearchMovieActions.searchMovie, (state, { query }) => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMovieActions.searchAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMovieActions.searchMovieSuccess, (state, { movieResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieResult,
      broadcastChannel: true,
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
  on(
    SearchMovieActions.createOrUpdateOrDeleteMovieLifecycleLifecycle,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
        broadcastChannel: true,
      };
    }
  ),
  on(
    SearchMovieActions.createOrUpdateOrDeleteMovieLifecycleSuccess,
    (state, { movieLifeCycleResultDB, index }) => {
      let movieState;

      let movieResultCl = JSON.parse(JSON.stringify({ ...state.movieResult }));
      if (movieLifeCycleResultDB) {
        if (
          movieResultCl.results[index].id === movieLifeCycleResultDB.movie_id
        ) {
          movieResultCl.results[index].lifeCycleId =
            movieLifeCycleResultDB.lifecycle_id
              ? movieLifeCycleResultDB.lifecycle_id
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
        broadcastChannel: true,
      };
    }
  ),
  on(SearchMovieActions.searchMovieDetail, (state) => {
    return {
      ...state,
      movieDetail: null,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMovieActions.searchMovieDetailSuccess, (state, { movieDetail }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieDetail,
      broadcastChannel: true,
    };
  }),
  on(SearchMovieActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
      broadcastChannel: true,
    };
  }),
  on(SearchMovieActions.getMediaLifecycleEnum, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    SearchMovieActions.getMediaLifecycleEnumSuccess,
    (state, { lifecycleEnum }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        lifecycleEnum,
      };
    }
  )
);
export const getSearchMovieState = (state: SearchMovieState) => state;
export const getIsLoading = (state: SearchMovieState) => state.isLoading;
export const getMovieResult = (state: SearchMovieState) => state.movieResult;
export const getMovieDetail = (state: SearchMovieState) => state.movieDetail;
export const getQuery = (state: SearchMovieState) => state.query;
export const getMovieResultPage = (state: SearchMovieState) =>
  state.movieResult?.page ? state.movieResult.page : 0;
export const getMovieResultTotalPages = (state: SearchMovieState) =>
  state.movieResult?.total_pages ? state.movieResult.total_pages : 0;
export const getLifecycleEnum = (state: SearchMovieState) =>
  state.lifecycleEnum;
export const getSearchMovieError = (state: SearchMovieState) => state.error;
