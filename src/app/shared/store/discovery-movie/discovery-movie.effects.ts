import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryMovieActions, DiscoveryMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBDiscoveryService } from '../../services/tmdb/tmdb-discovery.service';

import {
  Movie,
  MovieDetail,
  MovieResult,
  PeopleResult,
} from '../../models/media.models';
import { Store } from '@ngrx/store';
import {
  SupabaseLifecycleDAO,
  SupabaseLifecycleService,
} from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { Movie_Life_Cycle } from '../../models/supabase/entities';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/';
import { TMDBFilterListService } from '../../services/tmdb';
import { ErrorResponse } from '../../models/error.models';
import { SupabaseDecouplingService } from '../../services/supabase/supabase-decoupling.service';
import { GenresResult } from '../../models/tmdb-filters.models';

@Injectable()
export class DiscoveryMovieEffects {
  discoveryMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovie),
      switchMap((actionParams) => {
        let { payload } = actionParams;
        return this.TMDBDiscoveryService.movieDiscoveryInit(payload)
          .pipe(
            switchMap((movieResult) => {
              return this.supabaseLifecycleService.findLifecycleListByMovieIds(
                movieResult
              );
            })
          )
          .pipe(
            map((movieResult: MovieResult) => {
              return DiscoveryMovieActions.discoveryMovieSuccess({
                movieResult: movieResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                DiscoveryMovieActions.discoveryMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  discoveryAdditionalMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryAdditionalMovie),
      withLatestFrom(
        this.store.select(DiscoveryMovieSelectors.selectMoviePage),
        this.store.select(DiscoveryMovieSelectors.selectMovieTotalPages),
        this.store.select(DiscoveryMovieSelectors.selectPayload)
      ),
      switchMap((actionParams) => {
        let [action, currPage, totalPages, payload] = actionParams;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryService.additionalMovieDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((movieResult) => {
              return this.supabaseLifecycleService
                .findLifecycleListByMovieIds(movieResult)
                .pipe(
                  map((movieResult: MovieResult) => {
                    return DiscoveryMovieActions.discoveryAdditionalMovieSuccess(
                      {
                        movieResult: movieResult,
                      }
                    );
                  }),
                  catchError((httpErrorResponse: ErrorResponse) => {
                    console.error(httpErrorResponse);
                    return of(
                      DiscoveryMovieActions.discoveryMovieFailure({
                        httpErrorResponse,
                      })
                    );
                  })
                );
            })
          );
        } else {
          return of(DiscoveryMovieActions.noAdditionalMovie());
        }
      })
    );
  });

  discoveryMovieDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovieDetail),
      switchMap((actionParams) => {
        let { movieId } = actionParams;
        return this.TMDBDiscoveryService.searchMovieDetail(movieId).pipe(
          map((movieDetail: MovieDetail) => {
            return DiscoveryMovieActions.discoveryMovieDetailSuccess({
              movieDetail: movieDetail,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  searchPeople$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.searchPeople),
      switchMap((actionParams) => {
        let { queryPeople } = actionParams;
        return this.TMDBFilterListService.retrivePeopleList(queryPeople).pipe(
          map((peopleResult: PeopleResult) => {
            return DiscoveryMovieActions.searchPeopleSuccess({
              peopleResult: peopleResult,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({
                httpErrorResponse,
              })
            );
          })
        );
      })
    );
  });

  getGenreList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.getGenreList),
      switchMap(() => {
        return this.TMDBFilterListService.retriveGenreMovieList().pipe(
          map((genresResult: GenresResult) => {
            return DiscoveryMovieActions.getGenreListSuccess({
              genreList: genresResult.genres,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryMovieActions.discoveryMovieFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  createUpdateDeleteMovieLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.createUpdateDeleteMovieLifecycle),
      withLatestFrom(
        this.store.select(AuthSelectors.selectUser),
        this.store.select(DiscoveryMovieSelectors.selectMovieResult)
      ),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user, movieResultState]: [
          { mediaLifecycleDTO: MediaLifecycleDTO },
          User | null,
          MovieResult
        ] = actionParams;
        return this.supabaseLifecycleService
          .createOrUpdateOrDeleteMovieLifecycle(
            mediaLifecycleDTO,
            user,
            movieResultState.results[mediaLifecycleDTO.index]
          )
          .pipe(
            map((movie) => {
              return DiscoveryMovieActions.createUpdateDeleteMovieLifecycleSuccess(
                {
                  movie,
                  index: mediaLifecycleDTO.index,
                }
              );
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                DiscoveryMovieActions.discoveryMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  // createUpdateDeleteMovieLifecycle$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(DiscoveryMovieActions.createUpdateDeleteMovieLifecycle),
  //     withLatestFrom(this.store.select(AuthSelectors.selectUser)),
  //     switchMap((actionParams) => {
  //       console.log('discovery effect');
  //       let [{ mediaLifecycleDTO }, user]: [
  //         { mediaLifecycleDTO: MediaLifecycleDTO },
  //         User | null
  //       ] = actionParams;
  //       return this.supabaseLifecycleService
  //         .createOrUpdateOrDeleteMovieLifecycle(mediaLifecycleDTO, user)
  //         .pipe(
  //           withLatestFrom(
  //             this.store
  //               .select(DiscoveryMovieSelectors.selectMovieResult)
  //               .pipe(
  //                 map(
  //                   (movieState: MovieResult) =>
  //                     movieState.results[mediaLifecycleDTO.index]
  //                 )
  //               )
  //           ),
  //           map((actionParams) => {
  //             let [entityMovieLifeCycle, movieState]: [
  //               Movie_Life_Cycle,
  //               Movie
  //             ] = actionParams;
  //             let movie =
  //               this.supabaseDecouplingService.injectUpdatedMovieLifecycle(
  //                 entityMovieLifeCycle,
  //                 movieState
  //               );
  //             return DiscoveryMovieActions.createUpdateDeleteMovieLifecycleSuccess(
  //               {
  //                 movie,
  //                 index: mediaLifecycleDTO.index,
  //               }
  //             );
  //           }),
  //           catchError((httpErrorResponse: ErrorResponse) => {
  //             console.error(httpErrorResponse);
  //             return of(
  //               DiscoveryMovieActions.discoveryMovieFailure({
  //                 httpErrorResponse,
  //               })
  //             );
  //           })
  //         );
  //     })
  //   );
  // });

  constructor(
    private actions$: Actions,
    private TMDBDiscoveryService: TMDBDiscoveryService,
    private TMDBFilterListService: TMDBFilterListService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService,
    private supabaseDecouplingService: SupabaseDecouplingService
  ) {}
}
