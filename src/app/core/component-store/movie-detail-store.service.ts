import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { createAction, props, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TMDBMovieDetailService } from '../../features/movie/services/tmdb-movie-detail.service';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { MovieDetailState } from '../../shared/interfaces/store/media-detail.interface';
import { MovieDetail } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../store/auth';

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
  readonly selectError$ = this.select((state) => state.error);

  constructor() {
    super({ movieDetail: null, isLoading: false, error: null });
  }

  readonly cleanMovieDetail = this.updater((state) => {
    return {
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

  readonly cleanState$ = this.effect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(this.cleanMovieDetail());
      })
    );
  });

  readonly searchMovieDetail = this.effect((movieId$: Observable<number>) => {
    return movieId$.pipe(
      tap(() => {
        this.addMovieDetailInit();
      }),
      switchMap((movieId) => {
        return this.TMDBMovieDetailService.movieDetailChained(movieId).pipe(
          tap((movieDetail: MovieDetail) => {
            this.store.dispatch(movieDetailSuccess({ movieDetail }));
            this.addMovieDetailSuccess({
              movieDetail,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addMovieDetailFailure(httpErrorResponse);
                this.store.dispatch(movieDetailFailure({ httpErrorResponse }));
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
