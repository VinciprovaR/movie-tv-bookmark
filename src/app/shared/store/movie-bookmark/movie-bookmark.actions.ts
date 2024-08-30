import { createAction, props } from '@ngrx/store';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import {
  bookmarkEnum,
  MovieBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { Movie, MovieDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data, Movie_Bookmark } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';

import { PayloadMovieBookmark } from '../../interfaces/store/movie-bookmark-state.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

export const cleanState = createAction('[Movie-Bookmark] Clean State');

//populate bookmark map
export const populateMovieBookmarkMapSuccess = createAction(
  '[Movie-Bookmark] Populate Movie Bookmark Map Success',
  props<{ movieBookmarkMap: MovieBookmarkMap }>()
);
export const populateMovieBookmarkMapFailure = createAction(
  '[Movie-Bookmark] Populate Movie Bookmark Map Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

//CRUD bookmark
export const createUpdateDeleteMovieBookmark = createAction(
  '[Movie-Bookmark] Create or Update or Delete Movie Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>;
  }>()
);
export const createUpdateDeleteMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Create or Update or Delete Movie Bookmark Failure & Notify',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const updateMovieBookmark = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Init & Notify',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const updateMovieBookmarkSuccess = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Success & Notify',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const updateMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Failure & Notify',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const deleteMovieBookmark = createAction(
  '[Movie-Bookmark] Delete Movie Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const deleteMovieBookmarkSuccess = createAction(
  '[Movie-Bookmark] Delete Movie Bookmark Success & Notify',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const deleteMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Delete Movie Bookmark Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const createMovieBookmark = createAction(
  '[Movie-Bookmark] Create Movie Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const createMovieBookmarkSuccess = createAction(
  '[Movie-Bookmark] Create Movie Bookmark Success & Notify',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const createMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Create Movie Bookmark Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const unchangedMovieBookmark = createAction(
  '[Movie-Bookmark] Unchanged Movie Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const unchangedMovieBookmarkSuccess = createAction(
  '[Movie-Bookmark] Unchanged Movie Bookmark Success',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
  }>()
);
export const unchangedMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Unchanged Movie Bookmark Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

//search movie by bookmark
export const updateSearchMovieByBookmark = createAction(
  '[Movie-Bookmark] Update Search Movie By Bookmark'
);

//search movie by bookmark
export const searchMovieByBookmarkLanding = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Landing Init',
  props<{ bookmarkEnum: bookmarkEnum }>()
);
export const searchMovieByBookmarkLandingSuccess = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Landing Success',
  props<{ movieList: Movie_Bookmark[] & Movie_Data[] }>()
);
export const searchMovieByBookmarkLandingeFailure = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Landing Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const searchMovieByBookmarkSubmit = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Submit Init',
  props<{ bookmarkEnum: bookmarkEnum; payload: PayloadMovieBookmark }>()
);
export const searchMovieByBookmarkSubmitSuccess = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Submit Success',
  props<{ movieList: Movie_Bookmark[] & Movie_Data[] }>()
);
export const searchMovieByBookmarkSubmitFailure = createAction(
  '[Movie-Bookmark] Search Movie By Bookmark Submit Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const crudOperationsInit: any = {
  update: updateMovieBookmark,
  createUpdate: updateMovieBookmark,
  delete: deleteMovieBookmark,
  create: createMovieBookmark,
  unchanged: unchangedMovieBookmark,
};
