import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, catchError, from, map, tap } from 'rxjs';
import { lifeCycleId } from '../../interfaces/lifecycle.interface';
import { Movie_Life_Cycle } from '../../interfaces/supabase/entities';
import { ErrorResponse } from '../../interfaces/error.interface';
import { Movie_Data } from '../../interfaces/supabase/entities/movie_data.entity.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleDAO {
  private readonly TABLE = 'movie_life_cycle';

  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findLifecycleListByMovieIds(
    movieIdList: number[]
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase.from(this.TABLE).select('*').in(`movie_id`, movieIdList)
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  findMovieByLifecycleId(lifecycleId: lifeCycleId): Observable<Movie_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('movie_data(id, poster_path, release_date, title)')
        .eq(`lifecycle_id`, lifecycleId)
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        //to-do capire come renderlo veloce e non cosi
        return result.data.map((result: { movie_data: Movie_Data }) => {
          return result.movie_data;
        });
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createMovieLifeCycle(
    lifecycleId: lifeCycleId,
    movieId: number,
    user: User
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .insert<any>({
          user_id: user.id,
          lifecycle_id: lifecycleId,
          movie_id: movieId,
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
        .from(this.TABLE)
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
        .from(this.TABLE)
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
