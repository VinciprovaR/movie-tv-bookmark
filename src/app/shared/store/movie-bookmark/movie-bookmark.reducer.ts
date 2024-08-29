import { createReducer, on } from '@ngrx/store';
import * as MovieBookmarkActions from './movie-bookmark.actions';
import { MovieBookmarkState } from '../../interfaces/store/movie-bookmark-state.interface';

export const movieBookmarkStateFeatureKey = 'movie-bookmark';

export const initialState: MovieBookmarkState = {
  isLoading: false,
  error: null,
  movieBookmarkMap: {},
  movieList: [],
  updateSearch: false,
  payload: {
    genreIdList: [],
    sortBy: 'primary_release_date.desc',
  },
};

export const movieBookmarkReducer = createReducer(
  initialState,
  on(
    MovieBookmarkActions.createUpdateDeleteMovieBookmark,
    MovieBookmarkActions.searchMovieByBookmarkLanding,
    (state): MovieBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: true,
        updateSearch: false,
      };
    }
  ),
  on(
    MovieBookmarkActions.searchMovieByBookmarkSubmit,
    (state, { payload }): MovieBookmarkState => {
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
    MovieBookmarkActions.updateSearchMovieByBookmark,
    (state): MovieBookmarkState => {
      return {
        ...state,
        updateSearch: true,
      };
    }
  ),
  on(
    MovieBookmarkActions.createMovieBookmarkSuccess,
    MovieBookmarkActions.updateMovieBookmarkSuccess,
    MovieBookmarkActions.deleteMovieBookmarkSuccess,
    MovieBookmarkActions.unchangedMovieBookmarkSuccess,
    MovieBookmarkActions.populateMovieBookmarkMapSuccess,
    (state, { movieBookmarkMap }): MovieBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieBookmarkMap: { ...state.movieBookmarkMap, ...movieBookmarkMap },
      };
    }
  ),
  on(
    MovieBookmarkActions.searchMovieByBookmarkLandingSuccess,
    MovieBookmarkActions.searchMovieByBookmarkSubmitSuccess,
    (state, { movieList }): MovieBookmarkState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movieList,
      };
    }
  ),
  on(
    MovieBookmarkActions.createMovieBookmarkFailure,
    MovieBookmarkActions.updateMovieBookmarkFailure,
    MovieBookmarkActions.deleteMovieBookmarkFailure,
    MovieBookmarkActions.unchangedMovieBookmarkFailure,
    MovieBookmarkActions.populateMovieBookmarkMapFailure,
    MovieBookmarkActions.searchMovieByBookmarkSubmitFailure,
    MovieBookmarkActions.searchMovieByBookmarkLandingeFailure,
    MovieBookmarkActions.createUpdateDeleteMovieBookmarkFailure,
    (state, { httpErrorResponse }): MovieBookmarkState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
        movieBookmarkMap: { ...state.movieBookmarkMap }, //still update to push to the selector the prev value like is a next
      };
    }
  )
);

export const getMovieBookmarkState = (state: MovieBookmarkState) => state;
export const getIsLoading = (state: MovieBookmarkState) => state.isLoading;
export const getPayload = (state: MovieBookmarkState) => state.payload;
export const getMovieBookmarkMap = (state: MovieBookmarkState) =>
  state.movieBookmarkMap;
export const getSearchMovieBookmarkError = (state: MovieBookmarkState) =>
  state.error;
export const getMovieList = (state: MovieBookmarkState) => state.movieList;
export const getUpdateSearch = (state: MovieBookmarkState) =>
  state.updateSearch;
