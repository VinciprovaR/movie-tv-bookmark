import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, catchError, from, map, tap } from 'rxjs';
import { lifeCycleId } from '../../models/lifecycle.models';
import {
  ACTION_DB_ENUM,
  Movie_Life_Cycle,
} from '../../models/supabase/entities';
import { ErrorResponse } from '../../models/error.models';

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
        .select()
        .in(`movie_id`, movieIdList)
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createMovieLifeCycle(
    lifecycleId: lifeCycleId,
    mediaId: number,
    user: User
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`movie_life_cycle`)
        .insert<any>({
          user_id: user.id,
          lifecycle_id: lifecycleId,
          movie_id: mediaId,
        })
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
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
        if (result.error) throw new Error(result.error.message);
        return result.data;
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
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
