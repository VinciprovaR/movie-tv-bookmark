import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Movie, MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { ErrorResponse } from '../../interfaces/error.interface';
import { MovieLifecycleActions, MovieLifecycleSelectors } from '.';

import { SearchMovieActions } from '../search-movie';
import { DiscoveryMovieActions } from '../discovery-movie';
import { MovieLifecycleMap } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseMovieLifecycleService } from '../../services/supabase';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { HttpErrorResponse } from '@angular/common/http';
import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';

@Injectable()
export class MovieLifecycleEffects {
  initMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchMovieActions.searchMovieSuccess,
        SearchMovieActions.searchAdditionalMovieSuccess,
        DiscoveryMovieActions.discoveryMovieSuccess,
        DiscoveryMovieActions.discoveryAdditionalMovieSuccess
      ),
      switchMap((action) => {
        let { movieResult }: { movieResult: MovieResult } = action;
        return this.supabaseMovieLifecycleService
          .initMovieLifecycleMapFromMovieResult(movieResult.results)
          .pipe(
            map((movieLifecycleMapResult: MovieLifecycleMap) => {
              return MovieLifecycleActions.initMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.lifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  createUpdateDeleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.createUpdateDeleteMovieLifecycle),
      switchMap((action) => {
        let { mediaLifecycleDTO } = action;
        return this.supabaseMovieLifecycleService
          .crudOperationResolver(mediaLifecycleDTO)
          .pipe(
            map((operation: crud_operations) => {
              return MovieLifecycleActions.crudOperationsInit[operation]({
                operation,
                mediaLifecycleDTO,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.lifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  createMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.createMovieLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO, operation }, user] = action;
        return this.supabaseMovieLifecycleService
          .createMovieLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((movieLifecycleMap: MovieLifecycleMap) => {
              return MovieLifecycleActions.createMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.createMovieLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  updateMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.updateMovieLifecycle),
      switchMap((action) => {
        let { mediaLifecycleDTO, operation } = action;
        return this.supabaseMovieLifecycleService
          .updateMovieLifecycle(mediaLifecycleDTO)
          .pipe(
            map((movieLifecycleMap: MovieLifecycleMap) => {
              return MovieLifecycleActions.updateMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.updateMovieLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  deleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.deleteMovieLifecycle),

      switchMap((action) => {
        let { mediaLifecycleDTO, operation } = action;
        return this.supabaseMovieLifecycleService
          .deleteMovieLifecycle(mediaLifecycleDTO)
          .pipe(
            map((movieLifecycleMap: MovieLifecycleMap) => {
              return MovieLifecycleActions.deleteMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.deleteMovieLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  unchangedMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.unchangedMovieLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO, operation }, user] = action;
        return this.supabaseMovieLifecycleService
          .unchangedMovieLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((movieLifecycleMap: MovieLifecycleMap) => {
              return MovieLifecycleActions.unchangedMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMap,
                operation,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.unchangedMovieLifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  updateSearchMovieByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MovieLifecycleActions.createMovieLifecycleSuccess,
        MovieLifecycleActions.deleteMovieLifecycleSuccess,
        MovieLifecycleActions.updateMovieLifecycleSuccess
      ),
      switchMap((action) => {
        return of(MovieLifecycleActions.updateSearchMovieByLifecycle());
      })
    );
  });

  searchMovieByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MovieLifecycleActions.searchMovieByLifecycleLanding,
        MovieLifecycleActions.searchMovieByLifecycleSubmit
      ),
      withLatestFrom(this.store.select(MovieLifecycleSelectors.selectPayload)),
      switchMap((action) => {
        let [{ lifecycleId, payload: payloadSubmit }, payloadState] = action;
        let payload = payloadSubmit ? payloadSubmit : payloadState;
        return this.supabaseMovieLifecycleService
          .findMovieByLifecycleId(lifecycleId, payload)
          .pipe(
            map((movieList: Movie_Life_Cycle[] & Movie_Data[]) => {
              return MovieLifecycleActions.searchMovieByLifecycleSuccess({
                movieList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.lifecycleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  initMovieLifecycleMapFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.searchMovieByLifecycleSuccess),
      switchMap((action) => {
        let { movieList }: { movieList: Movie_Life_Cycle[] & Movie_Data[] } =
          action;
        return this.supabaseMovieLifecycleService
          .initMovieLifecycleMapFromMovieResultSupabase(movieList)
          .pipe(
            map((movieLifecycleMapResult: MovieLifecycleMap) => {
              return MovieLifecycleActions.initMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                MovieLifecycleActions.lifecycleFailure({
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
    private supabaseMovieLifecycleService: SupabaseMovieLifecycleService
  ) {}
}
