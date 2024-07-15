import { createAction, props } from '@ngrx/store';
import {
  Certification,
  Genre,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';

//genres movie
export const getFiltersMetadata = createAction(
  '[Filters-Metadata/API] Get Filters Metadata'
);

export const getGenreListMovieSuccess = createAction(
  '[Filters-Metadata/API] Get Genre List Movie Success',
  props<{ genreList: Genre[] | [] }>()
);

//certification movie
export const getCertificationListMovieSuccess = createAction(
  '[Filters-Metadata/API] Get Certification List Movie Success',
  props<{ certificationList: Certification[] }>()
);

//genres tv
export const getGenreListTVSuccess = createAction(
  '[Filters-Metadata/API] Get Genre List TV Success',
  props<{ genreList: Genre[] | [] }>()
);

//languages media
export const getLanguagesListMediaSuccess = createAction(
  '[Filters-Metadata/API] Get Certification Languages Media Success',
  props<{ languageList: Language[] }>()
);

//error
export const filtersMetadataFailure = createAction(
  '[Filters-Metadata/API] Filters-Metadata Failure',
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[Filters-Metadata/Error Handling] Clean Error'
);
