import { Injectable } from '@angular/core';
import {
  MediaLifecycleDTO,
  LifecycleOption,
} from '../../interfaces/supabase/DTO';
import {
  Lifecycle_Metadata,
  Movie_Data,
  Movie_Life_Cycle,
  TV_Data,
  TV_Life_Cycle,
} from '../../interfaces/supabase/entities';
import {
  lifeCycleId,
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import {
  MediaType,
  Movie,
  MovieResult,
  TV,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { LifecycleEnum } from '../../enums/lifecycle.enum';
import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';
import {
  crud_operations,
  LifecycleCrudConditions,
} from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { CRUD_OPERATIONS_ENUM } from '../../enums/crud-operations.enum';

@Injectable({
  providedIn: 'root',
})
export class SupabaseUtilsService {
  private readonly LIFECYCLE_CASES: LifecycleCrudConditions = {
    noEntityANDInLifecycleSelected: CRUD_OPERATIONS_ENUM.create, //Case #0 - Create - Movie/tv doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
    oneEntityANDNoLifecycleSelected: CRUD_OPERATIONS_ENUM.delete, //Case #1 - Delete - Movie/tv has its own lifecycle and lifecycle selected is == 0, must fake delete the lifecycle item , update the lifecycle to 0
    oneEntityANDInLifecycleSelected: CRUD_OPERATIONS_ENUM.update, //Case #2 - Update - Movie/tv has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item

    noEntityANDNoLifecycleSelected: CRUD_OPERATIONS_ENUM.unchanged, //Case #3 - Nothing - Movie/tv doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing, count as delete return lifecycle 0
    oneEntityANDInLifecycleSelectedButNoLifecycleInEntity:
      CRUD_OPERATIONS_ENUM.createUpdate, //  //Case #4 - Create Update - Movie/tv has its own lifecycle, the lifecycle is 0 and lifecycle selected is > 0, must fake create the item, is an update
    default: CRUD_OPERATIONS_ENUM.default, //#Case #99/Default - Default - All cases covered, should not be possible
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
    movieLifecycleEntityList:
      | Movie_Life_Cycle[]
      | (Movie_Life_Cycle[] & Movie_Data[])
  ): MovieLifecycleMap {
    let movieLifecycleMap: MovieLifecycleMap = {};
    movieLifecycleEntityList.forEach((movieLifecycleEntity) => {
      movieLifecycleMap[movieLifecycleEntity.movie_id] =
        movieLifecycleEntity.lifecycle_id;
    });
    return movieLifecycleMap;
  }

  tvLifecycleMapFactory(
    tvLifecycleEntityList: TV_Life_Cycle[] | (TV_Life_Cycle[] & TV_Data[])
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
    mediaLifecycleFromDB:
      | Movie_Life_Cycle[]
      | TV_Life_Cycle[]
      | (Movie_Life_Cycle[] & Movie_Data[])
      | (TV_Life_Cycle[] & TV_Data[]),
    mediaLifecycleDTO: MediaLifecycleDTO<Movie | TV>
  ): crud_operations {
    let isEntity = mediaLifecycleFromDB.length === 1;
    let isLifecycleSelected =
      mediaLifecycleDTO.lifecycleId > LifecycleEnum.noLifecycle;
    let isEntityButNoLifecycleInEntity = false;

    if (isEntity) {
      isEntityButNoLifecycleInEntity =
        mediaLifecycleFromDB[0].lifecycle_id === LifecycleEnum.noLifecycle;
    }

    let condition =
      (!isEntity && isLifecycleSelected && !isEntityButNoLifecycleInEntity
        ? 'noEntityANDInLifecycleSelected'
        : false) ||
      (isEntity && !isLifecycleSelected && !isEntityButNoLifecycleInEntity
        ? 'oneEntityANDNoLifecycleSelected'
        : false) ||
      (isEntity && isLifecycleSelected && !isEntityButNoLifecycleInEntity
        ? 'oneEntityANDInLifecycleSelected'
        : false) ||
      (isEntity && isLifecycleSelected && isEntityButNoLifecycleInEntity
        ? 'oneEntityANDInLifecycleSelectedButNoLifecycleInEntity'
        : false) ||
      (!isEntity && !isLifecycleSelected && !isEntityButNoLifecycleInEntity
        ? 'noEntityANDNoLifecycleSelected'
        : 'default');

    return this.LIFECYCLE_CASES[condition];
  }
}
