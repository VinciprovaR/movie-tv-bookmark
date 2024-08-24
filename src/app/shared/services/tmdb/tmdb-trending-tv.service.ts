import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TimeWindow,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBTrendingTVService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  trendingTV(timeWindow: TimeWindow): Observable<TVResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      method: 'GET',
      pathParam: `${timeWindow}`,
      pathKey: `trending-tv`,
      queryStrings: `language=en-US`,
    });
  }
}
