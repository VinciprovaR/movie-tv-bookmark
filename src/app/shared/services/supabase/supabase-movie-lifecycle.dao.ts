import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { lifeCycleId } from '../../models/lifecycle.models';
import {
  ACTION_DB_ENUM,
  Movie_Life_Cycle,
} from '../../models/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleDAO {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findLifecycleListByMovieIds(
    movieIdList: number[]
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`movie_life_cycle`)
        .select(`{movie_id, lifecycle_id}`)
        .in(`movie_id`, movieIdList)
    ).pipe(
      map((result: any) => {
        return result.data;
      }),
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createMovieLifeCycle(
    lifecycleId: lifeCycleId,
    mediaId: number,
    user: User | null
  ): Observable<Movie_Life_Cycle[]> {
    let mediaLifecycle: Movie_Life_Cycle = {
      user_id: user?.id,
      lifecycle_id: lifecycleId,
      movie_id: mediaId,
    };

    return from(
      this.supabase
        .from(`movie_life_cycle`)
        .insert<Movie_Life_Cycle>(mediaLifecycle)
        .select()
    ).pipe(
      map((result: any) => {
        return result.data;
      }),
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  updateMovieLifeCycle(
    lifecycleId: lifeCycleId,
    mediaId: number
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`movie_life_cycle`)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`movie_id`, mediaId)
        .select()
    ).pipe(
      map((result: any) => {
        return result.data;
      }),
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  deleteMovieLifeCycle(
    mediaId: number,
    lifecycleId: lifeCycleId
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`movie_life_cycle`)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`movie_id`, mediaId)
        .select()
    ).pipe(
      map((result: any) => {
        result.data[0].actionDb = ACTION_DB_ENUM.ActionDelete;
        return result.data;
      }),
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }
}
