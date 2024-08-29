import { createAction, props } from '@ngrx/store';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import {
  bookmarkEnum,
  TVBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { TV, TVDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { TV_Data, TV_Bookmark } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';

import { PayloadTVBookmark } from '../../interfaces/store/tv-bookmark-state.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

//populate bookmark map
export const populateTVBookmarkMapSuccess = createAction(
  '[TV-Bookmark] Populate TV Bookmark Map Success',
  props<{ tvBookmarkMap: TVBookmarkMap }>()
);
export const populateTVBookmarkMapFailure = createAction(
  '[TV-Bookmark] Populate TV Bookmark Map Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

//CRUD bookmark
export const createUpdateDeleteTVBookmark = createAction(
  '[TV-Bookmark] Create or Update or Delete TV Bookmark Init',
  props<{ mediaBookmarkDTO: MediaBookmarkDTO<TV | TV_Data | TVDetail> }>()
);
export const createUpdateDeleteTVBookmarkFailure = createAction(
  '[TV-Bookmark] Create or Update or Delete TV Bookmark Failure & Notify',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const updateTVBookmark = createAction(
  '[TV-Bookmark] Update TV Bookmark Init & Notify',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<TV>;
    operation: crud_operations;
  }>()
);
export const updateTVBookmarkSuccess = createAction(
  '[TV-Bookmark] Update TV Bookmark Success Notify',
  props<{
    tvBookmarkMap: TVBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const updateTVBookmarkFailure = createAction(
  '[TV-Bookmark] Update TV Bookmark Failure & Notify',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const deleteTVBookmark = createAction(
  '[TV-Bookmark] Delete TV Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<TV>;
    operation: crud_operations;
  }>()
);
export const deleteTVBookmarkSuccess = createAction(
  '[TV-Bookmark] Delete TV Bookmark Success & Notify',
  props<{
    tvBookmarkMap: TVBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const deleteTVBookmarkFailure = createAction(
  '[TV-Bookmark] Delete TV Bookmark Failure & Notify',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const createTVBookmark = createAction(
  '[TV-Bookmark] Create TV Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<TV>;
    operation: crud_operations;
  }>()
);
export const createTVBookmarkSuccess = createAction(
  '[TV-Bookmark] Create TV Bookmark Success & Notify',
  props<{
    tvBookmarkMap: TVBookmarkMap;
    operation: crud_operations;
    notifyMsg: string;
  }>()
);
export const createTVBookmarkFailure = createAction(
  '[TV-Bookmark] Create TV Bookmark Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const unchangedTVBookmark = createAction(
  '[TV-Bookmark] Unchanged TV Bookmark Init',
  props<{
    mediaBookmarkDTO: MediaBookmarkDTO<TV>;
    operation: crud_operations;
  }>()
);
export const unchangedTVBookmarkSuccess = createAction(
  '[TV-Bookmark] Unchanged TV Bookmark Success & Notify',
  props<{
    tvBookmarkMap: TVBookmarkMap;
    operation: crud_operations;
  }>()
);
export const unchangedTVBookmarkFailure = createAction(
  '[TV-Bookmark] Unchanged TV Bookmark Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

//search tv by bookmark
export const updateSearchTVByBookmark = createAction(
  '[TV-Bookmark] Update Search TV By Bookmark'
);

//search tv by bookmark
export const searchTVByBookmarkLanding = createAction(
  '[TV-Bookmark] Search TV By Bookmark Landing Init',
  props<{ bookmarkEnum: bookmarkEnum }>()
);
export const searchTVByBookmarkLandingSuccess = createAction(
  '[TV-Bookmark] Search TV By Bookmark Landing Success',
  props<{ tvList: TV_Bookmark[] & TV_Data[] }>()
);
export const searchTVByBookmarkLandingeFailure = createAction(
  '[TV-Bookmark] Search TV By Bookmark Landing Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const searchTVByBookmarkSubmit = createAction(
  '[TV-Bookmark] Search TV By Bookmark Submit Init',
  props<{ bookmarkEnum: bookmarkEnum; payload: PayloadTVBookmark }>()
);
export const searchTVByBookmarkSubmitSuccess = createAction(
  '[TV-Bookmark] Search TV By Bookmark Submit Success',
  props<{ tvList: TV_Bookmark[] & TV_Data[] }>()
);
export const searchTVByBookmarkSubmitFailure = createAction(
  '[TV-Bookmark] Search TV By Bookmark Submit Failure',
  props<{
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const crudOperationsInit: any = {
  update: updateTVBookmark,
  createUpdate: updateTVBookmark,
  delete: deleteTVBookmark,
  create: createTVBookmark,
  unchanged: unchangedTVBookmark,
};
