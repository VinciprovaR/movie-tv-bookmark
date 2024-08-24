import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { TMDBTVParamsUtilsService } from './tmdb-tv-params-utils.service';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryTVService {
  private readonly TMDBTVParamsUtilsService = inject(TMDBTVParamsUtilsService);

  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

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
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      method: 'GET',
      pathKey: `discover-tv`,
      queryStrings: `include_adult=false${queryParams}&certification_country=US&language=en-US&page=${page}`,
    });
  }
}
