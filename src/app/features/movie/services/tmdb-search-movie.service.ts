import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { MovieResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchMovieService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  movieSearchInit(query: string): Observable<MovieResult> {
    return this.movieSearch(1, query);
  }

  additionalMovieSearch(page: number, query: string): Observable<MovieResult> {
    return this.movieSearch(page + 1, query);
  }

  private movieSearch(page: number, query: string): Observable<MovieResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieResult>({
      serviceKey: `/search/movie`,
      queryParams: {
        query: query,
        page: page.toString(),
        language: 'en-US',
        include_adult: 'false',
      },
    });
  }
}
