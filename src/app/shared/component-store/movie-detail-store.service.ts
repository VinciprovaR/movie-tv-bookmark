import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { createAction, props, Store } from '@ngrx/store';
import { MovieDetail } from '../interfaces/TMDB/tmdb-media.interface';
import { StateMediaBookmark } from '../interfaces/store/state-media-bookmark.interface';
import { TMDBMovieDetailService } from '../services/tmdb';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';

export interface MovieDetailState extends StateMediaBookmark {
  movieDetail: MovieDetail | null;
}

// export const movieDetailIsLoading = createAction(
//   '[Movie-Detail] Movie Detail Is Loading',
//   props<{ isLoading: boolean }>()
// );
export const movieDetailSuccess = createAction(
  '[Movie-Detail] Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);
export const movieDetailFailure = createAction(
  '[Movie-Detail] Movie Detail Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class MovieDetailStore extends ComponentStore<MovieDetailState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBMovieDetailService = inject(TMDBMovieDetailService);

  readonly selectMovieDetail$ = this.select((state) => state.movieDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ movieDetail: null, isLoading: false, error: null });
  }

  readonly cleanMovieDetail = this.updater((state) => {
    return {
      ...state,
      isLoading: false,
      error: null,
      movieDetail: null,
    };
  });

  private readonly addMovieDetailInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly addMovieDetailSuccess = this.updater(
    (state, { movieDetail }: { movieDetail: MovieDetail }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieDetail,
      };
    }
  );

  private readonly addMovieDetailFailure = this.updater(
    (state, { error }: { error: CustomHttpErrorResponseInterface }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );
  readonly searchMovieDetail = this.effect((movieId$: Observable<number>) => {
    return movieId$.pipe(
      tap(() => {
        this.addMovieDetailInit();
        // this.store.dispatch(movieDetailIsLoading({ isLoading: true }));
      }),
      switchMap((movieId) => {
        return this.TMDBMovieDetailService.movieDetailChained(movieId).pipe(
          tap((movieDetail: MovieDetail) => {
            this.store.dispatch(movieDetailSuccess({ movieDetail }));
            this.addMovieDetailSuccess({
              movieDetail,
            });
            // this.store.dispatch(movieDetailIsLoading({ isLoading: false }));
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addMovieDetailFailure(httpErrorResponse);
                this.store.dispatch(movieDetailFailure({ httpErrorResponse }));
                // this.store.dispatch(movieDetailIsLoading({ isLoading: false }));
              })
            );
          })
        );
      })
    );
  });

  logState(state: MovieDetailState, action: string) {
    console.log(action, state);
  }
}
