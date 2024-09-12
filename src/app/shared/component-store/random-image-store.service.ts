import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Actions } from '@ngrx/effects';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import {
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../interfaces/TMDB/tmdb-media.interface';
import { TMDBTrendingTVService } from '../services/tmdb/tmdb-trending-tv.service';
import { TMDBTrendingMovieService } from '../services/tmdb/tmdb-trending-movie.service';
import { CustomHttpErrorResponseInterface } from '../interfaces/customHttpErrorResponse.interface';
import { RandomImageState } from '../interfaces/layout.interface';

/**
 * RandomImageStore select a random image from the
 * trending movie or tv of a window of day or week
 *
 */
@Injectable({ providedIn: 'root' })
export class RandomImageStore extends ComponentStore<RandomImageState> {
  private readonly TMDBTrendingTVService = inject(TMDBTrendingTVService);
  readonly actions$ = inject(Actions);
  private readonly TMDBTrendingMovieService = inject(TMDBTrendingMovieService);

  readonly push$ = new BehaviorSubject<null>(null);
  readonly selectRandomImage$ = this.select((state) => state.randomImage);
  readonly selectMediaResult$ = this.select((state) => state.mediaResult);
  readonly selectIsLoading$ = this.select((state) => state.isLoading);

  constructor() {
    super({
      randomImage: '',
      isLoading: false,
      error: null,
      mediaResult: [[], []],
    });
  }

  private readonly randomImageInitializerInit = this.updater((state) => {
    return {
      ...state,
      isLoading: true,
      error: null,
    };
  });

  private readonly randomImageInitializerSuccess = this.updater(
    (
      state,
      {
        randomImage,
        mediaResult,
      }: { randomImage: string; mediaResult: [Movie[], TV[]] }
    ) => {
      return {
        isLoading: false,
        error: null,
        randomImage,
        mediaResult,
      };
    }
  );

  private readonly randomImageInitializerFailure = this.updater(
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

  readonly randomImageInitializer = this.effect((_) => {
    return _.pipe(
      tap(() => {
        this.randomImageInitializerInit();
      }),
      switchMap(() => {
        if (
          this.get().mediaResult[0].length > 0 &&
          this.get().mediaResult[1].length > 0
        ) {
          return of('').pipe(
            tap(() => {
              const randomImage = this.getRandomMediaImage([
                this.get().mediaResult[0],
                this.get().mediaResult[1],
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
                this.randomImageInitializerSuccess({
                  randomImage,
                  mediaResult: [movieResult.results, tvResult.results],
                });
              })
            );
          }),
          catchError((httpErrorResponse: CustomHttpErrorResponseInterface) => {
            return of(null).pipe(
              tap(() => {
                this.randomImageInitializerFailure(httpErrorResponse);
              })
            );
          })
        );
      })
    );
  });

  private getRandomMediaImage(mediaLists: [Movie[], TV[]]): string {
    return mediaLists[Math.floor(Math.random() * 2)][
      Math.floor(
        Math.random() * mediaLists[Math.floor(Math.random() * 2)].length
      )
    ].backdrop_path;
  }

  logState(state: RandomImageState, action: string) {
    console.log(action, state);
  }
}
