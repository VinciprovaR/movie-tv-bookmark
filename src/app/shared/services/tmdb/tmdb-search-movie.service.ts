import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchMovieService {
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
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieResult>({
      method: 'GET',
      pathKey: `search-movie`,
      queryStrings: `query=${query}&include_adult=false&language=en-US&page=${page}`,
    });
  }
}
