import { createReducer, on } from '@ngrx/store';
import * as DiscoveryMovieActions from './discovery-movie.actions';
import { DiscoveryMovieState } from '../../models/store/discovery-movie-state.models';

export const discoveryMovieFeatureKey = 'discovery-movie';

export const initialState: DiscoveryMovieState = {
  isLoading: false,
  payload: {
    genreIdList: [],
    sortBy: 'popularity.desc',
    releaseDate: { from: '', to: '' },
    includeLifecycle: false,
  },
  error: null,
  movieResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  peopleResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  movieDetail: null,
  genreList: [],
};

export const discoveryMovieReducer = createReducer(
  initialState,
  on(
    DiscoveryMovieActions.discoveryAdditionalMovie,
    DiscoveryMovieActions.createUpdateDeleteMovieLifecycle,
    DiscoveryMovieActions.searchAdditionalPeople,
    DiscoveryMovieActions.searchPeople,
    DiscoveryMovieActions.getGenreList,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(DiscoveryMovieActions.getGenreListSuccess, (state, { genreList }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      genreList,
    };
  }),
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
  on(DiscoveryMovieActions.searchPeopleSuccess, (state, { peopleResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      peopleResult,
    };
  }),
  on(
    DiscoveryMovieActions.searchAdditionalPeopleSuccess,
    (state, { peopleResult }) => {
      let currpeople = state.peopleResult?.results
        ? state.peopleResult.results
        : [];
      let nextPeople = peopleResult?.results ? peopleResult.results : [];
      return {
        ...state,
        error: null,
        isLoading: false,
        peopleResult: {
          page: peopleResult?.page ? peopleResult.page : 0,
          total_pages: peopleResult?.total_pages ? peopleResult.total_pages : 0,
          total_results: peopleResult?.total_results
            ? peopleResult.total_results
            : 0,
          results: [...currpeople, ...nextPeople],
        },
      };
    }
  ),
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
  on(
    DiscoveryMovieActions.noAdditionalMovie,
    DiscoveryMovieActions.noAdditionalPeople,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: false,
      };
    }
  ),
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
  on(
    DiscoveryMovieActions.createUpdateDeleteMovieLifecycleSuccess,
    (state, { movie, index }) => {
      let movieResultClone = JSON.parse(
        JSON.stringify({ ...state.movieResult })
      );
      movieResultClone.results[index] = movie;
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult: movieResultClone,
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
export const getGenreList = (state: DiscoveryMovieState) => state.genreList;
export const getIsLoading = (state: DiscoveryMovieState) => state.isLoading;
export const getPayload = (state: DiscoveryMovieState) => state.payload;
export const getDiscoveryMovieError = (state: DiscoveryMovieState) =>
  state.error;
export const getMovieResult = (state: DiscoveryMovieState) => state.movieResult;
export const getMovieDetail = (state: DiscoveryMovieState) => state.movieDetail;
export const getMovieResultPage = (state: DiscoveryMovieState) =>
  state.movieResult?.page ? state.movieResult.page : 0;
export const getMovieResultTotalPages = (state: DiscoveryMovieState) =>
  state.movieResult?.total_pages ? state.movieResult.total_pages : 0;
