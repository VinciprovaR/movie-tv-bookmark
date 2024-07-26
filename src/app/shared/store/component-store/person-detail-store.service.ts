import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import {
  MovieResult,
  PersonDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';
import { TMDBPersonDetailService } from '../../services/tmdb/tmdb-peroson-detail.service';
import { TMDBDiscoveryMovieService } from '../../services/tmdb';

export interface PersonDetailState extends StateMediaBookmark {
  personDetail: PersonDetail | null;
  movieResult: MovieResult;
  personId: number;
}

export const discoveryMovieSuccessPersonDetail = createAction(
  '[Person-Detail] Discovery Movie Success Person Detail',
  props<{ movieResult: MovieResult }>()
);
export const discoveryMoviePersonDetailFailure = createAction(
  '[Person-Detail/API] Discovery Movie Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const discoveryAdditionalMovieSuccessPersonDetail = createAction(
  '[Person-Detail] Discovery Movie Additional Success Person Detail',
  props<{ movieResult: MovieResult }>()
);

export const discoveryAdditionalMoviePersonDetailFailure = createAction(
  '[Person-Detail/API] Discovery Additional Movie Person Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

export const personDetailFailure = createAction(
  '[Person-Detail/API] Person Detail Failure',
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

  readonly selectMovieCurrentPage$ = this.select(
    (state) => state.movieResult.page
  );

  readonly selectMovieTotalPages$ = this.select(
    (state) => state.movieResult.total_pages
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
      personId: 0,
    });
  }

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

  private readonly discoveryMovieInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

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

  private readonly discoveryAdditionalMovieInit = this.updater(
    (state, { personId }: { personId: number }) => {
      return {
        ...state,
        isLoading: true,
        error: null,
        personId,
      };
    }
  );

  private readonly discoveryAdditionalMovieSuccess = this.updater(
    (state, { movieResult }: { movieResult: MovieResult }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieResult: {
          page: movieResult.page,
          total_pages: movieResult.total_pages,
          results: [...state.movieResult.results, ...movieResult.results],
          total_results: movieResult.total_results,
        },
      };
    }
  );

  private readonly discoveryNoAdditionalMovie = this.updater((state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
    };
  });

  private readonly discoveryAdditionalMovieFailure = this.updater(
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
      }),
      switchMap((personId: number) => {
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
      tap((personId: number) => {
        this.discoveryMovieInit({ personId });
      }),
      switchMap((personId) => {
        return this.TMDBDiscoveryMovieService.movieDiscoveryByPersonId(
          personId
        ).pipe(
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
  readonly discoveryAdditionalMovie = this.effect(
    (
      metadata$: Observable<{
        personId: number;
        currPage: number;
        totalPages: number;
      }>
    ) => {
      return metadata$.pipe(
        tap((metadata) => {
          let { personId } = metadata;
          this.discoveryAdditionalMovieInit({ personId });
        }),
        switchMap((metadata) => {
          let { personId, currPage, totalPages } = metadata;
          if (currPage < totalPages) {
            return this.TMDBDiscoveryMovieService.additionalMovieDiscoveryByPersonId(
              currPage,
              personId
            ).pipe(
              tap((movieResult: MovieResult) => {
                this.store.dispatch(
                  discoveryAdditionalMovieSuccessPersonDetail({ movieResult })
                );
                this.discoveryAdditionalMovieSuccess({ movieResult });
              }),
              catchError((httpErrorResponse: HttpErrorResponse) => {
                return of().pipe(
                  tap(() => {
                    this.discoveryAdditionalMovieFailure(httpErrorResponse);
                    this.store.dispatch(
                      discoveryAdditionalMoviePersonDetailFailure({
                        httpErrorResponse,
                      })
                    );
                  })
                );
              })
            );
          } else {
            return of().pipe(tap(() => this.discoveryNoAdditionalMovie()));
          }
        })
      );
    }
  );

  logState(state: PersonDetailState, action: string) {
    console.log(action, state);
  }
}
