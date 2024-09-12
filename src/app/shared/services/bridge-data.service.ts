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
import { MovieData, TVData } from '../interfaces/supabase/entities';

type mediaBookmarkDTOTVType = TV | TVDetail | TVData;
type mediaBookmarkDTOMovieType = Movie | MovieDetail | MovieData;
/**
 * BridgeDataService provide event message for components that
 * are not closely related in the tree hierarchy.
 *
 */
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
    MediaBookmarkDTO<mediaBookmarkDTOTVType>
  >();
  readonly tvInputBookmarkOptionsObs$: Observable<
    MediaBookmarkDTO<mediaBookmarkDTOTVType>
  > = this.tvInputBookmarkOptions$.asObservable();

  //inputBookmarkOptions Movie
  private readonly movieInputBookmarkOptions$ = new Subject<
    MediaBookmarkDTO<mediaBookmarkDTOMovieType>
  >();
  readonly movieInputBookmarkOptionsObs$: Observable<
    MediaBookmarkDTO<mediaBookmarkDTOMovieType>
  > = this.movieInputBookmarkOptions$.asObservable();

  pushMediaBookmarkMap(mediaBookmarkMap: MovieBookmarkMap | TVBookmarkMap) {
    this.mediaBookmarkMap$.next(mediaBookmarkMap);
  }

  pushInputBookmarkOptions(
    mediaType: MediaType,
    mediaBookmarkDTO: MediaBookmarkDTO<
      mediaBookmarkDTOMovieType | mediaBookmarkDTOTVType
    >
  ) {
    if (mediaType === 'movie') {
      let mediaBookmarkDTOMovie =
        mediaBookmarkDTO as MediaBookmarkDTO<mediaBookmarkDTOMovieType>;

      this.pushMovieInputBookmarkOptions(mediaBookmarkDTOMovie);
    } else if (mediaType === 'tv') {
      let mediaBookmarkDTOTV =
        mediaBookmarkDTO as MediaBookmarkDTO<mediaBookmarkDTOTVType>;

      this.pushTVInputBookmarkOptions(mediaBookmarkDTOTV);
    }
  }

  pushTVInputBookmarkOptions(
    mediaBookmarkDTO: MediaBookmarkDTO<mediaBookmarkDTOTVType>
  ) {
    this.tvInputBookmarkOptions$.next(mediaBookmarkDTO);
  }

  pushMovieInputBookmarkOptions(
    mediaBookmarkDTO: MediaBookmarkDTO<mediaBookmarkDTOMovieType>
  ) {
    this.movieInputBookmarkOptions$.next(mediaBookmarkDTO);
  }
}
