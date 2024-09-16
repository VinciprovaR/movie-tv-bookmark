import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  first,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';
import { FiltersMetadataActions } from '.';
import { CustomHttpErrorResponseInterface } from '../../../shared/interfaces/customHttpErrorResponse.interface';
import {
  Certification,
  Genre,
  Language,
} from '../../../shared/interfaces/TMDB/tmdb-filters.interface';
import { TMDBFilterMediaService } from '../../services/tmdb-filter-media.service';

@Injectable()
export class FiltersMetadataEffects {
  private readonly actions$ = inject(Actions);
  private readonly TMDBFilterMediaService = inject(TMDBFilterMediaService);

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
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  FiltersMetadataActions.getGenreListMovieFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
        const getCertificationListMovie$ =
          this.TMDBFilterMediaService.retriveCertificationMovieList().pipe(
            first(),
            map((certificationList: Certification[]) => {
              return FiltersMetadataActions.getCertificationListMovieSuccess({
                certificationList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  FiltersMetadataActions.getCertificationListMovieFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );

        const genreListTV$ =
          this.TMDBFilterMediaService.retriveGenreTVList().pipe(
            first(),
            map((genreList: Genre[]) => {
              return FiltersMetadataActions.getGenreListTVSuccess({
                genreList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  FiltersMetadataActions.getGenreListTVFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );

        const getLanguagesListMedia$ =
          this.TMDBFilterMediaService.retriveLanguagesList().pipe(
            first(),
            map((languageList: Language[]) => {
              return FiltersMetadataActions.getLanguagesListMediaSuccess({
                languageList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  FiltersMetadataActions.getLanguagesListMediaFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );

        return forkJoin([
          genreListMovie$,
          getCertificationListMovie$,
          genreListTV$,
          getLanguagesListMedia$,
        ]).pipe(
          mergeMap((response) => [
            response[0],
            response[1],
            response[2],
            response[3],
          ])
        );
      })
    );
  });
}
