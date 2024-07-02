import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchTVActions, SearchTVSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TMDBSearchService } from '../../services/tmdb';
import { TV, TVDetail, TVResult } from '../../models/media.models';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { TV_Life_Cycle } from '../../models/supabase/entities';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/';
import { ErrorResponse } from '../../models/error.models';
import { SupabaseDecouplingService } from '../../services/supabase/supabase-decoupling.service';

@Injectable()
export class SearchTVEffects {
  searchTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTV),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.TMDBSearchService.tvSearchInit(query)
          .pipe(
            switchMap((tvResult) => {
              return this.supabaseLifecycleService.findLifecycleListByTVIds(
                tvResult
              );
            })
          )
          .pipe(
            map((tvResult: TVResult) => {
              return SearchTVActions.searchTVSuccess({
                tvResult: tvResult,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(SearchTVActions.searchTVFailure({ httpErrorResponse }));
            })
          );
      })
    );
  });

  searchAdditionalTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchAdditionalTV),
      withLatestFrom(
        this.store.select(SearchTVSelectors.selectTVPage),
        this.store.select(SearchTVSelectors.selectTVTotalPages),
        this.store.select(SearchTVSelectors.selectQuery)
      ),
      switchMap((actionParams) => {
        let [action, currPage, totalPages, query] = actionParams;
        if (currPage < totalPages) {
          return this.TMDBSearchService.additionalTVSearch(
            currPage,
            query
          ).pipe(
            switchMap((tvResult) => {
              return this.supabaseLifecycleService
                .findLifecycleListByTVIds(tvResult)
                .pipe(
                  map((tvResult: TVResult) => {
                    return SearchTVActions.searchAdditionalTVSuccess({
                      tvResult: tvResult,
                    });
                  }),
                  catchError((httpErrorResponse: ErrorResponse) => {
                    console.error(httpErrorResponse);
                    return of(
                      SearchTVActions.searchTVFailure({
                        httpErrorResponse,
                      })
                    );
                  })
                );
            })
          );
        } else {
          return of(SearchTVActions.noAdditionalTV());
        }
      })
    );
  });

  searchTVDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTVDetail),
      switchMap((actionParams) => {
        let { tvId } = actionParams;
        return this.TMDBSearchService.searchTVDetail(tvId).pipe(
          map((tvDetail: TVDetail) => {
            return SearchTVActions.searchTVDetailSuccess({
              tvDetail: tvDetail,
            });
          }),
          catchError((httpErrorResponse: ErrorResponse) => {
            console.error(httpErrorResponse);
            return of(SearchTVActions.searchTVFailure({ httpErrorResponse }));
          })
        );
      })
    );
  });

  createUpdateDeleteTVLifecycle$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.createUpdateDeleteTVLifecycle),
      withLatestFrom(
        this.store.select(AuthSelectors.selectUser),
        this.store.select(SearchTVSelectors.selectTVResult)
      ),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user, TVResultState]: [
          { mediaLifecycleDTO: MediaLifecycleDTO },
          User | null,
          TVResult
        ] = actionParams;
        return this.supabaseLifecycleService
          .createOrUpdateOrDeleteTVLifecycle(
            mediaLifecycleDTO,
            user,
            TVResultState.results[mediaLifecycleDTO.index]
          )
          .pipe(
            map((tv) => {
              return SearchTVActions.createUpdateDeleteTVLifecycleSuccess({
                tv,
                index: mediaLifecycleDTO.index,
              });
            }),
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                SearchTVActions.searchTVFailure({
                  httpErrorResponse,
                })
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
