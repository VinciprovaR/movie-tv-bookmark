import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { TVDetail, TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors } from '../auth';
import { User } from '@supabase/supabase-js';
import { TVBookmarkActions, TVBookmarkSelectors } from '.';
import { SearchTVActions } from '../search-tv';
import { DiscoveryTVActions } from '../discovery-tv';
import { TVBookmarkMap } from '../../interfaces/supabase/supabase-bookmark.interface';
import { SupabaseTVBookmarkService } from '../../services/supabase';
import { TV_Data, TV_Bookmark } from '../../interfaces/supabase/entities';

import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import {
  personDetailTVCreditsSuccess,
  tvDetailSuccess,
} from '../../component-store';
import { CustomHttpErrorResponseInterface } from '../../interfaces/customHttpErrorResponse.interface';

@Injectable()
export class TVBookmarkEffects {
  private readonly actions$ = inject(Actions);
  private readonly supabaseTVBookmarkService = inject(
    SupabaseTVBookmarkService
  );
  private readonly store = inject(Store);
  constructor() {}

  initTVBookmarkMapFromList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TVBookmarkActions.searchTVByBookmarkLandingSuccess,
        TVBookmarkActions.searchTVByBookmarkSubmitSuccess
      ),
      switchMap((action) => {
        let { tvList }: { tvList: TV_Bookmark[] & TV_Data[] } = action;
        return this.supabaseTVBookmarkService
          .initTVBookmarkMapFromTVResultSupabase(tvList)
          .pipe(
            map((tvBookmarkMapResult: TVBookmarkMap) => {
              return TVBookmarkActions.populateTVBookmarkMapSuccess({
                tvBookmarkMap: tvBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.populateTVBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  initTVBookmarkMap$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        SearchTVActions.searchTVSuccess,
        SearchTVActions.searchAdditionalTVSuccess,
        DiscoveryTVActions.discoveryTVSuccess,
        DiscoveryTVActions.discoveryAdditionalTVSuccess,
        personDetailTVCreditsSuccess
      ),
      switchMap((action) => {
        let { tvResult }: { tvResult: TVResult } = action;
        return this.supabaseTVBookmarkService
          .initTVBookmarkMapFromTVResultTMDB(tvResult.results)
          .pipe(
            map((tvBookmarkMapResult: TVBookmarkMap) => {
              return TVBookmarkActions.populateTVBookmarkMapSuccess({
                tvBookmarkMap: tvBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.populateTVBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  initTVBookmarkMapDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(tvDetailSuccess),
      switchMap((action) => {
        let { tvDetail }: { tvDetail: TVDetail } = action;

        return this.supabaseTVBookmarkService
          .initTVBookmarkMapFromTVResultTMDB([tvDetail])
          .pipe(
            map((tvBookmarkMapResult: TVBookmarkMap) => {
              return TVBookmarkActions.populateTVBookmarkMapSuccess({
                tvBookmarkMap: tvBookmarkMapResult,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.populateTVBookmarkMapFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  createUpdateDeleteTVBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.createUpdateDeleteTVBookmark),
      switchMap((action) => {
        let { mediaBookmarkDTO } = action;
        return this.supabaseTVBookmarkService
          .crudOperationResolver(mediaBookmarkDTO)
          .pipe(
            map((operation: crud_operations) => {
              return TVBookmarkActions.crudOperationsInit[operation]({
                operation,
                mediaBookmarkDTO,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.createUpdateDeleteTVBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  createTVBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.createTVBookmark),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaBookmarkDTO, operation }, user] = action;
        return this.supabaseTVBookmarkService
          .createTVBookmark(mediaBookmarkDTO, user as User)
          .pipe(
            map((tvBookmarkMap: TVBookmarkMap) => {
              return TVBookmarkActions.createTVBookmarkSuccess({
                tvBookmarkMap: tvBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.name} added in ${
                  tvBookmarkMap[+Object.keys(tvBookmarkMap)[0]]
                } bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.createTVBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  updateTVBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.updateTVBookmark),
      switchMap((action) => {
        let { mediaBookmarkDTO, operation } = action;
        return this.supabaseTVBookmarkService
          .updateTVBookmark(mediaBookmarkDTO)
          .pipe(
            map((tvBookmarkMap: TVBookmarkMap) => {
              return TVBookmarkActions.updateTVBookmarkSuccess({
                tvBookmarkMap: tvBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.name} added in ${
                  tvBookmarkMap[+Object.keys(tvBookmarkMap)[0]]
                } bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.updateTVBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  deleteTVBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.deleteTVBookmark),

      switchMap((action) => {
        let { mediaBookmarkDTO, operation } = action;
        return this.supabaseTVBookmarkService
          .deleteTVBookmark(mediaBookmarkDTO)
          .pipe(
            map((tvBookmarkMap: TVBookmarkMap) => {
              return TVBookmarkActions.deleteTVBookmarkSuccess({
                tvBookmarkMap: tvBookmarkMap,
                operation,
                notifyMsg: `${mediaBookmarkDTO.mediaDataDTO.name} removed from bookmark!`,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.deleteTVBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  unchangedTVBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.unchangedTVBookmark),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      switchMap((action) => {
        let [{ mediaBookmarkDTO, operation }, user] = action;
        return this.supabaseTVBookmarkService
          .unchangedTVBookmark(mediaBookmarkDTO, user as User)
          .pipe(
            map((tvBookmarkMap: TVBookmarkMap) => {
              return TVBookmarkActions.unchangedTVBookmarkSuccess({
                tvBookmarkMap: tvBookmarkMap,
                operation,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.unchangedTVBookmarkFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  updateSearchTVByBookmark$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TVBookmarkActions.createTVBookmarkSuccess,
        TVBookmarkActions.deleteTVBookmarkSuccess,
        TVBookmarkActions.updateTVBookmarkSuccess
      ),
      switchMap((action) => {
        return of(TVBookmarkActions.updateSearchTVByBookmark());
      })
    );
  });

  searchTVByBookmarkLanding$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.searchTVByBookmarkLanding),
      withLatestFrom(this.store.select(TVBookmarkSelectors.selectPayload)),
      switchMap((action) => {
        let [{ bookmarkEnum }, payloadState] = action;

        return this.supabaseTVBookmarkService
          .findTVByBookmarkId(bookmarkEnum, payloadState)
          .pipe(
            map((tvList: TV_Bookmark[] & TV_Data[]) => {
              return TVBookmarkActions.searchTVByBookmarkLandingSuccess({
                tvList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.searchTVByBookmarkLandingeFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  searchTVByBookmarkSubmit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TVBookmarkActions.searchTVByBookmarkSubmit),
      switchMap((action) => {
        let { bookmarkEnum, payload: payloadSubmit } = action;

        return this.supabaseTVBookmarkService
          .findTVByBookmarkId(bookmarkEnum, payloadSubmit)
          .pipe(
            map((tvList: TV_Bookmark[] & TV_Data[]) => {
              return TVBookmarkActions.searchTVByBookmarkSubmitSuccess({
                tvList,
              });
            }),
            catchError(
              (httpErrorResponse: CustomHttpErrorResponseInterface) => {
                return of(
                  TVBookmarkActions.searchTVByBookmarkSubmitFailure({
                    httpErrorResponse,
                  })
                );
              }
            )
          );
      })
    );
  });

  cleanState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AuthActions.logoutLocalSuccess,
        AuthActions.logoutGlobalSuccess,
        AuthActions.loginSuccess
      ),
      switchMap((action) => {
        return of(TVBookmarkActions.cleanState());
      })
    );
  });
}
