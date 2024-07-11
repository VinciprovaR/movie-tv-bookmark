import { createReducer, on } from '@ngrx/store';
import * as TVLifecycleActions from './tv-lifecycle.actions';
import { TVLifecycleState } from '../../interfaces/store/tv-lifecycle-state.interface';

export const tvLifecycleStateFeatureKey = 'tv-lifecycle';

export const initialState: TVLifecycleState = {
  isLoading: false,
  error: null,

  tvLifecycleMap: {},
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
        tvLifecycleMap: { ...state.tvLifecycleMap, ...tvLifecycleMap },
      };
    }
  ),
  on(TVLifecycleActions.lifecycleFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      isLoading: false,
      error: httpErrorResponse,
      tvLifecycleMap: { ...state.tvLifecycleMap },
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
