import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchTVActions, SearchTVSelectors } from '.';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { TmdbSearchService } from '../../services/tmdb-search.service';
import { ErrorResponse } from '../../models/auth.models';
import { TVDetail, TVResult } from '../../models';
import { Store } from '@ngrx/store';
import { SupabaseMediaLifecycleService } from '../../services/supabase.media_life_cycle.service';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { TV_Life_Cycle } from '../../models/supabase/entities/tv_life_cycle.entity';
import { MediaLifecycleDTO } from '../../models/supabase/DTO/media-lifecycle.DTO';

@Injectable()
export class SearchTVEffects {
  searchTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTV),
      switchMap((actionParams) => {
        let { query } = actionParams;
        return this.tmdbSearchService
          .tvSearchInit(query)
          .pipe(
            switchMap((tvResult) => {
              return this.supabaseMediaLifecycleService.injectTVLifecycle(
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
          return this.tmdbSearchService
            .additionalTVSearch(currPage, query)
            .pipe(
              switchMap((tvResult) => {
                return this.supabaseMediaLifecycleService
                  .injectTVLifecycle(tvResult)
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
        return this.tmdbSearchService.searchTVDetail(tvId).pipe(
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
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((actionParams) => {
        let [{ mediaLifecycleDTO }, user]: [
          { mediaLifecycleDTO: MediaLifecycleDTO },
          User | null
        ] = actionParams;
        return this.supabaseMediaLifecycleService
          .createOrUpdateOrDeleteTVLifecycle(mediaLifecycleDTO, user)
          .pipe(
            map((entityTVLifeCycle: TV_Life_Cycle) => {
              return SearchTVActions.createUpdateDeleteTVLifecycleSuccess({
                entityTVLifeCycle,
                index: mediaLifecycleDTO.index,
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
    private tmdbSearchService: TmdbSearchService,
    private store: Store,
    private supabaseMediaLifecycleService: SupabaseMediaLifecycleService
  ) {}
}
