import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as MovieLifecycleReducer from './movie-lifecycle.reducer';
import { MovieLifecycleState } from '../../models/store/movie-lifecycle-state.models';

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

export const selectMovieLifecycleMap = createSelector(
  MovieLifecycleFeatureSelector,
  MovieLifecycleReducer.getMovieLifecycleMap
);
