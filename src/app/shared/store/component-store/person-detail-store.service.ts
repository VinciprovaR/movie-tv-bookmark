import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import { PersonDetail } from '../../interfaces/TMDB/tmdb-media.interface';

import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../../services/tmdb/tmdb-person-detail.service';

export interface PersonDetailState extends StateMediaBookmark {
  personDetail: PersonDetail | null;

  personId: number;
}

// export const personDetailIsLoading = createAction(
//   '[Person-Detail] Person Detail Is Loading',
//   props<{ isLoading: boolean }>()
// );
export const personDetailFailure = createAction(
  '[Person-Detail] Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable({ providedIn: 'root' })
export class PersonDetailStore extends ComponentStore<PersonDetailState> {
  private readonly store = inject(Store);
  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);

  readonly selectPersonDetail$ = this.select((state) => state.personDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({
      personDetail: null,
      isLoading: false,
      error: null,
      personId: 0,
    });
  }

  readonly cleanPersonDetail = this.updater((state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
      personDetail: null,
      personId: 0,
    };
  });

  private readonly personDetailInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly personDetailSuccess = this.updater(
    (state, { personDetail }: { personDetail: PersonDetail }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        personDetail: { ...personDetail },
      };
    }
  );

  private readonly personDetailFailure = this.updater(
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  readonly searchPersonDetail = this.effect((personId$: Observable<number>) => {
    return personId$.pipe(
      tap((personId: number) => {
        this.personDetailInit({ personId });
        // this.store.dispatch(personDetailIsLoading({ isLoading: true }));
      }),
      switchMap((personId: number) => {
        return this.TMDBPersonDetailService.personDetail(personId).pipe(
          tap((personDetail: PersonDetail) => {
            this.personDetailSuccess({ personDetail });
            // this.store.dispatch(personDetailIsLoading({ isLoading: false }));
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
              tap(() => {
                this.personDetailFailure(httpErrorResponse);
                this.store.dispatch(personDetailFailure({ httpErrorResponse }));
                // this.store.dispatch(
                //   personDetailIsLoading({ isLoading: false })
                // );
              })
            );
          })
        );
      })
    );
  });

  logState(state: PersonDetailState, action: string) {
    console.log(action, state);
  }
}
