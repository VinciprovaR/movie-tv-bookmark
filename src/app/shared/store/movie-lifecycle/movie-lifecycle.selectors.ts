import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as MovieLifecycleReducer from './movie-lifecycle.reducer';
import { MovieLifecycleState } from '../../interfaces/store/movie-lifecycle-state.interface';

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
