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
    (state): TVLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
      };
    }
  ),
  on(
    TVLifecycleActions.searchTVByLifecycleSubmit,
    (state, { payload }): TVLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
        payload,
      };
    }
  ),
  on(
    TVLifecycleActions.notifySearchTVByLifecycle,
    (state): TVLifecycleState => {
      return {
        ...state,
        updateSearch: true,
      };
    }
  ),
  on(
    TVLifecycleActions.createTVLifecycleSuccess,
    TVLifecycleActions.updateTVLifecycleSuccess,
    TVLifecycleActions.deleteTVLifecycleSuccess,
    TVLifecycleActions.unchangedTVLifecycleSuccess,
    TVLifecycleActions.populateTVLifecycleMapSuccess,
    (state, { tvLifecycleMap }): TVLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvLifecycleMap: { ...state.tvLifecycleMap, ...tvLifecycleMap },
      };
    }
  ),
  on(
    TVLifecycleActions.searchTVByLifecycleLandingSuccess,
    TVLifecycleActions.searchTVByLifecycleSubmitSuccess,
    (state, { tvList }): TVLifecycleState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvList,
      };
    }
  ),
  on(
    TVLifecycleActions.createTVLifecycleFailure,
    TVLifecycleActions.updateTVLifecycleFailure,
    TVLifecycleActions.deleteTVLifecycleFailure,
    TVLifecycleActions.unchangedTVLifecycleFailure,
    TVLifecycleActions.populateTVLifecycleMapFailure,
    TVLifecycleActions.searchTVByLifecycleSubmitFailure,
    TVLifecycleActions.searchTVByLifecycleLandingeFailure,
    TVLifecycleActions.createUpdateDeleteTVLifecycleFailure,
    (state, { httpErrorResponse }): TVLifecycleState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        tvLifecycleMap: { ...state.tvLifecycleMap }, //still update to push to the selector the prev value like is a next
      };
    }
  )
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
