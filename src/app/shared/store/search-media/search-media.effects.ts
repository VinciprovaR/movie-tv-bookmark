import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchMediaActions, SearchMediaSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { ErrorResponse } from '../../models/auth.models';
import {
  MediaType,
  MovieDetail,
  MovieResult,
  TVDetail,
  TVResult,
} from '../../models';
import { Store } from '@ngrx/store';
import { SupabaseMovieLifecycleService } from '../../services/supabase.movie_life_cycle.service';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { Movie_Life_Cycle } from '../../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';
import { TV_Life_Cycle } from '../../models/supabase/entities/tv_life_cycle.entity';

@Injectable()
export class SearchMovieEffects {
  searchMedia$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.searchMedia),
      switchMap((actionParams) => {
        let { query, mediaType } = actionParams;
        console.log(query, mediaType);
        return this.tmdbSearchService
          .mediaSearchInit(query, mediaType)
          .pipe(
            switchMap((mediaResult) => {
              return this.lifecycleService.initMediaLifecycle(
                mediaResult,
                mediaType
              );
            })
          )
          .pipe(
            map((mediaResult: MovieResult | TVResult) => {
              return SearchMediaActions.searchMediaSuccess({
                mediaResult: mediaResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                SearchMediaActions.searchMediaFailure({ httpErrorResponse })
              );
            })
          );
      })
    );
  });

  searchAdditionalMedia$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.searchAdditionalMedia),
      withLatestFrom(
        this.store.select(SearchMediaSelectors.selectMediaPage),
        this.store.select(SearchMediaSelectors.selectMediaTotalPages),
        this.store.select(SearchMediaSelectors.selectQuery)
      ),
      switchMap((actionParams) => {
        let [{ mediaType }, currPage, totalPages, query] = actionParams;
        if (currPage < totalPages) {
          return this.tmdbSearchService
            .additionalMediaSearch(currPage, query, mediaType)
            .pipe(
              switchMap((mediaResult) => {
                return this.lifecycleService
                  .initMediaLifecycle(mediaResult, mediaType)
                  .pipe(
                    map((mediaResult: MovieResult | TVResult) => {
                      return SearchMediaActions.searchAdditionalMediaSuccess({
                        mediaResult: mediaResult,
                      });
                    }),
                    catchError((httpErrorResponse: ErrorResponse) => {
                      console.error(httpErrorResponse);
                      return of(
                        SearchMediaActions.searchMediaFailure({
                          httpErrorResponse,
                        })
                      );
                    })
                  );
              })
            );
        } else {
          return of(SearchMediaActions.noAdditionalMedia());
        }
      })
    );
  });

  searchMovieDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.searchMediaDetail),
      switchMap((actionParams) => {
        return this.tmdbSearchService
          .searchMediaDetail(actionParams.mediaId, actionParams.mediaType)
          .pipe(
            map((mediaDetail: MovieDetail | TVDetail) => {
              if (actionParams.mediaType === 'movie') {
                return SearchMediaActions.searchMovieDetailSuccess({
                  movieDetail: mediaDetail as MovieDetail,
                });
              } else {
                return SearchMediaActions.searchTVDetailSuccess({
                  tvDetail: mediaDetail as TVDetail,
                });
              }
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                SearchMediaActions.searchMediaFailure({ httpErrorResponse })
              );
            })
          );
      })
    );
  });

  setMediaLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.createUpdateDeleteMediaLifecycle),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO, mediaType }, user]: [
          { mediaLifecycleDTO: MediaLifecycleDTO; mediaType: MediaType },
          User | null
        ] = actionParams;
        return this.lifecycleService
          .createOrUpdateOrDeleteMediaLifecycle(
            mediaLifecycleDTO,
            mediaType,
            user
          )
          .pipe(
            map((entityMediaLifeCycle: Movie_Life_Cycle | TV_Life_Cycle) => {
              return SearchMediaActions.createUpdateDeleteMediaLifecycleSuccess(
                {
                  entityMediaLifeCycle,
                  index: mediaLifecycleDTO.index,
                }
              );
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                SearchMediaActions.searchMediaFailure({ httpErrorResponse })
              );
            })
          );
      })
    );
  });

  getMediaLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.getMediaLifecycleEnum),
      switchMap((actionParams) => {
        return this.lifecycleService.findLifecycleEnum().pipe(
          map((lifecycleEnum: any) => {
            return SearchMediaActions.getMediaLifecycleEnumSuccess({
              lifecycleEnum: lifecycleEnum.data,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              SearchMediaActions.searchMediaFailure({ httpErrorResponse })
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
    private lifecycleService: SupabaseMovieLifecycleService
  ) {}
}
/*
    searchAdditionalMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.searchAdditionalMovie),
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
                      return SearchMediaActions.searchAdditionalMovieSuccess({
                        movieResult: movieResult,
                      });
                    }),
                    catchError((httpErrorResponse: ErrorResponse) => {
                      console.error(httpErrorResponse);
                      return of(
                        SearchMediaActions.searchMovieFailure({
                          httpErrorResponse,
                        })
                      );
                    })
                  );
              })
            );
        } else {
          return of(SearchMediaActions.noAdditionalMovie());
        }
      })
    );
  });
  });










  searchMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchMediaActions.searchMovie),
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
              return SearchMediaActions.searchMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                SearchMediaActions.searchMovieFailure({ httpErrorResponse })
              );
            })
          );
      })
    );
  });
  
  */
