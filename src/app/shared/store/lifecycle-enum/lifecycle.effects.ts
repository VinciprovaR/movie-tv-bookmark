import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LifecycleEnumActions } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';

import { ErrorResponse } from '../../models/auth.models';

import { SupabaseMediaLifecycleService } from '../../services/supabase.media_life_cycle.service';

@Injectable()
export class LifecycleEnumEffects {
  getMediaLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LifecycleEnumActions.lifecycleEnum),
      switchMap((actionParams) => {
        return this.supabaseMediaLifecycleService.findLifecycleEnum().pipe(
          map((lifecycleEnum: any) => {
            return LifecycleEnumActions.lifecycleEnumSuccess({
              lifecycleEnum: lifecycleEnum.data,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              LifecycleEnumActions.lifecycleFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private supabaseMediaLifecycleService: SupabaseMediaLifecycleService
  ) {}
}
