import { Injectable } from '@angular/core';
import { AbstractTMDBParamsUtilsService } from '../../../shared/abstract/services/abstract-tmdb-params-utils.service';
import { PayloadDiscoveryMovie } from '../../../shared/interfaces/store/discovery-movie-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TMDBMovieParamsUtilsService extends AbstractTMDBParamsUtilsService {
  constructor() {
    super();
  }

  buildParamsFeatureMovieDiscovery(
    payload: PayloadDiscoveryMovie
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
    if (payload.releaseDate.from || payload.releaseDate.to) {
      filtersQueryParams['primary_release_date.gte'] = payload.releaseDate.from;
      filtersQueryParams['primary_release_date.lte'] = payload.releaseDate.to;
    }
    if (payload.certification) {
      filtersQueryParams['certification'] = this.buildCertification(
        payload.certification
      );
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

  private buildCertification(certification: string) {
    return `${encodeURIComponent(certification)}`;
  }
}
