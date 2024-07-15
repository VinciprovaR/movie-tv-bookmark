import { Inject, Injectable } from '@angular/core';
import {
  PostgrestSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { lifeCycleId } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { SortyByConfig } from '../../interfaces/supabase/supabase-filter-config.interface';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleDAO {
  private readonly TABLE = 'tv_life_cycle';

  readonly orderByConfigSupabase: SortyByConfig = {
    'first_air_date.desc': {
      field: 'tv_data(first_air_date)',
      rule: { ascending: false },
    },
    'first_air_date.asc': {
      field: 'tv_data(first_air_date)',
      rule: { ascending: true },
    },
    'name.desc': { field: 'tv_data(name)', rule: { ascending: false } },
    'name.asc': { field: 'tv_data(name)', rule: { ascending: true } },
  };

  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}

  findLifecycleListByTVIds(tvIdList: number[]): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase.from(this.TABLE).select().in(`tv_id`, tvIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  findTVByLifecycleId(
    lifecycleId: lifeCycleId,
    payload: PayloadMediaLifecycle
  ): Observable<TV_Life_Cycle[] & TV_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select(
          '*, ...tv_data!inner(id, poster_path, first_air_date, name, genre_ids)'
        )
        .contains('tv_data.genre_ids', payload.genreIdList)
        .eq(`lifecycle_id`, lifecycleId)
        .order(
          this.orderByConfigSupabase[payload.sortBy].field,
          this.orderByConfigSupabase[payload.sortBy].rule
        )
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[] & TV_Data[]>) => {
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
      this.supabase.from(this.TABLE).insert<TV_Life_Cycle>(tvLifecycle).select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[]>) => {
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
        .from(this.TABLE)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[]>) => {
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
        .from(this.TABLE)
        .update({
          lifecycle_id: lifecycleId,
        })
        .eq(`tv_id`, tvId)
        .select()
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[]>) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
