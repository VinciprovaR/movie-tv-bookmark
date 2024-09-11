import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryTVActions, DiscoveryTVSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { SupabaseTVBookmarkService } from '../../services/supabase';
import { TMDBDiscoveryTVService } from '../../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';
import { AuthActions } from '../auth';

@Injectable()
export class DiscoveryTVEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly TMDBDiscoveryTVService = inject(TMDBDiscoveryTVService);
  private readonly supabaseTVBookmarkService = inject(
    SupabaseTVBookmarkService
  );
  constructor() {}

  discoveryTVLanding$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryTVLanding),
      withLatestFrom(this.store.select(DiscoveryTVSelectors.selectPayload)),
      switchMap((action) => {
        let [, payload] = action;
        return this.TMDBDiscoveryTVService.tvDiscovery(payload).pipe(
          switchMap((tvResult: TVResult) => {
            if (!payload.includeMediaWithBookmark) {
              return this.supabaseTVBookmarkService.removeTVWithBookmark(
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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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

  discoveryTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryTV),
      switchMap((action) => {
        let { payload } = action;
        return this.TMDBDiscoveryTVService.tvDiscovery(payload).pipe(
          switchMap((tvResult: TVResult) => {
            if (!payload.includeMediaWithBookmark) {
              return this.supabaseTVBookmarkService.removeTVWithBookmark(
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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
        let [, currPage, totalPages, payload] = action;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryTVService.additionalTVDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((tvResult: TVResult) => {
              if (!payload.includeMediaWithBookmark) {
                return this.supabaseTVBookmarkService.removeTVWithBookmark(
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
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  DiscoveryTVActions.discoveryAdditionaTVFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        } else {
          return of(DiscoveryTVActions.noAdditionalTV());
        }
      })
    );
  });

  cleanState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(DiscoveryTVActions.cleanState());
      })
    );
  });
}
