import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as TVLifecycleReducer from './tv-lifecycle.reducer';
import { TVLifecycleState } from '../../models/store/tv-lifecycle-state.models';

const TVLifecycleFeatureSelector = createFeatureSelector<TVLifecycleState>(
  TVLifecycleReducer.tvLifecycleStateFeatureKey
);

export const selectTVLifecycle = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getTVLifecycleState
);

export const selectIsLoading = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getIsLoading
);

export const selectTVLifecycleMap = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getTVLifecycleMap
);
