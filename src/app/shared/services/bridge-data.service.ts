import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaLifecycleDTO } from '../interfaces/supabase/DTO';
import {
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../interfaces/supabase/supabase-lifecycle.interface';
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
  //mediaLifecycleMap
  private readonly mediaLifecycleMap$ = new BehaviorSubject<
    MovieLifecycleMap | TVLifecycleMap
  >({});
  readonly mediaLifecycleMapObs$: Observable<
    MovieLifecycleMap | TVLifecycleMap
  > = this.mediaLifecycleMap$.asObservable();

  //inputLifecycleOptions TV
  private readonly tvInputLifecycleOptions$ = new Subject<
    MediaLifecycleDTO<TV | TVDetail | TV_Data>
  >();
  readonly tvInputLifecycleOptionsObs$: Observable<
    MediaLifecycleDTO<TV | TVDetail | TV_Data>
  > = this.tvInputLifecycleOptions$.asObservable();

  //inputLifecycleOptions Movie
  private readonly movieInputLifecycleOptions$ = new Subject<
    MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  >();
  readonly movieInputLifecycleOptionsObs$: Observable<
    MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  > = this.movieInputLifecycleOptions$.asObservable();

  constructor() {}

  pushMediaLifecycleMap(mediaLifecycleMap: MovieLifecycleMap | TVLifecycleMap) {
    this.mediaLifecycleMap$.next(mediaLifecycleMap);
  }

  pushInputLifecycleOptions(
    mediaType: MediaType,
    mediaLifecycleDTO: MediaLifecycleDTO<
      Movie | MovieDetail | Movie_Data | TV | TVDetail | TV_Data
    >
  ) {
    if (mediaType === 'movie') {
      let mediaLifecycleDTOMovie = mediaLifecycleDTO as MediaLifecycleDTO<
        Movie | MovieDetail | Movie_Data
      >;

      this.pushMovieInputLifecycleOptions(mediaLifecycleDTOMovie);
    } else if (mediaType === 'tv') {
      let mediaLifecycleDTOTV = mediaLifecycleDTO as MediaLifecycleDTO<
        TV | TVDetail | TV_Data
      >;

      this.pushTVInputLifecycleOptions(mediaLifecycleDTOTV);
    }
  }

  pushTVInputLifecycleOptions(
    mediaLifecycleDTO: MediaLifecycleDTO<TV | TVDetail | TV_Data>
  ) {
    this.tvInputLifecycleOptions$.next(mediaLifecycleDTO);
  }

  pushMovieInputLifecycleOptions(
    mediaLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  ) {
    this.movieInputLifecycleOptions$.next(mediaLifecycleDTO);
  }
}
