import { DestroyRef, inject, Injectable } from '@angular/core';
import { TrendingMediaStore } from '../component-store';
import { combineLatest, filter, map, Observable, Subject } from 'rxjs';
import {
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class RandomMediaImageService {
  private readonly trendingMediaStore = inject(TrendingMediaStore);
  protected readonly destroyRef$ = inject(DestroyRef);

  destroyed$ = new Subject();

  private selectMovieResult$!: Observable<MovieResult>;
  private selectTVResult$!: Observable<TVResult>;
  private mediaCombined$!: Observable<[Movie[], TV[]]>;
  randomImage$!: Observable<string>;

  selectIsLoading!: Observable<boolean>;

  movieList: Movie[] = [];
  tvList: TV[] = [];

  constructor() {
    this.destroyRef$.onDestroy(() => {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    });

    this.initSelectors();
  }

  initSelectors() {
    this.selectMovieResult$ = this.trendingMediaStore.selectMovieResult$;
    this.selectTVResult$ = this.trendingMediaStore.selectTVResult$;
    this.selectIsLoading = this.trendingMediaStore.selectIsLoading$;

    this.mediaCombined$ = combineLatest([
      this.selectMovieResult$,
      this.selectTVResult$,
    ]).pipe(
      filter((mediaResults: [MovieResult, TVResult]) => {
        return (
          mediaResults[0].results.length > 0 &&
          mediaResults[1].results.length > 0
        );
      }),
      map((mediaResults: [MovieResult, TVResult]) => {
        return [mediaResults[0].results, mediaResults[1].results];
      })
    );

    this.randomImage$ = this.mediaCombined$.pipe(
      map((mediaLists: [Movie[], TV[]]) => {
        console.log(mediaLists);
        return this.getRandomMediaImage(mediaLists);
      })
    );
  }

  initMedia() {
    this.searchMovieTrending();
    this.searchTVTrending();
  }

  getRandomMediaImage(mediaLists: [Movie[], TV[]]) {
    const mediaList = mediaLists[Math.floor(Math.random() * 2)];

    return mediaList[
      Math.floor(
        Math.random() * mediaLists[Math.floor(Math.random() * 2)].length
      )
    ].backdrop_path;
  }

  searchMovieTrending() {
    this.trendingMediaStore.movieTrending();
  }

  searchTVTrending() {
    this.trendingMediaStore.tvTrending();
  }
}
