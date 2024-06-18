import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { Router } from '@angular/router';
import { ErrorResponse } from '../../models/auth.models';
import { MovieDetail, MovieResult } from '../../models';
import { Store } from '@ngrx/store';
import { LifecycleService } from '../../services/lifecycle.service';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((searchMetadata) => {
        return this.tmdbSearchService
          .searchInitMovies(searchMetadata)
          .pipe(
            switchMap((movieResult) => {
              return this.lifecycleService.mergeMovieLifecycle(movieResult);
            })
          )
          .pipe(
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
        this.store.select(SearchMovieSelectors.selectMoviesPage),
        this.store.select(SearchMovieSelectors.selectMoviesTotalPages),
        this.store.select(SearchMovieSelectors.selectQuery)
      ),
      switchMap((metadata) => {
        if (metadata[1] < metadata[2]) {
          return this.tmdbSearchService
            .searchAdditionalMovies(metadata[1] + 1, metadata[3])
            .pipe(
              map((movieResult: MovieResult) => {
                return SearchMovieActions.searchAdditionalMovieSuccess({
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
        } else {
          return of(SearchMovieActions.noAdditionalMovie());
        }
      })
    );
  });

  searchMovieDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovieDetail),
      switchMap((metadata) => {
        return this.tmdbSearchService.searchMovieDetail(metadata.movieId).pipe(
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
    private tmdbSearchService: TmdbSearchService,
    private store: Store,
    private lifecycleService: LifecycleService,
    private router: Router
  ) {}
}
