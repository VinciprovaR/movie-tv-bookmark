import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { createAction, props, Store } from '@ngrx/store';
import { TVCredit } from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBTVDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { AuthActions } from '../store/auth';

export interface TVDetailCreditsState extends StateMediaBookmark {
  tvCredit: TVCredit | null;
}

// export const tvDetailCreditsIsLoading = createAction(
//   '[TV-Detail-Credits] TV Detail Credits Is Loading',
//   props<{ isLoading: boolean }>()
// );
export const tvDetailCreditsFailure = createAction(
  '[TV-Detail-Credits] TV Detail Credits Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class TVDetailCreditsStore extends ComponentStore<TVDetailCreditsState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBTVDetailService = inject(TMDBTVDetailService);

  readonly selectTVCredits$ = this.select((state) => state.tvCredit);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectError$ = this.select((state) => state.error);

  constructor() {
    super({ tvCredit: null, isLoading: false, error: null });
  }

  readonly cleanTVDetailCredits = this.updater((state) => {
    return {
      isLoading: false,
      error: null,
      tvCredit: null,
    };
  });

  private readonly addTVDetailCreditsInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly addTVDetailCreditsSuccess = this.updater(
    (state, { tvCredit }: { tvCredit: TVCredit }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        tvCredit,
      };
    }
  );

  private readonly addTVDetailFailure = this.updater(
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
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(this.cleanTVDetailCredits());
      })
    );
  });

  readonly searchTVCredits = this.effect((tvId$: Observable<number>) => {
    return tvId$.pipe(
      tap(() => {
        this.addTVDetailCreditsInit();
        // this.store.dispatch(tvDetailCreditsIsLoading({ isLoading: true }));
      }),
      switchMap((tvId) => {
        return this.TMDBTVDetailService.tvCredits(tvId).pipe(
          tap((tvCredit: TVCredit) => {
            this.addTVDetailCreditsSuccess({
              tvCredit,
            });
            // this.store.dispatch(tvDetailCreditsIsLoading({ isLoading: false }));
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addTVDetailFailure(httpErrorResponse);
                this.store.dispatch(
                  tvDetailCreditsFailure({ httpErrorResponse })
                );
                // this.store.dispatch(
                //   tvDetailCreditsIsLoading({ isLoading: false })
                // );
              })
            );
          })
        );
      })
    );
  });

  logState(state: TVDetailCreditsState, action: string) {
    console.log(action, state);
  }
}
