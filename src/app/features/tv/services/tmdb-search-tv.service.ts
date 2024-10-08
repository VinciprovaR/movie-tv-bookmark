import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { TVResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchTVService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  tvSearchInit(query: string): Observable<TVResult> {
    return this.tvSearch(1, query);
  }

  additionalTVSearch(page: number, query: string): Observable<TVResult> {
    return this.tvSearch(page + 1, query);
  }

  private tvSearch(page: number, query: string): Observable<TVResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      serviceKey: `/search/tv`,
      queryParams: {
        query: query,
        page: page.toString(),
        language: 'en-US',
        include_adult: 'false',
      },
    });
  }
}
