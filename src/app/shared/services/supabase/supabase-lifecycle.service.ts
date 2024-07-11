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
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';
import { SupabaseTVDataDAO } from './supabase-tv-data.dao';
import { TV_Data } from '../../interfaces/supabase/entities/tv_data.entity.interface';

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
    private supabaseUtilsService: SupabaseUtilsService,
    private supabaseMovieDataDAO: SupabaseMovieDataDAO,
    private supabaseTVDataDAO: SupabaseTVDataDAO
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
      .findLifecycleListByMovieIds([movieLifecycleDTO.mediaDataDTO.mediaId])
      .pipe(
        switchMap((movieLifecycleFromDB: Movie_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              movieLifecycleFromDB,
              movieLifecycleDTO
            )
          ) {
            case 0:
              return this.supabaseMovieDataDAO
                .findByMovieId(movieLifecycleDTO.mediaDataDTO.mediaId)
                .pipe(
                  switchMap((movieDataEntityList: Movie_Data[]) => {
                    if (movieDataEntityList.length === 0) {
                      return this.supabaseMovieDataDAO.createMovieData(
                        movieLifecycleDTO.mediaDataDTO
                      );
                    }
                    return of(movieDataEntityList);
                  }),
                  switchMap((movieDataEntityList: Movie_Data[]) => {
                    return this.supabaseMovieLifecycleDAO.createMovieLifeCycle(
                      movieLifecycleDTO.lifecycleId,
                      movieLifecycleDTO.mediaDataDTO.mediaId,
                      user
                    );
                  })
                );

            case 1:
              return this.supabaseMovieLifecycleDAO.deleteMovieLifeCycle(
                movieLifecycleDTO.mediaDataDTO.mediaId,
                movieLifecycleDTO.lifecycleId
              );
            case 2:
              return this.supabaseMovieLifecycleDAO.updateMovieLifeCycle(
                movieLifecycleDTO.lifecycleId,
                movieLifecycleDTO.mediaDataDTO.mediaId
              );
            case 3:
              let movieLifecycleFromDBCustom: Movie_Life_Cycle = {
                lifecycle_id: 0,
                movie_id: movieLifecycleDTO.mediaDataDTO.mediaId,
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
