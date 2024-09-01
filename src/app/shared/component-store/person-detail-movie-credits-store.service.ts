import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { createAction, props, Store } from '@ngrx/store';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import {
  MovieResult,
  PersonDetailMovieCredits,
} from '../interfaces/TMDB/tmdb-media.interface';
import { TMDBPersonDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '../store/auth';

export interface PersonDetailMovieCreditsStoreState extends StateMediaBookmark {
  personDetailMovieCredits: PersonDetailMovieCredits;
  personId: number;
}

// export const personDetailMovieCreditsIsLoading = createAction(
//   '[Person-Detail-Movie-Credit] Person Detail Movie Credit Is Loading ',
//   props<{ isLoading: boolean }>()
// );
export const personDetailMovieCreditsSuccess = createAction(
  '[Person-Detail-Movie-Credit] Person Detail Movie Credits Success ',
  props<{ movieResult: MovieResult }>()
);
export const personDetailMovieCreditsFailure = createAction(
  '[Person-Detail-Movie-Credit] Person Detail Movie Credits  Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class PersonDetailMovieCreditsStore extends ComponentStore<PersonDetailMovieCreditsStoreState> {
  private readonly store = inject(Store);
  readonly actions$ = inject(Actions);
  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);

  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectCreditsMoviePersonDetail$ = this.select(
    (state) => state.personDetailMovieCredits
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

  readonly cleanPersonDetailCreditsMovie = this.updater((state) => {
    return {
      isLoading: false,
      error: null,
      personDetailMovieCredits: {
        cast: [],
        crew: [],
        id: 0,
      },
      personId: 0,
    };
  });

  private readonly movieCreditsInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly movieCreditsSuccess = this.updater(
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

  private readonly movieCreditsFailure = this.updater(
    (state, { error }: { error: CustomHttpErrorResponseInterface }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  readonly cleanState$ = this.effect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutLocalSuccess),
      switchMap((action) => {
        return of(this.cleanPersonDetailCreditsMovie());
      })
    );
  });

  readonly movieCredits = this.effect((personId$: Observable<number>) => {
    return personId$.pipe(
      tap((personId: number) => {
        // this.store
        //   .dispatch
        //    personDetailMovieCreditsIsLoading({ isLoading: true })
        //   ();
        this.movieCreditsInit({ personId });
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
            // this.store.dispatch(
            //   personDetailMovieCreditsIsLoading({ isLoading: false })
            // );
            this.store.dispatch(
              personDetailMovieCreditsSuccess({ movieResult })
            );
            this.movieCreditsSuccess({ personDetailMovieCredits });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.movieCreditsFailure(httpErrorResponse);
                this.store.dispatch(
                  personDetailMovieCreditsFailure({ httpErrorResponse })
                );
                // this.store.dispatch(
                //   personDetailMovieCreditsIsLoading({ isLoading: false })
                // );
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

  logState(state: PersonDetailMovieCreditsStoreState, action: string) {
    console.log(action, state);
  }
}
