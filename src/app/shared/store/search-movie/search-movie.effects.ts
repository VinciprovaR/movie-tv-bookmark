import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMovieActions, SearchMovieSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { ErrorResponse } from '../../models/auth.models';
import { MovieDetail, MovieLifecycle, MovieResult } from '../../models';
import { Store } from '@ngrx/store';
import { SupabaseMovieLifecycleService } from '../../services/supabase.movie_life_cycle.service';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import {
  Lifecycle_Enum,
  Movie_Life_Cycle,
} from '../../models/supabase/movie_life_cycle.model';
import { BroadcastChannelService } from '../../services/broadcast-channel.service';

@Injectable()
export class SearchMovieEffects {
  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((actionParams) => {
        return this.tmdbSearchService
          .searchMoviesInit(actionParams.query)
          .pipe(
            switchMap((movieResult) => {
              return this.lifecycleService.initMovieLifecycle(movieResult);
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
      switchMap((actionParams) => {
        let [action, currPage, totalPages, query] = actionParams;
        if (currPage < totalPages) {
          return this.tmdbSearchService
            .searchAdditionalMovies(currPage, query)
            .pipe(
              switchMap((movieResult) => {
                return this.lifecycleService
                  .initMovieLifecycle(movieResult)
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
        return this.tmdbSearchService
          .searchMovieDetail(actionParams.movieId)
          .pipe(
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

  setMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.createOrUpdateOrDeleteMovieLifecycleLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((actionParams) => {
        let [movieLifecycle, user]: [MovieLifecycle, User | null] =
          actionParams;
        return this.lifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(movieLifecycle, user)
          .pipe(
            map((movieLifeCycleResultDB: Movie_Life_Cycle) => {
              return SearchMovieActions.createOrUpdateOrDeleteMovieLifecycleSuccess(
                {
                  movieLifeCycleResultDB,
                  index: movieLifecycle.index,
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

  getMediaLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.getMediaLifecycleEnum),
      switchMap((actionParams) => {
        return this.lifecycleService.findLifecycleEnum().pipe(
          map((lifecycleEnum: any) => {
            return SearchMovieActions.getMediaLifecycleEnumSuccess({
              lifecycleEnum: lifecycleEnum.data,
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
    private lifecycleService: SupabaseMovieLifecycleService,
    private broadcastChannelService: BroadcastChannelService
  ) {}
}
/*
    searchAdditionalMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchAdditionalMovie),
      withLatestFrom(
        this.store.select(SearchMovieSelectors.selectMoviesPage),
        this.store.select(SearchMovieSelectors.selectMoviesTotalPages),
        this.store.select(SearchMovieSelectors.selectQuery)
      ),
      switchMap((actionParams) => {
        let [action, currPage, totalPages, searchQuery] = actionParams;
        if (currPage < totalPages) {
          return this.tmdbSearchService
            .searchAdditionalMovies(currPage, searchQuery)
            .pipe(
              switchMap((movieResult) => {
                return this.lifecycleService
                  .initMovieLifecycle(movieResult)
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
  });










  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMovieActions.searchMovie),
      switchMap((searchMetadata) => {
        return this.tmdbSearchService
          .searchInitMovies(searchMetadata)
          .pipe(
            switchMap((movieResult) => {
              let movieIdList: number[] = [];
              let movieIdMapIndex: any = {};
              for (let i = 0; i < movieResult.results.length; i++) {
                movieIdList.push(movieResult.results[i].id);
                movieIdMapIndex[movieResult.results[i].id] = i;
              }
              return this.lifecycleService
                .findLifecycleListByMovieIds(movieIdList)
                .pipe(
                  map((movieLifecycle) => {
                    // console.log('movieLifecycle', movieLifecycle);
                    // console.log('movieIdList', movieIdList);
                    // console.log('movieIdMapIndex', movieIdMapIndex);
                    movieLifecycle.data.forEach((mlc: any) => {
                      movieResult.results[
                        movieIdMapIndex[mlc.movie_id]
                      ].lifeCycleId = mlc.lifecycle_id;
                    });

                    return movieResult;
                  })
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
  
  */
