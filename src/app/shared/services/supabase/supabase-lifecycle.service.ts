import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of, catchError } from 'rxjs';
import { MediaType, MovieResult, TVResult } from '../../models/media.models';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';
import {
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../models/supabase/entities';
import { SupabaseTVLifecycleDAO } from './supabase-tv-lifecycle.dao';
import { SupabaseDecouplingService } from './supabase-decoupling.service';
import { SupabaseMediaLifecycleOptionsDAO } from './supabase-media-lifecycle-options.dao';
import { SupabaseMovieLifecycleDAO } from './supabase-movie-lifecycle.dao';
import { TVLifecycleMap } from '../../models/store/tv-lifecycle-state.models';
import { MovieLifecycleMap } from '../../models/store/movie-lifecycle-state.models';
import { LifecycleIdEnum } from '../../models/lifecycle.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseLifecycleService {
  lifeCycleOptions$!: Observable<SelectLifecycleDTO[]>;

  private readonly LIFECYCLE_CASES: any = {
    noEtityANDInLifecycle: 0, //Case #0 - Movie doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
    //
    oneEntityANDNoLifecycle: 1, //Case #1 - Movie has its own lifecycle and lifecycle selected is == 0, must fake delete the lifecycle item , update the lifecycle to 0
    //
    oneEntityANDInLifecycle: 2, //Case #2 - Movie has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item
    //
    noEntityANDNoLifecycle: 3, //Case #3 -  Movie doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing, return lifecycle 0
    //
    isEntityExceed: -1, //Case #-1 - more than one same movie lifecycle with the same user, shouldn't be possible. User and movie/tv_id are both unique in db
    //
    default: -99, //#Case #-99/Default - Something went wrong
    //
  };

  constructor(
    private supabaseMediaLifecycleOptionsDAO: SupabaseMediaLifecycleOptionsDAO,
    private supabaseMovieLifecycleDAO: SupabaseMovieLifecycleDAO,
    private supabaseTVLifecycleDAO: SupabaseTVLifecycleDAO,
    private supabaseDecouplingService: SupabaseDecouplingService
  ) {
    this.retriveLifecycleOptions();
  }

  retriveLifecycleOptions() {
    this.lifeCycleOptions$ = this.supabaseMediaLifecycleOptionsDAO
      .findLifecycleOptions()
      .pipe(
        map((lifecycleOptionsResult) => {
          return this.supabaseDecouplingService.fromMediaLifecycleOptionsToSelectLifecycleDTO(
            lifecycleOptionsResult
          );
        })
      );
  }

  initMovieLifecycleMap(
    movieResult: MovieResult,
    movieLifecycleMap: MovieLifecycleMap
  ): Observable<MovieLifecycleMap> {
    //to-do rimuovere mediaIdMapIndex
    let mediaIdList = this.buildMediaIdListMap(movieResult);
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds(mediaIdList)
      .pipe(
        map((entityMovieLifeCycleList: Movie_Life_Cycle[]) => {
          return this.supabaseDecouplingService.fromEntityMovieLifecycleListToMovieLifecycleMap(
            entityMovieLifeCycleList,
            movieLifecycleMap
          );
        })
      );
  }

  initTVLifecycleMap(
    tvResult: TVResult,
    tvLifecycleMap: TVLifecycleMap
  ): Observable<MovieLifecycleMap> {
    let mediaIdList = this.buildMediaIdListMap(tvResult);
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds(mediaIdList)
      .pipe(
        map((entityTVLifeCycleList: TV_Life_Cycle[]) => {
          return this.supabaseDecouplingService.fromEntityTVLifecycleListToTVLifecycleMap(
            entityTVLifeCycleList,
            tvLifecycleMap
          );
        })
      );
  }

  removeMovieWithNoLifecycle(
    movieResult: MovieResult,
    mediaType: MediaType
  ): Observable<MovieResult> {
    return this.removeMediaWithLifecycle(
      movieResult,
      mediaType
    ) as Observable<MovieResult>;
  }

  removeTVWithNoLifecycle(
    tvResult: TVResult,
    mediaType: MediaType
  ): Observable<TVResult> {
    return this.removeMediaWithLifecycle(
      tvResult,
      mediaType
    ) as Observable<TVResult>;
  }

  private removeMediaWithLifecycle(
    mediaResult: MovieResult | TVResult,
    mediaType: MediaType
  ) {
    let { mediaIdList, mediaIdMapIndex } =
      this.buildMediaIdListMapIndex(mediaResult);
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds(mediaIdList)
      .pipe(
        map((entityMediaLifecycle: Movie_Life_Cycle[] | TV_Life_Cycle[]) => {
          let indexListToRemove: number[] = [];
          entityMediaLifecycle.forEach((mlc: any) => {
            if (mlc[`lifecycle_id`] != LifecycleIdEnum.NoLifecycle) {
              indexListToRemove.push(mediaIdMapIndex[mlc[`${mediaType}_id`]]);
            }
          });
          indexListToRemove = indexListToRemove.sort(function (a, b) {
            return b - a;
          });

          indexListToRemove.forEach((indexToRemove) => {
            console.log('devo rimuovere ', mediaResult.results[indexToRemove]);
            mediaResult.results.splice(indexToRemove, 1);
          });
          return mediaResult;
        })
      );
  }

  createOrUpdateOrDeleteTVLifecycle(
    tvLifecycleDTO: MediaLifecycleDTO,
    user: User | null,
    tvLifecycleMap: TVLifecycleMap
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds([tvLifecycleDTO.mediaId])
      .pipe(
        switchMap((tvLifecycleFromDB: TV_Life_Cycle[]) => {
          switch (this.checkCase(tvLifecycleFromDB, tvLifecycleDTO)) {
            case 0:
              return this.supabaseTVLifecycleDAO.createTVLifeCycle(
                tvLifecycleDTO.lifecycleId,
                tvLifecycleDTO.mediaId,
                user
              );
            case 1:
              return this.supabaseTVLifecycleDAO.deleteTVLifeCycle(
                tvLifecycleDTO.mediaId,
                tvLifecycleDTO.lifecycleId
              );
            case 2:
              return this.supabaseTVLifecycleDAO.updateTVLifeCycle(
                tvLifecycleDTO.lifecycleId,
                tvLifecycleDTO.mediaId
              );
            case 3:
              return of(tvLifecycleFromDB);
            case 4:
              let tvLifecycleFromDBCustom: TV_Life_Cycle = {
                lifecycle_id: 0,
                tv_id: tvLifecycleDTO.mediaId,
              };
              return of([tvLifecycleFromDBCustom]);
            case -1:
              throw new Error(
                `Duplicated row of the same tv for user ${tvLifecycleFromDB[0].user_id} and tv_id ${tvLifecycleFromDB[0].tv_id}`
              );
            default:
              throw new Error('Something went wrong. Case -99');
          }
        }),
        map((entityTVLifecycle) => {
          entityTVLifecycle = entityTVLifecycle as TV_Life_Cycle[];
          return this.supabaseDecouplingService.fromEntityTVLifecycleListToTVLifecycleMap(
            entityTVLifecycle,
            tvLifecycleMap
          );
        })
      );
  }

  createOrUpdateOrDeleteMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO,
    user: User | null,
    movieLifecycleMap: MovieLifecycleMap
  ): Observable<MovieLifecycleMap> {
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds([movieLifecycleDTO.mediaId])
      .pipe(
        switchMap((movieLifecycleFromDB: Movie_Life_Cycle[]) => {
          switch (this.checkCase(movieLifecycleFromDB, movieLifecycleDTO)) {
            case 0:
              return this.supabaseMovieLifecycleDAO.createMovieLifeCycle(
                movieLifecycleDTO.lifecycleId,
                movieLifecycleDTO.mediaId,
                user
              );
            case 1:
              return this.supabaseMovieLifecycleDAO.deleteMovieLifeCycle(
                movieLifecycleDTO.mediaId,
                movieLifecycleDTO.lifecycleId
              );
            case 2:
              return this.supabaseMovieLifecycleDAO.updateMovieLifeCycle(
                movieLifecycleDTO.lifecycleId,
                movieLifecycleDTO.mediaId
              );

            case 3:
              let movieLifecycleFromDBCustom: Movie_Life_Cycle = {
                lifecycle_id: 0,
                movie_id: movieLifecycleDTO.mediaId,
              };
              return of([movieLifecycleFromDBCustom]);
            case -1:
              throw new Error(
                `Duplicated row of the same movie for user ${movieLifecycleFromDB[0].user_id} and movie_id ${movieLifecycleFromDB[0].movie_id}`
              );
            default:
              throw new Error('Something went wrong. Case -99');
          }
        }),
        map((movieMovieLifecycle: Movie_Life_Cycle[]) => {
          return this.supabaseDecouplingService.fromEntityMovieLifecycleListToMovieLifecycleMap(
            movieMovieLifecycle,
            movieLifecycleMap
          );
        })
      );
  }

  private buildMediaIdListMap(mediaResult: MovieResult | TVResult): number[] {
    let mediaIdList: number[] = [];
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
    }
    return mediaIdList;
  }

  private buildMediaIdListMapIndex(mediaResult: MovieResult | TVResult): {
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

  private checkCase(
    mediaLifecycleFromDB: Movie_Life_Cycle[] | TV_Life_Cycle[],
    mediaLifecycleDTO: MediaLifecycleDTO
  ): number {
    let isEntity = mediaLifecycleFromDB.length === 1;
    let isLifecycle =
      mediaLifecycleDTO.lifecycleId > LifecycleIdEnum.NoLifecycle;
    let isEntityExceed = mediaLifecycleFromDB.length > 1;

    let condition =
      (!isEntity && isLifecycle && !isEntityExceed
        ? 'noEtityANDInLifecycle'
        : false) ||
      (isEntity && !isLifecycle && !isEntityExceed
        ? 'oneEntityANDNoLifecycle'
        : false) ||
      (isEntity && isLifecycle && !isEntityExceed
        ? 'oneEntityANDInLifecycle'
        : false) ||
      (!isLifecycle && !isLifecycle && !isEntityExceed
        ? 'noEntityANDNoLifecycle'
        : false) ||
      (isEntityExceed ? 'isEntityExceed' : 'default');

    console.log('case: ' + this.LIFECYCLE_CASES[condition]);
    return this.LIFECYCLE_CASES[condition];
  }
}
