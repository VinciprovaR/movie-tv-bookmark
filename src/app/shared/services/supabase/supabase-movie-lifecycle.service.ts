import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import { Movie, MovieResult } from '../../interfaces/media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import { Movie_Life_Cycle } from '../../interfaces/supabase/entities';
import { SupabaseMovieLifecycleDAO } from './supabase-movie-lifecycle.dao';
import {
  lifeCycleId,
  MovieLifecycleMap,
} from '../../interfaces/lifecycle.interface';
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';
import { SupabaseUtilsService } from './supabase-utils.service';

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
    movieList: Movie[] | Movie_Data[]
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

  findMovieByLifecycleId(lifecycleId: lifeCycleId): Observable<Movie_Data[]> {
    return this.supabaseMovieLifecycleDAO.findMovieByLifecycleId(lifecycleId);
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
}
