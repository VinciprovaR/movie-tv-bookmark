import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as FiltersMetadataReducer from './filters-metadata.reducer';
import { FiltersMetadataState } from '../../interfaces/store/filters-metadata-state.interface';

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
export const selectSortByLifecycleMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByLifecycleMovie
);
export const selectGenreListTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getGenreListTV
);
export const selectSortByDiscoveryTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByDiscoveryTV
);
export const selectSortByLifecycleTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByLifecycleTV
);
export const selectLanguageListMedia = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getLanguageListMedia
);

export const selectError = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getFiltersMetadataError
);
