import { createAction, props } from '@ngrx/store';
import {
  Movie,
  MovieDetail,
  MovieResult,
  PeopleResult,
} from '../../interfaces/media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO/';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import {
  Certification,
  CertificationResult,
  Certifications,
  Genre,
} from '../../interfaces/tmdb-filters.interface';

//search
export const discoveryMovie = createAction(
  '[Discovery-movie/API] Discovery Movie',
  props<{ payload: PayloadDiscoveryMovie }>()
);
export const discoveryMovieSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Success',
  props<{ movieResult: MovieResult }>()
);
export const discoveryAdditionalMovie = createAction(
  '[Discovery-movie/API] Discovery Additional Movie'
);
export const discoveryAdditionalMovieSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Additional Success',
  props<{ movieResult: MovieResult | null }>()
);
export const noAdditionalMovie = createAction(
  '[Discovery-movie/API] No Additional Movie'
);
export const discoveryMovieDetail = createAction(
  '[Discovery-movie/API] Discovery Movie Detail',
  props<{ movieId: number }>()
);
export const cleanMovieDetail = createAction(
  '[Discovery-movie/API] Clean Movie Detail'
);
export const discoveryMovieDetailSuccess = createAction(
  '[Discovery-movie/API] Discovery Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);

//genres
export const getGenreList = createAction(
  '[Discovery-movie/API] Get Genre List'
);
export const getGenreListSuccess = createAction(
  '[Discovery-movie/API] Get Genre List Success',
  props<{ genreList: Genre[] | [] }>()
);

//certification
export const getCertificationList = createAction(
  '[Discovery-movie/API] Get Certification List'
);
export const getCertificationListSuccess = createAction(
  '[Discovery-movie/API] Get Certification List Success',
  props<{ certifications: Certification[] }>()
);

//people
export const searchPeople = createAction(
  '[Discovery-movie/API] Search People',
  props<{ queryPeople: string }>()
);
export const searchPeopleSuccess = createAction(
  '[Discovery-movie/API] Search People Success',
  props<{ peopleResult: PeopleResult }>()
);
export const searchAdditionalPeople = createAction(
  '[Discovery-movie/API] Search Additional People'
);
export const searchAdditionalPeopleSuccess = createAction(
  '[Discovery-movie/API] Search People Additional Success',
  props<{ peopleResult: PeopleResult | null }>()
);
export const noAdditionalPeople = createAction(
  '[Discovery-movie/API] No Additional People'
);

//error
export const discoveryMovieFailure = createAction(
  '[Discovery-Movie/API] Discovery Movie Failure',
  props<{ httpErrorResponse: any }>()
);
export const cleanError = createAction(
  '[Discovery-movie/Error Handling] Clean Error'
);
