import { createReducer, on } from '@ngrx/store';
import * as TVLifecycleActions from './tv-lifecycle.actions';
import { TVLifecycleState } from '../../interfaces/store/tv-lifecycle-state.interface';

export const tvLifecycleStateFeatureKey = 'tv-lifecycle';

export const initialState: TVLifecycleState = {
  isLoading: false,
  error: null,
  tvLifecycleMap: {},
  tvList: [],
  updateSearch: false,
  payload: { genreIdList: [], sortBy: 'first_air_date.desc' },
};

export const tvLifecycleReducer = createReducer(
  initialState,
  on(
    TVLifecycleActions.createUpdateDeleteTVLifecycle,
    TVLifecycleActions.searchTVByLifecycleLanding,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
      };
    }
  ),
  on(TVLifecycleActions.searchTVByLifecycleSubmit, (state, { payload }) => {
    return {
      ...state,
      error: null,
      isLoading: true,
      updateSearch: false,
      payload,
    };
  }),
  on(TVLifecycleActions.updateSearchTVByLifecycle, (state) => {
    return {
      ...state,
      updateSearch: true,
    };
  }),
  on(
    TVLifecycleActions.createTVLifecycleSuccess,
    TVLifecycleActions.updateTVLifecycleSuccess,
    TVLifecycleActions.deleteTVLifecycleSuccess,
    TVLifecycleActions.unchangedTVLifecycleSuccess,
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
  on(TVLifecycleActions.searchTVByLifecycleSuccess, (state, { tvList }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      tvList,
    };
  }),
  on(
    TVLifecycleActions.lifecycleFailure,
    TVLifecycleActions.createTVLifecycleFailure,
    TVLifecycleActions.updateTVLifecycleFailure,
    TVLifecycleActions.deleteTVLifecycleFailure,
    TVLifecycleActions.unchangedTVLifecycleFailure,
    (state, { httpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        tvLifecycleMap: { ...state.tvLifecycleMap },
      };
    }
  ),
  on(TVLifecycleActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getTVLifecycleState = (state: TVLifecycleState) => state;
export const getIsLoading = (state: TVLifecycleState) => state.isLoading;
export const getPayload = (state: TVLifecycleState) => state.payload;
export const getTVLifecycleMap = (state: TVLifecycleState) =>
  state.tvLifecycleMap;
export const getSearchTVLifecycleError = (state: TVLifecycleState) =>
  state.error;
export const getTVList = (state: TVLifecycleState) => state.tvList;
export const getUpdateSearch = (state: TVLifecycleState) => state.updateSearch;
