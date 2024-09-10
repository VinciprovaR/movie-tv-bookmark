import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  TV,
  TVDetail,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaBookmarkDTO } from '../../interfaces/supabase/DTO';
import { TV_Data, TV_Bookmark } from '../../interfaces/supabase/entities';
import { SupabaseTVBookmarkDAO } from './supabase-tv-bookmark.dao';
import {
  bookmarkEnum,
  TVBookmarkMap,
} from '../../interfaces/supabase/supabase-bookmark.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';
import { SupabaseUtilsService } from './supabase-utils.service';
import { crud_operations } from '../../interfaces/supabase/supabase-bookmark-crud-cases.interface';
import { PayloadTVBookmark } from '../../interfaces/store/tv-bookmark-state.interface';

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

  constructor() {}

  initTVBookmarkMapFromTVResultTMDB(
    tvList: TV[] | TV_Data[] | TVDetail[]
  ): Observable<TVBookmarkMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(tvList);
    return this.supabaseTVBookmarkDAO.findBookmarkListByTVIds(mediaIdList).pipe(
      map((tvBookmarkEntityList: TV_Bookmark[]) => {
        return this.supabaseUtilsService.tvBookmarkMapFactory(
          tvBookmarkEntityList
        );
      })
    );
  }

  initTVBookmarkMapFromTVResultSupabase(
    tvBookmarkEntityList: TV_Bookmark[] & TV_Data[]
  ): Observable<TVBookmarkMap> {
    return of(
      this.supabaseUtilsService.tvBookmarkMapFactory(tvBookmarkEntityList)
    );
  }

  removeTVWithBookmark(tvResult: TVResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(tvResult);
    return this.supabaseTVBookmarkDAO.findBookmarkListByTVIds(mediaIdList).pipe(
      map((entityMediaBookmark: TV_Bookmark[]) => {
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
  ): Observable<TV_Bookmark[] & TV_Data[]> {
    return this.supabaseTVBookmarkDAO.findTVByBookmarkId(bookmarkEnum, payload);
  }

  crudOperationResolver(
    tvBookmarkDTO: MediaBookmarkDTO<TV | TVDetail | TV_Data>
  ): Observable<crud_operations> {
    return this.supabaseTVBookmarkDAO
      .findBookmarkListByTVIds([tvBookmarkDTO.mediaDataDTO.id])
      .pipe(
        map((tvBookmarkFromDB: TV_Bookmark[]) => {
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
    tvBookmarkDTO: MediaBookmarkDTO<TV | TVDetail | TV_Data>
  ): Observable<TVBookmarkMap> {
    return this.supabaseTVBookmarkDAO
      .updateTVBookmark(
        tvBookmarkDTO.bookmarkEnum,
        tvBookmarkDTO.mediaDataDTO.id
      )
      .pipe(
        map((tvBookmarkEntityList: TV_Bookmark[]) => {
          return this.supabaseUtilsService.tvBookmarkMapFactory(
            tvBookmarkEntityList
          );
        })
      );
  }

  deleteTVBookmark(
    tvBookmarkDTO: MediaBookmarkDTO<TV | TVDetail | TV_Data>
  ): Observable<TVBookmarkMap> {
    return this.supabaseTVBookmarkDAO
      .deleteTVBookmark(
        tvBookmarkDTO.mediaDataDTO.id,
        tvBookmarkDTO.bookmarkEnum
      )
      .pipe(
        map((tvBookmarkEntityList: TV_Bookmark[]) => {
          return this.supabaseUtilsService.tvBookmarkMapFactory(
            tvBookmarkEntityList
          );
        })
      );
  }

  createTVBookmark(
    tvBookmarkDTO: MediaBookmarkDTO<TV | TVDetail | TV_Data>,
    user: User
  ): Observable<TVBookmarkMap> {
    return this.supabaseTVDataDAO
      .findByTVId(tvBookmarkDTO.mediaDataDTO.id)
      .pipe(
        switchMap((tvDataEntityList: TV_Data[]) => {
          if (tvDataEntityList.length === 0) {
            let tvData: TV_Data = this.supabaseUtilsService.tvDataObjFactory(
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
        map((tvBookmarkEntityList: TV_Bookmark[]) => {
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
    let tvBookmarkFromDBCustom: TV_Bookmark = {
      bookmark_enum: 'noBookmark',
      tv_id: tvBookmarkDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([tvBookmarkFromDBCustom]).pipe(
      map((tvBookmarkEntityList: TV_Bookmark[]) => {
        return this.supabaseUtilsService.tvBookmarkMapFactory(
          tvBookmarkEntityList
        );
      })
    );
  }
}
