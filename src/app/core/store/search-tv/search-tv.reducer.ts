import { createReducer, on } from '@ngrx/store';
import { SearchTVState } from '../../../shared/interfaces/store/search-tv-state.interface';
import * as SearchTVActions from './search-tv.actions';

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
  noAdditional: false,
};

export const searchTVReducer = createReducer(
  initialState,
  on(SearchTVActions.cleanState, (state): SearchTVState => {
    return {
      ...initialState,
    };
  }),
  on(SearchTVActions.searchAdditionalTV, (state): SearchTVState => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),

  on(SearchTVActions.searchTV, (state, { query }): SearchTVState => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
    };
  }),
  on(SearchTVActions.searchTVSuccess, (state, { tvResult }): SearchTVState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      tvResult,
      noAdditional: false,
    };
  }),
  on(
    SearchTVActions.searchAdditionalTVSuccess,
    (state, { tvResult }): SearchTVState => {
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
        noAdditional: false,
      };
    }
  ),
  on(SearchTVActions.noAdditionalTV, (state): SearchTVState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      noAdditional: true,
    };
  }),

  on(
    SearchTVActions.searchTVFailure,
    SearchTVActions.searchAdditionalTVFailure,
    (state, { httpErrorResponse }): SearchTVState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getSearchTVState = (state: SearchTVState) => state;
export const getIsLoading = (state: SearchTVState) => state.isLoading;
export const getQuery = (state: SearchTVState) => state.query;
export const getSearchTVError = (state: SearchTVState) => state.error;
export const getTVResult = (state: SearchTVState) => state.tvResult;
export const getTVList = (state: SearchTVState) => state.tvResult.results;
export const getTVResultPage = (state: SearchTVState) => state.tvResult.page;

export const getTVResultTotalPages = (state: SearchTVState) =>
  state.tvResult.total_pages;
export const getNoAdditional = (state: SearchTVState) => state.noAdditional;
