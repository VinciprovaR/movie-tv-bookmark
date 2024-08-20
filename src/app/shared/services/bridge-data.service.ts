import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaBookmarkDTO } from '../interfaces/supabase/DTO';
import {
  MovieBookmarkMap,
  TVBookmarkMap,
} from '../interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
} from '../interfaces/TMDB/tmdb-media.interface';
import { Movie_Data, TV_Data } from '../interfaces/supabase/entities';

//to-do refractor with signals?
@Injectable()
export class BridgeDataService {
  //mediaBookmarkMap
  private readonly mediaBookmarkMap$ = new BehaviorSubject<
    MovieBookmarkMap | TVBookmarkMap
  >({});
  readonly mediaBookmarkMapObs$: Observable<MovieBookmarkMap | TVBookmarkMap> =
    this.mediaBookmarkMap$.asObservable();

  //inputBookmarkOptions TV
  private readonly tvInputBookmarkOptions$ = new Subject<
    MediaBookmarkDTO<TV | TVDetail | TV_Data>
  >();
  readonly tvInputBookmarkOptionsObs$: Observable<
    MediaBookmarkDTO<TV | TVDetail | TV_Data>
  > = this.tvInputBookmarkOptions$.asObservable();

  //inputBookmarkOptions Movie
  private readonly movieInputBookmarkOptions$ = new Subject<
    MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  >();
  readonly movieInputBookmarkOptionsObs$: Observable<
    MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  > = this.movieInputBookmarkOptions$.asObservable();

  constructor() {}

  pushMediaBookmarkMap(mediaBookmarkMap: MovieBookmarkMap | TVBookmarkMap) {
    this.mediaBookmarkMap$.next(mediaBookmarkMap);
  }

  pushInputBookmarkOptions(
    mediaType: MediaType,
    mediaBookmarkDTO: MediaBookmarkDTO<
      Movie | MovieDetail | Movie_Data | TV | TVDetail | TV_Data
    >
  ) {
    if (mediaType === 'movie') {
      let mediaBookmarkDTOMovie = mediaBookmarkDTO as MediaBookmarkDTO<
        Movie | MovieDetail | Movie_Data
      >;

      this.pushMovieInputBookmarkOptions(mediaBookmarkDTOMovie);
    } else if (mediaType === 'tv') {
      let mediaBookmarkDTOTV = mediaBookmarkDTO as MediaBookmarkDTO<
        TV | TVDetail | TV_Data
      >;

      this.pushTVInputBookmarkOptions(mediaBookmarkDTOTV);
    }
  }

  pushTVInputBookmarkOptions(
    mediaBookmarkDTO: MediaBookmarkDTO<TV | TVDetail | TV_Data>
  ) {
    this.tvInputBookmarkOptions$.next(mediaBookmarkDTO);
  }

  pushMovieInputBookmarkOptions(
    mediaBookmarkDTO: MediaBookmarkDTO<Movie | MovieDetail | Movie_Data>
  ) {
    this.movieInputBookmarkOptions$.next(mediaBookmarkDTO);
  }
}
