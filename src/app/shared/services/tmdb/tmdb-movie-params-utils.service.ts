import { Injectable } from '@angular/core';
import {
  PayloadDiscoveryMovie,
  VoteAverage,
} from '../../interfaces/store/discovery-movie-state.interface';
import { TMDBParamsUtilsAbstractService } from './abstract/tmdb-params-utils.abstract.service';
import { DateRange } from '../../interfaces/store/discovery-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBMovieParamsUtilsService extends TMDBParamsUtilsAbstractService {
  constructor() {
    super();
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
        this.buildSortBy(payload.sortBy)
      );
    }
    if (payload.releaseDate.from || payload.releaseDate.to) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildReleaseDateParams(payload.releaseDate)
      );
    }
    if (payload.certification) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildCertification(payload.certification)
      );
    }
    if (payload.language) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildLanguage(payload.language)
      );
    }
    if (payload.voteAverage) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildVoteAverageParams(payload.voteAverage)
      );
    }
    return filtersQueryParams;
  }

  private buildReleaseDateParams(releaseDate: DateRange) {
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

  private buildCertification(certification: string) {
    return `&certification=${encodeURIComponent(certification)}`;
  }
}
