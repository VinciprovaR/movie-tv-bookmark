import { createReducer, on } from '@ngrx/store';
import * as FiltersMetadataActions from './filters-metadata.actions';
import { FiltersMetadataState } from '../../interfaces/store/filters-metadata-state.interface';

export const filtersMetadataFeatureKey = 'filters-metadata';

export const initialState: FiltersMetadataState = {
  isLoading: false,
  error: null,
  movie: {
    certificationList: [],
    genreList: [],
    sortBy: [
      { value: 'popularity.desc', label: 'Popularity Descending' },
      { value: 'popularity.asc', label: 'Popularity Ascending' },
      { value: 'vote_average.desc', label: 'Rating Descending' },
      { value: 'vote_average.asc', label: 'Rating Ascending' },
      {
        value: 'primary_release_date.desc',
        label: 'Release Date Descending',
      },
      { value: 'primary_release_date.asc', label: 'Release Date Ascending' },
      { value: 'title.asc', label: 'Title (A-Z)' },
      { value: 'title.desc', label: 'Title (Z-A)' },
    ],
  },
  tv: {
    genreList: [],
    sortBy: [
      { value: 'popularity.desc', label: 'Popularity Descending' },
      { value: 'popularity.asc', label: 'Popularity Ascending' },
      { value: 'vote_average.desc', label: 'Rating Descending' },
      { value: 'vote_average.asc', label: 'Rating Ascending' },
      { value: 'first_air_date.desc', label: 'First Air Date Descending' },
      { value: 'first_air_date.asc', label: 'First Air Date Ascending' },
      { value: 'name.asc', label: 'Name (A-Z)' },
      { value: 'name.desc', label: 'Name (Z-A)' },
    ],
  },
  media: { languageList: [] },
};

export const filtersMetadataReducer = createReducer(
  initialState,
  on(
    FiltersMetadataActions.getFiltersMetadata,
    (state): FiltersMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: true,
      };
    }
  ),
  on(
    FiltersMetadataActions.getGenreListTVSuccess,
    (state, { genreList }): FiltersMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        tv: { ...state.tv, genreList },
      };
    }
  ),
  on(
    FiltersMetadataActions.getGenreListMovieSuccess,
    (state, { genreList }): FiltersMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movie: { ...state.movie, genreList },
      };
    }
  ),
  on(
    FiltersMetadataActions.getCertificationListMovieSuccess,
    (state, { certificationList }): FiltersMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        movie: { ...state.movie, certificationList },
      };
    }
  ),
  on(
    FiltersMetadataActions.getLanguagesListMediaSuccess,
    (state, { languageList }): FiltersMetadataState => {
      return {
        ...state,
        error: null,
        isLoading: false,
        media: { languageList },
      };
    }
  ),
  on(
    FiltersMetadataActions.filtersMetadataFailure,
    (state, { httpErrorResponse }): FiltersMetadataState => {
      return {
        ...state,
        isLoading: false,
        error: httpErrorResponse,
      };
    }
  ),
  on(FiltersMetadataActions.cleanError, (state): FiltersMetadataState => {
    return {
      ...state,
      error: null,
    };
  })
);

export const getFiltersMetadataState = (state: FiltersMetadataState) => state;
export const getGenreListMovie = (state: FiltersMetadataState) =>
  state.movie.genreList;
export const getGenreListTV = (state: FiltersMetadataState) =>
  state.tv.genreList;
export const getLanguageListMedia = (state: FiltersMetadataState) =>
  state.media.languageList;
export const getCertificationListMovie = (state: FiltersMetadataState) =>
  state.movie.certificationList;
export const getSortyByMovie = (state: FiltersMetadataState) =>
  state.movie.sortBy;
export const getSortyByTV = (state: FiltersMetadataState) => state.tv.sortBy;
export const getIsLoading = (state: FiltersMetadataState) => state.isLoading;
export const getFiltersMetadataError = (state: FiltersMetadataState) =>
  state.error;
