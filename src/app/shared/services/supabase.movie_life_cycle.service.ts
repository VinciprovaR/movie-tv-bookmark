import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../providers';
import {
  Lifecycle_Enum,
  Movie_Life_Cycle,
} from '../models/supabase/movie_life_cycle.model';
import { Observable, from, map, of, switchMap, tap } from 'rxjs';
import { MovieLifecycle, MovieResult, noLifecycle } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMovieLifecycleService {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  initMovieLifecycle(movieResult: MovieResult): Observable<MovieResult> {
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
            mlc.lifecycle_id;
        });
        return movieResult;
      })
    );
  }

  createOrUpdateOrDeleteMovieLifecycle(
    movieLifecycle: MovieLifecycle,
    user: User | null
  ): Observable<Movie_Life_Cycle> {
    return this.findLifecycleListByMovieIds([movieLifecycle.movieId]).pipe(
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
          if (movieLifecycle.lifecycleId > 0) {
            //Case #1 - Movie doesn't have its own lifecycle and lifecycle selected is > 0, must create the lifecycle item
            return this.createMovieLifeCycle(
              movieLifecycle.lifecycleId,
              movieLifecycle.movieId,
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
          if (movieLifecycle.lifecycleId === 0) {
            //Case #2 - Movie has its own lifecycle and lifecycle selected is == 0, must delete the lifecycle item
            return this.deleteMovieLifeCycle(movieLifecycle.movieId).pipe(
              map((deleteLifecycleResult) => {
                deleteLifecycleResult.data[0].lifecycle_id = 0;
                return deleteLifecycleResult.data[0];
              })
            );
          } else if (movieLifecycle.lifecycleId > 0) {
            if (
              movieLifecycle.lifecycleId ===
              movieLifecycleFromDB.data[0].lifecycle_id
            ) {
              /*Case #3 - Movie has its own lifecycle and lifecycle selected is equal to the db lifecycle, no update is needed (this happens when 2 tabs at the same time are open and the movie state is not shared)*/
              return of(null);
            }
            //Case #4 - Movie has its own lifecycle and lifecycle selected is > 0, must update the lifecycle item
            return this.updateMovieLifeCycle(
              movieLifecycle.lifecycleId,
              movieLifecycle.movieId
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

  findLifecycleListByMovieIds(movieIdList: number[]): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .select('{movie_id, lifecycle_id}')
        .in('movie_id', movieIdList)
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  createMovieLifeCycle(
    lifecycleId: number,
    movieId: number,
    user: User | null
  ): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .insert<Movie_Life_Cycle>({
          user_id: user?.id,
          lifecycle_id: lifecycleId,
          movie_id: movieId,
        })
        .select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  updateMovieLifeCycle(lifecycleId: number, movieId: number): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq('movie_id', movieId)
        .select()
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }

  deleteMovieLifeCycle(movieId: number): Observable<any> {
    return from(
      this.supabase
        .from('test_movie_life_cycle')
        .delete()
        .eq('movie_id', movieId)
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
        .from('test_life_cycle_enum')
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
