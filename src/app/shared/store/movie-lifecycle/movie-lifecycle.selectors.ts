import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as MovieLifecycleReducer from './movie-lifecycle.reducer';
import { MovieLifecycleState } from '../../interfaces/store/movie-lifecycle-state.interface';
import { selectTVLifecycleMap } from '../tv-lifecycle/tv-lifecycle.selectors';

const MovieLifecycleFeatureSelector =
  createFeatureSelector<MovieLifecycleState>(
    MovieLifecycleReducer.movieLifecycleStateFeatureKey
  );

export const selectMovieLifecycle = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getMovieLifecycleState
);

export const selectIsLoading = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getIsLoading
);

export const selectPayload = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getPayload
);

export const selectMovieLifecycleMap = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getMovieLifecycleMap
);

export const selectMovieList = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getMovieList
);

export const selectUpdateSearch = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getUpdateSearch
);

export const selectMovieLifecycleError = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getSearchMovieLifecycleError
);
