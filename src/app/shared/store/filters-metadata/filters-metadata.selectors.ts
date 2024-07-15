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
export const selectSortByMovie = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByMovie
);
export const selectGenreListTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getGenreListTV
);
export const selectSortByTV = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getSortyByTV
);
export const selectLanguageListMedia = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getLanguageListMedia
);

export const selectError = createSelector(
  FiltersMetadataFeatureSelector,
  FiltersMetadataReducer.getFiltersMetadataError
);
