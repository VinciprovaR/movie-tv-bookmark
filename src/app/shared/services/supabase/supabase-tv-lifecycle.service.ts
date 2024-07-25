import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import { TV, TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { SupabaseTVLifecycleDAO } from './supabase-tv-lifecycle.dao';
import {
  lifecycleEnum,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';

import { SupabaseUtilsService } from './supabase-utils.service';

import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { PayloadTVLifecycle } from '../../interfaces/store/tv-lifecycle-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleService {
  private readonly supabaseTVLifecycleDAO = inject(SupabaseTVLifecycleDAO);
  private readonly supabaseTVDataDAO = inject(SupabaseTVDataDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  constructor() {}

  initTVLifecycleMapFromTVResultTMDB(
    tvList: TV_Data[]
  ): Observable<TVLifecycleMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(tvList);
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds(mediaIdList)
      .pipe(
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.tvLifecycleMapFactory(
            tvLifecycleEntityList
          );
        })
      );
  }

  initTVLifecycleMapFromTVResultSupabase(
    tvLifecycleEntityList: TV_Life_Cycle[] & TV_Data[]
  ): Observable<TVLifecycleMap> {
    return of(
      this.supabaseUtilsService.tvLifecycleMapFactory(tvLifecycleEntityList)
    );
  }

  removeTVWithLifecycle(tvResult: TVResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(tvResult);
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds(mediaIdList)
      .pipe(
        map((entityMediaLifecycle: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.removeMediaWithLifecycle(
            entityMediaLifecycle,
            mediaIdMapIndex,
            tvResult
          ) as TVResult;
        })
      );
  }

  findTVByLifecycleId(
    lifecycleEnum: lifecycleEnum,
    payload: PayloadTVLifecycle
  ): Observable<TV_Life_Cycle[] & TV_Data[]> {
    return this.supabaseTVLifecycleDAO.findTVByLifecycleId(
      lifecycleEnum,
      payload
    );
  }

  crudOperationResolver(
    tvLifecycleDTO: MediaLifecycleDTO<TV>
  ): Observable<crud_operations> {
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds([tvLifecycleDTO.mediaDataDTO.id])
      .pipe(
        map((tvLifecycleFromDB: TV_Life_Cycle[]) => {
          let operation = this.supabaseUtilsService.checkCase(
            tvLifecycleFromDB,
            tvLifecycleDTO
          );
          if (operation === 'default') {
            throw new Error('Something went wrong. Case default'); //to-do traccia errore su db, anche se impossibile che passi qui
          }
          return operation;
        })
      );
  }

  updateTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO<TV>
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVLifecycleDAO
      .updateTVLifeCycle(
        tvLifecycleDTO.lifecycleEnum,
        tvLifecycleDTO.mediaDataDTO.id
      )
      .pipe(
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.tvLifecycleMapFactory(
            tvLifecycleEntityList
          );
        })
      );
  }

  deleteTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO<TV>
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVLifecycleDAO
      .deleteTVLifeCycle(
        tvLifecycleDTO.mediaDataDTO.id,
        tvLifecycleDTO.lifecycleEnum
      )
      .pipe(
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.tvLifecycleMapFactory(
            tvLifecycleEntityList
          );
        })
      );
  }

  createTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO<TV>,
    user: User
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVDataDAO
      .findByTVId(tvLifecycleDTO.mediaDataDTO.id)
      .pipe(
        switchMap((tvDataEntityList: TV_Data[]) => {
          if (tvDataEntityList.length === 0) {
            return this.supabaseTVDataDAO.createTVData(
              tvLifecycleDTO.mediaDataDTO
            );
          }
          return of(tvDataEntityList);
        }),
        switchMap(() => {
          return this.supabaseTVLifecycleDAO.createTVLifeCycle(
            tvLifecycleDTO.lifecycleEnum,
            tvLifecycleDTO.mediaDataDTO.id,
            user
          );
        }),
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.tvLifecycleMapFactory(
            tvLifecycleEntityList
          );
        })
      );
  }

  unchangedTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO<TV>,
    user: User
  ): Observable<TVLifecycleMap> {
    let tvLifecycleFromDBCustom: TV_Life_Cycle = {
      lifecycle_enum: 'noLifecycle',
      tv_id: tvLifecycleDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([tvLifecycleFromDBCustom]).pipe(
      map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
        return this.supabaseUtilsService.tvLifecycleMapFactory(
          tvLifecycleEntityList
        );
      })
    );
  }
}
