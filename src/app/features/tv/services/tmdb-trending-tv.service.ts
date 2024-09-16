import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { TimeWindow, TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBTrendingTVService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  trendingTV(timeWindow: TimeWindow): Observable<TVResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      serviceKey: `/trending/tv/{time_window}`,
      pathParams: { '{time_window}': timeWindow },
      queryParams: {
        language: 'en-US',
      },
    });
  }
}
