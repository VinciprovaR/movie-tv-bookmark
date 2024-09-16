import { createAction, props } from '@ngrx/store';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { BookmarkTypeIdMap } from '../../../shared/interfaces/store/bookmark-metadata-state.interface';
import { BookmarkOption } from '../../../shared/interfaces/supabase/media-bookmark.DTO.interface';

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
    httpErrorResponse: CustomHttpErrorResponseInterface;
  }>()
);

export const cleanState = createAction('[Bookmark-Metadata] Clean State');
