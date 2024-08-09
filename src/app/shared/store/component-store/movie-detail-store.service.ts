import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, Store } from '@ngrx/store';
import {
  MediaCredit,
  MovieDetail,
  ReleaseDate,
  ReleaseDates,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBMovieDetailService } from '../../services/tmdb/tmdb-movie-detail.service';
import { StateMediaBookmark } from '../../interfaces/store/state-media-bookmark.interface';

export interface MovieDetailState extends StateMediaBookmark {
  movieDetail: MovieDetail | null;
}

export const movieDetailSuccess = createAction(
  '[Movie-Detail/API] Movie Detail Success',
  props<{ movieDetail: MovieDetail }>()
);
export const movieDetailFailure = createAction(
  '[Movie-Detail/API] Movie Detail Failure',
  props<{ httpErrorResponse: HttpErrorResponse }>()
);

@Injectable()
export class MovieDetailStore extends ComponentStore<MovieDetailState> {
  readonly actions$ = inject(Actions);
  readonly store = inject(Store);
  readonly TMDBMovieDetailService = inject(TMDBMovieDetailService);

  readonly selectMovieDetail$ = this.select((state) => state.movieDetail);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({ movieDetail: null, isLoading: false, error: null });
  }

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
    (state, { error }: { error: HttpErrorResponse }) => {
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
      }),
      switchMap((movieId) => {
        return this.TMDBMovieDetailService.movieDetailChained(movieId).pipe(
          tap((movieDetail: MovieDetail) => {
            this.store.dispatch(movieDetailSuccess({ movieDetail }));
            this.addMovieDetailSuccess({
              movieDetail,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) => {
            return of().pipe(
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
