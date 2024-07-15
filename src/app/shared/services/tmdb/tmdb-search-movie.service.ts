import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { TMDBMovieService } from './abstract/tmdb-movie.abstract.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBSearchMovieService extends TMDBMovieService {
  constructor() {
    super();
  }

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
