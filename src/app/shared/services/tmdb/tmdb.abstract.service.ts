import { Observable } from 'rxjs';
import {
  MovieDetail,
  TVDetail,
  MediaType,
} from '../../interfaces/media.interface';
import { HttpClient } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

export abstract class TMDBService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor() {}
  searchMovieDetail(movieId: number) {
    return this.mediaDetail(movieId, 'movie') as Observable<MovieDetail>;
  }

  searchTVDetail(movieId: number) {
    return this.mediaDetail(movieId, 'tv') as Observable<TVDetail>;
  }
  private mediaDetail(
    mediaId: number,
    mediaType: MediaType
  ): Observable<MovieDetail | TVDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/${mediaType}/${mediaId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
