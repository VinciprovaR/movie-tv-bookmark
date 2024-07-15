import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as TVLifecycleReducer from './tv-lifecycle.reducer';
import { TVLifecycleState } from '../../interfaces/store/tv-lifecycle-state.interface';

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

export const selectTVList = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getTVList
);

export const selectUpdateSearch = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getUpdateSearch
);

export const selectTVLifecycleError = createSelector(
  TVLifecycleFeatureSelector,
  TVLifecycleReducer.getSearchTVLifecycleError
);
