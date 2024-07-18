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
import { HttpErrorResponse } from '@angular/common/http';

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
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                FiltersMetadataActions.getGenreListMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );
        const getCertificationListMovie$ =
          this.TMDBFilterMediaService.retriveCertificationMovieList().pipe(
            first(),
            map((certificationList: Certification[]) => {
              return FiltersMetadataActions.getCertificationListMovieSuccess({
                certificationList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                FiltersMetadataActions.getCertificationListMovieFailure({
                  httpErrorResponse,
                })
              );
            })
          );

        const genreListTV$ =
          this.TMDBFilterMediaService.retriveGenreTVList().pipe(
            first(),
            map((genreList: Genre[]) => {
              return FiltersMetadataActions.getGenreListTVSuccess({
                genreList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                FiltersMetadataActions.getGenreListTVFailure({
                  httpErrorResponse,
                })
              );
            })
          );

        const getLanguagesListMedia$ =
          this.TMDBFilterMediaService.retriveLanguagesList().pipe(
            first(),
            map((languageList: Language[]) => {
              return FiltersMetadataActions.getLanguagesListMediaSuccess({
                languageList,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) => {
              return of(
                FiltersMetadataActions.getLanguagesListMediaFailure({
                  httpErrorResponse,
                })
              );
            })
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

  constructor(
    private actions$: Actions,
    private TMDBFilterMediaService: TMDBFilterMediaService
  ) {}
}
