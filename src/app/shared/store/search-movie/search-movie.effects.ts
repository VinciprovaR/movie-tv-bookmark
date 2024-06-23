import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { ErrorResponse } from '../../models/auth.models';
import { MovieDetail, MovieResult } from '../../models';
import { Store } from '@ngrx/store';
import { SupabaseMediaLifecycleService } from '../../services/supabase.media_life_cycle.service';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.tmdbSearchService
          .movieSearchInit(query)
          .pipe(
            switchMap((movieResult) => {
              return this.supabaseMediaLifecycleService.injectMovieLifecycle(
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
          return this.tmdbSearchService
            .additionalMovieSearch(currPage, query)
            .pipe(
              switchMap((movieResult) => {
                return this.supabaseMediaLifecycleService
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
        return this.tmdbSearchService.searchMovieDetail(movieId).pipe(
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
        return this.supabaseMediaLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(mediaLifecycleDTO, user)
          .pipe(
            map((entityMovieLifeCycle: Movie_Life_Cycle) => {
              return SearchMovieActions.createUpdateDeleteMovieLifecycleSuccess(
                {
                  entityMovieLifeCycle,
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
    private tmdbSearchService: TmdbSearchService,
    private store: Store,
    private supabaseMediaLifecycleService: SupabaseMediaLifecycleService
  ) {}
}
