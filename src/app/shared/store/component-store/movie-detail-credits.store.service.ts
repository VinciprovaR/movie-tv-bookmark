import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import {
  MovieCredit,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBMovieDetailService } from '../../services/tmdb/tmdb-movie-detail.service';
import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';

export interface MovieDetailCreditsState extends StateMediaBookmark {
  movieCredit: MovieCredit | null;
}

export const movieDetailCreditsFailure = createAction(
  '[Movie-Detail-Credits/API] Movie Detail Credits Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class MovieDetailCreditsStore extends ComponentStore<MovieDetailCreditsState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBMovieDetailService = inject(TMDBMovieDetailService);

  readonly selectMovieCredits$ = this.select((state) => state.movieCredit);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ movieCredit: null, isLoading: false, error: null });
  }

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
    (state, { error }: { error: HttpErrorResponse }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );
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
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
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
