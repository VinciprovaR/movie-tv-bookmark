import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { SearchPeopleActions, SearchPeopleSelectors } from '.';
import { TMDBSearchPeopleService } from '../../../features/people/services/tmdb-search-people.service';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import { PeopleResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../auth';

@Injectable()
export class SearchPeopleEffects {
  private readonly actions$ = inject(Actions);
  private readonly TMDBSearchPeopleService = inject(TMDBSearchPeopleService);
  private readonly store = inject(Store);

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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
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
        let [, currPage, totalPages, query] = action;
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
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  SearchPeopleActions.searchPeopleFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        } else {
          return of(SearchPeopleActions.noAdditionalPeople());
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
        return of(SearchPeopleActions.cleanState());
      })
    );
  });
}
