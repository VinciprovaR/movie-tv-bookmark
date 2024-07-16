import { Inject, Injectable } from '@angular/core';
import {
  PostgrestSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map } from 'rxjs';
import { lifeCycleId } from '../../interfaces/supabase/supabase-lifecycle.interface';
import {
  Movie_Data,
  Movie_Life_Cycle,
} from '../../interfaces/supabase/entities';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';
import { SortyByConfig } from '../../interfaces/supabase/supabase-filter-config.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleDAO {
  readonly orderByConfigSupabase: SortyByConfig = {
    'primary_release_date.desc': {
      field: 'movie_data(release_date)',
      rule: { ascending: false },
    },
    'primary_release_date.asc': {
      field: 'movie_data(release_date)',
      rule: { ascending: true },
    },
    'title.desc': { field: 'movie_data(title)', rule: { ascending: false } },
    'title.asc': { field: 'movie_data(title)', rule: { ascending: true } },
  };

  private readonly TABLE = 'movie_life_cycle';

  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findLifecycleListByMovieIds(
    movieIdList: number[]
  ): Observable<Movie_Life_Cycle[]> {
    return from(
      this.supabase.from(this.TABLE).select().in(`movie_id`, movieIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<Movie_Life_Cycle[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  findMovieByLifecycleId(
    lifecycleId: lifeCycleId,
    payload: PayloadMediaLifecycle
  ): Observable<Movie_Life_Cycle[] & Movie_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select(
          '*, ...movie_data!inner(id, poster_path, release_date, title, genre_ids)'
        )
        .contains('movie_data.genre_ids', payload.genreIdList)
        .eq(`lifecycle_id`, lifecycleId)
        .order(
          this.orderByConfigSupabase[payload.sortBy].field,
          this.orderByConfigSupabase[payload.sortBy].rule
        )
    ).pipe(
      map(
        (
          result: PostgrestSingleResponse<Movie_Life_Cycle[] & Movie_Data[]>
        ) => {
          if (result.error) throw new Error(result.error.message);
          return result.data;
        }
      )
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
      map((result: PostgrestSingleResponse<Movie_Life_Cycle[]>) => {
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
      map((result: PostgrestSingleResponse<Movie_Life_Cycle[]>) => {
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
      map((result: PostgrestSingleResponse<Movie_Life_Cycle[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
