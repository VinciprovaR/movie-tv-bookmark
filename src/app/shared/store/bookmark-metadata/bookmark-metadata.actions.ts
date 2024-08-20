import { createAction, props } from '@ngrx/store';
import { BookmarkOption } from '../../interfaces/supabase/DTO';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const retriveBookmarkMetadata = createAction(
  '[Bookmark-Metadata] Retrive Bookmark Options '
);
export const retriveBookmarkMetadataSuccess = createAction(
  '[Bookmark-Metadata] Retrive Bookmark Options Success',
  props<{
    bookmarkOptions: BookmarkOption[];
    bookmarkTypeIdMap: BookmarkTypeIdMap;
  }>()
);
export const bookmarkMetadataFailure = createAction(
  '[Bookmark-Metadata] Bookmark Metadata Failure',
  props<{
    httpErrorResponse: HttpErrorResponse;
  }>()
);
