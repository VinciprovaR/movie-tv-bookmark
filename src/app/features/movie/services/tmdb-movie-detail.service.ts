import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { MovieCredit, MovieDetail } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({ providedIn: 'root' })
export class TMDBMovieDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  movieDetailChained(movieId: number): Observable<MovieDetail> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieDetail>({
      serviceKey: `/movie/{movie_id}`,
      pathParams: { '{movie_id}': movieId },
      queryParams: {
        append_to_response: 'credits,release_dates,videos,keywords',
        language: 'en-US',
      },
    });
  }

  movieCredits(movieId: number): Observable<MovieCredit> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieCredit>({
      serviceKey: `/movie/{movie_id}/credits`,
      pathParams: { '{movie_id}': movieId },
      queryParams: {
        language: 'en-US',
      },
    });
  }
}
