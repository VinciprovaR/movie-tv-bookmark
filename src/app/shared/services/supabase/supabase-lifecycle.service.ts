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
import { SupabaseUtilsService } from './supabase-utils.service';
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

  constructor(
    private supabaseMediaLifecycleOptionsDAO: SupabaseMediaLifecycleOptionsDAO,
    private supabaseMovieLifecycleDAO: SupabaseMovieLifecycleDAO,
    private supabaseTVLifecycleDAO: SupabaseTVLifecycleDAO,
    private supabaseUtilsService: SupabaseUtilsService
  ) {
    this.retriveLifecycleOptions();
  }

  retriveLifecycleOptions() {
    this.lifeCycleOptions$ = this.supabaseMediaLifecycleOptionsDAO
      .findLifecycleOptions()
      .pipe(
        map((lifecycleOptionsResult) => {
          return this.supabaseUtilsService.fromMediaLifecycleOptionsToSelectLifecycleDTO(
            lifecycleOptionsResult
          );
        })
      );
  }

  initMovieLifecycleMap(
    movieResult: MovieResult,
    movieLifecycleMap: MovieLifecycleMap
  ): Observable<MovieLifecycleMap> {
    let mediaIdList =
      this.supabaseUtilsService.buildMediaIdListMap(movieResult);
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds(mediaIdList)
      .pipe(
        map((entityMovieLifeCycleList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.injectInMovieLifecycleMap(
            entityMovieLifeCycleList,
            movieLifecycleMap
          );
        })
      );
  }

  removeMovieWithLifecycle(movieResult: MovieResult) {
    let { mediaIdList, mediaIdMapIndex } =
      this.supabaseUtilsService.buildMediaIdListMapIndex(movieResult);
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds(mediaIdList)
      .pipe(
        map((entityMediaLifecycle: Movie_Life_Cycle[]) => {
          console.log(entityMediaLifecycle);
          return this.supabaseUtilsService.removeMediaWithLifecycle(
            entityMediaLifecycle,
            mediaIdMapIndex,
            'movie',
            movieResult
          ) as MovieResult;
        })
      );
  }

  createOrUpdateOrDeleteMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO,
    user: User,
    movieLifecycleMap: MovieLifecycleMap
  ): Observable<MovieLifecycleMap> {
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds([movieLifecycleDTO.mediaId])
      .pipe(
        switchMap((movieLifecycleFromDB: Movie_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              movieLifecycleFromDB,
              movieLifecycleDTO
            )
          ) {
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
                user_id: user.id,
              };
              return of([movieLifecycleFromDBCustom]);
            default:
              throw new Error('Something went wrong. Case -1'); //to-do traccia errore su db, anche se impossibile che passi qui
          }
        }),
        map((movieMovieLifecycle: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.injectInMovieLifecycleMap(
            movieMovieLifecycle,
            movieLifecycleMap
          );
        })
      );
  }

  initTVLifecycleMap(
    tvResult: TVResult,
    tvLifecycleMap: TVLifecycleMap
  ): Observable<MovieLifecycleMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(tvResult);
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds(mediaIdList)
      .pipe(
        map((entityTVLifeCycleList: TV_Life_Cycle[]) => {
          return this.supabaseUtilsService.injectInTVLifecycleMap(
            entityTVLifeCycleList,
            tvLifecycleMap
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
    user: User,
    tvLifecycleMap: TVLifecycleMap
  ): Observable<TVLifecycleMap> {
    return this.supabaseTVLifecycleDAO
      .findLifecycleListByTVIds([tvLifecycleDTO.mediaId])
      .pipe(
        switchMap((tvLifecycleFromDB: TV_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              tvLifecycleFromDB,
              tvLifecycleDTO
            )
          ) {
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
                user_id: user.id,
              };
              return of([tvLifecycleFromDBCustom]);
            default:
              throw new Error('Something went wrong. Case -1');
          }
        }),
        map((entityTVLifecycle) => {
          entityTVLifecycle = entityTVLifecycle as TV_Life_Cycle[];
          return this.supabaseUtilsService.injectInTVLifecycleMap(
            entityTVLifecycle,
            tvLifecycleMap
          );
        })
      );
  }
}
