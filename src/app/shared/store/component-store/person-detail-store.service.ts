import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import {
  Movie,
  MovieResult,
  PersonDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../../services/tmdb/tmdb-peroson-detail.service';
import { TMDBDiscoveryMovieService } from '../../services/tmdb';

export interface PayloadPersonDetail {
  personId: number;
}

export interface PersonDetailState extends StateMediaBookmark {
  personDetail: PersonDetail | null;
  movieResult: MovieResult;
}

export const discoveryMovieSuccessPersonDetail = createAction(
  '[Person-Detail] Discovery Movie Success Person Detail',
  props<{ movieResult: MovieResult }>()
);
export const discoveryAdditionalMovieSuccessPersonDetail = createAction(
  '[Person-Detail] Discovery Movie Additional Success Person Detail',
  props<{ movieResult: MovieResult }>()
);

export const personDetailFailure = createAction(
  '[Person-Detail/API] Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const discoveryMoviePersonDetailFailure = createAction(
  '[Person-Detail/API] Discovery Movie Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class PersonDetailStore extends ComponentStore<PersonDetailState> {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly TMDBPersonDetailService = inject(TMDBPersonDetailService);
  private readonly TMDBDiscoveryMovieService = inject(
    TMDBDiscoveryMovieService
  );

  readonly selectPersonDetail$ = this.select((state) => state.personDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectDiscoveryMoviePersonDetail$ = this.select(
    (state) => state.movieResult
  ).pipe(
    map((movieResult: MovieResult) => {
      return movieResult.results;
    })
  );

  constructor() {
    super({
      personDetail: null,
      movieResult: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      isLoading: false,
      error: null,
    });
  }

  private readonly personDetailInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

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

  private readonly movieDiscoveryInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly movieDiscoverySuccess = this.updater(
    (state, { movieResult }: { movieResult: MovieResult }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieResult: { ...movieResult },
      };
    }
  );

  private readonly movieDiscoveryFailure = this.updater(
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
      tap(() => {
        this.personDetailInit();
      }),
      switchMap((personId) => {
        return this.TMDBPersonDetailService.personDetail(personId).pipe(
          tap((personDetail: PersonDetail) => {
            this.personDetailSuccess({ personDetail });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
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

  readonly discoveryMovie = this.effect((personId$: Observable<number>) => {
    return personId$.pipe(
      tap(() => {
        this.movieDiscoveryInit();
      }),
      switchMap((personId) => {
        return this.TMDBDiscoveryMovieService.movieDiscoveryPersonDetail({
          personId,
        }).pipe(
          tap((movieResult: MovieResult) => {
            this.store.dispatch(
              discoveryMovieSuccessPersonDetail({ movieResult })
            );
            this.movieDiscoverySuccess({ movieResult });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
              tap(() => {
                this.movieDiscoveryFailure(httpErrorResponse);
                this.store.dispatch(
                  discoveryMoviePersonDetailFailure({ httpErrorResponse })
                );
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
