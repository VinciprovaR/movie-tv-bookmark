import { createReducer, on } from '@ngrx/store';
import * as MovieLifecycleActions from './movie-lifecycle.actions';
import { MovieLifecycleState } from '../../interfaces/store/movie-lifecycle-state.interface';

export const movieLifecycleStateFeatureKey = 'movie-lifecycle';

export const initialState: MovieLifecycleState = {
  isLoading: false,
  error: null,
  movieLifecycleMap: { type: 'movie' },
};

export const movieLifecycleReducer = createReducer(
  initialState,
  on(MovieLifecycleActions.createUpdateDeleteMovieLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
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
        movieLifecycleMap,
      };
    }
  ),
  on(MovieLifecycleActions.lifecycleFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
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
export const getMovieLifecycleMap = (state: MovieLifecycleState) =>
  state.movieLifecycleMap;
export const getSearchMovieLifecycleError = (state: MovieLifecycleState) =>
  state.error;
