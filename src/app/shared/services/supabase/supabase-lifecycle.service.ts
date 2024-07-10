import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of, tap, BehaviorSubject } from 'rxjs';
import { MovieResult, TVResult } from '../../interfaces/media.interface';
import {
  MediaLifecycleDTO,
  LifecycleOption,
} from '../../interfaces/supabase/DTO';
import {
  Media_Lifecycle_Options,
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { SupabaseTVLifecycleDAO } from './supabase-tv-lifecycle.dao';
import { SupabaseUtilsService } from './supabase-utils.service';
import { SupabaseMediaLifecycleOptionsDAO } from './supabase-media-lifecycle-options.dao';
import { SupabaseMovieLifecycleDAO } from './supabase-movie-lifecycle.dao';
import {
  MovieLifecycleMap,
  TVLifecycleMap,
} from '../../interfaces/lifecycle.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseLifecycleService {
  lifecycleOptionsSubject$ = new BehaviorSubject<LifecycleOption[]>([]);
  lifecycleOptions$ = this.lifecycleOptionsSubject$.asObservable();

  constructor(
    private supabaseMediaLifecycleOptionsDAO: SupabaseMediaLifecycleOptionsDAO,
    private supabaseMovieLifecycleDAO: SupabaseMovieLifecycleDAO,
    private supabaseTVLifecycleDAO: SupabaseTVLifecycleDAO,
    private supabaseUtilsService: SupabaseUtilsService
  ) {}

  retriveLifecycleOptions(): void {
    this.supabaseMediaLifecycleOptionsDAO
      .findLifecycleOptions()
      .pipe(
        map((lifecycleOptionsResult: Media_Lifecycle_Options[]) => {
          return this.supabaseUtilsService.fromMediaLifecycleOptionsToLifecycleOption(
            lifecycleOptionsResult
          );
        })
      )
      .subscribe((lifecycleOptions) => {
        this.lifecycleOptionsSubject$.next(lifecycleOptions);
      });
  }

  initMovieLifecycleMapFromMovieResult(
    movieResult: MovieResult
  ): Observable<MovieLifecycleMap> {
    let mediaIdList =
      this.supabaseUtilsService.buildMediaIdListMap(movieResult);
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds(mediaIdList)
      .pipe(
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
          );
        })
      );
  }

  initMovieLifecycleMapFromId(movieId: number): Observable<MovieLifecycleMap> {
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds([movieId])
      .pipe(
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
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
    user: User
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
              throw new Error('Something went wrong. Case -99'); //to-do traccia errore su db, anche se impossibile che passi qui
          }
        }),
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
          );
        })
      );
  }

  initTVLifecycleMap(tvResult: TVResult): Observable<TVLifecycleMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(tvResult);
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
              let tvLifecycleFromDBCustom: TV_Life_Cycle = {
                lifecycle_id: 0,
                tv_id: tvLifecycleDTO.mediaId,
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
