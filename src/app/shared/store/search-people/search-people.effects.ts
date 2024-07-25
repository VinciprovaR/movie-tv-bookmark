import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SearchPeopleActions, SearchPeopleSelectors } from '.';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TMDBSearchPeopleService } from '../../services/tmdb';
import { PeopleResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SearchPeopleEffects {
  searchPeople$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchPeopleActions.searchPeople),
      switchMap((action) => {
        let { query } = action;
        return this.TMDBSearchPeopleService.peopleSearchInit(query).pipe(
          map((peopleResult: PeopleResult) => {
            return SearchPeopleActions.searchPeopleSuccess({
              peopleResult: peopleResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(
              SearchPeopleActions.searchPeopleFailure({ httpErrorResponse })
            );
          })
        );
      })
    );
  });

  searchAdditionalPeople$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchPeopleActions.searchAdditionalPeople),
      withLatestFrom(
        this.store.select(SearchPeopleSelectors.selectPeoplePage),
        this.store.select(SearchPeopleSelectors.selectPeopleTotalPages),
        this.store.select(SearchPeopleSelectors.selectQuery)
      ),
      switchMap((action) => {
        let [type, currPage, totalPages, query] = action;
        if (currPage < totalPages) {
          return this.TMDBSearchPeopleService.additionalPeopleSearch(
            currPage,
            query
          ).pipe(
            map((peopleResult: PeopleResult) => {
              return SearchPeopleActions.searchAdditionalPeopleSuccess({
                peopleResult: peopleResult,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                SearchPeopleActions.searchPeopleFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        } else {
          return of(SearchPeopleActions.noAdditionalPeople());
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBSearchPeopleService: TMDBSearchPeopleService,
    private store: Store
  ) {}
}
