import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { createAction, props, Store } from '@ngrx/store';
import {
  MovieResult,
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
  TVResult,
} from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '../store/auth';

export interface PersonDetailState extends StateMediaBookmark {
  personDetail: PersonDetail | null;
  personDetailMovieCredits: PersonDetailMovieCredits;
  personDetailTVCredits: PersonDetailTVCredits;
  personId: number;
}

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
          switchMap((personDetail: PersonDetail) => {
            return this.TMDBPersonDetailService.personMovieCredit(
              personId
            ).pipe(
              map((personDetailMovieCredits: PersonDetailMovieCredits) => {
                let results = this.mergeMovieList(personDetailMovieCredits);
                let movieResult: MovieResult = {
                  page: 1,
                  total_pages: 1,
                  total_results: results.length,
                  results,
                };
                return { movieResult, personDetailMovieCredits };
              }),
              tap(
                (movie: {
                  movieResult: MovieResult;
                  personDetailMovieCredits: PersonDetailMovieCredits;
                }) => {
                  this.store.dispatch(
                    personDetailMovieCreditsSuccess({
                      movieResult: movie.movieResult,
                    })
                  );
                }
              ),
              switchMap(
                (movie: {
                  movieResult: MovieResult;
                  personDetailMovieCredits: PersonDetailMovieCredits;
                }) => {
                  return this.TMDBPersonDetailService.personTVCredit(
                    personId
                  ).pipe(
                    map((personDetailTVCredits: PersonDetailTVCredits) => {
                      let results = this.mergeTVList(personDetailTVCredits);
                      let tvResult: TVResult = {
                        page: 1,
                        total_pages: 1,
                        total_results: results.length,
                        results,
                      };
                      return { tvResult, personDetailTVCredits };
                    }),
                    tap(
                      (tv: {
                        tvResult: TVResult;
                        personDetailTVCredits: PersonDetailTVCredits;
                      }) => {
                        this.store.dispatch(
                          personDetailTVCreditsSuccess({
                            tvResult: tv.tvResult,
                          })
                        );
                      }
                    ),
                    switchMap(
                      (tv: {
                        tvResult: TVResult;
                        personDetailTVCredits: PersonDetailTVCredits;
                      }) => {
                        return of(null).pipe(
                          tap(() => {
                            this.personDetailSuccess({
                              personDetail,
                              personDetailMovieCredits:
                                movie.personDetailMovieCredits,
                              personDetailTVCredits: tv.personDetailTVCredits,
                            });
                          })
                        );
                      }
                    )
                  );
                }
              )
            );
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
