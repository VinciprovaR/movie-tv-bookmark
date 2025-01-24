import { createReducer, on } from '@ngrx/store';
import { DiscoveryMovieState } from '../../../shared/interfaces/store/discovery-movie-state.interface';
import * as DiscoveryMovieActions from './discovery-movie.actions';

export const discoveryMovieFeatureKey = 'discovery-movie';

export const initialState: DiscoveryMovieState = {
  isLoading: false,
  payload: {
    genreIdList: [],
    sortBy: 'popularity.desc',
    releaseDate: { from: '', to: '' },
    includeMediaWithBookmark: true,
    certification: '',
    language: '',
    voteAverage: { voteAverageMin: 0, voteAverageMax: 10 },
    minVote: 0,
  },
  error: null,
  movieResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  noAdditional: false,
  isFirstLanding: true,
  infiniteScrollDisabled: true,
};

export const discoveryMovieReducer = createReducer(
  initialState,
  on(DiscoveryMovieActions.cleanState, (state): DiscoveryMovieState => {
    return {
      ...initialState,
    };
  }),
  on(DiscoveryMovieActions.resetFilters, (state): DiscoveryMovieState => {
    return {
      ...state,
      payload: {
        genreIdList: [],
        sortBy: 'popularity.desc',
        releaseDate: { from: '', to: '' },
        includeMediaWithBookmark: true,
        certification: '',
        language: '',
        voteAverage: { voteAverageMin: 0, voteAverageMax: 10 },
        minVote: 0,
      },
    };
  }),
  on(
    DiscoveryMovieActions.discoveryMovieLanding,
    (state): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryMovieLandingSuccess,
    (state, { movieResult }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult,
        noAdditional: false,
        isFirstLanding: false,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryAdditionalMovie,
    (state): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        infiniteScrollDisabled: false,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryMovie,
    (state, { payload }): DiscoveryMovieState => {
      return {
        ...state,
        payload,
        error: null,
        isLoading: true,
        infiniteScrollDisabled: false,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryMovieSuccess,
    (state, { movieResult }): DiscoveryMovieState => {
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
    DiscoveryMovieActions.discoveryAdditionalMovieSuccess,
    (state, { movieResult }): DiscoveryMovieState => {
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
  on(DiscoveryMovieActions.noAdditionalMovie, (state): DiscoveryMovieState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      noAdditional: true,
    };
  }),
  on(
    DiscoveryMovieActions.discoveryMovieFailure,
    DiscoveryMovieActions.discoveryAdditionaMovieFailure,
    DiscoveryMovieActions.discoveryMovieLandingFailure,
    (state, { httpErrorResponse }): DiscoveryMovieState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getDiscoveryMovieState = (state: DiscoveryMovieState) => state;
export const getIsLoading = (state: DiscoveryMovieState) => state.isLoading;
export const getPayload = (state: DiscoveryMovieState) => state.payload;
export const getDiscoveryMovieError = (state: DiscoveryMovieState) =>
  state.error;
export const getMovieResult = (state: DiscoveryMovieState) => state.movieResult;
export const getMovieList = (state: DiscoveryMovieState) =>
  state.movieResult.results;
export const getMovieResultPage = (state: DiscoveryMovieState) =>
  state.movieResult.page;
export const getMovieResultTotalPages = (state: DiscoveryMovieState) =>
  state.movieResult.total_pages;
export const getNoAdditional = (state: DiscoveryMovieState) =>
  state.noAdditional;
export const getIsFirstLanding = (state: DiscoveryMovieState) =>
  state.isFirstLanding;
export const getInfiniteScrollDisabled = (state: DiscoveryMovieState) =>
  state.infiniteScrollDisabled;
