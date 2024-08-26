import { Injectable } from '@angular/core';
import { PayloadDiscoveryMovie } from '../../interfaces/store/discovery-movie-state.interface';
import { AbstractTMDBParamsUtilsService } from './abstract/abstract-tmdb-params-utils.service';
import { DateRange } from '../../interfaces/store/discovery-state.interface';

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

  // buildParamsFeatureMovieDiscovery(payload: PayloadDiscoveryMovie) {
  //   let filtersQueryParams = '';
  //   if (payload.genreIdList.length > 0) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildGenresIdParam(payload.genreIdList)
  //     );
  //   }
  //   if (payload.sortBy) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildSortBy(payload.sortBy)
  //     );
  //   }
  //   if (payload.releaseDate.from || payload.releaseDate.to) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildReleaseDateParams(payload.releaseDate)
  //     );
  //   }
  //   if (payload.certification) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildCertification(payload.certification)
  //     );
  //   }
  //   if (payload.language) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildLanguage(payload.language)
  //     );
  //   }
  //   if (payload.voteAverage) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildVoteAverageParams(payload.voteAverage)
  //     );
  //   }
  //   if (payload.minVote) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildMinVoteParams(payload.minVote)
  //     );
  //   }

  //   return filtersQueryParams;
  // }

  // buildParamsPersonDetailMovieDiscovery(personId: number) {
  //   let filtersQueryParams = '';
  //   if (personId) {
  //     filtersQueryParams = filtersQueryParams.concat(
  //       this.buildPeopleParams(personId.toString())
  //     );
  //   }
  //   return filtersQueryParams;
  // }

  // private buildReleaseDateParams(releaseDate: DateRange) {
  //   let releaseDateQueryParams = '';
  //   if (releaseDate.from) {
  //     releaseDateQueryParams = releaseDateQueryParams.concat(
  //       `&primary_release_date.gte=${releaseDate.from}`
  //     );
  //   }
  //   if (releaseDate.to) {
  //     releaseDateQueryParams = releaseDateQueryParams.concat(
  //       `&primary_release_date.lte=${releaseDate.to}`
  //     );
  //   }

  //   return releaseDateQueryParams;
  // }

  // private buildCertification(certification: string) {
  //   return `&certification=${encodeURIComponent(certification)}`;
  // }
}
