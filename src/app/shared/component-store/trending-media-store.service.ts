import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { createAction, props, Store } from '@ngrx/store';
import { MovieResult, TVResult } from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBTrendingTVService } from '../services/tmdb/tmdb-trending-tv.service';
import { TMDBTrendingMovieService } from '../services/tmdb/tmdb-trending-movie.service';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { AuthActions } from '../store/auth';

export interface TrendingMediaState extends StateMediaBookmark {
  movieResult: MovieResult;
  tvResult: TVResult;
}

export const movieTrendingSuccess = createAction(
  '[Media-Trending] Movie Trending Success',
  props<{ movieResult: MovieResult }>()
);
export const movieTrendingFailure = createAction(
  '[Media-Trending] Movie Trending Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);
export const tvTrendingSuccess = createAction(
  '[Media-Trending] TV Trending Success',
  props<{ movieResult: MovieResult }>()
);
export const tvTrendingFailure = createAction(
  '[Media-Trending] TV Trending Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class TrendingMediaStore extends ComponentStore<TrendingMediaState> {
  private readonly TMDBTrendingTVService = inject(TMDBTrendingTVService);
  readonly actions$ = inject(Actions);
  private readonly TMDBTrendingMovieService = inject(TMDBTrendingMovieService);

  readonly selectMovieResult$ = this.select((state) => state.movieResult);
  readonly selectTVResult$ = this.select((state) => state.tvResult);

  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({
      movieResult: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      tvResult: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      isLoading: false,
      error: null,
    });
  }

  private readonly cleanMovieTrending = this.updater((state) => {
    return {
      movieResult: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      tvResult: {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      },
      isLoading: false,
      error: null,
    };
  });

  private readonly movieTrendingInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly movieTrendingSuccess = this.updater(
    (state, { movieResult }: { movieResult: MovieResult }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieResult,
      };
    }
  );

  private readonly movieTrendingFailure = this.updater(
    (state, { error }: { error: CustomHttpErrorResponseInterface }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  private readonly tvTrendingInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly tvTrendingSuccess = this.updater(
    (state, { tvResult }: { tvResult: TVResult }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        tvResult,
      };
    }
  );

  private readonly tvTrendingFailure = this.updater(
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
        return of(this.cleanMovieTrending());
      })
    );
  });

  readonly movieTrending = this.effect(() => {
    return of('').pipe(
      tap(() => {
        this.movieTrendingInit();
      }),
      switchMap(() => {
        return this.TMDBTrendingMovieService.trendingMovie('week').pipe(
          tap((movieResult: MovieResult) => {
            // this.store.dispatch(movieTrendingSuccess({ movieResult }));
            this.movieTrendingSuccess({
              movieResult,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                //this.store.dispatch(movieTrendingFailure({ httpErrorResponse }));
                this.movieTrendingFailure(httpErrorResponse);
              })
            );
          })
        );
      })
    );
  });

  readonly tvTrending = this.effect(() => {
    return of('').pipe(
      tap(() => {
        this.tvTrendingInit();
      }),
      switchMap(() => {
        return this.TMDBTrendingTVService.trendingTV('week').pipe(
          tap((tvResult: TVResult) => {
            // this.store.dispatch(tvTrendingSuccess({ tvResult }));
            this.tvTrendingSuccess({
              tvResult,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                //this.store.dispatch(tvTrendingFailure({ httpErrorResponse }));
                this.tvTrendingFailure(httpErrorResponse);
              })
            );
          })
        );
      })
    );
  });

  logState(state: TrendingMediaState, action: string) {
    console.log(action, state);
  }
}
