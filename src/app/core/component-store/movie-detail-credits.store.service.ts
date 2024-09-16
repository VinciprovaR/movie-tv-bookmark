import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, ofType } from '@ngrx/effects';
import { createAction, props, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TMDBMovieDetailService } from '../../features/movie/services/tmdb-movie-detail.service';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { MovieDetailCreditsState } from '../../shared/interfaces/store/media-detail.interface';
import { MovieCredit } from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { AuthActions } from '../store/auth';

export const movieDetailCreditsFailure = createAction(
  '[Movie-Detail-Credits] Movie Detail Credits Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

@Injectable({ providedIn: 'root' })
export class MovieDetailCreditsStore extends ComponentStore<MovieDetailCreditsState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBMovieDetailService = inject(TMDBMovieDetailService);

  readonly selectMovieCredits$ = this.select((state) => state.movieCredit);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectError$ = this.select((state) => state.error);

  constructor() {
    super({ movieCredit: null, isLoading: false, error: null });
  }

  readonly cleanMovieDetailCredits = this.updater((state) => {
    return {
      isLoading: false,
      error: null,
      movieCredit: null,
    };
  });

  private readonly addMovieDetailCreditsInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly addMovieDetailCreditsSuccess = this.updater(
    (state, { movieCredit }: { movieCredit: MovieCredit }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieCredit,
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
        return of(this.cleanMovieDetailCredits());
      })
    );
  });

  readonly searchMovieCredits = this.effect((movieId$: Observable<number>) => {
    return movieId$.pipe(
      tap(() => {
        this.addMovieDetailCreditsInit();
      }),
      switchMap((movieId) => {
        return this.TMDBMovieDetailService.movieCredits(movieId).pipe(
          tap((movieCredit: MovieCredit) => {
            this.addMovieDetailCreditsSuccess({
              movieCredit,
            });
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.addMovieDetailFailure(httpErrorResponse);
                this.store.dispatch(
                  movieDetailCreditsFailure({ httpErrorResponse })
                );
              })
            );
          })
        );
      })
    );
  });

  logState(state: MovieDetailCreditsState, action: string) {
    console.log(action, state);
  }
}
