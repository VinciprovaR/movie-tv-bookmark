import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { SupabaseBookmarkMetadataService } from '../../services/supabase';
import { BookmarkMetadataActions } from '.';
import { BookmarkOption } from '../../interfaces/supabase/DTO';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

@Injectable()
export class BookmarkMetadataEffects {
  private readonly actions$ = inject(Actions);
  private readonly supabaseBookmarkMetadataService = inject(
    SupabaseBookmarkMetadataService
  );

  constructor() {}

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
