import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResult, TVResult } from '../../interfaces/media.interface';
import { MediaType } from '../../interfaces/media.interface';
import { TMDBService } from './tmdb.abstract.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchService extends TMDBService {
  constructor() {
    super();
  }

  movieSearchInit(query: string) {
    return this.mediaSearch(1, query, 'movie') as Observable<MovieResult>;
  }

  tvSearchInit(query: string) {
    return this.mediaSearch(1, query, 'tv') as Observable<TVResult>;
  }

  additionalMovieSearch(page: number, query: string): Observable<MovieResult> {
    return this.mediaSearch(
      page + 1,
      query,
      'movie'
    ) as Observable<MovieResult>;
  }

  additionalTVSearch(page: number, query: string): Observable<TVResult> {
    return this.mediaSearch(page + 1, query, 'tv') as Observable<TVResult>;
  }

  private mediaSearch(
    page: number,
    query: string,
    mediaType: MediaType
  ): Observable<MovieResult | TVResult> {
    return this.httpClient.get<MovieResult | TVResult>(
      `${this.tmdbBaseUrl}/search/${mediaType}?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
