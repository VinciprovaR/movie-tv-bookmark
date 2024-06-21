import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../providers';

import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { MovieResult, TVResult, noLifecycle } from '../models';
import { MediaType } from '../models/media.models';
import { Movie_Life_Cycle } from '../models/supabase/entities/movie_life_cycle.entity';
import { MediaLifecycleDTO } from '../models/supabase/DTO/media-lifecycle.DTO';
import { TV_Life_Cycle } from '../models/supabase/entities/tv_life_cycle.entity';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  initMediaLifecycle(
    mediaResult: MovieResult | TVResult,
    mediaType: MediaType
  ): Observable<MovieResult | TVResult> {
    let mediaIdList: number[] = [];
    let mediaIdMapIndex: any = {};
    for (let i = 0; i < mediaResult.results.length; i++) {
      mediaIdList.push(mediaResult.results[i].id);
      mediaIdMapIndex[mediaResult.results[i].id] = i;
    }
    return this.findLifecycleListByMediaIds(mediaIdList, mediaType).pipe(
      map((mediaLifecycleSupabase) => {
        // console.log('movieLifecycle', movieLifecycle);
        // console.log('movieIdList', movieIdList);
        // console.log('movieIdMapIndex', movieIdMapIndex);
        mediaLifecycleSupabase.data.forEach((mlc: any) => {
          mediaResult.results[mediaIdMapIndex[mlc[`${mediaType}_id`]]][
            'lifecycleId'
          ] = mlc.lifecycle_id;
        });
        return mediaResult;
      })
    );
  }

  createOrUpdateOrDeleteMediaLifecycle(
    mediaLifecycleDTO: MediaLifecycleDTO,
    mediaType: MediaType,
    user: User | null
  ): Observable<Movie_Life_Cycle | TV_Life_Cycle> {
    return this.findLifecycleListByMediaIds(
      [mediaLifecycleDTO.mediaId],
      mediaType
    ).pipe(
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
            return this.createMediaLifeCycle(
              mediaLifecycleDTO.lifecycleId,
              mediaLifecycleDTO.mediaId,
              mediaType,
              user
            ).pipe(
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
            return this.deleteMediaLifeCycle(
              mediaLifecycleDTO.mediaId,
              mediaType
            ).pipe(
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
            return this.updateMediaLifeCycle(
              mediaLifecycleDTO.lifecycleId,
              mediaType,
              mediaLifecycleDTO.mediaId
            ).pipe(
              map((updateLifecycleResult) => {
                return updateLifecycleResult.data.length > 0
                  ? updateLifecycleResult.data[0]
                  : null;
              })
            );
          }
        }

        /*Case #5 - Movie doesn't have its own lifecycle and lifecycle selected is == 0, must do nothing (this happens when 2 tabs at the same time are open and the 
        movie state is not shared)
        */
        return of(null);
      })
    );
  }

  findLifecycleListByMediaIds(
    mediaIdList: number[],
    mediaType: MediaType
  ): Observable<any> {
    return from(
      this.supabase
        .from(`${mediaType}_life_cycle`)
        .select(`{${mediaType}_id, lifecycle_id}`)
        .in(`${mediaType}_id`, mediaIdList)
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  createMediaLifeCycle(
    lifecycleId: number,
    mediaId: number,
    mediaType: MediaType,
    user: User | null
  ): Observable<any> {
    let mediaLifecycle: Movie_Life_Cycle | TV_Life_Cycle;

    if (mediaType === 'movie') {
      mediaLifecycle = {
        user_id: user?.id,
        lifecycle_id: lifecycleId,
        movie_id: mediaId,
      };
    } else {
      mediaLifecycle = {
        user_id: user?.id,
        lifecycle_id: lifecycleId,
        tv_id: mediaId,
      };
    }

    return from(
      this.supabase
        .from(`${mediaType}_life_cycle`)
        .insert<Movie_Life_Cycle | TV_Life_Cycle>(mediaLifecycle)
        .select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  updateMediaLifeCycle(
    lifecycleId: number,
    mediaType: MediaType,
    mediaId: number
  ): Observable<any> {
    return from(
      this.supabase
        .from(`${mediaType}_life_cycle`)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`${mediaType}_id`, mediaId)
        .select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  deleteMediaLifeCycle(mediaId: number, mediaType: MediaType): Observable<any> {
    return from(
      this.supabase
        .from(`${mediaType}_life_cycle`)
        .delete()
        .eq(`${mediaType}_id`, mediaId)
        .select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  findLifecycleEnum(): Observable<any> {
    return from(
      this.supabase
        .from('media_life_cycle_enum')
        .select('{id, enum, description, label}')
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }
}
