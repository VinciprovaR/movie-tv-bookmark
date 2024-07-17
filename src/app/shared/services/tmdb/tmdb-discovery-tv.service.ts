import { inject, Injectable } from '@angular/core';
import { I18E, TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBTVParamsUtilsService } from './tmdb-tv-params-utils.service';

import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryTVService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);
  i18e: string = inject(I18E);

  constructor(private TMDBTVParamsUtilsService: TMDBTVParamsUtilsService) {}

  tvDiscoveryInit(payload: PayloadDiscoveryTV): Observable<TVResult> {
    return this.tvDiscovery(1, payload);
  }

  additionalTVDiscovery(
    page: number,
    payload: PayloadDiscoveryTV
  ): Observable<TVResult> {
    return this.tvDiscovery(page + 1, payload);
  }

  private tvDiscovery(
    page: number,
    payload: PayloadDiscoveryTV
  ): Observable<TVResult> {
    let filtersQueryParams =
      this.TMDBTVParamsUtilsService.buildFiltersParam(payload);

    return this.httpClient.get<TVResult>(
      `${this.tmdbBaseUrl}/discover/tv?include_adult=false${filtersQueryParams}&certification_country=${this.i18e}&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
