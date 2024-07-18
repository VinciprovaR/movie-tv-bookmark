import { createReducer, on } from '@ngrx/store';

import { LifecycleMetadataState } from '../../interfaces/store/lifecycle-metadata-state.interface';
import { LifecycleMetadataActions } from '.';

export const lifecycleMetadataStateFeatureKey = 'lifecycle-metadata';

export const initialState: LifecycleMetadataState = {
  isLoading: false,
  error: null,
  lifecycleOptions: [],
  lifecycleTypeIdMap: {},
};

export const LifecycleMetadataReducer = createReducer(
  initialState,
  on(
    LifecycleMetadataActions.retriveLifecycleMetadata,
    (state): LifecycleMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    LifecycleMetadataActions.retriveLifecycleMetadataSuccess,
    (
      state,
      { lifecycleOptions, lifecycleTypeIdMap }
    ): LifecycleMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        lifecycleOptions,
        lifecycleTypeIdMap,
      };
    }
  ),
  on(
    LifecycleMetadataActions.lifecycleMetadataFailure,
    (state, { httpErrorResponse }): LifecycleMetadataState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getLifecycleMetadataState = (state: LifecycleMetadataState) =>
  state;
export const getIsLoading = (state: LifecycleMetadataState) => state.isLoading;
export const getLifecycleOptions = (state: LifecycleMetadataState) =>
  state.lifecycleOptions;
export const getLifecycleTypeIdMap = (state: LifecycleMetadataState) =>
  state.lifecycleTypeIdMap;
export const getLifecycleMetadataError = (state: LifecycleMetadataState) =>
  state.error;
