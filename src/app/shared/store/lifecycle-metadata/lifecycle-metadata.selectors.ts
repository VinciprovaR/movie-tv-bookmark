import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LifecycleMetadataState } from '../../interfaces/store/lifecycle-metadata-state.interface';
import { LifecycleMetadataReducers } from '.';

const LifecycleMetadataFeatureSelector =
  createFeatureSelector<LifecycleMetadataState>(
    LifecycleMetadataReducers.lifecycleMetadataStateFeatureKey
  );

export const selectLifecycleOptions = createSelector(
  LifecycleMetadataFeatureSelector,
  LifecycleMetadataReducers.getLifecycleOptions
);

export const selectIsLoading = createSelector(
  LifecycleMetadataFeatureSelector,
  LifecycleMetadataReducers.getIsLoading
);

export const selectLifecycleTypeIdMap = createSelector(
  LifecycleMetadataFeatureSelector,
  LifecycleMetadataReducers.getLifecycleTypeIdMap
);

export const selectLifecycleMetadataError = createSelector(
  LifecycleMetadataFeatureSelector,
  LifecycleMetadataReducers.getLifecycleMetadataError
);
