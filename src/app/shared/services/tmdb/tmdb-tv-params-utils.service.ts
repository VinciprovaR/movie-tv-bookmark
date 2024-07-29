import { Injectable } from '@angular/core';
import { AbstractTMDBParamsUtilsService } from './abstract/abstract-tmdb-params-utils.service';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';
import { DateRange } from '../../interfaces/store/discovery-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBTVParamsUtilsService extends AbstractTMDBParamsUtilsService {
  constructor() {
    super();
  }

  buildParamsFeatureTVDiscovery(payload: PayloadDiscoveryTV) {
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
    if (payload.airDate?.from || payload.airDate?.to) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildAirDateParams(payload.airDate, payload.allEpisode)
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

  buildParamsPersonDetailTVDiscovery(personId: number) {
    let filtersQueryParams = '';
    if (personId) {
      filtersQueryParams = filtersQueryParams.concat(
        this.buildPeopleParams(personId.toString())
      );
    }
    return filtersQueryParams;
  }

  private buildAirDateParams(airDate: DateRange, allEpisode: boolean) {
    let releaseDateQueryParams = '';
    let airType = allEpisode ? 'air_date' : 'first_air_date';
    if (airDate.from) {
      releaseDateQueryParams = releaseDateQueryParams.concat(
        `&${airType}.gte=${airDate.from}`
      );
    }
    if (airDate.to) {
      releaseDateQueryParams = releaseDateQueryParams.concat(
        `&${airType}.lte=${airDate.to}`
      );
    }

    return releaseDateQueryParams;
  }
}
