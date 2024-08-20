import { createAction, props } from '@ngrx/store';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import {
  bookmarkEnum,
  MovieBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { Movie, MovieDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data, Movie_Bookmark } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { PayloadMovieBookmark } from '../../interfaces/store/movie-bookmark-state.interface';

//populate bookmark map
export const populateMovieBookmarkMapSuccess = createAction(
  '[Movie-Bookmark] Populate Movie Bookmark Map Success',
  props<{ movieBookmarkMap: MovieBookmarkMap }>()
);
export const populateMovieBookmarkMapFailure = createAction(
  '[Movie-Bookmark] Populate Movie Bookmark Map Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
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
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const updateMovieBookmark = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Init & Notify',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<Movie>;
    operation: crud_operations;
  }>()
);
export const updateMovieBookmarkSuccess = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Success',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const updateMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Update Movie Bookmark Failure & Notify',
  props<{
    httpErrorResponse: HttpErrorResponse;
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
  '[Movie-Bookmark] Delete Movie Bookmark Success',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const deleteMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Delete Movie Bookmark Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
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
  '[Movie-Bookmark] Create Movie Bookmark Success',
  props<{
    movieBookmarkMap: MovieBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const createMovieBookmarkFailure = createAction(
  '[Movie-Bookmark] Create Movie Bookmark Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
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
    httpErrorResponse: HttpErrorResponse;
  }>()
);

//search movie by bookmark
export const notifySearchMovieByBookmark = createAction(
  '[Movie-Bookmark] Notify Search Movie By Bookmark',
  props<{ notifyMsg: string }>()
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
    httpErrorResponse: HttpErrorResponse;
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
    httpErrorResponse: HttpErrorResponse;
  }>()
);

export const crudOperationsInit: any = {
  update: updateMovieBookmark,
  createUpdate: updateMovieBookmark,
  delete: deleteMovieBookmark,
  create: createMovieBookmark,
  unchanged: unchangedMovieBookmark,
};
