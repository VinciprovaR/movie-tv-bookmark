import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MediaBookmarkDTO } from '../../shared/interfaces/supabase/media-bookmark.DTO.interface';
import {
  MovieData,
  TVData,
} from '../../shared/interfaces/supabase/media-data.entity.interface';
import {
  MovieBookmarkMap,
  TVBookmarkMap,
} from '../../shared/interfaces/supabase/supabase-bookmark.interface';
import {
  MediaType,
  Movie,
  MovieDetail,
  TV,
  TVDetail,
} from '../../shared/interfaces/TMDB/tmdb-media.interface';

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
