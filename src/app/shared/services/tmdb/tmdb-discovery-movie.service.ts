import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryMovieService {
  private readonly TMDBMovieParamsUtilsService = inject(
    TMDBMovieParamsUtilsService
  );
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  movieDiscovery(payload: PayloadDiscoveryMovie): Observable<MovieResult> {
    return this.discoverMovieCall(
      1,
      this.TMDBMovieParamsUtilsService.buildParamsFeatureMovieDiscovery(payload)
    );
  }

  additionalMovieDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie
  ): Observable<MovieResult> {
    return this.discoverMovieCall(
      page + 1,
      this.TMDBMovieParamsUtilsService.buildParamsFeatureMovieDiscovery(payload)
    );
  }

  private discoverMovieCall(
    page: number,
    queryParams: string
  ): Observable<MovieResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieResult>({
      method: 'GET',
      pathParam: '',
      pathKey: `discover-movie`,
      queryStrings: `include_adult=false${queryParams}&certification_country=US&language=en-US&page=${page}`,
    });
  }
}
