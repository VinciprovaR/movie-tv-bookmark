import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../providers';
import { Movie_Life_Cycle } from '../models/supabase/movie_life_cycle.model';
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
    movieResult: MovieResult,
    user: User | null
  ) {
    return this.findLifecycleListByMovieIds([movieLifecycle.movieId]).pipe(
      switchMap((movieLifecycleFromDB) => {
        if (movieLifecycleFromDB.data.length === 0) {
          if (movieLifecycle.lifecycleId > 0) {
            //movieId in db non presente e lifecycle selezionato > 0, devo creare l'oggetto
            return this.createMovieLifeCycle(
              movieLifecycle.lifecycleId,
              movieLifecycle.movieId,
              user
            ).pipe(
              tap((result: any) => {
                if (result.error) {
                  throw result.error;
                }
              }),
              map((createLifecycleResult) => {
                //modificare movieResult settare il lifecycle del movie al lifecycle selezionato
                return createLifecycleResult.data.length > 0
                  ? createLifecycleResult.data[0]
                  : null;
              })
            );
          }
        } else {
          if (movieLifecycle.lifecycleId === 0) {
            //movieId in db presente e lifecycle selezionato 0, devo eliminare l'oggetto
            return this.deleteMovieLifeCycle(movieLifecycle.movieId).pipe(
              map((deleteLifecycleResult) => {
                //modificare movieResult, settare il lifecycle del movie a 0
                deleteLifecycleResult.data[0].lifecycle_id = 0;
                return deleteLifecycleResult.data[0];
              })
            );
          } else if (movieLifecycle.lifecycleId > 0) {
            //movieId in db presente e lifecycle selezionato > 0, devo modificare l'oggetto
            return this.updateMovieLifeCycle(
              movieLifecycle.lifecycleId,
              movieLifecycle.movieId
            ).pipe(
              tap((result: any) => {
                if (result.error) {
                  throw result.error;
                }
              }),
              map((updateLifecycleResult) => {
                //modificare movieResult, settare il lifecycle del movie  al lifecycle selezionato
                return updateLifecycleResult.data.length > 0
                  ? updateLifecycleResult.data[0]
                  : null;
              })
            );
          }
        }

        //movieId in db non presente e lifecycle selezionato 0, non devo fare nulla
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
}
/*

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

  */
