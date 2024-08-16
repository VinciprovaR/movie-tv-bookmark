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

export interface CreditsTVPersonDetailState extends StateMediaBookmark {
  personDetailTVCredits: PersonDetailTVCredits;
  personId: number;
}

export const creditsTVSuccessPersonDetail = createAction(
  '[Person-Detail] Credits TV Success Person Detail',
  props<{ tvResult: TVResult }>()
);
export const creditsTVPersonDetailFailure = createAction(
  '[Person-Detail/API] Credits TV Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class PersonDetailTVCreditsStore extends ComponentStore<CreditsTVPersonDetailState> {
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

  private readonly creditsTVInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly creditsTVSuccess = this.updater(
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

  private readonly creditsTVFailure = this.updater(
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  readonly creditsTV = this.effect((personId$: Observable<number>) => {
    return personId$.pipe(
      tap((personId: number) => {
        this.creditsTVInit({ personId });
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
            this.store.dispatch(creditsTVSuccessPersonDetail({ tvResult }));
            this.creditsTVSuccess({ personDetailTVCredits });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
              tap(() => {
                this.creditsTVFailure(httpErrorResponse);
                this.store.dispatch(
                  creditsTVPersonDetailFailure({ httpErrorResponse })
                );
              })
            );
          })
        );
      })
    );
  });

  private mergeTVList(personDetailTVCredits: PersonDetailTVCredits) {
    return [...personDetailTVCredits.cast, ...personDetailTVCredits.crew];
  }

  logState(state: CreditsTVPersonDetailState, action: string) {
    console.log(action, state);
  }
}
