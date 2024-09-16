export abstract class AbstractTMDBParamsUtilsService {
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
