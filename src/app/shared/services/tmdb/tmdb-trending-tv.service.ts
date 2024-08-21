import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TimeWindow,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBTrendingTVService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  trendingTV(timeWindow: TimeWindow): Observable<TVResult> {
    return this.httpClient.get<TVResult>(
      `${this.tmdbBaseUrl}/trending/tv/${timeWindow}?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }
}
