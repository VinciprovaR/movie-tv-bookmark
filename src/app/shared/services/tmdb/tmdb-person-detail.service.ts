import { Observable } from 'rxjs';
import {
  PersonDetail,
  PersonDetailMovieCredits,
  PersonDetailTVCredits,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';
import { SupabaseProxyToTMDBService } from '../supabase/supabase-proxy-to-tmdb.service';

@Injectable({ providedIn: 'root' })
export class TMDBPersonDetailService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  personDetail(personId: number): Observable<PersonDetail> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetail>({
      serviceKey: `/person/{person_id}`,

      pathParams: {
        '{person_id}': personId,
      },
      queryParams: {
        append_to_response: 'movie_credits,tv_credits',
        language: 'en-US',
      },
    });
  }

  personMovieCredit(personId: number): Observable<PersonDetailMovieCredits> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetailMovieCredits>(
      {
        serviceKey: `/person/{person_id}/movie_credits`,
        pathParams: { '{person_id}': personId },
        queryParams: {
          language: 'en-US',
        },
      }
    );
  }

  personTVCredit(personId: number): Observable<PersonDetailTVCredits> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PersonDetailTVCredits>(
      {
        serviceKey: `/person/{person_id}/tv_credits`,
        pathParams: { '{person_id}': personId },
        queryParams: {
          language: 'en-US',
        },
      }
    );
  }
}
