import { Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  switchMap,
  of,
  map,
  catchError,
  first,
  forkJoin,
  mergeMap,
} from 'rxjs';
import { FiltersMetadataActions } from '.';
import { ErrorResponse } from '../../interfaces/error.interface';
import {
  Certification,
  Genre,
  Language,
} from '../../interfaces/TMDB/tmdb-filters.interface';
import { TMDBFilterMediaService } from '../../services/tmdb/tmdb-filter-media.service';

@Injectable()
export class FiltersMetadataEffects {
  getFiltersMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FiltersMetadataActions.getFiltersMetadata),

      switchMap(() => {
        const genreListMovie$ =
          this.TMDBFilterMediaService.retriveGenreMovieList().pipe(
            first(),
            map((genreList: Genre[]) => {
              return FiltersMetadataActions.getGenreListMovieSuccess({
                genreList,
              });
            })
          );
        const getCertificationListMovie$ =
          this.TMDBFilterMediaService.retriveCertificationMovieList().pipe(
            first(),
            map((certificationList: Certification[]) => {
              return FiltersMetadataActions.getCertificationListMovieSuccess({
                certificationList,
              });
            })
          );

        const genreListTV$ =
          this.TMDBFilterMediaService.retriveGenreTVList().pipe(
            first(),
            map((genreList: Genre[]) => {
              return FiltersMetadataActions.getGenreListTVSuccess({
                genreList,
              });
            })
          );

        const getLanguagesListMedia$ =
          this.TMDBFilterMediaService.retriveLanguagesList().pipe(
            first(),
            map((languageList: Language[]) => {
              return FiltersMetadataActions.getLanguagesListMediaSuccess({
                languageList,
              });
            })
          );

        return forkJoin([
          genreListMovie$,
          getCertificationListMovie$,
          genreListTV$,
          getLanguagesListMedia$,
        ])
          .pipe(
            mergeMap((response) => [
              response[0],
              response[1],
              response[2],
              response[3],
            ])
          )
          .pipe(
            catchError((httpErrorResponse: ErrorResponse) => {
              console.error(httpErrorResponse);
              return of(
                FiltersMetadataActions.filtersMetadataFailure({
                  httpErrorResponse,
                })
              );
            })
          );
      })
    );
  });

  constructor(
    private actions$: Actions,
    private TMDBFilterMediaService: TMDBFilterMediaService
  ) {}
}
