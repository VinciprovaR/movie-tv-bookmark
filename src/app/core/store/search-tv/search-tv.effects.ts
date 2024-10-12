import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { SearchTVActions, SearchTVSelectors } from '.';
import { TMDBSearchTVService } from '../../../features/tv/services/tmdb-search-tv.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';

@Injectable()
export class SearchTVEffects {
  private readonly actions$ = inject(Actions);
  private readonly TMDBSearchTVService = inject(TMDBSearchTVService);
  private readonly store = inject(Store);

  searchTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTV),
      switchMap((action) => {
        let { query } = action;
        if (query) {
          return this.TMDBSearchTVService.tvSearchInit(query).pipe(
            map((tvResult: TVResult) => {
              return SearchTVActions.searchTVSuccess({
                tvResult: tvResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  SearchTVActions.searchTVFailure({ httpErrorResponse })
                );
              }
            )
          );
        }
        return of(SearchTVActions.cleanState());
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
      switchMap((action) => {
        let [, currPage, totalPages, query] = action;
        if (currPage < totalPages) {
          return this.TMDBSearchTVService.additionalTVSearch(
            currPage,
            query
          ).pipe(
            map((tvResult: TVResult) => {
              return SearchTVActions.searchAdditionalTVSuccess({
                tvResult: tvResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  SearchTVActions.searchTVFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        } else {
          return of(SearchTVActions.noAdditionalTV());
        }
      })
    );
  });

  cleanState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(SearchTVActions.cleanState());
      })
    );
  });
}
