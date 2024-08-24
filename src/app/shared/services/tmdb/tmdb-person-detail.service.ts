import { map, Observable } from 'rxjs';
import {
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';

import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({ providedIn: 'root' })
export class TMDBPersonDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  constructor() {}

  personDetail(personId: number): Observable<PersonDetail> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetail>({
      method: 'GET',
      pathParam: `${personId}`,
      pathKey: `person-detail`,
      queryStrings: `language=en-US`,
    });
  }

  personMovieCredit(personId: number): Observable<PersonDetailMovieCredits> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetailMovieCredits>(
      {
        method: 'GET',
        pathParam: `${personId}`,
        pathKey: `person-movie-credits`,
        queryStrings: `language=en-US`,
      }
    );
  }

  personTVCredit(personId: number): Observable<PersonDetailTVCredits> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetailTVCredits>(
      {
        method: 'GET',
        pathParam: `${personId}`,
        pathKey: `person-tv-credits`,
        queryStrings: `language=en-US`,
      }
    );
  }
}
