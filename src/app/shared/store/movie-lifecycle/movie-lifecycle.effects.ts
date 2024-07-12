import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  catchError,
  concatMap,
  filter,
  forkJoin,
  map,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Movie, MovieResult } from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';

import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { ErrorResponse } from '../../interfaces/error.interface';
import { MovieLifecycleActions, MovieLifecycleSelectors } from '.';

import { SearchMovieActions } from '../search-movie';
import { DiscoveryMovieActions } from '../discovery-movie';
import { MovieLifecycleMap } from '../../interfaces/lifecycle.interface';
import { LifecycleMetadataSelectors } from '../lifecycle-metadata';
import { SupabaseMovieLifecycleService } from '../../services/supabase';
import { Movie_Life_Cycle } from '../../interfaces/supabase/entities';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';

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
      switchMap((actionParams) => {
        let { movieResult }: { movieResult: MovieResult } = actionParams;
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
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user] = actionParams;
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

  searchMovieByLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.searchMovieByLifecycle),
      switchMap((actionParams) => {
        let { lifecycleId } = actionParams;
        return this.supabaseMovieLifecycleService
          .findMovieByLifecycleId(lifecycleId)
          .pipe(
            map((movieList: Movie_Data[]) => {
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
      switchMap((actionParams) => {
        let { movieList }: { movieList: Movie_Data[] } = actionParams;
        return this.supabaseMovieLifecycleService
          .initMovieLifecycleMapFromMovieResult(movieList)
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
