import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { DiscoveryTVActions, DiscoveryTVSelectors } from '.';
import { SupabaseTVBookmarkService } from '../../../features/tv/services/supabase-tv-bookmark.service';
import { TMDBDiscoveryTVService } from '../../../features/tv/services/tmdb-discovery-tv.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';

@Injectable()
export class DiscoveryTVEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly TMDBDiscoveryTVService = inject(TMDBDiscoveryTVService);
  private readonly supabaseTVBookmarkService = inject(
    SupabaseTVBookmarkService
  );

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
            return DiscoveryTVActions.discoveryTVLandingSuccess({
              tvResult: tvResult,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(
              DiscoveryTVActions.discoveryTVLandingFailure({
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
          tap(() => {
            DiscoveryTVSelectors.scrollTo$.next(null);
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
