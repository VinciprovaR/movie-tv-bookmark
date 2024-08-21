import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchMovieService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  constructor() {}

  movieSearchInit(query: string): Observable<MovieResult> {
    return this.movieSearch(1, query);
  }

  additionalMovieSearch(page: number, query: string): Observable<MovieResult> {
    return this.movieSearch(page + 1, query);
  }

  private movieSearch(page: number, query: string): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
