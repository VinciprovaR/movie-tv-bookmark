import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../providers';
import { Movie_Life_Cycle } from '../models/supabase/movie_life_cycle.model';
import { Observable, from, map } from 'rxjs';
import { MovieResult } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LifecycleService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  mergeMovieLifecycle(movieResult: MovieResult): Observable<MovieResult> {
    let movieIdList: number[] = [];
    let movieIdMapIndex: any = {};
    for (let i = 0; i < movieResult.results.length; i++) {
      movieIdList.push(movieResult.results[i].id);
      movieIdMapIndex[movieResult.results[i].id] = i;
    }
    return this.findLifecycleListByMovieIds(movieIdList).pipe(
      map((movieLifecycle) => {
        // console.log('movieLifecycle', movieLifecycle);
        // console.log('movieIdList', movieIdList);
        // console.log('movieIdMapIndex', movieIdMapIndex);
        movieLifecycle.data.forEach((mlc: any) => {
          movieResult.results[movieIdMapIndex[mlc.movie_id]].lifeCycleId =
            mlc.id;
        });

        return movieResult;
      })
    );
  }

  findLifecycleListByMovieIds(movieIdList: number[]): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .select('{movie_id, lifecycle_id}')
        .in('movie_id', movieIdList)
    );
  }

  createMovieLifeCycle(
    user: User,
    lifecycleId: number,
    movieId: number
  ): Observable<any> {
    return from(
      this.supabase.from('test_movie_life_cycle').insert<Movie_Life_Cycle>({
        // user_id: user.id,
        lifecycle_id: lifecycleId,
        movie_id: movieId,
      })
    );
  }

  updateMovieLifeCycle(
    user: User,
    lifecycleId: number,
    movieId: number
  ): Observable<any> {
    return from(
      this.supabase.from('test_movie_life_cycle').update<Movie_Life_Cycle>({
        // user_id: user.id,
        lifecycle_id: lifecycleId,
        movie_id: movieId,
      })
    );
  }

  deleteMovieLifeCycle(user: User, movieId: number): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .delete()
        .eq('{movie_id, user_id}', [`{${movieId}}`, `{${user.id}}`])
    );
  }
}
