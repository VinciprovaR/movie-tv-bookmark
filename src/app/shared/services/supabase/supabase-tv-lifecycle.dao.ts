import { Inject, Injectable } from '@angular/core';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { ACTION_DB_ENUM, TV_Life_Cycle } from '../../models/supabase/entities';
import { lifeCycleId } from '../../models/lifecycle.models';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleDAO {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findLifecycleListByTVIds(tvIdList: number[]): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`tv_life_cycle`)
        .select(`{tv_id, lifecycle_id}`)
        .in(`tv_id`, tvIdList)
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  //to-do user null? non possibile
  //to-do tipizzare ritorni
  createTVLifeCycle(
    lifecycleId: lifeCycleId,
    tvId: number,
    user: User
  ): Observable<TV_Life_Cycle[]> {
    let tvLifecycle: TV_Life_Cycle = {
      user_id: user?.id,
      lifecycle_id: lifecycleId,
      tv_id: tvId,
    };

    return from(
      this.supabase
        .from(`tv_life_cycle`)
        .insert<TV_Life_Cycle>(tvLifecycle)
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  updateTVLifeCycle(
    lifecycleId: lifeCycleId,
    tvId: number
  ): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`tv_life_cycle`)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  deleteTVLifeCycle(
    tvId: number,
    lifecycleId: lifeCycleId
  ): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(`tv_life_cycle`)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
