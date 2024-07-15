import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { Movie, MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { ErrorResponse } from '../../interfaces/error.interface';
import { MovieLifecycleActions } from '.';

import { SearchMovieActions } from '../search-movie';
import { DiscoveryMovieActions } from '../discovery-movie';
import { MovieLifecycleMap } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseMovieLifecycleService } from '../../services/supabase';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';

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
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaLifecycleDTO }, user] = action;
        return this.supabaseMovieLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(mediaLifecycleDTO, user as User)
          .pipe(
            map((movieLifecycleMap: MovieLifecycleMap) => {
              return MovieLifecycleActions.createUpdateDeleteMovieLifecycleSuccess(
                { movieLifecycleMap }
              );
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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

  updateSearchMovieByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.createUpdateDeleteMovieLifecycleSuccess),
      switchMap(() => {
        return of(MovieLifecycleActions.updateSearchMovieByLifecycle());
      })
    );
  });

  searchMovieByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.searchMovieByLifecycle),
      switchMap((action) => {
        let { lifecycleId } = action;
        return this.supabaseMovieLifecycleService
          .findMovieByLifecycleId(lifecycleId)
          .pipe(
            map((movieList: Movie_Life_Cycle[] & Movie_Data[]) => {
              return MovieLifecycleActions.searchMovieByLifecycleSuccess({
                movieList,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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
