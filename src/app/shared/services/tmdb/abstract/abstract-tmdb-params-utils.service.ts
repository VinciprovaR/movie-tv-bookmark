import { VoteAverage } from '../../../interfaces/store/discovery-state.interface';

export abstract class AbstractTMDBParamsUtilsService {
  constructor() {}

  protected buildGenresIdParam(genresSelectedId: number[]) {
    let genresQueryParam = '';
    genresSelectedId.forEach((genreId, i) => {
      genresQueryParam = genresQueryParam.concat(`${genreId}`);
      if (i !== genresSelectedId.length - 1) {
        genresQueryParam = genresQueryParam.concat(`,`);
      }
    });
    return genresQueryParam;
  }

  // protected buildSortBy(sortBy: string) {
  //   return `&sort_by=${sortBy}`;
  // }

  // protected buildGenresIdParam(genresSelectedId: number[]) {
  //   let genresQueryParam: string = '&with_genres=';

  //   genresSelectedId.forEach((genreId, i) => {
  //     genresQueryParam = genresQueryParam.concat(`${genreId}`);
  //     if (i !== genresSelectedId.length - 1) {
  //       genresQueryParam = genresQueryParam.concat(`,`);
  //     }
  //   });
  //   return genresQueryParam;
  // }

  // protected buildLanguage(language: string) {
  //   return `&with_original_language=${language}`;
  // }

  // protected buildVoteAverageParams(voteAverage: VoteAverage) {
  //   return `&vote_average.gte=${voteAverage.voteAverageMin}&vote_average.lte=${voteAverage.voteAverageMax}`;
  // }

  // protected buildMinVoteParams(minVote: number) {
  //   return `&vote_count.gte=${minVote}`;
  // }

  // protected buildPeopleParams(personId: string) {
  //   return `&with_people=${personId}`;
  // }
}
