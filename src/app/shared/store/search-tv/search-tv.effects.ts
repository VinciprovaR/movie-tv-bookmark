import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchTVActions, SearchTVSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchService } from '../../services/tmdb';
import { TVDetail, TVResult } from '../../models/media.models';
import { Store } from '@ngrx/store';
import { SupabaseLifecycleService } from '../../services/supabase';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/';
import { ErrorResponse } from '../../models/error.models';

@Injectable()
export class SearchTVEffects {
  searchTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTV),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.TMDBSearchService.tvSearchInit(query).pipe(
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

  constructor(
    private actions$: Actions,
    private TMDBSearchService: TMDBSearchService,
    private store: Store,
    private supabaseLifecycleService: SupabaseLifecycleService
  ) {}
}
