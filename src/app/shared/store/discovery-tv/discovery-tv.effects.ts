import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DiscoveryTVActions, DiscoveryTVSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import {
  TVDetail,
  TVResult,
  PeopleResult,
} from '../../interfaces/media.interface';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import {
  TMDBDiscoveryTVService,
  TMDBFilterTVService,
} from '../../services/tmdb';
import { ErrorResponse } from '../../interfaces/error.interface';
import {
  GenresResult,
  Language,
} from '../../interfaces/tmdb-filters.interface';

@Injectable()
export class DiscoveryTVEffects {
  discoveryTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryTV),
      switchMap((actionParams) => {
        let { payload } = actionParams;
        return this.TMDBDiscoveryTVService.tvDiscoveryInit(payload).pipe(
          switchMap((tvResult: TVResult) => {
            if (!payload.includeMediaWithLifecycle) {
              return this.supabaseLifecycleService.removeTVWithLifecycle(
                tvResult
              );
            }
            return of(tvResult);
          }),
          map((tvResult: TVResult) => {
            return DiscoveryTVActions.discoveryTVSuccess({
              tvResult: tvResult,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryTVActions.discoveryTVFailure({
                httpErrorResponse,
              })
            );
          })
        );
      })
    );
  });

  discoveryAdditionalTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryAdditionalTV),
      withLatestFrom(
        this.store.select(DiscoveryTVSelectors.selectTVPage),
        this.store.select(DiscoveryTVSelectors.selectTVTotalPages),
        this.store.select(DiscoveryTVSelectors.selectPayload)
      ),
      switchMap((actionParams) => {
        let [action, currPage, totalPages, payload] = actionParams;
        if (currPage < totalPages) {
          return this.TMDBDiscoveryTVService.additionalTVDiscovery(
            currPage,
            payload
          ).pipe(
            switchMap((tvResult: TVResult) => {
              if (!payload.includeMediaWithLifecycle) {
                return this.supabaseLifecycleService.removeTVWithLifecycle(
                  tvResult
                );
              }
              return of(tvResult);
            }),
            map((tvResult: TVResult) => {
              return DiscoveryTVActions.discoveryAdditionalTVSuccess({
                tvResult: tvResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                DiscoveryTVActions.discoveryTVFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        } else {
          return of(DiscoveryTVActions.noAdditionalTV());
        }
      })
    );
  });

  discoveryTVDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.discoveryTVDetail),
      switchMap((actionParams) => {
        let { tvId } = actionParams;
        return this.TMDBDiscoveryTVService.tvDetail(tvId).pipe(
          map((tvDetail: TVDetail) => {
            return DiscoveryTVActions.discoveryTVDetailSuccess({
              tvDetail: tvDetail,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryTVActions.discoveryTVFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  getGenreList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.getGenreList),
      switchMap(() => {
        return this.TMDBFilterTVService.retriveGenreTVList().pipe(
          map((genresResult: GenresResult) => {
            return DiscoveryTVActions.getGenreListSuccess({
              genreList: genresResult.genres,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryTVActions.discoveryTVFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  getLanguages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DiscoveryTVActions.getLanguagesList),
      switchMap(() => {
        return this.TMDBFilterTVService.retriveLanguagesList().pipe(
          map((languageList: Language[]) => {
            return DiscoveryTVActions.getLanguagesListSuccess({
              languageList,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(
              DiscoveryTVActions.discoveryTVFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBDiscoveryTVService: TMDBDiscoveryTVService,
    private TMDBFilterTVService: TMDBFilterTVService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
