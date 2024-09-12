import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  TV,
  TVDetail,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import { TVData, TVBookmark } from '../../interfaces/supabase/entities';
import { SupabaseTVBookmarkDAO } from './supabase-tv-bookmark.dao';
import {
  bookmarkEnum,
  TVBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';
import { SupabaseUtilsService } from './supabase-utils.service';
import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import { PayloadTVBookmark } from '../../interfaces/store/tv-bookmark-state.interface';

type mediaBookmarkDTOTVType = TV | TVDetail | TVData;

/**
 * SupabaseTVBookmarkService init, find, create, update, delete bookmark
 * related to tv.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseTVBookmarkService {
  private readonly supabaseTVBookmarkDAO = inject(SupabaseTVBookmarkDAO);
  private readonly supabaseTVDataDAO = inject(SupabaseTVDataDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  initTVBookmarkMapFromTVResultTMDB(
    tvList: TV[] | TVData[] | TVDetail[]
  ): Observable<TVBookmarkMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(tvList);
    return this.supabaseTVBookmarkDAO.findBookmarkListByTVIds(mediaIdList).pipe(
      map((tvBookmarkEntityList: TVBookmark[]) => {
        return this.supabaseUtilsService.tvBookmarkMapFactory(
          tvBookmarkEntityList
        );
      })
    );
  }

  initTVBookmarkMapFromTVResultSupabase(
    tvBookmarkEntityList: TVBookmark[] & TVData[]
  ): Observable<TVBookmarkMap> {
    return of(
      this.supabaseUtilsService.tvBookmarkMapFactory(tvBookmarkEntityList)
    );
  }

  removeTVWithBookmark(tvResult: TVResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(tvResult);
    return this.supabaseTVBookmarkDAO.findBookmarkListByTVIds(mediaIdList).pipe(
      map((entityMediaBookmark: TVBookmark[]) => {
        return this.supabaseUtilsService.removeMediaWithBookmark(
          entityMediaBookmark,
          mediaIdMapIndex,
          tvResult
        ) as TVResult;
      })
    );
  }

  findTVByBookmarkId(
    bookmarkEnum: bookmarkEnum,
    payload: PayloadTVBookmark
  ): Observable<TVBookmark[] & TVData[]> {
    return this.supabaseTVBookmarkDAO.findTVByBookmarkId(bookmarkEnum, payload);
  }

  crudOperationResolver(
    tvBookmarkDTO: MediaBookmarkDTO<mediaBookmarkDTOTVType>
  ): Observable<crud_operations> {
    return this.supabaseTVBookmarkDAO
      .findBookmarkListByTVIds([tvBookmarkDTO.mediaDataDTO.id])
      .pipe(
        map((tvBookmarkFromDB: TVBookmark[]) => {
          let operation = this.supabaseUtilsService.checkCase(
            tvBookmarkFromDB,
            tvBookmarkDTO
          );
          if (operation === 'default') {
            throw new Error('Something went wrong. Case default');
          }
          return operation;
        })
      );
  }

  updateTVBookmark(
    tvBookmarkDTO: MediaBookmarkDTO<mediaBookmarkDTOTVType>
  ): Observable<TVBookmarkMap> {
    return this.supabaseTVBookmarkDAO
      .updateTVBookmark(
        tvBookmarkDTO.bookmarkEnum,
        tvBookmarkDTO.mediaDataDTO.id
      )
      .pipe(
        map((tvBookmarkEntityList: TVBookmark[]) => {
          return this.supabaseUtilsService.tvBookmarkMapFactory(
            tvBookmarkEntityList
          );
        })
      );
  }

  createTVBookmark(
    tvBookmarkDTO: MediaBookmarkDTO<mediaBookmarkDTOTVType>,
    user: User
  ): Observable<TVBookmarkMap> {
    return this.supabaseTVDataDAO
      .findByTVId(tvBookmarkDTO.mediaDataDTO.id)
      .pipe(
        switchMap((tvDataEntityList: TVData[]) => {
          if (tvDataEntityList.length === 0) {
            let tvData: TVData = this.supabaseUtilsService.tvDataObjFactory(
              tvBookmarkDTO.mediaDataDTO
            );
            return this.supabaseTVDataDAO.createTVData(tvData);
          }
          return of(tvDataEntityList);
        }),
        switchMap(() => {
          return this.supabaseTVBookmarkDAO.createTVBookmark(
            tvBookmarkDTO.bookmarkEnum,
            tvBookmarkDTO.mediaDataDTO.id,
            user
          );
        }),
        map((tvBookmarkEntityList: TVBookmark[]) => {
          return this.supabaseUtilsService.tvBookmarkMapFactory(
            tvBookmarkEntityList
          );
        })
      );
  }

  unchangedTVBookmark(
    tvBookmarkDTO: MediaBookmarkDTO<TV>,
    user: User
  ): Observable<TVBookmarkMap> {
    let tvBookmarkFromDBCustom: TVBookmark = {
      bookmark_enum: 'noBookmark',
      tv_id: tvBookmarkDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([tvBookmarkFromDBCustom]).pipe(
      map((tvBookmarkEntityList: TVBookmark[]) => {
        return this.supabaseUtilsService.tvBookmarkMapFactory(
          tvBookmarkEntityList
        );
      })
    );
  }
}
