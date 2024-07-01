import { createReducer, on } from '@ngrx/store';
import * as SearchTVActions from './search-tv.actions';
import { SearchTVState } from '../../models/store/search-tv-state.models';

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
  on(
    SearchTVActions.searchAdditionalTV,
    SearchTVActions.createUpdateDeleteTVLifecycle,
    (state) => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
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
  on(SearchTVActions.cleanTVDetail, (state) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      tvDetail: null,
    };
  }),

  on(
    SearchTVActions.createUpdateDeleteTVLifecycleSuccess,
    (state, { tv, index }) => {
      let tvResultClone = JSON.parse(JSON.stringify({ ...state.tvResult }));
      tvResultClone.results[index] = tv;
      return {
        ...state,
        error: null,
        isLoading: false,
        tvResult: tvResultClone,
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
export const getTVResult = (state: SearchTVState) => state.tvResult;
export const getTVDetail = (state: SearchTVState) => state.tvDetail;
export const getTVResultPage = (state: SearchTVState) =>
  state.tvResult?.page ? state.tvResult.page : 0;
export const getTVResultTotalPages = (state: SearchTVState) =>
  state.tvResult?.total_pages ? state.tvResult.total_pages : 0;
