import { Observable } from 'rxjs';
import {
  MediaCredit,
  MovieDetail,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';

@Injectable({ providedIn: 'root' })
export class TMDBMovieDetailService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);

  constructor() {}

  movieDetail(movieId: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/movie/${movieId}?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }

  movieCredit(movieId: number): Observable<MediaCredit> {
    return this.httpClient.get<MediaCredit>(
      `${this.tmdbBaseUrl}/movie/${movieId}/credits?language=en-US&&api_key=${this.tmdbApiKey}`
    );
  }
}
