import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { TVLifecycleActions, TVLifecycleSelectors } from '.';

import { SearchTVActions } from '../search-tv';
import { DiscoveryTVActions } from '../discovery-tv';
import { TVLifecycleMap } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseTVLifecycleService } from '../../services/supabase';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { HttpErrorResponse } from '@angular/common/http';
import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { personDetailTVCreditsSuccess } from '../component-store/person-detail-tv-credits-store.service';

@Injectable()
export class TVLifecycleEffects {
  initTVLifecycleMapFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TVLifecycleActions.searchTVByLifecycleLandingSuccess,
        TVLifecycleActions.searchTVByLifecycleSubmitSuccess
      ),
      switchMap((action) => {
        let { tvList }: { tvList: TV_Life_Cycle[] & TV_Data[] } = action;
        return this.supabaseTVLifecycleService
          .initTVLifecycleMapFromTVResultSupabase(tvList)
          .pipe(
            map((tvLifecycleMapResult: TVLifecycleMap) => {
              return TVLifecycleActions.populateTVLifecycleMapSuccess({
                tvLifecycleMap: tvLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.populateTVLifecycleMapFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  initTVLifecycleMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchTVActions.searchTVSuccess,
        SearchTVActions.searchAdditionalTVSuccess,
        DiscoveryTVActions.discoveryTVSuccess,
        DiscoveryTVActions.discoveryAdditionalTVSuccess,
        personDetailTVCreditsSuccess
      ),
      switchMap((action) => {
        let { tvResult }: { tvResult: TVResult } = action;
        return this.supabaseTVLifecycleService
          .initTVLifecycleMapFromTVResultTMDB(tvResult.results)
          .pipe(
            map((tvLifecycleMapResult: TVLifecycleMap) => {
              return TVLifecycleActions.populateTVLifecycleMapSuccess({
                tvLifecycleMap: tvLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.populateTVLifecycleMapFailure({
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
      switchMap((action) => {
        let { mediaLifecycleDTO } = action;
        return this.supabaseTVLifecycleService
          .crudOperationResolver(mediaLifecycleDTO)
          .pipe(
            map((operation: crud_operations) => {
              return TVLifecycleActions.crudOperationsInit[operation]({
                operation,
                mediaLifecycleDTO,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.createUpdateDeleteTVLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  createTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.createTVLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO, operation }, user] = action;
        return this.supabaseTVLifecycleService
          .createTVLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((tvLifecycleMap: TVLifecycleMap) => {
              return TVLifecycleActions.createTVLifecycleSuccess({
                tvLifecycleMap: tvLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.createTVLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  updateTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.updateTVLifecycle),
      switchMap((action) => {
        let { mediaLifecycleDTO, operation } = action;
        return this.supabaseTVLifecycleService
          .updateTVLifecycle(mediaLifecycleDTO)
          .pipe(
            map((tvLifecycleMap: TVLifecycleMap) => {
              return TVLifecycleActions.updateTVLifecycleSuccess({
                tvLifecycleMap: tvLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.updateTVLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  deleteTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.deleteTVLifecycle),

      switchMap((action) => {
        let { mediaLifecycleDTO, operation } = action;
        return this.supabaseTVLifecycleService
          .deleteTVLifecycle(mediaLifecycleDTO)
          .pipe(
            map((tvLifecycleMap: TVLifecycleMap) => {
              return TVLifecycleActions.deleteTVLifecycleSuccess({
                tvLifecycleMap: tvLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.deleteTVLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  unchangedTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.unchangedTVLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO, operation }, user] = action;
        return this.supabaseTVLifecycleService
          .unchangedTVLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((tvLifecycleMap: TVLifecycleMap) => {
              return TVLifecycleActions.unchangedTVLifecycleSuccess({
                tvLifecycleMap: tvLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.unchangedTVLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  notifySearchTVByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TVLifecycleActions.createTVLifecycleSuccess,
        TVLifecycleActions.deleteTVLifecycleSuccess,
        TVLifecycleActions.updateTVLifecycleSuccess
      ),
      switchMap((action) => {
        return of(TVLifecycleActions.notifySearchTVByLifecycle());
      })
    );
  });

  searchTVByLifecycleLanding$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.searchTVByLifecycleLanding),
      withLatestFrom(this.store.select(TVLifecycleSelectors.selectPayload)),
      switchMap((action) => {
        let [{ lifecycleEnum }, payloadState] = action;

        return this.supabaseTVLifecycleService
          .findTVByLifecycleId(lifecycleEnum, payloadState)
          .pipe(
            map((tvList: TV_Life_Cycle[] & TV_Data[]) => {
              return TVLifecycleActions.searchTVByLifecycleLandingSuccess({
                tvList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.searchTVByLifecycleLandingeFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  searchTVByLifecycleSubmit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVLifecycleActions.searchTVByLifecycleSubmit),
      switchMap((action) => {
        let { lifecycleEnum, payload: payloadSubmit } = action;

        return this.supabaseTVLifecycleService
          .findTVByLifecycleId(lifecycleEnum, payloadSubmit)
          .pipe(
            map((tvList: TV_Life_Cycle[] & TV_Data[]) => {
              return TVLifecycleActions.searchTVByLifecycleSubmitSuccess({
                tvList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                TVLifecycleActions.searchTVByLifecycleSubmitFailure({
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
