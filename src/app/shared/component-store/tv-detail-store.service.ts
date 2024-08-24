import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import { TVDetail } from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBTVDetailService } from '../services/tmdb';

export interface TVDetailState extends StateMediaBookmark {
  tvDetail: TVDetail | null;
}

// export const tvDetailIsLoading = createAction(
//   '[TV-Detail] TV Detail Is Loading',
//   props<{ isLoading: boolean }>()
// );
export const tvDetailSuccess = createAction(
  '[TV-Detail] TV Detail Success',
  props<{ tvDetail: TVDetail }>()
);
export const tvDetailFailure = createAction(
  '[TV-Detail] TV Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable({ providedIn: 'root' })
export class TVDetailStore extends ComponentStore<TVDetailState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBTVDetailService = inject(TMDBTVDetailService);

  readonly selectTVDetail$ = this.select((state) => state.tvDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ tvDetail: null, isLoading: false, error: null });
  }

  readonly cleanTVDetail = this.updater((state) => {
    return {
      ...state,
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
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );
  readonly searchTVDetail = this.effect((tvId$: Observable<number>) => {
    return tvId$.pipe(
      tap(() => {
        // this.store.dispatch(tvDetailIsLoading({ isLoading: true }));
        this.addTVDetailInit();
      }),
      switchMap((tvId) => {
        return this.TMDBTVDetailService.tvDetailChained(tvId).pipe(
          tap((tvDetail: TVDetail) => {
            this.store.dispatch(tvDetailSuccess({ tvDetail }));
            // this.store.dispatch(tvDetailIsLoading({ isLoading: false }));
            this.addTVDetailSuccess({
              tvDetail,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of(null).pipe(
              tap(() => {
                this.addTVDetailFailure(httpErrorResponse);
                this.store.dispatch(tvDetailFailure({ httpErrorResponse }));
                // this.store.dispatch(tvDetailIsLoading({ isLoading: false }));
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
