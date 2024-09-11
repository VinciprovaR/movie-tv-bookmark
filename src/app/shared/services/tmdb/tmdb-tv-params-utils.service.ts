import { Injectable } from '@angular/core';
import { AbstractTMDBParamsUtilsService } from './abstract/abstract-tmdb-params-utils.service';
import { PayloadDiscoveryTV } from '../../interfaces/store/discovery-tv-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBTVParamsUtilsService extends AbstractTMDBParamsUtilsService {
  constructor() {
    super();
  }

  buildParamsFeatureTVDiscovery(
    payload: PayloadDiscoveryTV
  ): Record<string, string> {
    let filtersQueryParams: Record<string, string> = {};

    if (payload.genreIdList.length > 0) {
      filtersQueryParams['with_genres'] = this.buildGenresIdParam(
        payload.genreIdList
      );
    }
    if (payload.sortBy) {
      filtersQueryParams['sort_by'] = payload.sortBy;
    }
    if (payload.airDate?.from || payload.airDate?.to) {
      const airType = payload.allEpisode ? 'air_date' : 'first_air_date';
      filtersQueryParams[`${airType}.gte`] = payload.airDate.from;
      filtersQueryParams[`${airType}.lte`] = payload.airDate.to;
    }

    if (payload.language) {
      filtersQueryParams['with_original_language'] = payload.language;
    }
    if (payload.voteAverage) {
      filtersQueryParams['vote_average.gte'] =
        payload.voteAverage.voteAverageMin.toString();
      filtersQueryParams['vote_average.lte'] =
        payload.voteAverage.voteAverageMax.toString();
    }
    if (payload.minVote) {
      filtersQueryParams['vote_count.gte'] = payload.minVote.toString();
    }
    return filtersQueryParams;
  }
}
