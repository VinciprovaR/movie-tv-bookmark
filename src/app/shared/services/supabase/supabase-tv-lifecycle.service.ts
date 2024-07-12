import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import { TV, TVResult } from '../../interfaces/media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { SupabaseTVLifecycleDAO } from './supabase-tv-lifecycle.dao';
import { TVLifecycleMap } from '../../interfaces/lifecycle.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';
import { TV_Data } from '../../interfaces/supabase/entities/tv_data.entity.interface';

import { SupabaseUtilsService } from './supabase-utils.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleService {
  private readonly supabaseTVLifecycleDAO = inject(SupabaseTVLifecycleDAO);
  private readonly supabaseTVDataDAO = inject(SupabaseTVDataDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  constructor() {}

  initTVLifecycleMap(tvList: TV[] | TV_Data[]): Observable<TVLifecycleMap> {
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
            'tv',
            tvResult
          ) as TVResult;
        })
      );
  }

  createOrUpdateOrDeleteTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO,
    user: User
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds([tvLifecycleDTO.mediaDataDTO.mediaId])
      .pipe(
        switchMap((tvLifecycleFromDB: TV_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              tvLifecycleFromDB,
              tvLifecycleDTO
            )
          ) {
            case 0:
              return this.supabaseTVDataDAO
                .findByTVId(tvLifecycleDTO.mediaDataDTO.mediaId)
                .pipe(
                  switchMap((tvDataEntityList: TV_Data[]) => {
                    if (tvDataEntityList.length === 0) {
                      return this.supabaseTVDataDAO.createTVData(
                        tvLifecycleDTO.mediaDataDTO
                      );
                    }
                    return of(tvDataEntityList);
                  }),
                  switchMap((tvDataEntityList: TV_Data[]) => {
                    return this.supabaseTVLifecycleDAO.createTVLifeCycle(
                      tvLifecycleDTO.lifecycleId,
                      tvLifecycleDTO.mediaDataDTO.mediaId,
                      user
                    );
                  })
                );

            case 1:
              return this.supabaseTVLifecycleDAO.deleteTVLifeCycle(
                tvLifecycleDTO.mediaDataDTO.mediaId,
                tvLifecycleDTO.lifecycleId
              );
            case 2:
              return this.supabaseTVLifecycleDAO.updateTVLifeCycle(
                tvLifecycleDTO.lifecycleId,
                tvLifecycleDTO.mediaDataDTO.mediaId
              );
            case 3:
              let tvLifecycleFromDBCustom: TV_Life_Cycle = {
                lifecycle_id: 0,
                tv_id: tvLifecycleDTO.mediaDataDTO.mediaId,
                user_id: user.id,
              };
              return of([tvLifecycleFromDBCustom]);
            default:
              throw new Error('Something went wrong. Case -99');
          }
        }),
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.tvLifecycleMapFactory(
            tvLifecycleEntityList
          );
        })
      );
  }
}
