import { createReducer, on } from '@ngrx/store';
import * as TVLifecycleActions from './tv-lifecycle.actions';
import { TVLifecycleState } from '../../models/store/tv-lifecycle-state.models';

export const tvLifecycleStateFeatureKey = 'tv-lifecycle';

export const initialState: TVLifecycleState = {
  isLoading: false,
  error: null,
  tvLifecycleMap: { type: 'tv' },
};

export const tvLifecycleReducer = createReducer(
  initialState,
  on(TVLifecycleActions.createUpdateDeleteTVLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    TVLifecycleActions.createUpdateDeleteTVLifecycleSuccess,
    TVLifecycleActions.initTVLifecycleSuccess,
    (state, { tvLifecycleMap }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvLifecycleMap,
      };
    }
  ),
  on(TVLifecycleActions.lifecycleFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
    };
  }),
  on(TVLifecycleActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getTVLifecycleState = (state: TVLifecycleState) => state;
export const getIsLoading = (state: TVLifecycleState) => state.isLoading;
export const getTVLifecycleMap = (state: TVLifecycleState) =>
  state.tvLifecycleMap;
export const getSearchTVLifecycleError = (state: TVLifecycleState) =>
  state.error;
