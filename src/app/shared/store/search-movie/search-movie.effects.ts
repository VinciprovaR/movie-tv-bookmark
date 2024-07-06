import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchService } from '../../services/tmdb';
import { MovieDetail, MovieResult } from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { ErrorResponse } from '../../interfaces/error.interface';
import { SupabaseLifecycleService } from '../../services/supabase';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.TMDBSearchService.movieSearchInit(query).pipe(
          map((movieResult: MovieResult) => {
            return SearchMovieActions.searchMovieSuccess({
              movieResult: movieResult,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
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
      switchMap((actionParams) => {
        let [action, currPage, totalPages, query] = actionParams;
        if (currPage < totalPages) {
          return this.TMDBSearchService.additionalMovieSearch(
            currPage,
            query
          ).pipe(
            map((movieResult: MovieResult) => {
              return SearchMovieActions.searchAdditionalMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
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

  searchMovieDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovieDetail),
      switchMap((actionParams) => {
        let { movieId } = actionParams;
        return this.TMDBSearchService.searchMovieDetail(movieId).pipe(
          map((movieDetail: MovieDetail) => {
            return SearchMovieActions.searchMovieDetailSuccess({
              movieDetail: movieDetail,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              SearchMovieActions.searchMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBSearchService: TMDBSearchService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
