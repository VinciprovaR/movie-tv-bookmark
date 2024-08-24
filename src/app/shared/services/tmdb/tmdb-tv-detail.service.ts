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
      method: 'GET',
      pathKey: `tv-detail`,
      queryStrings: `append_to_response=aggregate_credits%2Ccontent_ratings%2Cvideos%2Ckeywords&language=en-US`,
    });
  }

  tvCredits(tvId: number): Observable<TVCredit> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVCredit>({
      method: 'GET',
      pathKey: `tv-credits`,
      queryStrings: `language=en-US`,
    });
  }
}
