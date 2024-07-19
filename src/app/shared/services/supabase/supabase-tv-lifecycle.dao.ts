import { inject, Inject, Injectable } from '@angular/core';
import {
  PostgrestSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { TV_Data, TV_Life_Cycle } from '../../interfaces/supabase/entities';
import { lifecycleEnum } from '../../interfaces/supabase/supabase-lifecycle.interface';
import { TV } from '../../interfaces/TMDB/tmdb-media.interface';
import { SortyByConfig } from '../../interfaces/supabase/supabase-filter-config.interface';
import { PayloadMediaLifecycle } from '../../interfaces/store/media-lifecycle-state.interface';

@Injectable({
  providedIn: 'root',
})
export class SupabaseTVLifecycleDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

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

  constructor() {}

  findLifecycleListByTVIds(tvIdList: number[]): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select('*, ...life_cycle_metadata!inner(label)')
        .in(`tv_id`, tvIdList)
    ).pipe(
      map((result: PostgrestSingleResponse<TV_Life_Cycle[]>) => {
        console.log(result);
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }

  findTVByLifecycleId(
    lifecycleEnum: lifecycleEnum,
    payload: PayloadMediaLifecycle
  ): Observable<TV_Life_Cycle[] & TV_Data[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .select(
          '*, ...tv_data!inner(id, poster_path, first_air_date, name, genre_ids)'
        )
        .contains('tv_data.genre_ids', payload.genreIdList)
        .eq(`lifecycle_enum`, lifecycleEnum)
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
    lifecycleEnum: lifecycleEnum,
    tvId: number,
    user: User
  ): Observable<TV_Life_Cycle[]> {
    let tvLifecycle: TV_Life_Cycle = {
      user_id: user?.id,
      lifecycle_enum: lifecycleEnum,
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
    lifecycleEnum: lifecycleEnum,
    tvId: number
  ): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          lifecycle_enum: lifecycleEnum,
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
    lifecycleEnum: lifecycleEnum
  ): Observable<TV_Life_Cycle[]> {
    return from(
      this.supabase
        .from(this.TABLE)
        .update({
          lifecycle_enum: lifecycleEnum,
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
