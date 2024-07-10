import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TVDetail, TVResult } from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { ErrorResponse } from '../../interfaces/error.interface';
import { TVLifecycleActions, TVLifecycleSelectors } from '.';

import { SearchTVActions } from '../search-tv';
import { TVLifecycleMap } from '../../interfaces/lifecycle.interface';
import { DiscoveryTVActions } from '../discovery-tv';

// import { DiscoveryTVActions } from '../discovery-tv';

@Injectable()
export class TVLifecycleEffects {
  initTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchTVActions.searchTVSuccess,
        SearchTVActions.searchAdditionalTVSuccess,
        DiscoveryTVActions.discoveryTVSuccess,
        DiscoveryTVActions.discoveryAdditionalTVSuccess
      ),
      withLatestFrom(
        this.store.select(TVLifecycleSelectors.selectTVLifecycleMap)
      ),
      switchMap((actionParams) => {
        let [{ tvResult }, tvLifecycleMap] = actionParams;
        let tvLifecycleMapClone = JSON.parse(
          JSON.stringify({ ...tvLifecycleMap })
        );
        return this.supabaseLifecycleService.initTVLifecycleMap(tvResult).pipe(
          map((tvLifecycleMapResult: TVLifecycleMap) => {
            return TVLifecycleActions.initTVLifecycleSuccess({
              tvLifecycleMap: tvLifecycleMapResult,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              TVLifecycleActions.lifecycleFailure({
                httpErrorResponse,
                tvLifecycleMap: tvLifecycleMapClone, //to-do ciò che c'è in db
              })
            );
          })
        );
      })
    );
  });

  createUpdateDeleteTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.createUpdateDeleteTVLifecycle),
      withLatestFrom(
        this.store.select(AuthSelectors.selectUser),
        this.store.select(TVLifecycleSelectors.selectTVLifecycleMap)
      ),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user, tvLifecycleMap] = actionParams;
        let tvLifecycleMapClone = JSON.parse(
          JSON.stringify({ ...tvLifecycleMap })
        );
        return this.supabaseLifecycleService
          .createOrUpdateOrDeleteTVLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((tvLifecycleMap: TVLifecycleMap) => {
              return TVLifecycleActions.createUpdateDeleteTVLifecycleSuccess({
                tvLifecycleMap,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                TVLifecycleActions.lifecycleFailure({
                  httpErrorResponse,
                  tvLifecycleMap: tvLifecycleMapClone,
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
