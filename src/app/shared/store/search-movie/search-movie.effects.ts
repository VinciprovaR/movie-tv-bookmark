import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchService } from '../../services/tmdb';
import { Movie, MovieDetail, MovieResult } from '../../models/media.models';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { Movie_Life_Cycle } from '../../models/supabase/entities';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/';
import { ErrorResponse } from '../../models/error.models';
import { SupabaseDecouplingService } from '../../services/supabase/supabase-decoupling.service';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.TMDBSearchService.movieSearchInit(query)
          .pipe(
            switchMap((movieResult) => {
              return this.supabaseLifecycleService.injectMovieLifecycle(
                movieResult
              );
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
            switchMap((movieResult) => {
              return this.supabaseLifecycleService
                .injectMovieLifecycle(movieResult)
                .pipe(
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

  createUpdateDeleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.createUpdateDeleteMovieLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user]: [
          { mediaLifecycleDTO: MediaLifecycleDTO },
          User | null
        ] = actionParams;
        return this.supabaseLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(mediaLifecycleDTO, user)
          .pipe(
            withLatestFrom(
              this.store
                .select(SearchMovieSelectors.selectMovieResult)
                .pipe(
                  map(
                    (movieState: MovieResult) =>
                      movieState.results[mediaLifecycleDTO.index]
                  )
                )
            ),
            map((actionParams) => {
              let [entityMovieLifeCycle, movieState]: [
                Movie_Life_Cycle,
                Movie
              ] = actionParams;
              let movie =
                this.supabaseDecouplingService.injectUpdatedMovieLifecycle(
                  entityMovieLifeCycle,
                  movieState
                );
              return SearchMovieActions.createUpdateDeleteMovieLifecycleSuccess(
                {
                  movie,
                  index: mediaLifecycleDTO.index,
                }
              );
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
    private supabaseLifecycleService: SupabaseLifecycleService,
    private supabaseDecouplingService: SupabaseDecouplingService
  ) {}
}
