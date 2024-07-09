import { Injectable } from '@angular/core';
import { VoteAverage } from '../../../interfaces/store/discovery-movie-state.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class TMDBParamsUtilsAbstractService {
  constructor() {}

  buildSortBy(sortBy: string) {
    return `&sort_by=${sortBy}`;
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

  buildLanguage(language: string) {
    return `&with_original_language=${language}`;
  }

  buildVoteAverageParams(voteAverage: VoteAverage) {
    return `&vote_average.gte=${voteAverage.voteAverageMin}&vote_average.lte=${voteAverage.voteAverageMax}`;
  }
}
