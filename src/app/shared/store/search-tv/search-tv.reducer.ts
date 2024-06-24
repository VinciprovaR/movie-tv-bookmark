import { createReducer, on } from '@ngrx/store';
import * as SearchTVActions from './search-tv.actions';
import { ErrorResponse, TVResult, TVDetail } from '../../models';

export interface SearchTVState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  tvResult: TVResult;
  tvDetail: TVDetail | null;
}

export const searchTVFeatureKey = 'search-tv';

export const initialState: SearchTVState = {
  isLoading: false,
  query: '',
  error: null,
  tvResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  tvDetail: null,
};

export const searchTVReducer = createReducer(
  initialState,
  on(SearchTVActions.searchTV, (state, { query }) => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchTVActions.searchTVSuccess, (state, { tvResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      tvResult,
    };
  }),
  on(SearchTVActions.searchAdditionalTV, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchTVActions.searchAdditionalTVSuccess, (state, { tvResult }) => {
    let currTVs = state.tvResult?.results ? state.tvResult.results : [];
    let nextTVs = tvResult?.results ? tvResult.results : [];
    return {
      ...state,
      error: null,
      isLoading: false,
      tvResult: {
        page: tvResult?.page ? tvResult.page : 0,
        total_pages: tvResult?.total_pages ? tvResult.total_pages : 0,
        total_results: tvResult?.total_results ? tvResult.total_results : 0,
        results: [...currTVs, ...nextTVs],
      },
    };
  }),
  on(SearchTVActions.noAdditionalTV, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
    };
  }),
  on(SearchTVActions.searchTVDetail, (state) => {
    return {
      ...state,
      tvDetail: null,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchTVActions.searchTVDetailSuccess, (state, { tvDetail }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      tvDetail,
    };
  }),
  on(SearchTVActions.createUpdateDeleteTVLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    SearchTVActions.createUpdateDeleteTVLifecycleSuccess,
    (state, { entityTVLifeCycle, index }) => {
      let tvResultCl = JSON.parse(JSON.stringify({ ...state.tvResult }));
      if (entityTVLifeCycle) {
        if (tvResultCl.results[index].id === entityTVLifeCycle.tv_id) {
          tvResultCl.results[index].lifecycleId = entityTVLifeCycle.lifecycle_id
            ? entityTVLifeCycle.lifecycle_id
            : 0;
        } else {
          /*to-do problem, index not in synch with the actual object,
        do a binary search to find the tv id in all the objs of the state. If not found again, throw error
        */
        }
      }
      return {
        ...state,
        error: null,
        isLoading: false,
        tvResult: tvResultCl,
      };
    }
  ),
  on(SearchTVActions.searchTVFailure, (state, { httpErrorResponse }) => {
    return {
      ...state,
      error: httpErrorResponse,
    };
  }),
  on(SearchTVActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getSearchTVState = (state: SearchTVState) => state;
export const getIsLoading = (state: SearchTVState) => state.isLoading;
export const getQuery = (state: SearchTVState) => state.query;
export const getSearchTVError = (state: SearchTVState) => state.error;

//tv
export const getTVResult = (state: SearchTVState) => state.tvResult;
export const getTVDetail = (state: SearchTVState) => state.tvDetail;
export const getTVResultPage = (state: SearchTVState) =>
  state.tvResult?.page ? state.tvResult.page : 0;
export const getTVResultTotalPages = (state: SearchTVState) =>
  state.tvResult?.total_pages ? state.tvResult.total_pages : 0;
