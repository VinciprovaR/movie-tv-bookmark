import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TMDB_API_KEY, TMDB_BASE_URL } from '../../../providers';
import { TMDBService } from './tmdb.abstract.service';
import { Observable, map, of } from 'rxjs';
import { MovieResult, TVResult, MediaType } from '../../models/media.models';
import { PayloadDiscoveryMovie } from '../../models/store/discovery-movie-state.models';

@Injectable({
  providedIn: 'root',
})
export class TMDBDiscoveryService extends TMDBService {
  constructor() {
    super();
  }

  movieDiscoveryInit(payload: any) {
    return this.mediaDiscovery(1, payload, 'movie') as Observable<MovieResult>;
  }

  tvDiscoveryInit(payload: any) {
    return this.mediaDiscovery(1, payload, 'tv') as Observable<TVResult>;
  }

  additionalMovieDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie
  ): Observable<MovieResult> {
    return this.mediaDiscovery(
      page + 1,
      payload,
      'movie'
    ) as Observable<MovieResult>;
  }

  additionalTVDiscovery(page: number, payload: any): Observable<TVResult> {
    return this.mediaDiscovery(page + 1, payload, 'tv') as Observable<TVResult>;
  }

  private mediaDiscovery(
    page: number,
    payload: PayloadDiscoveryMovie,
    mediaType: MediaType
  ): Observable<MovieResult | TVResult | null> {
    let filtersQueryParams = this.buildFiltersParam(payload);

    return this.httpClient.get<MovieResult | TVResult>(
      `${this.tmdbBaseUrl}/discover/${mediaType}?include_adult=false${filtersQueryParams}&language=en-US&page=${page}&api_key=${this.tmdbApiKey}`
    );
  }

  buildFiltersParam(payload: PayloadDiscoveryMovie) {
    let filtersQueryParams = '';
    if (payload.genreIdList.length > 0) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildGenresIdParam(payload.genreIdList)
      );
    }
    if (payload.sortBy) {
      filtersQueryParams = filtersQueryParams.concat(
        `&sort_by=${payload.sortBy}`
      );
    }
    if (payload.releaseDate.from || payload.releaseDate.to) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildReleaseDateParams(payload.releaseDate)
      );
    }
    return filtersQueryParams;
  }

  buildReleaseDateParams(releaseDate: { from: string; to: string }) {
    let releaseDateQueryParams = '';
    if (releaseDate.from) {
      releaseDateQueryParams = releaseDateQueryParams.concat(
        `&primary_release_date.gte=${releaseDate.from}`
      );
    }
    if (releaseDate.to) {
      releaseDateQueryParams = releaseDateQueryParams.concat(
        `&primary_release_date.lte=${releaseDate.to}`
      );
    }

    return releaseDateQueryParams;
  }

  buildGenresIdParam(genresSelectedId: number[]) {
    let genresQueryParam: string = '&with_genres=';

    genresSelectedId.forEach((genreId, i) => {
      genresQueryParam = genresQueryParam.concat(`${genreId}`);
      if (i !== genresSelectedId.length - 1) {
        genresQueryParam = genresQueryParam.concat(`,`);
      }
    });
    return genresQueryParam;
  }
}
