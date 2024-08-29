import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import {
  MovieDetail,
  MovieResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { MovieBookmarkActions, MovieBookmarkSelectors } from '.';
import { SearchMovieActions } from '../search-movie';
import { DiscoveryMovieActions } from '../discovery-movie';
import { MovieBookmarkMap } from '../../interfaces/supabase/supabase-bookmark.interface';
import { SupabaseMovieBookmarkService } from '../../services/supabase';
import { Movie_Data, Movie_Bookmark } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import {
  personDetailMovieCreditsSuccess,
  movieDetailSuccess,
} from '../../component-store';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

@Injectable()
export class MovieBookmarkEffects {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly supabaseMovieBookmarkService = inject(
    SupabaseMovieBookmarkService
  );

  constructor() {}

  initMovieBookmarkMapFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MovieBookmarkActions.searchMovieByBookmarkLandingSuccess,
        MovieBookmarkActions.searchMovieByBookmarkSubmitSuccess
      ),
      switchMap((action) => {
        let { movieList }: { movieList: Movie_Bookmark[] & Movie_Data[] } =
          action;
        return this.supabaseMovieBookmarkService
          .initMovieBookmarkMapFromMovieResultSupabase(movieList)
          .pipe(
            map((movieBookmarkMapResult: MovieBookmarkMap) => {
              return MovieBookmarkActions.populateMovieBookmarkMapSuccess({
                movieBookmarkMap: movieBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.populateMovieBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  initMovieBookmarkMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchMovieActions.searchMovieSuccess,
        SearchMovieActions.searchAdditionalMovieSuccess,
        DiscoveryMovieActions.discoveryMovieSuccess,
        DiscoveryMovieActions.discoveryAdditionalMovieSuccess,
        personDetailMovieCreditsSuccess
      ),
      switchMap((action) => {
        let { movieResult }: { movieResult: MovieResult } = action;
        return this.supabaseMovieBookmarkService
          .initMovieBookmarkMapFromMovieResultTMDB(movieResult.results)
          .pipe(
            map((movieBookmarkMapResult: MovieBookmarkMap) => {
              return MovieBookmarkActions.populateMovieBookmarkMapSuccess({
                movieBookmarkMap: movieBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.populateMovieBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  initMovieBookmarkMapDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(movieDetailSuccess),
      switchMap((action) => {
        let { movieDetail }: { movieDetail: MovieDetail } = action;

        return this.supabaseMovieBookmarkService
          .initMovieBookmarkMapFromMovieResultTMDB([movieDetail])
          .pipe(
            map((movieBookmarkMapResult: MovieBookmarkMap) => {
              return MovieBookmarkActions.populateMovieBookmarkMapSuccess({
                movieBookmarkMap: movieBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.populateMovieBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  createUpdateDeleteMovieBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.createUpdateDeleteMovieBookmark),
      switchMap((action) => {
        let { mediaBookmarkDTO } = action;
        return this.supabaseMovieBookmarkService
          .crudOperationResolver(mediaBookmarkDTO)
          .pipe(
            map((operation: crud_operations) => {
              return MovieBookmarkActions.crudOperationsInit[operation]({
                operation,
                mediaBookmarkDTO,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.createUpdateDeleteMovieBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  createMovieBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.createMovieBookmark),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaBookmarkDTO, operation }, user] = action;
        return this.supabaseMovieBookmarkService
          .createMovieBookmark(mediaBookmarkDTO, user as User)
          .pipe(
            map((movieBookmarkMap: MovieBookmarkMap) => {
              return MovieBookmarkActions.createMovieBookmarkSuccess({
                movieBookmarkMap: movieBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.title} added in ${
                  movieBookmarkMap[+Object.keys(movieBookmarkMap)[0]]
                } bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.createMovieBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  updateMovieBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.updateMovieBookmark),
      switchMap((action) => {
        let { mediaBookmarkDTO, operation } = action;
        return this.supabaseMovieBookmarkService
          .updateMovieBookmark(mediaBookmarkDTO)
          .pipe(
            map((movieBookmarkMap: MovieBookmarkMap) => {
              return MovieBookmarkActions.updateMovieBookmarkSuccess({
                movieBookmarkMap: movieBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.title} added in ${
                  movieBookmarkMap[+Object.keys(movieBookmarkMap)[0]]
                } bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.updateMovieBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  deleteMovieBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.deleteMovieBookmark),

      switchMap((action) => {
        let { mediaBookmarkDTO, operation } = action;
        return this.supabaseMovieBookmarkService
          .deleteMovieBookmark(mediaBookmarkDTO)
          .pipe(
            map((movieBookmarkMap: MovieBookmarkMap) => {
              return MovieBookmarkActions.deleteMovieBookmarkSuccess({
                movieBookmarkMap: movieBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.title} removed from bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.deleteMovieBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  unchangedMovieBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.unchangedMovieBookmark),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaBookmarkDTO, operation }, user] = action;
        return this.supabaseMovieBookmarkService
          .unchangedMovieBookmark(mediaBookmarkDTO, user as User)
          .pipe(
            map((movieBookmarkMap: MovieBookmarkMap) => {
              return MovieBookmarkActions.unchangedMovieBookmarkSuccess({
                movieBookmarkMap: movieBookmarkMap,
                operation,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.unchangedMovieBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  updateSearchMovieByBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        MovieBookmarkActions.createMovieBookmarkSuccess,
        MovieBookmarkActions.deleteMovieBookmarkSuccess,
        MovieBookmarkActions.updateMovieBookmarkSuccess
      ),
      switchMap((action) => {
        return of(MovieBookmarkActions.updateSearchMovieByBookmark());
      })
    );
  });

  searchMovieByBookmarkLanding$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.searchMovieByBookmarkLanding),
      withLatestFrom(this.store.select(MovieBookmarkSelectors.selectPayload)),
      switchMap((action) => {
        let [{ bookmarkEnum }, payloadState] = action;

        return this.supabaseMovieBookmarkService
          .findMovieByBookmarkId(bookmarkEnum, payloadState)
          .pipe(
            map((movieList: Movie_Bookmark[] & Movie_Data[]) => {
              return MovieBookmarkActions.searchMovieByBookmarkLandingSuccess({
                movieList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.searchMovieByBookmarkLandingeFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  searchMovieByBookmarkSubmit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MovieBookmarkActions.searchMovieByBookmarkSubmit),
      switchMap((action) => {
        let { bookmarkEnum, payload: payloadSubmit } = action;

        return this.supabaseMovieBookmarkService
          .findMovieByBookmarkId(bookmarkEnum, payloadSubmit)
          .pipe(
            map((movieList: Movie_Bookmark[] & Movie_Data[]) => {
              return MovieBookmarkActions.searchMovieByBookmarkSubmitSuccess({
                movieList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  MovieBookmarkActions.searchMovieByBookmarkSubmitFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });
}
