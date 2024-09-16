import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TMDBTVParamsUtilsService } from './tmdb-tv-params-utils.service';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { PayloadDiscoveryTV } from '../../../shared/interfaces/store/discovery-tv-state.interface';
import { TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryTVService {
  private readonly TMDBTVParamsUtilsService = inject(TMDBTVParamsUtilsService);

  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

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

  private discoverTVCall(
    page: number,
    queryParams: Record<string, string>
  ): Observable<TVResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      serviceKey: `/discover/tv`,
      queryParams: {
        ...queryParams,
        language: 'en-US',
        include_adult: 'false',
        certification_country: 'US',
        page: page.toString(),
      },
    });
  }
}
