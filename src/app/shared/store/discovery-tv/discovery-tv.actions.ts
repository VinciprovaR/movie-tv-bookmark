import { createAction, props } from '@ngrx/store';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { Genre, Language } from '../../interfaces/TMDB/tmdb-filters.interface';
import { HttpErrorResponse } from '@angular/common/http';

//search
export const discoveryTV = createAction(
  '[Discovery-tv/API] Discovery TV',
  props<{ payload: PayloadDiscoveryTV }>()
);
export const discoveryTVSuccess = createAction(
  '[Discovery-tv/API] Discovery TV Success',
  props<{ tvResult: TVResult }>()
);
export const discoveryAdditionalTV = createAction(
  '[Discovery-tv/API] Discovery Additional TV'
);
export const discoveryAdditionalTVSuccess = createAction(
  '[Discovery-tv/API] Discovery TV Additional Success',
  props<{ tvResult: TVResult }>()
);
export const noAdditionalTV = createAction(
  '[Discovery-tv/API] No Additional TV'
);

//genres
export const getGenreList = createAction('[Discovery-tv/API] Get Genre List');
export const getGenreListSuccess = createAction(
  '[Discovery-tv/API] Get Genre List Success',
  props<{ genreList: Genre[] | [] }>()
);

//languages
export const getLanguagesList = createAction(
  '[Discovery-tv/API] Get Languages List'
);
export const getLanguagesListSuccess = createAction(
  '[Discovery-tv/API] Get Certification Languages Success',
  props<{ languageList: Language[] }>()
);

//error
export const discoveryTVFailure = createAction(
  '[Discovery-TV/API] Discovery TV Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);
export const cleanError = createAction(
  '[Discovery-tv/Error Handling] Clean Error'
);
