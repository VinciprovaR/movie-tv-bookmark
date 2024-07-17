import { Observable } from 'rxjs';
import {
  MediaCredit,
  TVDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

@Injectable({ providedIn: 'root' })
export class TMDBTVDetailService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);
  constructor() {}

  tvDetail(tvId: number): Observable<TVDetail> {
    return this.httpClient.get<TVDetail>(
      `${this.tmdbBaseUrl}/tv/${tvId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }

  tvCredit(tvId: number): Observable<MediaCredit> {
    return this.httpClient.get<MediaCredit>(
      `${this.tmdbBaseUrl}/tv/${tvId}/credits?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
