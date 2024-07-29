import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';

import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../../services/tmdb/tmdb-person-detail.service';
import {
  Movie,
  MovieResult,
  PersonDetailMovieCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';

export interface CreditsMoviePersonDetailState extends StateMediaBookmark {
  personDetailMovieCredits: PersonDetailMovieCredits;
  personId: number;
}

export const creditsMovieSuccessPersonDetail = createAction(
  '[Person-Detail] Credits Movie Success Person Detail',
  props<{ movieResult: MovieResult }>()
);
export const creditsMoviePersonDetailFailure = createAction(
  '[Person-Detail/API] Credits Movie Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class PersonDetailCreditsMovieStore extends ComponentStore<CreditsMoviePersonDetailState> {
  private readonly store = inject(Store);

  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);

  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectCreditsMoviePersonDetail$ = this.select(
    (state) => state.personDetailMovieCredits
  ).pipe(
    map((personDetailMovieCredits: PersonDetailMovieCredits) => {
      return this.mergeMovieList(personDetailMovieCredits);
    })
  );

  constructor() {
    super({
      personDetailMovieCredits: {
        cast: [],
        crew: [],
        id: 0,
      },
      isLoading: false,
      error: null,
      personId: 0,
    });
  }

  private readonly creditsMovieInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly creditsMovieSuccess = this.updater(
    (
      state,
      {
        personDetailMovieCredits,
      }: { personDetailMovieCredits: PersonDetailMovieCredits }
    ) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        personDetailMovieCredits: { ...personDetailMovieCredits },
      };
    }
  );

  private readonly creditsMovieFailure = this.updater(
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  readonly creditsMovie = this.effect((personId$: Observable<number>) => {
    return personId$.pipe(
      tap((personId: number) => {
        this.creditsMovieInit({ personId });
      }),
      switchMap((personId) => {
        return this.TMDBPersonDetailService.personMovieCredit(personId).pipe(
          tap((personDetailMovieCredits: PersonDetailMovieCredits) => {
            let results = this.mergeMovieList(personDetailMovieCredits);
            let movieResult: MovieResult = {
              page: 1,
              total_pages: 1,
              total_results: results.length,
              results,
            };
            this.store.dispatch(
              creditsMovieSuccessPersonDetail({ movieResult })
            );
            this.creditsMovieSuccess({ personDetailMovieCredits });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
              tap(() => {
                this.creditsMovieFailure(httpErrorResponse);
                this.store.dispatch(
                  creditsMoviePersonDetailFailure({ httpErrorResponse })
                );
              })
            );
          })
        );
      })
    );
  });

  private mergeMovieList(personDetailMovieCredits: PersonDetailMovieCredits) {
    return [...personDetailMovieCredits.cast, ...personDetailMovieCredits.crew];
  }

  logState(state: CreditsMoviePersonDetailState, action: string) {
    console.log(action, state);
  }
}
