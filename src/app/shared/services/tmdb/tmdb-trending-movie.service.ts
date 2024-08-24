import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MovieResult,
  TimeWindow,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBTrendingMovieService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}
  trendingMovie(timeWindow: TimeWindow): Observable<MovieResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieResult>({
      method: 'GET',
      pathParam: `${timeWindow}`,
      pathKey: `trending-movie`,
      queryStrings: `language=en-US`,
    });
  }
}
