import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, tap } from 'rxjs';
import { MediaType } from '../../models/media.models';
import { Movie_Life_Cycle } from '../../models/supabase/entities';
import { TV_Life_Cycle } from '../../models/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseLifecycleDAO {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

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

  findLifecycleOptions(): Observable<any> {
    return from(
      this.supabase
        .from('media_life_cycle_options')
        .select('{id, enum, description, label}')
        .order('order', { ascending: true })
    ).pipe(
      tap((result: any) => {
        if (result.error) {
          throw result.error;
        }
      })
    );
  }
}
