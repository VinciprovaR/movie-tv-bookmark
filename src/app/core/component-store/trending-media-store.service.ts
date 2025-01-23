import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions, createEffect } from '@ngrx/effects';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TMDBTrendingMovieService } from '../../features/movie/services/tmdb-trending-movie.service';
import { TMDBTrendingTVService } from '../../features/tv/services/tmdb-trending-tv.service';
import { CustomHttpErrorResponseInterface } from '../../shared/interfaces/customHttpErrorResponse.interface';
import { TrendingMediaState } from '../../shared/interfaces/layout.interface';
import {
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';
import { createAction, props, Store } from '@ngrx/store';

export const randomImageInitializerFailure = createAction(
  '[Random-Image] Random Image Initializer Failure',
  props<{ httpErrorResponse: CustomHttpErrorResponseInterface }>()
);

export const trendingTVSuccess = createAction(
  '[Trending-tv] Trending TV Success',
  props<{ tvResult: TVResult }>()
);
export const trendingMovieSuccess = createAction(
  '[Trending-movie] Trending Movie Success',
  props<{ movieResult: MovieResult }>()
);
/**
 * TrendingMediaStore retrive a list of trending Movies and Tvs of the week
 */
@Injectable({ providedIn: 'root' })
export class TrendingMediaStore extends ComponentStore<TrendingMediaState> {
  private readonly TMDBTrendingTVService = inject(TMDBTrendingTVService);
  readonly actions$ = inject(Actions);
  private readonly TMDBTrendingMovieService = inject(TMDBTrendingMovieService);
  readonly store = inject(Store);
  readonly push$ = new BehaviorSubject<null>(null);
  readonly selectRandomImage$ = this.select((state) => state.randomImage);
  readonly selectMediaResult$ = this.select((state) => state.mediaResult);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);
  readonly selectMovie$ = this.select((state) => state.mediaResult['movie']);
  readonly selectTV$ = this.select((state) => state.mediaResult['tv']);

  constructor() {
    super({
      randomImage: '',
      isLoading: false,
      error: null,
      mediaResult: { movie: [], tv: [] },
    });
  }

  private readonly tredingMediaInitializerInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly tredingMediaInitializerSuccess = this.updater(
    (
      state,
      {
        randomImage,
        mediaResult,
      }: { randomImage: string; mediaResult: { movie: Movie[]; tv: TV[] } }
    ) => {
      return {
        isLoading: false,
        error: null,
        randomImage,
        mediaResult,
      };
    }
  );

  private readonly tredingMediaInitializerFailure = this.updater(
    (state, { error }: { error: CustomHttpErrorResponseInterface }) => {
      return {
        ...state,
        isLoading: false,
        error,
      };
    }
  );

  private readonly randomImageSuccess = this.updater(
    (state, { randomImage }: { randomImage: string }) => {
      return {
        ...state,
        isLoading: false,
        error: null,
        randomImage,
      };
    }
  );

  readonly tredingMediaInitializer = this.effect(
    (value$: Observable<number>) => {
      return value$.pipe(
        tap(() => {
          this.tredingMediaInitializerInit();
        }),
        switchMap(() => {
          if (
            this.get().mediaResult['movie'].length > 0 &&
            this.get().mediaResult['tv'].length > 0
          ) {
            return of(Date.now()).pipe(
              tap(() => {
                const randomImage = this.getRandomMediaImage([
                  this.get().mediaResult['movie'],
                  this.get().mediaResult['tv'],
                ]);
                this.randomImageSuccess({
                  randomImage,
                });
              })
            );
          }
          return this.TMDBTrendingMovieService.trendingMovie('week').pipe(
            switchMap((movieResult: MovieResult) => {
              return this.TMDBTrendingTVService.trendingTV('week').pipe(
                tap((tvResult: TVResult) => {
                  const randomImage = this.getRandomMediaImage([
                    movieResult.results,
                    tvResult.results,
                  ]);
                  this.tredingMediaInitializerSuccess({
                    randomImage,
                    mediaResult: {
                      movie: movieResult.results,
                      tv: tvResult.results,
                    },
                  });
                  this.store.dispatch(trendingMovieSuccess({ movieResult }));
                  this.store.dispatch(trendingTVSuccess({ tvResult }));
                })
              );
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of().pipe(
                  tap(() => {
                    this.tredingMediaInitializerFailure(httpErrorResponse);
                    this.store.dispatch(
                      randomImageInitializerFailure({ httpErrorResponse })
                    );
                  })
                );
              }
            )
          );
        })
      );
    }
  );

  private getRandomMediaImage(mediaLists: [Movie[], TV[]]): string {
    return mediaLists[Math.floor(Math.random() * 2)][
      Math.floor(
        Math.random() * mediaLists[Math.floor(Math.random() * 2)].length
      )
    ].backdrop_path;
  }

  logState(state: TrendingMediaState, action: string) {
    console.log(action, state);
  }
}
