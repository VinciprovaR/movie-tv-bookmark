import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryMovieActions, DiscoveryMovieSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBDiscoveryService } from '../../services/tmdb/tmdb-discovery.service';

import {
  MovieDetail,
  MovieResult,
  PeopleResult,
} from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { TMDBFilterListService } from '../../services/tmdb';
import { ErrorResponse } from '../../interfaces/error.interface';
import {
  Certification,
  Certifications,
  GenresResult,
  Language,
} from '../../interfaces/tmdb-filters.interface';

@Injectable()
export class DiscoveryMovieEffects {
  discoveryMovie$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.discoveryMovie),
      switchMap((actionParams) => {
        let { payload } = actionParams;
        return this.TMDBDiscoveryService.movieDiscoveryInit(payload).pipe(
          switchMap((movieResult: MovieResult) => {
            if (!payload.includeMediaWithLifecycle) {
              return this.supabaseLifecycleService.removeMovieWithLifecycle(
                movieResult
              );
            }
            return of(movieResult);
          }),
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
            switchMap((movieResult: MovieResult) => {
              if (!payload.includeMediaWithLifecycle) {
                return this.supabaseLifecycleService.removeMovieWithLifecycle(
                  movieResult
                );
              }
              return of(movieResult);
            }),
            map((movieResult: MovieResult) => {
              return DiscoveryMovieActions.discoveryAdditionalMovieSuccess({
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

  getCertifications$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.getCertificationList),
      switchMap(() => {
        return this.TMDBFilterListService.retriveCertificationMovieList().pipe(
          map((certificationList: Certification[]) => {
            return DiscoveryMovieActions.getCertificationListSuccess({
              certificationList,
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

  getLanguages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryMovieActions.getLanguagesList),
      switchMap(() => {
        return this.TMDBFilterListService.retriveLanguagesList().pipe(
          map((languageList: Language[]) => {
            return DiscoveryMovieActions.getLanguagesListSuccess({
              languageList,
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

  constructor(
    private actions$: Actions,
    private TMDBDiscoveryService: TMDBDiscoveryService,
    private TMDBFilterListService: TMDBFilterListService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
