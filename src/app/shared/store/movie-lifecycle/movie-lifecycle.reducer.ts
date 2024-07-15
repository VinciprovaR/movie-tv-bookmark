import { createReducer, on } from '@ngrx/store';
import * as MovieLifecycleActions from './movie-lifecycle.actions';
import { MovieLifecycleState } from '../../interfaces/store/movie-lifecycle-state.interface';

export const movieLifecycleStateFeatureKey = 'movie-lifecycle';

export const initialState: MovieLifecycleState = {
  isLoading: false,
  error: null,
  movieLifecycleMap: {},
  movieList: [],
  updateSearch: false,
  payload: {
    genreIdList: [],
    sortBy: 'primary_release_date.desc',
  },
};

export const movieLifecycleReducer = createReducer(
  initialState,
  on(
    MovieLifecycleActions.createUpdateDeleteMovieLifecycle,
    MovieLifecycleActions.searchMovieByLifecycleLanding,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
      };
    }
  ),
  on(
    MovieLifecycleActions.searchMovieByLifecycleSubmit,
    (state, { payload }) => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
        payload,
      };
    }
  ),
  on(MovieLifecycleActions.updateSearchMovieByLifecycle, (state) => {
    return {
      ...state,
      updateSearch: true,
    };
  }),
  on(
    MovieLifecycleActions.createUpdateDeleteMovieLifecycleSuccess,
    MovieLifecycleActions.initMovieLifecycleSuccess,
    (state, { movieLifecycleMap }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieLifecycleMap: { ...state.movieLifecycleMap, ...movieLifecycleMap },
      };
    }
  ),
  on(
    MovieLifecycleActions.searchMovieByLifecycleSuccess,
    (state, { movieList }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieList,
      };
    }
  ),
  on(MovieLifecycleActions.lifecycleFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
      movieLifecycleMap: { ...state.movieLifecycleMap },
    };
  }),
  on(MovieLifecycleActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getMovieLifecycleState = (state: MovieLifecycleState) => state;
export const getIsLoading = (state: MovieLifecycleState) => state.isLoading;
export const getPayload = (state: MovieLifecycleState) => state.payload;
export const getMovieLifecycleMap = (state: MovieLifecycleState) =>
  state.movieLifecycleMap;
export const getSearchMovieLifecycleError = (state: MovieLifecycleState) =>
  state.error;
export const getMovieList = (state: MovieLifecycleState) => state.movieList;
export const getUpdateSearch = (state: MovieLifecycleState) =>
  state.updateSearch;
