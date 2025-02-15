import { createReducer, on } from '@ngrx/store';
import { DiscoveryTVState } from '../../../shared/interfaces/store/discovery-tv-state.interface';
import * as DiscoveryTVActions from './discovery-tv.actions';

export const discoveryTVFeatureKey = 'discovery-tv';

export const initialState: DiscoveryTVState = {
  isLoading: false,
  payload: {
    genreIdList: [],
    sortBy: 'popularity.desc',
    airDate: { from: '', to: '' },
    includeMediaWithBookmark: true,
    language: '',
    voteAverage: { voteAverageMin: 0, voteAverageMax: 10 },
    minVote: 0,
    allEpisode: true,
  },
  error: null,
  tvResult: {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  },
  noAdditional: false,
  isfirstLanding: true,
  infiniteScrollDisabled: true,
};

export const discoveryTVReducer = createReducer(
  initialState,
  on(DiscoveryTVActions.cleanState, (state): DiscoveryTVState => {
    return {
      ...initialState,
    };
  }),
  on(DiscoveryTVActions.resetFilters, (state): DiscoveryTVState => {
    return {
      ...state,
      payload: {
        genreIdList: [],
        sortBy: 'popularity.desc',
        airDate: { from: '', to: '' },
        includeMediaWithBookmark: true,
        language: '',
        voteAverage: { voteAverageMin: 0, voteAverageMax: 10 },
        minVote: 0,
        allEpisode: true,
      },
    };
  }),
  on(DiscoveryTVActions.discoveryTVLanding, (state): DiscoveryTVState => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    DiscoveryTVActions.discoveryTVLandingSuccess,
    (state, { tvResult }): DiscoveryTVState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvResult,
        noAdditional: false,
        isfirstLanding: false,
      };
    }
  ),
  on(DiscoveryTVActions.discoveryAdditionalTV, (state): DiscoveryTVState => {
    return {
      ...state,
      error: null,
      isLoading: true,
      infiniteScrollDisabled: false,
    };
  }),
  on(DiscoveryTVActions.discoveryTV, (state, { payload }): DiscoveryTVState => {
    return {
      ...state,
      payload,
      error: null,
      isLoading: true,
      infiniteScrollDisabled: false,
    };
  }),
  on(
    DiscoveryTVActions.discoveryTVSuccess,
    (state, { tvResult }): DiscoveryTVState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvResult,
        noAdditional: false,
      };
    }
  ),
  on(
    DiscoveryTVActions.discoveryAdditionalTVSuccess,
    (state, { tvResult }): DiscoveryTVState => {
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
  on(DiscoveryTVActions.noAdditionalTV, (state): DiscoveryTVState => {
    return {
      ...state,
      error: null,
      isLoading: false,
      noAdditional: true,
    };
  }),
  on(
    DiscoveryTVActions.discoveryTVFailure,
    DiscoveryTVActions.discoveryAdditionaTVFailure,
    DiscoveryTVActions.discoveryTVLandingFailure,
    (state, { httpErrorResponse }): DiscoveryTVState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  )
);

export const getDiscoveryTVState = (state: DiscoveryTVState) => state;
export const getIsLoading = (state: DiscoveryTVState) => state.isLoading;
export const getPayload = (state: DiscoveryTVState) => state.payload;
export const getDiscoveryTVError = (state: DiscoveryTVState) => state.error;
export const getTVResult = (state: DiscoveryTVState) => state.tvResult;
export const getTVList = (state: DiscoveryTVState) => state.tvResult.results;
export const getTVResultPage = (state: DiscoveryTVState) => state.tvResult.page;
export const getTVResultTotalPages = (state: DiscoveryTVState) =>
  state.tvResult.total_pages;
export const getNoAdditional = (state: DiscoveryTVState) => state.noAdditional;
export const getIsFirstLanding = (state: DiscoveryTVState) =>
  state.isfirstLanding;
export const getInfiniteScrollDisabled = (state: DiscoveryTVState) =>
  state.infiniteScrollDisabled;
