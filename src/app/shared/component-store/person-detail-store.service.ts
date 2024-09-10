import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { createAction, props, Store } from '@ngrx/store';
import { PersonDetail } from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '../store/auth';

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
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class PersonDetailStore extends ComponentStore<PersonDetailState> {
  private readonly store = inject(Store);
  readonly actions$ = inject(Actions);
  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);

  readonly selectPersonDetail$ = this.select((state) => state.personDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectError$ = this.select((state) => state.error);

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
        return of(this.cleanPersonDetail());
      })
    );
  });

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
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
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
