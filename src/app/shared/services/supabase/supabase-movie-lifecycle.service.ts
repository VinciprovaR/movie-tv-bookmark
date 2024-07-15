import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import { Movie, MovieResult } from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { SupabaseMovieLifecycleDAO } from './supabase-movie-lifecycle.dao';
import {
  lifeCycleId,
  MovieLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import { SupabaseUtilsService } from './supabase-utils.service';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleService {
  private readonly supabaseMovieLifecycleDAO = inject(
    SupabaseMovieLifecycleDAO
  );

  private readonly supabaseUtilsService = inject(SupabaseUtilsService);
  private readonly supabaseMovieDataDAO = inject(SupabaseMovieDataDAO);

  constructor() {}

  initMovieLifecycleMapFromMovieResult(
    movieList: Movie_Data[]
  ): Observable<MovieLifecycleMap> {
    let mediaIdList = this.supabaseUtilsService.buildMediaIdListMap(movieList);
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

  initMovieLifecycleMapFromMovieResultSupabase(
    movieLifecycleEntityList:
      | Movie_Life_Cycle[]
      | (Movie_Life_Cycle[] & Movie_Data[])
  ): Observable<MovieLifecycleMap> {
    return of(
      this.supabaseUtilsService.movieLifecycleMapFactory(
        movieLifecycleEntityList
      )
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

  findMovieByLifecycleId(
    lifecycleId: lifeCycleId,
    payload: PayloadMediaLifecycle
  ): Observable<Movie_Life_Cycle[] & Movie_Data[]> {
    return this.supabaseMovieLifecycleDAO.findMovieByLifecycleId(
      lifecycleId,
      payload
    );
  }

  createOrUpdateOrDeleteMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO<Movie>,
    user: User
  ): Observable<{ movieLifecycleMap: MovieLifecycleMap; type: string }> {
    let type: number = 0;

    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds([movieLifecycleDTO.mediaDataDTO.id])
      .pipe(
        switchMap((movieLifecycleFromDB: Movie_Life_Cycle[]) => {
          switch (
            this.supabaseUtilsService.checkCase(
              movieLifecycleFromDB,
              movieLifecycleDTO
            )
          ) {
            case 0:
              type = 0;
              return this.supabaseMovieDataDAO
                .findByMovieId(movieLifecycleDTO.mediaDataDTO.id)
                .pipe(
                  switchMap((movieDataEntityList: Movie_Data[]) => {
                    if (movieDataEntityList.length === 0) {
                      return this.supabaseMovieDataDAO.createMovieData(
                        movieLifecycleDTO.mediaDataDTO
                      );
                    }
                    return of(movieDataEntityList);
                  }),
                  switchMap(() => {
                    return this.supabaseMovieLifecycleDAO.createMovieLifeCycle(
                      movieLifecycleDTO.lifecycleId,
                      movieLifecycleDTO.mediaDataDTO.id,
                      user
                    );
                  })
                );
            case 1:
              type = 1;
              return this.supabaseMovieLifecycleDAO.deleteMovieLifeCycle(
                movieLifecycleDTO.mediaDataDTO.id,
                movieLifecycleDTO.lifecycleId
              );
            case 2:
              type = 2;
              return this.supabaseMovieLifecycleDAO.updateMovieLifeCycle(
                movieLifecycleDTO.lifecycleId,
                movieLifecycleDTO.mediaDataDTO.id
              );
            case 3:
              type = 3;
              let movieLifecycleFromDBCustom: Movie_Life_Cycle = {
                lifecycle_id: 0,
                movie_id: movieLifecycleDTO.mediaDataDTO.id,
                user_id: user.id,
              };
              return of([movieLifecycleFromDBCustom]);
            default:
              type = -99;
              throw new Error('Something went wrong. Case -99'); //to-do traccia errore su db, anche se impossibile che passi qui
          }
        }),
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return {
            movieLifecycleMap:
              this.supabaseUtilsService.movieLifecycleMapFactory(
                movieLifecycleEntityList
              ),
            type: ['create', 'delete', 'update', 'nothing', 'error'][type],
          };
        })
      );
  }
}
