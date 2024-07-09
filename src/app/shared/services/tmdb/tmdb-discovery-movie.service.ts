import { inject, Injectable } from '@angular/core';
import { I18E } from '../../../providers';
import { Observable } from 'rxjs';
import { MovieResult } from '../../interfaces/media.interface';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { TMDBMovieService } from './abstract/tmdb-movie.abstract.service';
import { TMDBMovieParamsUtilsService } from './tmdb-movie-params-utils.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryMovieService extends TMDBMovieService {
  i18e: string = inject(I18E);

  constructor(
    private TMDBMovieParamsUtilsService: TMDBMovieParamsUtilsService
  ) {
    super();
  }

  movieDiscoveryInit(payload: PayloadDiscoveryMovie): Observable<MovieResult> {
    return this.movieDiscovery(1, payload);
  }

  additionalMovieDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie
  ): Observable<MovieResult> {
    return this.movieDiscovery(page + 1, payload);
  }

  private movieDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie
  ): Observable<MovieResult> {
    let filtersQueryParams =
      this.TMDBMovieParamsUtilsService.buildFiltersParam(payload);

    return this.httpClient.get<MovieResult>(
      `${this.tmdbBaseUrl}/discover/movie?include_adult=false${filtersQueryParams}&certification_country=${this.i18e}&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }
}
