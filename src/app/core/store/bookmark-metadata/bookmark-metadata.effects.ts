import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { BookmarkMetadataActions } from '.';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { BookmarkTypeIdMap } from '../../../shared/interfaces/store/bookmark-metadata-state.interface';
import { BookmarkOption } from '../../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import { SupabaseBookmarkMetadataService } from '../../services/supabase-bookmark-metadata.service';

@Injectable()
export class BookmarkMetadataEffects {
  private readonly actions$ = inject(Actions);
  private readonly supabaseBookmarkMetadataService = inject(
    SupabaseBookmarkMetadataService
  );

  retriveBookmarkMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(BookmarkMetadataActions.retriveBookmarkMetadata),
      switchMap((action) => {
        return this.supabaseBookmarkMetadataService
          .retriveBookmarkMetadata()
          .pipe(
            map(
              (bookmarkMetadata: {
                bookmarkOptions: BookmarkOption[];
                bookmarkTypeIdMap: BookmarkTypeIdMap;
              }) => {
                return BookmarkMetadataActions.retriveBookmarkMetadataSuccess(
                  bookmarkMetadata
                );
              }
            ),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  BookmarkMetadataActions.bookmarkMetadataFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });
}
