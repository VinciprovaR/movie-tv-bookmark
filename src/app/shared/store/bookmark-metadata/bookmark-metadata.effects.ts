import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import {} from '../../services/supabase';
import { ErrorResponse } from '../../interfaces/error.interface';
import { BookmarkMetadataActions } from '.';
import { BookmarkOption } from '../../interfaces/supabase/DTO';
import { BookmarkTypeIdMap } from '../../interfaces/store/bookmark-metadata-state.interface';
import { SupabaseBookmarkMetadataService } from '../../services/supabase/supabase-bookmark-metadata.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class BookmarkMetadataEffects {
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
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                BookmarkMetadataActions.bookmarkMetadataFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private supabaseBookmarkMetadataService: SupabaseBookmarkMetadataService
  ) {}
}
