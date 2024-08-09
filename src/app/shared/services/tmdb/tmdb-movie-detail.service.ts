import { Observable } from 'rxjs';
import {
  MediaCredit,
  MovieDetail,
  ReleaseDates,
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

  movieDetailChained(movieId: number): Observable<MovieDetail> {
    return this.httpClient.get<MovieDetail>(
      `${this.tmdbBaseUrl}/movie/${movieId}?append_to_response=credits%2Crelease_dates%2Cvideos%2Ckeywords&language=en-US&api_key=${this.tmdbApiKey}`
    );
  }

  // movieDetail(movieId: number): Observable<MovieDetail> {
  //   return this.httpClient.get<MovieDetail>(
  //     `${this.tmdbBaseUrl}/movie/${movieId}?language=en-US&api_key=${this.tmdbApiKey}`
  //   );
  // }

  // movieCredit(movieId: number): Observable<MediaCredit> {
  //   return this.httpClient.get<MediaCredit>(
  //     `${this.tmdbBaseUrl}/movie/${movieId}/credits?language=en-US&api_key=${this.tmdbApiKey}`
  //   );
  // }

  // movieReleaseDate(movieId: number): Observable<ReleaseDates> {
  //   return this.httpClient.get<ReleaseDates>(
  //     `${this.tmdbBaseUrl}/movie/${movieId}/release_dates?language=en-US&api_key=${this.tmdbApiKey}`
  //   );
  // }

  // movieVideos(movieId: number): Observable<any> {
  //   return this.httpClient.get<any>(
  //     `${this.tmdbBaseUrl}/movie/${movieId}/videos?language=en-US&api_key=${this.tmdbApiKey}`
  //   );
  // }
}
