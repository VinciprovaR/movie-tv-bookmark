import { Observable } from 'rxjs';
import {
  MovieCredit,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TMDBMovieDetailService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  movieDetailChained(movieId: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/movie/${movieId}?append_to_response=credits%2Crelease_dates%2Cvideos%2Ckeywords&language=en-US&api_key=${this.tmdbApiKey}`
    );
  }

  movieCredits(movieId: number): Observable<MovieCredit> {
    return this.httpClient.get<MovieCredit>(
      `${this.tmdbBaseUrl}/movie/${movieId}/credits?language=en-US&api_key=${this.tmdbApiKey}`
    );
  }
}
