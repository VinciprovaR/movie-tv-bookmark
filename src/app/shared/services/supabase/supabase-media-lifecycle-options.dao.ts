import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { Media_Lifecycle_Options } from '../../interfaces/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMediaLifecycleOptionsDAO {
  constructor(@Inject(SUPABASE_CLIENT) private supabase: SupabaseClient) {}
  findLifecycleOptions(): Observable<Media_Lifecycle_Options[]> {
    return from(
      this.supabase
        .from('media_life_cycle_options')
        .select('{id, enum, description, label}')
        .order('order', { ascending: true })
    ).pipe(
      map((result: any) => {
        if (result.error) throw new Error(result.error.message);
        return result.data;
      })
    );
  }
}
