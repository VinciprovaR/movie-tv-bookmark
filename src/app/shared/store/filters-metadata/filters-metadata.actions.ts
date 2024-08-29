import { createAction, props } from '@ngrx/store';
import {
  Certification,
  Genre,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

export const getFiltersMetadata = createAction(
  '[Filters-Metadata] Get Filters Metadata Init'
);

//genres movie
export const getGenreListMovieSuccess = createAction(
  '[Filters-Metadata] Get Genre List Movie Success',
  props<{ genreList: Genre[] | [] }>()
);
export const getGenreListMovieFailure = createAction(
  '[Filters-Metadata] Get Genre List Movie Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//certification movie
export const getCertificationListMovieSuccess = createAction(
  '[Filters-Metadata] Get Certification List Movie Success',
  props<{ certificationList: Certification[] }>()
);
export const getCertificationListMovieFailure = createAction(
  '[Filters-Metadata] Get Certification List Movie Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//genres tv
export const getGenreListTVSuccess = createAction(
  '[Filters-Metadata] Get Genre List TV Success',
  props<{ genreList: Genre[] | [] }>()
);
export const getGenreListTVFailure = createAction(
  '[Filters-Metadata] Get Genre List TV Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

//languages media
export const getLanguagesListMediaSuccess = createAction(
  '[Filters-Metadata] Get Languages Media Success',
  props<{ languageList: Language[] }>()
);
export const getLanguagesListMediaFailure = createAction(
  '[Filters-Metadata] Get Languages Media Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
