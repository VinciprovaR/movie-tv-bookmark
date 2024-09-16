import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupabaseProxyToTMDBService } from '../../../core/services/supabase-proxy-to-tmdb.service';
import { PeopleResult } from '../../../shared/interfaces/TMDB/tmdb-media.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchPeopleService {
  private readonly supabaseProxyToTMDBService = inject(
    SupabaseProxyToTMDBService
  );

  peopleSearchInit(query: string): Observable<PeopleResult> {
    return this.peopleSearch(1, query);
  }

  additionalPeopleSearch(
    page: number,
    query: string
  ): Observable<PeopleResult> {
    return this.peopleSearch(page + 1, query);
  }

  private peopleSearch(page: number, query: string): Observable<PeopleResult> {
    return this.supabaseProxyToTMDBService.callSupabaseFunction<PeopleResult>({
      serviceKey: `/search/person`,
      queryParams: {
        query: query,
        page: page.toString(),
        language: 'en-US',
        include_adult: 'false',
      },
    });
  }
}
