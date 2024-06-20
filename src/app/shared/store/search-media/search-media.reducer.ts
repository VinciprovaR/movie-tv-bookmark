import { createReducer, on } from '@ngrx/store';
import * as SearchMediaActions from './search-media.actions';
import {
  ErrorResponse,
  TVResult,
  TVDetail,
  MovieDetail,
  MovieResult,
} from '../../models';
import { Media_Lifecycle_Enum } from '../../models/supabase/entities/media_life_cycle_enum.entity';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
export interface SearchMediaState {
  isLoading: boolean;
  query: string;
  error: ErrorResponse | null;
  mediaResult: MovieResult | TVResult;
  mediaDetail: MovieDetail | TVDetail | null;
  broadcastChannel: boolean;
  lifecycleEnum: Media_Lifecycle_Enum[] | [];
}

export const searchMediaFeatureKey = 'search-media';

export const initialState: SearchMediaState = {
  isLoading: false,
  query: '',
  error: null,
  mediaResult: { page: 1, results: [], total_pages: 1, total_results: 0 },
  mediaDetail: null,
  broadcastChannel: false,
  lifecycleEnum: [],
};

export const searchMediaReducer = createReducer(
  initialState,
  on(SearchMediaActions.searchMedia, (state, { query }) => {
    return {
      ...state,
      query,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMediaActions.searchAdditionalMedia, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMediaActions.searchMediaSuccess, (state, { mediaResult }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      mediaResult,
      broadcastChannel: true,
    };
  }),
  on(
    SearchMediaActions.searchAdditionalMediaSuccess,
    (state, { mediaResult }) => {
      let currMovies = state.mediaResult?.results
        ? state.mediaResult.results
        : [];
      let nextMovies = mediaResult?.results ? mediaResult.results : [];
      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult: {
          page: mediaResult?.page ? mediaResult.page : 0,
          total_pages: mediaResult?.total_pages ? mediaResult.total_pages : 0,
          total_results: mediaResult?.total_results
            ? mediaResult.total_results
            : 0,
          results: [...currMovies, ...nextMovies],
        },
      };
    }
  ),
  on(SearchMediaActions.createUpdateDeleteMediaLifecycle, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(
    SearchMediaActions.createUpdateDeleteMediaLifecycleSuccess,
    (state, { entityMediaLifeCycle, index }) => {
      let mediaId;

      if (isMovieEntity(entityMediaLifeCycle)) {
        mediaId = entityMediaLifeCycle.movie_id;
      } else {
        mediaId = entityMediaLifeCycle.tv_id;
      }

      let movieResultCl = JSON.parse(JSON.stringify({ ...state.mediaResult }));
      if (entityMediaLifeCycle) {
        if (movieResultCl.results[index].id === mediaId) {
          movieResultCl.results[index].lifeCycleId =
            entityMediaLifeCycle.lifecycle_id
              ? entityMediaLifeCycle.lifecycle_id
              : 0;
        } else {
          /*to-do problem, index not in synch with the actual object,
        do a binary search to find the movie id in all the objs of the state. If not found again, throw error
        */
        }
      }

      return {
        ...state,
        error: null,
        isLoading: false,
        movieResult: movieResultCl,
        broadcastChannel: true,
      };
    }
  ),
  on(SearchMediaActions.searchMediaDetail, (state) => {
    return {
      ...state,
      mediaDetail: null,
      error: null,
      isLoading: true,
      broadcastChannel: true,
    };
  }),
  on(SearchMediaActions.searchMediaDetailSuccess, (state, { mediaDetail }) => {
    return {
      ...state,
      error: null,
      isLoading: false,
      mediaDetail,
      broadcastChannel: true,
    };
  }),
  on(SearchMediaActions.cleanError, (state) => {
    return {
      ...state,
      error: null,
      broadcastChannel: true,
    };
  }),
  on(SearchMediaActions.getMediaLifecycleEnum, (state) => {
    return {
      ...state,
      error: null,
      isLoading: true,
    };
  }),
  on(
    SearchMediaActions.getMediaLifecycleEnumSuccess,
    (state, { lifecycleEnum }) => {
      return {
        ...state,
        error: null,
        isLoading: false,
        lifecycleEnum,
      };
    }
  )
);

const isMovieEntity = (
  entityMediaLifeCycle: object
): entityMediaLifeCycle is Movie_Life_Cycle =>
  (entityMediaLifeCycle as Movie_Life_Cycle).movie_id !== undefined;

export const getSearchMediaState = (state: SearchMediaState) => state;
export const getIsLoading = (state: SearchMediaState) => state.isLoading;
export const getMediaResult = (state: SearchMediaState) => state.mediaResult;
export const getMediaDetail = (state: SearchMediaState) => state.mediaDetail;
export const getQuery = (state: SearchMediaState) => state.query;
export const getMediaResultPage = (state: SearchMediaState) =>
  state.mediaResult?.page ? state.mediaResult.page : 0;
export const getMediaResultTotalPages = (state: SearchMediaState) =>
  state.mediaResult?.total_pages ? state.mediaResult.total_pages : 0;
export const getLifecycleEnum = (state: SearchMediaState) =>
  state.lifecycleEnum;
export const getSearchMediaError = (state: SearchMediaState) => state.error;
