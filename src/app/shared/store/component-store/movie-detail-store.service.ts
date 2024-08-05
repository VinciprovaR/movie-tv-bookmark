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
  movieDetail: (MovieDetail & MediaCredit & ReleaseDate) | null;
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
    (
      state,
      {
        movieDetail,
        movieCredit,
        releaseDate,
      }: {
        movieDetail: MovieDetail;
        movieCredit: MediaCredit;
        releaseDate: ReleaseDate;
      }
    ) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        movieDetail: { ...movieDetail, ...movieCredit, ...releaseDate },
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
        return this.TMDBMovieDetailService.movieDetail(movieId).pipe(
          switchMap((movieDetail: MovieDetail) => {
            return this.TMDBMovieDetailService.movieCredit(movieId).pipe(
              switchMap((movieCredit: MediaCredit) => {
                return this.TMDBMovieDetailService.movieReleaseDate(
                  movieId
                ).pipe(
                  map((releaseDates: ReleaseDates) => {
                    for (let releaseDate of releaseDates.results) {
                      //to-do i18e?
                      if (releaseDate.iso_3166_1 === 'US') {
                        return releaseDate;
                      }
                    }

                    return {
                      iso_3166_1: '',
                      release_dates: [
                        {
                          certification: '',
                          descriptors: [],
                          iso_639_1: '',
                          note: '',
                          release_date: '',
                          type: -1,
                        },
                      ],
                    };
                  }),
                  tap((releaseDate: ReleaseDate) => {
                    this.store.dispatch(movieDetailSuccess({ movieDetail }));
                    this.addMovieDetailSuccess({
                      movieDetail,
                      movieCredit,
                      releaseDate,
                    });
                  })
                );
              })
            );
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
