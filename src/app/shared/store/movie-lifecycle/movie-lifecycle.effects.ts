import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { MovieResult } from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { ErrorResponse } from '../../interfaces/error.interface';
import { MovieLifecycleActions, MovieLifecycleSelectors } from '.';

import { SearchMovieActions } from '../search-movie';
import { DiscoveryMovieActions } from '../discovery-movie';
import { MovieLifecycleMap } from '../../interfaces/store/movie-lifecycle-state.interface';

@Injectable()
export class MovieLifecycleEffects {
  initMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchMovieActions.searchMovieSuccess,
        DiscoveryMovieActions.discoveryMovieSuccess
      ),
      withLatestFrom(
        this.store.select(MovieLifecycleSelectors.selectMovieLifecycleMap)
      ),
      switchMap((actionParams) => {
        let [{ movieResult }, movieLifecycleMap]: [
          { movieResult: MovieResult },
          MovieLifecycleMap
        ] = actionParams;
        let movieLifecycleMapClone = JSON.parse(
          JSON.stringify({ ...movieLifecycleMap })
        );
        return this.supabaseLifecycleService
          .initMovieLifecycleMap(movieResult, movieLifecycleMapClone)
          .pipe(
            map((movieLifecycleMapResult: MovieLifecycleMap) => {
              return MovieLifecycleActions.initMovieLifecycleSuccess({
                movieLifecycleMap: movieLifecycleMapResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                MovieLifecycleActions.lifecycleFailure({ httpErrorResponse })
              );
            })
          );
      })
    );
  });

  createUpdateDeleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieLifecycleActions.createUpdateDeleteMovieLifecycle),
      withLatestFrom(
        this.store.select(AuthSelectors.selectUser),
        this.store.select(MovieLifecycleSelectors.selectMovieLifecycleMap)
      ),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user, movieLifecycleMap] = actionParams;

        let movieLifecycleMapClone = JSON.parse(
          JSON.stringify({ ...movieLifecycleMap })
        );
        return this.supabaseLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(
            mediaLifecycleDTO,
            user as User,
            movieLifecycleMapClone
          )
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

  constructor(
    private actions$: Actions,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
