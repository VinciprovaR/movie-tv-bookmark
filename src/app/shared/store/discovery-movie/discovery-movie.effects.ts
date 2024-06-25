import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryMovieActions, DiscoveryMovieSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbDiscoveryService } from '../../services/tmdb-discovery.service';
import { ErrorResponse } from '../../models/auth.models';
import { Movie, MovieDetail, MovieResult } from '../../models';
import { Store } from '@ngrx/store';
import { SupabaseMediaLifecycleService } from '../../services/supabase.media_life_cycle.service';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';

@Injectable()
export class DiscoveryMovieEffects {
  discoveryMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovie),
      switchMap((actionParams) => {
        let { payload } = actionParams;
        return this.tmdbDiscoveryService
          .movieDiscoveryInit(payload)
          .pipe(
            switchMap((movieResult) => {
              return this.supabaseMediaLifecycleService.injectMovieLifecycle(
                movieResult
              );
            })
          )
          .pipe(
            map((movieResult: MovieResult) => {
              return DiscoveryMovieActions.discoveryMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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
        this.store.select(DiscoveryMovieSelectors.selectQuery)
      ),
      switchMap((actionParams) => {
        let [action, currPage, totalPages, payload] = actionParams;
        if (currPage < totalPages) {
          return this.tmdbDiscoveryService
            .additionalMovieDiscovery(currPage, payload)
            .pipe(
              switchMap((movieResult) => {
                return this.supabaseMediaLifecycleService
                  .injectMovieLifecycle(movieResult)
                  .pipe(
                    map((movieResult: MovieResult) => {
                      return DiscoveryMovieActions.discoveryAdditionalMovieSuccess(
                        {
                          movieResult: movieResult,
                        }
                      );
                    }),
                    catchError((httpErrorResponse: ErrorResponse) => {
                      console.error(httpErrorResponse);
                      return of(
                        DiscoveryMovieActions.discoveryMovieFailure({
                          httpErrorResponse,
                        })
                      );
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
      switchMap((actionParams) => {
        let { movieId } = actionParams;
        return this.tmdbDiscoveryService.searchMovieDetail(movieId).pipe(
          map((movieDetail: MovieDetail) => {
            return DiscoveryMovieActions.discoveryMovieDetailSuccess({
              movieDetail: movieDetail,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  createUpdateDeleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.createUpdateDeleteMovieLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user]: [
          { mediaLifecycleDTO: MediaLifecycleDTO },
          User | null
        ] = actionParams;
        return this.supabaseMediaLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(mediaLifecycleDTO, user)
          .pipe(
            withLatestFrom(
              this.store.select(DiscoveryMovieSelectors.selectMovieResult)
            ),
            map((actionParams) => {
              let [entityMovieLifeCycle, movieResultState]: [
                Movie_Life_Cycle,
                MovieResult
              ] = actionParams;
              let movieResult =
                this.supabaseMediaLifecycleService.injectUpdatedMovieLifecycle(
                  entityMovieLifeCycle,
                  movieResultState,
                  mediaLifecycleDTO
                );
              return DiscoveryMovieActions.createUpdateDeleteMovieLifecycleSuccess(
                {
                  movieResult,
                }
              );
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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

  constructor(
    private actions$: Actions,
    private tmdbDiscoveryService: TmdbDiscoveryService,
    private store: Store,
    private supabaseMediaLifecycleService: SupabaseMediaLifecycleService
  ) {}
}
