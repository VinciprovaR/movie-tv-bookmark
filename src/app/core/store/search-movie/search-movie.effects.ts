import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { TMDBSearchMovieService } from '../../../features/movie/services/tmdb-search-movie.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { MovieResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';

@Injectable()
export class SearchMovieEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly TMDBSearchMovieService = inject(TMDBSearchMovieService);

  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((action) => {
        let { query } = action;
        if (query) {
          return this.TMDBSearchMovieService.movieSearchInit(query).pipe(
            map((movieResult: MovieResult) => {
              return SearchMovieActions.searchMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  SearchMovieActions.searchMovieFailure({ httpErrorResponse })
                );
              }
            )
          );
        }
        return of(SearchMovieActions.cleanState());
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
        let [, currPage, totalPages, query] = action;
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
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  SearchMovieActions.searchMovieFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        } else {
          return of(SearchMovieActions.noAdditionalMovie());
        }
      })
    );
  });

  cleanState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(SearchMovieActions.cleanState());
      })
    );
  });
}
