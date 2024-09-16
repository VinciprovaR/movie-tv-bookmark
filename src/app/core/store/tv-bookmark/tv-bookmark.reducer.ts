import { createReducer, on } from '@ngrx/store';
import { TVBookmarkState } from '../../../shared/interfaces/store/tv-bookmark-state.interface';
import * as TVBookmarkActions from './tv-bookmark.actions';

export const tvBookmarkStateFeatureKey = 'tv-bookmark';

export const initialState: TVBookmarkState = {
  isLoading: false,
  error: null,
  tvBookmarkMap: {},
  tvList: [],
  updateSearch: false,
  payload: { genreIdList: [], sortBy: 'first_air_date.desc' },
};

export const tvBookmarkReducer = createReducer(
  initialState,
  on(TVBookmarkActions.cleanState, (state): TVBookmarkState => {
    return {
      ...initialState,
    };
  }),
  on(
    TVBookmarkActions.createUpdateDeleteTVBookmark,
    TVBookmarkActions.searchTVByBookmarkLanding,
    (state): TVBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
      };
    }
  ),
  on(
    TVBookmarkActions.searchTVByBookmarkSubmit,
    (state, { payload }): TVBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
        payload,
      };
    }
  ),
  on(TVBookmarkActions.updateSearchTVByBookmark, (state): TVBookmarkState => {
    return {
      ...state,
      updateSearch: true,
    };
  }),
  on(
    TVBookmarkActions.createTVBookmarkSuccess,
    TVBookmarkActions.updateTVBookmarkSuccess,
    TVBookmarkActions.deleteTVBookmarkSuccess,
    TVBookmarkActions.unchangedTVBookmarkSuccess,
    TVBookmarkActions.populateTVBookmarkMapSuccess,
    (state, { tvBookmarkMap }): TVBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvBookmarkMap: { ...state.tvBookmarkMap, ...tvBookmarkMap },
      };
    }
  ),
  on(
    TVBookmarkActions.searchTVByBookmarkLandingSuccess,
    TVBookmarkActions.searchTVByBookmarkSubmitSuccess,
    (state, { tvList }): TVBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tvList,
      };
    }
  ),
  on(
    TVBookmarkActions.createTVBookmarkFailure,
    TVBookmarkActions.updateTVBookmarkFailure,
    TVBookmarkActions.deleteTVBookmarkFailure,
    TVBookmarkActions.unchangedTVBookmarkFailure,
    TVBookmarkActions.populateTVBookmarkMapFailure,
    TVBookmarkActions.searchTVByBookmarkSubmitFailure,
    TVBookmarkActions.searchTVByBookmarkLandingeFailure,
    TVBookmarkActions.createUpdateDeleteTVBookmarkFailure,
    (state, { httpErrorResponse }): TVBookmarkState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        tvBookmarkMap: { ...state.tvBookmarkMap },
      };
    }
  )
);

export const getTVBookmarkState = (state: TVBookmarkState) => state;
export const getIsLoading = (state: TVBookmarkState) => state.isLoading;
export const getPayload = (state: TVBookmarkState) => state.payload;
export const getTVBookmarkMap = (state: TVBookmarkState) => state.tvBookmarkMap;
export const getSearchTVBookmarkError = (state: TVBookmarkState) => state.error;
export const getTVList = (state: TVBookmarkState) => state.tvList;
export const getUpdateSearch = (state: TVBookmarkState) => state.updateSearch;
