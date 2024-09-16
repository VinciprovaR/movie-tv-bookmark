import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { createAction, props, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TMDBTVDetailService } from '../../features/tv/services/tmdb-tv-detail.service';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { TVDetailState } from '../../shared/interfaces/store/media-detail.interface';
import { TVDetail } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../store/auth';

export const tvDetailSuccess = createAction(
  '[TV-Detail] TV Detail Success',
  props<{ tvDetail: TVDetail }>()
);
export const tvDetailFailure = createAction(
  '[TV-Detail] TV Detail Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class TVDetailStore extends ComponentStore<TVDetailState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBTVDetailService = inject(TMDBTVDetailService);

  readonly selectTVDetail$ = this.select((state) => state.tvDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectError$ = this.select((state) => state.error);

  constructor() {
    super({ tvDetail: null, isLoading: false, error: null });
  }

  readonly cleanTVDetail = this.updater((state) => {
    return {
      isLoading: false,
      error: null,
      tvDetail: null,
    };
  });

  private readonly addTVDetailInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly addTVDetailSuccess = this.updater(
    (state, { tvDetail }: { tvDetail: TVDetail }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        tvDetail,
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
        return of(this.cleanTVDetail());
      })
    );
  });

  readonly searchTVDetail = this.effect((tvId$: Observable<number>) => {
    return tvId$.pipe(
      tap(() => {
        this.addTVDetailInit();
      }),
      switchMap((tvId) => {
        return this.TMDBTVDetailService.tvDetailChained(tvId).pipe(
          tap((tvDetail: TVDetail) => {
            this.store.dispatch(tvDetailSuccess({ tvDetail }));
            this.addTVDetailSuccess({
              tvDetail,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addTVDetailFailure(httpErrorResponse);
                this.store.dispatch(tvDetailFailure({ httpErrorResponse }));
              })
            );
          })
        );
      })
    );
  });

  logState(state: TVDetailState, action: string) {
    console.log(action, state);
  }
}
