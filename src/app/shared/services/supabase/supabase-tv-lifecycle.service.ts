import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import { TV, TVResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { SupabaseTVLifecycleDAO } from './supabase-tv-lifecycle.dao';
import {
  lifeCycleId,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';

import { SupabaseUtilsService } from './supabase-utils.service';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleService {
  private readonly supabaseTVLifecycleDAO = inject(SupabaseTVLifecycleDAO);
  private readonly supabaseTVDataDAO = inject(SupabaseTVDataDAO);
  private readonly supabaseUtilsService = inject(SupabaseUtilsService);

  constructor() {}

  initTVLifecycleMapFromTVResult(
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
            'tv',
            tvResult
          ) as TVResult;
        })
      );
  }

  findTVByLifecycleId(
    lifecycleId: lifeCycleId,
    payload: PayloadMediaLifecycle
  ): Observable<TV_Life_Cycle[] & TV_Data[]> {
    return this.supabaseTVLifecycleDAO.findTVByLifecycleId(
      lifecycleId,
      payload
    );
  }

  createOrUpdateOrDeleteTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO<TV>,
    user: User
  ): Observable<{ tvLifecycleMap: TVLifecycleMap; type: string }> {
    let type: number = 0;

    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds([tvLifecycleDTO.mediaDataDTO.id])
      .pipe(
        switchMap((tvLifecycleFromDB: TV_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              tvLifecycleFromDB,
              tvLifecycleDTO
            )
          ) {
            case 0:
              type = 0;
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
                      tvLifecycleDTO.lifecycleId,
                      tvLifecycleDTO.mediaDataDTO.id,
                      user
                    );
                  })
                );

            case 1:
              type = 1;
              return this.supabaseTVLifecycleDAO.deleteTVLifeCycle(
                tvLifecycleDTO.mediaDataDTO.id,
                tvLifecycleDTO.lifecycleId
              );
            case 2:
              type = 2;
              return this.supabaseTVLifecycleDAO.updateTVLifeCycle(
                tvLifecycleDTO.lifecycleId,
                tvLifecycleDTO.mediaDataDTO.id
              );
            case 3:
              type = 3;
              let tvLifecycleFromDBCustom: TV_Life_Cycle = {
                lifecycle_id: 0,
                tv_id: tvLifecycleDTO.mediaDataDTO.id,
                user_id: user.id,
              };
              return of([tvLifecycleFromDBCustom]);
            default:
              type = -99;
              throw new Error('Something went wrong. Case -99');
          }
        }),
        map((tvLifecycleEntityList: TV_Life_Cycle[]) => {
          return {
            tvLifecycleMap: this.supabaseUtilsService.tvLifecycleMapFactory(
              tvLifecycleEntityList
            ),
            type: ['create', 'delete', 'update', 'nothing', 'error'][type],
          };
        })
      );
  }
}
