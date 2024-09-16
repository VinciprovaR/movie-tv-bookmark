import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FiltersMetadataState } from '../../../shared/interfaces/store/filters-metadata-state.interface';
import * as FiltersMetadataReducer from './filters-metadata.reducer';

const FiltersMetadataFeatureSelector =
  createFeatureSelector<FiltersMetadataState>(
    FiltersMetadataReducer.filtersMetadataFeatureKey
  );

export const selectCertificationListMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getCertificationListMovie
);
export const selectGenreListMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getGenreListMovie
);
export const selectSortByDiscoveryMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByDiscoveryMovie
);
export const selectSortByBookmarkMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByBookmarkMovie
);
export const selectGenreListTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getGenreListTV
);
export const selectSortByDiscoveryTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByDiscoveryTV
);
export const selectSortByBookmarkTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByBookmarkTV
);
export const selectLanguageListMedia = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getLanguageListMedia
);

export const selectError = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getFiltersMetadataError
);
