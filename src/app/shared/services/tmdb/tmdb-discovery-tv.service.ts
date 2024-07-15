import { inject, Injectable } from '@angular/core';
import { I18E } from '../../../providers';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBTVParamsUtilsService } from './tmdb-tv-params-utils.service';
import { TMDBTVService } from './abstract/tmdb-tv.abstract.service';
import {
  AirDate,
  PayloadDiscoveryTV,
} from '../../interfaces/store/discovery-tv-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryTVService extends TMDBTVService {
  i18e: string = inject(I18E);

  constructor(private TMDBTVParamsUtilsService: TMDBTVParamsUtilsService) {
    super();
  }

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
