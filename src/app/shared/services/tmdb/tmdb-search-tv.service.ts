import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchTVService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  tvSearchInit(query: string): Observable<TVResult> {
    return this.tvSearch(1, query);
  }

  additionalTVSearch(page: number, query: string): Observable<TVResult> {
    return this.tvSearch(page + 1, query);
  }

  private tvSearch(page: number, query: string): Observable<TVResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<TVResult>({
      method: 'GET',
      pathKey: 'search-tv',
      queryStrings: `query=${query}&include_adult=false&language=en-US&page=${page}`,
    });
  }
}
