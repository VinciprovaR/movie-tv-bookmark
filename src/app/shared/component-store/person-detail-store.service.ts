import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { createAction, props, Store } from '@ngrx/store';
import {
  MovieResult,
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
  TVResult,
} from '../interfaces/TMDB/tmdb-media.interface';
import { TMDBPersonDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '../store/auth';
import { PersonDetailState } from '../interfaces/store/person-detail.interface';

export const personDetailTVCreditsSuccess = createAction(
  '[Person-Detail-TV-Credits] Person Detail TV Credits Success ',
  props<{ tvResult: TVResult }>()
);
export const personDetailMovieCreditsSuccess = createAction(
  '[Person-Detail-Movie-Credit] Person Detail Movie Credits Success ',
  props<{ movieResult: MovieResult }>()
);

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
  readonly selectpersonDetailMovieCredits$ = this.select(
    (state) => state.personDetailMovieCredits
  );
  readonly selectpersonDetailTVCredits$ = this.select(
    (state) => state.personDetailTVCredits
  );
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectError$ = this.select((state) => state.error);

  constructor() {
    super({
      personDetail: null,
      isLoading: false,
      error: null,
      personId: 0,
      personDetailMovieCredits: { cast: [], crew: [] },
      personDetailTVCredits: { cast: [], crew: [] },
    });
  }

  readonly cleanPersonDetail = this.updater((state) => {
    return {
      isLoading: false,
      error: null,
      personDetail: null,
      personId: 0,
      personDetailMovieCredits: { cast: [], crew: [] },
      personDetailTVCredits: { cast: [], crew: [] },
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
    (
      state,
      {
        personDetail,
        personDetailMovieCredits,
        personDetailTVCredits,
      }: {
        personDetail: PersonDetail;
        personDetailMovieCredits: PersonDetailMovieCredits;
        personDetailTVCredits: PersonDetailTVCredits;
      }
    ) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        personDetail: { ...personDetail },
        personDetailMovieCredits,
        personDetailTVCredits,
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
      }),
      switchMap((personId: number) => {
        return this.TMDBPersonDetailService.personDetail(personId).pipe(
          tap((personDetail: PersonDetail) => {
            let movieListMerged = this.mergeMovieList(
              personDetail.movie_credits
            );
            let movieResult: MovieResult = {
              page: 1,
              total_pages: 1,
              total_results: movieListMerged.length,
              results: movieListMerged,
            };
            this.store.dispatch(
              personDetailMovieCreditsSuccess({ movieResult })
            );

            let tvListMerged = this.mergeTVList(personDetail.tv_credits);
            let tvResult: TVResult = {
              page: 1,
              total_pages: 1,
              total_results: tvListMerged.length,
              results: tvListMerged,
            };
            this.store.dispatch(personDetailTVCreditsSuccess({ tvResult }));

            this.personDetailSuccess({
              personDetail,
              personDetailMovieCredits: personDetail.movie_credits,
              personDetailTVCredits: personDetail.tv_credits,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.personDetailFailure(httpErrorResponse);
                this.store.dispatch(personDetailFailure({ httpErrorResponse }));
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

  private mergeTVList(personDetailTVCredits: PersonDetailTVCredits) {
    return [...personDetailTVCredits.cast, ...personDetailTVCredits.crew];
  }

  logState(state: PersonDetailState, action: string) {
    console.log(action, state);
  }
}
