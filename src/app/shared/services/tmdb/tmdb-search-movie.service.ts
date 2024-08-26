import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SanitizeInputService } from '../sanitize-input.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchMovieService {
  private readonly sanitizeInputService = inject(SanitizeInputService);

  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  movieSearchInit(query: string): Observable<MovieResult> {
    return this.movieSearch(1, query);
  }

  additionalMovieSearch(page: number, query: string): Observable<MovieResult> {
    return this.movieSearch(page + 1, query);
  }

  private movieSearch(page: number, query: string): Observable<MovieResult> {
    const sanitizedQuery = this.sanitizeInputService.escapeHtml(query);

    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieResult>({
      serviceKey: `/search/movie`,
      queryParams: {
        query: sanitizedQuery,
        page: page.toString(),
        language: 'en-US',
        include_adult: 'false',
      },
    });
  }
}
