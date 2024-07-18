import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryTVActions, DiscoveryTVSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { SupabaseTVLifecycleService } from '../../services/supabase';
import { TMDBDiscoveryTVService } from '../../services/tmdb';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DiscoveryTVEffects {
  discoveryTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryTV),
      switchMap((action) => {
        let { payload } = action;
        return this.TMDBDiscoveryTVService.tvDiscoveryInit(payload).pipe(
          switchMap((tvResult: TVResult) => {
            if (!payload.includeMediaWithLifecycle) {
              return this.supabaseTVLifecycleService.removeTVWithLifecycle(
                tvResult
              );
            }
            return of(tvResult);
          }),
          map((tvResult: TVResult) => {
            return DiscoveryTVActions.discoveryTVSuccess({
              tvResult: tvResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(
              DiscoveryTVActions.discoveryTVFailure({
                httpErrorResponse,
              })
            );
          })
        );
      })
    );
  });

  discoveryAdditionalTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryAdditionalTV),
      withLatestFrom(
        this.store.select(DiscoveryTVSelectors.selectTVPage),
        this.store.select(DiscoveryTVSelectors.selectTVTotalPages),
        this.store.select(DiscoveryTVSelectors.selectPayload)
      ),
      switchMap((action) => {
        let [type, currPage, totalPages, payload] = action;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryTVService.additionalTVDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((tvResult: TVResult) => {
              if (!payload.includeMediaWithLifecycle) {
                return this.supabaseTVLifecycleService.removeTVWithLifecycle(
                  tvResult
                );
              }
              return of(tvResult);
            }),
            map((tvResult: TVResult) => {
              return DiscoveryTVActions.discoveryAdditionalTVSuccess({
                tvResult: tvResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                DiscoveryTVActions.discoveryAdditionaTVFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        } else {
          return of(DiscoveryTVActions.noAdditionalTV());
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBDiscoveryTVService: TMDBDiscoveryTVService,
    private store: Store,
    private supabaseTVLifecycleService: SupabaseTVLifecycleService
  ) {}
}
