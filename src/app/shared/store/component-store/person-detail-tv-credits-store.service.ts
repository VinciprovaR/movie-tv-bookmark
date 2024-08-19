import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';

import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../../services/tmdb/tmdb-person-detail.service';
import {
  TV,
  TVResult,
  PersonDetailTVCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';

export interface PersonDetailTVCreditsState extends StateMediaBookmark {
  personDetailTVCredits: PersonDetailTVCredits;
  personId: number;
}

// export const personDetailTVCreditsIsLoading = createAction(
//   '[Person-Detail-TV-Credits] Person Detail TV Credits Is Loading ',
//   props<{ isLoading: boolean }>()
// );
export const personDetailTVCreditsSuccess = createAction(
  '[Person-Detail-TV-Credits] Person Detail TV Credits Success ',
  props<{ tvResult: TVResult }>()
);
export const personDetailTVCreditsFailure = createAction(
  '[Person-Detail-TV-Credits] Person Detail TV Credits Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable({ providedIn: 'root' })
export class PersonDetailTVCreditsStore extends ComponentStore<PersonDetailTVCreditsState> {
  private readonly store = inject(Store);
  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectCreditsTVPersonDetail$ = this.select(
    (state) => state.personDetailTVCredits
  );

  constructor() {
    super({
      personDetailTVCredits: {
        cast: [],
        crew: [],
        id: 0,
      },
      isLoading: false,
      error: null,
      personId: 0,
    });
  }

  readonly cleanPersonDetailCreditsTV = this.updater((state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
      personId: 0,
      personDetailTVCredits: {
        cast: [],
        crew: [],
        id: 0,
      },
    };
  });

  private readonly personDetailTVCreditsInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly personDetailTVCreditsSuccess = this.updater(
    (
      state,
      {
        personDetailTVCredits,
      }: { personDetailTVCredits: PersonDetailTVCredits }
    ) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        personDetailTVCredits: { ...personDetailTVCredits },
      };
    }
  );

  private readonly personDetailTVCreditsFailure = this.updater(
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  readonly personDetailTVCredits = this.effect(
    (personId$: Observable<number>) => {
      return personId$.pipe(
        tap((personId: number) => {
          this.personDetailTVCreditsInit({ personId });
          // this.store.dispatch(
          //   personDetailTVCreditsIsLoading({ isLoading: true })
          // );
        }),
        switchMap((personId) => {
          return this.TMDBPersonDetailService.personTVCredit(personId).pipe(
            tap((personDetailTVCredits: PersonDetailTVCredits) => {
              let results = this.mergeTVList(personDetailTVCredits);
              let tvResult: TVResult = {
                page: 1,
                total_pages: 1,
                total_results: results.length,
                results,
              };
              this.store.dispatch(personDetailTVCreditsSuccess({ tvResult }));
              this.personDetailTVCreditsSuccess({ personDetailTVCredits });
              // this.store.dispatch(
              //   personDetailTVCreditsIsLoading({ isLoading: false })
              // );
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of().pipe(
                tap(() => {
                  this.personDetailTVCreditsFailure(httpErrorResponse);
                  this.store.dispatch(
                    personDetailTVCreditsFailure({ httpErrorResponse })
                  );
                  // this.store.dispatch(
                  //   personDetailTVCreditsIsLoading({ isLoading: false })
                  // );
                })
              );
            })
          );
        })
      );
    }
  );

  private mergeTVList(personDetailTVCredits: PersonDetailTVCredits) {
    return [...personDetailTVCredits.cast, ...personDetailTVCredits.crew];
  }

  logState(state: PersonDetailTVCreditsState, action: string) {
    console.log(action, state);
  }
}
