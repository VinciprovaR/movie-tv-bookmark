import { map, Observable } from 'rxjs';
import {
  MovieCredit,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';

import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({ providedIn: 'root' })
export class TMDBMovieDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  movieDetailChained(movieId: number): Observable<MovieDetail> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieDetail>({
      method: 'GET',
      pathParam: `${movieId}`,
      pathKey: `movie-detail`,
      queryStrings: `append_to_response=credits%2Crelease_dates%2Cvideos%2Ckeywords&language=en-US`,
    });
  }

  movieCredits(movieId: number): Observable<MovieCredit> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<MovieCredit>({
      method: 'GET',
      pathParam: `${movieId}`,
      pathKey: `movie-credits`,
      queryStrings: `language=en-US`,
    });
  }
}
