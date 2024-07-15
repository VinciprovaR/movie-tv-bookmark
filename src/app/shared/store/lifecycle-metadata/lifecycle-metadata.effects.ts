import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, map, of, switchMap } from 'rxjs';
import {} from '../../services/supabase';
import { ErrorResponse } from '../../interfaces/error.interface';
import { LifecycleMetadataActions } from '.';
import { LifecycleOption } from '../../interfaces/supabase/DTO';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';
import { SupabaseLifecycleMetadataService } from '../../services/supabase/supabase-lifecycle-metadata.service';

@Injectable()
export class LifecycleMetadataEffects {
  retriveLifecycleMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LifecycleMetadataActions.retriveLifecycleMetadata),
      switchMap((action) => {
        return this.supabaseLifecycleMetadataService
          .retriveLifecycleMetadata()
          .pipe(
            map(
              (lifecycleMetadata: {
                lifecycleOptions: LifecycleOption[];
                lifecycleTypeIdMap: LifecycleTypeIdMap;
              }) => {
                return LifecycleMetadataActions.retriveLifecycleMetadataSuccess(
                  lifecycleMetadata
                );
              }
            ),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                LifecycleMetadataActions.lifecycleMetadataFailure({
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
    private supabaseLifecycleMetadataService: SupabaseLifecycleMetadataService
  ) {}
}
