import { inject, Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  Movie,
  MovieDetail,
  MovieResult,
} from '../../interfaces/TMDB/tmdb-media.interface';
import { MediaLifecycleDTO } from '../../interfaces/supabase/DTO';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { SupabaseMovieLifecycleDAO } from './supabase-movie-lifecycle.dao';
import {
  lifecycleEnum,
  MovieLifecycleMap,
} from '../../interfaces/supabase/supabase-lifecycle.interface';
import { SupabaseMovieDataDAO } from './supabase-movie-data.dao';
import { SupabaseUtilsService } from './supabase-utils.service';

import { crud_operations } from '../../interfaces/supabase/supabase-lifecycle-crud-cases.interface';
import { PayloadMovieLifecycle } from '../../interfaces/store/movie-lifecycle-state.interface';

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

  initMovieLifecycleMapFromMovieResultTMDB(
    movieList: Movie[] | Movie_Data[] | MovieDetail[]
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
            movieResult
          ) as MovieResult;
        })
      );
  }

  findMovieByLifecycleId(
    lifecycleEnum: lifecycleEnum,
    payload: PayloadMovieLifecycle
  ): Observable<Movie_Life_Cycle[] & Movie_Data[]> {
    return this.supabaseMovieLifecycleDAO.findMovieByLifecycleId(
      lifecycleEnum,
      payload
    );
  }

  crudOperationResolver(
    movieLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<crud_operations> {
    return this.supabaseMovieLifecycleDAO
      .findLifecycleListByMovieIds([movieLifecycleDTO.mediaDataDTO.id])
      .pipe(
        map((movieLifecycleFromDB: Movie_Life_Cycle[]) => {
          let operation = this.supabaseUtilsService.checkCase(
            movieLifecycleFromDB,
            movieLifecycleDTO
          );
          if (operation === 'default') {
            throw new Error('Something went wrong. Case default'); //to-do traccia errore su db, anche se impossibile che passi qui
          }
          return operation;
        })
      );
  }
  //to-do udate del movie data?
  updateMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<MovieLifecycleMap> {
    return this.supabaseMovieLifecycleDAO
      .updateMovieLifeCycle(
        movieLifecycleDTO.lifecycleEnum,
        movieLifecycleDTO.mediaDataDTO.id
      )
      .pipe(
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
          );
        })
      );
  }

  deleteMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>
  ): Observable<MovieLifecycleMap> {
    return this.supabaseMovieLifecycleDAO
      .deleteMovieLifeCycle(
        movieLifecycleDTO.mediaDataDTO.id,
        movieLifecycleDTO.lifecycleEnum
      )
      .pipe(
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
          );
        })
      );
  }

  createMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO<Movie | MovieDetail | Movie_Data>,
    user: User
  ): Observable<MovieLifecycleMap> {
    return this.supabaseMovieDataDAO
      .findByMovieId(movieLifecycleDTO.mediaDataDTO.id)
      .pipe(
        switchMap((movieDataEntityList: Movie_Data[]) => {
          if (movieDataEntityList.length === 0) {
            let movieData: Movie_Data =
              this.supabaseUtilsService.movieDataObjFactory(
                movieLifecycleDTO.mediaDataDTO
              );
            return this.supabaseMovieDataDAO.createMovieData(movieData);
          }
          return of(movieDataEntityList);
        }),
        switchMap(() => {
          return this.supabaseMovieLifecycleDAO.createMovieLifeCycle(
            movieLifecycleDTO.lifecycleEnum,
            movieLifecycleDTO.mediaDataDTO.id,
            user
          );
        }),
        map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
          return this.supabaseUtilsService.movieLifecycleMapFactory(
            movieLifecycleEntityList
          );
        })
      );
  }

  unchangedMovieLifecycle(
    movieLifecycleDTO: MediaLifecycleDTO<Movie>,
    user: User
  ): Observable<MovieLifecycleMap> {
    let movieLifecycleFromDBCustom: Movie_Life_Cycle = {
      lifecycle_enum: 'noLifecycle',
      movie_id: movieLifecycleDTO.mediaDataDTO.id,
      user_id: user.id,
    };
    return of([movieLifecycleFromDBCustom]).pipe(
      map((movieLifecycleEntityList: Movie_Life_Cycle[]) => {
        return this.supabaseUtilsService.movieLifecycleMapFactory(
          movieLifecycleEntityList
        );
      })
    );
  }
}
