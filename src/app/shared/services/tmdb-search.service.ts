import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../providers';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { MovieDetail, MovieResult, TVResult } from '../models';
import { MediaType, TVDetail } from '../models/media.models';
import { TmdbService } from './tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TmdbSearchService extends TmdbService {
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
