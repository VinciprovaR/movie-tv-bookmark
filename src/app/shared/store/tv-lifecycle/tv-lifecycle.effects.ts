import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  TV,
  TVDetail,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { SupabaseTVLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { ErrorResponse } from '../../interfaces/error.interface';
import { TVLifecycleActions, TVLifecycleSelectors } from '.';

import { SearchTVActions } from '../search-tv';
import { TVLifecycleMap } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { DiscoveryTVActions } from '../discovery-tv';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';

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
      switchMap((action) => {
        let { tvResult } = action;
        return this.supabaseTVLifecycleService
          .initTVLifecycleMapFromTVResult(tvResult.results)
          .pipe(
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
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO }, user] = action;

        return this.supabaseTVLifecycleService
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
                })
              );
            })
          );
      })
    );
  });

  updateSearchTVByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.createUpdateDeleteTVLifecycleSuccess),
      switchMap(() => {
        return of(TVLifecycleActions.updateSearchTVByLifecycle());
      })
    );
  });

  searchTVByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TVLifecycleActions.searchTVByLifecycleLanding,
        TVLifecycleActions.searchTVByLifecycleSubmit
      ),
      withLatestFrom(this.store.select(TVLifecycleSelectors.selectPayload)),
      switchMap((action) => {
        let [{ lifecycleId, payload: payloadSubmit }, payloadState] = action;
        let payload = payloadSubmit ? payloadSubmit : payloadState;
        return this.supabaseTVLifecycleService
          .findTVByLifecycleId(lifecycleId, payload)
          .pipe(
            map((tvList: TV_Life_Cycle[] & TV_Data[]) => {
              return TVLifecycleActions.searchTVByLifecycleSuccess({
                tvList,
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

  initTVLifecycleMapFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.searchTVByLifecycleSuccess),
      switchMap((action) => {
        let { tvList }: { tvList: TV_Life_Cycle[] & TV_Data[] } = action;
        return this.supabaseTVLifecycleService
          .initTVLifecycleMapFromTVResultSupabase(tvList)
          .pipe(
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
    private supabaseTVLifecycleService: SupabaseTVLifecycleService
  ) {}
}
