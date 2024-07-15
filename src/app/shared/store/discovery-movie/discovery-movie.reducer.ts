import { createReducer, on } from '@ngrx/store';
import * as DiscoveryMovieActions from './discovery-movie.actions';
import { DiscoveryMovieState } from '../../interfaces/store/discovery-movie-state.interface';

export const discoveryMovieFeatureKey = 'discovery-movie';

export const initialState: DiscoveryMovieState = {
  isLoading: false,
  payload: {
    genreIdList: [],
    sortBy: 'popularity.desc',
    releaseDate: { from: '', to: '' },
    includeMediaWithLifecycle: false,
    certification: '',
    language: '',
    voteAverage: { voteAverageMin: 0, voteAverageMax: 10 },
  },
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
  on(
    DiscoveryMovieActions.getGenreList,
    DiscoveryMovieActions.getCertificationList,
    DiscoveryMovieActions.discoveryAdditionalMovie,
    DiscoveryMovieActions.getLanguagesList,
    (state): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: true,
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
      };
    }
  ),
  on(DiscoveryMovieActions.noAdditionalMovie, (state): DiscoveryMovieState => {
    return {
      ...state,
      error: null,
      isLoading: false,
    };
  }),
  on(
    DiscoveryMovieActions.discoveryMovieDetail,
    (state): DiscoveryMovieState => {
      return {
        ...state,
        movieDetail: null,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    DiscoveryMovieActions.discoveryMovieDetailSuccess,
    (state, { movieDetail }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieDetail,
      };
    }
  ),
  on(DiscoveryMovieActions.cleanMovieDetail, (state): DiscoveryMovieState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      movieDetail: null,
    };
  }),

  on(
    DiscoveryMovieActions.discoveryMovieFailure,
    (state, { httpErrorResponse }): DiscoveryMovieState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  ),
  on(DiscoveryMovieActions.cleanError, (state): DiscoveryMovieState => {
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
export const getMovieResult = (state: DiscoveryMovieState) => state.movieResult;
export const getMovieList = (state: DiscoveryMovieState) =>
  state.movieResult.results;
export const getMovieDetail = (state: DiscoveryMovieState) => state.movieDetail;
export const getMovieResultPage = (state: DiscoveryMovieState) =>
  state.movieResult.page;
export const getMovieResultTotalPages = (state: DiscoveryMovieState) =>
  state.movieResult.total_pages;
