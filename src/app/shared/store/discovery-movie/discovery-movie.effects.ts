import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryMovieActions, DiscoveryMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import {
  MovieDetail,
  MovieResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { SupabaseMovieLifecycleService } from '../../services/supabase';
import { TMDBDiscoveryMovieService } from '../../services/tmdb';
import { ErrorResponse } from '../../interfaces/error.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DiscoveryMovieEffects {
  discoveryMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovie),
      switchMap((action) => {
        let { payload } = action;
        return this.TMDBDiscoveryMovieService.movieDiscoveryInit(payload).pipe(
          switchMap((movieResult: MovieResult) => {
            if (!payload.includeMediaWithLifecycle) {
              return this.supabaseMovieLifecycleService.removeMovieWithLifecycle(
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
          catchError((httpErrorResponse: HttpErrorResponse) => {
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
        let [type, currPage, totalPages, payload] = action;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryMovieService.additionalMovieDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((movieResult: MovieResult) => {
              if (!payload.includeMediaWithLifecycle) {
                return this.supabaseMovieLifecycleService.removeMovieWithLifecycle(
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
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                DiscoveryMovieActions.discoveryMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        } else {
          return of(DiscoveryMovieActions.noAdditionalMovie());
        }
      })
    );
  });

  discoveryMovieDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovieDetail),
      switchMap((action) => {
        let { movieId } = action;
        return this.TMDBDiscoveryMovieService.movieDetail(movieId).pipe(
          map((movieDetail: MovieDetail) => {
            return DiscoveryMovieActions.discoveryMovieDetailSuccess({
              movieDetail: movieDetail,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBDiscoveryMovieService: TMDBDiscoveryMovieService,
    private store: Store,
    private supabaseMovieLifecycleService: SupabaseMovieLifecycleService
  ) {}
}
