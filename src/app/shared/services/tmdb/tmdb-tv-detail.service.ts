import { Observable } from 'rxjs';
import { TVCredit, TVDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({ providedIn: 'root' })
export class TMDBTVDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  tvDetailChained(tvId: number): Observable<TVDetail> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVDetail>({
      serviceKey: `/tv/{tv_id}`,
      pathParams: { '{tv_id}': tvId },
      queryParams: {
        append_to_response: 'aggregate_credits,content_ratings,videos,keywords',
        language: 'en-US',
      },
    });
  }

  tvCredits(tvId: number): Observable<TVCredit> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVCredit>({
      serviceKey: `/tv/{tv_id}`,
      pathParams: { '{tv_id}': tvId },
      queryParams: {
        language: 'en-US',
      },
    });
  }
}
