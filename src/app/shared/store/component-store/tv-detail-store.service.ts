import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { SearchTVActions } from '../search-tv';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import {
  Media,
  MediaCredit,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBTVDetailService } from '../../services/tmdb/tmdb-tv-detail.service';
import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';

export interface TVDetailState extends StateMediaBookmark {
  tvDetail: (TVDetail & MediaCredit) | null;
}

export const tvDetailFailure = createAction(
  '[TV-Detail/API] TV Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class TVDetailStore extends ComponentStore<TVDetailState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBTVDetailService = inject(TMDBTVDetailService);

  readonly selectTVDetail$ = this.select((state) => state.tvDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ tvDetail: null, isLoading: false, error: null });
  }

  private readonly addTVDetailInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly addTVDetailSuccess = this.updater(
    (
      state,
      { tvDetail, tvCredit }: { tvDetail: TVDetail; tvCredit: MediaCredit }
    ) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        tvDetail: { ...tvDetail, ...tvCredit },
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
        this.addTVDetailInit();
      }),
      switchMap((tvId) => {
        return this.TMDBTVDetailService.tvDetail(tvId).pipe(
          switchMap((tvDetail: TVDetail) => {
            return this.TMDBTVDetailService.tvCredit(tvId).pipe(
              tap((tvCredit: MediaCredit) => {
                this.addTVDetailSuccess({ tvDetail, tvCredit });
              })
            );
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
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
