import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { TVDetail, TVCredit } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({ providedIn: 'root' })
export class TMDBTVDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

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
