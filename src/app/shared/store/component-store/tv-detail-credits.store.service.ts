import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import { TVCredit, TVDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBTVDetailService } from '../../services/tmdb/tmdb-tv-detail.service';
import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';

export interface TVDetailCreditsState extends StateMediaBookmark {
  tvCredit: TVCredit | null;
}

export const tvDetailCreditsFailure = createAction(
  '[TV-Detail-Credits/API] TV Detail Credits Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class TVDetailCreditsStore extends ComponentStore<TVDetailCreditsState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBTVDetailService = inject(TMDBTVDetailService);

  readonly selectTVCredits$ = this.select((state) => state.tvCredit);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ tvCredit: null, isLoading: false, error: null });
  }

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
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );
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
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
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
