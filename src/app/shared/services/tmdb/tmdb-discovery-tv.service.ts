import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';

import { TMDBTVParamsUtilsService } from './tmdb-tv-params-utils.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryTVService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor(private TMDBTVParamsUtilsService: TMDBTVParamsUtilsService) {}

  tvDiscovery(payload: PayloadDiscoveryTV): Observable<TVResult> {
    return this.discoverTVCall(
      1,
      this.TMDBTVParamsUtilsService.buildParamsFeatureTVDiscovery(payload)
    );
  }

  additionalTVDiscovery(
    page: number,
    payload: PayloadDiscoveryTV
  ): Observable<TVResult> {
    return this.discoverTVCall(
      page + 1,
      this.TMDBTVParamsUtilsService.buildParamsFeatureTVDiscovery(payload)
    );
  }

  tvDiscoveryByPersonId(personId: number): Observable<TVResult> {
    return this.discoverTVCall(
      1,
      this.TMDBTVParamsUtilsService.buildParamsPersonDetailTVDiscovery(personId)
    );
  }

  additionalTVDiscoveryByPersonId(
    page: number,
    personId: number
  ): Observable<TVResult> {
    return this.discoverTVCall(
      page + 1,
      this.TMDBTVParamsUtilsService.buildParamsPersonDetailTVDiscovery(personId)
    );
  }

  private discoverTVCall(
    page: number,
    queryParams: string
  ): Observable<TVResult> {
    return this.httpClient.get<TVResult>(
      `${this.tmdbBaseUrl}/discover/tv?include_adult=false${queryParams}&certification_country=US&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
