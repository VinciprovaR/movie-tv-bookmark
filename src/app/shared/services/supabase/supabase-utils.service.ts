import { Injectable } from '@angular/core';
import {
  MediaLifecycleDTO,
  LifecycleOption,
} from '../../interfaces/supabase/DTO';
import {
  Lifecycle_Metadata,
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../interfaces/supabase/entities';
import {
  lifeCycleId,
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/lifecycle.interface';
import {
  MediaType,
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../interfaces/media.interface';
import { LifecycleEnum } from '../../enums/lifecycle.enum';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';
import { TV_Data } from '../../interfaces/supabase/entities/tv_data.entity.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseUtilsService {
  private readonly LIFECYCLE_CASES: any = {
    noEntityANDInLifecycle: 0, //Case #0 - Movie/tv doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
    oneEntityANDNoLifecycle: 1, //Case #1 - Movie/tv has its own lifecycle and lifecycle selected is == 0, must fake delete the lifecycle item , update the lifecycle to 0
    oneEntityANDInLifecycle: 2, //Case #2 - Movie/tv has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item
    noEntityANDNoLifecycle: 3, //Case #3 -  Movie/tv doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing, return lifecycle 0
    default: 99, //#Case #99/Default - All cases covered, should not be possible
  };

  constructor() {}

  transformLifecycleMetadata(mediaLifecycleOptions: Lifecycle_Metadata[]): {
    lifecycleOptions: LifecycleOption[];
    lifecycleTypeIdMap: LifecycleTypeIdMap;
  } {
    let lifecycleOptions: LifecycleOption[] = [];
    let lifecycleTypeIdMap: LifecycleTypeIdMap = {};
    mediaLifecycleOptions.forEach((lc) => {
      lifecycleOptions.push({ label: lc.label, value: lc.id as lifeCycleId });
      lifecycleTypeIdMap[lc.enum] = lc.id as lifeCycleId;
    });

    return { lifecycleOptions, lifecycleTypeIdMap };
  }

  movieLifecycleMapFactory(
    movieLifecycleEntityList: Movie_Life_Cycle[]
  ): MovieLifecycleMap {
    let movieLifecycleMap: MovieLifecycleMap = {};
    movieLifecycleEntityList.forEach((movieLifecycleEntity) => {
      movieLifecycleMap[movieLifecycleEntity.movie_id] =
        movieLifecycleEntity.lifecycle_id;
    });
    return movieLifecycleMap;
  }

  tvLifecycleMapFactory(
    tvLifecycleEntityList: TV_Life_Cycle[]
  ): TVLifecycleMap {
    let tvLifecycleMap: TVLifecycleMap = {};
    tvLifecycleEntityList.forEach((tvLifecycleEntity) => {
      tvLifecycleMap[tvLifecycleEntity.tv_id] = tvLifecycleEntity.lifecycle_id;
    });
    return tvLifecycleMap;
  }

  removeMediaWithLifecycle(
    entityMediaLifecycle: Movie_Life_Cycle[] | TV_Life_Cycle[],
    mediaIdMapIndex: { [key: number]: number },
    mediaType: MediaType,
    mediaResult: MovieResult | TVResult
  ): MovieResult | TVResult {
    let indexListToRemove: number[] = [];
    entityMediaLifecycle.forEach((mlc: any) => {
      if (mlc[`lifecycle_id`] != LifecycleEnum.noLifecycle) {
        indexListToRemove.push(mediaIdMapIndex[mlc[`${mediaType}_id`]]);
      }
    });
    indexListToRemove = indexListToRemove.sort((a, b) => b - a);

    indexListToRemove.forEach((indexToRemove) => {
      mediaResult.results.splice(indexToRemove, 1);
    });
    return mediaResult;
  }

  buildMediaIdListMap(
    mediaResult: Movie[] | TV[] | Movie_Data[] | TV_Data[]
  ): number[] {
    let mediaIdList: number[] = [];
    for (let i = 0; i < mediaResult.length; i++) {
      mediaIdList.push(mediaResult[i].id);
    }
    return mediaIdList;
  }

  buildMediaIdListMapIndex(mediaResult: MovieResult | TVResult): {
    mediaIdList: number[];
    mediaIdMapIndex: { [key: number]: number };
  } {
    let mediaIdList: number[] = [];
    let mediaIdMapIndex: { [key: number]: number } = {};
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
      mediaIdMapIndex[mediaResult.results[i].id] = i;
    }
    return { mediaIdList, mediaIdMapIndex };
  }

  checkCase(
    mediaLifecycleFromDB: Movie_Life_Cycle[] | TV_Life_Cycle[] | any,
    mediaLifecycleDTO: MediaLifecycleDTO
  ): number {
    let isEntity = mediaLifecycleFromDB.length === 1;
    let isLifecycle = mediaLifecycleDTO.lifecycleId > LifecycleEnum.noLifecycle;

    let condition =
      (!isEntity && isLifecycle ? 'noEntityANDInLifecycle' : false) ||
      (isEntity && !isLifecycle ? 'oneEntityANDNoLifecycle' : false) ||
      (isEntity && isLifecycle ? 'oneEntityANDInLifecycle' : false) ||
      (!isLifecycle && !isLifecycle ? 'noEntityANDNoLifecycle' : 'default');

    return this.LIFECYCLE_CASES[condition];
  }
}
