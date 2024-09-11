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
}
