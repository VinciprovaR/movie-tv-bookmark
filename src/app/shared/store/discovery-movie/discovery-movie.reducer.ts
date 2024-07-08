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
  peopleResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  movieDetail: null,
  genreList: [],
  certificationList: [],
  languageList: [],
};

export const discoveryMovieReducer = createReducer(
  initialState,
  on(
    DiscoveryMovieActions.searchAdditionalPeople,
    DiscoveryMovieActions.searchPeople,
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
    DiscoveryMovieActions.getGenreListSuccess,
    (state, { genreList }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        genreList,
      };
    }
  ),
  on(
    DiscoveryMovieActions.getCertificationListSuccess,
    (state, { certificationList }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        certificationList,
      };
    }
  ),
  on(
    DiscoveryMovieActions.getLanguagesListSuccess,
    (state, { languageList }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        languageList,
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
    DiscoveryMovieActions.searchPeopleSuccess,
    (state, { peopleResult }): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        peopleResult,
      };
    }
  ),
  on(
    DiscoveryMovieActions.searchAdditionalPeopleSuccess,
    (state, { peopleResult }): DiscoveryMovieState => {
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
  on(
    DiscoveryMovieActions.noAdditionalMovie,
    DiscoveryMovieActions.noAdditionalPeople,
    (state): DiscoveryMovieState => {
      return {
        ...state,
        error: null,
        isLoading: false,
      };
    }
  ),
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
export const getGenreList = (state: DiscoveryMovieState) => state.genreList;
export const getLanguageList = (state: DiscoveryMovieState) =>
  state.languageList;
export const getCertificationList = (state: DiscoveryMovieState) =>
  state.certificationList;
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
