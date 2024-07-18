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
    (state): MovieLifecycleState => {
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
    (state, { payload }): MovieLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
        payload,
      };
    }
  ),
  on(
    MovieLifecycleActions.notifySearchMovieByLifecycle,
    (state): MovieLifecycleState => {
      return {
        ...state,
        updateSearch: true,
      };
    }
  ),
  on(
    MovieLifecycleActions.createMovieLifecycleSuccess,
    MovieLifecycleActions.updateMovieLifecycleSuccess,
    MovieLifecycleActions.deleteMovieLifecycleSuccess,
    MovieLifecycleActions.unchangedMovieLifecycleSuccess,
    MovieLifecycleActions.populateMovieLifecycleMapSuccess,
    (state, { movieLifecycleMap }): MovieLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieLifecycleMap: { ...state.movieLifecycleMap, ...movieLifecycleMap },
      };
    }
  ),
  on(
    MovieLifecycleActions.searchMovieByLifecycleLandingSuccess,
    MovieLifecycleActions.searchMovieByLifecycleSubmitSuccess,
    (state, { movieList }): MovieLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieList,
      };
    }
  ),
  on(
    MovieLifecycleActions.createMovieLifecycleFailure,
    MovieLifecycleActions.updateMovieLifecycleFailure,
    MovieLifecycleActions.deleteMovieLifecycleFailure,
    MovieLifecycleActions.unchangedMovieLifecycleFailure,
    MovieLifecycleActions.populateMovieLifecycleMapFailure,
    MovieLifecycleActions.searchMovieByLifecycleSubmitFailure,
    MovieLifecycleActions.searchMovieByLifecycleLandingeFailure,
    MovieLifecycleActions.createUpdateDeleteMovieLifecycleFailure,
    (state, { httpErrorResponse }): MovieLifecycleState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        movieLifecycleMap: { ...state.movieLifecycleMap }, //still update to push to the selector the prev value like is a next
      };
    }
  )
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
