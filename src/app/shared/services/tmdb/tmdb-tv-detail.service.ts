import { Observable } from 'rxjs';
import { TVCredit, TVDetail } from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

@Injectable({ providedIn: 'root' })
export class TMDBTVDetailService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor() {}

  tvDetailChained(tvId: number): Observable<TVDetail> {
    return this.httpClient.get<TVDetail>(
      `${this.tmdbBaseUrl}/tv/${tvId}?append_to_response=aggregate_credits%2Ccontent_ratings%2Cvideos%2Ckeywords&language=en-US&api_key=${this.tmdbApiKey}`
    );
  }

  tvCredits(tvId: number): Observable<TVCredit> {
    return this.httpClient.get<TVCredit>(
      `${this.tmdbBaseUrl}/tv/${tvId}/credits?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }
}
