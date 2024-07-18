import { inject, Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../../providers';
import { Observable, from, map, tap } from 'rxjs';
import { Lifecycle_Metadata } from '../../interfaces/supabase/entities';

@Injectable({
  providedIn: 'root',
})
export class SupabaseMediaLifecycleMetadataDAO {
  private readonly supabase = inject(SUPABASE_CLIENT);

  constructor() {}

  findLifecycleMetadata(): Observable<Lifecycle_Metadata[]> {
    return from(
      this.supabase
        .from('life_cycle_metadata')
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
