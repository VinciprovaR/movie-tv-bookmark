import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  MovieResult,
  TimeWindow,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBTrendingMovieService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}
  trendingMovie(timeWindow: TimeWindow): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}/trending/movie/${timeWindow}?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }
}
