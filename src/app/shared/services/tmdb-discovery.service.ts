import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../providers';
import { TmdbService } from './tmdb.service';
import { Observable, of } from 'rxjs';
import { MovieResult, TVResult, MediaType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TmdbDiscoveryService extends TmdbService {
  constructor() {
    super();
  }

  movieDiscoveryInit(payload: any) {
    return this.mediaDiscovery(1, payload, 'movie') as Observable<MovieResult>;
  }

  tvDiscoveryInit(payload: any) {
    return this.mediaDiscovery(1, payload, 'tv') as Observable<TVResult>;
  }

  additionalMovieDiscovery(
    page: number,
    payload: any
  ): Observable<MovieResult> {
    return this.mediaDiscovery(
      page + 1,
      payload,
      'movie'
    ) as Observable<MovieResult>;
  }

  additionalTVDiscovery(page: number, payload: any): Observable<TVResult> {
    return this.mediaDiscovery(page + 1, payload, 'tv') as Observable<TVResult>;
  }

  private mediaDiscovery(
    page: number,
    payload: any,
    mediaType: MediaType
  ): Observable<MovieResult | TVResult | null> {
    // return this.httpClient.get<MovieResult | TVResult>(
    //   `${this.tmdbBaseUrl}/Discovery/${mediaType}?payload=${payload}&include_adult=false&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    // );
    return of(null);
  }
}
