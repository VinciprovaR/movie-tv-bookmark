import { createReducer, on } from '@ngrx/store';
import * as DiscoveryMovieActions from './discovery-movie.actions';
import {
  ErrorResponse,
  TVResult,
  TVDetail,
  MovieDetail,
  MovieResult,
} from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';

export interface DiscoveryMovieState {
  isLoading: boolean;
  payload: any;
  error: ErrorResponse | null;
  movieResult: MovieResult;
  movieDetail: MovieDetail | null;
}

export const discoveryMovieFeatureKey = 'discovery-movie';

export const initialState: DiscoveryMovieState = {
  isLoading: false,
  payload: {},
  error: null,
  movieResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  movieDetail: null,
};

export const discoveryMovieReducer = createReducer(
  initialState,
  on(DiscoveryMovieActions.discoveryMovie, (state, { payload }) => {
    return {
      ...state,
      payload,
      error: null,
      isLoading: true,
    };
  }),
  on(DiscoveryMovieActions.discoveryMovieSuccess, (state, { movieResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieResult,
    };
  }),
  on(DiscoveryMovieActions.discoveryAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    DiscoveryMovieActions.discoveryAdditionalMovieSuccess,
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
  on(DiscoveryMovieActions.noAdditionalMovie, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
    };
  }),
  on(DiscoveryMovieActions.discoveryMovieDetail, (state) => {
    return {
      ...state,
      movieDetail: null,
      error: null,
      isLoading: true,
    };
  }),
  on(
    DiscoveryMovieActions.discoveryMovieDetailSuccess,
    (state, { movieDetail }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieDetail,
      };
    }
  ),
  on(DiscoveryMovieActions.cleanMovieDetail, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieDetail: null,
    };
  }),
  on(DiscoveryMovieActions.createUpdateDeleteMovieLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    DiscoveryMovieActions.createUpdateDeleteMovieLifecycleSuccess,
    (state, { movieResult }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryMovieFailure,
    (state, { httpErrorResponse }) => {
      return {
        ...state,
        error: httpErrorResponse,
      };
    }
  ),
  on(DiscoveryMovieActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getDiscoveryMovieState = (state: DiscoveryMovieState) => state;
export const getIsLoading = (state: DiscoveryMovieState) => state.isLoading;
export const getPayload = (state: DiscoveryMovieState) => state.payload;
export const getDiscoveryMovieError = (state: DiscoveryMovieState) =>
  state.error;

//movie
export const getMovieResult = (state: DiscoveryMovieState) => state.movieResult;
export const getMovieDetail = (state: DiscoveryMovieState) => state.movieDetail;
export const getMovieResultPage = (state: DiscoveryMovieState) =>
  state.movieResult?.page ? state.movieResult.page : 0;
export const getMovieResultTotalPages = (state: DiscoveryMovieState) =>
  state.movieResult?.total_pages ? state.movieResult.total_pages : 0;
