import { inject, Injectable } from '@angular/core';
import { I18E, TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';

import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryMovieService {
  tmdbApiKey: string = inject(TMDB_API_KEY);
  tmdbBaseUrl: string = inject(TMDB_BASE_URL);
  httpClient = inject(HttpClient);
  i18e: string = inject(I18E);

  constructor(
    private TMDBMovieParamsUtilsService: TMDBMovieParamsUtilsService
  ) {}

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

  movieDiscoveryByPersonId(personId: number): Observable<MovieResult> {
    return this.discoverMovieCall(
      1,
      this.TMDBMovieParamsUtilsService.buildParamsPersonDetailMovieDiscovery(
        personId
      )
    );
  }

  additionalMovieDiscoveryByPersonId(
    page: number,
    personId: number
  ): Observable<MovieResult> {
    return this.discoverMovieCall(
      page + 1,
      this.TMDBMovieParamsUtilsService.buildParamsPersonDetailMovieDiscovery(
        personId
      )
    );
  }

  private discoverMovieCall(
    page: number,
    queryParams: string
  ): Observable<MovieResult> {
    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}/discover/movie?include_adult=false${queryParams}&certification_country=${this.i18e}&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
