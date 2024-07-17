import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchMovieService } from '../../services/tmdb';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((action) => {
        let { query } = action;
        return this.TMDBSearchMovieService.movieSearchInit(query).pipe(
          map((movieResult: MovieResult) => {
            return SearchMovieActions.searchMovieSuccess({
              movieResult: movieResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(
              SearchMovieActions.searchMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  searchAdditionalMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchAdditionalMovie),
      withLatestFrom(
        this.store.select(SearchMovieSelectors.selectMoviePage),
        this.store.select(SearchMovieSelectors.selectMovieTotalPages),
        this.store.select(SearchMovieSelectors.selectQuery)
      ),
      switchMap((action) => {
        let [type, currPage, totalPages, query] = action;
        if (currPage < totalPages) {
          return this.TMDBSearchMovieService.additionalMovieSearch(
            currPage,
            query
          ).pipe(
            map((movieResult: MovieResult) => {
              return SearchMovieActions.searchAdditionalMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                SearchMovieActions.searchMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        } else {
          return of(SearchMovieActions.noAdditionalMovie());
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBSearchMovieService: TMDBSearchMovieService,
    private store: Store
  ) {}
}
