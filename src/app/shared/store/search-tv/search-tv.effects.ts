import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchTVActions, SearchTVSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchTVService } from '../../services/tmdb';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SearchTVEffects {
  searchTV$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchTVActions.searchTV),
      switchMap((action) => {
        let { query } = action;
        return this.TMDBSearchTVService.tvSearchInit(query).pipe(
          map((tvResult: TVResult) => {
            return SearchTVActions.searchTVSuccess({
              tvResult: tvResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
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
      switchMap((action) => {
        let [type, currPage, totalPages, query] = action;
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
            catchError((httpErrorResponse: HttpErrorResponse) => {
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

  constructor(
    private actions$: Actions,
    private TMDBSearchTVService: TMDBSearchTVService,
    private store: Store
  ) {}
}
