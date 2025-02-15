import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { DiscoveryMovieActions, DiscoveryMovieSelectors } from '.';
import { SupabaseMovieBookmarkService } from '../../../features/movie/services/supabase-movie-bookmark.service';
import { TMDBDiscoveryMovieService } from '../../../features/movie/services/tmdb-discovery-movie.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { MovieResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';

@Injectable()
export class DiscoveryMovieEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly TMDBDiscoveryMovieService = inject(
    TMDBDiscoveryMovieService
  );
  private readonly supabaseMovieBookmarkService = inject(
    SupabaseMovieBookmarkService
  );

  discoveryMovieLanding$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovieLanding),
      withLatestFrom(this.store.select(DiscoveryMovieSelectors.selectPayload)),
      switchMap((action) => {
        let [, payload] = action;
        return this.TMDBDiscoveryMovieService.movieDiscovery(payload).pipe(
          switchMap((movieResult: MovieResult) => {
            if (!payload.includeMediaWithBookmark) {
              return this.supabaseMovieBookmarkService.removeMovieWithBookmark(
                movieResult
              );
            }
            return of(movieResult);
          }),
          map((movieResult: MovieResult) => {
            return DiscoveryMovieActions.discoveryMovieLandingSuccess({
              movieResult: movieResult,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(
              DiscoveryMovieActions.discoveryMovieLandingFailure({
                httpErrorResponse,
              })
            );
          })
        );
      })
    );
  });

  discoveryMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovie),
      switchMap((action) => {
        let { payload } = action;
        return this.TMDBDiscoveryMovieService.movieDiscovery(payload).pipe(
          switchMap((movieResult: MovieResult) => {
            if (!payload.includeMediaWithBookmark) {
              return this.supabaseMovieBookmarkService.removeMovieWithBookmark(
                movieResult
              );
            }
            return of(movieResult);
          }),
          map((movieResult: MovieResult) => {
            return DiscoveryMovieActions.discoveryMovieSuccess({
              movieResult: movieResult,
            });
          }),
          tap(() => {
            DiscoveryMovieSelectors.scrollTo$.next(null);
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({
                httpErrorResponse,
              })
            );
          })
        );
      })
    );
  });

  discoveryAdditionalMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryAdditionalMovie),
      withLatestFrom(
        this.store.select(DiscoveryMovieSelectors.selectMoviePage),
        this.store.select(DiscoveryMovieSelectors.selectMovieTotalPages),
        this.store.select(DiscoveryMovieSelectors.selectPayload)
      ),
      switchMap((action) => {
        let [, currPage, totalPages, payload] = action;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryMovieService.additionalMovieDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((movieResult: MovieResult) => {
              if (!payload.includeMediaWithBookmark) {
                return this.supabaseMovieBookmarkService.removeMovieWithBookmark(
                  movieResult
                );
              }
              return of(movieResult);
            }),
            map((movieResult: MovieResult) => {
              return DiscoveryMovieActions.discoveryAdditionalMovieSuccess({
                movieResult: movieResult,
              });
            }),

            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  DiscoveryMovieActions.discoveryAdditionaMovieFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        } else {
          return of(DiscoveryMovieActions.noAdditionalMovie());
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
        return of(DiscoveryMovieActions.cleanState());
      })
    );
  });
}
