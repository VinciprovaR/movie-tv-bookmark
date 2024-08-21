import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryMovieService {
  private readonly tmdbApiKey: string = inject(TMDB_API_KEY);
  private readonly tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  private readonly httpClient = inject(HttpClient);

  private readonly TMDBMovieParamsUtilsService = inject(
    TMDBMovieParamsUtilsService
  );
  constructor() {}

  movieDiscovery(payload: PayloadDiscoveryMovie): Observable<MovieResult> {
    return this.discoverMovieCall(
      1,
      this.TMDBMovieParamsUtilsService.buildParamsFeatureMovieDiscovery(payload)
    );
  }

  additionalMovieDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie
  ): Observable<MovieResult> {
    return this.discoverMovieCall(
      page + 1,
      this.TMDBMovieParamsUtilsService.buildParamsFeatureMovieDiscovery(payload)
    );
  }

  private discoverMovieCall(
    page: number,
    queryParams: string
  ): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}/discover/movie?include_adult=false${queryParams}&certification_country=US&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
