import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Observable, map, switchMap, of } from 'rxjs';
import {
  MovieResult,
  TVResult,
  MediaType,
  Movie,
  TV,
} from '../../models/media.models';
import {
  MediaLifecycleDTO,
  SelectLifecycleDTO,
} from '../../models/supabase/DTO';
import {
  Movie_Life_Cycle,
  TV_Life_Cycle,
} from '../../models/supabase/entities';
import { SupabaseLifecycleDAO } from './supabase-lifecycle.dao';
import { SupabaseDecouplingService } from './supabase-decoupling.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseLifecycleService {
  lifeCycleOptions$!: Observable<SelectLifecycleDTO[]>;

  constructor(
    private supabaseLifecycleDAO: SupabaseLifecycleDAO,
    private supabaseDecouplingService: SupabaseDecouplingService
  ) {
    this.retriveLifecycleOptions();
  }

  retriveLifecycleOptions() {
    this.lifeCycleOptions$ = this.supabaseLifecycleDAO
      .findLifecycleOptions()
      .pipe(
        map((lifecycleOptionsResult) => {
          return this.supabaseDecouplingService.fromLifecycleEntity(
            lifecycleOptionsResult.data
          );
        })
      );
  }

  findLifecycleListByMovieIds(
    movieResult: MovieResult
  ): Observable<MovieResult> {
    let mediaType: MediaType = 'movie';

    let { mediaIdList, mediaIdMapIndex } =
      this.buildMediaIdListMap(movieResult);

    return this.supabaseLifecycleDAO
      .findLifecycleListByMediaIds(mediaIdList, mediaType)
      .pipe(
        map((entityMovieLifecycle) => {
          return this.supabaseDecouplingService.injectMovieLifecycle(
            entityMovieLifecycle.data,
            movieResult,
            mediaType,
            mediaIdMapIndex
          );
        })
      );
  }

  findLifecycleListByTVIds(tvResult: TVResult): Observable<TVResult> {
    let mediaType: MediaType = 'tv';
    let { mediaIdList, mediaIdMapIndex } = this.buildMediaIdListMap(tvResult);

    return this.supabaseLifecycleDAO
      .findLifecycleListByMediaIds(mediaIdList, mediaType)
      .pipe(
        map((entityTVLifecycle) => {
          return this.supabaseDecouplingService.injectTVLifecycle(
            entityTVLifecycle.data,
            tvResult,
            mediaType,
            mediaIdMapIndex
          );
        })
      );
  }

  buildMediaIdListMap(mediaResult: MovieResult | TVResult): {
    mediaIdList: number[];
    mediaIdMapIndex: { [key: string]: number };
  } {
    let mediaIdList: number[] = [];
    let mediaIdMapIndex: { [key: string]: number } = {};
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
      mediaIdMapIndex[mediaResult.results[i].id] = i;
    }

    return { mediaIdList, mediaIdMapIndex };
  }

  createOrUpdateOrDeleteMovieLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO,
    user: User | null,
    movieResultState: Movie
  ): Observable<Movie> {
    return this.createOrUpdateOrDeleteMediaLifecycle(
      mediaLifecycleDTO,
      'movie',
      user
    ).pipe(
      map((entityMovieLifecycle) => {
        entityMovieLifecycle = entityMovieLifecycle as Movie_Life_Cycle;
        return this.supabaseDecouplingService.injectUpdatedMovieLifecycle(
          entityMovieLifecycle,
          movieResultState
        );
      })
    );
  }

  createOrUpdateOrDeleteTVLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO,
    user: User | null,
    tvResultState: TV
  ): Observable<TV> {
    return this.createOrUpdateOrDeleteMediaLifecycle(
      mediaLifecycleDTO,
      'tv',
      user
    ).pipe(
      map((entityTVLifecycle) => {
        entityTVLifecycle = entityTVLifecycle as TV_Life_Cycle;
        return this.supabaseDecouplingService.injectUpdatedTVLifecycle(
          entityTVLifecycle,
          tvResultState
        );
      })
    );
  }

  private createOrUpdateOrDeleteMediaLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO,
    mediaType: MediaType,
    user: User | null
  ): Observable<Movie_Life_Cycle | TV_Life_Cycle> {
    return this.supabaseLifecycleDAO
      .findLifecycleListByMediaIds([mediaLifecycleDTO.mediaId], mediaType)
      .pipe(
        switchMap((movieLifecycleFromDB) => {
          if (movieLifecycleFromDB.data.length > 1) {
            /*Case #0 - more than one same movie lifecycle with the same user, shouldn't be possible. 
          E.G.: 2 copies of "Avengers: Infinity War" in the lifecycle for the same user, one with lifecycle id to 1 and the other with 3. The same movie for a specific user could have only one row with the lifecycle id assigned*/
            // console.error(
            //   'only one lifecycle per movie and per user, more than one is wrong'
            // );
            // throw new Error(
            //   'only one lifecycle per movie and per user, more than one is wrong'
            // );
          }

          if (movieLifecycleFromDB.data.length === 0) {
            if (mediaLifecycleDTO.lifecycleId > 0) {
              //Case #1 - Movie doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
              return this.supabaseLifecycleDAO
                .createMediaLifeCycle(
                  mediaLifecycleDTO.lifecycleId,
                  mediaLifecycleDTO.mediaId,
                  mediaType,
                  user
                )
                .pipe(
                  map((createLifecycleResult) => {
                    return createLifecycleResult.data.length > 0
                      ? createLifecycleResult.data[0]
                      : null;
                  })
                );
            }
          } else {
            if (mediaLifecycleDTO.lifecycleId === 0) {
              //Case #2 - Movie has its own lifecycle and lifecycle selected is == 0, must delete the lifecycle item
              return this.supabaseLifecycleDAO
                .deleteMediaLifeCycle(mediaLifecycleDTO.mediaId, mediaType)
                .pipe(
                  map((deleteLifecycleResult) => {
                    deleteLifecycleResult.data[0].lifecycle_id = 0;
                    return deleteLifecycleResult.data[0];
                  })
                );
            } else if (mediaLifecycleDTO.lifecycleId > 0) {
              if (
                mediaLifecycleDTO.lifecycleId ===
                movieLifecycleFromDB.data[0].lifecycle_id
              ) {
                /*Case #3 - Movie has its own lifecycle and lifecycle selected is equal to the db lifecycle, no update is needed (this happens when 2 tabs at the same time are open and the movie state is not shared)*/
                return of(null);
              }
              //Case #4 - Movie has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item
              return this.supabaseLifecycleDAO
                .updateMediaLifeCycle(
                  mediaLifecycleDTO.lifecycleId,
                  mediaType,
                  mediaLifecycleDTO.mediaId
                )
                .pipe(
                  map((updateLifecycleResult) => {
                    return updateLifecycleResult.data.length > 0
                      ? updateLifecycleResult.data[0]
                      : null;
                  })
                );
            }
          }

          /*Case #5 - Movie doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing (this happens when 2 tabs at the same time are opened and the 
        movie state is not shared)
        */
          return of(null);
        })
      );
  }
}
