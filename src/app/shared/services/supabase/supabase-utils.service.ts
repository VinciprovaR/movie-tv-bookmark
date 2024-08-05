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
  lifecycleEnum,
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import {
  MediaType,
  Movie,
  MovieDetail,
  MovieResult,
  TV,
  TVDetail,
  TVResult,
} from '../../interfaces/TMDB/tmdb-media.interface';

import { LifecycleTypeIdMap } from '../../interfaces/store/lifecycle-metadata-state.interface';
import {
  crud_operations,
  LifecycleCrudConditions,
} from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { Genre } from '../../interfaces/TMDB/tmdb-filters.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseUtilsService {
  private readonly LIFECYCLE_CASES: LifecycleCrudConditions = {
    noEntityANDInLifecycleSelected: 'create', //Case #0 - Create - Movie/tv doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
    oneEntityANDNoLifecycleSelected: 'delete', //Case #1 - Delete - Movie/tv has its own lifecycle and lifecycle selected is == 0, must fake delete the lifecycle item , update the lifecycle to 0
    oneEntityANDInLifecycleSelected: 'update', //Case #2 - Update - Movie/tv has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item

    noEntityANDNoLifecycleSelected: 'unchanged', //Case #3 - Nothing - Movie/tv doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing, count as delete return lifecycle 0
    oneEntityANDInLifecycleSelectedButNoLifecycleInEntity: 'createUpdate', //  //Case #4 - Create Update - Movie/tv has its own lifecycle, the lifecycle is 0 and lifecycle selected is > 0, must fake create the item, is an update
    default: 'default', //#Case #99/Default - Default - All cases covered, should not be possible
  };

  constructor() {}

  transformLifecycleMetadata(mediaLifecycleOptions: Lifecycle_Metadata[]): {
    lifecycleOptions: LifecycleOption[];
    lifecycleTypeIdMap: LifecycleTypeIdMap;
  } {
    let lifecycleOptions: LifecycleOption[] = [];
    let lifecycleTypeIdMap: LifecycleTypeIdMap = {};
    mediaLifecycleOptions.forEach((lc) => {
      lifecycleOptions.push({ label: lc.label, value: lc.enum });
      lifecycleTypeIdMap[lc.enum] = lc.enum as lifecycleEnum;
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
        movieLifecycleEntity.lifecycle_enum;
    });
    return movieLifecycleMap;
  }
  
  movieDataObjFactory(movie: Movie | Movie_Data | MovieDetail): Movie_Data {
    let movieData: Partial<Movie_Data> = {
      id: movie.id,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      title: movie.title,
    };

    if (this.isMovieDetailEntity(movie)) {
      let genre_ids: number[] = movie.genres.map((genre: Genre) => {
        return genre.id;
      });

      movieData.genre_ids = genre_ids;
    } else {
      movieData.genre_ids = movie.genre_ids;
    }
    return movieData as Movie_Data;
  }

  private isMovieDetailEntity(movie: object): movie is MovieDetail {
    return (movie as MovieDetail).genres !== undefined;
  }

  
  tvLifecycleMapFactory(
    tvLifecycleEntityList: TV_Life_Cycle[] | (TV_Life_Cycle[] & TV_Data[])
  ): TVLifecycleMap {
    let tvLifecycleMap: TVLifecycleMap = {};
    tvLifecycleEntityList.forEach((tvLifecycleEntity) => {
      tvLifecycleMap[tvLifecycleEntity.tv_id] =
        tvLifecycleEntity.lifecycle_enum;
    });
    return tvLifecycleMap;
  }

  tvDataObjFactory(tv: TV | TV_Data | TVDetail): TV_Data {
    let tvData: Partial<TV_Data> = {
      id: tv.id,
      poster_path: tv.poster_path,
      first_air_date: tv.first_air_date,
      name: tv.name,
    };

    if (this.isTVDetailEntity(tv)) {
      let genre_ids: number[] = tv.genres.map((genre: Genre) => {
        return genre.id;
      });

      tvData.genre_ids = genre_ids;
    } else {
      tvData.genre_ids = tv.genre_ids;
    }
    return tvData as TV_Data;
  }

  private isTVDetailEntity(tv: object): tv is TVDetail {
    return (tv as TVDetail).genres !== undefined;
  }



  removeMediaWithLifecycle(
    entityMediaLifecycle: Movie_Life_Cycle[] | TV_Life_Cycle[],
    mediaIdMapIndex: { [key: number]: number },
    mediaResult: MovieResult | TVResult
  ): MovieResult | TVResult {
    let indexListToRemove: number[] = [];
    entityMediaLifecycle.forEach((mlc: Movie_Life_Cycle | TV_Life_Cycle) => {
      if (mlc.lifecycle_enum != 'noLifecycle') {
        if (this.isMovieEntity(mlc)) {
          indexListToRemove.push(mediaIdMapIndex[mlc.movie_id]);
        } else {
          indexListToRemove.push(mediaIdMapIndex[mlc.tv_id]);
        }
      }
    });
    indexListToRemove = indexListToRemove.sort((a, b) => b - a);

    indexListToRemove.forEach((indexToRemove) => {
      mediaResult.results.splice(indexToRemove, 1);
    });
    return mediaResult;
  }

  buildMediaIdListMap(
    mediaResult:
      | Movie[]
      | TV[]
      | Movie_Data[]
      | TV_Data[]
      | MovieDetail[]
      | TVDetail[]
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
    mediaLifecycleDTO: MediaLifecycleDTO<
      Movie | MovieDetail | TV | TVDetail | TV_Data | Movie_Data
    >
  ): crud_operations {
    let isEntity = mediaLifecycleFromDB.length === 1;
    let isLifecycleSelected = mediaLifecycleDTO.lifecycleEnum != 'noLifecycle';
    let isEntityButNoLifecycleInEntity = false;

    if (isEntity) {
      isEntityButNoLifecycleInEntity =
        mediaLifecycleFromDB[0].lifecycle_enum === 'noLifecycle';
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

  isMovieEntity(
    entityMediaLifeCycle: object
  ): entityMediaLifeCycle is Movie_Life_Cycle {
    return (entityMediaLifeCycle as Movie_Life_Cycle).movie_id !== undefined;
  }
}
