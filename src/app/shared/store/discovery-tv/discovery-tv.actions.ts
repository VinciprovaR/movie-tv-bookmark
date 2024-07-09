import { createAction, props } from '@ngrx/store';
import {
  TVDetail,
  TVResult,
  PeopleResult,
} from '../../interfaces/media.interface';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { Genre, Language } from '../../interfaces/tmdb-filters.interface';

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
export const discoveryTVDetail = createAction(
  '[Discovery-tv/API] Discovery TV Detail',
  props<{ tvId: number }>()
);
export const cleanTVDetail = createAction('[Discovery-tv/API] Clean TV Detail');
export const discoveryTVDetailSuccess = createAction(
  '[Discovery-tv/API] Discovery TV Detail Success',
  props<{ tvDetail: TVDetail }>()
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
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[Discovery-tv/Error Handling] Clean Error'
);
