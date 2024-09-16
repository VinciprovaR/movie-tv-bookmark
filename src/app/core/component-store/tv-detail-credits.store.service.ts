import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { createAction, props, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TMDBTVDetailService } from '../../features/tv/services/tmdb-tv-detail.service';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { TVDetailCreditsState } from '../../shared/interfaces/store/media-detail.interface';
import { TVCredit } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../store/auth';

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
      }),
      switchMap((tvId) => {
        return this.TMDBTVDetailService.tvCredits(tvId).pipe(
          tap((tvCredit: TVCredit) => {
            this.addTVDetailCreditsSuccess({
              tvCredit,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addTVDetailFailure(httpErrorResponse);
                this.store.dispatch(
                  tvDetailCreditsFailure({ httpErrorResponse })
                );
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
