import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as LifecycleEnumReducer from './lifecycle.reducer';
import { LifecycleEnumState } from './lifecycle.reducer';

const lifecycleEnumFeatureSelector = createFeatureSelector<LifecycleEnumState>(
  LifecycleEnumReducer.lifecycleEnumFeatureKey
);

export const selectMovieLifecycleEnum = createSelector(
  lifecycleEnumFeatureSelector,
  LifecycleEnumReducer.getLifecycleEnum
);

export const selectError = createSelector(
  lifecycleEnumFeatureSelector,
  LifecycleEnumReducer.getlifecycleEnumError
);
