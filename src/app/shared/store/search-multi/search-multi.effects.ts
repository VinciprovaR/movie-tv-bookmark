import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SearchMultiActions from './search-multi.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { Router } from '@angular/router';
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
} from '@supabase/supabase-js/';
import { ErrorResponse } from '../../models/auth-models';

@Injectable()
export class SearchMultiEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMultiActions.searchMovie),
      switchMap((searchMetadata) => {
        return this.tmdbSearchService.searchMovie(searchMetadata).pipe(
          tap((result: any) => {
            // if (result.error) {
            //   throw result.error;
            // }
            console.log(result);
          }),
          map((result: any) => {
            return SearchMultiActions.searchMovieSuccess({
              movies: result,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              SearchMultiActions.searchMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private tmdbSearchService: TmdbSearchService,
    private router: Router
  ) {}
}
