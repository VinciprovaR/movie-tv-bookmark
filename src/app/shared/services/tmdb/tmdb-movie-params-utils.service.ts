import { Injectable } from '@angular/core';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { AbstractTMDBParamsUtilsService } from './abstract/abstract-tmdb-params-utils.service';
import { DateRange } from '../../interfaces/store/discovery-state.interface';
import { PayloadPersonDetail } from '../../store/component-store/person-detail-store.service';

@Injectable({
  providedIn: 'root',
})
export class TMDBMovieParamsUtilsService extends AbstractTMDBParamsUtilsService {
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
    if (payload.minVote) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildMinVoteParams(payload.minVote)
      );
    }

    return filtersQueryParams;
  }

  buildFiltersParamPersonDetail(payload: PayloadPersonDetail) {
    let filtersQueryParams = '';
    if (payload.personId) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildPeopleParams(payload.personId.toString())
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
