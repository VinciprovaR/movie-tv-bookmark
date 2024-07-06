import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchService } from '../../services/tmdb';
import { TVDetail, TVResult } from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { ErrorResponse } from '../../interfaces/error.interface';
import { TVLifecycleActions, TVLifecycleSelectors } from '.';

import { SearchTVActions } from '../search-tv';
import { TVLifecycleMap } from '../../interfaces/store/tv-lifecycle-state.interface';
// import { DiscoveryTVActions } from '../discovery-tv';

@Injectable()
export class TVLifecycleEffects {
  initTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchTVActions.searchTVSuccess
        // DiscoveryTVActions.discoveryTVSuccess
      ),
      withLatestFrom(
        this.store.select(TVLifecycleSelectors.selectTVLifecycleMap)
      ),
      switchMap((actionParams) => {
        let [{ tvResult }, tvLifecycleMap] = actionParams;
        let tvLifecycleMapClone = JSON.parse(
          JSON.stringify({ ...tvLifecycleMap })
        );
        return this.supabaseLifecycleService
          .initTVLifecycleMap(tvResult, tvLifecycleMapClone)
          .pipe(
            map((tvLifecycleMapResult: TVLifecycleMap) => {
              return TVLifecycleActions.initTVLifecycleSuccess({
                tvLifecycleMap: tvLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                TVLifecycleActions.lifecycleFailure({ httpErrorResponse })
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
          .createOrUpdateOrDeleteTVLifecycle(
            mediaLifecycleDTO,
            user as User,
            tvLifecycleMapClone
          )
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
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBSearchService: TMDBSearchService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
